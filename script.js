// DOM Elements
const hamburger = document.querySelector(".hamburger")
const navMenu = document.querySelector(".nav-menu")
const modal = document.getElementById("gallery-modal")
const modalImg = document.getElementById("modal-image")
const modalTitle = document.getElementById("modal-title")
const modalDescription = document.getElementById("modal-description")
const modalTags = document.getElementById("modal-tags")
const modalClose = document.querySelector(".modal-close")

// Initialize
document.addEventListener("DOMContentLoaded", () => {
  initializeWebsite()
})

function initializeWebsite() {
  setupNavigation()
  setupGallery()
  setupCounters()
  setupDailyQuote()
  setupPiketInfo()
  setupScrollAnimations()
  updateVisitorCount()
  setupEasterEggs()
}

// Navigation
function setupNavigation() {
  // Mobile menu toggle
  hamburger.addEventListener("click", () => {
    hamburger.classList.toggle("active")
    navMenu.classList.toggle("active")

    // Animate hamburger
    const spans = hamburger.querySelectorAll("span")
    spans.forEach((span, index) => {
      span.style.transform = hamburger.classList.contains("active")
        ? `rotate(${index === 0 ? 45 : index === 1 ? 0 : -45}deg) translate(${index === 1 ? "100px" : "0"}, ${index === 0 ? "6px" : index === 2 ? "-6px" : "0"})`
        : "none"
      span.style.opacity = index === 1 && hamburger.classList.contains("active") ? "0" : "1"
    })
  })

  // Close mobile menu when clicking on links
  document.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      hamburger.classList.remove("active")
      navMenu.classList.remove("active")

      // Reset hamburger animation
      const spans = hamburger.querySelectorAll("span")
      spans.forEach((span) => {
        span.style.transform = "none"
        span.style.opacity = "1"
      })
    })
  })

  // Smooth scrolling for navigation links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        const offsetTop = target.offsetTop - 80
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    })
  })

  // Navbar scroll effect
  let lastScrollY = window.scrollY
  window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar")
    if (window.scrollY > 100) {
      navbar.style.background = "rgba(255, 255, 255, 0.98)"
      navbar.style.boxShadow = "0 4px 20px rgba(37, 99, 235, 0.1)"
    } else {
      navbar.style.background = "rgba(255, 255, 255, 0.95)"
      navbar.style.boxShadow = "none"
    }
    lastScrollY = window.scrollY
  })
}

// Gallery
function setupGallery() {
  const filterBtns = document.querySelectorAll(".filter-btn")
  const galleryItems = document.querySelectorAll(".gallery-item")

  // Filter functionality
  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const filter = btn.getAttribute("data-filter")

      // Update active button
      filterBtns.forEach((b) => b.classList.remove("active"))
      btn.classList.add("active")

      // Filter gallery items with animation
      galleryItems.forEach((item, index) => {
        const category = item.getAttribute("data-category")
        const shouldShow = filter === "all" || category === filter

        setTimeout(() => {
          if (shouldShow) {
            item.style.display = "block"
            item.style.opacity = "0"
            item.style.transform = "translateY(20px)"

            setTimeout(() => {
              item.style.opacity = "1"
              item.style.transform = "translateY(0)"
            }, 50)
          } else {
            item.style.opacity = "0"
            item.style.transform = "translateY(-20px)"
            setTimeout(() => {
              item.style.display = "none"
            }, 300)
          }
        }, index * 50)
      })
    })
  })

  // Modal functionality
  galleryItems.forEach((item) => {
    item.addEventListener("click", () => {
      const img = item.querySelector("img")
      const overlay = item.querySelector(".overlay-content")
      const tags = overlay.querySelectorAll(".tag")

      modal.style.display = "block"
      modalImg.src = img.src
      modalTitle.textContent = overlay.querySelector("h4").textContent
      modalDescription.textContent = overlay.querySelector("p").textContent

      // Add tags
      modalTags.innerHTML = ""
      tags.forEach((tag) => {
        const tagElement = document.createElement("span")
        tagElement.className = "tag"
        tagElement.textContent = tag.textContent
        modalTags.appendChild(tagElement)
      })

      // Animate modal
      setTimeout(() => {
        modal.querySelector(".modal-content").style.transform = "translate(-50%, -50%) scale(1)"
        modal.querySelector(".modal-content").style.opacity = "1"
      }, 10)
    })
  })

  // Close modal
  modalClose.addEventListener("click", closeModal)
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal()
  })

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModal()
  })
}

function closeModal() {
  const modalContent = modal.querySelector(".modal-content")
  modalContent.style.transform = "translate(-50%, -50%) scale(0.8)"
  modalContent.style.opacity = "0"

  setTimeout(() => {
    modal.style.display = "none"
    modalContent.style.transform = "translate(-50%, -50%) scale(1)"
    modalContent.style.opacity = "1"
  }, 300)
}

