/**
 * Happy Birthday Diya - Interactive Web Application
 * Handles envelope reveal with scroll lock, stackable 3-page letter,
 * memory board lightbox modal, 9-photo swipeable Navratri Bump deck,
 * autoplaying song player, and scratch card with popper confetti.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    window.lucide.createIcons();
  }

  /* ==========================================================
     1. Ambient Floating Particles Background
     ========================================================== */
  const canvas = document.getElementById('ambient-canvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  let particles = [];
  let width, height;

  function resizeCanvas() {
    if (!canvas) return;
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  class SparkleParticle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x = Math.random() * (width || window.innerWidth);
      this.y = Math.random() * (height || window.innerHeight);
      this.size = Math.random() * 2 + 0.6;
      this.speedY = -(Math.random() * 0.35 + 0.1);
      this.speedX = (Math.random() - 0.5) * 0.25;
      this.alpha = Math.random() * 0.7 + 0.2;
      this.fade = (Math.random() * 0.008 + 0.004) * (Math.random() > 0.5 ? 1 : -1);
      this.color = Math.random() > 0.4 ? '#ff2a85' : (Math.random() > 0.5 ? '#ffd166' : '#9d4edd');
    }
    update() {
      this.y += this.speedY;
      this.x += this.speedX;
      this.alpha += this.fade;
      if (this.alpha <= 0.1 || this.alpha >= 0.9) this.fade = -this.fade;
      if (this.y < -10 || this.x < -10 || this.x > width + 10) {
        this.reset();
        this.y = height + 5;
      }
    }
    draw() {
      if (!ctx) return;
      ctx.save();
      ctx.globalAlpha = Math.max(0, Math.min(1, this.alpha));
      ctx.fillStyle = this.color;
      ctx.shadowBlur = 8;
      ctx.shadowColor = this.color;
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }

  if (canvas && ctx) {
    for (let i = 0; i < 40; i++) {
      particles.push(new SparkleParticle());
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  /* ==========================================================
     Confetti Popper Explosion Helper
     ========================================================== */
  function triggerPopperConfetti() {
    if (typeof confetti === 'function') {
      confetti({
        particleCount: 80,
        spread: 90,
        origin: { y: 0.65 },
        colors: ['#ff2a85', '#ffd166', '#9d4edd', '#00f2fe', '#ffffff']
      });
      setTimeout(() => {
        confetti({
          particleCount: 50,
          angle: 60,
          spread: 70,
          origin: { x: 0, y: 0.6 }
        });
        confetti({
          particleCount: 50,
          angle: 120,
          spread: 70,
          origin: { x: 1, y: 0.6 }
        });
      }, 300);
    }
  }

  /* ==========================================================
     2. Envelope Opening, Letter Emerging, Zoom & Screen Exit
     ========================================================== */
  const heartSealBtn = document.getElementById('heartSealBtn');
  const envelopeWrapper = document.getElementById('envelopeWrapper');
  const envelopeScene = document.getElementById('envelopeScene');
  const letterPreview = document.getElementById('letterPreview');
  const heroReveal = document.getElementById('heroReveal');
  const heroScrollPrompt = document.getElementById('heroScrollPrompt');
  const appContainer = document.getElementById('app');

  let isEnvelopeOpened = false;
  let exitTimeoutId = null;

  function executeSceneExit() {
    if (exitTimeoutId) {
      clearTimeout(exitTimeoutId);
      exitTimeoutId = null;
    }
    if (!envelopeScene || envelopeScene.classList.contains('exit-screen')) return;

    // Everything moves out from the screen
    envelopeScene.classList.add('exit-screen');

    // Confetti celebration
    triggerPopperConfetti();

    // Prepare hero reveal and unlock scrolling
    heroReveal.classList.remove('hidden');
    appContainer.classList.remove('scroll-locked');

    setTimeout(() => {
      heroReveal.classList.add('active');
      triggerPopperConfetti();
    }, 400);

    setTimeout(() => {
      envelopeScene.style.display = 'none';
    }, 1100);
  }

  function openEnvelope() {
    if (isEnvelopeOpened) return;
    isEnvelopeOpened = true;

    // 1. Break heart seal & flip flap open
    envelopeScene.classList.add('scene-opening');
    envelopeWrapper.classList.add('opening');
    triggerPopperConfetti();

    // 2. Letter smoothly pulls upward out of the envelope pocket
    setTimeout(() => {
      envelopeWrapper.classList.add('letter-pull');
    }, 450);

    // 3. Letter jumps forward in front of envelope & scales up with spring bounce
    setTimeout(() => {
      envelopeWrapper.classList.add('letter-forward');
      
      // Sparkle confetti burst as letter comes forward
      if (typeof confetti === 'function') {
        confetti({
          particleCount: 35,
          spread: 60,
          origin: { y: 0.55 },
          colors: ['#ff2a85', '#ff5ca1', '#ffd700', '#ffffff']
        });
      }
    }, 1200);

    // 4. Letter stays forward for a few seconds (3s), then everything moves out from screen
    exitTimeoutId = setTimeout(() => {
      executeSceneExit();
    }, 4200);

    // Allow user to tap the forward letter card to proceed immediately if desired
    if (letterPreview) {
      letterPreview.addEventListener('click', (e) => {
        e.stopPropagation();
        if (envelopeWrapper.classList.contains('letter-forward')) {
          executeSceneExit();
        }
      });
    }
  }

  if (heartSealBtn) {
    heartSealBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      openEnvelope();
    });
  }
  if (envelopeWrapper) {
    envelopeWrapper.addEventListener('click', openEnvelope);
  }

  if (heroScrollPrompt) {
    heroScrollPrompt.addEventListener('click', () => {
      const slide2 = document.getElementById('slide-2');
      if (slide2) slide2.scrollIntoView({ behavior: 'smooth' });
    });
  }

  /* ==========================================================
     3. Slide 2: Stackable 3-Page Letter (Swipe Gestures)
     ========================================================== */
  const letterCards = Array.from(document.querySelectorAll('.letter-card'));
  const letterDots = Array.from(document.querySelectorAll('.letter-pagination .dot'));
  let currentLetterPage = 0;
  let letterStartX = 0;
  let letterStartY = 0;
  let letterCurrentX = 0;
  let isLetterDragging = false;

  function updateLetterStack(newIndex) {
    currentLetterPage = (newIndex + letterCards.length) % letterCards.length;

    letterCards.forEach((card, idx) => {
      card.style.transform = '';
      card.style.opacity = '';
      card.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease';

      card.classList.remove('active-card', 'card-behind-1', 'card-behind-2');

      const relativeIndex = (idx - currentLetterPage + letterCards.length) % letterCards.length;

      if (relativeIndex === 0) {
        card.classList.add('active-card');
      } else if (relativeIndex === 1) {
        card.classList.add('card-behind-1');
      } else {
        card.classList.add('card-behind-2');
      }
    });

    letterDots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentLetterPage);
    });
  }

  function setupLetterSwipes() {
    const stackWrapper = document.getElementById('letterStackWrapper');
    if (!stackWrapper) return;

    stackWrapper.addEventListener('touchstart', (e) => {
      const activeCard = stackWrapper.querySelector('.letter-card.active-card');
      if (!activeCard) return;
      isLetterDragging = true;
      letterStartX = e.touches[0].clientX;
      letterStartY = e.touches[0].clientY;
      letterCurrentX = letterStartX;
      activeCard.style.transition = 'none';
    }, { passive: true });

    stackWrapper.addEventListener('touchmove', (e) => {
      if (!isLetterDragging) return;
      const activeCard = stackWrapper.querySelector('.letter-card.active-card');
      if (!activeCard) return;

      letterCurrentX = e.touches[0].clientX;
      const diffX = letterCurrentX - letterStartX;
      const diffY = e.touches[0].clientY - letterStartY;

      // Rotate with drag
      const rotate = diffX * 0.08;
      activeCard.style.transform = `translate3d(${diffX}px, ${diffY * 0.25}px, 0) rotate(${rotate}deg)`;
    }, { passive: true });

    stackWrapper.addEventListener('touchend', () => {
      if (!isLetterDragging) return;
      isLetterDragging = false;
      const activeCard = stackWrapper.querySelector('.letter-card.active-card');
      if (!activeCard) return;

      const diffX = letterCurrentX - letterStartX;

      if (Math.abs(diffX) > 60) {
        // Fly card out
        activeCard.style.transition = 'transform 0.35s ease-out, opacity 0.35s ease-out';
        activeCard.style.transform = `translate3d(${diffX > 0 ? 120 : -120}%, 0, 0) rotate(${diffX > 0 ? 15 : -15}deg)`;
        activeCard.style.opacity = '0';

        setTimeout(() => {
          updateLetterStack(currentLetterPage + 1);
        }, 300);
      } else {
        // Snap back
        activeCard.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
        activeCard.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
      }
    });

    // Pagination Dots click
    letterDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        updateLetterStack(idx);
      });
    });

    // Tapping on the active card also advances
    letterCards.forEach((card) => {
      card.addEventListener('click', (e) => {
        if (card.classList.contains('active-card') && Math.abs(letterCurrentX - letterStartX) < 10) {
          updateLetterStack(currentLetterPage + 1);
        }
      });
    });
  }
  setupLetterSwipes();

  /* ==========================================================
     4. Slide 3: Memory Board Lightbox Modal
     ========================================================== */
  const lightboxModal = document.getElementById('lightboxModal');
  const lightboxBackdrop = document.getElementById('lightboxBackdrop');
  const lightboxCloseBtn = document.getElementById('lightboxCloseBtn');
  const lightboxMediaWrapper = document.getElementById('lightboxMediaWrapper');
  const lightboxCaption = document.getElementById('lightboxCaption');
  const clickableItems = document.querySelectorAll('.clickable-media');

  function openLightbox(mediaType, src, caption) {
    if (!lightboxModal || !lightboxMediaWrapper) return;

    lightboxMediaWrapper.innerHTML = '';
    lightboxCaption.textContent = caption || '';

    if (mediaType === 'image') {
      const img = document.createElement('img');
      img.src = src;
      img.alt = caption || 'Photo memory';
      lightboxMediaWrapper.appendChild(img);
    } else if (mediaType === 'video') {
      const vid = document.createElement('video');
      vid.src = src;
      vid.loop = true;
      vid.autoplay = true;
      vid.playsInline = true;
      vid.controls = true;
      lightboxMediaWrapper.appendChild(vid);
    }

    lightboxModal.classList.add('active');
    lightboxModal.setAttribute('aria-hidden', 'false');
  }

  function closeLightbox() {
    if (!lightboxModal) return;
    lightboxModal.classList.remove('active');
    lightboxModal.setAttribute('aria-hidden', 'true');

    // Pause any playing lightbox video
    const currentVideo = lightboxMediaWrapper ? lightboxMediaWrapper.querySelector('video') : null;
    if (currentVideo) {
      currentVideo.pause();
    }
  }

  clickableItems.forEach(item => {
    item.addEventListener('click', () => {
      const type = item.getAttribute('data-type');
      const src = item.getAttribute('data-src');
      const caption = item.getAttribute('data-caption');
      openLightbox(type, src, caption);
    });
  });

  if (lightboxBackdrop) lightboxBackdrop.addEventListener('click', closeLightbox);
  if (lightboxCloseBtn) lightboxCloseBtn.addEventListener('click', closeLightbox);
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  /* ==========================================================
     5. Slide 4: Navratri Bump (Stacked Photos 1-9, Swipe Only)
     ========================================================== */
  const navCards = Array.from(document.querySelectorAll('.nav-card'));
  const navCounterText = document.getElementById('navCounterText');
  const navProgressFill = document.getElementById('navProgressFill');
  const navStackContainer = document.getElementById('navratriStackContainer');

  let currentNavIndex = 0;
  let navStartX = 0;
  let navCurrentX = 0;
  let isNavDragging = false;

  function updateNavStack(newIndex) {
    currentNavIndex = (newIndex + navCards.length) % navCards.length;

    navCards.forEach((card, idx) => {
      card.style.transform = '';
      card.style.opacity = '';
      card.style.transition = 'transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.45s ease';

      card.classList.remove('active', 'behind-1', 'behind-2', 'hidden');

      const relIdx = (idx - currentNavIndex + navCards.length) % navCards.length;

      if (relIdx === 0) {
        card.classList.add('active');
      } else if (relIdx === 1) {
        card.classList.add('behind-1');
      } else if (relIdx === 2) {
        card.classList.add('behind-2');
      } else {
        card.classList.add('hidden');
      }
    });

    if (navCounterText) {
      navCounterText.textContent = `Look ${currentNavIndex + 1} of ${navCards.length}`;
    }

    if (navProgressFill) {
      const percent = ((currentNavIndex + 1) / navCards.length) * 100;
      navProgressFill.style.width = `${percent}%`;
    }
  }

  function setupNavSwipes() {
    if (!navStackContainer) return;

    navStackContainer.addEventListener('touchstart', (e) => {
      const activeCard = navStackContainer.querySelector('.nav-card.active');
      if (!activeCard) return;
      isNavDragging = true;
      navStartX = e.touches[0].clientX;
      navCurrentX = navStartX;
      activeCard.style.transition = 'none';
    }, { passive: true });

    navStackContainer.addEventListener('touchmove', (e) => {
      if (!isNavDragging) return;
      const activeCard = navStackContainer.querySelector('.nav-card.active');
      if (!activeCard) return;

      navCurrentX = e.touches[0].clientX;
      const diffX = navCurrentX - navStartX;
      const rotate = diffX * 0.06;

      activeCard.style.transform = `translate3d(${diffX}px, 0, 0) rotate(${rotate}deg)`;
    }, { passive: true });

    navStackContainer.addEventListener('touchend', () => {
      if (!isNavDragging) return;
      isNavDragging = false;
      const activeCard = navStackContainer.querySelector('.nav-card.active');
      if (!activeCard) return;

      const diffX = navCurrentX - navStartX;

      if (Math.abs(diffX) > 50) {
        // Swipe away smoothly
        activeCard.style.transition = 'transform 0.35s ease-out, opacity 0.35s ease-out';
        activeCard.style.transform = `translate3d(${diffX > 0 ? '120%' : '-120%'}, 0, 0) rotate(${diffX > 0 ? 12 : -12}deg)`;
        activeCard.style.opacity = '0';

        setTimeout(() => {
          updateNavStack(currentNavIndex + 1);
        }, 280);
      } else {
        // Snap back
        activeCard.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
        activeCard.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
      }
    });

    // Also support mouse drag on desktop
    navStackContainer.addEventListener('mousedown', (e) => {
      const activeCard = navStackContainer.querySelector('.nav-card.active');
      if (!activeCard) return;
      isNavDragging = true;
      navStartX = e.clientX;
      navCurrentX = navStartX;
      activeCard.style.transition = 'none';
    });

    window.addEventListener('mousemove', (e) => {
      if (!isNavDragging) return;
      const activeCard = navStackContainer.querySelector('.nav-card.active');
      if (!activeCard) return;
      navCurrentX = e.clientX;
      const diffX = navCurrentX - navStartX;
      activeCard.style.transform = `translate3d(${diffX}px, 0, 0) rotate(${diffX * 0.06}deg)`;
    });

    window.addEventListener('mouseup', () => {
      if (!isNavDragging) return;
      isNavDragging = false;
      const activeCard = navStackContainer.querySelector('.nav-card.active');
      if (!activeCard) return;

      const diffX = navCurrentX - navStartX;
      if (Math.abs(diffX) > 50) {
        activeCard.style.transition = 'transform 0.35s ease-out, opacity 0.35s ease-out';
        activeCard.style.transform = `translate3d(${diffX > 0 ? '120%' : '-120%'}, 0, 0) rotate(${diffX > 0 ? 12 : -12}deg)`;
        activeCard.style.opacity = '0';
        setTimeout(() => {
          updateNavStack(currentNavIndex + 1);
        }, 280);
      } else {
        activeCard.style.transition = 'transform 0.35s cubic-bezier(0.16, 1, 0.3, 1)';
        activeCard.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
      }
    });

    // Tap on active card flips to next
    navCards.forEach(card => {
      card.addEventListener('click', () => {
        if (card.classList.contains('active') && Math.abs(navCurrentX - navStartX) < 10) {
          updateNavStack(currentNavIndex + 1);
        }
      });
    });
  }
  setupNavSwipes();

  /* ==========================================================
     6. Slide 5: Mara Tame Su Thav Cho (Ramo Re) Video Player
     ========================================================== */
  const macVideo = document.getElementById('macVideo');
  const soundToggleBtn = document.getElementById('soundToggleBtn');
  const soundIcon = document.getElementById('soundIcon');
  const musicProgressBar = document.getElementById('musicProgressBar');

  if (macVideo) {
    // Ensure muted for guaranteed mobile autoplay policy
    macVideo.muted = true;

    macVideo.addEventListener('timeupdate', () => {
      if (macVideo.duration && musicProgressBar) {
        const percent = (macVideo.currentTime / macVideo.duration) * 100;
        musicProgressBar.style.width = `${percent}%`;
      }
    });

    if (soundToggleBtn) {
      soundToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        macVideo.muted = !macVideo.muted;
        soundIcon.setAttribute('data-lucide', macVideo.muted ? 'volume-x' : 'volume-2');
        if (window.lucide) window.lucide.createIcons();
      });
    }
  }

  /* ==========================================================
     7. Slide 6: Interactive Canvas Scratch Card
     ========================================================== */
  const scratchCanvas = document.getElementById('scratchCanvas');
  const scratchPercentText = document.getElementById('scratchPercentText');
  const resetScratchBtn = document.getElementById('resetScratchBtn');
  let scratchCtx = null;
  let isScratching = false;

  function initScratchCard() {
    if (!scratchCanvas) return;
    scratchCtx = scratchCanvas.getContext('2d', { willReadFrequently: true });
    
    const rect = scratchCanvas.parentElement.getBoundingClientRect();
    scratchCanvas.width = rect.width;
    scratchCanvas.height = rect.height;

    // Metallic gold cover
    const grad = scratchCtx.createLinearGradient(0, 0, scratchCanvas.width, scratchCanvas.height);
    grad.addColorStop(0, '#f1c40f');
    grad.addColorStop(0.3, '#d4af37');
    grad.addColorStop(0.7, '#f39c12');
    grad.addColorStop(1, '#ffd700');
    
    scratchCtx.fillStyle = grad;
    scratchCtx.fillRect(0, 0, scratchCanvas.width, scratchCanvas.height);

    // Subtle stripes pattern
    scratchCtx.fillStyle = 'rgba(255, 255, 255, 0.2)';
    for (let i = -scratchCanvas.width; i < scratchCanvas.width * 2; i += 24) {
      scratchCtx.fillRect(i, 0, 8, scratchCanvas.height);
    }

    scratchCtx.fillStyle = '#261b07';
    scratchCtx.font = 'bold 15px sans-serif';
    scratchCtx.textAlign = 'center';
    scratchCtx.textBaseline = 'middle';
    scratchCtx.fillText('✨ SCRATCH HERE ✨', scratchCanvas.width / 2, scratchCanvas.height / 2 - 10);
    
    scratchCtx.font = '12px sans-serif';
    scratchCtx.fillStyle = '#4a3b12';
    scratchCtx.fillText('Rub with your finger', scratchCanvas.width / 2, scratchCanvas.height / 2 + 14);

    if (scratchPercentText) {
      scratchPercentText.textContent = '0% scratched';
    }
  }

  function getScratchCoords(e) {
    const rect = scratchCanvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  }

  function scratch(e) {
    if (!isScratching || !scratchCtx) return;
    const { x, y } = getScratchCoords(e);

    scratchCtx.globalCompositeOperation = 'destination-out';
    scratchCtx.beginPath();
    scratchCtx.arc(x, y, 22, 0, Math.PI * 2);
    scratchCtx.fill();

    checkScratchProgress();
  }

  let progressCheckThrottle = 0;
  function checkScratchProgress() {
    const now = Date.now();
    if (now - progressCheckThrottle < 200) return;
    progressCheckThrottle = now;

    try {
      const imgData = scratchCtx.getImageData(0, 0, scratchCanvas.width, scratchCanvas.height);
      let cleared = 0;
      for (let i = 3; i < imgData.data.length; i += 32) {
        if (imgData.data[i] === 0) cleared++;
      }
      const totalSampled = imgData.data.length / 32;
      const percentage = Math.round((cleared / totalSampled) * 100);
      if (scratchPercentText) {
        scratchPercentText.textContent = `${percentage}% scratched`;
      }

      if (percentage > 50 && scratchCanvas.style.opacity !== '0') {
        scratchCanvas.style.transition = 'opacity 0.6s ease';
        scratchCanvas.style.opacity = '0';
        setTimeout(() => {
          scratchCanvas.style.pointerEvents = 'none';
          triggerPopperConfetti();
        }, 600);
      }
    } catch (err) {}
  }

  if (scratchCanvas) {
    scratchCanvas.addEventListener('mousedown', (e) => { isScratching = true; scratch(e); });
    scratchCanvas.addEventListener('mousemove', scratch);
    window.addEventListener('mouseup', () => { isScratching = false; });

    scratchCanvas.addEventListener('touchstart', (e) => { isScratching = true; scratch(e); }, { passive: true });
    scratchCanvas.addEventListener('touchmove', scratch, { passive: true });
    window.addEventListener('touchend', () => { isScratching = false; });

    if (resetScratchBtn) {
      resetScratchBtn.addEventListener('click', () => {
        scratchCanvas.style.transition = 'none';
        scratchCanvas.style.opacity = '1';
        scratchCanvas.style.pointerEvents = 'auto';
        initScratchCard();
      });
    }

    setTimeout(initScratchCard, 350);
  }

  /* ==========================================================
     8. Automated Slide Arrival Actions (Intersection Observer)
     ========================================================== */
  const observerOptions = {
    root: appContainer,
    threshold: 0.55
  };

  const slideObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const slideId = entry.target.id;
        
        // When arriving at Favorite Song slide -> Autoplay muted video
        if (slideId === 'slide-5' && macVideo) {
          macVideo.play().catch(() => {});
        } else if (macVideo && !macVideo.paused) {
          macVideo.pause();
        }

        // When arriving at Finale slide -> Celebration confetti
        if (slideId === 'slide-7') {
          triggerPopperConfetti();
        }
      }
    });
  }, observerOptions);

  document.querySelectorAll('.slide').forEach(slide => {
    slideObserver.observe(slide);
  });

  /* ==========================================================
     9. Slide 7: Finale Celebration Buttons
     ========================================================== */
  const finaleConfettiBtn = document.getElementById('finaleConfettiBtn');
  const restartSlideBtn = document.getElementById('restartSlideBtn');

  if (finaleConfettiBtn) {
    finaleConfettiBtn.addEventListener('click', () => {
      triggerPopperConfetti();
      setTimeout(triggerPopperConfetti, 350);
      setTimeout(triggerPopperConfetti, 700);
    });
  }

  if (restartSlideBtn) {
    restartSlideBtn.addEventListener('click', () => {
      const slide1 = document.getElementById('slide-1');
      if (slide1) {
        slide1.scrollIntoView({ behavior: 'smooth' });
      }
    });
  }

});
