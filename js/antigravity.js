/* ============================================
   AGS ANTIGRAVITY INTRO
   Interactive physics-based logo experience
   ============================================ */

(function () {
  'use strict';

  // ---- State ----
  const state = {
    particles: [],
    mouseX: 0,
    mouseY: 0,
    dragging: null,
    dragOffsetX: 0,
    dragOffsetY: 0,
    antigravity: false,
    floatingBodies: [],
    animFrame: null,
    entered: false,
  };

  // ---- Elements ----
  const overlay = document.getElementById('agOverlay');
  const canvas = document.getElementById('agCanvas');
  const ctx = canvas ? canvas.getContext('2d') : null;
  const letters = document.querySelectorAll('.ag-letter');
  const tagline = document.getElementById('agTagline');
  const typed = document.getElementById('agTyped');
  const subtitle = document.getElementById('agSubtitle');
  const ctaGroup = document.getElementById('agCtaGroup');
  const enterBtn = document.getElementById('agEnterBtn');
  const hint = document.getElementById('agHint');
  const floatIcons = document.querySelectorAll('.ag-float-icon');
  const badges = document.querySelectorAll('.ag-badge-item');

  if (!overlay || !canvas || !ctx) return;

  // ---- Canvas Setup ----
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  // ---- Particle System (star field) ----
  function createParticles(count) {
    state.particles = [];
    for (let i = 0; i < count; i++) {
      state.particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        r: Math.random() * 1.8 + 0.3,
        alpha: Math.random() * 0.5 + 0.1,
        pulse: Math.random() * Math.PI * 2,
      });
    }
  }

  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw subtle connecting lines between close particles
    for (let i = 0; i < state.particles.length; i++) {
      for (let j = i + 1; j < state.particles.length; j++) {
        const dx = state.particles[i].x - state.particles[j].x;
        const dy = state.particles[i].y - state.particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120) {
          const alpha = (1 - dist / 120) * 0.06;
          ctx.beginPath();
          ctx.moveTo(state.particles[i].x, state.particles[i].y);
          ctx.lineTo(state.particles[j].x, state.particles[j].y);
          ctx.strokeStyle = `rgba(66, 153, 225, ${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }

    // Draw particles
    state.particles.forEach(p => {
      p.pulse += 0.015;
      const pulseAlpha = p.alpha + Math.sin(p.pulse) * 0.15;

      // Mouse repulsion
      const dx = p.x - state.mouseX;
      const dy = p.y - state.mouseY;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 150 && dist > 0) {
        const force = (150 - dist) / 150 * 0.5;
        p.vx += (dx / dist) * force;
        p.vy += (dy / dist) * force;
      }

      // Apply velocity with damping
      p.vx *= 0.98;
      p.vy *= 0.98;
      p.x += p.vx;
      p.y += p.vy;

      // Wrap around edges
      if (p.x < -10) p.x = canvas.width + 10;
      if (p.x > canvas.width + 10) p.x = -10;
      if (p.y < -10) p.y = canvas.height + 10;
      if (p.y > canvas.height + 10) p.y = -10;

      // Draw dot
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(150, 200, 255, ${Math.max(0, pulseAlpha)})`;
      ctx.fill();
    });
  }

  function animateParticles() {
    drawParticles();
    state.animFrame = requestAnimationFrame(animateParticles);
  }

  // ---- Typing Effect ----
  function typeText(text, element, speed, callback) {
    let i = 0;
    element.textContent = '';
    function typeChar() {
      if (i < text.length) {
        element.textContent += text.charAt(i);
        i++;
        setTimeout(typeChar, speed);
      } else if (callback) {
        callback();
      }
    }
    typeChar();
  }

  // ---- Entrance Animation Sequence ----
  function playEntrance() {
    // Step 1: Letters slam in with stagger
    letters.forEach((letter, i) => {
      setTimeout(() => {
        letter.classList.add('entered');
      }, 300 + i * 200);
    });

    // Step 2: Start typing after letters land
    setTimeout(() => {
      tagline.classList.add('visible');
      typeText('AMERICAN GLOBAL SECURITY', typed, 55, () => {
        // Step 3: Show subtitle
        subtitle.classList.add('visible');

        // Step 4: Show badges
        setTimeout(() => {
          ctaGroup.classList.add('visible');
        }, 200);

        // Step 5: Show enter button
        setTimeout(() => {
          enterBtn.classList.add('visible');
        }, 400);

        // Step 6: Enable antigravity mode after a pause
        setTimeout(() => {
          enableAntigravity();
        }, 1200);
      });
    }, 1200);
  }

  // ---- Antigravity Physics (lightweight custom implementation) ----
  function enableAntigravity() {
    state.antigravity = true;
    overlay.classList.add('antigravity');

    // Flash effect
    const flash = document.createElement('div');
    flash.className = 'ag-flash';
    overlay.appendChild(flash);
    setTimeout(() => flash.remove(), 1600);

    // Initialize floating bodies for letters
    letters.forEach(letter => {
      letter.classList.add('floating');
      const rect = letter.getBoundingClientRect();
      const body = {
        el: letter,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        w: rect.width,
        h: rect.height,
        vx: (Math.random() - 0.5) * 1.5,
        vy: (Math.random() - 0.5) * 1.5,
        rotation: 0,
        vr: (Math.random() - 0.5) * 0.3,
        mass: 3,
        pinned: false,
      };
      state.floatingBodies.push(body);
    });

    // Initialize floating bodies for float icons
    floatIcons.forEach(icon => {
      const rect = icon.getBoundingClientRect();
      const body = {
        el: icon,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        w: rect.width,
        h: rect.height,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        rotation: 0,
        vr: (Math.random() - 0.5) * 0.8,
        mass: 1,
        pinned: false,
      };
      icon.style.animation = 'none';
      state.floatingBodies.push(body);
    });

    // Initialize floating bodies for badges
    badges.forEach(badge => {
      const rect = badge.getBoundingClientRect();
      const body = {
        el: badge,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        w: rect.width,
        h: rect.height,
        vx: (Math.random() - 0.5) * 1,
        vy: (Math.random() - 0.5) * 1,
        rotation: 0,
        vr: (Math.random() - 0.5) * 0.2,
        mass: 1.5,
        pinned: false,
      };
      state.floatingBodies.push(body);
    });

    // Start physics loop
    requestAnimationFrame(physicsLoop);
  }

  function physicsLoop() {
    if (!state.antigravity || state.entered) return;

    const w = window.innerWidth;
    const h = window.innerHeight;
    const bounce = 0.6;
    const damping = 0.997;

    state.floatingBodies.forEach(body => {
      if (body.pinned) return;

      // Apply micro-antigravity drift (slight upward tendency)
      body.vy -= 0.01;

      // Very slight attraction toward mouse for interactivity
      const dx = state.mouseX - body.x;
      const dy = state.mouseY - body.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < 300 && dist > 50) {
        const force = 0.02 / (dist * 0.01);
        body.vx += (dx / dist) * force * 0.05;
        body.vy += (dy / dist) * force * 0.05;
      }

      // Apply velocity
      body.vx *= damping;
      body.vy *= damping;
      body.vr *= 0.995;
      body.x += body.vx;
      body.y += body.vy;
      body.rotation += body.vr;

      // Boundary collisions
      const halfW = body.w / 2;
      const halfH = body.h / 2;

      if (body.x - halfW < 0) {
        body.x = halfW;
        body.vx *= -bounce;
      }
      if (body.x + halfW > w) {
        body.x = w - halfW;
        body.vx *= -bounce;
      }
      if (body.y - halfH < 0) {
        body.y = halfH;
        body.vy *= -bounce;
      }
      if (body.y + halfH > h) {
        body.y = h - halfH;
        body.vy *= -bounce;
      }

      // Apply transform
      body.el.style.position = 'fixed';
      body.el.style.left = (body.x - halfW) + 'px';
      body.el.style.top = (body.y - halfH) + 'px';
      body.el.style.transform = `rotate(${body.rotation}deg)`;
      body.el.style.margin = '0';
    });

    // Simple body-to-body collision
    for (let i = 0; i < state.floatingBodies.length; i++) {
      for (let j = i + 1; j < state.floatingBodies.length; j++) {
        const a = state.floatingBodies[i];
        const b = state.floatingBodies[j];
        if (a.pinned && b.pinned) continue;

        const dx = b.x - a.x;
        const dy = b.y - a.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const minDist = (Math.min(a.w, a.h) + Math.min(b.w, b.h)) / 2.5;

        if (dist < minDist && dist > 0) {
          const nx = dx / dist;
          const ny = dy / dist;
          const relVx = a.vx - b.vx;
          const relVy = a.vy - b.vy;
          const velAlongNormal = relVx * nx + relVy * ny;

          if (velAlongNormal > 0) {
            const totalMass = a.mass + b.mass;
            const impulse = (2 * velAlongNormal) / totalMass * 0.5;

            if (!a.pinned) {
              a.vx -= impulse * b.mass * nx;
              a.vy -= impulse * b.mass * ny;
            }
            if (!b.pinned) {
              b.vx += impulse * a.mass * nx;
              b.vy += impulse * a.mass * ny;
            }
          }

          // Separate overlapping bodies
          const overlap = minDist - dist;
          const sepX = (overlap / 2) * nx;
          const sepY = (overlap / 2) * ny;
          if (!a.pinned) { a.x -= sepX; a.y -= sepY; }
          if (!b.pinned) { b.x += sepX; b.y += sepY; }
        }
      }
    }

    requestAnimationFrame(physicsLoop);
  }

  // ---- Drag Interaction ----
  function getPointerPos(e) {
    if (e.touches && e.touches.length > 0) {
      return { x: e.touches[0].clientX, y: e.touches[0].clientY };
    }
    return { x: e.clientX, y: e.clientY };
  }

  function findBody(el) {
    return state.floatingBodies.find(b => b.el === el || b.el.contains(el));
  }

  function onPointerDown(e) {
    const pos = getPointerPos(e);
    state.mouseX = pos.x;
    state.mouseY = pos.y;

    // Find if we're clicking on a draggable element
    const target = e.target.closest('.ag-letter, .ag-float-icon, .ag-badge-item');
    if (!target) return;

    const body = findBody(target);
    if (body) {
      e.preventDefault();
      state.dragging = body;
      body.pinned = true;
      state.dragOffsetX = pos.x - body.x;
      state.dragOffsetY = pos.y - body.y;
      target.classList.add('dragging');
    }
  }

  function onPointerMove(e) {
    const pos = getPointerPos(e);
    state.mouseX = pos.x;
    state.mouseY = pos.y;

    if (state.dragging) {
      e.preventDefault();
      const body = state.dragging;
      const newX = pos.x - state.dragOffsetX;
      const newY = pos.y - state.dragOffsetY;

      // Track velocity from drag movement
      body.vx = (newX - body.x) * 0.3;
      body.vy = (newY - body.y) * 0.3;

      body.x = newX;
      body.y = newY;

      const halfW = body.w / 2;
      const halfH = body.h / 2;
      body.el.style.position = 'fixed';
      body.el.style.left = (body.x - halfW) + 'px';
      body.el.style.top = (body.y - halfH) + 'px';
    }
  }

  function onPointerUp() {
    if (state.dragging) {
      state.dragging.pinned = false;
      // Give a spin on release
      state.dragging.vr += (Math.random() - 0.5) * 2;
      state.dragging.el.classList.remove('dragging');
      state.dragging = null;
    }
  }

  // ---- Enter Site ----
  function enterSite() {
    if (state.entered) return;
    state.entered = true;

    // Stop physics
    state.antigravity = false;
    cancelAnimationFrame(state.animFrame);

    // Animate out
    overlay.classList.add('exiting');

    setTimeout(() => {
      overlay.classList.add('hidden');
      document.body.classList.remove('intro-active');

      // Reveal main content with smooth transition
      const mainSections = document.querySelectorAll(
        '.announcement-bar, .header, .hero, .stats, .services, .why-us, .industries, .coverage, .testimonials, .cta-banner, .contact, .footer, .floating-cta'
      );
      mainSections.forEach(el => {
        el.style.transition = 'opacity 0.6s ease';
        el.style.opacity = '1';
        el.style.pointerEvents = '';
      });
    }, 800);
  }

  // ---- Initialize ----
  function init() {
    // Calculate particle count based on screen
    const particleCount = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 15000));
    createParticles(particleCount);
    animateParticles();

    // Event listeners
    overlay.addEventListener('mousedown', onPointerDown);
    overlay.addEventListener('mousemove', onPointerMove);
    overlay.addEventListener('mouseup', onPointerUp);
    overlay.addEventListener('touchstart', onPointerDown, { passive: false });
    overlay.addEventListener('touchmove', onPointerMove, { passive: false });
    overlay.addEventListener('touchend', onPointerUp);

    // Enter button
    enterBtn.addEventListener('click', enterSite);

    // Also allow keyboard enter
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !state.entered) {
        enterSite();
      }
    });

    // Start entrance animation
    setTimeout(playEntrance, 400);
  }

  // Wait for fonts to load then init
  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(init);
  } else {
    window.addEventListener('load', init);
  }

})();
