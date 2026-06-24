// ===== 音效系统 - Web Audio API合成 =====
// 纯代码生成，无需外部音频文件

const Sound = {
  ctx: null,
  enabled: true,
  
  init() {
    if (!this.ctx) {
      try {
        this.ctx = new (window.AudioContext || window.webkitAudioContext)();
      } catch (e) {
        console.log('Web Audio API not supported');
        this.enabled = false;
      }
    }
    // 恢复音频上下文（浏览器自动暂停策略）
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },
  
  // 恢复音频上下文（浏览器自动暂停策略）
  resume() {
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  },
  
  // 播放咕嘟声（温度加热/煮沸）
  playBubble() {
    if (!this.enabled || !this.ctx) return;
    this.init();
    this.resume();
    
    const t = this.ctx.currentTime;
    
    // 主振荡器 - 低频咕嘟
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(80 + Math.random() * 40, t);
    osc.frequency.exponentialRampToValueAtTime(60, t + 0.15);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.15, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(t);
    osc.stop(t + 0.25);
    
    // 噪声层 - 气泡破裂
    const bufferSize = this.ctx.sampleRate * 0.1;
    const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < bufferSize; i++) {
      data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.3));
    }
    
    const noise = this.ctx.createBufferSource();
    noise.buffer = buffer;
    
    const noiseGain = this.ctx.createGain();
    noiseGain.gain.setValueAtTime(0.05, t);
    noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    
    // 高通滤波器
    const filter = this.ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2000;
    
    noise.connect(filter);
    filter.connect(noiseGain);
    noiseGain.connect(this.ctx.destination);
    
    noise.start(t);
  },
  
  // 连续咕嘟声（用于温度调节时）
  playBubbleLoop() {
    if (!this.enabled || !this.ctx) return;
    this.init();
    this.resume();
    
    // 播放一串咕嘟声
    for (let i = 0; i < 3; i++) {
      setTimeout(() => this.playBubble(), i * 150);
    }
  },
  
  // 发酵泡泡声（高频短促）
  playFermentBubble() {
    if (!this.enabled || !this.ctx) return;
    this.init();
    this.resume();
    
    const t = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400 + Math.random() * 300, t);
    osc.frequency.exponentialRampToValueAtTime(200, t + 0.05);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.1, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.08);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(t);
    osc.stop(t + 0.1);
  },
  
  // 发酵泡泡连续声
  playFermentLoop() {
    if (!this.enabled || !this.ctx) return;
    this.init();
    this.resume();
    
    const count = 5 + Math.floor(Math.random() * 5);
    for (let i = 0; i < count; i++) {
      setTimeout(() => this.playFermentBubble(), i * (80 + Math.random() * 100));
    }
  },
  
  // 投入原料声（短促"噗"）
  playDrop() {
    if (!this.enabled || !this.ctx) return;
    this.init();
    this.resume();
    
    const t = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.exponentialRampToValueAtTime(100, t + 0.08);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.2, t + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(t);
    osc.stop(t + 0.12);
  },
  
  // 酒花投入声（更清脆）
  playHopDrop() {
    if (!this.enabled || !this.ctx) return;
    this.init();
    this.resume();
    
    const t = this.ctx.currentTime;
    
    // 清脆的"叮"声
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(800, t);
    osc.frequency.exponentialRampToValueAtTime(400, t + 0.1);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.12, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(t);
    osc.stop(t + 0.15);
    
    // 轻微的噪声
    this.playDrop();
  },
  
  // 成功音效（悦耳和弦）
  playSuccess() {
    if (!this.enabled || !this.ctx) return;
    this.init();
    this.resume();
    
    const t = this.ctx.currentTime;
    const notes = [523.25, 659.25, 783.99]; // C大调和弦
    
    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.value = freq;
      
      gain.gain.setValueAtTime(0, t + i * 0.08);
      gain.gain.linearRampToValueAtTime(0.12, t + i * 0.08 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + i * 0.08 + 0.4);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(t + i * 0.08);
      osc.stop(t + i * 0.08 + 0.5);
    });
  },
  
  // 错误/警告音效
  playWarning() {
    if (!this.enabled || !this.ctx) return;
    this.init();
    this.resume();
    
    const t = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(300, t);
    osc.frequency.linearRampToValueAtTime(200, t + 0.15);
    
    gain.gain.setValueAtTime(0.1, t);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(t);
    osc.stop(t + 0.2);
  },
  
  // 完成酿造音效（庆祝）
  playComplete() {
    if (!this.enabled || !this.ctx) return;
    this.init();
    this.resume();
    
    const t = this.ctx.currentTime;
    const scale = [523.25, 587.33, 659.25, 698.46, 783.99, 880, 987.77, 1046.5];
    
    scale.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.value = freq;
      
      const delay = i * 0.06;
      gain.gain.setValueAtTime(0, t + delay);
      gain.gain.linearRampToValueAtTime(0.1, t + delay + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.001, t + delay + 0.5);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start(t + delay);
      osc.stop(t + delay + 0.6);
    });
  },
  
  // 按钮点击音效
  playClick() {
    if (!this.enabled || !this.ctx) return;
    this.init();
    this.resume();
    
    const t = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(600, t);
    osc.frequency.exponentialRampToValueAtTime(800, t + 0.03);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.08, t + 0.005);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.06);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(t);
    osc.stop(t + 0.07);
  },
  
  // 页面切换音效
  playPageTransition() {
    if (!this.enabled || !this.ctx) return;
    this.init();
    this.resume();
    
    const t = this.ctx.currentTime;
    
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, t);
    osc.frequency.exponentialRampToValueAtTime(600, t + 0.1);
    
    gain.gain.setValueAtTime(0, t);
    gain.gain.linearRampToValueAtTime(0.06, t + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start(t);
    osc.stop(t + 0.15);
  },
  
  // 切换音效开关
  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Sound;
}
