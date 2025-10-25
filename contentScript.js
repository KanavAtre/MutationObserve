//Responsible for data collection from the webpage 
(() => {
    let currPost = "";
    
    // Function to analyze a post for misinformation
    const analyzePost = (postId, subreddit) => {
        console.log(`Analyzing post ${postId} from r/${subreddit}`);
        // TODO: Implement actual analysis logic
        
        // For now, return a mock credibility score
        return {
            score: Math.floor(Math.random() * 10) + 1, // Random score between 1-10
            flags: ["Unverified source", "Disputed claims"]
        };
    };
    
    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const {postId, subreddit, type} = obj;
        
        if (type === "TOP") {
            currPost = postId;
            if (postId) {
                // Perform analysis on the post
                const analysis = analyzePost(postId, subreddit);
                
                // Send the analysis back to the background script
                chrome.runtime.sendMessage({
                    content: "postAnalyzed",
                    postId: postId,
                    subreddit: subreddit,
                    analysis: analysis
                });
            }
        }
        
        // Return true to indicate we'll respond asynchronously
        return true;
    });
})();
