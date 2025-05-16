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
  
  // Adiciona a animação aos medidores de impacto
  initImpactMeterAnimations();
  
  // Animação das partículas na seção de contato
  initContactParticles();
  
  // Inicializar links de contato (anti-bot)
  initContactLinks();
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
  // Check if screen is mobile (992px or less)
  const isMobile = window.innerWidth <= 992;
  
  const carouselContainers = document.querySelectorAll('.carousel-container');
  
  if (carouselContainers.length === 0) return;
  
  // Add responsive check for window resizing
  window.addEventListener('resize', function() {
    const newIsMobile = window.innerWidth <= 992;
    
    // If changed between mobile/desktop state, reload page to apply correct layout
    if (newIsMobile !== isMobile) {
      location.reload();
    }
  });
  
  // For mobile view, add active class to all slides and exit
  if (isMobile) {
    carouselContainers.forEach(container => {
      const slides = container.querySelectorAll('.carousel-slide');
      slides.forEach(slide => {
        slide.classList.add('active');
      });
    });
    return; // Skip carousel initialization on mobile
  }
  
  carouselContainers.forEach(container => {
    const track = container.querySelector('.carousel-track');
    const slides = Array.from(container.querySelectorAll('.carousel-slide'));
    const prevButton = container.querySelector('.carousel-control.prev');
    const nextButton = container.querySelector('.carousel-control.next');
    
    if (!track || slides.length === 0) return;
    
    let currentIndex = 0;
    const totalSlides = slides.length;
    
    // Clone slides for infinite loop if needed
    if (totalSlides < 5) {
      slides.forEach(slide => {
        const clone = slide.cloneNode(true);
        track.appendChild(clone);
      });
    }
    
    // Get updated slides after cloning
    const allSlides = Array.from(container.querySelectorAll('.carousel-slide'));
    
    // Set initial position with center slide active
    updateSlidePosition();
    
    // Create neural connection effect for AI theme
    createNeuralConnections();
    
    // Event listeners
    if (prevButton) {
      prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + allSlides.length) % allSlides.length;
        updateSlidePosition();
      });
    }
    
    if (nextButton) {
      nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % allSlides.length;
        updateSlidePosition();
      });
    }
    
    // Auto advance slide every 5 seconds
    let autoplayInterval = setInterval(autoAdvance, 5000);
    
    // Pause autoplay on hover
    container.addEventListener('mouseenter', () => {
      clearInterval(autoplayInterval);
    });
    
    container.addEventListener('mouseleave', () => {
      autoplayInterval = setInterval(autoAdvance, 5000);
    });
    
    function autoAdvance() {
      currentIndex = (currentIndex + 1) % allSlides.length;
      updateSlidePosition();
    }
    
    function updateSlidePosition() {
      // Remove all class states
      allSlides.forEach(slide => {
        slide.classList.remove('active', 'prev', 'next');
      });
      
      // Set active slide
      allSlides[currentIndex].classList.add('active');
      
      // Set previous slide
      const prevIndex = (currentIndex - 1 + allSlides.length) % allSlides.length;
      allSlides[prevIndex].classList.add('prev');
      
      // Set next slide
      const nextIndex = (currentIndex + 1) % allSlides.length;
      allSlides[nextIndex].classList.add('next');
      
      // Calculate translateX value to center the active slide
      const slideWidth = 100 / 3; // 33.33% per slide
      let translateX;
      
      // If we're at the beginning or end, we need special handling for smooth infinite loop
      translateX = -currentIndex * slideWidth + (100 - slideWidth) / 2;
      
      // Apply transform
      track.style.transform = `translateX(${translateX}%)`;
    }
    
    function createNeuralConnections() {
      allSlides.forEach(slide => {
        // Create neural connections container
        const neuralContainer = document.createElement('div');
        neuralContainer.className = 'neural-connections';
        slide.querySelector('.about-card').appendChild(neuralContainer);
        
        // Add random neural particles
        for (let i = 0; i < 8; i++) {
          const particle = document.createElement('span');
          particle.className = 'neural-particle';
          
          // Random position
          const randomX = Math.random() * 100;
          const randomY = Math.random() * 100;
          particle.style.left = `${randomX}%`;
          particle.style.top = `${randomY}%`;
          
          // Random animation delay and duration
          const randomDelay = Math.random() * 2;
          const randomDuration = 2 + Math.random() * 3;
          particle.style.animationDelay = `${randomDelay}s`;
          particle.style.animationDuration = `${randomDuration}s`;
          
          // Random color variation
          const hue = Math.random() < 0.5 ? 
                       Math.random() * 20 + 30 : // Gold (accent color)
                       Math.random() * 30 + 210; // Blue (primary color)
          particle.style.background = `hsla(${hue}, 80%, 60%, 0.8)`;
          particle.style.boxShadow = `0 0 10px 2px hsla(${hue}, 80%, 60%, 0.3)`;
          
          // Custom animation direction
          const randomAngle = Math.random() * 360;
          const distance = 50 + Math.random() * 100;
          const endX = Math.cos(randomAngle * Math.PI / 180) * distance;
          const endY = Math.sin(randomAngle * Math.PI / 180) * distance;
          
          particle.style.setProperty('--end-x', `${endX}px`);
          particle.style.setProperty('--end-y', `${endY}px`);
          
          neuralContainer.appendChild(particle);
        }
      });
      
      // Add custom animation to CSS
      const styleSheet = document.createElement('style');
      styleSheet.innerHTML = `
        @keyframes moveParticle {
          0% {
            transform: translate(0, 0);
            opacity: 0;
          }
          30%, 70% {
            opacity: 1;
          }
          100% {
            transform: translate(var(--end-x, 100px), var(--end-y, -100px));
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(styleSheet);
    }
  });
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

// Adiciona a animação aos medidores de impacto
function initImpactMeterAnimations() {
  // Observador de interseção para detectar quando os elementos entram na tela
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      // Verifica se o elemento está visível na tela
      if (entry.isIntersecting) {
        // Adiciona a classe animate para iniciar a animação
        entry.target.classList.add('animate');
        
        // Configura a variável CSS personalizada para o preenchimento do medidor
        const meterFill = entry.target.querySelector('.meter-fill');
        if (meterFill) {
          const width = meterFill.style.width;
          meterFill.style.setProperty('--width', width);
          
          // Aplica a largura com animação
          setTimeout(() => {
            meterFill.style.width = width;
          }, 100);
        }
        
        // Para de observar após a animação
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2 // Inicia a animação quando 20% do elemento está visível
  });
  
  // Observa todos os cartões de impacto
  document.querySelectorAll('.impact-card').forEach(card => {
    observer.observe(card);
  });
}

// Animação das partículas na seção de contato
function initContactParticles() {
  const contactParticles = document.querySelector('.contact-particles');
  
  if (contactParticles) {
    // Adiciona event listener para movimento de mouse na seção de contato
    const contactSection = document.getElementById('contact');
    
    contactSection.addEventListener('mousemove', (e) => {
      const particles = contactParticles.querySelectorAll('.particle');
      
      // Pega a posição relativa do mouse dentro da seção
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      
      // Movimento suave das partículas baseado na posição do mouse
      particles.forEach((particle, index) => {
        // Diferentes movimentos para cada partícula
        const factor = (index % 3 + 1) * 0.02;
        const xOffset = (mouseX - window.innerWidth / 2) * factor;
        const yOffset = (mouseY - window.innerHeight / 2) * factor;
        
        // Aplica transformação CSS para mover as partículas
        particle.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
      });
    });
    
    // Restaura a posição quando o mouse sai da seção
    contactSection.addEventListener('mouseleave', () => {
      const particles = contactParticles.querySelectorAll('.particle');
      particles.forEach(particle => {
        particle.style.transform = 'translate(0, 0)';
      });
    });
  }
  
  // Animação para os itens de contato ao passar o mouse
  const contactItems = document.querySelectorAll('.contact-item');
  contactItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.transform = 'translateY(-10px) scale(1.03)';
    });
    
    item.addEventListener('mouseleave', () => {
      item.style.transform = '';
    });
  });
}

// Function to initialize contact links
function initContactLinks() {
  // Email link
  const emailLink = document.getElementById('email-link');
  if (emailLink) {
    const emailParts = ['giseli', '.ia', '@', 'tjto', '.jus', '.br'];
    const emailAddress = emailParts.join('');
    
    // Set href attribute
    emailLink.setAttribute('href', 'mailto:' + emailAddress);
    
    // Add hover event to show email on hover
    emailLink.addEventListener('mouseenter', function() {
      const textContainer = this.querySelector('.contact-text');
      if (textContainer && !textContainer.querySelector('span')) {
        const emailSpan = document.createElement('span');
        emailSpan.classList.add('contact-info-text');
        emailSpan.textContent = emailAddress;
        textContainer.appendChild(emailSpan);
      }
    });
    
    emailLink.addEventListener('mouseleave', function() {
      const emailSpan = this.querySelector('.contact-info-text');
      if (emailSpan) {
        emailSpan.remove();
      }
    });
  }
  
  // Instagram link
  const instagramLink = document.getElementById('instagram-link');
  if (instagramLink) {
    const instagramParts = ['https://instagram.com/', 'giseli', '.ia'];
    const instagramUrl = instagramParts.join('');
    
    // Set href attribute
    instagramLink.setAttribute('href', instagramUrl);
    
    // Add hover event to show username on hover
    instagramLink.addEventListener('mouseenter', function() {
      const textContainer = this.querySelector('.contact-text');
      if (textContainer && !textContainer.querySelector('span')) {
        const instaSpan = document.createElement('span');
        instaSpan.classList.add('contact-info-text');
        instaSpan.textContent = '@' + instagramParts[1] + instagramParts[2];
        textContainer.appendChild(instaSpan);
      }
    });
    
    instagramLink.addEventListener('mouseleave', function() {
      const instaSpan = this.querySelector('.contact-info-text');
      if (instaSpan) {
        instaSpan.remove();
      }
    });
  }
} 