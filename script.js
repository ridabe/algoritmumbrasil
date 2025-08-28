/**
 * Script principal da landing page AlgoritmumBrasil
 * Funcionalidades: navegação móvel, scroll suave, animações e formulário
 */

// Aguarda o carregamento completo do DOM
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeScrollAnimations();
    initializeFormHandling();
    initializeScrollEffects();
    initializeCounterAnimations();
});

/**
 * Inicializa a navegação móvel com menu hambúrguer
 */
function initializeNavigation() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    
    // Toggle do menu móvel
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Previne scroll do body quando menu está aberto
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'auto';
        });
    }
    
    // Fecha menu ao clicar em um link (mobile)
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth <= 768) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });
    });
    
    // Fecha menu ao redimensionar janela
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    });
}

/**
 * Inicializa animações baseadas no scroll da página
 */
function initializeScrollAnimations() {
    // Configuração do Intersection Observer para animações
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                
                // Anima contadores quando a seção about entra em vista
                if (entry.target.classList.contains('about-stats')) {
                    animateCounters();
                }
            }
        });
    }, observerOptions);
    
    // Observa elementos para animação
    const animatedElements = document.querySelectorAll(
        '.service-card, .about-content, .contact-content, .about-stats'
    );
    
    animatedElements.forEach(element => {
        observer.observe(element);
    });
}

/**
 * Inicializa efeitos relacionados ao scroll (header transparente)
 */
function initializeScrollEffects() {
    const header = document.querySelector('.header');
    
    window.addEventListener('scroll', function() {
        const scrolled = window.pageYOffset;
        
        // Adiciona/remove classe baseada no scroll
        if (scrolled > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/**
 * Anima os contadores da seção sobre
 */
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
        const target = parseInt(counter.textContent.replace(/\D/g, ''));
        const suffix = counter.textContent.replace(/\d/g, '');
        let current = 0;
        const increment = target / 50; // Velocidade da animação
        
        const updateCounter = () => {
            if (current < target) {
                current += increment;
                counter.textContent = Math.ceil(current) + suffix;
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + suffix;
            }
        };
        
        updateCounter();
    });
}

/**
 * Inicializa contadores animados
 */
function initializeCounterAnimations() {
    let countersAnimated = false;
    
    const statsSection = document.querySelector('.about-stats');
    
    if (statsSection) {
        const observer = new IntersectionObserver(function(entries) {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersAnimated) {
                    countersAnimated = true;
                    setTimeout(() => {
                        animateCounters();
                    }, 500);
                }
            });
        }, { threshold: 0.5 });
        
        observer.observe(statsSection);
    }
}

/**
 * Inicializa o tratamento do formulário de contato
 */
function initializeFormHandling() {
    const contactForm = document.querySelector('.contact-form');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Validação dos campos
            if (validateForm(contactForm)) {
                handleFormSubmission(contactForm);
            }
        });
        
        // Validação em tempo real
        const inputs = contactForm.querySelectorAll('input, select, textarea');
        inputs.forEach(input => {
            input.addEventListener('blur', function() {
                validateField(input);
            });
            
            input.addEventListener('input', function() {
                clearFieldError(input);
            });
        });
    }
}

/**
 * Valida um campo específico do formulário
 * @param {HTMLElement} field - Campo a ser validado
 * @returns {boolean} - True se válido, false caso contrário
 */
