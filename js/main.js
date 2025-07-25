/* YassirPay Admin Portal - Core JavaScript Functionality */

// Global variables
let currentPage = window.location.pathname;
// Remove leading slash if present
if (currentPage.startsWith('/')) {
    currentPage = currentPage.substring(1);
}
// If it's just the domain, default to index.html
if (currentPage === '' || currentPage.endsWith('/')) {
    currentPage += 'index.html';
}
let activeTab = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeTabs();
    initializeModals();
    initializeResponsiveFeatures();
});

// Navigation functionality
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        // Set active state based on current page
        // Normalize link href to match currentPage format (e.g., remove leading '../')
        let linkHref = link.getAttribute('href');
        if (linkHref.startsWith('../')) {
            linkHref = linkHref.substring(3); // Remove '../'
        }
        if (linkHref.startsWith('pages/')) {
            // If link is already in pages/, no change needed
        } else {
            // If link is not in pages/, but current page is, prepend 'pages/'
            if (currentPage.startsWith('pages/') && !linkHref.includes('/')) {
                linkHref = 'pages/' + linkHref;
            }
        }

        if (linkHref === currentPage) {
            link.parentElement.classList.add('active');
        }
        
        // Add click handlers for smooth navigation
        link.addEventListener('click', function(e) {
            // Remove active class from all nav items
            document.querySelectorAll('.nav-item').forEach(item => {
                item.classList.remove('active');
            });
            
            // Add active class to clicked item
            this.parentElement.classList.add('active');
        });
    });
}

// Tab functionality
function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabContainer = this.closest('.reports-tabs, .security-tabs');
            const tabName = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and content
            tabContainer.querySelectorAll('.tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            tabContainer.querySelectorAll('.tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(tabName);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Modal functionality
function initializeModals() {
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal');
    
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            if (modal) {
                modal.classList.add('active');
            }
        });
    });
    
    // Close modals
    modals.forEach(modal => {
        const closeBtn = modal.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', function() {
                modal.classList.remove('active');
            });
        }
        
        // Close on outside click
        modal.addEventListener('click', function(e) {
            if (e.target === modal) {
                modal.classList.remove('active');
            }
        });
    });
}

// Responsive features
function initializeResponsiveFeatures() {
    const sidebar = document.querySelector('.sidebar');
    const menuToggle = document.querySelector('.menu-toggle');
    
    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            sidebar.classList.remove('active');
        }
    });
}

// Utility functions
function showLoading(element) {
    const loading = document.createElement('div');
    loading.className = 'loading-overlay';
    loading.innerHTML = '<div class="loading"></div>';
    element.appendChild(loading);
    return loading;
}

function hideLoading(loadingElement) {
    if (loadingElement && loadingElement.parentNode) {
        loadingElement.parentNode.removeChild(loadingElement);
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isValid = true;
    
    inputs.forEach(input => {
        if (!input.value.trim()) {
            input.classList.add('error');
            isValid = false;
        } else {
            input.classList.remove('error');
        }
    });
    
    return isValid;
}

// API helper functions
async function apiRequest(endpoint, options = {}) {
    const defaultOptions = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    };
    
    const config = { ...defaultOptions, ...options };
    
    try {
        const response = await fetch(endpoint, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || 'API request failed');
        }
        
        return data;
    } catch (error) {
        console.error('API request error:', error);
        showNotification(error.message || 'Network error occurred', 'error');
        throw error;
    }
}

// Export functions for use in other modules
window.YassirPay = {
    showNotification,
    showLoading,
    hideLoading,
    validateForm,
    apiRequest
};
