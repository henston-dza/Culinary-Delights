// ==================== 
// IMAGE PLACEHOLDER SETUP
// ==================== 

function createImagePlaceholders() {
    const images = document.querySelectorAll('img[src*="placeholder"], img[src*="via."]');
    
    images.forEach(img => {
        const altText = img.alt || 'Image';
        const placeholder = document.createElement('div');
        
        if (img.closest('.special-image-wrapper')) {
            placeholder.className = 'special-image-placeholder';
            placeholder.style.height = '300px';
        } else {
            placeholder.className = 'image-placeholder';
            placeholder.style.height = '200px';
        }
        
        placeholder.innerHTML = `<span>${altText}</span>`;
        img.replaceWith(placeholder);
    });
}

// ==================== 
// DOM ELEMENTS
// ==================== 

const menuFilters = document.querySelectorAll('.menu-filter');
const menuItems = document.querySelectorAll('.menu-item');
const reservationForm = document.getElementById('reservationForm');

// ==================== 
// MENU FILTERING
// ==================== 

menuFilters.forEach(filter => {
    filter.addEventListener('click', function() {
        const filterValue = this.getAttribute('data-filter');
        
        // Update active button
        menuFilters.forEach(btn => btn.classList.remove('active'));
        this.classList.add('active');
        
        // Filter menu items with animation
        menuItems.forEach(item => {
            const category = item.getAttribute('data-category');
            
            // Fade out animation
            item.style.opacity = '0';
            item.style.pointerEvents = 'none';
            
            setTimeout(() => {
                if (filterValue === 'all' || category === filterValue) {
                    item.classList.remove('hidden');
                    item.style.display = 'block';
                    
                    // Fade in animation
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.pointerEvents = 'auto';
                    }, 10);
                } else {
                    item.classList.add('hidden');
                    item.style.display = 'none';
                }
            }, 300);
        });
    });
});

// ==================== 
// SMOOTH SCROLL & ROUTING INTEGRATION
// ==================== 
// Smooth scroll is managed dynamically via SPA Client Routing Transitions.

// ==================== 
// RESERVATION FORM VALIDATION & SUBMISSION
// ==================== 

reservationForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Check if logged in first
    if (!currentUser || !authToken) {
        showNotification('Please login or sign up to secure your reservation.', 'error');
        const authModal = new bootstrap.Modal(document.getElementById('authModal'));
        authModal.show();
        return;
    }
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const guests = document.getElementById('guests').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const special = document.getElementById('special').value.trim();
    
    // Trigger validation on all fields
    const isNameValid = validateName();
    const isEmailValid = validateEmail();
    const isPhoneValid = validatePhone();
    const isGuestsValid = validateGuests();
    const isDateValid = validateDate();
    const isTimeValid = validateTime();
    
    if (!isNameValid || !isEmailValid || !isPhoneValid || !isGuestsValid || !isDateValid || !isTimeValid) {
        showNotification('Please correct the validation errors in the form before booking.', 'error');
        const firstInvalid = reservationForm.querySelector('.is-invalid');
        if (firstInvalid) firstInvalid.focus();
        return;
    }
    
    // Loading button visual feedback
    const submitBtn = reservationForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.disabled = true;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Booking...';
    
    try {
        const response = await fetch('/api/reservations', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${authToken}`
            },
            body: JSON.stringify({
                name,
                email,
                phone,
                guests,
                date,
                time,
                special,
                culinaryPlan: culinaryPlan // Structured plan list from local state
            })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            showNotification('Reservation secured successfully! We look forward to serving you.', 'success');
            
            // Clear local culinary plan
            culinaryPlan = [];
            updatePlannerState();
            
            // Reset form
            setTimeout(() => {
                reservationForm.reset();
            }, 500);
        } else {
            showNotification(data.message || 'Failed to book reservation.', 'error');
        }
    } catch (err) {
        console.error('Reservation submit error:', err);
        showNotification('Network error, please check your connection and try again.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
    }
});

// ==================== 
// NOTIFICATION SYSTEM (Premium Glassmorphic Toast)
// ==================== 

function showNotification(message, type = 'success') {
    // Create container if it doesn't exist
    let container = document.querySelector('.custom-toast-container');
    if (!container) {
        container = document.createElement('div');
        container.className = 'custom-toast-container';
        document.body.appendChild(container);
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `custom-toast ${type}`;
    
    const iconClass = type === 'success' ? 'fas fa-check-circle' : 'fas fa-exclamation-circle';
    const titleText = type === 'success' ? 'Success' : 'Attention';
    
    toast.innerHTML = `
        <div class="custom-toast-icon"><i class="${iconClass}"></i></div>
        <div class="custom-toast-content">
            <div class="custom-toast-title">${titleText}</div>
            <div class="custom-toast-message">${message}</div>
        </div>
        <button class="custom-toast-close"><i class="fas fa-times"></i></button>
        <div class="custom-toast-progress"></div>
    `;
    
    container.appendChild(toast);
    
    // Trigger entrance animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 50);
    
    // Set progress bar transition based on auto-close time
    const duration = 5000;
    const progress = toast.querySelector('.custom-toast-progress');
    progress.style.transition = `width ${duration}ms linear`;
    progress.style.width = '0%';
    
    // Auto-remove toast function
    let autoCloseTimeout = setTimeout(() => {
        removeToast(toast);
    }, duration);
    
    // Close button handler
    const closeBtn = toast.querySelector('.custom-toast-close');
    closeBtn.addEventListener('click', () => {
        clearTimeout(autoCloseTimeout);
        removeToast(toast);
    });
}

function removeToast(toast) {
    toast.classList.remove('show');
    toast.style.transform = 'translateX(120%)';
    setTimeout(() => {
        toast.remove();
        // Remove container if empty
        const container = document.querySelector('.custom-toast-container');
        if (container && container.children.length === 0) {
            container.remove();
        }
    }, 500);
}

// ==================== 
// LAZY LOADING IMAGES
// ==================== 

function lazyLoadImages() {
    const images = document.querySelectorAll('img');
    
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.style.transition = 'opacity 0.5s ease';
                
                if (img.complete) {
                    img.style.opacity = '1';
                } else {
                    img.style.opacity = '0';
                    img.addEventListener('load', function onLoad() {
                        img.style.opacity = '1';
                        img.removeEventListener('load', onLoad);
                    });
                    img.addEventListener('error', function onError() {
                        img.style.opacity = '1'; // show placeholder/alt if error
                        img.removeEventListener('error', onError);
                    });
                }
                observer.unobserve(img);
            }
        });
    });
    
    images.forEach(img => imageObserver.observe(img));
}

// ==================== 
// SCROLL ANIMATIONS
// ==================== 

function observeElements() {
    const options = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'slideInUp 0.5s ease forwards';
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    // Observe cards
    document.querySelectorAll('.menu-card, .special-card, .stat-box, .contact-info-box, .testimonial-card').forEach(el => {
        observer.observe(el);
    });
}

// ==================== 
// NAVBAR SCROLL EFFECT
// ==================== 

window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.2)';
        navbar.style.background = 'linear-gradient(135deg, rgba(26, 26, 26, 0.98) 0%, rgba(45, 45, 45, 0.98) 100%)';
    } else {
        navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        navbar.style.background = 'linear-gradient(135deg, #1a1a1a 0%, #2d2d2d 100%)';
    }
});

// ==================== 
// PARALLAX EFFECT
// ==================== 

window.addEventListener('scroll', function() {
    const heroOverlay = document.querySelector('.hero-overlay');
    if (heroOverlay) {
        heroOverlay.style.transform = `translateY(${window.scrollY * 0.5}px)`;
    }
});

// ==================== 
// DATE INPUT - MIN DATE SET TO TODAY
// ==================== 

function setMinDate() {
    const dateInput = document.getElementById('date');
    const today = new Date().toISOString().split('T')[0];
    dateInput.setAttribute('min', today);
}

// ==================== 
// INITIALIZE ON DOM READY
// ==================== 

document.addEventListener('DOMContentLoaded', function() {
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    createImagePlaceholders();
    lazyLoadImages();
    observeElements();
    setMinDate();
    
    // Add subtle hover effects to all buttons
    document.querySelectorAll('button').forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });
    
    // Add animation to price tags
    document.querySelectorAll('.price-tag').forEach((price, index) => {
        price.style.animation = `fadeIn 0.5s ease ${0.1 * index}s both`;
    });
});

// ==================== 
// CAROUSEL AUTO-SCROLL ENHANCEMENT
// ==================== 

function enhanceCarousel() {
    const carouselEl = document.getElementById('testimonialCarousel');
    if (carouselEl && typeof bootstrap !== 'undefined') {
        const carousel = bootstrap.Carousel.getOrCreateInstance(carouselEl, {
            ride: 'carousel',
            interval: 5000,
            pause: 'hover'
        });
    }
}

// Call after DOM content is fully loaded
window.addEventListener('load', enhanceCarousel);

// ==================== 
// UTILITY FUNCTIONS
// ==================== 

// Get current year for dynamic copyright
function updateYear() {
    const yearElement = document.querySelector('footer p');
    if (yearElement) {
        const currentYear = new Date().getFullYear();
        yearElement.textContent = `© ${currentYear} Culinary Delights. All rights reserved.`;
    }
}

updateYear();

// ==================== 
// SPA NAVIGATION ROUTING
// ==================== 

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        // Do not intercept modal triggers or non-nav items
        if (this.getAttribute('data-bs-toggle') || this.classList.contains('dropdown-item') || href === '#') return;
        
        e.preventDefault();
        history.pushState(null, '', href);
        if (this.closest('.navbar-nav')) {
            const navbarCollapse = this.closest('.navbar-collapse');
            if (navbarCollapse && typeof bootstrap !== 'undefined' && navbarCollapse.classList.contains('show')) {
                const runRoutingAfterCollapse = () => {
                    navbarCollapse.removeEventListener('hidden.bs.collapse', runRoutingAfterCollapse);
                    handleRouting();
                };

                navbarCollapse.addEventListener('hidden.bs.collapse', runRoutingAfterCollapse);
                const collapseInstance = bootstrap.Collapse.getOrCreateInstance(navbarCollapse, { toggle: false });
                collapseInstance.hide();
            } else {
                handleRouting();
            }
        } else {
            handleRouting();
        }
    });
});

// ==================== 
// KEYBOARD NAVIGATION
// ==================== 

document.addEventListener('keydown', function(event) {
    // Close any open dropdowns on Escape
    if (event.key === 'Escape') {
        document.querySelectorAll('.collapse.show').forEach(el => {
            el.classList.remove('show');
        });
    }
    
    // Tab through interactive elements with enhanced visibility
    if (event.key === 'Tab') {
        document.activeElement.style.outline = '2px solid var(--primary-color)';
    }
});

// ==================== 
// PERFORMANCE OPTIMIZATION
// ==================== 

// Debounce function for scroll events
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

// Apply debounce to scroll listeners
const debouncedScroll = debounce(function() {
    // Handle scroll logic here
}, 100);

window.addEventListener('scroll', debouncedScroll);

// ==================== 
// ADVANCED CULINARY ENGINE
// ==================== 

let culinaryPlan = [];

function initAdvancedCulinaryFeatures() {
    // --- Ambiance Selector & Theme Switching ---
    const savedTheme = localStorage.getItem('culinary-theme') || 'midnight';
    document.body.setAttribute('data-theme', savedTheme);
    
    // Highlight saved item
    document.querySelectorAll('.glass-dropdown .dropdown-item').forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-theme') === savedTheme) {
            item.classList.add('active');
            const dropdownToggle = document.getElementById('moodDropdown');
            if (dropdownToggle) {
                const icon = item.querySelector('i').className;
                dropdownToggle.innerHTML = `<i class="${icon}"></i> ${item.textContent.trim()}`;
            }
        }
    });

    // Theme Switch Event Listeners
    document.querySelectorAll('.glass-dropdown .dropdown-item').forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetTheme = this.getAttribute('data-theme');
            document.body.setAttribute('data-theme', targetTheme);
            localStorage.setItem('culinary-theme', targetTheme);
            
            document.querySelectorAll('.glass-dropdown .dropdown-item').forEach(el => el.classList.remove('active'));
            this.classList.add('active');
            
            const dropdownToggle = document.getElementById('moodDropdown');
            if (dropdownToggle) {
                const icon = this.querySelector('i').className;
                dropdownToggle.innerHTML = `<i class="${icon}"></i> ${this.textContent.trim()}`;
            }
            
            showNotification(`Ambiance switched to ${this.textContent.trim()}!`, 'success');
        });
    });

    // --- Drawer Controls & Trigger Badges ---
    const triggerBtn = document.getElementById('culinaryTrigger');
    const drawer = document.getElementById('culinaryDrawer');
    const closeBtn = document.getElementById('closeDrawerBtn');
    const integrateBtn = document.getElementById('integrateReservationBtn');
    const exploreBtn = document.getElementById('drawerExploreBtn');

    if (triggerBtn && drawer) {
        triggerBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            drawer.classList.add('open');
        });
    }

    if (closeBtn && drawer) {
        closeBtn.addEventListener('click', () => {
            drawer.classList.remove('open');
        });
    }

    if (exploreBtn && drawer) {
        exploreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            drawer.classList.remove('open');
            const menuSec = document.getElementById('menu');
            if (menuSec) {
                scrollToSection(menuSec);
            }
        });
    }

    if (integrateBtn) {
        integrateBtn.addEventListener('click', integrateIntoReservation);
    }

    // Click outside to close drawer
    document.addEventListener('click', (e) => {
        if (drawer && drawer.classList.contains('open')) {
            if (!drawer.contains(e.target) && !triggerBtn.contains(e.target) && !e.target.closest('.btn-add-plan') && !e.target.closest('.qty-btn') && !e.target.closest('.drawer-item-remove')) {
                drawer.classList.remove('open');
            }
        }
    });

    // --- "Add to Plan" Button Triggers ---
    document.querySelectorAll('.btn-add-plan').forEach(btn => {
        btn.addEventListener('click', function(e) {
            const name = this.getAttribute('data-name');
            const price = this.getAttribute('data-price');
            const category = this.getAttribute('data-category');
            const spicy = this.getAttribute('data-spicy');
            const veg = this.getAttribute('data-veg');
            const gluten = this.getAttribute('data-gluten');
            
            addToPlan(name, price, category, spicy, veg, gluten, e);
        });
    });
}

// State Operations
function addToPlan(name, price, category, spicy, veg, gluten, event) {
    price = parseInt(price);
    const isSpicy = spicy === 'true';
    const isVeg = veg === 'true';
    const isGluten = gluten === 'true';
    
    const existing = culinaryPlan.find(item => item.name === name);
    if (existing) {
        existing.quantity += 1;
    } else {
        culinaryPlan.push({ 
            name, 
            price, 
            category, 
            spicy: isSpicy, 
            veg: isVeg, 
            gluten: isGluten, 
            quantity: 1 
        });
    }
    
    spawnFlyoutParticle(event);
    updatePlannerState();
    
    showNotification(`Added "${name}" to your culinary plan!`, 'success');
}

window.adjustItemQty = function(name, amount) {
    const existingIndex = culinaryPlan.findIndex(item => item.name === name);
    if (existingIndex !== -1) {
        if (amount === -999) {
            const removedName = culinaryPlan[existingIndex].name;
            culinaryPlan.splice(existingIndex, 1);
            showNotification(`Removed "${removedName}" from plan`, 'success');
        } else {
            culinaryPlan[existingIndex].quantity += amount;
            if (culinaryPlan[existingIndex].quantity <= 0) {
                const removedName = culinaryPlan[existingIndex].name;
                culinaryPlan.splice(existingIndex, 1);
                showNotification(`Removed "${removedName}" from plan`, 'success');
            }
        }
    }
    updatePlannerState();
};

function updatePlannerState() {
    const trigger = document.getElementById('culinaryTrigger');
    const badge = trigger.querySelector('.cart-count-badge');
    const totalCount = culinaryPlan.reduce((sum, item) => sum + item.quantity, 0);
    
    if (totalCount > 0) {
        trigger.classList.remove('d-none');
        badge.innerText = totalCount;
    } else {
        trigger.classList.add('d-none');
        const drawer = document.getElementById('culinaryDrawer');
        if (drawer) drawer.classList.remove('open');
    }
    
    renderDrawerItems();
    analyzeFlavorProfile();
    if (typeof updateLiveTicket === 'function') {
        updateLiveTicket();
    }
}

function renderDrawerItems() {
    const emptyState = document.getElementById('drawerEmptyState');
    const itemsList = document.getElementById('drawerItemsList');
    const dashboard = document.getElementById('drawerAnalysisDashboard');
    const footer = document.getElementById('drawerFooter');
    const subtotalText = document.getElementById('drawerSubtotal');
    
    if (culinaryPlan.length === 0) {
        emptyState.classList.remove('d-none');
        itemsList.classList.add('d-none');
        dashboard.classList.add('d-none');
        footer.classList.add('d-none');
        return;
    }
    
    emptyState.classList.add('d-none');
    itemsList.classList.remove('d-none');
    dashboard.classList.remove('d-none');
    footer.classList.remove('d-none');
    
    itemsList.innerHTML = '';
    let subtotal = 0;
    
    culinaryPlan.forEach(item => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        const itemRow = document.createElement('div');
        itemRow.className = 'drawer-item';
        itemRow.innerHTML = `
            <div class="flex-grow-1 me-3">
                <div class="drawer-item-title">${item.name}</div>
                <div class="drawer-item-category">${item.category} &bull; ₹${item.price}</div>
            </div>
            <div class="d-flex align-items-center gap-3">
                <div class="drawer-item-qty">
                    <button class="qty-btn" onclick="adjustItemQty('${item.name}', -1)">&minus;</button>
                    <span class="qty-val">${item.quantity}</span>
                    <button class="qty-btn" onclick="adjustItemQty('${item.name}', 1)">&plus;</button>
                </div>
                <button class="drawer-item-remove" onclick="adjustItemQty('${item.name}', -999)" aria-label="Remove item">
                    <i class="fas fa-trash-alt"></i>
                </button>
            </div>
        `;
        itemsList.appendChild(itemRow);
    });
    
    subtotalText.innerText = `₹${subtotal.toLocaleString()}`;
}

// Live flavor and dietary stats checker
function analyzeFlavorProfile() {
    const spicyCountEl = document.getElementById('spicyCount');
    const vegBadgeEl = document.getElementById('vegVegBadge');
    const glutenWarning = document.getElementById('glutenWarningBox');
    
    let totalItems = 0;
    let spicyItems = 0;
    let vegItems = 0;
    let containsGluten = false;
    
    culinaryPlan.forEach(item => {
        totalItems += item.quantity;
        if (item.spicy) spicyItems += item.quantity;
        if (item.veg) vegItems += item.quantity;
        if (item.gluten) containsGluten = true;
    });
    
    // Spiciness index
    if (spicyItems === 0) {
        spicyCountEl.innerText = 'None';
    } else if (spicyItems === 1) {
        spicyCountEl.innerText = 'Mild 🔥';
    } else if (spicyItems <= 3) {
        spicyCountEl.innerText = 'Medium 🔥🔥';
    } else {
        spicyCountEl.innerText = 'Fiery 🌶️🌶️🌶️';
    }
    
    // Vegetarian count
    if (vegItems === totalItems && totalItems > 0) {
        vegBadgeEl.innerText = '100% Veg 🌱';
    } else {
        vegBadgeEl.innerText = `${vegItems} of ${totalItems} Veg`;
    }
    
    // Gluten alert
    if (containsGluten) {
        glutenWarning.classList.remove('d-none');
    } else {
        glutenWarning.classList.add('d-none');
    }
}

// Booking Interconnect
function integrateIntoReservation() {
    if (culinaryPlan.length === 0) return;
    
    const specialRequestBox = document.getElementById('special');
    if (!specialRequestBox) return;
    
    let summary = "Integrated Culinary Plan:\n";
    culinaryPlan.forEach(item => {
        summary += `- ${item.name} x${item.quantity} (${item.category})\n`;
    });
    
    const subtotal = culinaryPlan.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    summary += `Estimated Subtotal: ₹${subtotal.toLocaleString()}\n`;
    
    specialRequestBox.value = summary;
    
    const drawer = document.getElementById('culinaryDrawer');
    if (drawer) drawer.classList.remove('open');
    
    const reservationSec = document.getElementById('reservation');
    if (reservationSec) {
        scrollToSection(reservationSec);
        
        const formCard = reservationSec.querySelector('.reservation-form');
        if (formCard) {
            formCard.classList.add('highlight-pulse');
            setTimeout(() => {
                formCard.classList.remove('highlight-pulse');
            }, 5000);
        }
    }
    
    showNotification("Plan linked! Details injected into Reservation Specials.", "success");
}

// Client Side +1 Floating Effect
function spawnFlyoutParticle(event) {
    if (!event) return;
    const particle = document.createElement('div');
    particle.className = 'flying-particle';
    particle.innerText = '+1';
    
    particle.style.left = `${event.clientX}px`;
    particle.style.top = `${event.clientY}px`;
    
    document.body.appendChild(particle);
    
    setTimeout(() => {
        particle.remove();
    }, 1000);
}

// Interactive Parallax Hero Effect
function initHeroParallax() {
    window.addEventListener('mousemove', function(e) {
        const heroSection = document.querySelector('.hero-section');
        const heroOverlay = document.querySelector('.hero-overlay');
        const heroContent = document.querySelector('.hero-content');
        
        if (!heroSection || !heroOverlay || !heroContent) return;
        
        // Calculate move depth based on mouse position from center
        const width = window.innerWidth;
        const height = window.innerHeight;
        const moveX = (e.clientX - width / 2) / (width / 2) * 15; // move range 15px
        const moveY = (e.clientY - height / 2) / (height / 2) * 15;
        
        heroOverlay.style.transform = `translate(${moveX * -0.5}px, ${moveY * -0.5}px)`;
        heroContent.style.transform = `translate(${moveX * 0.3}px, ${moveY * 0.3}px)`;
    });
}

// ==================== 
// USER AUTHENTICATION STATE & SYSTEM ENGINE
// ==================== 

let currentUser = null;
let authToken = null;

// Initialize Authentication on load
async function initAuthentication() {
    authToken = localStorage.getItem('culinary_token');
    if (!authToken) {
        updateAuthUI();
        return;
    }
    
    try {
        const response = await fetch('/api/auth/me', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        if (response.ok) {
            currentUser = await response.json();
            updateAuthUI();
        } else {
            // Token expired or invalid
            localStorage.removeItem('culinary_token');
            authToken = null;
            currentUser = null;
            updateAuthUI();
        }
    } catch (err) {
        console.error('Failed to initialize auth:', err);
        updateAuthUI();
    }
}

// Update UI depending on Auth State
function updateAuthUI() {
    const navAuthSection = document.getElementById('navAuthSection');
    const navUserDropdown = document.getElementById('navUserDropdown');
    const navUsername = document.getElementById('navUsername');
    
    if (currentUser && authToken) {
        if (navAuthSection) navAuthSection.classList.add('d-none');
        if (navUserDropdown) {
            navUserDropdown.classList.remove('d-none');
            if (navUsername) navUsername.innerText = currentUser.username;
        }
        
        // Populate modal headers
        const bookingsTitle = document.getElementById('bookingsUserTitle');
        const bookingsEmail = document.getElementById('bookingsUserEmail');
        if (bookingsTitle) bookingsTitle.innerText = currentUser.username;
        if (bookingsEmail) bookingsEmail.innerText = currentUser.email;
    } else {
        if (navAuthSection) navAuthSection.classList.remove('d-none');
        if (navUserDropdown) navUserDropdown.classList.add('d-none');
    }
}

// Hook up Auth Forms (Login / Signup) and actions
function setupAuthEventListeners() {
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const logoutBtn = document.getElementById('logoutBtn');
    const bookingsModalEl = document.getElementById('bookingsModal');
    
    // Login Submission
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            
            const submitBtn = loginForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Signing In...';
            
            try {
                const response = await fetch('/api/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    authToken = data.token;
                    currentUser = data.user;
                    localStorage.setItem('culinary_token', authToken);
                    
                    updateAuthUI();
                    showNotification(`Welcome back, ${currentUser.username}!`, 'success');
                    
                    // Hide auth modal using Bootstrap API
                    const authModalEl = document.getElementById('authModal');
                    const modalInstance = bootstrap.Modal.getInstance(authModalEl) || new bootstrap.Modal(authModalEl);
                    modalInstance.hide();
                    
                    loginForm.reset();
                } else {
                    showNotification(data.message || 'Login failed, please check credentials.', 'error');
                }
            } catch (err) {
                console.error('Login submit error:', err);
                showNotification('Network connection error. Try again.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }
    
    // Signup Submission
    if (signupForm) {
        signupForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const username = document.getElementById('signupUsername').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('signupConfirmPassword').value;
            
            // Password Matching Check
            if (password !== confirmPassword) {
                showNotification('Passwords do not match.', 'error');
                document.getElementById('signupConfirmPassword').classList.add('is-invalid');
                document.getElementById('confirmPasswordFeedback').classList.remove('d-none');
                return;
            }
            
            // Password Strength Score Validation (Require Medium/Strong)
            const score = calculatePasswordStrength(password);
            if (score < 2) {
                showNotification('Your password is too weak. Please follow the checklist criteria.', 'error');
                document.getElementById('signupPassword').focus();
                return;
            }
            
            const submitBtn = signupForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin me-2"></i>Registering...';
            
            try {
                const response = await fetch('/api/auth/signup', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, email, password })
                });
                
                const data = await response.json();
                
                if (response.ok) {
                    authToken = data.token;
                    currentUser = data.user;
                    localStorage.setItem('culinary_token', authToken);
                    
                    updateAuthUI();
                    showNotification(`Account created! Welcome, ${currentUser.username}!`, 'success');
                    
                    // Hide auth modal
                    const authModalEl = document.getElementById('authModal');
                    const modalInstance = bootstrap.Modal.getInstance(authModalEl) || new bootstrap.Modal(authModalEl);
                    modalInstance.hide();
                    
                    signupForm.reset();
                } else {
                    showNotification(data.message || 'Registration failed.', 'error');
                }
            } catch (err) {
                console.error('Signup submit error:', err);
                showNotification('Network connection error. Try again.', 'error');
            } finally {
                submitBtn.disabled = false;
                submitBtn.innerHTML = originalText;
            }
        });
    }
    
    // Logout Action
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            currentUser = null;
            authToken = null;
            localStorage.removeItem('culinary_token');
            
            updateAuthUI();
            showNotification('You have been logged out successfully.', 'success');
        });
    }
    
    // Fetch bookings when history modal is shown
    if (bookingsModalEl) {
        bookingsModalEl.addEventListener('show.bs.modal', fetchAndRenderBookings);
    }
}

// Fetch user bookings and render dynamically
async function fetchAndRenderBookings() {
    const listContainer = document.getElementById('bookingsListContainer');
    const emptyState = document.getElementById('bookingsEmptyState');
    
    if (!listContainer) return;
    
    if (!authToken || !currentUser) {
        listContainer.innerHTML = '';
        if (emptyState) emptyState.classList.remove('d-none');
        return;
    }
    
    listContainer.innerHTML = '<div class="text-center py-5 text-muted"><i class="fas fa-spinner fa-spin fa-2x text-primary-color mb-3"></i><p>Retrieving your bookings...</p></div>';
    if (emptyState) emptyState.classList.add('d-none');
    
    try {
        const response = await fetch('/api/reservations/my-bookings', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${authToken}`
            }
        });
        
        const bookings = await response.json();
        
        if (response.ok) {
            listContainer.innerHTML = '';
            
            if (bookings.length === 0) {
                if (emptyState) emptyState.classList.remove('d-none');
                return;
            }
            
            if (emptyState) emptyState.classList.add('d-none');
            
            bookings.forEach(booking => {
                const card = document.createElement('div');
                card.className = 'booking-history-card';
                
                // Formulate culinary plan item rows if plan exists
                let planHtml = '';
                if (booking.culinaryPlan && booking.culinaryPlan.length > 0) {
                    let totalPlanPrice = 0;
                    const itemsRows = booking.culinaryPlan.map(item => {
                        const itemCost = item.price * item.quantity;
                        totalPlanPrice += itemCost;
                        return `
                            <div class="col-md-6 mb-2">
                                <div class="booking-plan-item d-flex justify-content-between align-items-center">
                                    <span>
                                        <strong class="text-white">${item.name}</strong> 
                                        <small class="text-muted">x${item.quantity}</small>
                                    </span>
                                    <span class="booking-plan-item-price">₹${itemCost.toLocaleString()}</span>
                                </div>
                            </div>
                        `;
                    }).join('');
                    
                    planHtml = `
                        <div class="booking-plan-details mt-3 pt-3 border-top border-secondary">
                            <h6 class="text-primary-color uppercase small mb-2 tracking-wide"><i class="fas fa-utensils me-2"></i>Integrated Culinary Plan</h6>
                            <div class="row g-2">
                                ${itemsRows}
                            </div>
                            <div class="booking-plan-subtotal d-flex justify-content-between align-items-center mt-2 pt-2 text-muted small">
                                <span>Plan Subtotal:</span>
                                <strong class="text-white">₹${totalPlanPrice.toLocaleString()}</strong>
                            </div>
                        </div>
                    `;
                }
                
                // Formulate special requests notes display
                const notesHtml = booking.special ? `
                    <div class="booking-notes mt-2 small text-muted">
                        <strong><i class="far fa-comment-alt me-1 text-primary-color"></i> Requests:</strong>
                        <p class="mb-0 mt-1 fst-italic text-white-50">${booking.special.replace(/\n/g, '<br>')}</p>
                    </div>
                ` : '';
                
                // Build the full layout card
                card.innerHTML = `
                    <div class="booking-card-header d-flex justify-content-between align-items-start pb-2 mb-2">
                        <div>
                            <span class="booking-date-badge"><i class="far fa-calendar-alt me-1"></i>${booking.date}</span>
                            <span class="booking-detail-badge ms-2"><i class="far fa-clock me-1"></i>${booking.time}</span>
                        </div>
                        <span class="badge rounded-pill bg-success-subtle text-success border border-success-subtle px-3 py-1"><i class="fas fa-check-circle me-1"></i>Confirmed</span>
                    </div>
                    <div class="row g-2 py-1 text-muted small">
                        <div class="col-sm-6">
                            <span><i class="fas fa-user-friends me-2"></i>Guests: <strong class="text-white">${booking.guests}</strong></span>
                        </div>
                        <div class="col-sm-6">
                            <span><i class="fas fa-phone-alt me-2"></i>Phone: <strong class="text-white">${booking.phone}</strong></span>
                        </div>
                    </div>
                    ${notesHtml}
                    ${planHtml}
                `;
                
                listContainer.appendChild(card);
            });
        } else {
            listContainer.innerHTML = '';
            if (emptyState) emptyState.classList.remove('d-none');
            showNotification(bookings.message || 'Could not load reservations history.', 'error');
        }
    } catch (err) {
        console.error('Fetch bookings error:', err);
        listContainer.innerHTML = '';
        if (emptyState) emptyState.classList.remove('d-none');
        showNotification('Failed to connect to reservations database.', 'error');
    }
}