// Counter Animation
function setupCounters() {
  const counters = document.querySelectorAll(".stat-number")

  const animateCounter = (counter) => {
    const target = Number.parseInt(counter.getAttribute("data-target"))
    const duration = 2000
    const increment = target / (duration / 16)
    let current = 0

    const updateCounter = () => {
      if (current < target) {
        current += increment
        counter.textContent = Math.ceil(current)
        requestAnimationFrame(updateCounter)
      } else {
        counter.textContent = target
      }
    }

    updateCounter()
  }

  // Intersection Observer for counter animation
  const counterObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target
          animateCounter(counter)
          counterObserver.unobserve(counter)
        }
      })
    },
    { threshold: 0.5 },
  )

  counters.forEach((counter) => {
    counterObserver.observe(counter)
  })
}

// Daily Quote
function setupDailyQuote() {
  const quoteElement = document.getElementById("daily-quote")
  const today = new Date().getDate()
  const quoteIndex = today % quotes.length

  quoteElement.textContent = quotes[quoteIndex]

  // Add typing animation
  const text = quotes[quoteIndex]
  quoteElement.textContent = ""
  let i = 0

  const typeWriter = () => {
    if (i < text.length) {
      quoteElement.textContent += text.charAt(i)
      i++
      setTimeout(typeWriter, 50)
    }
  }

  setTimeout(typeWriter, 1000)
}

// Piket Information
function setupPiketInfo() {
  const piketInfo = document.getElementById("piket-names")
  const today = new Date().getDay()

  piketInfo.textContent = piketSchedule[today]

  // Add pulse animation for today's piket
  if (today !== 6) {
    // Not Sunday
    piketInfo.style.animation = "pulse 2s infinite"
  }
}

// Scroll Animations
function setupScrollAnimations() {
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("loading")

        // Add stagger animation for grid items
        if (
          entry.target.parentElement.classList.contains("profil-grid") ||
          entry.target.parentElement.classList.contains("gallery-grid")
        ) {
          const siblings = Array.from(entry.target.parentElement.children)
          const index = siblings.indexOf(entry.target)
          entry.target.style.animationDelay = `${index * 0.1}s`
        }
      }
    })
  }, observerOptions)

  // Observe elements for animation
  document.querySelectorAll(".profil-card, .gallery-item, .jadwal-card, .stat-card").forEach((el) => {
    observer.observe(el)
  })
}

// Visitor Counter
function updateVisitorCount() {
  let totalVisitors = localStorage.getItem("totalVisitors") || 1234
  let todayVisitors = localStorage.getItem("todayVisitors") || 42

  const today = new Date().toDateString()
  const lastVisit = localStorage.getItem("lastVisit")

  if (lastVisit !== today) {
    todayVisitors = 1
    localStorage.setItem("lastVisit", today)
  } else {
    todayVisitors = Number.parseInt(todayVisitors) + 1
  }

  totalVisitors = Number.parseInt(totalVisitors) + 1

  localStorage.setItem("totalVisitors", totalVisitors)
  localStorage.setItem("todayVisitors", todayVisitors)

  // Animate counter update
  const totalElement = document.getElementById("visitor-count")
  const todayElement = document.getElementById("today-count")

  animateNumber(totalElement, Number.parseInt(totalElement.textContent.replace(/,/g, "")), totalVisitors)
  animateNumber(todayElement, Number.parseInt(todayElement.textContent), todayVisitors)
}

function animateNumber(element, start, end) {
  const duration = 1000
  const increment = (end - start) / (duration / 16)
  let current = start

  const updateNumber = () => {
    if (Math.abs(current - end) > Math.abs(increment)) {
      current += increment
      element.textContent = Math.floor(current).toLocaleString()
      requestAnimationFrame(updateNumber)
    } else {
      element.textContent = end.toLocaleString()
    }
  }

  updateNumber()
}

// Easter Eggs and Fun Features
function setupEasterEggs() {
  // Konami Code: ↑↑↓↓←→←→BA
  const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65]
  let konamiIndex = 0

  document.addEventListener("keydown", (e) => {
    if (e.keyCode === konamiCode[konamiIndex]) {
      konamiIndex++
      if (konamiIndex === konamiCode.length) {
        showEasterEgg()
        konamiIndex = 0
      }
    } else {
      konamiIndex = 0
    }
  })

  // Fun click effects
  document.addEventListener("click", (e) => {
    if (Math.random() < 0.05) {
      // 5% chance
      createClickEffect(e.clientX, e.clientY)
    }
  })

  // Double click on logo for surprise
  document.querySelector(".nav-logo").addEventListener("dblclick", () => {
    showClassSpirit()
  })
}

