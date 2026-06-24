// ===== UI 渲染模块 =====

const UI = {
  // 渲染学徒模式
  renderApprenticeMode() {
    const grid = document.getElementById('unlock-grid');
    const progressFill = document.getElementById('apprentice-progress-fill');
    const progressText = document.getElementById('apprentice-progress-text');
    if (!grid) return;
    
    const { allStyles, unlocked, completed } = game.getApprenticeProgress();
    
    // 更新进度条
    const total = allStyles.length;
    const completedCount = completed.length;
    const percent = (completedCount / total) * 100;
    if (progressFill) progressFill.style.width = `${percent}%`;
    if (progressText) progressText.textContent = `解锁进度: ${completedCount}/${total} 风格`;
    
    grid.innerHTML = '';
    
    allStyles.forEach((item, idx) => {
      const isUnlocked = unlocked.includes(item.style.id) || idx === 0;
      const isCompleted = completed.find(c => c.styleId === item.style.id);
      
      const div = document.createElement('div');
      div.className = `unlock-item ${isUnlocked ? 'unlocked' : 'locked'} ${isCompleted ? 'completed' : ''}`;
      
      const family = BJCP_STYLES[item.family];
      
      div.innerHTML = `
        <div class="unlock-emoji">${isUnlocked ? family?.emoji || '🍺' : '🔒'}</div>
        <div class="unlock-name">${isUnlocked ? item.style.name : '???'}</div>
        ${isCompleted ? `<div class="unlock-score">${isCompleted.score}分 ✓</div>` : ''}
        ${isUnlocked && !isCompleted ? '<div class="unlock-score">待挑战</div>' : ''}
      `;
      
      if (isUnlocked) {
        div.onclick = () => game.startApprenticeBrew(item.family, item.style);
      }
      
      grid.appendChild(div);
    });
  },
  
  // 渲染酒吧推荐模式
  renderBarMode() {
    // 酒吧模式不需要预渲染，所有内容在nextBarCustomer中动态生成
  },
  renderStyleGrid() {
    const grid = document.getElementById('style-grid');
    if (!grid) return;
    
    grid.innerHTML = '';
    for (const key in BJCP_STYLES) {
      const family = BJCP_STYLES[key];
      const card = document.createElement('div');
      card.className = 'style-card';
      card.innerHTML = `
        <span class="emoji">${family.emoji}</span>
        <div class="name">${family.name}</div>
        <div class="desc">${family.description}</div>
      `;
      card.onclick = () => game.selectFamily(key);
      grid.appendChild(card);
    }
  },
  
  // 渲染具体风格列表
  renderStyleList(familyKey) {
    const family = BJCP_STYLES[familyKey];
    const list = document.getElementById('style-list');
    const title = document.getElementById('detail-title');
    if (!list || !family) return;
    
    title.textContent = `${family.emoji} ${family.name}`;
    list.innerHTML = '';
    
    family.styles.forEach(style => {
      const item = document.createElement('div');
      item.className = 'style-item';
      item.innerHTML = `
        <div class="style-name">${style.name}</div>
        <div class="style-en">${style.nameEn} (${style.id})</div>
        <div class="style-desc">${style.description}</div>
        <div class="style-params">
          <span class="param-tag">OG（初始比重）${style.og.min}-${style.og.max}</span>
          <span class="param-tag">IBU（苦度）${style.ibu.min}-${style.ibu.max}</span>
          <span class="param-tag">ABV（酒精度）${style.abv.min}-${style.abv.max}%</span>
          <span class="param-tag">SRM（色度）${style.srm.min}-${style.srm.max}</span>
        </div>
      `;
      item.onclick = () => game.selectStyle(style);
      list.appendChild(item);
    });
  },
  
  // 渲染酿酒师选择
  renderBrewerSelect(familyKey) {
    const family = BJCP_STYLES[familyKey];
    const grid = document.getElementById('brewer-grid');
    if (!grid || !family) return;
    
    grid.innerHTML = '';
    const brewer = family.brewer;
    
    const card = document.createElement('div');
    card.className = 'brewer-card';
    card.innerHTML = `
      <div class="avatar">${brewer.avatar}</div>
      <div class="info">
        <div class="name">${brewer.name}</div>
        <div class="style">${brewer.style}</div>
        <div class="catchphrase">"${brewer.catchphrase}"</div>
      </div>
    `;
    card.onclick = () => game.selectBrewer(brewer);
    grid.appendChild(card);
    
    // 添加一个"随机酿酒师"选项
    const randomCard = document.createElement('div');
    randomCard.className = 'brewer-card';
    randomCard.innerHTML = `
      <div class="avatar">🎲</div>
      <div class="info">
        <div class="name">神秘酿酒师</div>
        <div class="style">随机风格，惊喜连连</div>
        <div class="catchphrase">"让命运决定这杯酒的味道…"</div>
      </div>
    `;
    randomCard.onclick = () => game.selectBrewer({ ...brewer, name: '神秘酿酒师', avatar: '🎲', catchphrase: '让命运决定这杯酒的味道…' });
    grid.appendChild(randomCard);
  },
  
  // 渲染糖化步骤
  renderMashStep(style) {
    const selector = document.getElementById('malt-selector');
    const selected = document.getElementById('selected-malts');
    if (!selector) return;
    
    selector.innerHTML = '';
    selected.innerHTML = '';
    
    style.malts.forEach(malt => {
      const btn = document.createElement('button');
      btn.className = 'ingredient-btn';
      btn.setAttribute('data-malt', malt.name);
      const ing = INGREDIENTS.malts[malt.name];
      btn.innerHTML = `
        <span class="ing-name">${malt.name}</span>
        <span class="ing-meta">色度${ing?.color || malt.color || '?'} · PPG${ing?.ppg || malt.gravity || '?'}</span>
      `;
      btn.onclick = () => game.toggleMalt(malt.name);
      if (malt.default) {
        btn.classList.add('selected');
      }
      selector.appendChild(btn);
    });
    
    // 设置理想值提示
    const tempIdeal = document.getElementById('mash-temp-ideal');
    const timeIdeal = document.getElementById('mash-time-ideal');
    if (tempIdeal) tempIdeal.textContent = `建议: ${style.mashTemp.min}-${style.mashTemp.max}°C`;
    if (timeIdeal) timeIdeal.textContent = `建议: ${style.mashTime.min}-${style.mashTime.max}分钟`;
    
    // 设置滑块初始值
    const tempSlider = document.getElementById('mash-temp');
    const timeSlider = document.getElementById('mash-time');
    if (tempSlider) {
      tempSlider.value = style.mashTemp.ideal;
      tempSlider.oninput = (e) => {
        document.getElementById('mash-temp-val').textContent = e.target.value;
        game.state.mashTemp = parseFloat(e.target.value);
        game.checkWarnings();
      };
    }
    if (timeSlider) {
      timeSlider.value = style.mashTime.ideal;
      timeSlider.oninput = (e) => {
        document.getElementById('mash-time-val').textContent = e.target.value;
        game.state.mashTime = parseInt(e.target.value);
      };
    }
    
    // 初始化状态
    game.state.mashTemp = style.mashTemp.ideal;
    game.state.mashTime = style.mashTime.ideal;
    
    // ===== 默认麦芽选择算法（分离OG和SRM计算）=====
    const targetOG = style.og.target || (style.og.min + style.og.max) / 2;
    const targetSRM = style.srm.target || (style.srm.min + style.srm.max) / 2;
    const defaultMalts = style.malts.filter(m => m.default);
    const allMalts = style.malts;
    
    // 辅助函数
    const getSRM = (weights) => {
      let mcu = 0;
      weights.forEach(w => {
        const ing = INGREDIENTS.malts[w.name];
        mcu += (ing?.color || 2) * w.weight;
      });
      return Math.max(1, Math.min(50, 1.4922 * Math.pow(mcu / BrewLogic.BATCH_SIZE, 0.6859)));
    };
    
    const getOG = (weights) => {
      let points = 0;
      weights.forEach(w => {
        const ing = INGREDIENTS.malts[w.name];
        points += (ing?.ppg || 35) * w.weight * BrewLogic.MASH_EFFICIENCY;
      });
      return 1 + points / (BrewLogic.BATCH_SIZE * 1000);
    };
    
    const mcuFromSRM = (srm) => {
      return Math.pow(srm / 1.4922, 1 / 0.6859) * BrewLogic.BATCH_SIZE;
    };
    
    // 分类麦芽
    const baseMalts = defaultMalts.filter(m => {
      const ing = INGREDIENTS.malts[m.name];
      return (ing?.color || m.color || 2) <= 10;
    });
    const midDarkMalts = defaultMalts.filter(m => {
      const ing = INGREDIENTS.malts[m.name];
      const c = ing?.color || m.color || 2;
      return c > 10 && c <= 100;
    });
    const veryDarkMalts = defaultMalts.filter(m => {
      const ing = INGREDIENTS.malts[m.name];
      return (ing?.color || m.color || 2) > 100;
    });
    
    // 1. 极深色麦芽：只选一种最深的，固定1磅
    let veryDarkWeights = [];
    if (veryDarkMalts.length > 0) {
      const deepest = veryDarkMalts.sort((a, b) => {
        const ca = INGREDIENTS.malts[a.name]?.color || a.color || 2;
        const cb = INGREDIENTS.malts[b.name]?.color || b.color || 2;
        return cb - ca;
      })[0];
      veryDarkWeights = [{ name: deepest.name, weight: 1 }];
    }
    
    // 2. 计算基础麦芽重量（承担全部OG）
    const basePPG = baseMalts.reduce((sum, m) => {
      const ing = INGREDIENTS.malts[m.name];
      return sum + (ing?.ppg || m.gravity || 35);
    }, 0);
    
    const vdPoints = veryDarkWeights.reduce((sum, w) => {
      const ing = INGREDIENTS.malts[w.name];
      return sum + (ing?.ppg || 25) * w.weight;
    }, 0);
    
    let baseWeights = [];
    if (baseMalts.length > 0) {
      const basePointsNeeded = (targetOG - 1) * BrewLogic.BATCH_SIZE * 1000 - vdPoints;
      const baseWeight = Math.max(1, basePointsNeeded / (basePPG * BrewLogic.MASH_EFFICIENCY));
      const perMalt = Math.max(1, Math.round(baseWeight / baseMalts.length));
      baseWeights = baseMalts.map(m => ({ name: m.name, weight: perMalt }));
    }
    
    // 3. 检查当前SRM
    let currentWeights = [...baseWeights, ...veryDarkWeights];
    let currentSRM = getSRM(currentWeights);
    
    // 4. 如果SRM不够，添加中等色度默认麦芽
    let midDarkWeights = [];
    if (currentSRM < style.srm.min && midDarkMalts.length > 0) {
      const targetMCU = mcuFromSRM(targetSRM);
      const currentMCU = mcuFromSRM(currentSRM);
      const mcuNeeded = targetMCU - currentMCU;
      
      const totalMidColor = midDarkMalts.reduce((sum, m) => {
        const ing = INGREDIENTS.malts[m.name];
        return sum + (ing?.color || m.color || 2);
      }, 0);
      
      midDarkWeights = midDarkMalts.map(m => {
        const ing = INGREDIENTS.malts[m.name];
        const color = ing?.color || m.color || 2;
        const weight = Math.max(1, Math.round(mcuNeeded / totalMidColor));
        return { name: m.name, weight };
      });
    }
    
    // 5. 如果SRM仍不够，从所有可用麦芽中选择
    let extraWeights = [];
    let weights = [...baseWeights, ...midDarkWeights, ...veryDarkWeights];
    let srm = getSRM(weights);
    
    if (srm < style.srm.min) {
      // 找到色度适中且未使用的麦芽
      let candidates = allMalts.filter(m => {
        const ing = INGREDIENTS.malts[m.name];
        const c = ing?.color || m.color || 2;
        return c > 0 && c <= 100 && !weights.find(w => w.name === m.name);
      });
      
      if (candidates.length === 0) {
        // 放宽条件
        candidates = allMalts.filter(m => {
          const ing = INGREDIENTS.malts[m.name];
          const c = ing?.color || m.color || 2;
          return c > 0 && !weights.find(w => w.name === m.name);
        });
      }
      
      if (candidates.length > 0) {
        const targetMCU = mcuFromSRM(targetSRM);
        const currentMCU = weights.reduce((sum, w) => {
          const ing = INGREDIENTS.malts[w.name];
          return sum + (ing?.color || 2) * w.weight;
        }, 0);
        const mcuNeeded = targetMCU - currentMCU;
        
        // 选能最有效补充MCU的
        const best = candidates.sort((a, b) => {
          const ca = INGREDIENTS.malts[a.name]?.color || a.color || 2;
          const cb = INGREDIENTS.malts[b.name]?.color || b.color || 2;
          return Math.abs(ca - mcuNeeded) - Math.abs(cb - mcuNeeded);
        })[0];
        
        const ing = INGREDIENTS.malts[best.name];
        const color = ing?.color || best.color || 2;
        const weight = Math.max(1, Math.round(mcuNeeded / color));
        extraWeights = [{ name: best.name, weight }];
      }
    }
    
    // 6. 检查OG，如果超标，减少基础麦芽
    weights = [...baseWeights, ...midDarkWeights, ...veryDarkWeights, ...extraWeights];
    let og = getOG(weights);
    if (og > style.og.max) {
      const excessPoints = (og - 1) * BrewLogic.BATCH_SIZE * 1000 - (targetOG - 1) * BrewLogic.BATCH_SIZE * 1000;
      const baseTotalPPG = baseWeights.reduce((sum, w) => {
        const ing = INGREDIENTS.malts[w.name];
        return sum + (ing?.ppg || 35);
      }, 0);
      const reduce = excessPoints / (baseTotalPPG * BrewLogic.MASH_EFFICIENCY);
      const perReduce = Math.max(0, Math.round(reduce / baseWeights.length));
      
      baseWeights = baseWeights.map(w => ({
        name: w.name,
        weight: Math.max(1, w.weight - perReduce)
      }));
    }
    
    // 7. 如果OG不够，增加基础麦芽
    weights = [...baseWeights, ...midDarkWeights, ...veryDarkWeights, ...extraWeights];
    og = getOG(weights);
    if (og < style.og.min) {
      const neededPoints = (targetOG - 1) * BrewLogic.BATCH_SIZE * 1000 - (og - 1) * BrewLogic.BATCH_SIZE * 1000;
      const baseTotalPPG = baseWeights.reduce((sum, w) => {
        const ing = INGREDIENTS.malts[w.name];
        return sum + (ing?.ppg || 35);
      }, 0);
      const add = Math.max(1, Math.round(neededPoints / (baseTotalPPG * BrewLogic.MASH_EFFICIENCY)));
      
      baseWeights = baseWeights.map(w => ({
        name: w.name,
        weight: w.weight + add
      }));
    }
    
    // 最终合并（使用Map去重）
    const weightMap = new Map();
    baseWeights.forEach(w => weightMap.set(w.name, w.weight));
    midDarkWeights.forEach(w => weightMap.set(w.name, w.weight));
    veryDarkWeights.forEach(w => weightMap.set(w.name, w.weight));
    extraWeights.forEach(w => weightMap.set(w.name, w.weight));
    
    game.state.selectedMalts = Array.from(weightMap.entries()).map(([name, weight]) => ({ name, weight }));
    
    this.updateSelectedMalts();
  },
  
  // 更新已选麦芽显示
  updateSelectedMalts() {
    const container = document.getElementById('selected-malts');
    if (!container) return;
    
    container.innerHTML = '';
    game.state.selectedMalts.forEach(malt => {
      const tag = document.createElement('span');
      tag.className = 'selected-tag';
      tag.innerHTML = `${malt.name} ${malt.weight}磅 <button class="weight-btn" onclick="game.adjustMaltWeight('${malt.name}', -1)">-</button><button class="weight-btn" onclick="game.adjustMaltWeight('${malt.name}', 1)">+</button> <span class="remove" onclick="game.removeMalt('${malt.name}')">×</span>`;
      container.appendChild(tag);
    });
  },
  
  // 渲染煮沸步骤
  renderBoilStep(style) {
    const selector = document.getElementById('hop-selector');
    const selected = document.getElementById('selected-hops');
    if (!selector) return;
    
    selector.innerHTML = '';
    selected.innerHTML = '';
    
    style.hops.forEach(hop => {
      const btn = document.createElement('button');
      btn.className = 'ingredient-btn';
      btn.setAttribute('data-hop', hop.name);
      const ing = INGREDIENTS.hops[hop.name];
      btn.innerHTML = `
        <span class="ing-name">${hop.name}</span>
        <span class="ing-meta">α${ing?.alpha || hop.alpha || '?'}% · ${ing?.region || hop.region || '?'}</span>
      `;
      btn.onclick = () => game.toggleHop(hop.name);
      selector.appendChild(btn);
    });
    
    const timeIdeal = document.getElementById('boil-time-ideal');
    if (timeIdeal) timeIdeal.textContent = `建议: ${style.boilTime.min}-${style.boilTime.max}分钟`;
    
    const timeSlider = document.getElementById('boil-time');
    if (timeSlider) {
      timeSlider.value = style.boilTime.ideal;
      timeSlider.oninput = (e) => {
        document.getElementById('boil-time-val').textContent = e.target.value;
        game.state.boilTime = parseInt(e.target.value);
        game.checkWarnings();
      };
    }
    
    game.state.boilTime = style.boilTime.ideal;
    // 低IBU风格默认少选酒花
    const defaultHopCount = style.ibu.max <= 20 ? 1 : 2;
    const defaultHopWeight = style.ibu.max <= 20 ? 0.5 : 1.0;
    game.state.selectedHops = style.hops.slice(0, defaultHopCount).map(h => ({ 
      name: h.name, 
      weight: defaultHopWeight, 
      boilTime: style.boilTime.ideal 
    }));
  },
  
  // 更新已选酒花显示
  updateSelectedHops() {
    const container = document.getElementById('selected-hops');
    if (!container) return;
    
    container.innerHTML = '';
    game.state.selectedHops.forEach(hop => {
      const tag = document.createElement('span');
      tag.className = 'selected-tag';
      tag.innerHTML = `${hop.name} ${hop.weight}oz <button class="weight-btn" onclick="game.adjustHopWeight('${hop.name}', -0.5)">-</button><button class="weight-btn" onclick="game.adjustHopWeight('${hop.name}', 0.5)">+</button> <span class="remove" onclick="game.removeHop('${hop.name}')">×</span>`;
      container.appendChild(tag);
    });
  },
  
  // 渲染发酵步骤
  renderFermentStep(style) {
    const selector = document.getElementById('yeast-selector');
    if (!selector) return;
    
    selector.innerHTML = '';
    
    style.yeasts.forEach(yeast => {
      const btn = document.createElement('button');
      btn.className = 'ingredient-btn';
      const ing = INGREDIENTS.yeasts[yeast.name];
      btn.innerHTML = `
        <span class="ing-name">${yeast.name}</span>
        <span class="ing-meta">发酵度${Math.round((ing?.attenuation || yeast.attenuation || 0.75)*100)}% · ${ing?.esters || yeast.esters || '?'}</span>
      `;
      btn.onclick = () => game.selectYeast(yeast.name);
      selector.appendChild(btn);
    });
    
    const tempIdeal = document.getElementById('ferment-temp-ideal');
    const timeIdeal = document.getElementById('ferment-time-ideal');
    if (tempIdeal) tempIdeal.textContent = `建议: ${style.fermentTemp.min}-${style.fermentTemp.max}°C`;
    if (timeIdeal) timeIdeal.textContent = `建议: ${style.fermentTime.min}-${style.fermentTime.max}天`;
    
    const tempSlider = document.getElementById('ferment-temp');
    const timeSlider = document.getElementById('ferment-time');
    if (tempSlider) {
      tempSlider.value = style.fermentTemp.ideal;
      tempSlider.oninput = (e) => {
        document.getElementById('ferment-temp-val').textContent = e.target.value;
        game.state.fermentTemp = parseFloat(e.target.value);
        game.checkWarnings();
      };
    }
    if (timeSlider) {
      timeSlider.value = style.fermentTime.ideal;
      timeSlider.oninput = (e) => {
        document.getElementById('ferment-time-val').textContent = e.target.value;
        game.state.fermentTime = parseInt(e.target.value);
      };
    }
    
    game.state.fermentTemp = style.fermentTemp.ideal;
    game.state.fermentTime = style.fermentTime.ideal;
    game.state.selectedYeast = style.yeasts[0]?.name || '';
  },
  
  // 渲染增味步骤
  renderFlavorStep(style) {
    const selector = document.getElementById('flavor-selector');
    const selected = document.getElementById('selected-flavors');
    if (!selector) return;
    
    selector.innerHTML = '';
    selected.innerHTML = '';
    
    const allFlavors = [
      { name: '香菜籽', category: '香料' },
      { name: '橙皮', category: '香料' },
      { name: '咖啡', category: '增味' },
      { name: '香草', category: '增味' },
      { name: '椰子', category: '增味' },
      { name: '覆盆子', category: '水果' },
      { name: '樱桃', category: '水果' },
      { name: '百香果', category: '水果' },
      { name: '桃子', category: '水果' },
      { name: '橡木片', category: '陈酿' },
      { name: '波本桶', category: '陈酿' },
      { name: '海盐', category: '调味' }
    ];
    
    // 过滤掉不适合当前风格的
    const optional = style.optional || [];
    allFlavors.forEach(flavor => {
      const isRecommended = optional.some(o => flavor.name.includes(o) || o.includes(flavor.name));
      const btn = document.createElement('button');
      btn.className = 'ingredient-btn';
      if (isRecommended) btn.classList.add('selected');
      btn.innerHTML = `
        <span class="ing-name">${flavor.name}</span>
        <span class="ing-meta">${flavor.category}${isRecommended ? ' · 推荐' : ''}</span>
      `;
      btn.onclick = () => game.toggleFlavor(flavor.name);
      selector.appendChild(btn);
    });
    
    const timeIdeal = document.getElementById('condition-time-ideal');
    if (timeIdeal) timeIdeal.textContent = '建议: 7-30天';
    
    const timeSlider = document.getElementById('condition-time');
    if (timeSlider) {
      timeSlider.value = 7;
      timeSlider.oninput = (e) => {
        document.getElementById('condition-time-val').textContent = e.target.value;
        game.state.conditionTime = parseInt(e.target.value);
      };
    }
    
    game.state.conditionTime = 7;
    game.state.selectedFlavors = [];
  },
  
  // 更新已选增味显示
  updateSelectedFlavors() {
    const container = document.getElementById('selected-flavors');
    if (!container) return;
    
    container.innerHTML = '';
    game.state.selectedFlavors.forEach(flavor => {
      const tag = document.createElement('span');
      tag.className = 'selected-tag';
      tag.innerHTML = `${flavor.name} <span class="remove" onclick="game.removeFlavor('${flavor.name}')">×</span>`;
      container.appendChild(tag);
    });
  },
  
  // 更新步骤指示器
  updateStepIndicator(step) {
    const steps = document.querySelectorAll('.step-indicator .step');
    steps.forEach((s, i) => {
      s.classList.remove('active', 'completed');
      if (i < step) s.classList.add('completed');
      if (i === step) s.classList.add('active');
    });
  },
  
  // 显示酿酒师气泡
  showBubble(text, type = 'tip') {
    const bubble = document.getElementById('brewer-bubble');
    const avatar = document.getElementById('bubble-avatar');
    const textEl = document.getElementById('bubble-text');
    if (!bubble) return;
    
    bubble.className = 'brewer-bubble show';
    if (type === 'warning') bubble.classList.add('warning');
    if (type === 'success') bubble.classList.add('success');
    
    if (game.state.brewer) {
      avatar.textContent = game.state.brewer.avatar;
    }
    textEl.textContent = text;
    
    // 8秒后自动消失（给用户足够时间阅读）
    clearTimeout(this.bubbleTimer);
    this.bubbleTimer = setTimeout(() => this.hideBubble(), 8000);
  },
  
  // 隐藏气泡
  hideBubble() {
    const bubble = document.getElementById('brewer-bubble');
    if (bubble) bubble.classList.remove('show', 'warning', 'success');
  },
  
  // 渲染结果页
  renderResult(style, actual, score) {
    // 啤酒颜色
    const liquid = document.getElementById('beer-liquid');
    if (liquid) {
      liquid.style.background = `linear-gradient(180deg, ${BrewLogic.srmToColor(actual.srm)} 0%, ${BrewLogic.srmToColor(actual.srm * 0.8)} 100%)`;
    }
    
    // 分数
    const bigScore = document.getElementById('big-score');
    const scoreBadge = document.getElementById('score-badge');
    if (bigScore) bigScore.textContent = score.total;
    if (scoreBadge) {
      scoreBadge.textContent = `${score.rating.emoji} ${score.rating.level}`;
      scoreBadge.style.background = score.rating.color;
    }
    
    // 参数对比
    const params = ['og', 'fg', 'ibu', 'srm', 'abv'];
    const maxVals = { og: 1.12, fg: 1.04, ibu: 100, srm: 40, abv: 12 };
    
    params.forEach(param => {
      const targetEl = document.getElementById(`${param}-target`);
      const actualEl = document.getElementById(`${param}-actual`);
      const valEl = document.getElementById(`${param}-val`);
      
      if (targetEl && actualEl && valEl) {
        const min = style[param].min;
        const max = style[param].max;
        const target = style[param].target || (min + max) / 2;
        const act = actual[param];
        const maxVal = maxVals[param];
        
        // 目标范围条
        const targetLeft = (min / maxVal) * 100;
        const targetWidth = ((max - min) / maxVal) * 100;
        targetEl.style.left = `${targetLeft}%`;
        targetEl.style.width = `${targetWidth}%`;
        
        // 实际值条
        const actualWidth = Math.min((act / maxVal) * 100, 100);
        actualEl.style.width = `${actualWidth}%`;
        
        // 数值显示
        const precision = param === 'og' || param === 'fg' ? 3 : (param === 'abv' ? 1 : 0);
        valEl.textContent = `${act.toFixed(precision)} (目标${min}-${max})`;
      }
    });
    
    // 酿酒师评语
    const comment = document.getElementById('brewer-comment');
    if (comment) {
      comment.innerHTML = `<strong>${game.state.brewer?.name || '酿酒师'}说：</strong><br><br>${BrewLogic.generateComment(style, score, actual).replace(/\n/g, '<br>')}`;
    }
  },
  
  // 渲染酒窖
  renderGallery() {
    const grid = document.getElementById('gallery-grid');
    const actions = document.getElementById('gallery-actions');
    if (!grid) return;
    
    const history = JSON.parse(localStorage.getItem('brewmaster_history') || '[]');
    const selectMode = game.state.gallerySelectMode;
    const selected = game.state.gallerySelected;
    
    // 显示/隐藏操作栏
    if (actions) {
      actions.style.display = history.length > 0 ? 'flex' : 'none';
    }
    
    // 更新操作栏按钮
    if (actions) {
      if (selectMode && selected.length > 0) {
        actions.innerHTML = `
          <button class="btn-action" onclick="game.toggleGallerySelect()">
            <span>✓ 完成</span>
          </button>
          <button class="btn-action btn-action-danger" onclick="game.deleteSelectedGallery()">
            <span>🗑 删除(${selected.length})</span>
          </button>
        `;
      } else {
        actions.innerHTML = `
          <button class="btn-action" onclick="game.toggleGallerySelect()">
            <span>${selectMode ? '✓ 完成' : '✓ 多选'}</span>
          </button>
          <button class="btn-action btn-action-danger" onclick="game.clearGallery()">
            <span>🗑 清空</span>
          </button>
        `;
      }
    }
    
    if (history.length === 0) {
      grid.innerHTML = '<p class="empty-hint">还没有酿造记录，快去酿一杯吧！</p>';
      return;
    }
    
    grid.innerHTML = '';
    history.slice().reverse().forEach(beer => {
      const isSelected = selected.includes(beer.id);
      const item = document.createElement('div');
      item.className = `gallery-item ${selectMode ? 'selectable' : ''} ${isSelected ? 'selected' : ''}`;
      
      if (selectMode) {
        item.onclick = () => game.toggleGalleryItem(beer.id);
      }
      
      item.innerHTML = `
        ${selectMode ? `<div class="gallery-checkbox">${isSelected ? '✓' : ''}</div>` : ''}
        <div class="gallery-beer">🍀🍺</div>
        <div class="gallery-name">${beer.name || '未命名'}</div>
        <div class="gallery-style">${beer.styleName || '?'}</div>
        <div class="gallery-score">${beer.score}分</div>
        ${!selectMode ? `
          <div class="gallery-actions-inline">
            <button class="gallery-btn-small" onclick="event.stopPropagation(); game.renameGalleryItem(${beer.id})">✏️ 重命名</button>
          </div>
        ` : ''}
      `;
      grid.appendChild(item);
    });
  }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UI;
}
