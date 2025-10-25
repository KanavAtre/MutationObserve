//Responsible for data collection from the webpage 
(() => {
    let currPost = "";    
    const analyzePost = (postId, subreddit) => {
        console.log(`Analyzing post ${postId} from r/${subreddit}`);
        // TODO: The agents logic would fit in here somehow     
        return {
            score: Math.floor(Math.random() * 10) + 1, // Random score between 1-10
            flags: ["Unverified source", "Disputed claims"]
        };
    };
    
    // Listen for messages from the background script
    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const {postId, subreddit, type} = obj;

        const newPostSeen = () => {
            const credibilityButtonExists = document.getElementsByClassName("credi-btn")[0];

            if (!credibilityButtonExists){
                const crediButton = document.createElement("img");

                crediButton.src = chrome.runtime.getURL("assets/check.png");
                crediButton.className = "a" + "credi-btn"; // TODO here
                crediButton.title = "Click to credify this post";
            };
        };
        
        if (type === "TOP") {
            newPostSeen();
            currPost = postId;
            if (postId) {
                // Find the post element in the DOM and inject the button
                const postElement = findPostElementById(postId);
                if (postElement) {
                    injectButton(postElement, postId);
                }
                
                const analysis = analyzePost(postId, subreddit);
                // Send back to background script
                chrome.runtime.sendMessage({
                    content: "postAnalyzed",
                    postId: postId,
                    subreddit: subreddit,
                    analysis: analysis
                });
            }
        }
        
        // Return true
        return true;
    });

    function createCredibilityButton(postId) {
        const button = document.createElement('button');
        button.className = 'credi-btn';
        button.textContent = 'Click to credify this post';
        button.dataset.postId = postId;
        
        // Reddit UI matching
        button.style.cssText = `
            padding: 4px 8px;
            border-radius: 4px;
            background: transparent;
            border: 1px solid #ccc;
            cursor: pointer;
            font-size: 12px;
            color: #1c1c1c;
        `;
        
        return button;
    }

    function findActionBar(postElement) {
        // Multiple layers of selections
        return postElement.querySelector('[data-testid="post-actions"]') ||
               postElement.querySelector('.action-bar') ||
               postElement.querySelector('[class*="action"]');
    }

    function findPostElementById(postId) {
        // Find post element by looking for a link containing the post ID in the comments URL
        const links = document.querySelectorAll('a[href*="/comments/"]');
        for (let link of links) {
            if (link.href.includes(`/comments/${postId}/`)) {
                // Traverse up to find the post container
                let element = link;
                while (element && element.tagName !== 'BODY') {
                    // Reddit post containers are usually articles or divs with specific attributes
                    if (element.tagName === 'ARTICLE' || 
                        element.hasAttribute('data-testid') || 
                        element.classList.contains('Post')) {
                        return element;
                    }
                    element = element.parentElement;
                }
            }
        }
        return null;
    }

    function injectButton(postElement, postId) {
        const actionBar = findActionBar(postElement);
        console.log(actionBar);
        if (actionBar) {
            const button = createCredibilityButton(postId);
            actionBar.appendChild(button);             
            button.addEventListener('click', () => handleButtonClick(postId));
        }
    }

    function handleButtonClick(postId) {
        console.log(`Credibility check requested for post: ${postId}`);
    }

})();
