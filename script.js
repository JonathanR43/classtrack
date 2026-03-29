document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('waitlist-form');
    const emailInput = document.getElementById('email-input');
    const submitBtn = document.getElementById('submit-btn');
    const successMsg = document.getElementById('success-message');
    const formContainer = document.querySelector('.waitlist-form-container');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = emailInput.value;
        if (!validateEmail(email)) {
            emailInput.style.color = '#ef4444'; // Red color for error
            setTimeout(() => { emailInput.style.color = ''; }, 2000);
            return;
        }

        // Button loading state
        submitBtn.innerHTML = 'Enviando...';
        submitBtn.style.opacity = '0.7';
        submitBtn.disabled = true;

        // URL del Web App de Google Apps Script
        const scriptURL = 'https://script.google.com/macros/s/AKfycbxrKrOyWTGLwnQLum1J_CgDgqKiOjQcvlIdDqvRNLcjSWWSfLJ1Hm91lYWVBtE09p0W2w/exec';
        const formData = new FormData(form);

        // Verificación Honeypot para evitar bots
        const honeypot = formData.get('b_email');
        if (honeypot) {
            // Es un bot, fingimos éxito pero no enviamos nada
            form.classList.add('hidden');
            successMsg.classList.remove('hidden');
            return;
        }

        fetch(scriptURL, { method: 'POST', body: formData })
            .then(response => {
                form.classList.add('hidden');
                successMsg.classList.remove('hidden');
                formContainer.style.background = 'rgba(16, 185, 129, 0.1)';
                formContainer.style.borderColor = '#10b981';
                formContainer.style.boxShadow = '0 0 20px rgba(16, 185, 129, 0.2)';
            })
            .catch(error => {
                console.error('Error!', error.message);
                submitBtn.innerHTML = 'Error al enviar';
                submitBtn.style.background = '#ef4444';
                setTimeout(() => { 
                    submitBtn.innerHTML = 'Notificame'; 
                    submitBtn.style.background = '';
                    submitBtn.disabled = false;
                    submitBtn.style.opacity = '1';
                }, 3000);
            });
    });

    function validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(String(email).toLowerCase());
    }

    // Scroll reveal animation for Bento cards
    const cards = document.querySelectorAll('.bento-card');
    
    // Check if IntersectionObserver is supported
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Add staggered delay based on index
                    setTimeout(() => {
                        entry.target.style.opacity = 1;
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 100);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        cards.forEach(card => {
            // Initial state for animation
            card.style.opacity = 0;
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out, border-color 0.3s';
            observer.observe(card);
        });
        const revealElements = document.querySelectorAll('.reveal-left, .reveal-right');
        
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = 1;
                    entry.target.style.transform = 'translateX(0)';
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2, rootMargin: '0px 0px -100px 0px' });

        revealElements.forEach(el => {
            el.style.opacity = 0;
            if (el.classList.contains('reveal-left')) {
                el.style.transform = 'translateX(-50px)';
            } else {
                el.style.transform = 'translateX(50px)';
            }
            el.style.transition = 'opacity 0.8s ease-out, transform 0.8s ease-out';
            revealObserver.observe(el);
        });
    }
});