// Wire everything up to DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    try {
        initAdvancedCulinaryFeatures();
    } catch (e) { console.error('Error in initAdvancedCulinaryFeatures:', e); }

    try {
        initHeroParallax();
    } catch (e) { console.error('Error in initHeroParallax:', e); }
    
    // Initialize full-stack authentication system
    try {
        initAuthentication();
    } catch (e) { console.error('Error in initAuthentication:', e); }

    try {
        setupAuthEventListeners();
    } catch (e) { console.error('Error in setupAuthEventListeners:', e); }
    
    // Task 4 Initializations
    try {
        setupPasswordValidation();
    } catch (e) { console.error('Error in setupPasswordValidation:', e); }

    try {
        setupReservationValidation();
    } catch (e) { console.error('Error in setupReservationValidation:', e); }

    try {
        setupLiveTicketInteraction();
    } catch (e) { console.error('Error in setupLiveTicketInteraction:', e); }

    try {
        updateLiveTicket();
    } catch (e) { console.error('Error in updateLiveTicket:', e); }
    
    // Initial router transition check
    try {
        handleRouting();
    } catch (e) { console.error('Error in handleRouting:', e); }
});

console.log('Restaurant Landing Page Engine Initialized Successfully!');

// ==================== 
// SPA CLIENT-SIDE ROUTER ENGINE
// ==================== 

