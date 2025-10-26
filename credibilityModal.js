// credibilityModal.js - Handles the UI for displaying credibility analysis results

// Show loading modal with spinner animation
function showLoadingModal() {
    // Remove any existing modal
    const existingModal = document.querySelector('.credify-modal');
    if (existingModal) existingModal.remove();

    const modal = createModalContainer();
    modal.innerHTML = `
        <div class="credify-modal-content">
            <div class="credify-modal-header">
                <h2>🔍 Analyzing Post</h2>
                <button class="credify-close-btn">×</button>
            </div>
            <div class="credify-modal-body">
                <div class="credify-loading">
                    <div class="credify-spinner"></div>
                    <p>Checking credibility...</p>
                </div>
            </div>
        </div>
    `;
    document.body.appendChild(modal);
    
    // Add event listeners for close buttons
    attachCloseListeners(modal);
}

// Show credibility results modal
function showCredibilityModal(analysis) {
    // Remove any existing modal
    const existingModal = document.querySelector('.credify-modal');
    if (existingModal) existingModal.remove();

    const modal = createModalContainer();
    
    // Determine score color
    const scoreColor = analysis.score >= 7 ? '#10b981' : 
                      analysis.score >= 4 ? '#f59e0b' : '#ef4444';
    
    modal.innerHTML = `
        <div class="credify-modal-content">
            <div class="credify-modal-header">
                <h2>🔍 Credibility Analysis</h2>
                <button class="credify-close-btn">×</button>
            </div>
            <div class="credify-modal-body">
                <div class="credify-score-section">
                    <div class="credify-score-label">Credibility Score</div>
                    <div class="credify-score-value" style="color: ${scoreColor}">
                        ${analysis.score}/10
                    </div>
                    <div class="credify-score-bar">
                        <div class="credify-score-fill" style="width: ${analysis.score * 10}%; background: ${scoreColor}"></div>
                    </div>
                </div>
                
                <div class="credify-details-section">
                    <h3>📋 Analysis Details</h3>
                    ${analysis.title ? `
                        <div class="credify-info-item credify-post-title">
                            <span class="credify-label">Post Title:</span>
                            <span class="credify-value">${analysis.title}</span>
                        </div>
                    ` : ''}
                    <div class="credify-info-item">
                        <span class="credify-label">Post ID:</span>
                        <span class="credify-value">${analysis.postId}</span>
                    </div>
                    <div class="credify-info-item">
                        <span class="credify-label">Subreddit:</span>
                        <span class="credify-value">r/${analysis.subreddit}</span>
                    </div>
                </div>
                
                ${analysis.flags && analysis.flags.length > 0 ? `
                    <div class="credify-flags-section">
                        <h3>⚠️ Flags Detected</h3>
                        <ul class="credify-flags-list">
                            ${analysis.flags.map(flag => `<li>${flag}</li>`).join('')}
                        </ul>
                    </div>
                ` : `
                    <div class="credify-flags-section credify-no-flags">
                        <h3>✅ No Issues Detected</h3>
                        <p>This post appears to be credible based on our analysis.</p>
                    </div>
                `}
            </div>
            <div class="credify-modal-footer">
                <button class="credify-btn-secondary credify-close-footer-btn">Close</button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners for close buttons
    attachCloseListeners(modal);
}

// Create modal container with all styling
function createModalContainer() {
    const modal = document.createElement('div');
    modal.className = 'credify-modal';
    
    // Inject styles if not already present
    if (!document.querySelector('#credify-modal-styles')) {
        const styles = document.createElement('style');
        styles.id = 'credify-modal-styles';
        styles.textContent = `
            .credify-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.7);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 10000;
                animation: credifyFadeIn 0.2s ease-out;
            }
            
            @keyframes credifyFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
            }
            
            .credify-modal-content {
                background: white;
                border-radius: 12px;
                width: 90%;
                max-width: 500px;
                max-height: 80vh;
                overflow-y: auto;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
                animation: credifySlideUp 0.3s ease-out;
            }
            
            @keyframes credifySlideUp {
                from { transform: translateY(20px); opacity: 0; }
                to { transform: translateY(0); opacity: 1; }
            }
            
            .credify-modal-header {
                padding: 20px;
                border-bottom: 1px solid #e5e7eb;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .credify-modal-header h2 {
                margin: 0;
                font-size: 20px;
                font-weight: 600;
                color: #111827;
            }
            
            .credify-close-btn {
                background: none;
                border: none;
                font-size: 28px;
                color: #6b7280;
                cursor: pointer;
                padding: 0;
                width: 32px;
                height: 32px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 6px;
                transition: all 0.2s;
            }
            
            .credify-close-btn:hover {
                background: #f3f4f6;
                color: #111827;
            }
            
            .credify-modal-body {
                padding: 20px;
            }
            
            .credify-loading {
                text-align: center;
                padding: 40px 20px;
            }
            
            .credify-spinner {
                width: 50px;
                height: 50px;
                border: 4px solid #e5e7eb;
                border-top-color: #0079d3;
                border-radius: 50%;
                animation: credifySpin 0.8s linear infinite;
                margin: 0 auto 20px;
            }
            
            @keyframes credifySpin {
                to { transform: rotate(360deg); }
            }
            
            .credify-loading p {
                color: #6b7280;
                font-size: 16px;
            }
            
            .credify-score-section {
                text-align: center;
                padding: 20px;
                background: #f9fafb;
                border-radius: 8px;
                margin-bottom: 20px;
            }
            
            .credify-score-label {
                font-size: 14px;
                color: #6b7280;
                margin-bottom: 8px;
            }
            
            .credify-score-value {
                font-size: 48px;
                font-weight: bold;
                margin-bottom: 12px;
            }
            
            .credify-score-bar {
                width: 100%;
                height: 8px;
                background: #e5e7eb;
                border-radius: 4px;
                overflow: hidden;
            }
            
            .credify-score-fill {
                height: 100%;
                transition: width 0.5s ease-out;
                border-radius: 4px;
            }
            
            .credify-details-section,
            .credify-flags-section {
                margin-top: 20px;
            }
            
            .credify-details-section h3,
            .credify-flags-section h3 {
                font-size: 16px;
                font-weight: 600;
                color: #111827;
                margin: 0 0 12px 0;
            }
            
            .credify-info-item {
                display: flex;
                justify-content: space-between;
                padding: 8px 0;
                border-bottom: 1px solid #f3f4f6;
                gap: 12px;
            }
            
            .credify-post-title {
                flex-direction: column;
                align-items: flex-start;
                background: #f9fafb;
                padding: 12px;
                border-radius: 6px;
                border-bottom: none;
                margin-bottom: 8px;
            }
            
            .credify-post-title .credify-value {
                margin-top: 4px;
                font-size: 15px;
                font-weight: 600;
                color: #0079d3;
                word-break: break-word;
                width: 100%;
            }
            
            .credify-label {
                color: #6b7280;
                font-size: 14px;
                flex-shrink: 0;
            }
            
            .credify-value {
                color: #111827;
                font-size: 14px;
                font-weight: 500;
                text-align: right;
            }
            
            .credify-flags-list {
                list-style: none;
                padding: 0;
                margin: 0;
            }
            
            .credify-flags-list li {
                padding: 10px;
                background: #fef2f2;
                border-left: 3px solid #ef4444;
                margin-bottom: 8px;
                border-radius: 4px;
                color: #991b1b;
                font-size: 14px;
            }
            
            .credify-no-flags {
                padding: 20px;
                background: #f0fdf4;
                border-radius: 8px;
                text-align: center;
            }
            
            .credify-no-flags h3 {
                color: #166534;
                margin-bottom: 8px;
            }
            
            .credify-no-flags p {
                color: #166534;
                font-size: 14px;
                margin: 0;
            }
            
            .credify-modal-footer {
                padding: 16px 20px;
                border-top: 1px solid #e5e7eb;
                display: flex;
                justify-content: flex-end;
                gap: 10px;
            }
            
            .credify-btn-secondary {
                padding: 8px 16px;
                background: #f3f4f6;
                color: #374151;
                border: none;
                border-radius: 6px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 500;
                transition: all 0.2s;
            }
            
            .credify-btn-secondary:hover {
                background: #e5e7eb;
            }
        `;
        document.head.appendChild(styles);
    }
    
    return modal;
}

// Attach event listeners for closing the modal
function attachCloseListeners(modal) {
    // Close on X button click (in header)
    const closeBtn = modal.querySelector('.credify-close-btn');
    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            modal.remove();
        });
    }
    
    // Close on footer button click
    const closeFooterBtn = modal.querySelector('.credify-close-footer-btn');
    if (closeFooterBtn) {
        closeFooterBtn.addEventListener('click', () => {
            modal.remove();
        });
    }
    
    // Close on backdrop click (clicking outside the modal content)
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
    
    // Close on Escape key press
    const handleEscape = (e) => {
        if (e.key === 'Escape') {
            modal.remove();
            document.removeEventListener('keydown', handleEscape);
        }
    };
    document.addEventListener('keydown', handleEscape);
}

// Make functions available globally for the content script
window.showLoadingModal = showLoadingModal;
window.showCredibilityModal = showCredibilityModal;

