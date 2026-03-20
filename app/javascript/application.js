// Entry point for the build script in your package.json
import "./controllers"

// Modern LPI JavaScript Components
import "./components/animations"
import "./components/forms"
import "./components/navigation"
import "./components/parallax"

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  console.log('LPI-2025 Modern App Initialized');

  // Auto-dismiss flash toasts after 5s
  document.querySelectorAll('[data-flash-toast]').forEach(function(toast) {
    setTimeout(function() {
      toast.classList.add('flash-out');
      toast.addEventListener('animationend', function() { toast.remove(); });
    }, 5000);
  });
});
