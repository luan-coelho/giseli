// Galaxy animation
const galaxyCanvas = document.getElementById('galaxy-canvas')
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

// Proteção contra bots para o email e Instagram
document.addEventListener('DOMContentLoaded', function () {
  // Função para desembaralhar os dados de contato
  function decodeContact(encodedParts) {
    return encodedParts
      .map(
        part => atob(part), // Decodifica Base64
      )
      .join('')
  }

  // Email codificado em partes (Base64)
  const emailParts = [
    'Z2lzZWxp', // giseli
    'LmlhQHRq', // .ia@tj
    'dG8uanVz', // to.jus
    'LmJy', // .br
  ]

  // Instagram codificado em partes (Base64)
  const instagramParts = [
    'QGdpc2Vs', // @gisel
    'aS5pYQ==', // i.ia
  ]

  // Configurar o email
  const emailLink = document.getElementById('email-link')
  const decodedEmail = decodeContact(emailParts)
  emailLink.href = `mailto:${decodedEmail}`
  emailLink.setAttribute('aria-label', `Enviar e-mail para ${decodedEmail}`)

  // Configurar o Instagram
  const instagramLink = document.getElementById('instagram-link')
  const decodedInstagram = decodeContact(instagramParts)
  instagramLink.href = `https://instagram.com/${decodedInstagram.substring(1)}`
  instagramLink.setAttribute('aria-label', `Visite nosso perfil no Instagram: ${decodedInstagram}`)

  // Carrossel de citações
  const quotes = document.querySelectorAll('.quote-container')
  let currentQuote = 0

  // Função para mostrar a próxima citação
  function showNextQuote() {
    // Remover classe active da citação atual
    quotes[currentQuote].classList.remove('active')

    // Atualizar para a próxima citação
    currentQuote = (currentQuote + 1) % quotes.length

    // Adicionar classe active à próxima citação
    quotes[currentQuote].classList.add('active')
  }

  // Alternar citações a cada 10 segundos
  const seconds = 10
  const oneSecondInMilliseconds = 1000
  const milliseconds = oneSecondInMilliseconds * seconds
  setInterval(showNextQuote, milliseconds)
})
