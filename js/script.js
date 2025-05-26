document.addEventListener('DOMContentLoaded', () => {
  // Initialize scroll animations
  initScrollAnimations()

  // Navbar scroll effect
  initNavbarScroll()

  // Initialize smooth scroll for anchor links
  initSmoothScroll()

  // Initialize carousel
  initCarousel()

  // Menu functionality - habilitado para funcionar corretamente
  initMenuFunctionality()

  // Scroll button functionality
  initScrollButton()

  // Section transitions
  initSectionTransitions()

  // Adiciona a animação aos medidores de impacto
  initImpactMeterAnimations()

  // Animação das partículas na seção de contato
  initContactParticles()
})

// Animate elements when they come into view
function initScrollAnimations() {
  const scrollElements = document.querySelectorAll('[data-scroll-animate]')

  const elementInView = (el, percentageScroll = 100) => {
    const elementTop = el.getBoundingClientRect().top
    return elementTop <= (window.innerHeight || document.documentElement.clientHeight) * (percentageScroll / 100)
  }

  const displayScrollElement = element => {
    element.classList.add('animate')
  }

  const hideScrollElement = element => {
    element.classList.remove('animate')
  }

  const handleScrollAnimation = () => {
    scrollElements.forEach(el => {
      if (elementInView(el, 85)) {
        displayScrollElement(el)
      } else {
        hideScrollElement(el)
      }
    })
  }

  // Initialize animation on page load
  setTimeout(() => {
    handleScrollAnimation()
  }, 100)

  // Add scroll event listener
  window.addEventListener('scroll', () => {
    handleScrollAnimation()
  })
}

// Navbar background and blur effect on scroll
function initNavbarScroll() {
  const navbar = document.querySelector('.navbar')
  const homeSection = document.getElementById('home')

  function updateNavbarStyle() {
    const homeHeight = homeSection ? homeSection.offsetHeight : 0
    const scrollPosition = window.scrollY
    const isInHomeSection = scrollPosition < homeHeight - 100

    // Add or remove scrolled class based on whether we're in the home section
    if (!isInHomeSection) {
      navbar.classList.add('scrolled')
    } else {
      navbar.classList.remove('scrolled')
    }

    // Still handle shrink effect based on scroll amount
    if (scrollPosition > 100) {
      navbar.classList.add('shrink')
    } else {
      navbar.classList.remove('shrink')
    }
  }

  // Initial update
  updateNavbarStyle()

  // Update on scroll
  window.addEventListener('scroll', updateNavbarStyle)

  // Update on window resize (in case dimensions change)
  window.addEventListener('resize', updateNavbarStyle)
}

// Smooth scroll for anchor links
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault()

      const targetId = this.getAttribute('href')
      const targetElement = document.querySelector(targetId)

      if (targetElement) {
        // Get navbar height for offset
        const navbarHeight = document.querySelector('.navbar').offsetHeight

        window.scrollTo({
          top: targetElement.offsetTop - navbarHeight,
          behavior: 'smooth',
        })
      }
    })
  })
}

