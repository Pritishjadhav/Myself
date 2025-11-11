// ========================================
// INTERACTIVE SPIDER WEB ILLUSION
// ========================================

// Create canvas for spider web
const webCanvas = document.createElement('canvas');
webCanvas.id = 'spider-web-canvas';
document.body.insertBefore(webCanvas, document.body.firstChild);
const webCtx = webCanvas.getContext('2d');

// Canvas setup
function resizeWebCanvas() {
    webCanvas.width = window.innerWidth;
    webCanvas.height = window.innerHeight;
    initWeb();
}

// Web node class - connection points in the web
class WebNode {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.originalX = x;
        this.originalY = y;
        this.vx = 0;
        this.vy = 0;
    }

    // Update node position based on cursor proximity
    update(mouseX, mouseY) {
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const breakDistance = 150; // Distance at which web breaks

        if (distance < breakDistance) {
            // Push nodes away from cursor
            const force = (breakDistance - distance) / breakDistance;
            const angle = Math.atan2(dy, dx);
            this.vx += Math.cos(angle) * force * 2;
            this.vy += Math.sin(angle) * force * 2;
        }

        // Apply velocity
        this.x += this.vx;
        this.y += this.vy;

        // Return to original position (spring effect)
        const returnForce = 0.05;
        this.vx += (this.originalX - this.x) * returnForce;
        this.vy += (this.originalY - this.y) * returnForce;

        // Damping
        this.vx *= 0.9;
        this.vy *= 0.9;
    }

    draw() {
        // Don't draw nodes for cleaner look
    }
}

// Web connection class - lines between nodes
class WebConnection {
    constructor(node1, node2) {
        this.node1 = node1;
        this.node2 = node2;
        this.maxDistance = this.getDistance();
    }

    getDistance() {
        const dx = this.node1.x - this.node2.x;
        const dy = this.node1.y - this.node2.y;
        return Math.sqrt(dx * dx + dy * dy);
    }

    draw() {
        const distance = this.getDistance();
        const stretchRatio = distance / this.maxDistance;

        // Only draw if not stretched too much (creates break effect)
        if (stretchRatio < 1.5) {
            const opacity = Math.max(0, 1 - (stretchRatio - 1) * 2);
            
            webCtx.beginPath();
            webCtx.moveTo(this.node1.x, this.node1.y);
            webCtx.lineTo(this.node2.x, this.node2.y);
            webCtx.strokeStyle = `rgba(99, 102, 241, ${0.2 * opacity})`;
            webCtx.lineWidth = 0.5;
            webCtx.stroke();
        }
    }
}

let nodes = [];
let connections = [];
let mouseX = -1000;
let mouseY = -1000;

// Initialize simple web structure
function initWeb() {
    nodes = [];
    connections = [];

    const spacing = 150; // Larger spacing for simpler web
    const cols = Math.ceil(webCanvas.width / spacing) + 1;
    const rows = Math.ceil(webCanvas.height / spacing) + 1;

    // Create grid of nodes
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const x = col * spacing;
            const y = row * spacing;
            nodes.push(new WebNode(x, y));
        }
    }

    // Create simple connections - only horizontal and vertical
    for (let row = 0; row < rows; row++) {
        for (let col = 0; col < cols; col++) {
            const index = row * cols + col;
            
            // Connect to right neighbor
            if (col < cols - 1) {
                connections.push(new WebConnection(nodes[index], nodes[index + 1]));
            }
            
            // Connect to bottom neighbor
            if (row < rows - 1) {
                connections.push(new WebConnection(nodes[index], nodes[index + cols]));
            }
        }
    }
}

// Track mouse position
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY + window.scrollY;
});

// Animation loop
function animateWeb() {
    // Clear canvas
    webCtx.clearRect(0, 0, webCanvas.width, webCanvas.height);

    // Update and draw nodes
    nodes.forEach(node => {
        node.update(mouseX, mouseY);
    });

    // Draw connections (web strands)
    connections.forEach(connection => {
        connection.draw();
    });

    // Draw nodes
    nodes.forEach(node => {
        node.draw();
    });

    requestAnimationFrame(animateWeb);
}

// Initialize
resizeWebCanvas();
window.addEventListener('resize', resizeWebCanvas);
animateWeb();

// ========================================
// ORIGINAL WEBSITE FUNCTIONALITY
// ========================================

