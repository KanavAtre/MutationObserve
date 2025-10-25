// Runs outside the webpage
// Acts as the brain and message hub

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (tab.url && tab.url.includes("reddit.com/")) {
        // URL: reddit.com/r/subreddit/comments/post_id/post_title/
        const urlParts = tab.url.split('/');
        let postId = null;
        let subreddit = null;
        
        // get post_id
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
        console.log(`Analysis received for post ${request.postId} from r/${request.subreddit}`);
        console.log(`Score: ${request.analysis.score}/10`);
        console.log(`Flags: ${request.analysis.flags.join(', ')}`);
        
        // Store the analysis result for later use
        chrome.storage.local.set({
            lastAnalysis: {
                postId: request.postId,
                subreddit: request.subreddit,
                score: request.analysis.score,
                flags: request.analysis.flags,
                timestamp: Date.now()
            }
        });
    }
    
    // Handle messages from popup
    if (request.action === "checkPost") {
        // Trigger content script to analyze the current post
        chrome.tabs.sendMessage(request.tabId, { type: "ANALYZE_NOW" });
        
        // Get the latest analysis result
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
        
        // Return true to indicate we'll respond asynchronously
        return true;
    }
});