function handleRouting() {
    let hash = window.location.hash || '#home';
    if (hash.startsWith('#/')) {
        hash = '#' + hash.substring(2);
    }
    
    const sections = document.querySelectorAll('.app-section');
    let targetSection = null;
    
    try {
        if (hash && hash !== '#') {
            targetSection = document.querySelector(hash);
        }
    } catch (e) {
        console.error('Invalid route hash:', hash);
    }
    
    if (!targetSection) {
        hash = '#home';
        targetSection = document.getElementById('home');
    }
    
    sections.forEach(sec => {
        sec.classList.remove('route-active');
    });
    
    if (targetSection) {
        targetSection.classList.add('route-active');
        scrollToSection(targetSection);
    }
    
    // Update active nav link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        const href = link.getAttribute('href');
        if (href === hash || (hash === '#home' && href === '#') || href === '#/' + hash.substring(1)) {
            link.classList.add('active');
            link.style.color = 'var(--primary-color)';
        } else {
            link.classList.remove('active');
            link.style.color = '#fff';
        }
    });
    
}

function scrollToSection(sectionElement) {
    if (!sectionElement) return;

    const navbar = document.querySelector('.navbar');
    const navbarOffset = navbar ? navbar.offsetHeight + 12 : 80;
    const targetTop = Math.max(0, sectionElement.offsetTop - navbarOffset);
    animateScrollTo(targetTop, 700);
    pulseSection(sectionElement);
}

