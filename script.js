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
// SMOOTH SCROLL
// ==================== 

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ==================== 
// RESERVATION FORM VALIDATION & SUBMISSION
// ==================== 

reservationForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const guests = document.getElementById('guests').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const special = document.getElementById('special').value.trim();
    
    // Validation
    if (!name || !email || !phone || !guests || !date || !time) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showNotification('Please enter a valid email address', 'error');
        return;
    }
    
    // Phone validation (basic)
    const phoneRegex = /^[\d\s\-\(\)]+$/;
    if (!phoneRegex.test(phone) || phone.replace(/\D/g, '').length < 10) {
        showNotification('Please enter a valid phone number', 'error');
        return;
    }
    
    // Date validation - must be in future
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        showNotification('Please select a future date', 'error');
        return;
    }
    
    // If all validations pass
    showNotification('Reservation request submitted successfully! We will contact you shortly.', 'success');
    
    // Reset form
    setTimeout(() => {
        reservationForm.reset();
    }, 500);
    
    // Log reservation data (in a real app, this would be sent to a server)
    console.log('Reservation Details:', {
        name,
        email,
        phone,
        guests,
        date,
        time,
        special
    });
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
// ACTIVE NAV LINK ON SCROLL
// ==================== 

window.addEventListener('scroll', function() {
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
            link.style.color = 'var(--primary-color)';
        } else {
            link.style.color = '#fff';
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
                menuSec.scrollIntoView({ behavior: 'smooth' });
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
        reservationSec.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
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

// Wire everything up to DOMContentLoaded
document.addEventListener('DOMContentLoaded', function() {
    initAdvancedCulinaryFeatures();
    initHeroParallax();
});

console.log('Restaurant Landing Page Engine Initialized Successfully!');