// Carousel functionality
function initCarousel() {
  const carouselContainers = document.querySelectorAll('.carousel-container')

  if (carouselContainers.length === 0) return

  // Track window width for responsive behavior
  let windowWidth = window.innerWidth

  // Add responsive check for window resizing
  window.addEventListener('resize', function () {
    const newWindowWidth = window.innerWidth

    // If we crossed a breakpoint, reload to apply correct layout
    const oldBreakpoint = getBreakpointName(windowWidth)
    const newBreakpoint = getBreakpointName(newWindowWidth)

    if (oldBreakpoint !== newBreakpoint) {
      location.reload()
    }

    windowWidth = newWindowWidth
  })

  // Helper to determine breakpoint name
  function getBreakpointName(width) {
    if (width <= 576) return 'xs'
    if (width <= 768) return 'sm'
    if (width <= 992) return 'md'
    if (width <= 1200) return 'lg'
    return 'xl'
  }

  // Get number of visible cards based on screen size
  function getVisibleCardCount() {
    if (windowWidth <= 768) return 1
    if (windowWidth <= 992) return 2
    return 3
  }

  // For mobile view (768px or less), add active class to all slides for stacked view
  const isMobile = windowWidth <= 768

  if (isMobile) {
    carouselContainers.forEach(container => {
      const slides = container.querySelectorAll('.carousel-slide')
      slides.forEach(slide => {
        slide.classList.add('active')
      })
    })
    return // Skip carousel initialization on mobile
  }

  carouselContainers.forEach(container => {
    const track = container.querySelector('.carousel-track')
    const slides = Array.from(container.querySelectorAll('.carousel-slide'))
    const prevButton = container.querySelector('.carousel-control.prev')
    const nextButton = container.querySelector('.carousel-control.next')

    if (!track || slides.length === 0) return

    let currentIndex = 0
    const totalSlides = slides.length

    // Clone slides for infinite loop if needed
    if (totalSlides < 5) {
      slides.forEach(slide => {
        const clone = slide.cloneNode(true)
        track.appendChild(clone)
      })
    }

    // Get updated slides after cloning
    const allSlides = Array.from(container.querySelectorAll('.carousel-slide'))

    // Set initial position with center slide active
    updateSlidePosition()

    // Create neural connection effect for AI theme
    createNeuralConnections()

    // Event listeners
    if (prevButton) {
      prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + allSlides.length) % allSlides.length
        updateSlidePosition()
      })
    }

    if (nextButton) {
      nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % allSlides.length
        updateSlidePosition()
      })
    }

    // Auto advance slide every 5 seconds
    let autoplayInterval = setInterval(autoAdvance, 5000)

    // Pause autoplay on hover
    container.addEventListener('mouseenter', () => {
      clearInterval(autoplayInterval)
    })

    container.addEventListener('mouseleave', () => {
      autoplayInterval = setInterval(autoAdvance, 5000)
    })

    function autoAdvance() {
      currentIndex = (currentIndex + 1) % allSlides.length
      updateSlidePosition()
    }

    function updateSlidePosition() {
      // Remove all class states
      allSlides.forEach(slide => {
        slide.classList.remove('active', 'prev', 'next')
      })

      const visibleCardCount = getVisibleCardCount()

      // Set active slide
      allSlides[currentIndex].classList.add('active')

      // If we're showing multiple cards, mark adjacent slides as active too
      if (visibleCardCount > 1) {
        for (let i = 1; i < visibleCardCount; i++) {
          const nextActiveIdx = (currentIndex + i) % allSlides.length
          allSlides[nextActiveIdx].classList.add('active')
        }
      }

      // Set previous slide
      const prevIndex = (currentIndex - 1 + allSlides.length) % allSlides.length
      allSlides[prevIndex].classList.add('prev')

      // Set next slide (after all active slides)
      const nextIndex = (currentIndex + visibleCardCount) % allSlides.length
      allSlides[nextIndex].classList.add('next')

      // Calculate translateX value to center the active slide(s)
      let slideWidth

      // Determine slide width based on screen size
      if (windowWidth > 992) {
        slideWidth = 100 / 3 // 33.33% per slide - 3 cards visible on large screens
      } else if (windowWidth > 768) {
        slideWidth = 50 // 50% per slide - 2 cards visible on medium screens
      } else {
        slideWidth = 100 // 100% per slide - 1 card visible on small screens
      }

      // Calculate position to center the active slide(s)
      let translateX = -currentIndex * slideWidth

      // Adjust position for multiple visible cards to center them
      if (visibleCardCount > 1) {
        translateX = -currentIndex * slideWidth + (100 - visibleCardCount * slideWidth) / 2
      } else {
        translateX = -currentIndex * slideWidth + (100 - slideWidth) / 2
      }

      // Apply transform
      track.style.transform = `translateX(${translateX}%)`
    }

    function createNeuralConnections() {
      allSlides.forEach(slide => {
        // Create neural connections container
        const neuralContainer = document.createElement('div')
        neuralContainer.className = 'neural-connections'
        slide.querySelector('.about-card').appendChild(neuralContainer)

        // Add random neural particles
        for (let i = 0; i < 8; i++) {
          const particle = document.createElement('span')
          particle.className = 'neural-particle'

          // Random position
          const randomX = Math.random() * 100
          const randomY = Math.random() * 100
          particle.style.left = `${randomX}%`
          particle.style.top = `${randomY}%`

          // Random animation delay and duration
          const randomDelay = Math.random() * 2
          const randomDuration = 2 + Math.random() * 3
          particle.style.animationDelay = `${randomDelay}s`
          particle.style.animationDuration = `${randomDuration}s`

          // Random color variation
          const hue =
            Math.random() < 0.5
              ? Math.random() * 20 + 30 // Gold (accent color)
              : Math.random() * 30 + 210 // Blue (primary color)
          particle.style.background = `hsla(${hue}, 80%, 60%, 0.8)`
          particle.style.boxShadow = `0 0 10px 2px hsla(${hue}, 80%, 60%, 0.3)`

          // Custom animation direction
          const randomAngle = Math.random() * 360
          const distance = 50 + Math.random() * 100
          const endX = Math.cos((randomAngle * Math.PI) / 180) * distance
          const endY = Math.sin((randomAngle * Math.PI) / 180) * distance

          particle.style.setProperty('--end-x', `${endX}px`)
          particle.style.setProperty('--end-y', `${endY}px`)

          neuralContainer.appendChild(particle)
        }
      })

      // Add custom animation to CSS
      const styleSheet = document.createElement('style')
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
      `
      document.head.appendChild(styleSheet)
    }
  })
}

// Button hover effects
const buttons = document.querySelectorAll('.btn-primary')
buttons.forEach(button => {
  button.addEventListener('mouseover', () => {
    button.style.transform = 'translateY(-2px)'
    button.style.boxShadow = '0 8px 20px rgba(14, 33, 62, 0.3)'
  })

  button.addEventListener('mouseout', () => {
    button.style.transform = 'translateY(0)'
    button.style.boxShadow = '0 4px 15px rgba(14, 33, 62, 0.2)'
  })
})

// Menu functionality
function initMenuFunctionality() {
  // Mobile menu toggle - apenas para telas maiores que 576px
  const menuToggle = document.querySelector('.menu-toggle')
  const navMenu = document.querySelector('nav ul')

  if (menuToggle && window.innerWidth > 576) {
    menuToggle.addEventListener('click', function () {
      this.classList.toggle('active')
      navMenu.classList.toggle('active')
    })
  }

  // Active menu item based on scroll position - apenas para dispositivos não móveis
  if (window.innerWidth > 768) {
    const sections = document.querySelectorAll('section[id]')
    const navLinks = document.querySelectorAll('nav ul li a')

    function highlightNavItem() {
      const scrollPosition = window.scrollY + 150 // Offset para melhor detecção
      const windowHeight = window.innerHeight
      let activeSection = null

      // Encontra a seção atualmente visível
      sections.forEach(section => {
        const sectionTop = section.offsetTop
        const sectionHeight = section.offsetHeight
        const sectionBottom = sectionTop + sectionHeight
        const sectionId = section.getAttribute('id')

        // Verifica se a seção está na viewport
        if (scrollPosition >= sectionTop - 200 && scrollPosition < sectionBottom - 100) {
          activeSection = sectionId
        }
      })

      // Se estamos no topo da página, sempre destacar "Início"
      if (scrollPosition < 200) {
        activeSection = 'home'
      }

      // Se estamos no final da página, destacar a última seção
      if (window.innerHeight + scrollPosition >= document.documentElement.scrollHeight - 100) {
        const lastSection = sections[sections.length - 1]
        if (lastSection) {
          activeSection = lastSection.getAttribute('id')
        }
      }

      // Atualiza os links da navegação
      navLinks.forEach(link => {
        link.classList.remove('active')
        const linkHref = link.getAttribute('href')
        if (linkHref === `#${activeSection}`) {
          link.classList.add('active')
        }
      })
    }

    // Chama a função imediatamente para definir o estado inicial
    highlightNavItem()

    // Adiciona throttling para melhor performance
    let ticking = false
    function requestTick() {
      if (!ticking) {
        requestAnimationFrame(() => {
          highlightNavItem()
          ticking = false
        })
        ticking = true
      }
    }

    window.addEventListener('scroll', requestTick)

    // Atualiza quando a janela é redimensionada
    window.addEventListener('resize', () => {
      // Se mudou para mobile, remove os event listeners
      if (window.innerWidth <= 768) {
        window.removeEventListener('scroll', requestTick)
        // Remove classe active de todos os links
        navLinks.forEach(link => link.classList.remove('active'))
        // Adiciona active apenas no primeiro link (Início)
        if (navLinks[0]) navLinks[0].classList.add('active')
      }
    })
  }

  // Smooth scrolling for menu links
  const navLinks = document.querySelectorAll('nav ul li a')
  navLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault()

      // Close mobile menu if open
      if (navMenu && navMenu.classList.contains('active')) {
        if (menuToggle) menuToggle.classList.remove('active')
        navMenu.classList.remove('active')
      }

      const targetId = this.getAttribute('href')
      const targetSection = document.querySelector(targetId)

      if (targetSection) {
        const navbarHeight = document.querySelector('.navbar').offsetHeight
        const offsetTop = targetSection.offsetTop - navbarHeight - 20

        window.scrollTo({
          top: offsetTop,
          behavior: 'smooth',
        })

        // Força a atualização do item ativo após o scroll (apenas em desktop)
        if (window.innerWidth > 768) {
          setTimeout(() => {
            // Re-executa a função de highlight se ela existir
            const sections = document.querySelectorAll('section[id]')
            const navLinks = document.querySelectorAll('nav ul li a')
            const scrollPosition = window.scrollY + 150
            let activeSection = null

            sections.forEach(section => {
              const sectionTop = section.offsetTop
              const sectionHeight = section.offsetHeight
              const sectionBottom = sectionTop + sectionHeight
              const sectionId = section.getAttribute('id')

              if (scrollPosition >= sectionTop - 200 && scrollPosition < sectionBottom - 100) {
                activeSection = sectionId
              }
            })

            if (scrollPosition < 200) {
              activeSection = 'home'
            }

            navLinks.forEach(link => {
              link.classList.remove('active')
              const linkHref = link.getAttribute('href')
              if (linkHref === `#${activeSection}`) {
                link.classList.add('active')
              }
            })
          }, 100)
        }
      }
    })
  })
}

