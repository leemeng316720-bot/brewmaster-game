// ===== 动画效果模块 =====
// 每步酿造的Canvas动画

const Animations = {
  canvas: null,
  ctx: null,
  animating: false,
  particles: [],
  
  init(containerId) {
    const container = document.getElementById(containerId);
    if (!container) return false;
    
    // 创建或获取canvas
    this.canvas = container.querySelector('.brew-animation-canvas');
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.className = 'brew-animation-canvas';
      this.canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:5;';
      container.style.position = 'relative';
      container.appendChild(this.canvas);
    }
    
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    this.ctx = this.canvas.getContext('2d');
    return true;
  },
  
  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.parentElement.getBoundingClientRect();
    this.canvas.width = rect.width;
    this.canvas.height = rect.height;
  },
  
  clear() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.particles = [];
  },
  
  // 通用粒子系统
  createParticle(x, y, type, options = {}) {
    return {
      x, y,
      vx: (Math.random() - 0.5) * (options.speed || 2),
      vy: (Math.random() - 0.5) * (options.speed || 2) - (options.rise || 0),
      size: options.size || 4,
      color: options.color || '#5B8C3A',
      alpha: 1,
      life: options.life || 60,
      maxLife: options.life || 60,
      type,
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.1,
      ...options
    };
  },
  
  updateParticles() {
    if (!this.ctx || !this.canvas) return;
    
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    this.particles = this.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.rotation += p.rotationSpeed;
      p.life--;
      p.alpha = p.life / p.maxLife;
      
      // 重力
      if (p.type === 'malt' || p.type === 'hop') {
        p.vy += 0.15;
      }
      
      // 浮力
      if (p.type === 'bubble' || p.type === 'steam') {
        p.vy -= 0.02;
        p.vx += (Math.random() - 0.5) * 0.1;
      }
      
      // 绘制
      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate(p.rotation);
      
      if (p.type === 'malt') {
        // 麦芽颗粒 - 椭圆形
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.ellipse(0, 0, p.size, p.size * 0.7, 0, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.type === 'hop') {
        // 酒花 - 松果状
        this.ctx.fillStyle = p.color;
        for (let i = 0; i < 5; i++) {
          const angle = (i / 5) * Math.PI * 2;
          this.ctx.beginPath();
          this.ctx.arc(
            Math.cos(angle) * p.size * 0.5,
            Math.sin(angle) * p.size * 0.5,
            p.size * 0.4,
            0, Math.PI * 2
          );
          this.ctx.fill();
        }
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size * 0.3, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.type === 'bubble') {
        // 气泡
        this.ctx.strokeStyle = p.color;
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        this.ctx.stroke();
        // 高光
        this.ctx.fillStyle = 'rgba(255,255,255,0.4)';
        this.ctx.beginPath();
        this.ctx.arc(-p.size * 0.3, -p.size * 0.3, p.size * 0.2, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.type === 'steam') {
        // 蒸汽
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size * (1 + (1 - p.alpha) * 2), 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.type === 'fruit') {
        // 水果
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        this.ctx.fill();
        // 叶子
        this.ctx.fillStyle = '#4CAF50';
        this.ctx.beginPath();
        this.ctx.ellipse(0, -p.size, p.size * 0.4, p.size * 0.2, 0, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.type === 'spice') {
        // 香料 - 星形
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i / 5) * Math.PI * 2 - Math.PI / 2;
          const r = i % 2 === 0 ? p.size : p.size * 0.5;
          if (i === 0) this.ctx.moveTo(Math.cos(angle) * r, Math.sin(angle) * r);
          else this.ctx.lineTo(Math.cos(angle) * r, Math.sin(angle) * r);
        }
        this.ctx.closePath();
        this.ctx.fill();
      } else if (p.type === 'yeast') {
        // 酵母 - 细胞状
        this.ctx.fillStyle = p.color;
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.fillStyle = 'rgba(255,255,255,0.3)';
        this.ctx.beginPath();
        this.ctx.arc(p.size * 0.2, -p.size * 0.2, p.size * 0.3, 0, Math.PI * 2);
        this.ctx.fill();
      }
      
      this.ctx.restore();
      
      return p.life > 0 && p.y < this.canvas.height + 50 && p.y > -50;
    });
    
    if (this.particles.length > 0 && this.animating) {
      requestAnimationFrame(() => this.updateParticles());
    } else if (this.particles.length === 0) {
      this.animating = false;
      this.clear();
    }
  },
  
  // ===== 糖化动画：麦芽落入锅中 =====
  playMashing(count = 8) {
    if (!this.init('step-mash')) return;
    
    this.clear();
    this.animating = true;
    
    const colors = ['#5B8C3A', '#8BC34A', '#8BC34A', '#33691E', '#689F38'];
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    // 创建麦芽粒子
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        Sound.playDrop();
        this.particles.push(this.createParticle(
          w * 0.3 + Math.random() * w * 0.4,
          h * 0.15,
          'malt',
          {
            color: colors[Math.floor(Math.random() * colors.length)],
            size: 6 + Math.random() * 8,
            speed: 1,
            life: 80 + Math.random() * 40
          }
        ));
        if (!this.animating) {
          this.animating = true;
          this.updateParticles();
        }
      }, i * 200);
    }
    
    // 蒸汽
    setTimeout(() => {
      for (let i = 0; i < 5; i++) {
        setTimeout(() => {
          this.particles.push(this.createParticle(
            w * 0.4 + Math.random() * w * 0.2,
            h * 0.6,
            'steam',
            {
              color: 'rgba(255,255,255,0.15)',
              size: 15 + Math.random() * 20,
              rise: 1.5,
              speed: 0.5,
              life: 100 + Math.random() * 50,
              vy: -1 - Math.random()
            }
          ));
        }, i * 300);
      }
    }, count * 200);
    
    this.updateParticles();
  },
  
  // ===== 煮沸动画：酒花飘落 + 蒸汽 =====
  playBoiling(count = 6) {
    if (!this.init('step-boil')) return;
    
    this.clear();
    this.animating = true;
    
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    // 酒花飘落
    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        Sound.playHopDrop();
        this.particles.push(this.createParticle(
          w * 0.2 + Math.random() * w * 0.6,
          h * 0.1,
          'hop',
          {
            color: '#4CAF50',
            size: 8 + Math.random() * 6,
            speed: 1.5,
            life: 90 + Math.random() * 30
          }
        ));
        if (!this.animating) {
          this.animating = true;
          this.updateParticles();
        }
      }, i * 250);
    }
    
    // 大量蒸汽
    setTimeout(() => {
      for (let i = 0; i < 10; i++) {
        setTimeout(() => {
          this.particles.push(this.createParticle(
            w * 0.3 + Math.random() * w * 0.4,
            h * 0.5,
            'steam',
            {
              color: 'rgba(255,200,150,0.12)',
              size: 20 + Math.random() * 25,
              rise: 2,
              speed: 0.8,
              life: 120 + Math.random() * 60,
              vy: -1.5 - Math.random() * 0.5
            }
          ));
        }, i * 200);
      }
    }, 500);
    
    this.updateParticles();
  },
  
  // ===== 发酵动画：气泡上升 =====
  playFermenting(duration = 3000) {
    if (!this.init('step-ferment')) return;
    
    this.clear();
    this.animating = true;
    
    const w = this.canvas.width;
    const h = this.canvas.height;
    const startTime = Date.now();
    
    const spawnBubble = () => {
      if (Date.now() - startTime > duration) return;
      
      Sound.playFermentBubble();
      
      // 多个气泡
      for (let i = 0; i < 3; i++) {
        this.particles.push(this.createParticle(
          w * 0.2 + Math.random() * w * 0.6,
          h * 0.7 + Math.random() * h * 0.2,
          'bubble',
          {
            color: `rgba(91, 140, 58, ${0.3 + Math.random() * 0.4})`,
            size: 3 + Math.random() * 8,
            rise: 0,
            speed: 0.3,
            life: 80 + Math.random() * 60,
            vy: -1.5 - Math.random() * 2
          }
        ));
      }
      
      if (this.animating) {
        requestAnimationFrame(() => this.updateParticles());
        setTimeout(spawnBubble, 200 + Math.random() * 300);
      }
    };
    
    spawnBubble();
    
    // 酵母粒子
    for (let i = 0; i < 5; i++) {
      setTimeout(() => {
        this.particles.push(this.createParticle(
          w * 0.4 + Math.random() * w * 0.2,
          h * 0.3,
          'yeast',
          {
            color: '#FFE4B5',
            size: 5 + Math.random() * 4,
            speed: 1,
            life: 100 + Math.random() * 50,
            vy: 0.5 + Math.random() * 0.5
          }
        ));
      }, i * 400);
    }
    
    this.updateParticles();
  },
  
  // ===== 增味动画：水果/香料飞入 =====
  playFlavoring(items) {
    if (!this.init('step-flavor')) return;
    
    this.clear();
    this.animating = true;
    
    const w = this.canvas.width;
    const h = this.canvas.height;
    
    const fruitColors = {
      '樱桃': '#DC143C', '覆盆子': '#E91E63', '桃子': '#FFB6C1',
      '百香果': '#FF9800', '橙子': '#FFA500', '香菜籽': '#8B4513',
      '橙皮': '#FF8C00', '咖啡': '#3E2723', '香草': '#F5DEB3',
      '椰子': '#FFF8DC', '橡木片': '#8B4513'
    };
    
    items.forEach((item, idx) => {
      setTimeout(() => {
        Sound.playDrop();
        
        const isFruit = ['樱桃', '覆盆子', '桃子', '百香果', '橙子'].includes(item);
        const color = fruitColors[item] || '#5B8C3A';
        
        this.particles.push(this.createParticle(
          w * 0.3 + Math.random() * w * 0.4,
          h * 0.1,
          isFruit ? 'fruit' : 'spice',
          {
            color,
            size: 10 + Math.random() * 6,
            speed: 1.5,
            life: 100 + Math.random() * 40
          }
        ));
        
        if (!this.animating) {
          this.animating = true;
          this.updateParticles();
        }
      }, idx * 300);
    });
    
    this.updateParticles();
  },
  
  // ===== 成品动画：啤酒倒入杯中 =====
  playPouring(beerColor, duration = 2000) {
    const container = document.getElementById('beer-visual');
    if (!container) return;
    
    // 创建倒酒动画canvas
    let canvas = container.querySelector('.pour-canvas');
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.className = 'pour-canvas';
      canvas.style.cssText = 'position:absolute;top:0;left:0;width:100%;height:100%;pointer-events:none;z-index:10;';
      container.style.position = 'relative';
      container.appendChild(canvas);
    }
    
    const rect = container.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    
    const ctx = canvas.getContext('2d');
    const w = canvas.width;
    const h = canvas.height;
    
    let progress = 0;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      progress = Math.min(elapsed / duration, 1);
      
      ctx.clearRect(0, 0, w, h);
      
      // 酒流
      const streamWidth = 8;
      const streamX = w / 2;
      const streamTop = h * 0.1;
      const streamBottom = h * (0.3 + progress * 0.5);
      
      // 酒流主体
      const grad = ctx.createLinearGradient(streamX - streamWidth/2, streamTop, streamX + streamWidth/2, streamBottom);
      grad.addColorStop(0, beerColor);
      grad.addColorStop(1, beerColor + 'CC');
      
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.moveTo(streamX - streamWidth/2, streamTop);
      ctx.lineTo(streamX + streamWidth/2, streamTop);
      ctx.lineTo(streamX + streamWidth/2 + 2, streamBottom);
      ctx.lineTo(streamX - streamWidth/2 - 2, streamBottom);
      ctx.closePath();
      ctx.fill();
      
      // 泡沫在底部
      if (progress > 0.1) {
        const foamHeight = h * 0.15 * progress;
        const foamY = h * 0.75 - foamHeight;
        
        ctx.fillStyle = 'rgba(255, 248, 225, 0.9)';
        ctx.beginPath();
        
        // 波浪形泡沫顶部
        ctx.moveTo(0, foamY + foamHeight);
        for (let x = 0; x <= w; x += 5) {
          const wave = Math.sin(x * 0.1 + elapsed * 0.01) * 3;
          ctx.lineTo(x, foamY + wave);
        }
        ctx.lineTo(w, h);
        ctx.lineTo(0, h);
        ctx.closePath();
        ctx.fill();
        
        // 泡沫气泡
        for (let i = 0; i < 8; i++) {
          const bx = w * 0.2 + Math.random() * w * 0.6;
          const by = foamY + Math.random() * foamHeight;
          const bs = 2 + Math.random() * 4;
          ctx.fillStyle = 'rgba(255,255,255,0.6)';
          ctx.beginPath();
          ctx.arc(bx, by, bs, 0, Math.PI * 2);
          ctx.fill();
        }
      }
      
      // 液体填充
      if (progress > 0.2) {
        const liquidHeight = h * 0.5 * (progress - 0.2) / 0.8;
        const liquidY = h * 0.75 - liquidHeight;
        
        ctx.fillStyle = beerColor + 'DD';
        ctx.fillRect(0, liquidY, w, liquidHeight);
        
        // 液体中的气泡
        for (let i = 0; i < 5; i++) {
          const bx = w * 0.2 + Math.random() * w * 0.6;
          const by = liquidY + Math.random() * liquidHeight;
          const bs = 2 + Math.random() * 3;
          ctx.strokeStyle = 'rgba(255,255,255,0.3)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(bx, by, bs, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        // 动画结束，淡出canvas
        setTimeout(() => {
          canvas.style.transition = 'opacity 0.5s';
          canvas.style.opacity = '0';
          setTimeout(() => {
            canvas.style.opacity = '1';
            ctx.clearRect(0, 0, w, h);
          }, 500);
        }, 500);
      }
    };
    
    Sound.playBubbleLoop();
    animate();
  },
  
  // 停止所有动画
  stop() {
    this.animating = false;
    this.particles = [];
    this.clear();
  }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Animations;
}