function animateScrollTo(targetTop, duration = 700) {
    window.scrollTo(0, targetTop);
}

function pulseSection(sectionElement) {
    sectionElement.classList.remove('scroll-target-highlight');
    void sectionElement.offsetWidth;
    sectionElement.classList.add('scroll-target-highlight');

    clearTimeout(sectionElement._scrollPulseTimer);
    sectionElement._scrollPulseTimer = setTimeout(() => {
        sectionElement.classList.remove('scroll-target-highlight');
    }, 1200);
}

// Add event listeners for routing
window.addEventListener('hashchange', handleRouting);
window.addEventListener('load', handleRouting);

// ==================== 
// COMPLEX PASSWORD VALIDATION & MATCHING
// ==================== 

function calculatePasswordStrength(password) {
    let score = 0;
    if (!password) return 0;
    
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) score++;
    
    return score;
}

function setupPasswordValidation() {
    const pwdInput = document.getElementById('signupPassword');
    const confirmInput = document.getElementById('signupConfirmPassword');
    const strengthBar = document.getElementById('passwordStrengthBar');
    const feedback = document.getElementById('passwordFeedback');
    const confirmFeedback = document.getElementById('confirmPasswordFeedback');
    
    if (!pwdInput) return;
    
    pwdInput.addEventListener('input', function() {
        const val = pwdInput.value;
        const score = calculatePasswordStrength(val);
        
        // Update bar width and coloring classes
        strengthBar.className = 'progress-bar';
        strengthBar.style.width = `${score * 25}%`;
        
        if (val.length === 0) {
            strengthBar.style.width = '0%';
            feedback.innerText = 'Strength: Too Short';
            feedback.className = 'form-text text-muted';
        } else if (score <= 1) {
            strengthBar.classList.add('weak');
            feedback.innerText = 'Strength: Weak (Check criteria)';
            feedback.className = 'form-text text-danger';
        } else if (score <= 3) {
            strengthBar.classList.add('medium');
            feedback.innerText = 'Strength: Medium (Fair)';
            feedback.className = 'form-text text-warning';
        } else {
            strengthBar.classList.add('strong');
            feedback.innerText = 'Strength: Strong';
            feedback.className = 'form-text text-success';
        }
        
        // Toggle checklist classes
        toggleCriterion('crit-length', val.length >= 6);
        toggleCriterion('crit-upper', /[A-Z]/.test(val));
        toggleCriterion('crit-number', /[0-9]/.test(val));
        toggleCriterion('crit-special', /[!@#$%^&*(),.?":{}|<>]/.test(val));
        
        // Check matching inline if confirm field has text
        if (confirmInput.value) {
            validatePasswordMatching();
        }
    });
    
    if (confirmInput) {
        confirmInput.addEventListener('input', validatePasswordMatching);
    }
    
    function toggleCriterion(id, isMet) {
        const el = document.getElementById(id);
        if (!el) return;
        
        const icon = el.querySelector('i');
        if (isMet) {
            el.className = 'col-6 text-success';
            if (icon) icon.className = 'fas fa-check-circle me-1';
        } else {
            el.className = 'col-6 text-danger';
            if (icon) icon.className = 'fas fa-times-circle me-1';
        }
    }
    
    function validatePasswordMatching() {
        if (pwdInput.value === confirmInput.value) {
            confirmInput.classList.remove('is-invalid');
            confirmInput.classList.add('is-valid');
            confirmFeedback.classList.add('d-none');
            return true;
        } else {
            confirmInput.classList.remove('is-valid');
            confirmInput.classList.add('is-invalid');
            confirmFeedback.classList.remove('d-none');
            return false;
        }
    }
}

// ==================== 
// RESERVATION FIELD VALIDATIONS
// ==================== 

function validateName() {
    const input = document.getElementById('name');
    const feedback = document.getElementById('nameFeedback');
    const isValid = input.value.trim().length >= 3;
    
    toggleValidationState(input, feedback, isValid);
    return isValid;
}

// Global visibility toggle for reservation validations
function toggleValidationState(input, feedback, isValid) {
    if (isValid) {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
        feedback.classList.add('d-none');
    } else {
        input.classList.remove('is-valid');
        input.classList.add('is-invalid');
        feedback.classList.remove('d-none');
    }
}

function validateEmail() {
    const input = document.getElementById('email');
    const feedback = document.getElementById('emailFeedback');
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = regex.test(input.value.trim());
    
    toggleValidationState(input, feedback, isValid);
    return isValid;
}

function validatePhone() {
    const input = document.getElementById('phone');
    const feedback = document.getElementById('phoneFeedback');
    const rawVal = input.value.replace(/\D/g, '');
    const isValid = rawVal.length === 10;
    
    toggleValidationState(input, feedback, isValid);
    return isValid;
}

function validateGuests() {
    const input = document.getElementById('guests');
    const feedback = document.getElementById('guestsFeedback');
    const isValid = input.value !== '';
    
    toggleValidationState(input, feedback, isValid);
    return isValid;
}

function validateDate() {
    const input = document.getElementById('date');
    const feedback = document.getElementById('dateFeedback');
    if (!input.value) {
        toggleValidationState(input, feedback, false);
        return false;
    }
    
    const selected = new Date(input.value);
    const today = new Date();
    today.setHours(0,0,0,0);
    
    const isValid = selected >= today;
    toggleValidationState(input, feedback, isValid);
    return isValid;
}

function validateTime() {
    const input = document.getElementById('time');
    const feedback = document.getElementById('timeFeedback');
    if (!input.value) {
        toggleValidationState(input, feedback, false);
        return false;
    }
    
    const parts = input.value.split(':');
    const hours = parseInt(parts[0], 10);
    // Business hours: 5:00 PM to 11:00 PM (17:00 to 23:00)
    const isValid = hours >= 17 && hours <= 23;
    
    toggleValidationState(input, feedback, isValid);
    return isValid;
}

function setupReservationValidation() {
    const nameEl = document.getElementById('name');
    const emailEl = document.getElementById('email');
    const phoneEl = document.getElementById('phone');
    const guestsEl = document.getElementById('guests');
    const dateEl = document.getElementById('date');
    const timeEl = document.getElementById('time');
    
    if (!nameEl) return;
    
    nameEl.addEventListener('input', () => { validateName(); updateLiveTicket(); });
    emailEl.addEventListener('input', () => { validateEmail(); updateLiveTicket(); });
    
    phoneEl.addEventListener('input', function() {
        // Format layout value in real-time
        this.value = this.value.replace(/\D/g, '').substring(0, 10);
        validatePhone();
        updateLiveTicket();
    });
    
    guestsEl.addEventListener('change', () => { validateGuests(); updateLiveTicket(); });
    dateEl.addEventListener('change', () => { validateDate(); updateLiveTicket(); });
    timeEl.addEventListener('change', () => { validateTime(); updateLiveTicket(); });
}

// ==================== 
// LIVE PREVIEW TICKET ENGINE & SUGGESTIONS
// ==================== 

let activeSeatingZone = "Main Hall";

function setupLiveTicketInteraction() {
    const zoneBtns = document.querySelectorAll('.seating-zone-btn');
    zoneBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            zoneBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            activeSeatingZone = this.getAttribute('data-zone');
            updateLiveTicket();
        });
    });
}