function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    let errorMessage = '';
    
    // Remove erros anteriores
    clearFieldError(field);
    
    // Validações específicas por tipo de campo
    switch (field.type) {
        case 'email':
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (value && !emailRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor, insira um email válido.';
            }
            break;
            
        case 'tel':
            const phoneRegex = /^[\d\s\(\)\+\-]+$/;
            if (value && !phoneRegex.test(value)) {
                isValid = false;
                errorMessage = 'Por favor, insira um telefone válido.';
            }
            break;
    }
    
    // Validação de campos obrigatórios
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = 'Este campo é obrigatório.';
    }
    
    // Exibe erro se necessário
    if (!isValid) {
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

/**
 * Valida todo o formulário
 * @param {HTMLFormElement} form - Formulário a ser validado
 * @returns {boolean} - True se válido, false caso contrário
 */
function validateForm(form) {
    const fields = form.querySelectorAll('input[required], select[required], textarea[required]');
    let isFormValid = true;
    
    fields.forEach(field => {
        if (!validateField(field)) {
            isFormValid = false;
        }
    });
    
    return isFormValid;
}

/**
 * Exibe erro em um campo específico
 * @param {HTMLElement} field - Campo com erro
 * @param {string} message - Mensagem de erro
 */
function showFieldError(field, message) {
    field.classList.add('error');
    
    // Remove erro anterior se existir
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Adiciona nova mensagem de erro
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    errorElement.style.color = '#ef4444';
    errorElement.style.fontSize = '0.875rem';
    errorElement.style.marginTop = '0.25rem';
    
    field.parentNode.appendChild(errorElement);
}

/**
 * Remove erro de um campo específico
 * @param {HTMLElement} field - Campo para limpar erro
 */
function clearFieldError(field) {
    field.classList.remove('error');
    
    const errorMessage = field.parentNode.querySelector('.error-message');
    if (errorMessage) {
        errorMessage.remove();
    }
}

/**
 * Processa o envio do formulário
 * @param {HTMLFormElement} form - Formulário enviado
 */
function handleFormSubmission(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Mostra estado de carregamento
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    
    // Coleta dados do formulário
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Simula envio (aqui você integraria com seu backend)
    setTimeout(() => {
        showSuccessMessage();
        form.reset();
        
        // Restaura botão
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
    
    // Em um cenário real, você faria algo como:
    // fetch('/api/contact', {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(data)
    // })
    // .then(response => response.json())
    // .then(result => {
    //     showSuccessMessage();
    //     form.reset();
    // })
    // .catch(error => {
    //     showErrorMessage('Erro ao enviar mensagem. Tente novamente.');
    // })
    // .finally(() => {
    //     submitButton.textContent = originalText;
    //     submitButton.disabled = false;
    // });
}

/**
 * Exibe mensagem de sucesso após envio do formulário
 */
function showSuccessMessage() {
    const message = createNotification(
        'Mensagem enviada com sucesso! Entraremos em contato em breve.',
        'success'
    );
    
    document.body.appendChild(message);
    
    // Remove mensagem após 5 segundos
    setTimeout(() => {
        if (message.parentNode) {
            message.parentNode.removeChild(message);
        }
    }, 5000);
}

/**
 * Exibe mensagem de erro
 * @param {string} text - Texto da mensagem de erro
 */
function showErrorMessage(text) {
    const message = createNotification(text, 'error');
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        if (message.parentNode) {
            message.parentNode.removeChild(message);
        }
    }, 5000);
}

/**
 * Cria elemento de notificação
 * @param {string} text - Texto da notificação
 * @param {string} type - Tipo da notificação (success, error)
 * @returns {HTMLElement} - Elemento da notificação
 */
function createNotification(text, type) {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = text;
    
    // Estilos da notificação
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '1rem 1.5rem',
        borderRadius: '0.5rem',
        color: 'white',
        fontWeight: '500',
        zIndex: '9999',
        maxWidth: '400px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        transform: 'translateX(100%)',
        transition: 'transform 0.3s ease-in-out'
    });
    
    // Cores baseadas no tipo
    if (type === 'success') {
        notification.style.backgroundColor = '#10b981';
    } else if (type === 'error') {
        notification.style.backgroundColor = '#ef4444';
    }
    
    // Anima entrada
    setTimeout(() => {
        notification.style.transform = 'translateX(0)';
    }, 100);
    
    // Adiciona botão de fechar
    const closeButton = document.createElement('button');
    closeButton.innerHTML = '×';
    closeButton.style.cssText = `
        background: none;
        border: none;
        color: white;
        font-size: 1.5rem;
        cursor: pointer;
        margin-left: 1rem;
        padding: 0;
        line-height: 1;
    `;
    
    closeButton.addEventListener('click', () => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    });
    
    notification.appendChild(closeButton);
    
    return notification;
}

/**
 * Adiciona scroll suave para links de âncora
 */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const headerHeight = document.querySelector('.header').offsetHeight;
            const targetPosition = target.offsetTop - headerHeight - 20;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

/**
 * Adiciona efeito de parallax sutil ao hero
 */
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const heroGraphic = document.querySelector('.hero-graphic');
    
    if (heroGraphic && scrolled < window.innerHeight) {
        const rate = scrolled * -0.5;
        heroGraphic.style.transform = `translateY(${rate}px)`;
    }
});

/**
 * Otimização para performance - debounce para eventos de scroll
 */
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Aplica debounce aos eventos de scroll
const debouncedScrollHandler = debounce(function() {
    // Handlers de scroll otimizados podem ser adicionados aqui
}, 10);

window.addEventListener('scroll', debouncedScrollHandler);

/**
 * Adiciona suporte a teclado para navegação
 */
document.addEventListener('keydown', function(e) {
    // ESC fecha menu móvel
    if (e.key === 'Escape') {
        const hamburger = document.querySelector('.hamburger');
        const navMenu = document.querySelector('.nav-menu');
        
        if (hamburger && navMenu && navMenu.classList.contains('active')) {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = 'auto';
        }
    }
});

/**
 * Lazy loading para imagens (se houver)
 */
if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });
    
    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });
}

// Log de inicialização
console.log('AlgoritmumBrasil - Landing page carregada com sucesso! 🚀');