document.addEventListener('DOMContentLoaded', () => {
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.hero-slider-dot');
    const prevBtn = document.querySelector('.hero-slider-btn.prev');
    const nextBtn = document.querySelector('.hero-slider-btn.next');
    
    // Dynamic Title Overlay Elements
    const titleOverlay = document.getElementById('hero-dynamic-text-container');
    const titleHeader = titleOverlay ? titleOverlay.querySelector('.dynamic-title') : null;
    const bgOverlay = document.querySelector('.hero-bg-overlay');
    
    if (slides.length === 0) return;
    
    // Dynamic sentence data matching the new file sequence and sentences
    const slideData = [
        {
            html: 'Architectural surfaces <br>engineered <span class="accent-text">for spaces</span>',
            positionClass: 'pos-left-vertical'
        },
        {
            html: 'Subtle geometric motifs <br>engineered to <span class="accent-text">elevate quiet spaces</span>',
            positionClass: 'pos-bottom-horizontal'
        },
        {
            html: 'Rich marble textures <br>crafted for <span class="accent-text">bold kitchen walls</span>',
            positionClass: 'pos-right-vertical'
        },
        {
            html: 'Timeless patterned surfaces <br>tailored for <span class="accent-text">elegant accent walls</span>',
            positionClass: 'pos-left-vertical'
        },
        {
            html: 'Artisan tile textures <br>crafted for <span class="accent-text">fresh interior accents</span>',
            positionClass: 'pos-bottom-horizontal'
        },
        {
            html: 'Layered earthy surfaces <br>designed for <span class="accent-text">balanced living spaces</span>',
            positionClass: 'pos-right-vertical'
        }
    ];
    
    let currentSlide = 0;
    let slideInterval = null;
    const intervalTime = 6000; // 6 seconds per slide
    
    function showSlide(index) {
        let targetIndex = index;
        if (index >= slides.length) {
            targetIndex = 0;
        } else if (index < 0) {
            targetIndex = slides.length - 1;
        }
        
        currentSlide = targetIndex;
        
        // 1. Update active states for slides and dots
        slides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        slides[currentSlide].classList.add('active');
        if (dots[currentSlide]) {
            dots[currentSlide].classList.add('active');
        }
        
        // 2. Synchronize sentence content and layout position
        if (titleOverlay && titleHeader) {
            // Trigger smooth fade-out exit animation
            titleOverlay.classList.add('fade-out');
            
            setTimeout(() => {
                const data = slideData[currentSlide];
                
                // Update HTML content (with br and accent-text spans)
                titleHeader.innerHTML = data.html;
                
                // Reset layout positions and apply the slide's specific class
                titleOverlay.className = 'hero-dynamic-text ' + data.positionClass;
                
                // Update the background shadow overlay position
                if (bgOverlay) {
                    bgOverlay.className = 'hero-bg-overlay ' + data.positionClass;
                }
                
                // Trigger smooth fade-in entry animation
                titleOverlay.classList.remove('fade-out');
            }, 300); // 300ms matches the exit transition duration
        }
    }
    
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    
    function startAutoPlay() {
        stopAutoPlay();
        slideInterval = setInterval(nextSlide, intervalTime);
    }
    
    function stopAutoPlay() {
        if (slideInterval) {
            clearInterval(slideInterval);
            slideInterval = null;
        }
    }
    
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            startAutoPlay();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            startAutoPlay();
        });
    }
    
    dots.forEach((dot, idx) => {
        dot.addEventListener('click', () => {
            showSlide(idx);
            startAutoPlay();
        });
    });
    
    // Initialize first slide state immediately
    if (titleOverlay && titleHeader) {
        const data = slideData[0];
        titleHeader.innerHTML = data.html;
        titleOverlay.className = 'hero-dynamic-text ' + data.positionClass;
        if (bgOverlay) {
            bgOverlay.className = 'hero-bg-overlay ' + data.positionClass;
        }
    }
    
    showSlide(currentSlide);
    startAutoPlay();
});