function updateLiveTicket() {
    const name = document.getElementById('name')?.value.trim() || "Gourmet Guest";
    const guests = document.getElementById('guests')?.value || "TBD";
    const dateVal = document.getElementById('date')?.value;
    const timeVal = document.getElementById('time')?.value;
    
    // Formatting Name
    const nameNode = document.getElementById('ticketName');
    if (nameNode) nameNode.innerText = name;
    
    // Formatting Date
    const dateNode = document.getElementById('ticketDate');
    if (dateNode) {
        if (dateVal) {
            const options = { year: 'numeric', month: 'short', day: 'numeric' };
            const dObj = new Date(dateVal);
            dateNode.innerHTML = `<i class="far fa-calendar-alt text-primary-color me-1"></i>${dObj.toLocaleDateString('en-US', options)}`;
        } else {
            dateNode.innerHTML = `<i class="far fa-calendar-alt text-primary-color me-1"></i>TBD`;
        }
    }
    
    // Formatting Time
    const timeNode = document.getElementById('ticketTime');
    if (timeNode) {
        if (timeVal) {
            const parts = timeVal.split(':');
            let hr = parseInt(parts[0], 10);
            const min = parts[1];
            const ampm = hr >= 12 ? 'PM' : 'AM';
            hr = hr % 12;
            hr = hr ? hr : 12; // 0 should be 12
            timeNode.innerHTML = `<i class="far fa-clock text-primary-color me-1"></i>${hr}:${min} ${ampm}`;
        } else {
            timeNode.innerHTML = `<i class="far fa-clock text-primary-color me-1"></i>TBD`;
        }
    }
    
    // Formatting Guests Count
    const guestsNode = document.getElementById('ticketGuests');
    if (guestsNode) {
        guestsNode.innerHTML = `<i class="fas fa-user-friends text-primary-color me-1"></i>${guests === '' ? 'TBD' : guests + (guests === '1' ? ' Guest' : ' Guests')}`;
    }
    
    // Formatting Seating Zone
    const zoneNode = document.getElementById('ticketZone');
    if (zoneNode) {
        zoneNode.innerHTML = `<i class="fas fa-chair text-primary-color me-1"></i>${activeSeatingZone}`;
    }
    
    // Render Culinary Plan items inside Ticket
    const planItemsContainer = document.getElementById('ticketPlanItems');
    const planTotalWrapper = document.getElementById('ticketPlanTotal');
    const subtotalText = document.getElementById('ticketSubtotalVal');
    
    if (planItemsContainer) {
        if (culinaryPlan.length === 0) {
            planItemsContainer.innerHTML = `<div class="text-muted small fst-italic">No items added to plan. Explore our menu to personalize your dining itinerary!</div>`;
            if (planTotalWrapper) planTotalWrapper.classList.add('d-none');
        } else {
            planItemsContainer.innerHTML = '';
            if (planTotalWrapper) planTotalWrapper.classList.remove('d-none');
            
            let subtotal = 0;
            culinaryPlan.forEach(item => {
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                
                const row = document.createElement('div');
                row.className = 'ticket-plan-item-row';
                row.innerHTML = `
                    <span><strong>${item.name}</strong> <small class="text-muted">x${item.quantity}</small></span>
                    <span class="text-primary-color">₹${itemTotal.toLocaleString()}</span>
                `;
                planItemsContainer.appendChild(row);
            });
            
            if (subtotalText) subtotalText.innerText = `₹${subtotal.toLocaleString()}`;
        }
    }
    
    // Analyze dietary warnings and pairing recommendations
    analyzeDietaryForTicket();
}

