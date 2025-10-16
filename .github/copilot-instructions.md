## Purpose

Quick, actionable notes to help an AI coding agent be productive editing this Blazor RAG sample.
Target audience: code-completion agents and assistants working on features, fixes, or infra for this repo.

## Big picture (what this app is)
- Blazor Server app (see `Program.cs` + `BlazorAISearch.csproj`) that provides a chat UI (`Components/Pages/Index.razor`).
- Core RAG service: `Services/RagChatService.cs` — it composes Azure AI Search results with Azure OpenAI chat completions.
- Runtime configuration is read into `Models/AppSettings.cs` via `builder.Configuration.Bind(appSettings)` in `Program.cs`.
- Search content lives under `sample-docs/` and is expected to be indexed into Azure AI Search (infra in `infra/main.bicep`).

## Key integration points and patterns
- Managed identity + DefaultAzureCredential is used for service-to-service auth. Look at `RagChatService` constructor (uses `DefaultAzureCredential`).
- The chat completion call configures an `AzureSearchChatDataSource` with:
  - `QueryType = DataSourceQueryType.VectorSemanticHybrid` (hybrid vector + keyword + semantic rerank)
  - `VectorizationSource = DataSourceVectorizer.FromDeploymentName(...)` that references an embedding deployment name
  See `Services/RagChatService.cs` for precise usage.
- Conversation trimming: the service keeps only the most recent messages (limits history to avoid token overrun). Follow this pattern for new chat-related code.
- Settings required at runtime: OpenAIEndpoint, OpenAIGptDeployment, OpenAIEmbeddingDeployment, SearchServiceUrl, SearchIndexName, SystemPrompt. These map to `AppSettings` properties.

## Files you will edit most often
- `Services/RagChatService.cs` — RAG logic, error handling, and Azure SDK usage.
- `Components/Pages/Index.razor` — UI flow, how messages are rendered, and citation formatting.
- `Models/AppSettings.cs` & `appsettings*.json` — configuration shape and dev/runtime values.
- `infra/main.bicep` — provisioning and RBAC wiring for App Service, OpenAI, Search, Storage. Use this when changing infrastructure or managed identity mappings.

## Developer workflows (commands and tips)
- Build and run locally (uses .NET 8):
  ```bash
  dotnet restore
  dotnet build
  dotnet run --project BlazorAISearch.csproj
  ```
- Publish for App Service deployment:
  ```bash
  dotnet publish -c Release -o ./publish BlazorAISearch.csproj
  ```
- Deploy infra (example pattern): use the Bicep template in `infra/main.bicep` with `az deployment group create --resource-group <rg> --template-file infra/main.bicep --parameters environmentName=<env> resourceToken=<token>`
  (Adjust parameters; outputs include `APPSERVICE_URI`, `OPENAI_ENDPOINT`, and `SEARCH_SERVICE_ENDPOINT`.)

## Code and convention notes for contributors
- Keep server-side responsibilities in `RagChatService` — UI code in `Index.razor` should remain presentation-only and call the service via DI.
- Prefer using the AppSettings model instead of reading raw environment variables in multiple places. `Program.cs` binds configuration to `AppSettings` and registers it as a singleton.
- When changing model or deployment names, update both `infra/main.bicep` and default config (`appsettings.json`) so local and deployed environments match.
- Logging is configured in `Program.cs` to use Console + Debug at Debug level for development. Use structured logging in services (ILogger<T>) to preserve this behavior.

## Small gotchas discovered in code
- Null/argument checks: `RagChatService` uses `ArgumentNullException.ThrowIfNull(...)` for critical settings — ensure tests/mocks provide these values.
- Token/length safety: the service trims conversation history to avoid token limits; extend this logic cautiously and keep tests for long conversations.
- Citations: markup is injected in `Index.razor` via `FormatWithCitations(...)`. When changing citation formats, update the JS helper in `wwwroot/js/chatApp.js` (if modifying client interop).

## Where to look for examples
- RAG flow: `Services/RagChatService.cs` (chat + data source setup).
- UI and citation rendering: `Components/Pages/Index.razor` and `wwwroot/js/chatApp.js`.
- Infra and RBAC wiring: `infra/main.bicep` (role assignment patterns for OpenAI <-> Search <-> AppService).

If any section above is unclear or you'd like more examples (unit tests, local mocks for Azure services, or a sample `appsettings.Development.json`), tell me which part to expand and I will iterate.
