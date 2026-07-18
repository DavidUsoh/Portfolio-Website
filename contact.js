// ============================================================
// CONTACT FORM VALIDATION
// Demonstrates: event handling, form validation, DOM manipulation
// Rules: no empty fields, valid email format, digits-only phone
// ============================================================

const contactForm = document.getElementById('contactForm');
const formSuccess = document.getElementById('formSuccess');

const fields = {
  name: { input: document.getElementById('name'), group: document.getElementById('nameGroup'), error: document.getElementById('nameError') },
  email: { input: document.getElementById('email'), group: document.getElementById('emailGroup'), error: document.getElementById('emailError') },
  phone: { input: document.getElementById('phone'), group: document.getElementById('phoneGroup'), error: document.getElementById('phoneError') },
  message: { input: document.getElementById('message'), group: document.getElementById('messageGroup'), error: document.getElementById('messageError') }
};

// Simple, readable email pattern: something@something.tld
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Digits only (allows an optional leading + for international format)
const PHONE_PATTERN = /^\+?[0-9]+$/;

function showError(fieldKey, message) {
  const field = fields[fieldKey];
  field.group.classList.add('invalid');
  field.error.textContent = message;
}

function clearError(fieldKey) {
  const field = fields[fieldKey];
  field.group.classList.remove('invalid');
  field.error.textContent = '';
}

function validateField(fieldKey) {
  const value = fields[fieldKey].input.value.trim();

  if (value === '') {
    showError(fieldKey, 'This field cannot be empty.');
    return false;
  }

  if (fieldKey === 'email' && !EMAIL_PATTERN.test(value)) {
    showError(fieldKey, 'Enter a valid email address, e.g. name@example.com.');
    return false;
  }

  if (fieldKey === 'phone' && !PHONE_PATTERN.test(value)) {
    showError(fieldKey, 'Phone number should contain digits only.');
    return false;
  }

  clearError(fieldKey);
  return true;
}

function validateForm() {
  let isValid = true;
  Object.keys(fields).forEach(function (fieldKey) {
    const fieldValid = validateField(fieldKey);
    if (!fieldValid) isValid = false;
  });
  return isValid;
}

// Validate a field as soon as the user leaves it
Object.keys(fields).forEach(function (fieldKey) {
  fields[fieldKey].input.addEventListener('blur', function () {
    validateField(fieldKey);
  });
  fields[fieldKey].input.addEventListener('input', function () {
    if (fields[fieldKey].group.classList.contains('invalid')) {
      validateField(fieldKey);
    }
  });
});

contactForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const allValid = validateForm();

  if (allValid) {
    formSuccess.classList.add('show');
    contactForm.reset();
    // In a real deployment this is where you'd send the data
    // to a backend or an email service (e.g. Formspree, EmailJS).
    setTimeout(function () {
      formSuccess.classList.remove('show');
    }, 4000);
  } else {
    formSuccess.classList.remove('show');
  }
});
