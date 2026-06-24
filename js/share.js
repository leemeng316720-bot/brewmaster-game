// ===== 分享图生成模块 =====

const Share = {
  canvas: null,
  ctx: null,
  
  // 初始化Canvas
  init() {
    this.canvas = document.getElementById('share-canvas');
    if (!this.canvas) return false;
    this.ctx = this.canvas.getContext('2d');
    return true;
  },
  
  // 生成分享图
  generate(state, result) {
    if (!this.init()) return;
    
    const ctx = this.ctx;
    const canvas = this.canvas;
    const w = canvas.width;
    const h = canvas.height;
    
    const style = result?.style;
    const actual = result?.actual;
    const score = result?.score;
    const name = result?.name || '未命名佳酿';
    const brewer = state?.brewer;
    
    if (!style || !actual || !score) return;
    
    // 背景 - 深灰工业风渐变
    const bgGrad = ctx.createLinearGradient(0, 0, 0, h);
    bgGrad.addColorStop(0, '#1A1A1A');
    bgGrad.addColorStop(0.5, '#2D2D2D');
    bgGrad.addColorStop(1, '#0D0D0D');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, w, h);
    
    // 装饰性气泡/光斑
    this.drawDecorations(ctx, w, h);
    
    // 顶部标题区
    ctx.fillStyle = 'rgba(255, 111, 0, 0.15)';
    ctx.fillRect(0, 0, w, 280);
    
    // 游戏Logo
    ctx.font = 'bold 36px -apple-system, sans-serif';
    ctx.fillStyle = '#FF6F00';
    ctx.textAlign = 'center';
    ctx.fillText('🍀🍺 Hoppy Go Lucky', w / 2, 70);
    
    ctx.font = '24px -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(255, 111, 0, 0.6)';
    ctx.fillText('酒花与幸运 · 酿造你的快乐', w / 2, 110);
    
    // 酒名
    ctx.font = 'bold 72px -apple-system, sans-serif';
    ctx.fillStyle = '#FFF8E1';
    ctx.textAlign = 'center';
    // 如果名字太长，缩小字体
    const nameFontSize = name.length > 10 ? 56 : 72;
    ctx.font = `bold ${nameFontSize}px -apple-system, sans-serif`;
    ctx.fillText(name, w / 2, 200);
    
    // 风格标签
    ctx.font = '28px -apple-system, sans-serif';
    ctx.fillStyle = '#FF6F00';
    ctx.fillText(`${style.name} · ${style.nameEn}`, w / 2, 250);
    
    // 评分大数字
    const scoreY = 380;
    ctx.font = 'bold 200px -apple-system, sans-serif';
    ctx.fillStyle = score.rating.color || '#FF6F00';
    ctx.textAlign = 'center';
    ctx.fillText(score.total.toString(), w / 2, scoreY);
    
    // 评分标签
    ctx.font = 'bold 48px -apple-system, sans-serif';
    ctx.fillStyle = score.rating.color || '#FF6F00';
    ctx.fillText(`${score.rating.emoji} ${score.rating.level}`, w / 2, scoreY + 60);
    
    // 啤酒杯绘制
    this.drawBeerGlass(ctx, w / 2, 620, 200, 300, actual.srm);
    
    // 参数区
    const paramY = 980;
    const paramBoxW = 900;
    const paramBoxX = (w - paramBoxW) / 2;
    
    // 参数背景
    ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
    ctx.beginPath();
    ctx.roundRect(paramBoxX, paramY, paramBoxW, 320, 20);
    ctx.fill();
    ctx.strokeStyle = 'rgba(255, 111, 0, 0.3)';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // 参数标题
    ctx.font = 'bold 32px -apple-system, sans-serif';
    ctx.fillStyle = '#FF6F00';
    ctx.textAlign = 'center';
    ctx.fillText('酿造参数', w / 2, paramY + 50);
    
    // 参数表格
    const params = [
      { label: 'OG 初始比重', actual: actual.og.toFixed(3), target: `${style.og.min}-${style.og.max}` },
      { label: 'FG 最终比重', actual: actual.fg.toFixed(3), target: `${style.fg.min}-${style.fg.max}` },
      { label: 'IBU 苦度', actual: Math.round(actual.ibu).toString(), target: `${style.ibu.min}-${style.ibu.max}` },
      { label: 'SRM 色度', actual: Math.round(actual.srm).toString(), target: `${style.srm.min}-${style.srm.max}` },
      { label: 'ABV 酒精度', actual: actual.abv.toFixed(1) + '%', target: `${style.abv.min}-${style.abv.max}%` }
    ];
    
    params.forEach((p, i) => {
      const y = paramY + 100 + i * 42;
      const x1 = paramBoxX + 60;
      const x2 = paramBoxX + 350;
      const x3 = paramBoxX + 650;
      
      ctx.font = '28px -apple-system, sans-serif';
      ctx.fillStyle = 'rgba(224, 224, 224, 0.7)';
      ctx.textAlign = 'left';
      ctx.fillText(p.label, x1, y);
      
      ctx.fillStyle = '#E0E0E0';
      ctx.textAlign = 'center';
      ctx.fillText(p.actual, x2, y);
      
      ctx.fillStyle = 'rgba(255, 111, 0, 0.8)';
      ctx.fillText(`目标: ${p.target}`, x3, y);
    });
    
    // 酿酒师评语区
    const commentY = paramY + 360;
    const commentBoxH = 280;
    
    ctx.fillStyle = 'rgba(255, 255, 255, 0.03)';
    ctx.beginPath();
    ctx.roundRect(paramBoxX, commentY, paramBoxW, commentBoxH, 20);
    ctx.fill();
    
    // 酿酒师头像（大emoji）
    ctx.font = '120px serif';
    ctx.textAlign = 'center';
    ctx.fillText(brewer?.avatar || '🍺', w / 2 - 320, commentY + 100);
    
    // 评语
    const comment = BrewLogic.generateComment(style, score, actual);
    ctx.font = '26px -apple-system, sans-serif';
    ctx.fillStyle = '#E0E0E0';
    ctx.textAlign = 'left';
    
    // 分行显示评语
    const maxWidth = 700;
    const lineHeight = 38;
    const startX = w / 2 - 220;
    const startY = commentY + 50;
    
    // 酿酒师名字
    ctx.font = 'bold 28px -apple-system, sans-serif';
    ctx.fillStyle = '#FF6F00';
    ctx.fillText(`${brewer?.name || '酿酒师'}说：`, startX, startY);
    
    ctx.font = '24px -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(224, 224, 224, 0.9)';
    const lines = this.wrapText(ctx, comment, maxWidth);
    lines.forEach((line, i) => {
      if (i < 5) { // 最多显示5行
        ctx.fillText(line, startX, startY + 40 + i * lineHeight);
      }
    });
    
    // 底部信息
    const footerY = h - 120;
    ctx.font = '24px -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(224, 224, 224, 0.5)';
    ctx.textAlign = 'center';
    ctx.fillText('基于 BJCP 2021 啤酒风格指南 · 酿造快乐，分享幸运 🍀', w / 2, footerY);
    
    ctx.font = '20px -apple-system, sans-serif';
    ctx.fillText('扫码体验酿酒乐趣 →', w / 2, footerY + 35);
    
    // 二维码
    const qrSize = 100;
    const qrX = w / 2 + 220;
    const qrY = footerY - 40;
    
    // 生成二维码
    const qrCanvas = QRCode.generate('https://vptt6cmncs-del.github.io/brewmaster-game/', qrSize);
    if (qrCanvas) {
      ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);
    } else {
      // 备用：简单框
      ctx.strokeStyle = 'rgba(255, 111, 0, 0.3)';
      ctx.lineWidth = 2;
      ctx.strokeRect(qrX, qrY, qrSize, qrSize);
      ctx.fillStyle = 'rgba(255, 111, 0, 0.3)';
      ctx.font = '16px -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('QR', qrX + qrSize / 2, qrY + qrSize / 2 + 5);
    }
    
    // 日期
    ctx.font = '20px -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(224, 224, 224, 0.4)';
    ctx.fillText(new Date().toLocaleDateString('zh-CN'), w / 2, h - 30);
  },
  
  // 绘制啤酒杯
  drawBeerGlass(ctx, x, y, width, height, srm) {
    const beerColor = BrewLogic.srmToColor(srm);
    const headColor = 'rgba(255, 248, 225, 0.9)';
    
    // 杯身
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 4;
    ctx.beginPath();
    // 杯口
    ctx.moveTo(x - width / 2, y - height / 2);
    ctx.lineTo(x + width / 2, y - height / 2);
    // 右侧
    ctx.lineTo(x + width / 2 + 10, y + height / 2);
    // 底部
    ctx.lineTo(x - width / 2 - 10, y + height / 2);
    // 左侧
    ctx.lineTo(x - width / 2, y - height / 2);
    ctx.stroke();
    
    // 啤酒液体
    const liquidTop = y - height / 2 + 40; // 泡沫高度
    const liquidGrad = ctx.createLinearGradient(x, liquidTop, x, y + height / 2);
    liquidGrad.addColorStop(0, beerColor);
    liquidGrad.addColorStop(1, this.darkenColor(beerColor, 0.7));
    
    ctx.fillStyle = liquidGrad;
    ctx.beginPath();
    ctx.moveTo(x - width / 2 + 2, liquidTop);
    ctx.lineTo(x + width / 2 - 2, liquidTop);
    ctx.lineTo(x + width / 2 + 8, y + height / 2 - 2);
    ctx.lineTo(x - width / 2 - 8, y + height / 2 - 2);
    ctx.closePath();
    ctx.fill();
    
    // 泡沫
    ctx.fillStyle = headColor;
    ctx.beginPath();
    ctx.moveTo(x - width / 2 + 2, y - height / 2 + 2);
    ctx.lineTo(x + width / 2 - 2, y - height / 2 + 2);
    ctx.lineTo(x + width / 2 - 2, liquidTop);
    ctx.lineTo(x - width / 2 + 2, liquidTop);
    ctx.closePath();
    ctx.fill();
    
    // 泡沫气泡纹理
    ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    for (let i = 0; i < 8; i++) {
      const bx = x - width / 3 + Math.random() * (width * 2 / 3);
      const by = y - height / 2 + 5 + Math.random() * 25;
      const br = 2 + Math.random() * 4;
      ctx.beginPath();
      ctx.arc(bx, by, br, 0, Math.PI * 2);
      ctx.fill();
    }
    
    // 杯身高光
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.moveTo(x - width / 2 + 10, liquidTop + 10);
    ctx.lineTo(x - width / 2 + 25, liquidTop + 10);
    ctx.lineTo(x - width / 2 + 20, y + height / 2 - 20);
    ctx.lineTo(x - width / 2 + 10, y + height / 2 - 20);
    ctx.closePath();
    ctx.fill();
    
    // 色度标注
    ctx.font = 'bold 24px -apple-system, sans-serif';
    ctx.fillStyle = '#FFF8E1';
    ctx.textAlign = 'center';
    ctx.fillText(`SRM ${Math.round(srm)}`, x, y + height / 2 + 40);
    ctx.font = '20px -apple-system, sans-serif';
    ctx.fillStyle = 'rgba(255, 248, 225, 0.7)';
    ctx.fillText(BrewLogic.srmToColorName(srm), x, y + height / 2 + 70);
  },
  
  // 绘制装饰
  drawDecorations(ctx, w, h) {
    // 几个半透明圆形光斑
    const spots = [
      { x: 100, y: 200, r: 150, color: 'rgba(255, 111, 0, 0.08)' },
      { x: w - 150, y: 400, r: 200, color: 'rgba(255, 111, 0, 0.06)' },
      { x: 200, y: h - 300, r: 180, color: 'rgba(255, 111, 0, 0.05)' },
      { x: w - 100, y: h - 200, r: 120, color: 'rgba(255, 111, 0, 0.07)' }
    ];
    
    spots.forEach(spot => {
      const grad = ctx.createRadialGradient(spot.x, spot.y, 0, spot.x, spot.y, spot.r);
      grad.addColorStop(0, spot.color);
      grad.addColorStop(1, 'transparent');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);
    });
  },
  
  // 文字换行
  wrapText(ctx, text, maxWidth) {
    const words = text.split('');
    const lines = [];
    let currentLine = '';
    
    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine + words[i];
      const metrics = ctx.measureText(testLine);
      if (metrics.width > maxWidth && currentLine.length > 0) {
        lines.push(currentLine);
        currentLine = words[i];
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine);
    return lines;
  },
  
  // 颜色变暗
  darkenColor(hex, factor) {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return `rgb(${Math.floor(r * factor)}, ${Math.floor(g * factor)}, ${Math.floor(b * factor)})`;
  },
  
  // 下载图片
  download() {
    if (!this.canvas) return;
    
    const link = document.createElement('a');
    link.download = `精酿啤酒_${new Date().getTime()}.png`;
    link.href = this.canvas.toDataURL('image/png');
    link.click();
  }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Share;
}
