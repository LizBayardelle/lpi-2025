// Modern navigation with vanilla JavaScript
class Navigation {
  constructor() {
    this.isMenuOpen = false;
    this.init();
  }

  init() {
    this.setupMobileMenu();
    this.setupScrollNavbar();
    this.setupDropdowns();
    this.setupSmoothScrolling();
  }

  setupMobileMenu() {
    const menuToggle = document.querySelector('[data-menu-toggle]');
    const mobileMenu = document.querySelector('[data-mobile-menu]');
    const menuOverlay = document.querySelector('[data-menu-overlay]');
    
    if (!menuToggle || !mobileMenu) return;

    menuToggle.addEventListener('click', () => {
      this.toggleMobileMenu();
    });

    // Close menu when clicking overlay
    if (menuOverlay) {
      menuOverlay.addEventListener('click', () => {
        this.closeMobileMenu();
      });
    }

    // Close menu when clicking outside
    document.addEventListener('click', (e) => {
      if (this.isMenuOpen && !mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        this.closeMobileMenu();
      }
    });

    // Handle escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isMenuOpen) {
        this.closeMobileMenu();
      }
    });
  }

  toggleMobileMenu() {
    if (this.isMenuOpen) {
      this.closeMobileMenu();
    } else {
      this.openMobileMenu();
    }
  }

  openMobileMenu() {
    const mobileMenu = document.querySelector('[data-mobile-menu]');
    const menuOverlay = document.querySelector('[data-menu-overlay]');
    const menuToggle = document.querySelector('[data-menu-toggle]');
    
    this.isMenuOpen = true;
    mobileMenu.classList.add('active');
    if (menuOverlay) menuOverlay.classList.add('active');
    
    // Animate hamburger to X
    menuToggle.classList.add('active');
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden';
  }

  closeMobileMenu() {
    const mobileMenu = document.querySelector('[data-mobile-menu]');
    const menuOverlay = document.querySelector('[data-menu-overlay]');
    const menuToggle = document.querySelector('[data-menu-toggle]');
    
    this.isMenuOpen = false;
    mobileMenu.classList.remove('active');
    if (menuOverlay) menuOverlay.classList.remove('active');
    
    // Animate X back to hamburger
    menuToggle.classList.remove('active');
    
    // Restore body scroll
    document.body.style.overflow = '';
  }

  setupScrollNavbar() {
    const navbar = document.querySelector('[data-navbar]');
    if (!navbar) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      // Simple scroll-based background change: white to grey
      if (currentScrollY > 50) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    };

    // Throttle scroll events
    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    });
  }

  setupDropdowns() {
    const dropdownToggles = document.querySelectorAll('[data-dropdown-toggle]');
    
    dropdownToggles.forEach(toggle => {
      const dropdown = document.querySelector(toggle.dataset.dropdownToggle);
      if (!dropdown) return;

      toggle.addEventListener('click', (e) => {
        e.preventDefault();
        this.toggleDropdown(dropdown);
      });

      // Close dropdown when clicking outside
      document.addEventListener('click', (e) => {
        if (!toggle.contains(e.target) && !dropdown.contains(e.target)) {
          this.closeDropdown(dropdown);
        }
      });
    });
  }

  toggleDropdown(dropdown) {
    if (dropdown.classList.contains('active')) {
      this.closeDropdown(dropdown);
    } else {
      this.openDropdown(dropdown);
    }
  }

  openDropdown(dropdown) {
    // Close other dropdowns
    document.querySelectorAll('[data-dropdown]').forEach(other => {
      if (other !== dropdown) {
        this.closeDropdown(other);
      }
    });

    dropdown.classList.add('active');
  }

  closeDropdown(dropdown) {
    dropdown.classList.remove('active');
  }

  setupSmoothScrolling() {
    const scrollLinks = document.querySelectorAll('a[href^="#"]');
    
    scrollLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        
        const targetId = link.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
          const navbar = document.querySelector('[data-navbar]');
          const navbarHeight = navbar ? navbar.offsetHeight : 0;
          
          const targetPosition = targetElement.offsetTop - navbarHeight - 20;
          
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });

          // Close mobile menu if open
          if (this.isMenuOpen) {
            this.closeMobileMenu();
          }
        }
      });
    });
  }

  // Static utility method to highlight active nav item
  static highlightActiveNavItem() {
    const navLinks = document.querySelectorAll('[data-nav-link]');
    const currentPath = window.location.pathname;
    
    navLinks.forEach(link => {
      const linkPath = new URL(link.href).pathname;
      
      if (linkPath === currentPath) {
        link.classList.add('nav-link-active');
      } else {
        link.classList.remove('nav-link-active');
      }
    });
  }
}

// Initialize navigation when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new Navigation();
  Navigation.highlightActiveNavItem();
});

export default Navigation;