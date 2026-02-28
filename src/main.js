import './style.css'

// === REVEAL ANIMATION ===
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) entry.target.classList.add('active')
    })
}, { threshold: 0.1 })
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el))

// === CONTACT FORM ===
const contactForm = document.getElementById('contact-form')
const formContainer = document.getElementById('form-container')
const successMsg = document.getElementById('success-msg')

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault()
        
        const btn = contactForm.querySelector('button[type="submit"]')
        const btnText = btn.querySelector('.btn-text')
        const originalText = btnText.innerHTML
        
        btnText.innerHTML = 'ENVOI EN COURS...'
        btn.disabled = true

        try {
            const formData = new FormData(contactForm)
            const response = await fetch(contactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            
            if (response.ok) {
                formContainer.style.display = 'none'
                successMsg.classList.remove('hidden')
                successMsg.style.display = 'flex'
                contactForm.reset()
            } else {
                alert("Erreur lors de l'envoi du message. Veuillez réessayer.")
            }
        } catch (error) {
            alert("Erreur réseau. Veuillez vérifier votre connexion.")
        } finally {
            btnText.innerHTML = originalText
            btn.disabled = false
        }
    })
}

window.resetForm = () => {
    contactForm.reset()
    formContainer.style.display = 'block'
    successMsg.classList.add('hidden')
    successMsg.style.display = 'none'
}

// === PROJECT MODALS ===
function openModal(id) {
    const m = document.getElementById('modal-' + id)
    if (!m) return
    m.classList.add('open')
    document.body.classList.add('modal-open')
}

function closeModal(id) {
    const m = document.getElementById('modal-' + id)
    if (!m) return
    m.classList.remove('open')
    document.body.classList.remove('modal-open')
}

// Make closeModal available globally for onclick handlers
window.closeModal = closeModal

document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('click', (e) => {
        if (e.target.closest('a')) return
        openModal(card.dataset.project)
    })
})

document.querySelectorAll('.modal-overlay').forEach(overlay => {
    overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
            closeModal(overlay.id.replace('modal-', ''))
        }
    })
})

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        document.querySelectorAll('.modal-overlay.open').forEach(m => {
            m.classList.remove('open')
            document.body.classList.remove('modal-open')
        })
    }
})

// === ACTIVE NAV ===
const sections = document.querySelectorAll('section[id]')
const navLinks = document.querySelectorAll('.nav-link')

const navObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            navLinks.forEach(l => l.classList.remove('nav-link-active'))
            const active = document.querySelector(`.nav-link[data-section="${entry.target.id}"]`)
            if (active) active.classList.add('nav-link-active')
        }
    })
}, { threshold: 0.3, rootMargin: '-10% 0px -60% 0px' })

sections.forEach(s => navObserver.observe(s))

// === BACK TO TOP ===
const backBtn = document.getElementById('backToTop')
window.addEventListener('scroll', () => {
    backBtn.classList.toggle('visible', window.scrollY > 600)
})
