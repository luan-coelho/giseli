document.addEventListener('DOMContentLoaded', () => {
  // Initialize scroll animations
  initScrollAnimations();
  
  // Navbar scroll effect
  initNavbarScroll();
  
  // Initialize smooth scroll for anchor links
  initSmoothScroll();
  
  // Initialize carousel
  initCarousel();
});

// Animate elements when they come into view
function initScrollAnimations() {
  const scrollElements = document.querySelectorAll('[data-scroll-animate]');
  
  const elementInView = (el, percentageScroll = 100) => {
    const elementTop = el.getBoundingClientRect().top;
    return (
      elementTop <= 
      ((window.innerHeight || document.documentElement.clientHeight) * (percentageScroll/100))
    );
  };
  
  const displayScrollElement = (element) => {
    element.classList.add('animate');
  };
  
  const hideScrollElement = (element) => {
    element.classList.remove('animate');
  };
  
  const handleScrollAnimation = () => {
    scrollElements.forEach((el) => {
      if (elementInView(el, 85)) {
        displayScrollElement(el);
      } else {
        hideScrollElement(el);
      }
    });
  };
  
  // Initialize animation on page load
  setTimeout(() => {
    handleScrollAnimation();
  }, 100);
  
  // Add scroll event listener
  window.addEventListener('scroll', () => {
    handleScrollAnimation();
  });
}

// Navbar background and blur effect on scroll
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.style.background = 'rgba(10, 21, 40, 0.95)';
      navbar.style.backdropFilter = 'blur(15px)';
      navbar.style.padding = '0.8rem 0';
      navbar.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.3)';
    } else {
      navbar.style.background = 'rgba(10, 21, 40, 0.8)';
      navbar.style.backdropFilter = 'blur(10px)';
      navbar.style.padding = '1.2rem 0';
      navbar.style.boxShadow = '0 5px 25px rgba(0, 0, 0, 0.2)';
    }
  });
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      
      const targetId = this.getAttribute('href');
      const targetElement = document.querySelector(targetId);
      
      if (targetElement) {
        // Get navbar height for offset
        const navbarHeight = document.querySelector('.navbar').offsetHeight;
        
        window.scrollTo({
          top: targetElement.offsetTop - navbarHeight,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Carousel functionality
function initCarousel() {
  const track = document.querySelector('.carousel-track');
  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const prevButton = document.querySelector('.carousel-control.prev');
  const nextButton = document.querySelector('.carousel-control.next');
  const indicators = Array.from(document.querySelectorAll('.indicator'));
  
  if (!track || slides.length === 0) return;
  
  let currentIndex = 0;
  let slidesToShow = window.innerWidth > 992 ? 2 : 1;
  
  // Set initial position
  updateCarousel();
  
  // Handle window resize
  window.addEventListener('resize', () => {
    const newSlidesToShow = window.innerWidth > 992 ? 2 : 1;
    if (newSlidesToShow !== slidesToShow) {
      slidesToShow = newSlidesToShow;
      currentIndex = Math.min(currentIndex, slides.length - slidesToShow);
      if (currentIndex < 0) currentIndex = 0;
      updateCarousel();
    }
  });
  
  // Event listeners
  if (prevButton) {
    prevButton.addEventListener('click', () => {
      currentIndex = Math.max(0, currentIndex - slidesToShow);
      updateCarousel();
    });
  }
  
  if (nextButton) {
    nextButton.addEventListener('click', () => {
      currentIndex = Math.min(slides.length - slidesToShow, currentIndex + slidesToShow);
      updateCarousel();
    });
  }
  
  indicators.forEach(indicator => {
    indicator.addEventListener('click', () => {
      const clickedIndex = parseInt(indicator.getAttribute('data-index'));
      // Adjust to show the correct group
      currentIndex = Math.floor(clickedIndex / slidesToShow) * slidesToShow;
      updateCarousel();
    });
  });
  
  // Auto advance slide every 7 seconds
  let autoplayInterval = setInterval(() => {
    if (currentIndex < slides.length - slidesToShow) {
      currentIndex += slidesToShow;
    } else {
      currentIndex = 0;
    }
    updateCarousel();
  }, 7000);
  
  // Pause autoplay on hover
  track.addEventListener('mouseenter', () => {
    clearInterval(autoplayInterval);
  });
  
  track.addEventListener('mouseleave', () => {
    autoplayInterval = setInterval(() => {
      if (currentIndex < slides.length - slidesToShow) {
        currentIndex += slidesToShow;
      } else {
        currentIndex = 0;
      }
      updateCarousel();
    }, 7000);
  });
  
  // Update carousel position and active states
  function updateCarousel() {
    // Calculate percentage to move based on slides to show
    const slideWidth = 100 / slidesToShow;
    track.style.transform = `translateX(-${currentIndex * slideWidth}%)`;
    
    // Update active classes on slides
    slides.forEach((slide, index) => {
      if (index >= currentIndex && index < currentIndex + slidesToShow) {
        slide.classList.add('active');
      } else {
        slide.classList.remove('active');
      }
    });
    
    // Update indicator active state based on which group is shown
    const activeIndicatorIndex = Math.floor(currentIndex / slidesToShow);
    const totalGroups = Math.ceil(slides.length / slidesToShow);
    
    // If we need to adjust indicators
    if (indicators.length !== totalGroups) {
      // Just highlight the first indicator for the active group
      indicators.forEach((indicator, index) => {
        const groupStart = index * slidesToShow;
        const isActive = currentIndex >= groupStart && currentIndex < groupStart + slidesToShow;
        if (isActive) {
          indicator.classList.add('active');
        } else {
          indicator.classList.remove('active');
        }
      });
    } else {
      indicators.forEach((indicator, index) => {
        if (index === activeIndicatorIndex) {
          indicator.classList.add('active');
        } else {
          indicator.classList.remove('active');
        }
      });
    }
    
    // Disable/enable navigation buttons
    if (prevButton) {
      prevButton.disabled = currentIndex === 0;
      prevButton.classList.toggle('disabled', currentIndex === 0);
    }
    
    if (nextButton) {
      const isLast = currentIndex >= slides.length - slidesToShow;
      nextButton.disabled = isLast;
      nextButton.classList.toggle('disabled', isLast);
    }
  }
  
  // Touch and swipe support
  let touchStartX = 0;
  let touchEndX = 0;
  
  track.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });
  
  track.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });
  
  function handleSwipe() {
    const swipeThreshold = 50;
    if (touchEndX < touchStartX - swipeThreshold) {
      // Swipe left, go to next slide group
      currentIndex = Math.min(slides.length - slidesToShow, currentIndex + slidesToShow);
      updateCarousel();
    }
    
    if (touchEndX > touchStartX + swipeThreshold) {
      // Swipe right, go to previous slide group
      currentIndex = Math.max(0, currentIndex - slidesToShow);
      updateCarousel();
    }
  }
}

// Button hover effects
const buttons = document.querySelectorAll('.btn-primary');
buttons.forEach(button => {
  button.addEventListener('mouseover', () => {
    button.style.transform = 'translateY(-2px)';
    button.style.boxShadow = '0 8px 20px rgba(14, 33, 62, 0.3)';
  });
  
  button.addEventListener('mouseout', () => {
    button.style.transform = 'translateY(0)';
    button.style.boxShadow = '0 4px 15px rgba(14, 33, 62, 0.2)';
  });
}); 