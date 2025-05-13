document.addEventListener('DOMContentLoaded', () => {
  // Initialize scroll animations
  initScrollAnimations();
  
  // Navbar scroll effect
  initNavbarScroll();
  
  // Initialize smooth scroll for anchor links
  initSmoothScroll();
  
  // Initialize carousel
  initCarousel();
  
  // Menu functionality
  initMenuFunctionality();
  
  // Scroll button functionality
  initScrollButton();
  
  // Section transitions
  initSectionTransitions();
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
  const homeSection = document.getElementById('home');
  
  function updateNavbarStyle() {
    const homeHeight = homeSection ? homeSection.offsetHeight : 0;
    const scrollPosition = window.scrollY;
    const isInHomeSection = scrollPosition < homeHeight - 100;
    
    // Add or remove scrolled class based on whether we're in the home section
    if (!isInHomeSection) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    
    // Still handle shrink effect based on scroll amount
    if (scrollPosition > 100) {
      navbar.classList.add('shrink');
    } else {
      navbar.classList.remove('shrink');
    }
  }
  
  // Initial update
  updateNavbarStyle();
  
  // Update on scroll
  window.addEventListener('scroll', updateNavbarStyle);
  
  // Update on window resize (in case dimensions change)
  window.addEventListener('resize', updateNavbarStyle);
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

// Menu functionality
function initMenuFunctionality() {
  // Mobile menu toggle
  const menuToggle = document.querySelector('.menu-toggle');
  const navMenu = document.querySelector('nav ul');
  
  if (menuToggle) {
    menuToggle.addEventListener('click', function() {
      this.classList.toggle('active');
      navMenu.classList.toggle('active');
    });
  }
  
  // Active menu item based on scroll position
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('nav ul li a');
  
  function highlightNavItem() {
    const scrollPosition = window.scrollY;
    
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 100;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute('id');
      
      if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
  
  window.addEventListener('scroll', highlightNavItem);
  
  // Smooth scrolling for menu links
  navLinks.forEach(link => {
    link.addEventListener('click', function(e) {
      e.preventDefault();
      
      // Close mobile menu if open
      if (navMenu.classList.contains('active')) {
        menuToggle.classList.remove('active');
        navMenu.classList.remove('active');
      }
      
      const targetId = this.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      
      if (targetSection) {
        window.scrollTo({
          top: targetSection.offsetTop - 70,
          behavior: 'smooth'
        });
      }
    });
  });
}

// Add scroll button functionality
function initScrollButton() {
  const scrollBtn = document.querySelector('.scroll-btn');
  const aboutSection = document.getElementById('about');
  
  if (scrollBtn && aboutSection) {
    scrollBtn.addEventListener('click', function() {
      window.scrollTo({
        top: aboutSection.offsetTop - 70,
        behavior: 'smooth'
      });
    });
  }
}

// Section transitions
function initSectionTransitions() {
  const sections = document.querySelectorAll('section');
  const viewportHeight = window.innerHeight;
  
  function checkTransitions() {
    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top;
      const sectionBottom = section.getBoundingClientRect().bottom;
      
      // When section enters viewport
      if (sectionTop < viewportHeight * 0.75 && sectionBottom > 0) {
        section.classList.add('section-transition-in');
        section.classList.remove('section-transition-out');
        
        // Get all elements with data-scroll-animate within this section
        const animatedElements = section.querySelectorAll('[data-scroll-animate]');
        animatedElements.forEach((el, index) => {
          // Add a slight delay for each element to create a cascade effect
          setTimeout(() => {
            el.classList.add('animate');
          }, index * 100); // 100ms delay between each element
        });
      } 
      // When section leaves viewport
      else if (sectionTop > viewportHeight || sectionBottom < 0) {
        section.classList.remove('section-transition-in');
        
        // Get all animated elements in this section
        const animatedElements = section.querySelectorAll('[data-scroll-animate].animate');
        animatedElements.forEach(el => {
          el.classList.remove('animate');
        });
      }
    });
  }
  
  // Initial check
  checkTransitions();
  
  // Check on scroll
  window.addEventListener('scroll', () => {
    checkTransitions();
  });
  
  // Check on resize
  window.addEventListener('resize', () => {
    checkTransitions();
  });
} 