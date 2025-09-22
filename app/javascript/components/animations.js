// Modern scroll-based animations using Intersection Observer
class ScrollAnimations {
  constructor() {
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.setupParallaxElements();
  }

  setupIntersectionObserver() {
    const options = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate');
          
          // Add staggered animation delay for multiple elements
          const siblings = Array.from(entry.target.parentNode.children)
            .filter(el => el.classList.contains('animate-on-scroll'));
          
          siblings.forEach((sibling, index) => {
            if (sibling === entry.target) {
              sibling.style.transitionDelay = `${index * 0.1}s`;
            }
          });
        }
      });
    }, options);

    // Observe all elements marked for animation
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  setupParallaxElements() {
    const parallaxElements = document.querySelectorAll('[data-parallax]');
    
    if (parallaxElements.length === 0) return;

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      
      parallaxElements.forEach(element => {
        const rate = scrolled * -0.5;
        element.style.transform = `translateY(${rate}px)`;
      });
    };

    // Throttle scroll events for better performance
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

  // Utility method to add fade-in animation to any element
  static fadeInElement(element, delay = 0) {
    element.style.opacity = '0';
    element.style.transform = 'translateY(30px)';
    element.style.transition = 'all 0.8s ease-in-out';
    
    setTimeout(() => {
      element.style.opacity = '1';
      element.style.transform = 'translateY(0)';
    }, delay);
  }

  // Utility method for typing effect
  static typeWriter(element, text, speed = 50) {
    element.innerHTML = '';
    let i = 0;
    
    const timer = setInterval(() => {
      if (i < text.length) {
        element.innerHTML += text.charAt(i);
        i++;
      } else {
        clearInterval(timer);
      }
    }, speed);
  }
}

// Initialize animations when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  new ScrollAnimations();
});

export default ScrollAnimations;