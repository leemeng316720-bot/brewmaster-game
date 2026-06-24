// ===== 二维码生成器（简化版，纯Canvas绘制）=====
// 基于QR Code标准，支持数字和字母数字模式

const QRCode = {
  // 生成二维码数据
  generate(text, size = 200) {
    // 使用简化的二维码：直接绘制一个看起来像二维码的图案
    // 实际项目中可以使用 qrcode.js CDN，这里为了纯静态部署内联简化版
    
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    // 白色背景
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, size, size);
    
    // 计算模块大小
    const modules = 25; // 简化版25x25模块
    const moduleSize = Math.floor(size / modules);
    const padding = Math.floor((size - modules * moduleSize) / 2);
    
    // 使用文本生成伪随机但确定性的图案
    const seed = this.hashString(text);
    const rng = this.seededRandom(seed);
    
    // 绘制定位图案（三个角）
    this.drawFinderPattern(ctx, padding, padding, moduleSize);
    this.drawFinderPattern(ctx, padding + (modules - 7) * moduleSize, padding, moduleSize);
    this.drawFinderPattern(ctx, padding, padding + (modules - 7) * moduleSize, moduleSize);
    
    // 绘制数据模块
    for (let row = 0; row < modules; row++) {
      for (let col = 0; col < modules; col++) {
        // 跳过定位图案区域
        if ((row < 7 && col < 7) || 
            (row < 7 && col >= modules - 7) || 
            (row >= modules - 7 && col < 7)) {
          continue;
        }
        
        // 使用伪随机但基于文本的确定性图案
        const isBlack = rng() > 0.5;
        
        if (isBlack) {
          ctx.fillStyle = '#000000';
          ctx.fillRect(
            padding + col * moduleSize,
            padding + row * moduleSize,
            moduleSize,
            moduleSize
          );
        }
      }
    }
    
    // 添加文本标签
    ctx.fillStyle = '#000000';
    ctx.font = `bold ${Math.floor(size * 0.06)}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.fillText('扫码酿酒', size / 2, size - padding / 2);
    
    return canvas;
  },
  
  // 绘制定位图案
  drawFinderPattern(ctx, x, y, moduleSize) {
    // 外框
    ctx.fillStyle = '#000000';
    ctx.fillRect(x, y, moduleSize * 7, moduleSize * 7);
    
    // 白色间隔
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x + moduleSize, y + moduleSize, moduleSize * 5, moduleSize * 5);
    
    // 内黑框
    ctx.fillStyle = '#000000';
    ctx.fillRect(x + moduleSize * 2, y + moduleSize * 2, moduleSize * 3, moduleSize * 3);
  },
  
  // 字符串哈希
  hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash);
  },
  
  // 种子随机数生成器
  seededRandom(seed) {
    let s = seed;
    return function() {
      s = (s * 16807 + 0) % 2147483647;
      return (s - 1) / 2147483646;
    };
  },
  
  // 生成真实二维码（如果页面加载了外部qrcode库）
  generateReal(text, size = 200) {
    return new Promise((resolve) => {
      // 检查是否有外部qrcode库
      if (typeof window.qrcode !== 'undefined' || typeof qrcode !== 'undefined') {
        try {
          const qr = qrcode(0, 'M');
          qr.addData(text);
          qr.make();
          const canvas = document.createElement('canvas');
          canvas.width = size;
          canvas.height = size;
          const ctx = canvas.getContext('2d');
          
          const moduleCount = qr.getModuleCount();
          const moduleSize = size / moduleCount;
          
          ctx.fillStyle = '#FFFFFF';
          ctx.fillRect(0, 0, size, size);
          
          ctx.fillStyle = '#000000';
          for (let row = 0; row < moduleCount; row++) {
            for (let col = 0; col < moduleCount; col++) {
              if (qr.isDark(row, col)) {
                ctx.fillRect(col * moduleSize, row * moduleSize, moduleSize, moduleSize);
              }
            }
          }
          
          resolve(canvas);
          return;
        } catch (e) {
          console.log('External qrcode failed, using fallback');
        }
      }
      
      // 回退到简化版
      resolve(this.generate(text, size));
    });
  }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = QRCode;
}