function analyzeDietaryForTicket() {
    const alertBox = document.getElementById('ticketDietaryAlert');
    if (!alertBox) return;
    
    if (culinaryPlan.length === 0) {
        alertBox.className = 'ticket-dietary-alert p-2.5 rounded mt-3 d-none';
        return;
    }
    
    let totalItems = 0;
    let spicyItems = 0;
    let vegItems = 0;
    let containsGluten = false;
    let isBeveragePresent = false;
    let isAppetizerPresent = false;
    let isMainPresent = false;
    
    culinaryPlan.forEach(item => {
        totalItems += item.quantity;
        if (item.spicy) spicyItems += item.quantity;
        if (item.veg) vegItems += item.quantity;
        if (item.gluten) containsGluten = true;
        if (item.category.toLowerCase().includes('beverage')) isBeveragePresent = true;
        if (item.category.toLowerCase().includes('appetizer')) isAppetizerPresent = true;
        if (item.category.toLowerCase().includes('main')) isMainPresent = true;
    });
    
    alertBox.classList.remove('d-none');
    
    if (containsGluten) {
        alertBox.className = 'ticket-dietary-alert p-2.5 rounded mt-3 alert-warning';
        alertBox.innerHTML = `<i class="fas fa-exclamation-triangle me-2"></i><strong>Gluten Warning:</strong> Some selections in your itinerary contain Gluten. Let us know if you require substitutions.`;
    } else if (spicyItems > 0 && !isBeveragePresent) {
        alertBox.className = 'ticket-dietary-alert p-2.5 rounded mt-3 alert-warning';
        alertBox.innerHTML = `<i class="fas fa-pepper-hot me-2"></i><strong>Heat Level Active!</strong> Consider pairing with our Signature Cocktail or Premium Red Wine to balance the spices.`;
    } else if (vegItems === totalItems && totalItems > 0) {
        alertBox.className = 'ticket-dietary-alert p-2.5 rounded mt-3 alert-success';
        alertBox.innerHTML = `<i class="fas fa-leaf me-2"></i><strong>100% Vegetarian Feast:</strong> Your plan contains purely vegetarian items. Perfect green choice!`;
    } else if (isMainPresent && !isAppetizerPresent) {
        alertBox.className = 'ticket-dietary-alert p-2.5 rounded mt-3 alert-info';
        alertBox.innerHTML = `<i class="fas fa-utensils me-2"></i><strong>Pairing Suggestion:</strong> Complete your meal with a starter! Try adding Crispy Calamari or Garlic Bruschetta to your plan.`;
    } else {
        alertBox.className = 'ticket-dietary-alert p-2.5 rounded mt-3 alert-info';
        alertBox.innerHTML = `<i class="fas fa-wine-glass-alt me-2"></i><strong>Chef's Pairing:</strong> Enhance your culinary experience with Napa Valley Cabernet Sauvignon (Premium Red Wine).`;
    }
}