function showEasterEgg() {
  // Create confetti effect
  const colors = ["#2563eb", "#3b82f6", "#60a5fa", "#fbbf24"]

  for (let i = 0; i < 100; i++) {
    setTimeout(() => {
      createConfetti(colors[Math.floor(Math.random() * colors.length)])
    }, i * 30)
  }

  // Show message
  const message = document.createElement("div")
  message.innerHTML = `
    <div style="text-align: center;">
      <h2 style="margin-bottom: 1rem;">🎉 SELAMAT! 🎉</h2>
      <p style="font-size: 1.2rem; margin-bottom: 1rem;">Kamu menemukan Easter Egg!</p>
      <p style="font-size: 1rem;">Kelas 9D memang hebat dan penuh kejutan! ✨</p>
    </div>
  `
  message.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: linear-gradient(135deg, #2563eb, #3b82f6);
    color: white;
    padding: 2rem;
    border-radius: 1.5rem;
    font-family: inherit;
    text-align: center;
    z-index: 3000;
    box-shadow: 0 20px 40px rgba(37, 99, 235, 0.3);
    animation: bounceIn 0.6s ease;
    max-width: 400px;
  `

  document.body.appendChild(message)

  setTimeout(() => {
    message.style.animation = "bounceOut 0.6s ease"
    setTimeout(() => message.remove(), 600)
  }, 4000)
}

function showClassSpirit() {
  const messages = ["9D HEBAT! 🚀", "SEMANGAT TERUS! 💪", "KITA BISA! ✨", "SOLID 9D! 🤝", "PRESTASI MENANTI! 🏆"]

  const message = messages[Math.floor(Math.random() * messages.length)]

  const element = document.createElement("div")
  element.textContent = message
  element.style.cssText = `
    position: fixed;
    top: 20%;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg, #fbbf24, #f59e0b);
    color: #1e40af;
    padding: 1rem 2rem;
    border-radius: 2rem;
    font-weight: 700;
    font-size: 1.5rem;
    z-index: 3000;
    box-shadow: 0 10px 30px rgba(251, 191, 36, 0.3);
    animation: slideInDown 0.5s ease, fadeOut 0.5s ease 2s forwards;
  `

  document.body.appendChild(element)

  setTimeout(() => element.remove(), 3000)
}

function createConfetti(color) {
  const confetti = document.createElement("div")
  confetti.style.cssText = `
    position: fixed;
    width: 8px;
    height: 8px;
    background: ${color};
    top: -10px;
    left: ${Math.random() * 100}vw;
    z-index: 2500;
    pointer-events: none;
    border-radius: 50%;
    animation: confettiFall 3s linear forwards;
  `

  document.body.appendChild(confetti)

  setTimeout(() => confetti.remove(), 3000)
}

function createClickEffect(x, y) {
  const effects = ["✨", "⭐", "🌟", "💫", "🎉"]
  const effect = document.createElement("div")
  effect.innerHTML = effects[Math.floor(Math.random() * effects.length)]
  effect.style.cssText = `
    position: fixed;
    left: ${x}px;
    top: ${y}px;
    font-size: 1.5rem;
    pointer-events: none;
    z-index: 2000;
    animation: clickEffect 1s ease-out forwards;
  `

  document.body.appendChild(effect)

  setTimeout(() => effect.remove(), 1000)
}

// Add dynamic CSS animations
const dynamicStyles = document.createElement("style")
dynamicStyles.textContent = `
  @keyframes confettiFall {
    to {
      transform: translateY(100vh) rotate(360deg);
      opacity: 0;
    }
  }
  
  @keyframes clickEffect {
    0% {
      transform: scale(0) rotate(0deg);
      opacity: 1;
    }
    100% {
      transform: scale(2) rotate(180deg);
      opacity: 0;
    }
  }
  
  @keyframes bounceIn {
    0% {
      transform: translate(-50%, -50%) scale(0.3);
      opacity: 0;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.05);
    }
    70% {
      transform: translate(-50%, -50%) scale(0.9);
    }
    100% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
  }
  
  @keyframes bounceOut {
    0% {
      transform: translate(-50%, -50%) scale(1);
      opacity: 1;
    }
    100% {
      transform: translate(-50%, -50%) scale(0.3);
      opacity: 0;
    }
  }
  
  @keyframes pulse {
    0%, 100% {
      transform: scale(1);
    }
    50% {
      transform: scale(1.05);
    }
  }
  
  .gallery-item {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
  
  .modal-content {
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  }
`
document.head.appendChild(dynamicStyles)

// Performance optimization
let ticking = false

function updateOnScroll() {
  // Parallax effect for hero shapes
  const scrolled = window.pageYOffset
  const shapes = document.querySelectorAll(".shape")

  shapes.forEach((shape, index) => {
    const speed = 0.5 + index * 0.1
    shape.style.transform = `translateY(${scrolled * speed}px)`
  })

  ticking = false
}

window.addEventListener("scroll", () => {
  if (!ticking) {
    requestAnimationFrame(updateOnScroll)
    ticking = true
  }
})

// Preload images for better performance
function preloadImages() {
  const images = document.querySelectorAll("img[src*='placeholder']")
  images.forEach((img) => {
    const newImg = new Image()
    newImg.src = img.src
  })
}

// Initialize preloading after page load
window.addEventListener("load", preloadImages)
