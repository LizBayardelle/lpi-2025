// Modern form handling with vanilla JavaScript
class FormHandler {
  constructor() {
    this.init();
  }

  init() {
    this.setupFormValidation();
    this.setupAjaxForms();
    this.setupFloatingLabels();
    this.setupFileUploads();
  }

  setupFormValidation() {
    const forms = document.querySelectorAll('form[data-validate]');
    
    forms.forEach(form => {
      form.addEventListener('submit', (e) => {
        if (!this.validateForm(form)) {
          e.preventDefault();
          this.showValidationErrors(form);
        }
      });

      // Real-time validation
      const inputs = form.querySelectorAll('input, textarea, select');
      inputs.forEach(input => {
        input.addEventListener('blur', () => {
          this.validateField(input);
        });
      });
    });
  }

  validateForm(form) {
    let isValid = true;
    const inputs = form.querySelectorAll('input[required], textarea[required], select[required]');
    
    inputs.forEach(input => {
      if (!this.validateField(input)) {
        isValid = false;
      }
    });

    return isValid;
  }

  validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    let isValid = true;
    let errorMessage = '';

    // Required field validation
    if (field.hasAttribute('required') && !value) {
      isValid = false;
      errorMessage = 'This field is required';
    }

    // Email validation
    if (type === 'email' && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        isValid = false;
        errorMessage = 'Please enter a valid email address';
      }
    }

    // Phone validation
    if (field.classList.contains('phone-input') && value) {
      const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
      if (!phoneRegex.test(value.replace(/\s+/g, ''))) {
        isValid = false;
        errorMessage = 'Please enter a valid phone number';
      }
    }

    // Password validation
    if (type === 'password' && value) {
      if (value.length < 8) {
        isValid = false;
        errorMessage = 'Password must be at least 8 characters long';
      }
    }

    this.toggleFieldError(field, isValid, errorMessage);
    return isValid;
  }

  toggleFieldError(field, isValid, errorMessage) {
    const errorElement = field.parentNode.querySelector('.field-error');
    
    if (isValid) {
      field.classList.remove('border-red-500');
      field.classList.add('border-green-500');
      if (errorElement) {
        errorElement.remove();
      }
    } else {
      field.classList.add('border-red-500');
      field.classList.remove('border-green-500');
      
      if (!errorElement) {
        const error = document.createElement('div');
        error.className = 'field-error text-red-500 text-sm mt-1';
        error.textContent = errorMessage;
        field.parentNode.appendChild(error);
      } else {
        errorElement.textContent = errorMessage;
      }
    }
  }

  setupAjaxForms() {
    const ajaxForms = document.querySelectorAll('form[data-ajax]');
    
    ajaxForms.forEach(form => {
      form.addEventListener('submit', (e) => {
        e.preventDefault();
        this.submitFormAjax(form);
      });
    });
  }

  async submitFormAjax(form) {
    const submitButton = form.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    
    // Show loading state
    submitButton.disabled = true;
    submitButton.textContent = 'Sending...';
    
    try {
      const formData = new FormData(form);
      const response = await fetch(form.action, {
        method: form.method,
        body: formData,
        headers: {
          'X-Requested-With': 'XMLHttpRequest',
          'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').content
        }
      });

      const result = await response.json();
      
      if (response.ok) {
        this.showSuccessMessage(form, result.message || 'Form submitted successfully!');
        form.reset();
      } else {
        this.showErrorMessage(form, result.message || 'An error occurred. Please try again.');
      }
    } catch (error) {
      this.showErrorMessage(form, 'Network error. Please check your connection and try again.');
    } finally {
      // Restore button state
      submitButton.disabled = false;
      submitButton.textContent = originalText;
    }
  }

  showSuccessMessage(form, message) {
    this.removeExistingMessages(form);
    const successDiv = document.createElement('div');
    successDiv.className = 'bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mt-4';
    successDiv.textContent = message;
    form.parentNode.insertBefore(successDiv, form.nextSibling);
  }

  showErrorMessage(form, message) {
    this.removeExistingMessages(form);
    const errorDiv = document.createElement('div');
    errorDiv.className = 'bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mt-4';
    errorDiv.textContent = message;
    form.parentNode.insertBefore(errorDiv, form.nextSibling);
  }

  removeExistingMessages(form) {
    const existing = form.parentNode.querySelectorAll('.bg-green-100, .bg-red-100');
    existing.forEach(el => el.remove());
  }

  setupFloatingLabels() {
    const inputs = document.querySelectorAll('.floating-label-input');
    
    inputs.forEach(input => {
      const label = input.nextElementSibling;
      
      input.addEventListener('focus', () => {
        label.classList.add('floating-label-active');
      });
      
      input.addEventListener('blur', () => {
        if (!input.value) {
          label.classList.remove('floating-label-active');
        }
      });
      
      // Check initial state
      if (input.value) {
        label.classList.add('floating-label-active');
      }
    });
  }

  setupFileUploads() {
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
      input.addEventListener('change', (e) => {
        const file = e.target.files[0];
        const preview = input.parentNode.querySelector('.file-preview');
        
        if (file && preview) {
          if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = (e) => {
              preview.innerHTML = `<img src="${e.target.result}" class="max-w-32 max-h-32 object-cover rounded">`;
            };
            reader.readAsDataURL(file);
          } else {
            preview.innerHTML = `<div class="text-sm text-gray-600">${file.name}</div>`;
          }
        }
      });
    });
  }
}

// Initialize form handling when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new FormHandler();
});

export default FormHandler;