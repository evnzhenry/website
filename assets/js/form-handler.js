// Form Handler for STRONIC HOLDINGS
// Handles contact forms and callback requests

document.addEventListener('DOMContentLoaded', function() {
    // Contact form handler
    const contactForm = document.getElementById('contact');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleContactForm(this);
        });
    }

    // Callback form handler
    const callbackForm = document.getElementById('callback-form');
    if (callbackForm) {
        callbackForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleCallbackForm(this);
        });
    }

    // Newsletter form handler
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            handleNewsletterForm(this);
        });
    }
});

function handleContactForm(form) {
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        email: formData.get('email'),
        subject: formData.get('subject'),
        message: formData.get('message')
    };

    // Validate form data
    if (!validateContactForm(data)) {
        return;
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;

    // Simulate form submission (replace with actual backend endpoint)
    setTimeout(() => {
        showSuccessMessage('Thank you for your message! We will get back to you within 24 hours.');
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function handleCallbackForm(form) {
    const formData = new FormData(form);
    const data = {
        name: formData.get('name'),
        phone: formData.get('phone'),
        email: formData.get('email'),
        service: formData.get('service'),
        message: formData.get('message')
    };

    // Validate form data
    if (!validateCallbackForm(data)) {
        return;
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Requesting...';
    submitBtn.disabled = true;

    // Simulate form submission
    setTimeout(() => {
        showSuccessMessage('Callback request submitted! We will contact you within 2 business hours.');
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 2000);
}

function handleNewsletterForm(form) {
    const formData = new FormData(form);
    const email = formData.get('email');

    if (!validateEmail(email)) {
        showErrorMessage('Please enter a valid email address.');
        return;
    }

    // Show loading state
    const submitBtn = form.querySelector('button[type="submit"]');
    const originalText = submitBtn.textContent;
    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;

    // Simulate form submission
    setTimeout(() => {
        showSuccessMessage('Successfully subscribed to our newsletter!');
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }, 1500);
}

function validateContactForm(data) {
    if (!data.name || data.name.trim().length < 2) {
        showErrorMessage('Please enter a valid name (at least 2 characters).');
        return false;
    }

    if (!validateEmail(data.email)) {
        showErrorMessage('Please enter a valid email address.');
        return false;
    }

    if (!data.subject || data.subject.trim().length < 3) {
        showErrorMessage('Please enter a subject (at least 3 characters).');
        return false;
    }

    if (!data.message || data.message.trim().length < 10) {
        showErrorMessage('Please enter a message (at least 10 characters).');
        return false;
    }

    return true;
}

function validateCallbackForm(data) {
    if (!data.name || data.name.trim().length < 2) {
        showErrorMessage('Please enter a valid name (at least 2 characters).');
        return false;
    }

    if (!validatePhone(data.phone)) {
        showErrorMessage('Please enter a valid phone number.');
        return false;
    }

    if (!validateEmail(data.email)) {
        showErrorMessage('Please enter a valid email address.');
        return false;
    }

    if (!data.service) {
        showErrorMessage('Please select a service.');
        return false;
    }

    return true;
}

function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePhone(phone) {
    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    return phoneRegex.test(phone.replace(/[\s\-\(\)]/g, ''));
}

function showSuccessMessage(message) {
    showMessage(message, 'success');
}

function showErrorMessage(message) {
    showMessage(message, 'error');
}

function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.form-message');
    existingMessages.forEach(msg => msg.remove());

    // Create message element
    const messageDiv = document.createElement('div');
    messageDiv.className = `form-message ${type}`;
    messageDiv.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        border-radius: 5px;
        color: white;
        font-weight: bold;
        z-index: 10000;
        max-width: 400px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        ${type === 'success' ? 'background-color: #28a745;' : 'background-color: #dc3545;'}
    `;
    messageDiv.textContent = message;

    // Add to page
    document.body.appendChild(messageDiv);

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Phone number formatting
function formatPhoneNumber(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 10) {
        value = value.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    } else if (value.length >= 6) {
        value = value.replace(/(\d{3})(\d{3})/, '($1) $2-');
    } else if (value.length >= 3) {
        value = value.replace(/(\d{3})/, '($1) ');
    }
    input.value = value;
}

// Add phone formatting to phone inputs
document.addEventListener('DOMContentLoaded', function() {
    const phoneInputs = document.querySelectorAll('input[type="tel"], input[name="phone"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            formatPhoneNumber(this);
        });
    });
});