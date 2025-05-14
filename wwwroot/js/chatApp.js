// Client-side support for the RAG-powered chat application
// Handles citation display and interaction for retrieved knowledge

// Store reference to active citation popup
let activePopup = null;

// Scrolls the chat container to show the latest messages
window.scrollChatToBottom = function() {
    const chatContainer = document.getElementById('chat-container');
    if (chatContainer) {
        setTimeout(() => {
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }, 100);
    }
};

// Handles citation link clicks and displays the relevant knowledge source
window.handleCitationClick = function(index, citationDataJson) {
    try {
        // Parse the citation data from JSON
        let citation;
        if (typeof citationDataJson === 'string') {
            try {
                // Decode HTML entities in the JSON string
                const decodedJson = citationDataJson.includes('&quot;') ? 
                    citationDataJson.replace(/&quot;/g, '"').replace(/&amp;/g, '&') : 
                    citationDataJson;
                
                citation = JSON.parse(decodedJson);
            } catch (parseError) {
                console.error("Error parsing citation JSON:", parseError);
                return;
            }
        } else {
            citation = citationDataJson;
        }
        
        // Validate citation object
        if (!citation) {
            console.error("Citation object is undefined or null");
            return;
        }

        // Show the citation popup with the retrieved content
        window.showCitationPopup(index, citation);
    } catch (error) {
        console.error("Error handling citation click:", error);
    }
};

// Displays the citation content in a popup with source information
window.showCitationPopup = function(index, citation) {
    try {
        // Validate citation data
        if (!citation || typeof citation !== 'object') {
            console.error("Invalid citation data");
            return;
        }
        
        // Close any existing popup
        if (activePopup) {
            activePopup.remove();
            activePopup = null;
            
            const overlay = document.querySelector('.citation-overlay');
            if (overlay) {
                overlay.classList.remove('show');
            }
        }
        
        // Create or get the background overlay
        let overlay = document.querySelector('.citation-overlay');
        if (!overlay) {
            overlay = document.createElement('div');
            overlay.className = 'citation-overlay';
            document.body.appendChild(overlay);
            
            overlay.addEventListener('click', function(event) {
                if (event.target === overlay) {
                    window.hideCitationPopup();
                }
            });
        }
        
        // Create popup element with Bootstrap classes
        const popup = document.createElement('div');
        popup.className = 'citation-popup';
        popup.id = `citation-popup-${index}`;
        
        // Ensure the popup is in front of the overlay
        popup.style.zIndex = '1050';
        popup.style.position = 'fixed';
        popup.style.top = '50%';
        popup.style.left = '50%';
        popup.style.transform = 'translate(-50%, -50%)';
        popup.style.width = '80%';
        popup.style.maxWidth = '900px';
        
        // Create the popup with Bootstrap styling
        popup.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Citation ${index}</h5>
                    <button type="button" class="btn-close" aria-label="Close" onclick="window.hideCitationPopup()"></button>
                </div>
                <div class="modal-body">
                    ${citation.title ? `<h6>${citation.title}</h6>` : ''}
                    ${citation.content ? `<div class="p-3 bg-light border rounded">${citation.content}</div>` : '<p class="text-muted">No content available</p>'}
                </div>
            </div>
        `;
        
        // Add popup to document
        document.body.appendChild(popup);
        
        // Display popup and overlay using Bootstrap's show class
        overlay.classList.add('show');
        
        // Store active popup
        activePopup = popup;
    } catch (error) {
        console.error("Error showing citation popup:", error);
    }
};

// Function to hide citation popup
window.hideCitationPopup = function() {
    if (activePopup) {
        activePopup.remove();
        activePopup = null;
        
        const overlay = document.querySelector('.citation-overlay');
        if (overlay) {
            overlay.classList.remove('show');
        }
    }
};

// Initialize when the document is ready
document.addEventListener('DOMContentLoaded', function() {
    // Close popup when ESC key is pressed
    document.addEventListener('keyup', function(e) {
        if (e.key === 'Escape') {
            window.hideCitationPopup();
        }
    });
    
    // Set up citation click handlers
    document.addEventListener('click', function(e) {
        if (e.target && e.target.classList && 
            (e.target.classList.contains('citation-superscript') || 
             e.target.classList.contains('badge'))) {
            const index = e.target.dataset.citationIndex;
            const citationData = e.target.dataset.citationData;
            if (index && citationData) {
                window.handleCitationClick(index, citationData);
                e.preventDefault();
            }
        }
    });
});