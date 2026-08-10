class OptionWheel {
  constructor(container, options = {}) {
    this.container = typeof container === 'string' ? document.querySelector(container) : container;
    
    const defaultOptions = {
      items: [
        'Ambient', 'House', 'Techno', 'Jazz', 'Lo-Fi', 
        'Synthwave', 'Trance', 'Funk', 'Disco', 'Hip-Hop', 
        'Chillwave', 'Drum & Bass'
      ],
      defaultSelected: 3,
      onChange: null,
      textColor: '#a6a6a6',
      activeColor: '#ffffff',
      side: 'left',
      fontSize: 3,
      spacing: 1.4,
      curve: 1,
      tilt: 6,
      blur: 2,
      fade: 0.25,
      minOpacity: 0.05,
      smoothing: 200,
      inset: 80,
      loop: false,
      draggable: true,
      soundUrl: '',
      soundVolume: 0.5,
    };
    
    this.cfg = { ...defaultOptions, ...options };
    this.cfg.count = this.cfg.items.length;
    
    this.itemRefs = [];
    this.pos = this.cfg.defaultSelected;
    this.target = this.cfg.defaultSelected;
    this.raf = null;
    this.lastTime = 0;
    this.selectedIndex = this.cfg.defaultSelected;
    
    this.drag = null;
    this.dragMoved = false;
    
    this.wheelTimer = null;
    this.lastTick = 0;
    this.audio = null;
    this.audioUrl = '';
    
    this.isDragging = false;
    
    this.remPx = parseFloat(getComputedStyle(document.documentElement).fontSize) || 16;
    this.cfg.rowH = Math.max(this.cfg.fontSize * this.cfg.spacing * this.remPx, 1);
    
    this.initDOM();
    this.bindEvents();
    
    this.applyTarget(this.target, false, true); 
  }
  
  initDOM() {
    this.container.classList.add('option-wheel');
    if (this.cfg.side === 'right') {
      this.container.classList.add('option-wheel--right');
    }
    
    this.container.style.setProperty('--ow-text-color', this.cfg.textColor);
    this.container.style.setProperty('--ow-active-color', this.cfg.activeColor);
    this.container.style.setProperty('--ow-font-size', `${this.cfg.fontSize}rem`);
    this.container.style.setProperty('--ow-inset', `${this.cfg.inset}px`);
    
    this.container.innerHTML = '';
    
    this.cfg.items.forEach((label, i) => {
      const el = document.createElement('div');
      el.className = 'option-wheel__item';
      if (this.selectedIndex === i) {
        el.classList.add('option-wheel__item--selected');
      }
      el.textContent = label;
      el.setAttribute('role', 'option');
      el.setAttribute('aria-selected', this.selectedIndex === i);
      
      el.addEventListener('click', () => this.handleItemClick(i));
      
      this.itemRefs.push(el);
      this.container.appendChild(el);
    });
    
    this.container.setAttribute('role', 'listbox');
    this.container.setAttribute('tabindex', '0');
  }
  
  runFrame(now) {
    const dt = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;
    const tau = Math.max(this.cfg.smoothing, 1) / 1000;
    const k = 1 - Math.exp(-dt / tau);
    
    const target = this.target;
    let next = this.pos + (target - this.pos) * k;
    const settled = Math.abs(target - next) < 0.001;
    if (settled) next = target;
    this.pos = next;
    
    const n = this.cfg.count;
    const mirror = this.cfg.side === 'right' ? -1 : 1;
    const tiltRad = (this.cfg.tilt * Math.PI) / 180;
    const R = tiltRad > 0.0005 ? this.cfg.rowH / tiltRad : 0;
    
    for (let i = 0; i < n; i++) {
      const el = this.itemRefs[i];
      if (!el) continue;
      
      let d = i - next;
      if (this.cfg.loop && n > 1) {
        d = ((d % n) + n) % n;
        if (d > n / 2) d -= n;
      }
      
      const dist = Math.abs(d);
      let x = 0;
      let y = d * this.cfg.rowH;
      let rot = 0;
      
      if (R > 0) {
        const ang = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, d * tiltRad));
        y = R * Math.sin(ang);
        x = -mirror * R * (1 - Math.cos(ang)) * this.cfg.curve;
        rot = (mirror * ang * 180) / Math.PI;
      }
      
      el.style.transform = `translate(${x.toFixed(2)}px, calc(${y.toFixed(2)}px - 50%)) rotate(${rot.toFixed(3)}deg)`;
      el.style.opacity = String(Math.max(this.cfg.minOpacity, 1 - dist * this.cfg.fade));
      el.style.filter = this.cfg.blur > 0 ? `blur(${(dist * this.cfg.blur).toFixed(2)}px)` : 'none';
      el.style.setProperty('--ow-p', Math.max(0, 1 - Math.min(dist, 1)).toFixed(4));
    }
    
    if (settled) {
      this.raf = null;
    } else {
      this.raf = requestAnimationFrame(this.runFrame.bind(this));
    }
  }
  
  startLoop() {
    if (this.raf != null) return;
    this.lastTime = performance.now();
    this.raf = requestAnimationFrame(this.runFrame.bind(this));
  }
  
  playTick() {
    if (!this.cfg.soundUrl) return;
    const now = performance.now();
    if (now - this.lastTick < 70) return;
    this.lastTick = now;
    
    if (!this.audio || this.audioUrl !== this.cfg.soundUrl) {
      this.audio = new Audio(this.cfg.soundUrl);
      this.audio.preload = 'auto';
      this.audioUrl = this.cfg.soundUrl;
    }
    
    this.audio.volume = Math.min(Math.max(this.cfg.soundVolume, 0), 1);
    this.audio.currentTime = 0;
    this.audio.play()?.catch(() => {});
  }
  
  applyTarget(value, snap, init = false) {
    let v = value;
    if (!this.cfg.loop) {
      v = Math.min(Math.max(v, 0), Math.max(this.cfg.count - 1, 0));
    }
    if (snap) v = Math.round(v);
    
    this.target = v;
    const idx = ((Math.round(v) % this.cfg.count) + this.cfg.count) % this.cfg.count;
    
    if (idx !== this.selectedIndex) {
      this.itemRefs[this.selectedIndex]?.classList.remove('option-wheel__item--selected');
      this.itemRefs[this.selectedIndex]?.setAttribute('aria-selected', false);
      
      this.selectedIndex = idx;
      
      this.itemRefs[this.selectedIndex]?.classList.add('option-wheel__item--selected');
      this.itemRefs[this.selectedIndex]?.setAttribute('aria-selected', true);
      
      if (!init && this.cfg.onChange) {
        this.cfg.onChange(idx, this.cfg.items[idx]);
      }
      
      if (!init) {
        this.playTick();
      }
    }
    
    this.startLoop();
  }
  
  handleItemClick(index) {
    if (this.dragMoved) return;
    const cur = this.target;
    let d = index - (((Math.round(cur) % this.cfg.count) + this.cfg.count) % this.cfg.count);
    if (this.cfg.loop && this.cfg.count > 1) {
      if (d > this.cfg.count / 2) d -= this.cfg.count;
      else if (d < -this.cfg.count / 2) d += this.cfg.count;
    }
    this.applyTarget(cur + d, true);
  }
  
  bindEvents() {
    const isPhone = window.matchMedia('(max-width: 768px)').matches;

    if (!isPhone) {
      this.container.addEventListener('wheel', (e) => {
        e.preventDefault();
        const delta = e.deltaMode === 1 ? e.deltaY * 24 : e.deltaY;
        const step = Math.max(-1, Math.min(1, delta / this.cfg.rowH));
        this.applyTarget(this.target + step, false);

        if (this.wheelTimer) clearTimeout(this.wheelTimer);
        this.wheelTimer = setTimeout(() => this.applyTarget(this.target, true), 140);
      }, { passive: false });
    }

    const setupDrag = () => {
      this.container.addEventListener('pointerdown', (e) => {
        if (!this.cfg.draggable) return;
        this.drag = { y: e.clientY, start: this.target, id: e.pointerId };
        this.dragMoved = false;
        this.isDragging = true;
        this.container.classList.add('option-wheel--dragging');
      });

      this.container.addEventListener('pointermove', (e) => {
        if (!this.drag) return;
        const dy = e.clientY - this.drag.y;
        if (!this.dragMoved && Math.abs(dy) > 4) {
          this.dragMoved = true;
          this.container.setPointerCapture(this.drag.id);
        }
        if (this.dragMoved) {
          this.applyTarget(this.drag.start - dy / this.cfg.rowH, false);
        }
      });

      const endDrag = () => {
        if (!this.drag) return;
        this.drag = null;
        this.isDragging = false;
        this.container.classList.remove('option-wheel--dragging');
        if (this.dragMoved) this.applyTarget(this.target, true);
      };

      this.container.addEventListener('pointerup', endDrag);
      this.container.addEventListener('pointercancel', endDrag);
    };

    setupDrag();

    if (isPhone) {
      this.applyTarget(this.cfg.defaultSelected, true);
    }
    
    this.container.addEventListener('keydown', (e) => {
      let delta = null;
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') delta = -1;
      else if (e.key === 'ArrowDown' || e.key === 'ArrowRight') delta = 1;
      if (delta == null) return;
      e.preventDefault();
      this.applyTarget(Math.round(this.target) + delta, true);
    });
  }

    destroy() {
        if (this.raf != null) cancelAnimationFrame(this.raf);
        this.raf = null;
        this.container.innerHTML = '';
        this.itemRefs = [];
        this.container.classList.remove('option-wheel', 'option-wheel--right', 'option-wheel--dragging');
    }
}

window.OptionWheel = OptionWheel;