// Add scroll button functionality
function initScrollButton() {
  const scrollBtn = document.querySelector('.scroll-btn')
  const aboutSection = document.getElementById('about')

  if (scrollBtn && aboutSection) {
    scrollBtn.addEventListener('click', function () {
      window.scrollTo({
        top: aboutSection.offsetTop - 70,
        behavior: 'smooth',
      })
    })
  }
}

// Section transitions
function initSectionTransitions() {
  const sections = document.querySelectorAll('section')
  const viewportHeight = window.innerHeight

  function checkTransitions() {
    sections.forEach(section => {
      const sectionTop = section.getBoundingClientRect().top
      const sectionBottom = section.getBoundingClientRect().bottom

      // When section enters viewport
      if (sectionTop < viewportHeight * 0.75 && sectionBottom > 0) {
        section.classList.add('section-transition-in')
        section.classList.remove('section-transition-out')

        // Get all elements with data-scroll-animate within this section
        const animatedElements = section.querySelectorAll('[data-scroll-animate]')
        animatedElements.forEach((el, index) => {
          // Add a slight delay for each element to create a cascade effect
          setTimeout(() => {
            el.classList.add('animate')
          }, index * 100) // 100ms delay between each element
        })
      }
      // When section leaves viewport
      else if (sectionTop > viewportHeight || sectionBottom < 0) {
        section.classList.remove('section-transition-in')

        // Get all animated elements in this section
        const animatedElements = section.querySelectorAll('[data-scroll-animate].animate')
        animatedElements.forEach(el => {
          el.classList.remove('animate')
        })
      }
    })
  }

  // Initial check
  checkTransitions()

  // Check on scroll
  window.addEventListener('scroll', () => {
    checkTransitions()
  })

  // Check on resize
  window.addEventListener('resize', () => {
    checkTransitions()
  })
}

