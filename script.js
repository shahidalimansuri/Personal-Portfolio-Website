// ==========================================
// 1. Stars Background (Canvas)
// ==========================================
const canvas = document.getElementById('starsCanvas');
const ctx = canvas.getContext('2d');

let stars = [];
const numStars = 150;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 1; // Slightly larger for star shapes
        this.baseAlpha = Math.random() * 0.5 + 0.1;
        this.alpha = this.baseAlpha;
        this.twinkleSpeed = Math.random() * 0.02 + 0.005;
    }

    draw() {
        ctx.fillStyle = `rgba(212, 175, 55, ${this.alpha})`;
        ctx.beginPath();
        const spikes = 5;
        const outerRadius = this.size;
        const innerRadius = this.size / 2;
        let rot = Math.PI / 2 * 3;
        let x = this.x;
        let y = this.y;
        let step = Math.PI / spikes;

        ctx.moveTo(this.x, this.y - outerRadius);
        for (let i = 0; i < spikes; i++) {
            x = this.x + Math.cos(rot) * outerRadius;
            y = this.y + Math.sin(rot) * outerRadius;
            ctx.lineTo(x, y);
            rot += step;

            x = this.x + Math.cos(rot) * innerRadius;
            y = this.y + Math.sin(rot) * innerRadius;
            ctx.lineTo(x, y);
            rot += step;
        }
        ctx.lineTo(this.x, this.y - outerRadius);
        ctx.closePath();
        ctx.fill();
    }

    update() {
        this.alpha += this.twinkleSpeed;
        if (this.alpha <= 0.1 || this.alpha >= this.baseAlpha + 0.5) {
            this.twinkleSpeed *= -1;
        }
        this.draw();
    }
}

function initStars() {
    stars = [];
    for (let i = 0; i < numStars; i++) {
        stars.push(new Star());
    }
}

function animateStars() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < stars.length; i++) {
        stars[i].update();
    }
    requestAnimationFrame(animateStars);
}

initStars();
animateStars();

// ==========================================
// 2. Click Ripple Effect
// ==========================================
document.addEventListener('click', function(e) {
    const ripple = document.createElement('div');
    ripple.classList.add('click-ripple');
    
    // Position at cursor
    ripple.style.left = `${e.clientX}px`;
    ripple.style.top = `${e.clientY}px`;
    
    document.body.appendChild(ripple);
    
    // Remove after animation finishes (0.6s)
    setTimeout(() => {
        ripple.remove();
    }, 600);
});

// ==========================================
// 3. Navbar Behavior & Smooth Scroll
// ==========================================
const navbar = document.getElementById('navbar');
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const navItems = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');

// Scrolled Navbar Style & Progress Bar
window.addEventListener('scroll', () => {
    // Scroll Progress Bar
    const scrollProgress = document.getElementById('scroll-progress');
    if (scrollProgress) {
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        scrollProgress.style.width = `${progress}%`;
    }

    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }

    // Active Section Highlighting
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 150) {
            current = section.getAttribute('id');
        }
    });

    navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('href').substring(1) === current) {
            item.classList.add('active');
        }
    });
});

// Mobile Menu Toggle
hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    const icon = hamburger.querySelector('i');
    if (navLinks.classList.contains('active')) {
        icon.classList.remove('fa-bars');
        icon.classList.add('fa-times');
    } else {
        icon.classList.remove('fa-times');
        icon.classList.add('fa-bars');
    }
});

// Close Mobile Menu on Link Click
navItems.forEach(item => {
    item.addEventListener('click', () => {
        navLinks.classList.remove('active');
        hamburger.querySelector('i').classList.remove('fa-times');
        hamburger.querySelector('i').classList.add('fa-bars');
    });
});

// ==========================================
// 4. GSAP ScrollTrigger Animations
// ==========================================
if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    // Section Titles
    gsap.utils.toArray('.section-title').forEach(title => {
        gsap.from(title, {
            scrollTrigger: {
                trigger: title,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power3.out"
        });
    });

    // About Content
    gsap.from('.about-image', {
        scrollTrigger: { trigger: '.about-content', start: "top 75%" },
        x: -50, opacity: 0, duration: 1, ease: "power3.out"
    });
    gsap.from('.about-text', {
        scrollTrigger: { trigger: '.about-content', start: "top 75%" },
        x: 50, opacity: 0, duration: 1, ease: "power3.out"
    });

    // Skills
    gsap.from('.skill-category', {
        scrollTrigger: { trigger: '.skills-grid', start: "top 80%" },
        y: 50, opacity: 0, duration: 0.8, stagger: 0.2, ease: "power3.out"
    });
    
    // Skill bars animation
    gsap.utils.toArray('.skill-level').forEach(bar => {
        const targetWidth = bar.style.width;
        bar.style.width = '0%';
        gsap.to(bar, {
            scrollTrigger: { trigger: bar, start: "top 90%" },
            width: targetWidth,
            duration: 1.5,
            ease: "power3.out"
        });
    });


    // Projects
    gsap.from('.project-card', {
        scrollTrigger: { trigger: '.projects-grid', start: "top 80%" },
        y: 50, opacity: 0, duration: 0.8, stagger: 0.2, ease: "power3.out"
    });
}

// ==========================================
// 5. Testimonial Slider
// ==========================================
const testimonials = document.querySelectorAll('.testimonial-card');
const prevBtn = document.getElementById('prevTestimonial');
const nextBtn = document.getElementById('nextTestimonial');
let currentTestimonial = 0;

function showTestimonial(index) {
    testimonials.forEach((card, i) => {
        card.classList.remove('active');
        if (i === index) {
            card.classList.add('active');
        }
    });
}

if (prevBtn && nextBtn) {
    nextBtn.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial + 1) % testimonials.length;
        showTestimonial(currentTestimonial);
    });

    prevBtn.addEventListener('click', () => {
        currentTestimonial = (currentTestimonial - 1 + testimonials.length) % testimonials.length;
        showTestimonial(currentTestimonial);
    });
}

// Auto slide every 5 seconds
setInterval(() => {
    currentTestimonial = (currentTestimonial + 1) % testimonials.length;
    showTestimonial(currentTestimonial);
}, 5000);

// ==========================================
// 6. Dynamic Year in Footer
// ==========================================
document.getElementById('year').textContent = new Date().getFullYear();

// ==========================================
// 7. Typing Animation
// ==========================================
const roles = [
    "Web Developer",
    "Digital Artist"
];
const typingElement = document.getElementById('typing-text');
let roleIndex = 0;
let charIndex = 0;
let currentText = "";
let isDeleting = false;

function typeWords() {
    if (!typingElement) return;
    const currentRole = roles[roleIndex];
    
    if (isDeleting) {
        currentText = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        currentText = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }
    
    typingElement.innerHTML = currentText + '<span class="cursor">|</span>';
    
    let typingSpeed = isDeleting ? 50 : 100;
    
    if (!isDeleting && charIndex === currentRole.length) {
        typingSpeed = 2000; // Pause at end of word
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        typingSpeed = 500; // Pause before typing next word
    }
    
    setTimeout(typeWords, typingSpeed);
}

// Start
setTimeout(typeWords, 1000);