// Smooth scrolling for navigation links
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

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(15, 23, 42, 0.98)';
        navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.3)';
    } else {
        navbar.style.background = 'rgba(15, 23, 42, 0.95)';
        navbar.style.boxShadow = 'none';
    }
});

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');

menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
});

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(30px)';
    section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(section);
});

// Add typing effect to subtitle
const subtitle = document.querySelector('.subtitle');
const text = subtitle.textContent;
subtitle.textContent = '';
let i = 0;

function typeWriter() {
    if (i < text.length) {
        subtitle.textContent += text.charAt(i);
        i++;
        setTimeout(typeWriter, 50);
    }
}

setTimeout(typeWriter, 1000);


// ========================================
// SCROLL SPY - HIGHLIGHT ACTIVE SECTION
// ========================================

// Get all sections and nav links
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a[href^="#"]');

function highlightActiveSection() {
    const scrollY = window.pageYOffset;
    
    sections.forEach(section => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute('id');
        
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            // Remove active class from all links
            navLinks.forEach(link => {
                link.classList.remove('active');
            });
            
            // Add active class to current section link
            const activeLink = document.querySelector(`.nav-links a[href="#${sectionId}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
}

// Listen to scroll event
window.addEventListener('scroll', highlightActiveSection);

// Call once on page load
highlightActiveSection();




// ========================================
// SKILL CARD SPOTLIGHT EFFECT
// ========================================

const skillCards = document.querySelectorAll('.skill-card');

skillCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});


// ========================================
// CERTIFICATE CAROUSEL - SIMPLE & WORKING
// ========================================

setTimeout(() => {
    const certTrack = document.querySelector('.cert-carousel-track');
    const certCards = document.querySelectorAll('.cert-card-crazy');
    const prevBtn = document.querySelector('.cert-arrow-left');
    const nextBtn = document.querySelector('.cert-arrow-right');

    if (!certTrack || !certCards.length || !prevBtn || !nextBtn) {
        console.log('Carousel not found');
        return;
    }

    console.log('Carousel initialized with', certCards.length, 'cards');

    let currentIndex = 0;

    function updateCarousel() {
        // Calculate offset based on card width
        const cardWidth = certCards[0].offsetWidth;
        const gap = 32; // 2rem
        const moveAmount = (cardWidth + gap) * currentIndex;
        
        certTrack.style.transform = `translateX(-${moveAmount}px)`;
        
        console.log('Moving to index:', currentIndex, 'Offset:', moveAmount);
        
        // Update active card
        certCards.forEach((card, i) => {
            if (i === currentIndex) {
                card.classList.add('active');
            } else {
                card.classList.remove('active');
            }
        });
        
        // Update buttons
        if (currentIndex === 0) {
            prevBtn.style.opacity = '0.3';
            prevBtn.style.cursor = 'not-allowed';
        } else {
            prevBtn.style.opacity = '1';
            prevBtn.style.cursor = 'pointer';
        }
        
        if (currentIndex === certCards.length - 1) {
            nextBtn.style.opacity = '0.3';
            nextBtn.style.cursor = 'not-allowed';
        } else {
            nextBtn.style.opacity = '1';
            nextBtn.style.cursor = 'pointer';
        }
    }

    // Previous button click
    prevBtn.onclick = function() {
        console.log('Prev clicked, current:', currentIndex);
        if (currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        }
    };

    // Next button click
    nextBtn.onclick = function() {
        console.log('Next clicked, current:', currentIndex);
        if (currentIndex < certCards.length - 1) {
            currentIndex++;
            updateCarousel();
        }
    };

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft' && currentIndex > 0) {
            currentIndex--;
            updateCarousel();
        } else if (e.key === 'ArrowRight' && currentIndex < certCards.length - 1) {
            currentIndex++;
            updateCarousel();
        }
    });

    // Initialize
    updateCarousel();
    
    // Auto-scroll
    let autoScroll = setInterval(() => {
        if (currentIndex < certCards.length - 1) {
            currentIndex++;
        } else {
            currentIndex = 0;
        }
        updateCarousel();
    }, 6000);
    
    // Pause on hover
    const carousel = document.querySelector('.cert-carousel');
    carousel.addEventListener('mouseenter', () => clearInterval(autoScroll));
    carousel.addEventListener('mouseleave', () => {
        autoScroll = setInterval(() => {
            if (currentIndex < certCards.length - 1) {
                currentIndex++;
            } else {
                currentIndex = 0;
            }
            updateCarousel();
        }, 6000);
    });
    
}, 500);
