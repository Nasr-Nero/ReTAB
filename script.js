/**
 * ====================================================================
 * ReTAB / Bravo Jaram - Interactive Operations Script
 * ====================================================================
 * Author: Senior Creative Technologist & Frontend Lead
 * Description: Implements high-end micro-interactions, responsive states,
 *              scroll observer thresholds, and counter animators.
 * ====================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeaderScroll();
  initHeroChartPeriods();
  initMobileMenu();
  initFaqAccordion();
  initNumberCounters();
  initNewsletterForm();
  initScrollReveal();
});

/**
 * 1. Scroll-Activated Header Styling
 * The header starts as position:absolute (transparent over hero).
 * On scroll > 40px it becomes position:fixed with glass background.
 */
function initHeaderScroll() {
  const header = document.getElementById('mainHeader');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 60) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  // Run immediately to set correct state
  handleScroll();
  window.addEventListener('scroll', handleScroll, { passive: true });
}

/**
 * 1b. Hero Chart Period Button Toggle
 */
function initHeroChartPeriods() {
  const periods = document.querySelectorAll('.hfc-period');
  periods.forEach(btn => {
    btn.addEventListener('click', () => {
      periods.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
    });
  });
}

/**
 * 2. Responsive Hamburger Menu Toggle
 * Manages mobile drawer layout opening/closing with focus lock.
 */
function initMobileMenu() {
  const trigger = document.getElementById('mobileMenuTrigger');
  const menu = document.getElementById('navMenu');
  const links = menu ? menu.querySelectorAll('a') : [];

  if (!trigger || !menu) return;

  const toggleMenu = () => {
    const isActive = trigger.classList.toggle('active');
    menu.classList.toggle('active');
    document.body.style.overflow = isActive ? 'hidden' : '';
  };

  trigger.addEventListener('click', toggleMenu);

  // Close menu when clicking a navigation link
  links.forEach(link => {
    link.addEventListener('click', () => {
      trigger.classList.remove('active');
      menu.classList.remove('active');
      document.body.style.overflow = '';
      
      // Update active state visual indicators
      links.forEach(l => l.classList.remove('active'));
      link.classList.add('active');
    });
  });
}

/**
 * 3. FAQ Accordion Toggle
 * Smooth expanding/collapsing of FAQ answers with only one open state allowed.
 */
function initFaqAccordion() {
  const items = document.querySelectorAll('.faq-item');

  items.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const content = item.querySelector('.faq-content');

    if (!trigger || !content) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('active');

      // Close all other accordion items
      items.forEach(otherItem => {
        if (otherItem !== item && otherItem.classList.contains('active')) {
          otherItem.classList.remove('active');
          otherItem.querySelector('.faq-content').style.maxHeight = '';
        }
      });

      // Toggle current item
      if (isOpen) {
        item.classList.remove('active');
        content.style.maxHeight = '';
      } else {
        item.classList.add('active');
        // Setting height dynamically for transition matching the content
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });
}

/**
 * 4. Micro-counter Animator (Stats & Indicators)
 * Animates numbers sequentially from 0 up to their target value on scroll reveal.
 */
function initNumberCounters() {
  const counters = document.querySelectorAll('#liveCounter, .stats-card-lite .num');
  
  const animateCounter = (counter) => {
    const targetText = counter.getAttribute('data-target') || counter.innerText;
    // Extract integer values from text (like '100%' -> 100, '35' -> 35)
    const targetValue = parseInt(targetText.replace(/[^0-9]/g, ''), 10);
    const suffix = targetText.replace(/[0-9]/g, ''); // Keep '%' or '+' characters
    
    if (isNaN(targetValue)) return;
    
    let start = 0;
    const duration = 1500; // Total animation duration in ms
    const startTime = performance.now();
    
    const updateNumber = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease out quad formula
      const easedProgress = progress * (2 - progress);
      const currentValue = Math.floor(easedProgress * targetValue);
      
      counter.innerText = currentValue.toLocaleString() + suffix;
      
      if (progress < 1) {
        requestAnimationFrame(updateNumber);
      } else {
        counter.innerText = targetText; // Final guarantee
      }
    };
    
    requestAnimationFrame(updateNumber);
  };

  // Intersection Observer to run when counters are visible
  const observer = new IntersectionObserver((entries, self) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        // Store original target inside data-target if not done
        if (!target.hasAttribute('data-target')) {
          target.setAttribute('data-target', target.innerText);
          target.innerText = '0';
        }
        animateCounter(target);
        self.unobserve(target); // Only animate once
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

  counters.forEach(counter => {
    // Save target and clear display initially to prepare animate
    counter.setAttribute('data-target', counter.innerText);
    counter.innerText = '0';
    observer.observe(counter);
  });
}

/**
 * 5. Newsletter Signup Handler
 * Simulates a secure subscription API feedback.
 */
function initNewsletterForm() {
  const form = document.getElementById('newsletterForm');
  const feedback = document.getElementById('newsletterFeedback');

  if (!form || !feedback) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const emailInput = form.querySelector('input[type="email"]');
    const email = emailInput ? emailInput.value : '';

    if (!email) return;

    // Simulate API call
    feedback.style.display = 'block';
    feedback.style.color = '#06b6d4'; // Accent blue
    feedback.innerText = 'Inscription en cours...';

    setTimeout(() => {
      feedback.style.color = '#10b981'; // Green Success
      feedback.innerText = 'Merci ! Vous êtes maintenant inscrit à notre réseau.';
      form.reset();
    }, 1000);
  });
}

/**
 * 6. Dynamic Scroll Reveal Effects
 * Adds subtle fade-in up transitions to sections as the user scrolls.
 */
function initScrollReveal() {
  const sections = document.querySelectorAll('main > section');
  
  // Apply initial hidden styles programmatically to avoid breaks on disabled JS
  sections.forEach(sec => {
    sec.style.opacity = '0';
    sec.style.transform = 'translateY(24px)';
    sec.style.transition = 'opacity 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94), transform 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  });

  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const sec = entry.target;
        sec.style.opacity = '1';
        sec.style.transform = 'translateY(0)';
        observer.unobserve(sec); // Stop observing once revealed
      }
    });
  }, { threshold: 0.05 });

  sections.forEach(sec => {
    sectionObserver.observe(sec);
  });
}
