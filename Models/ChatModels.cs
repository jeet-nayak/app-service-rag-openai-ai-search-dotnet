namespace BlazorAISearch.Models;
using OpenAI.Chat;
using Azure.AI.OpenAI.Chat;
using System.Collections.Generic;

#pragma warning disable AOAI001 // Type is for evaluation purposes only

/// <summary>
/// Represents a response from the RAG-enhanced chat completion API
/// </summary>
public class ChatResponse
{
    /// <summary>Content parts from the AI response</summary>
    public IReadOnlyList<ChatMessageContentPart>? Content { get; set; }
    
    /// <summary>Citations from Azure AI Search that ground the response</summary>
    public IReadOnlyList<ChatCitation>? Citations { get; set; }
    
    /// <summary>Error message if the request failed</summary>
    public string? Error { get; set; }
}

/// <summary>
/// Extended assistant message that includes citations from retrieved documents
/// </summary>
public class AssistantMessageWithCitations : AssistantChatMessage
{
    /// <summary>Citations from documents that support the AI's response</summary>
    public IReadOnlyList<ChatCitation>? Citations { get; private set; }

    public AssistantMessageWithCitations(IReadOnlyList<ChatMessageContentPart> content, IReadOnlyList<ChatCitation>? citations = null) 
        : base(content)
    {
        Citations = citations;
    }
}
