// Responsible for data collection from the webpage
(() => {
    let currPost = "";
    const processedPosts = new Set(); // Track posts we've already processed

    // Theme detection and colors
    const getCurrentTheme = () => {
        const shredditApp = document.querySelector('shreddit-app');
        if (shredditApp) {
            const theme = shredditApp.getAttribute('theme');
            return theme === 'dark' ? 'dark' : 'light';
        }
        return 'light';
    };

    const getThemeColors = (theme) => {
        if (theme === 'dark') {
            return {
                buttonBg: 'rgb(77, 200, 143)',
                buttonHover: 'rgb(57, 180, 123)',
                containerBg: '#1A1A1B',
                containerBorder: '#343536'
            };
        }
        return {
            buttonBg: 'rgb(77, 200, 143)',
            buttonHover: 'rgb(57, 180, 123)',
            containerBg: '#f6f7f8',
            containerBorder: '#edeff1'
        };
    };

    const analyzePost = async (postId, subreddit, postTitle) => {
        try {
            // Call the gateway agent (llm_agent.py) which orchestrates NYT and scoring agents
            const response = await axios.post('http://localhost:8000/fact-check', {
                query: postTitle,
                begin_date: "20240101",  // Dummy date - past year
                end_date: "20241231"     // Dummy date - current year
            });
            
            // Response format: { score: 0.0-1.0, flags: [...], description: "..." }
            return {
                score: response.data.score ? (response.data.score * 10).toFixed(1) : 5, // Convert 0-1 to 0-10 scale
                flags: response.data.flags || [],
                description: response.data.description || "No analysis available",
                title: postTitle
            };
        } catch (error) {
            console.error('Credify API Error:', error);
            // Fallback to mock data if API fails
            return {
                score: 5,
                flags: ["API unavailable"],
                description: "Unable to connect to fact-checking service. Please ensure agents are running.",
                title: postTitle
            };
        }
    };

    // Extract post title from DOM
    const getPostTitle = (postId) => {
        const postElement = findPostElementById(postId);
        if (!postElement) {
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
                return title;
            }
        }

        // Method 3: Try to get from shadow DOM if accessible
        if (postElement.shadowRoot) {
            const shadowTitle = postElement.shadowRoot.querySelector('h1, [slot="title"]');
            if (shadowTitle && shadowTitle.textContent.trim()) {
                title = shadowTitle.textContent.trim();
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
                return title;
            }
        }

        return "Unknown Post";
    };

    chrome.runtime.onMessage.addListener((obj, sender, response) => {
        const { postId, subreddit, type } = obj;

        if (type === "TOP" && postId) {
            currPost = postId;
            
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
                const analysis = await analyzePost(postId, subreddit, postTitle);
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
            processedPosts.delete(postId); // Remove from set so we can retry later
            return false;
        }

        let actionBar = findActionBar(postElement);
        let retries = 0;
        while (!actionBar && retries < 10) {
            await new Promise(r => setTimeout(r, 200));
            actionBar = findActionBar(postElement);
            retries++;
        }

        if (!actionBar) {
            return injectButtonAdjacent(postId, postElement);
        }
        
        const button = createCredibilityButton(postId);
        actionBar.appendChild(button);
        return true;
    }

    function findPostElementById(postId) {
        // New Reddit: shreddit-post[id*="t3_<postId>"]
        const post = document.querySelector(`shreddit-post[id*="${postId}"]`);
        if (post) {
            return post;
        }

        const article = document.querySelector(`article a[href*="/comments/${postId}/"]`);
        if (article) return article.closest("article");

        return null;
    }

    function findActionBar(postElement) {
        if (postElement.shadowRoot) {
            const toolbar = postElement.shadowRoot.querySelector(
                "faceplate-toolbar, [data-testid='post-actions'], shreddit-post-action-bar, div[slot='action-row']"
            );
            if (toolbar) {
                return toolbar;
            }
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
                return bar;
            }
        }

        // Check next sibling elements
        let sibling = postElement.nextElementSibling;
        let attempts = 0;
        while (sibling && attempts < 3) {
            if (sibling.matches && sibling.matches("[data-testid='post-actions']")) {
                return sibling;
            }
            sibling = sibling.nextElementSibling;
            attempts++;
        }

        return null;
    }

    function injectButtonAdjacent(postId, postElement) {
        const theme = getCurrentTheme();
        const colors = getThemeColors(theme);
        
        // Create a container that sits adjacent to the post
        const container = document.createElement('div');
        container.className = 'credi-button-container';
        container.dataset.postId = postId;
        container.style.cssText = `
            padding: 16px;
            background: ${colors.containerBg};
            border-top: 1px solid ${colors.containerBorder};
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

        return true;
    }

    function createCredibilityButton(postId) {
        const theme = getCurrentTheme();
        const colors = getThemeColors(theme);
        
        const button = document.createElement("button");
        button.className = "credi-btn";
        button.dataset.postId = postId;
        
        // Create logo image
        const logo = document.createElement("img");
        logo.src = chrome.runtime.getURL("assets/credify-icon.png");
        logo.alt = "Credify";
        logo.style.cssText = `
            width: 20px;
            height: 20px;
            object-fit: contain;
            vertical-align: middle;
            margin-top: 10px;
        `;
        
        // Create text node
        const text = document.createTextNode("Credify Post");
        
        // Add logo and text to button
        button.appendChild(logo);
        button.appendChild(text);

        button.style.cssText = `
            padding: 12px 24px;
            margin: 0;
            border-radius: 24px;
            background: ${colors.buttonBg};
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
            button.style.background = colors.buttonHover;
            button.style.transform = "translateY(-1px)";
            button.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.15)";
        };
        button.onmouseout = () => {
            button.style.background = colors.buttonBg;
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

    async function handleButtonClick(postId) {
        chrome.storage.local.get("lastAnalysis", async function (data) {
            if (data.lastAnalysis && data.lastAnalysis.postId === postId) {
                window.showCredibilityModal(data.lastAnalysis);
            } else {
                window.showLoadingModal();
                const subreddit = window.location.pathname.split("/")[2];
                const postTitle = getPostTitle(postId);
                const analysis = await analyzePost(postId, subreddit, postTitle);
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
                }, 2000); // Increased timeout to allow API to respond
            }
        });
    }

    function injectButtonsForAllPosts() {
        const posts = document.querySelectorAll("shreddit-post[id]");
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
                
                // Inject button for this post
                setTimeout(() => {
                    waitForPostAndInject(postId, subreddit);
                }, 1000);
            }
        }
    }

    // Update button colors when theme changes
    function updateButtonColors() {
        const theme = getCurrentTheme();
        const colors = getThemeColors(theme);
        
        document.querySelectorAll('.credi-btn').forEach(button => {
            button.style.background = colors.buttonBg;
            button.onmouseout = () => {
                button.style.background = colors.buttonBg;
                button.style.transform = "translateY(0)";
                button.style.boxShadow = "0 2px 4px rgba(0, 0, 0, 0.1)";
            };
        });
        
        document.querySelectorAll('.credi-button-container').forEach(container => {
            container.style.background = colors.containerBg;
            container.style.borderTop = `1px solid ${colors.containerBorder}`;
        });
    }

    // Watch for theme changes
    function observeThemeChanges() {
        const shredditApp = document.querySelector('shreddit-app');
        if (shredditApp) {
            const themeObserver = new MutationObserver(() => {
                updateButtonColors();
            });
            themeObserver.observe(shredditApp, { 
                attributes: true, 
                attributeFilter: ['theme'] 
            });
        }
    }

    // Debounced version of injectButtonsForAllPosts
    const debouncedInjectButtons = debounce(injectButtonsForAllPosts, 500);

    if (document.readyState === "loading") {
        document.addEventListener("DOMContentLoaded", () => {
            injectButtonsForAllPosts();
            initializeSinglePostPage();
            observeThemeChanges();
        });
    } else {
        setTimeout(() => {
            injectButtonsForAllPosts();
            initializeSinglePostPage();
            observeThemeChanges();
        }, 1000);
    }

    const observer = new MutationObserver(debouncedInjectButtons);
    observer.observe(document.body, { childList: true, subtree: true });
})();
