// Responsible for data collection from the webpage
(() => {
    let currPost = "";
    const processedPosts = new Set(); // Track posts we've already processed

    const analyzePost = (postId, subreddit, postTitle) => {
        console.log(`Analyzing post ${postId} from r/${subreddit}: "${postTitle}"`);
        return {
            score: Math.floor(Math.random() * 10) + 1,
            flags: ["Unverified source", "Disputed claims"],
            title: postTitle
        };
    };

    // Extract post title from DOM
    const getPostTitle = (postId) => {
        const postElement = findPostElementById(postId);
        if (!postElement) {
            console.log(`Cannot find post element for ${postId} to extract title`);
            return "Unknown Post";
        }

        let title = null;

        // Method 1: Try to get title from post-title attribute
        title = postElement.getAttribute('post-title');
        if (title) return title;

        // Method 2: Try to find title in children elements
        const titleSelectors = [
            'h1',
            '[slot="title"]',
            'a[slot="full-post-link"]',
            '[data-testid="post-title"]'
        ];

        for (const selector of titleSelectors) {
            const titleElement = postElement.querySelector(selector);
            if (titleElement && titleElement.textContent.trim()) {
                title = titleElement.textContent.trim();
                console.log(`Found title using selector ${selector}: "${title}"`);
                return title;
            }
        }

        // Method 3: Try to get from shadow DOM if accessible
        if (postElement.shadowRoot) {
            const shadowTitle = postElement.shadowRoot.querySelector('h1, [slot="title"]');
            if (shadowTitle && shadowTitle.textContent.trim()) {
                title = shadowTitle.textContent.trim();
                console.log(`Found title in shadow DOM: "${title}"`);
                return title;
            }
        }

        // Method 4: Try to get from page title if we're on the post page
        if (window.location.pathname.includes(`/comments/${postId}/`)) {
            const pageTitle = document.title;
            // Reddit titles are usually in format: "title : subreddit"
            const titleMatch = pageTitle.match(/^(.+?)\s*:\s*r\//);
            if (titleMatch) {
                title = titleMatch[1].trim();
                console.log(`Found title from page title: "${title}"`);
                return title;
            }
        }

        console.warn(`Could not extract title for post ${postId}`);
        return "Unknown Post";
    };

    // Cleanup function to remove duplicate buttons
    // Call this from console: window.cleanupDuplicateButtons()
    window.cleanupDuplicateButtons = () => {
        console.log('Cleaning up duplicate buttons...');
        const seenPosts = new Set();
        const allButtons = document.querySelectorAll('.credi-btn');
        const allContainers = document.querySelectorAll('.credi-button-container');
        
        let removed = 0;
        
        allButtons.forEach(button => {
            const postId = button.dataset.postId;
            if (seenPosts.has(postId)) {
                button.remove();
                removed++;
            } else {
                seenPosts.add(postId);
            }
        });
        
        allContainers.forEach(container => {
            const postId = container.dataset.postId;
            if (seenPosts.has(postId)) {
                container.remove();
                removed++;
            } else {
                seenPosts.add(postId);
            }
        });
        
        console.log(`Removed ${removed} duplicate buttons/containers`);
        processedPosts.clear();
        console.log('Cleared processed posts cache');
    };

    // Diagnostic function to inspect Reddit's DOM structure
    // Call this from console: window.inspectRedditDOM()
    window.inspectRedditDOM = () => {
        console.log('=== Reddit DOM Inspection ===');
        const posts = document.querySelectorAll('shreddit-post[id]');
        console.log(`Found ${posts.length} shreddit-post elements`);
        
        posts.forEach((post, index) => {
            if (index < 3) { // Only log first 3 to avoid spam
                console.log(`\nPost ${index + 1}:`, {
                    id: post.id,
                    tagName: post.tagName,
                    hasShadowRoot: !!post.shadowRoot,
                    shadowRootMode: post.shadowRoot ? 'OPEN' : 'CLOSED/NONE',
                    classList: Array.from(post.classList),
                    children: Array.from(post.children).map(c => c.tagName),
                    nextSibling: post.nextElementSibling?.tagName,
                    html: post.outerHTML.substring(0, 200) + '...'
                });

                // Try to log what's inside shadow root if accessible
                if (post.shadowRoot) {
                    const shadowChildren = Array.from(post.shadowRoot.children);
                    console.log('  Shadow DOM children:', shadowChildren.map(c => ({
                        tag: c.tagName,
                        classes: Array.from(c.classList)
                    })));
                }
            }
        });

        // Look for other potential Reddit elements
        console.log('\n=== Other Reddit Elements ===');
        const otherSelectors = [
            'reddit-feed',
            'shreddit-comment',
            'shreddit-post-action-bar',
            'faceplate-toolbar',
            '[data-testid="post-container"]'
        ];
        
        otherSelectors.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            if (elements.length > 0) {
                console.log(`${selector}: ${elements.length} found`);
            }
        });
    };


    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { postId, subreddit, type } = obj;

        if (type === "TOP" && postId) {
            currPost = postId;
            console.log(`Message received for post: ${postId} from r/${subreddit}`);
            
            // Wait for Reddit to finish rendering the post
            waitForPostAndInject(postId, subreddit);
        }
        return true;
    });


    async function waitForPostAndInject(postId, subreddit) {
        let retries = 0;
        while (retries < 20) {
            const success = await injectButtonForPost(postId);
            if (success) {
                const postTitle = getPostTitle(postId);
                const analysis = analyzePost(postId, subreddit, postTitle);
                chrome.runtime.sendMessage({
                    content: "postAnalyzed",
                    postId,
                    subreddit,
                    analysis
                });
                return;
            }
            await new Promise(r => setTimeout(r, 500));
            retries++;
        }
        console.warn(`Could not inject button for ${postId} after ${retries} retries`);
    }

    async function injectButtonForPost(postId) {
        if (processedPosts.has(postId)) {
            return true;
        }

        if (document.querySelector(`.credi-btn[data-post-id="${postId}"]`) || 
            document.querySelector(`.credi-button-container[data-post-id="${postId}"]`)) {
            processedPosts.add(postId);
            return true; 
        }

        // Mark as being processed
        processedPosts.add(postId);

        const postElement = findPostElementById(postId);
        if (!postElement) {
            console.log(`Post element not found for ${postId}`);
            processedPosts.delete(postId); // Remove from set so we can retry later
            return false;
        }

        console.log(`Post element found for ${postId}:`, {
            tagName: postElement.tagName,
            hasShadowRoot: !!postElement.shadowRoot,
            shadowRootMode: postElement.shadowRoot ? 'open' : 'closed or none',
            classList: Array.from(postElement.classList || [])
        });

        let actionBar = findActionBar(postElement);
        let retries = 0;
        while (!actionBar && retries < 10) {
            await new Promise(r => setTimeout(r, 200));
            actionBar = findActionBar(postElement);
            retries++;
        }

        if (!actionBar) {
            console.log(`Action bar not found for ${postId}, trying alternative injection...`);
            return injectButtonAdjacent(postId, postElement);
        }
        
        const button = createCredibilityButton(postId);
        actionBar.appendChild(button);
        console.log(`Injected button into action bar for ${postId}`);
        return true;
    }

    function findPostElementById(postId) {
        // New Reddit: shreddit-post[id*="t3_<postId>"]
        const post = document.querySelector(`shreddit-post[id*="${postId}"]`);
        if (post) {
            console.log(`Found shreddit-post for ${postId}`);
            return post;
        }

        const article = document.querySelector(`article a[href*="/comments/${postId}/"]`);
        if (article) return article.closest("article");

        return null;
    }

    function findActionBar(postElement) {
        if (postElement.shadowRoot) {
            console.log('Shadow root is accessible (open mode)');
            const toolbar = postElement.shadowRoot.querySelector(
                "faceplate-toolbar, [data-testid='post-actions'], shreddit-post-action-bar, div[slot='action-row']"
            );
            if (toolbar) {
                console.log('Found toolbar in shadow root:', toolbar.tagName);
                return toolbar;
            }
        } else {
            console.log('Shadow root is NOT accessible (closed mode or doesn\'t exist)');
        }

        const actionBarSelectors = [
            "[data-testid='post-actions']",
            ".Post__actions",
            "[data-click-id='comments']",
            "shreddit-comment-action-row"
        ];

        for (const selector of actionBarSelectors) {
            const bar = postElement.querySelector(selector);
            if (bar) {
                console.log('Found action bar with selector:', selector);
                return bar;
            }
        }

        // Check next sibling elements
        let sibling = postElement.nextElementSibling;
        let attempts = 0;
        while (sibling && attempts < 3) {
            if (sibling.matches && sibling.matches("[data-testid='post-actions']")) {
                console.log('Found action bar as sibling');
                return sibling;
            }
            sibling = sibling.nextElementSibling;
            attempts++;
        }

        return null;
    }

    function injectButtonAdjacent(postId, postElement) {
        // Create a container that sits adjacent to the post
        const container = document.createElement('div');
        container.className = 'credi-button-container';
        container.dataset.postId = postId;
        container.style.cssText = `
            padding: 16px;
            background: #f6f7f8;
            border-top: 1px solid #edeff1;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 8px;
        `;

        const button = createCredibilityButton(postId);
        container.appendChild(button);

        // Try to insert after the post element
        if (postElement.nextSibling) {
            postElement.parentNode.insertBefore(container, postElement.nextSibling);
        } else {
            postElement.parentNode.appendChild(container);
        }

        console.log(`Injected button adjacent to post ${postId}`);
        return true;
    }

    function createCredibilityButton(postId) {
        const button = document.createElement("button");
        button.className = "credi-btn";
        button.textContent = "🔍 Credify Post";
        button.dataset.postId = postId;

        button.style.cssText = `
            padding: 12px 24px;
            margin: 0;
            border-radius: 24px;
            background: #0079d3;
            color: white;
            border: none;
            cursor: pointer;
            font-size: 16px;
            font-weight: bold;
            transition: all 0.2s ease;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
            min-width: 180px;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
            gap: 6px;
        `;

        button.onmouseover = () => {
            button.style.background = "#005fa3";
            button.style.transform = "translateY(-1px)";
            button.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";
        };
        button.onmouseout = () => {
            button.style.background = "#0079d3";
            button.style.transform = "translateY(0)";
            button.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
        };

        button.addEventListener("click", e => {
            e.preventDefault();
            e.stopPropagation();
            handleButtonClick(postId);
        });

        return button;
    }

    function handleButtonClick(postId) {
        console.log(`Credibility check requested for post: ${postId}`);

        chrome.storage.local.get("lastAnalysis", function (data) {
            if (data.lastAnalysis && data.lastAnalysis.postId === postId) {
                window.showCredibilityModal(data.lastAnalysis);
            } else {
                window.showLoadingModal();
                const subreddit = window.location.pathname.split("/")[2];
                const postTitle = getPostTitle(postId);
                const analysis = analyzePost(postId, subreddit, postTitle);
                chrome.runtime.sendMessage({
                    content: "postAnalyzed",
                    postId,
                    subreddit,
                    analysis
                });
                
                setTimeout(() => {
                    chrome.storage.local.get("lastAnalysis", function (data) {
                        if (data.lastAnalysis && data.lastAnalysis.postId === postId) {
                            window.showCredibilityModal(data.lastAnalysis);
                        }
                    });
                }, 500);
            }
        });
    }

    function injectButtonsForAllPosts() {
        const posts = document.querySelectorAll("shreddit-post[id]");
        console.log(`Found ${posts.length} posts, checking for button injection...`);
        posts.forEach(post => {
            const postId = post.id.replace("t3_", "");
            injectButtonForPost(postId);
        });
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Initialize: Check if we're on a single post page
    function initializeSinglePostPage() {
        const pathname = window.location.pathname;
        
        // Check if we're on a single post page: /r/subreddit/comments/postId/title/
        if (pathname.includes('/comments/')) {
            const urlParts = pathname.split('/');
            const commentsIndex = urlParts.indexOf('comments');
            
            if (commentsIndex !== -1 && commentsIndex + 1 < urlParts.length) {
                const postId = urlParts[commentsIndex + 1];
                const subreddit = urlParts[commentsIndex - 1];
                
                console.log(`Detected single post page: ${postId} from r/${subreddit}`);
                
                // Inject button for this post
                setTimeout(() => {
                    waitForPostAndInject(postId, subreddit);
                }, 1000);
            }
        }
    }

    // Debounced version of injectButtonsForAllPosts
    const debouncedInjectButtons = debounce(injectButtonsForAllPosts, 500);

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            injectButtonsForAllPosts();
            initializeSinglePostPage();
        });
    } else {
        setTimeout(() => {
            injectButtonsForAllPosts();
            initializeSinglePostPage();
        }, 1000);
    }

    const observer = new MutationObserver(debouncedInjectButtons);
    observer.observe(document.body, { childList: true, subtree: true });
})();