// Adiciona a animação aos medidores de impacto
function initImpactMeterAnimations() {
  // Observador de interseção para detectar quando os elementos entram na tela
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        // Verifica se o elemento está visível na tela
        if (entry.isIntersecting) {
          // Adiciona a classe animate para iniciar a animação
          entry.target.classList.add('animate')

          // Configura a variável CSS personalizada para o preenchimento do medidor
          const meterFill = entry.target.querySelector('.meter-fill')
          if (meterFill) {
            const width = meterFill.style.width
            meterFill.style.setProperty('--width', width)

            // Aplica a largura com animação
            setTimeout(() => {
              meterFill.style.width = width
            }, 100)
          }

          // Para de observar após a animação
          observer.unobserve(entry.target)
        }
      })
    },
    {
      threshold: 0.2, // Inicia a animação quando 20% do elemento está visível
    },
  )

  // Observa todos os cartões de impacto
  document.querySelectorAll('.impact-card').forEach(card => {
    observer.observe(card)
  })
}

// Animação das partículas na seção de contato
function initContactParticles() {
  const contactParticles = document.querySelector('.contact-particles')

  if (contactParticles) {
    // Adiciona event listener para movimento de mouse na seção de contato
    const contactSection = document.getElementById('contact')

    contactSection.addEventListener('mousemove', e => {
      const particles = contactParticles.querySelectorAll('.particle')

      // Pega a posição relativa do mouse dentro da seção
      const mouseX = e.clientX
      const mouseY = e.clientY

      // Movimento suave das partículas baseado na posição do mouse
      particles.forEach((particle, index) => {
        // Diferentes movimentos para cada partícula
        const factor = ((index % 3) + 1) * 0.02
        const xOffset = (mouseX - window.innerWidth / 2) * factor
        const yOffset = (mouseY - window.innerHeight / 2) * factor

        // Aplica transformação CSS para mover as partículas
        particle.style.transform = `translate(${xOffset}px, ${yOffset}px)`
      })
    })

    // Restaura a posição quando o mouse sai da seção
    contactSection.addEventListener('mouseleave', () => {
      const particles = contactParticles.querySelectorAll('.particle')
      particles.forEach(particle => {
        particle.style.transform = 'translate(0, 0)'
      })
    })
  }

  // Animação para os itens de contato ao passar o mouse
  const contactItems = document.querySelectorAll('.contact-item')
  contactItems.forEach(item => {
    item.addEventListener('mouseenter', () => {
      item.style.transform = 'translateY(-10px) scale(1.03)'
    })

    item.addEventListener('mouseleave', () => {
      item.style.transform = ''
    })
  })
}

