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
     3. Slide 2: Stackable 3-Page Letter (Swipe Gestures & Reading)
     ========================================================== */
  const letterCards = Array.from(document.querySelectorAll('.letter-card'));
  const letterDots = Array.from(document.querySelectorAll('.letter-pagination .dot'));
  let currentLetterPage = 0;
  let letterStartX = 0;
  let letterStartY = 0;
  let letterCurrentX = 0;
  let isLetterDragging = false;
  let letterGestureDirection = null; // 'horizontal' | 'vertical' | null

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
        // Reset scroll position to top when card becomes active so each page starts at top
        const scrollArea = card.querySelector('.letter-scroll-area');
        if (scrollArea) scrollArea.scrollTop = 0;
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

      letterStartX = e.touches[0].clientX;
      letterStartY = e.touches[0].clientY;
      letterCurrentX = letterStartX;
      isLetterDragging = false;
      letterGestureDirection = null;
    }, { passive: true });

    stackWrapper.addEventListener('touchmove', (e) => {
      const activeCard = stackWrapper.querySelector('.letter-card.active-card');
      if (!activeCard) return;

      const currentX = e.touches[0].clientX;
      const currentY = e.touches[0].clientY;
      const diffX = currentX - letterStartX;
      const diffY = currentY - letterStartY;

      // Determine intent after small threshold
      if (!letterGestureDirection) {
        if (Math.abs(diffX) > 10 || Math.abs(diffY) > 10) {
          if (Math.abs(diffX) > Math.abs(diffY)) {
            // Horizontal swipe: user wants to flip card
            letterGestureDirection = 'horizontal';
            isLetterDragging = true;
            activeCard.style.transition = 'none';
          } else {
            // Vertical scroll: user is scrolling inside the letter content
            letterGestureDirection = 'vertical';
            isLetterDragging = false;
          }
        }
      }

      // Only drag horizontally if this was a horizontal swipe gesture
      if (letterGestureDirection === 'horizontal' && isLetterDragging) {
        letterCurrentX = currentX;
        const rotate = diffX * 0.08;
        activeCard.style.transform = `translate3d(${diffX}px, 0, 0) rotate(${rotate}deg)`;
      }
    }, { passive: true });

    stackWrapper.addEventListener('touchend', () => {
      const activeCard = stackWrapper.querySelector('.letter-card.active-card');
      if (!activeCard) return;

      if (letterGestureDirection === 'horizontal' && isLetterDragging) {
        isLetterDragging = false;
        const diffX = letterCurrentX - letterStartX;

        if (Math.abs(diffX) > 55) {
          // Fly card out smoothly
          activeCard.style.transition = 'transform 0.35s ease-out, opacity 0.35s ease-out';
          activeCard.style.transform = `translate3d(${diffX > 0 ? 120 : -120}%, 0, 0) rotate(${diffX > 0 ? 15 : -15}deg)`;
          activeCard.style.opacity = '0';

          setTimeout(() => {
            updateLetterStack(currentLetterPage + 1);
          }, 280);
        } else {
          // Snap back
          activeCard.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
          activeCard.style.transform = 'translate3d(0, 0, 0) scale(1) rotate(0deg)';
        }
      }

      isLetterDragging = false;
      letterGestureDirection = null;
    });

    // Pagination Dots click
    letterDots.forEach((dot, idx) => {
      dot.addEventListener('click', () => {
        updateLetterStack(idx);
      });
    });

    // Explicit Next Page buttons inside each card footer
    const letterNextBtns = stackWrapper.querySelectorAll('.letter-next-btn');
    letterNextBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        updateLetterStack(currentLetterPage + 1);
      });
    });

    // Optional tap on the top metadata header or hint to flip card
    const topMetas = stackWrapper.querySelectorAll('.letter-top-meta, .swipe-hint-pill');
    topMetas.forEach((meta) => {
      meta.addEventListener('click', (e) => {
        e.stopPropagation();
        updateLetterStack(currentLetterPage + 1);
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
     7. Slide 6: Interactive Canvas Scratch Card & Mystery Teaser
     ========================================================== */
  const mysteryTeaser = document.getElementById('mysteryTeaser');
  const unlockVoucherBtn = document.getElementById('unlockVoucherBtn');
  const scratchCardBox = document.getElementById('scratchCardBox');
  const scratchCanvas = document.getElementById('scratchCanvas');
  const scratchStatus = document.getElementById('scratchStatus');
  const scratchPercentText = document.getElementById('scratchPercentText');
  const resetScratchBtn = document.getElementById('resetScratchBtn');

  let scratchCtx = null;
  let isScratching = false;
  let lastScratchX = null;
  let lastScratchY = null;
  let isCardRevealed = false;

  function roundRect(ctx, x, y, w, h, r) {
    if (w < 2 * r) r = w / 2;
    if (h < 2 * r) r = h / 2;
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  function initScratchCard() {
    if (!scratchCanvas || !scratchCardBox) return;
    scratchCtx = scratchCanvas.getContext('2d', { willReadFrequently: true });

    const rect = scratchCardBox.getBoundingClientRect();
    const width = Math.round(rect.width) || 360;
    const height = Math.round(rect.height) || 400;

    scratchCanvas.width = width;
    scratchCanvas.height = height;

    // Reset styles
    scratchCanvas.style.transition = 'none';
    scratchCanvas.style.opacity = '1';
    scratchCanvas.style.pointerEvents = 'auto';
    scratchCtx.globalCompositeOperation = 'source-over';

    // 1. Luxury Holographic Midnight-Rose-Gold Gradient
    const grad = scratchCtx.createLinearGradient(0, 0, width, height);
    grad.addColorStop(0, '#1c0f38');      // Royal obsidian violet
    grad.addColorStop(0.25, '#48196b');   // Deep amethyst
    grad.addColorStop(0.5, '#ff2a85');    // Neon electric pink
    grad.addColorStop(0.75, '#ffd166');   // Liquid gold
    grad.addColorStop(0.9, '#ff6b8b');    // Rose coral
    grad.addColorStop(1, '#24103f');      // Deep obsidian

    scratchCtx.fillStyle = grad;
    scratchCtx.fillRect(0, 0, width, height);

    // 2. Holographic Diagonal Shimmer Lines
    scratchCtx.save();
    scratchCtx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    scratchCtx.lineWidth = 1.5;
    for (let x = -height; x < width + height; x += 18) {
      scratchCtx.beginPath();
      scratchCtx.moveTo(x, 0);
      scratchCtx.lineTo(x + height, height);
      scratchCtx.stroke();
    }
    scratchCtx.restore();

    // 3. Stardust & Diamond Sparkles
    const sparkles = [
      { x: width * 0.15, y: height * 0.18, r: 2.5, a: 0.85 },
      { x: width * 0.85, y: height * 0.22, r: 3, a: 0.9 },
      { x: width * 0.12, y: height * 0.78, r: 2, a: 0.75 },
      { x: width * 0.88, y: height * 0.72, r: 2.5, a: 0.85 },
      { x: width * 0.28, y: height * 0.45, r: 1.8, a: 0.6 },
      { x: width * 0.72, y: height * 0.52, r: 2.2, a: 0.75 },
      { x: width * 0.5, y: height * 0.14, r: 3.5, a: 0.95 },
      { x: width * 0.5, y: height * 0.86, r: 2.8, a: 0.9 },
    ];
    sparkles.forEach(s => {
      scratchCtx.save();
      scratchCtx.fillStyle = `rgba(255, 255, 255, ${s.a})`;
      scratchCtx.beginPath();
      scratchCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      scratchCtx.fill();
      scratchCtx.strokeStyle = `rgba(255, 255, 255, ${s.a * 0.7})`;
      scratchCtx.lineWidth = 1;
      scratchCtx.beginPath();
      scratchCtx.moveTo(s.x - s.r * 2.5, s.y);
      scratchCtx.lineTo(s.x + s.r * 2.5, s.y);
      scratchCtx.moveTo(s.x, s.y - s.r * 2.5);
      scratchCtx.lineTo(s.x, s.y + s.r * 2.5);
      scratchCtx.stroke();
      scratchCtx.restore();
    });

    // 4. Elegant Double Inner Border
    scratchCtx.save();
    scratchCtx.strokeStyle = 'rgba(255, 215, 0, 0.45)';
    scratchCtx.lineWidth = 1.5;
    roundRect(scratchCtx, 12, 12, width - 24, height - 24, 16);
    scratchCtx.stroke();

    scratchCtx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    scratchCtx.lineWidth = 1;
    roundRect(scratchCtx, 16, 16, width - 32, height - 32, 14);
    scratchCtx.stroke();
    scratchCtx.restore();

    // 5. Center Badge: VIP TICKET
    scratchCtx.save();
    scratchCtx.fillStyle = 'rgba(0, 0, 0, 0.45)';
    const badgeW = 170;
    const badgeH = 28;
    roundRect(scratchCtx, (width - badgeW) / 2, height / 2 - 58, badgeW, badgeH, 14);
    scratchCtx.fill();
    scratchCtx.strokeStyle = 'rgba(255, 215, 0, 0.6)';
    scratchCtx.lineWidth = 1;
    scratchCtx.stroke();

    scratchCtx.fillStyle = '#ffd166';
    scratchCtx.font = 'bold 11px system-ui, -apple-system, sans-serif';
    scratchCtx.textAlign = 'center';
    scratchCtx.textBaseline = 'middle';
    scratchCtx.fillText('★ VIP MYSTERY TICKET ★', width / 2, height / 2 - 44);

    // 6. Main Action Text
    scratchCtx.fillStyle = '#ffffff';
    scratchCtx.font = '800 20px system-ui, -apple-system, sans-serif';
    scratchCtx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    scratchCtx.shadowBlur = 8;
    scratchCtx.fillText('✨ RUB TO REVEAL ✨', width / 2, height / 2 - 6);

    // 7. Subtitle Instruction
    scratchCtx.shadowBlur = 0;
    scratchCtx.fillStyle = '#ffb3d1';
    scratchCtx.font = '600 12px system-ui, -apple-system, sans-serif';
    scratchCtx.fillText('Scratch with your finger to unlock', width / 2, height / 2 + 22);

    // 8. Bottom Security Stamp
    scratchCtx.fillStyle = 'rgba(255, 255, 255, 0.55)';
    scratchCtx.font = '10px system-ui, -apple-system, sans-serif';
    scratchCtx.fillText('CONFIDENTIAL • FOR DIYA ONLY 🔒', width / 2, height - 28);
    scratchCtx.restore();

    if (scratchPercentText) {
      scratchPercentText.textContent = '0% scratched';
    }
  }

  function unveilScratchCard() {
    if (isCardRevealed) return;
    isCardRevealed = true;

    if (mysteryTeaser) {
      mysteryTeaser.classList.add('teaser-hidden');
    }

    if (scratchCardBox) {
      scratchCardBox.classList.remove('hidden-card');
    }

    if (scratchStatus) scratchStatus.classList.remove('hidden');
    if (resetScratchBtn) resetScratchBtn.classList.remove('hidden');

    if (window.lucide) window.lucide.createIcons();

    // Initialize canvas now that scratchCardBox is visible and has layout
    requestAnimationFrame(() => {
      initScratchCard();
      triggerPopperConfetti();
    });
  }

  if (unlockVoucherBtn) {
    unlockVoucherBtn.addEventListener('click', unveilScratchCard);
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
    scratchCtx.lineCap = 'round';
    scratchCtx.lineJoin = 'round';
    scratchCtx.lineWidth = 44;

    scratchCtx.beginPath();
    if (lastScratchX !== null && lastScratchY !== null) {
      scratchCtx.moveTo(lastScratchX, lastScratchY);
      scratchCtx.lineTo(x, y);
      scratchCtx.stroke();
    } else {
      scratchCtx.arc(x, y, 22, 0, Math.PI * 2);
      scratchCtx.fill();
    }
    lastScratchX = x;
    lastScratchY = y;

    checkScratchProgress();
  }

  let progressCheckThrottle = 0;
  function checkScratchProgress() {
    const now = Date.now();
    if (now - progressCheckThrottle < 180) return;
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

      if (percentage > 45 && scratchCanvas.style.opacity !== '0') {
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
    scratchCanvas.addEventListener('mousedown', (e) => {
      isScratching = true;
      lastScratchX = null;
      lastScratchY = null;
      scratch(e);
    });
    scratchCanvas.addEventListener('mousemove', scratch);
    window.addEventListener('mouseup', () => {
      isScratching = false;
      lastScratchX = null;
      lastScratchY = null;
    });

    scratchCanvas.addEventListener('touchstart', (e) => {
      isScratching = true;
      lastScratchX = null;
      lastScratchY = null;
      scratch(e);
    }, { passive: false });

    scratchCanvas.addEventListener('touchmove', (e) => {
      if (isScratching) {
        e.preventDefault();
        scratch(e);
      }
    }, { passive: false });

    window.addEventListener('touchend', () => {
      isScratching = false;
      lastScratchX = null;
      lastScratchY = null;
    });

    if (resetScratchBtn) {
      resetScratchBtn.addEventListener('click', () => {
        initScratchCard();
      });
    }
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
