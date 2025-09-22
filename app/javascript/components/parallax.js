// Modern parallax effects with Intersection Observer and requestAnimationFrame
class ParallaxController {
  constructor() {
    this.parallaxElements = [];
    this.isScrolling = false;
    this.init();
  }

  init() {
    this.setupParallaxElements();
    this.setupScrollListener();
    this.setupIntersectionObserver();
  }

  setupParallaxElements() {
    const elements = document.querySelectorAll('[data-parallax]');
    
    elements.forEach(element => {
      const speed = parseFloat(element.dataset.parallax) || 0.5;
      const direction = element.dataset.parallaxDirection || 'vertical';
      
      this.parallaxElements.push({
        element,
        speed,
        direction,
        isVisible: false,
        originalTransform: element.style.transform || ''
      });
    });
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const parallaxData = this.parallaxElements.find(
          item => item.element === entry.target
        );
        
        if (parallaxData) {
          parallaxData.isVisible = entry.isIntersecting;
        }
      });
    }, {
      threshold: 0,
      rootMargin: '50px 0px 50px 0px'
    });

    this.parallaxElements.forEach(item => {
      observer.observe(item.element);
    });
  }

  setupScrollListener() {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          this.updateParallaxElements();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  updateParallaxElements() {
    const scrollY = window.pageYOffset;
    
    this.parallaxElements.forEach(item => {
      if (!item.isVisible) return;

      const { element, speed, direction, originalTransform } = item;
      const elementTop = element.offsetTop;
      const elementHeight = element.offsetHeight;
      const windowHeight = window.innerHeight;
      
      // Calculate the parallax offset
      const offset = (scrollY - elementTop + windowHeight) * speed;
      
      let transform = originalTransform;
      
      switch (direction) {
        case 'vertical':
          transform += ` translateY(${offset}px)`;
          break;
        case 'horizontal':
          transform += ` translateX(${offset}px)`;
          break;
        case 'scale':
          const scale = 1 + (offset * 0.001);
          transform += ` scale(${Math.max(0.8, Math.min(1.2, scale))})`;
          break;
        case 'rotate':
          transform += ` rotate(${offset * 0.1}deg)`;
          break;
      }
      
      element.style.transform = transform;
    });
  }

  // Method to add parallax effect to new elements dynamically
  addParallaxElement(element, speed = 0.5, direction = 'vertical') {
    const parallaxData = {
      element,
      speed,
      direction,
      isVisible: false,
      originalTransform: element.style.transform || ''
    };
    
    this.parallaxElements.push(parallaxData);
    
    // Set up intersection observer for the new element
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.target === element) {
          parallaxData.isVisible = entry.isIntersecting;
        }
      });
    });
    
    observer.observe(element);
  }

  // Method to remove parallax effect from an element
  removeParallaxElement(element) {
    const index = this.parallaxElements.findIndex(item => item.element === element);
    if (index > -1) {
      this.parallaxElements.splice(index, 1);
      element.style.transform = this.parallaxElements[index]?.originalTransform || '';
    }
  }
}

// Hero section specific parallax effects
class HeroParallax {
  constructor() {
    this.setupHeroParallax();
  }

  setupHeroParallax() {
    const heroSections = document.querySelectorAll('.hero-section');
    
    heroSections.forEach(hero => {
      const background = hero.querySelector('.hero-background');
      const content = hero.querySelector('.hero-content');
      
      if (background) {
        this.setupBackgroundParallax(background);
      }
      
      if (content) {
        this.setupContentParallax(content);
      }
    });
  }

  setupBackgroundParallax(background) {
    let ticking = false;
    const heroSection = background.closest('.hero-section');
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.pageYOffset;
          const heroRect = heroSection.getBoundingClientRect();
          const heroTop = scrollY + heroRect.top;
          const heroHeight = heroRect.height;
          
          // Only apply parallax when hero is in viewport
          if (heroRect.bottom >= 0 && heroRect.top <= window.innerHeight) {
            // Calculate parallax offset relative to hero position
            const relativeScroll = scrollY - heroTop;
            const rate = relativeScroll * -0.3; // Reduced intensity for shorter sections
            background.style.transform = `translateY(${rate}px)`;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }

  setupContentParallax(content) {
    let ticking = false;
    const heroSection = content.closest('.hero-section');
    
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const scrollY = window.pageYOffset;
          const heroRect = heroSection.getBoundingClientRect();
          const heroTop = scrollY + heroRect.top;
          const heroHeight = heroRect.height;
          
          // Only apply effects when hero is in viewport
          if (heroRect.bottom >= 0 && heroRect.top <= window.innerHeight) {
            // Calculate effects relative to hero position and height
            const relativeScroll = scrollY - heroTop;
            const scrollProgress = Math.max(0, Math.min(1, relativeScroll / heroHeight));
            
            const rate = relativeScroll * 0.2; // Subtle movement
            const opacity = Math.max(0.3, 1 - scrollProgress * 0.7); // Don't fade completely
            
            content.style.transform = `translateY(${rate}px)`;
            content.style.opacity = opacity;
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
  }
}

// Mouse parallax for interactive elements
class MouseParallax {
  constructor() {
    this.setupMouseParallax();
  }

  setupMouseParallax() {
    const elements = document.querySelectorAll('[data-mouse-parallax]');
    
    elements.forEach(element => {
      const intensity = parseFloat(element.dataset.mouseParallax) || 0.1;
      
      element.addEventListener('mousemove', (e) => {
        const rect = element.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const deltaX = (x - centerX) * intensity;
        const deltaY = (y - centerY) * intensity;
        
        element.style.transform = `translate(${deltaX}px, ${deltaY}px)`;
      });
      
      element.addEventListener('mouseleave', () => {
        element.style.transform = 'translate(0px, 0px)';
      });
    });
  }
}

// Initialize parallax effects when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if user hasn't indicated they prefer reduced motion
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    new ParallaxController();
    new HeroParallax();
    new MouseParallax();
  }
});

export { ParallaxController, HeroParallax, MouseParallax };