// Scroll Animation
document.addEventListener('DOMContentLoaded', function() {
  // Function to handle scroll animations
  function handleScrollAnimations() {
    const elements = document.querySelectorAll('[data-scroll-animate]');
    
    elements.forEach(element => {
      const elementPosition = element.getBoundingClientRect().top;
      const windowHeight = window.innerHeight;
      
      // When element is in viewport (with offset)
      if (elementPosition < windowHeight - 100) {
        element.classList.add('visible');
      }
    });
  }
  
  // Initial check
  handleScrollAnimations();
  
  // Add scroll event listener
  window.addEventListener('scroll', handleScrollAnimations);
});

// Galaxy animation
const galaxyCanvas = document.getElementById('galaxy-canvas')
if (galaxyCanvas) {
  const ctx = galaxyCanvas.getContext('2d')

  let width = window.innerWidth
  let height = window.innerHeight

  // Set canvas dimensions
  function resizeCanvas() {
    width = window.innerWidth
    height = window.innerHeight
    galaxyCanvas.width = width
    galaxyCanvas.height = height
  }

  window.addEventListener('resize', resizeCanvas)
  resizeCanvas()

  // Galaxy stars
  class Star {
    constructor() {
      this.reset()
    }

    reset() {
      this.x = Math.random() * width - width / 2
      this.y = Math.random() * height - height / 2
      this.z = Math.random() * 1000
      this.size = 1.2
      this.opacity = Math.random()
      this.color = this.getColor()
    }

    getColor() {
      const colors = [
        [250, 186, 99], // Accent color (faba63)
        [255, 255, 255], // White
        [79, 133, 229], // Light blue
        [3, 42, 95], // Primary color
      ]

      const idx = Math.floor(Math.random() * colors.length)
      return colors[idx]
    }

    update() {
      // Move toward viewer
      this.z -= 1

      // If star passes viewer, reset its position
      if (this.z <= 0) {
        this.reset()
      }
    }

    draw() {
      // Convert 3D coordinates to 2D
      const factor = 500 / this.z
      const x = this.x * factor + width / 2
      const y = this.y * factor + height / 2

      // Calculate size based on depth
      const sizeFactor = Math.max(0.1, 500 / this.z)
      const finalSize = this.size * sizeFactor

      // Skip if outside of viewport
      if (x < 0 || x > width || y < 0 || y > height) {
        return
      }

      // Draw star
      const [r, g, b] = this.color
      const fadeStart = 400
      const fadeEnd = 0
      let opacity = this.opacity

      // Fade out as stars come closer
      if (this.z < fadeStart) {
        opacity = this.opacity * ((this.z - fadeEnd) / (fadeStart - fadeEnd))
      }

      // Add glow for closer stars
      if (this.z < 200) {
        const glowSize = (1 - this.z / 200) * 20 * finalSize

        // Outer glow
        const gradient = ctx.createRadialGradient(x, y, finalSize / 2, x, y, glowSize)

        gradient.addColorStop(0, `rgba(${r}, ${g}, ${b}, ${opacity})`)
        gradient.addColorStop(1, `rgba(${r}, ${g}, ${b}, 0)`)

        ctx.fillStyle = gradient
        ctx.beginPath()
        ctx.arc(x, y, glowSize, 0, Math.PI * 2)
        ctx.fill()
      }

      // Core of star
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`
      ctx.beginPath()
      ctx.arc(x, y, finalSize, 0, Math.PI * 2)
      ctx.fill()
    }
  }

  // Galaxy nebula clouds
  class Nebula {
    constructor() {
      this.generateCloud()
    }

    generateCloud() {
      this.x = (Math.random() - 0.5) * width * 1.5
      this.y = (Math.random() - 0.5) * height * 1.5
      this.z = Math.random() * 1000 + 500
      this.size = Math.random() * 200 + 100
      this.opacity = Math.random() * 0.05 + 0.025

      // Color variations
      const hue =
        Math.random() < 0.5
          ? Math.random() * 20 + 30 // Golden (accent color)
          : Math.random() * 30 + 210 // Blue (primary color)

      this.color = `hsla(${hue}, 80%, 60%, ${this.opacity})`
    }

    update() {
      // Slowly move toward viewer
      this.z -= 0.1

      // Regenerate when too close
      if (this.z < 0) {
        this.generateCloud()
      }
    }

    draw() {
      const factor = 500 / this.z
      const x = this.x * factor + width / 2
      const y = this.y * factor + height / 2
      const size = this.size * factor

      // Skip if too far out of viewport
      if (x < -size || x > width + size || y < -size || y > height + size) {
        return
      }

      ctx.beginPath()
      ctx.ellipse(x, y, size, size * 0.6, Math.random() * Math.PI, 0, Math.PI * 2)
      ctx.fillStyle = this.color
      ctx.filter = 'blur(20px)'
      ctx.fill()
      ctx.filter = 'none'
    }
  }

  // Connecting neural-like lines between stars
  function drawConnections(stars) {
    const maxDistance = 150

    ctx.strokeStyle = 'rgba(250, 186, 99, 0.1)'
    ctx.lineWidth = 0.5

    for (let i = 0; i < stars.length; i++) {
      const star1 = stars[i]

      // Skip connections for distant stars
      if (star1.z > 300) continue

      const f1 = 500 / star1.z
      const x1 = star1.x * f1 + width / 2
      const y1 = star1.y * f1 + height / 2

      for (let j = i + 1; j < stars.length; j++) {
        const star2 = stars[j]

        // Skip connections for distant stars
        if (star2.z > 300) continue

        const f2 = 500 / star2.z
        const x2 = star2.x * f2 + width / 2
        const y2 = star2.y * f2 + height / 2

        const dx = x2 - x1
        const dy = y2 - y1
        const distance = Math.sqrt(dx * dx + dy * dy)

        if (distance < maxDistance) {
          const opacity = 0.1 * (1 - distance / maxDistance)
          ctx.strokeStyle = `rgba(250, 186, 99, ${opacity})`

          ctx.beginPath()
          ctx.moveTo(x1, y1)
          ctx.lineTo(x2, y2)
          ctx.stroke()
        }
      }
    }
  }

  // Create stars and nebulas
  const stars = Array.from({ length: 1000 }, () => new Star())
  const nebulas = Array.from({ length: 5 }, () => new Nebula())

  // Animation loop
  function animateGalaxy() {
    ctx.clearRect(0, 0, width, height)

    // Draw nebula clouds first (background)
    nebulas.forEach(nebula => {
      nebula.update()
      nebula.draw()
    })

    // Update and draw stars
    stars.forEach(star => {
      star.update()
      star.draw()
    })

    // Draw connections between stars
    drawConnections(stars)

    requestAnimationFrame(animateGalaxy)
  }

  // Start animation
  animateGalaxy()
}
