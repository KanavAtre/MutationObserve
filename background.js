// Runs outside the webpage
// Acts as the brain and message hub

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url && tab.url.includes("reddit.com/")) {
        // Parse URL for single post pages: reddit.com/r/subreddit/comments/post_id/post_title/
        const urlParts = tab.url.split('/');
        let postId = null;
        let subreddit = null;
        
        const commentsIndex = urlParts.indexOf("comments");
        if (commentsIndex !== -1 && commentsIndex + 1 < urlParts.length) {
            postId = urlParts[commentsIndex + 1];
            subreddit = urlParts[commentsIndex - 1];
        }
        
        chrome.tabs.sendMessage(tabId, {
            type: "TOP",
            postId: postId,
            subreddit: subreddit
        });
    }
});

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
    // Handle messages from content script
    if (request.content === "postAnalyzed") {
        // Cache
        chrome.storage.local.set({
            lastAnalysis: {
                postId: request.postId,
                subreddit: request.subreddit,
                title: request.analysis.title,
                score: request.analysis.score,
                flags: request.analysis.flags,
                timestamp: Date.now()
            }
        });
    }
    
    if (request.action === "checkPost") {
        // Trigger for curr post
        chrome.tabs.sendMessage(request.tabId, { type: "ANALYZE_NOW" });
        
        chrome.storage.local.get('lastAnalysis', function(data) {
            if (data.lastAnalysis) {
                sendResponse({ 
                    score: data.lastAnalysis.score,
                    flags: data.lastAnalysis.flags
                });
            } else {
                sendResponse({ error: "No analysis available" });
            }
        });
        
        return true;
    }
});
