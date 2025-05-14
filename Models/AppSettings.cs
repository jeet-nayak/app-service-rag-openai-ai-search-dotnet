namespace BlazorAISearch.Models;

/// <summary>
/// Configuration settings for Azure OpenAI and Azure AI Search integration
/// </summary>
public class AppSettings
{
    // Azure OpenAI settings for connecting to the API and GPT model
    public string? OpenAIEndpoint { get; set; }
    public string? OpenAIGptDeployment { get; set; }
    public string? OpenAIEmbeddingDeployment { get; set; }
    public string? SystemPrompt { get; set; } = "You are an AI assistant that helps people find information.";
    
    // Azure AI Search settings for knowledge retrieval
    public string? SearchServiceUrl { get; set; }
    public string? SearchIndexName { get; set; }
}