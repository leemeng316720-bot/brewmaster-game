// ===== 游戏主逻辑 =====

const game = {
  // 游戏状态
  state: {
    currentPage: 'cover',
    currentMode: null, // 'apprentice', 'exam', 'bar', null=经典模式
    selectedFamily: null,
    selectedStyle: null,
    brewer: null,
    step: 0,
    
    // 糖化
    selectedMalts: [],
    mashTemp: 65,
    mashTime: 60,
    
    // 煮沸
    selectedHops: [],
    boilTime: 60,
    
    // 发酵
    selectedYeast: '',
    fermentTemp: 18,
    fermentTime: 14,
    
    // 增味
    selectedFlavors: [],
    conditionTime: 7,
    
    // 结果
    result: null,
    
    // 考试模式状态
    exam: {
      level: 1,
      streak: 0,
      bestStreak: 0,
      currentQuestion: null,
      questionCount: 0
    },
    
    // 酒吧推荐模式状态
    bar: {
      level: 1,
      streak: 0,
      bestStreak: 0,
      currentCustomer: null,
      customerCount: 0,
      totalTips: 0
    },
    
    // PWA安装提示
    installPrompt: null,
    
    // 酒窖选择模式
    gallerySelectMode: false,
    gallerySelected: []
  },
  
  // ===== 模式选择 =====
  selectMode(mode) {
    this.state.currentMode = mode;
    
    if (mode === 'apprentice') {
      this.toPage('apprentice');
      UI.renderApprenticeMode();
    } else if (mode === 'exam') {
      this.toPage('exam');
      this.loadExamStats();
    } else if (mode === 'bar') {
      this.toPage('bar');
      this.loadBarStats();
    }
  },
  
  // ===== 页面切换 =====
  toPage(pageId) {
    // 播放页面切换音效
    Sound.playClick();
    
    // 隐藏所有页面
    document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
    
    // 显示目标页面
    const target = document.getElementById(`page-${pageId}`);
    if (target) {
      target.classList.add('active');
      this.state.currentPage = pageId;
    }
    
    // 页面特定初始化
    if (pageId === 'style-select') {
      UI.renderStyleGrid();
    } else if (pageId === 'gallery') {
      UI.renderGallery();
    } else if (pageId === 'brewing') {
      this.initBrewing();
    } else if (pageId === 'apprentice') {
      UI.renderApprenticeMode();
    } else if (pageId === 'exam') {
      this.loadExamStats();
    } else if (pageId === 'bar') {
      this.loadBarStats();
    }
    
    // 滚动到顶部
    window.scrollTo(0, 0);
  },
  
  // ===== 学徒模式 =====
  getApprenticeProgress() {
    const unlocked = JSON.parse(localStorage.getItem('brewmaster_unlocked') || '[]');
    const completed = JSON.parse(localStorage.getItem('brewmaster_completed') || '[]');
    
    // 所有风格按难度排序
    const allStyles = [];
    const difficultyOrder = ['american', 'german', 'czech', 'british', 'belgian', 'sour'];
    
    difficultyOrder.forEach(family => {
      const fam = BJCP_STYLES[family];
      if (fam) {
        fam.styles.forEach((style, idx) => {
          allStyles.push({
            family,
            style,
            difficulty: difficultyOrder.indexOf(family),
            index: allStyles.length
          });
        });
      }
    });
    
    return { allStyles, unlocked, completed };
  },
  
  unlockStyle(styleId) {
    const unlocked = JSON.parse(localStorage.getItem('brewmaster_unlocked') || '[]');
    if (!unlocked.includes(styleId)) {
      unlocked.push(styleId);
      localStorage.setItem('brewmaster_unlocked', JSON.stringify(unlocked));
    }
  },
  
  completeStyle(styleId, score) {
    const completed = JSON.parse(localStorage.getItem('brewmaster_completed') || '[]');
    const existing = completed.find(c => c.styleId === styleId);
    if (existing) {
      if (score > existing.score) existing.score = score;
    } else {
      completed.push({ styleId, score, date: new Date().toISOString() });
    }
    localStorage.setItem('brewmaster_completed', JSON.stringify(completed));
    
    // 解锁下一个
    const { allStyles } = this.getApprenticeProgress();
    const currentIdx = allStyles.findIndex(s => s.style.id === styleId);
    if (currentIdx >= 0 && currentIdx < allStyles.length - 1) {
      const next = allStyles[currentIdx + 1];
      this.unlockStyle(next.style.id);
    }
  },
  
  startApprenticeBrew(family, style) {
    this.state.selectedFamily = family;
    this.state.selectedStyle = style;
    this.state.currentMode = 'apprentice';
    
    // 使用对应流派的酿酒师
    const famData = BJCP_STYLES[family];
    this.state.brewer = famData?.brewer || { name: '酿酒师', avatar: '🍺', catchphrase: '开始酿造吧！' };
    
    this.state.step = 0;
    this.resetBrewState();
    this.toPage('brewing');
  },
  
  // ===== BJCP考试模式 =====
  loadExamStats() {
    const stats = JSON.parse(localStorage.getItem('brewmaster_exam') || '{"level":1,"bestStreak":0}');
    this.state.exam.level = stats.level || 1;
    this.state.exam.bestStreak = stats.bestStreak || 0;
    this.state.exam.streak = 0;
    
    document.getElementById('exam-level').textContent = this.state.exam.level;
    document.getElementById('exam-streak').textContent = 0;
    document.getElementById('exam-best').textContent = this.state.exam.bestStreak;
  },
  
  saveExamStats() {
    localStorage.setItem('brewmaster_exam', JSON.stringify({
      level: this.state.exam.level,
      bestStreak: this.state.exam.bestStreak
    }));
  },
  
  startExam() {
    Sound.playClick();
    this.state.exam.questionCount = 0;
    this.state.exam.streak = 0;
    this.nextExamQuestion();
  },
  
  nextExamQuestion() {
    Sound.playClick();
    const { allStyles } = this.getApprenticeProgress();
    if (allStyles.length === 0) return;
    
    // 根据等级选择难度
    const level = this.state.exam.level;
    const poolSize = Math.min(3 + level, allStyles.length);
    const pool = allStyles.slice(0, poolSize);
    
    // 随机选1个正确答案
    const correct = pool[Math.floor(Math.random() * pool.length)];
    
    // 生成3个干扰项（不同风格）
    const distractors = [];
    const used = new Set([correct.style.id]);
    while (distractors.length < 3) {
      const candidate = allStyles[Math.floor(Math.random() * allStyles.length)];
      if (!used.has(candidate.style.id)) {
        used.add(candidate.style.id);
        distractors.push(candidate);
      }
    }
    
    // 组合并打乱
    const options = [correct, ...distractors].sort(() => Math.random() - 0.5);
    
    this.state.exam.currentQuestion = { correct, options };
    this.state.exam.questionCount++;
    
    // 显示题目
    document.getElementById('exam-intro').style.display = 'none';
    document.getElementById('exam-question').style.display = 'block';
    document.getElementById('question-number').textContent = `第 ${this.state.exam.questionCount} 题`;
    document.getElementById('btn-next-question').style.display = 'none';
    document.getElementById('exam-feedback').style.display = 'none';
    document.getElementById('exam-feedback').className = 'exam-feedback';
    
    // 显示线索
    const style = correct.style;
    const paramsEl = document.getElementById('clue-params');
    paramsEl.innerHTML = `
      <span class="clue-param">OG（初始比重）${style.og.min}-${style.og.max}</span>
      <span class="clue-param">IBU（苦度）${style.ibu.min}-${style.ibu.max}</span>
      <span class="clue-param">ABV（酒精度）${style.abv.min}-${style.abv.max}%</span>
      <span class="clue-param">SRM（色度）${style.srm.min}-${style.srm.max}</span>
    `;
    
    // 生成丰富的描述线索
    const hints = this.generateExamHints(style);
    // 根据等级决定提示数量：等级1给4-5个提示，等级越高提示越少
    const hintCount = Math.max(3, 5 - Math.floor(this.state.exam.level / 3));
    const selectedHints = hints.sort(() => Math.random() - 0.5).slice(0, hintCount);
    document.getElementById('clue-desc').innerHTML = selectedHints.join('<br>');
    
    // 显示选项
    const optionsEl = document.getElementById('answer-options');
    optionsEl.innerHTML = '';
    options.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'answer-btn';
      btn.innerHTML = `<strong>${opt.style.name}</strong><br><span style="font-size:12px;color:rgba(255,248,225,0.6)">${opt.style.nameEn}</span>`;
      btn.onclick = () => this.answerExam(idx);
      optionsEl.appendChild(btn);
    });
    
    window.scrollTo(0, 0);
  },
  
  // 生成考试模式丰富的提示线索
  generateExamHints(style) {
    const hints = [];
    const avgSRM = (style.srm.min + style.srm.max) / 2;
    const avgIBU = (style.ibu.min + style.ibu.max) / 2;
    const avgOG = (style.og.min + style.og.max) / 2;
    const avgABV = (style.abv.min + style.abv.max) / 2;
    
    // 1. 基础参数提示（保留原有）
    hints.push(`这款啤酒的酒精度${avgABV > 7 ? '较高' : avgABV < 4 ? '较低' : '适中'}，约${style.abv.min}-${style.abv.max}%（ABV）。`);
    hints.push(`颜色呈${BrewLogic.srmToColorName(avgSRM)}，SRM（色度）范围${style.srm.min}-${style.srm.max}。`);
    hints.push(`苦度${avgIBU > 50 ? '很高' : avgIBU > 30 ? '中等偏高' : avgIBU > 15 ? '中等' : '较低'}，IBU（苦度值）范围${style.ibu.min}-${style.ibu.max}。`);
    
    // 2. 酒体与口感（从OG/FG推断）
    const bodyDesc = avgOG > 1.07 ? '酒体厚重饱满，口感浓郁' : avgOG > 1.05 ? '酒体中等偏饱满' : avgOG > 1.04 ? '酒体中等' : '酒体轻盈清爽';
    const dryness = style.fg.max < 1.01 ? '收口非常干爽' : style.fg.max < 1.014 ? '收口较干爽' : style.fg.max < 1.02 ? '收口略带甜味' : '收口有明显甜感';
    hints.push(`${bodyDesc}，${dryness}。`);
    
    // 3. 酒花风味（从hops数据提取）
    if (style.hops && style.hops.length > 0) {
      const hopNames = style.hops.map(h => h.name).slice(0, 3);
      const aromaHops = style.hops.filter(h => h.type === 'aroma' || h.type === 'dual');
      const bitterHops = style.hops.filter(h => h.type === 'bittering');
      
      if (aromaHops.length > 0 && bitterHops.length === 0) {
        hints.push(`以香气型酒花为主，突出酒花芳香，常用${hopNames.join('、')}等。`);
      } else if (bitterHops.length > 0 && aromaHops.length === 0) {
        hints.push(`以苦味型酒花为主，苦味清晰直接。`);
      } else if (aromaHops.length > 0 && bitterHops.length > 0) {
        hints.push(`苦香平衡，既有苦味支撑又有香气表达，使用${hopNames.join('、')}等酒花。`);
      } else {
        hints.push(`使用${hopNames.join('、')}等酒花。`);
      }
      
      // 酒花产地线索
      const regions = [...new Set(style.hops.map(h => h.region).filter(r => r))];
      if (regions.length === 1) {
        hints.push(`酒花主要来自${regions[0]}。`);
      } else if (regions.length > 1) {
        hints.push(`酒花来自${regions.slice(0, 2).join('和')}等地。`);
      }
    }
    
    // 4. 酵母与香气特征
    if (style.yeasts && style.yeasts.length > 0) {
      const yeast = style.yeasts[0];
      hints.push(`使用${yeast.name}发酵，发酵温度${style.fermentTemp.min}-${style.fermentTemp.max}°C。`);
      if (yeast.esters) {
        hints.push(`发酵带来${yeast.esters}等酯香特征。`);
      }
    }
    
    // 5. 麦芽特征
    if (style.malts && style.malts.length > 0) {
      const maltNames = style.malts.filter(m => m.default).map(m => m.name);
      if (maltNames.length > 0) {
        const hasWheat = maltNames.some(m => m.includes('小麦'));
        const hasDark = maltNames.some(m => {
          const ing = INGREDIENTS.malts[m.name] || { color: m.color || 2 };
          return (ing.color || m.color || 2) > 40;
        });
        if (hasWheat) {
          hints.push(`配方中含有小麦麦芽，带来独特的口感和浑浊度。`);
        }
        if (hasDark) {
          hints.push(`使用深色麦芽，带来烘烤/焦糖风味。`);
        }
        if (!hasWheat && !hasDark) {
          hints.push(`以基础麦芽为主，突出原料本身的纯净风味。`);
        }
      }
    }
    
    // 6. 特殊添加物
    if (style.optional && style.optional.length > 0) {
      const opts = style.optional.slice(0, 2);
      hints.push(`可以尝试添加${opts.join('、')}等增味原料。`);
    }
    
    // 7. 风格描述关键词（从description提取）
    if (style.description) {
      const desc = style.description;
      // 提取描述中的风味关键词
      const flavorKeywords = [];
      if (desc.includes('酒花') || desc.includes('苦') || desc.includes('IPA')) flavorKeywords.push('酒花特征突出');
      if (desc.includes('麦芽') || desc.includes('甜') || desc.includes('焦糖')) flavorKeywords.push('麦芽风味主导');
      if (desc.includes('酵母') || desc.includes('酯') || desc.includes('香')) flavorKeywords.push('酵母酯香丰富');
      if (desc.includes('清爽') || desc.includes('干净') || desc.includes(' crisp')) flavorKeywords.push('口感清爽干净');
      if (desc.includes('浓郁') || desc.includes('厚重') || desc.includes('饱满')) flavorKeywords.push('风味浓郁饱满');
      if (desc.includes('酸') || desc.includes('野菌') || desc.includes('funk')) flavorKeywords.push('带有酸味或野菌特征');
      if (desc.includes('烟熏') || desc.includes('培根')) flavorKeywords.push('带有独特的烟熏风味');
      if (desc.includes('香料') || desc.includes('香菜') || desc.includes('橙皮')) flavorKeywords.push('带有香料风味');
      
      if (flavorKeywords.length > 0) {
        hints.push(`风味特征：${flavorKeywords.slice(0, 2).join('，')}。`);
      }
    }
    
    // 8. 发酵时间线索
    if (style.fermentTime && style.fermentTime.min > 20) {
      hints.push(`需要长时间发酵/陈酿（${style.fermentTime.min}-${style.fermentTime.max}天），适合耐心等待。`);
    }
    
    // 9. 拉格vs艾尔线索
    if (style.fermentTemp && style.fermentTemp.max <= 14) {
      hints.push(`低温发酵（${style.fermentTemp.min}-${style.fermentTemp.max}°C），属于拉格类型。`);
    } else if (style.fermentTemp && style.fermentTemp.min >= 18) {
      hints.push(`中高温发酵（${style.fermentTemp.min}-${style.fermentTemp.max}°C），属于艾尔类型。`);
    }
    
    return hints;
  },
  
  answerExam(selectedIdx) {
    const question = this.state.exam.currentQuestion;
    if (!question) return;
    
    const correctIdx = question.options.findIndex(o => o.style.id === question.correct.style.id);
    const isCorrect = selectedIdx === correctIdx;
    
    // 禁用所有按钮
    document.querySelectorAll('.answer-btn').forEach((btn, idx) => {
      btn.classList.add('disabled');
      if (idx === correctIdx) btn.classList.add('correct');
      else if (idx === selectedIdx && !isCorrect) btn.classList.add('wrong');
    });
    
    // 显示反馈
    const feedback = document.getElementById('exam-feedback');
    feedback.style.display = 'block';
    
    if (isCorrect) {
      Sound.playSuccess();
      this.state.exam.streak++;
      if (this.state.exam.streak > this.state.exam.bestStreak) {
        this.state.exam.bestStreak = this.state.exam.streak;
      }
      
      // 升级检查
      if (this.state.exam.streak >= this.state.exam.level * 3) {
        this.state.exam.level++;
        feedback.className = 'exam-feedback correct';
        feedback.innerHTML = `🎉 回答正确！<br>连胜 ${this.state.exam.streak} 次！<br><strong>升级到等级 ${this.state.exam.level}！</strong>`;
      } else {
        feedback.className = 'exam-feedback correct';
        feedback.innerHTML = `✅ 回答正确！<br>连胜 ${this.state.exam.streak} 次`;
      }
    } else {
      Sound.playWarning();
      this.state.exam.streak = 0;
      feedback.className = 'exam-feedback wrong';
      feedback.innerHTML = `❌ 回答错误！<br>正确答案是：<strong>${question.correct.style.name}</strong><br>连胜重置`;
    }
    
    // 更新统计
    document.getElementById('exam-streak').textContent = this.state.exam.streak;
    document.getElementById('exam-level').textContent = this.state.exam.level;
    document.getElementById('exam-best').textContent = this.state.exam.bestStreak;
    this.saveExamStats();
    
    // 显示下一题按钮
    document.getElementById('btn-next-question').style.display = 'block';
  },
  
  // ===== 酒吧推荐模式 =====
  loadBarStats() {
    const stats = JSON.parse(localStorage.getItem('brewmaster_bar') || '{"level":1,"bestStreak":0,"totalTips":0}');
    this.state.bar.level = stats.level || 1;
    this.state.bar.bestStreak = stats.bestStreak || 0;
    this.state.bar.totalTips = stats.totalTips || 0;
    this.state.bar.streak = 0;
    
    document.getElementById('bar-level').textContent = this.state.bar.level;
    document.getElementById('bar-streak').textContent = 0;
    document.getElementById('bar-best').textContent = this.state.bar.bestStreak;
    document.getElementById('bar-tips').textContent = this.state.bar.totalTips;
  },
  
  saveBarStats() {
    localStorage.setItem('brewmaster_bar', JSON.stringify({
      level: this.state.bar.level,
      bestStreak: this.state.bar.bestStreak,
      totalTips: this.state.bar.totalTips
    }));
  },
  
  startBarMode() {
    Sound.playClick();
    this.state.bar.customerCount = 0;
    this.state.bar.streak = 0;
    this.nextBarCustomer();
  },
  
  nextBarCustomer() {
    Sound.playClick();
    const { allStyles } = this.getApprenticeProgress();
    if (allStyles.length === 0) return;
    
    // 根据等级选择难度
    const level = this.state.bar.level;
    const poolSize = Math.min(4 + level * 2, allStyles.length);
    const pool = allStyles.slice(0, poolSize);
    
    // 随机生成客人偏好（确保偏好一致且有合理答案）
    const customer = this.generateCustomerRequest(pool);
    
    // 计算每个风格的匹配度（用于确定最佳答案和显示匹配度）
    const matches = pool.map(item => ({
      ...item,
      matchScore: this.calculateBarMatch(item.style, customer)
    })).sort((a, b) => b.matchScore - a.matchScore);
    
    const bestMatch = matches[0];
    
    // 选择4-6个选项（包含最佳匹配）
    const optionCount = Math.min(4 + Math.floor(level / 2), 8);
    const options = [bestMatch];
    const used = new Set([bestMatch.style.id]);
    
    // 添加一些其他风格作为干扰项（优先选择与最佳匹配差异明显的）
    while (options.length < optionCount && options.length < matches.length) {
      // 从后半部分随机选择（匹配度较低的），增加区分度
      const tailStart = Math.floor(matches.length * 0.3);
      const candidatePool = matches.slice(tailStart);
      const candidate = candidatePool[Math.floor(Math.random() * candidatePool.length)];
      if (!used.has(candidate.style.id)) {
        used.add(candidate.style.id);
        options.push(candidate);
      }
    }
    
    // 打乱选项顺序
    const shuffledOptions = options.sort(() => Math.random() - 0.5);
    
    this.state.bar.currentCustomer = { customer, options: shuffledOptions, bestMatch };
    this.state.bar.customerCount++;
    
    // 显示客人
    document.getElementById('bar-intro').style.display = 'none';
    document.getElementById('bar-question').style.display = 'block';
    document.getElementById('btn-next-customer').style.display = 'none';
    document.getElementById('bar-feedback').style.display = 'none';
    document.getElementById('bar-feedback').className = 'bar-feedback';
    
    // 设置客人信息
    const avatars = ['👨', '👩', '👴', '👵', '👱', '👧', '🧔', '👳', '🧕', '👮', '👷', '💂', '🕵️', '👩‍⚕️', '👨‍🍳', '👩‍🎓', '👨‍💼', '👩‍🔬'];
    const names = ['老张', '小李', '王哥', '刘姐', '陈总', '赵师傅', '孙同学', '周医生', '吴老板', '郑老师', '钱经理', '冯工程师', '何艺术家', '许摄影师', '韩旅行者', '杨作家', '朱程序员', '秦设计师'];
    
    document.getElementById('customer-avatar').textContent = avatars[Math.floor(Math.random() * avatars.length)];
    document.getElementById('customer-name').textContent = names[Math.floor(Math.random() * names.length)];
    
    // 构建客人请求文本
    let requestText = '';
    if (customer.mood === 'happy') requestText = '今天心情不错，想喝一杯！';
    else if (customer.mood === 'tired') requestText = '工作累了，想放松一下。';
    else if (customer.mood === 'celebrating') requestText = '今天有好事，想庆祝一下！';
    else if (customer.mood === 'curious') requestText = '听说你们这里有特色酒，想试试。';
    else requestText = '随便看看，有什么推荐的吗？';
    
    document.getElementById('customer-request').textContent = requestText;
    
    // 显示偏好标签
    const prefEl = document.getElementById('customer-preferences');
    prefEl.innerHTML = customer.preferences.map(p => `<span class="pref-tag">${p}</span>`).join('');
    
    // 显示酒单
    const menuEl = document.getElementById('menu-list');
    menuEl.innerHTML = '';
    shuffledOptions.forEach((opt, idx) => {
      const btn = document.createElement('button');
      btn.className = 'menu-item';
      const family = BJCP_STYLES[opt.family];
      btn.innerHTML = `
        <div class="menu-item-header">
          <span class="menu-emoji">${family?.emoji || '🍺'}</span>
          <div class="menu-item-info">
            <div class="menu-item-name">${opt.style.name}</div>
            <div class="menu-item-en">${opt.style.nameEn}</div>
          </div>
        </div>
        <div class="menu-item-params">
          <span>ABV ${opt.style.abv.min}-${opt.style.abv.max}%</span>
          <span>IBU ${opt.style.ibu.min}-${opt.style.ibu.max}</span>
          <span>SRM ${opt.style.srm.min}-${opt.style.srm.max}</span>
        </div>
      `;
      btn.onclick = () => this.answerBar(idx);
      menuEl.appendChild(btn);
    });
    
    window.scrollTo(0, 0);
  },
  
  // 风格特征标签提取（用于准确匹配）
  getStyleTags(style) {
    const tags = new Set();
    
    // 颜色标签
    const avgSRM = (style.srm.min + style.srm.max) / 2;
    if (avgSRM <= 5) tags.add('颜色很浅');
    else if (avgSRM <= 10) tags.add('颜色浅');
    else if (avgSRM <= 15) tags.add('颜色中等');
    else if (avgSRM <= 25) tags.add('颜色深');
    else tags.add('颜色很深');
    if (style.srm.min >= 20) tags.add('黑啤');
    if (style.srm.max <= 8) tags.add('浅色');
    
    // 苦度标签
    const avgIBU = (style.ibu.min + style.ibu.max) / 2;
    if (avgIBU <= 15) tags.add('不苦');
    else if (avgIBU <= 25) tags.add('微苦');
    else if (avgIBU <= 40) tags.add('中等苦度');
    else if (avgIBU <= 60) tags.add('较苦');
    else tags.add('很苦');
    if (style.ibu.max <= 20) tags.add('低苦味');
    if (style.ibu.min >= 30) tags.add('高苦味');
    
    // 酒精度标签
    const avgABV = (style.abv.min + style.abv.max) / 2;
    if (avgABV <= 4.5) tags.add('低酒精');
    else if (avgABV <= 6) tags.add('中等酒精');
    else if (avgABV <= 8) tags.add('较高酒精');
    else tags.add('高酒精');
    if (style.abv.max <= 5) tags.add('低度');
    if (style.abv.min >= 6) tags.add('烈性');
    
    // 酒花特征标签（基于酒花类型和描述）
    const hopAroma = style.hops?.filter(h => h.type === 'aroma' || h.type === 'dual').length || 0;
    const hopBittering = style.hops?.filter(h => h.type === 'bittering').length || 0;
    const hasUSNewWorld = style.hops?.some(h => ['美国','澳大利亚','新西兰'].includes(h.region));
    const hasNoble = style.hops?.some(h => ['德国','捷克','斯洛文尼亚'].includes(h.region));
    
    if (hasUSNewWorld && hopAroma >= 2) tags.add('酒花香气');
    if (hasUSNewWorld && hopBittering >= 1 && style.ibu.min >= 40) tags.add('酒花主导');
    if (hasNoble && hopAroma >= 1 && style.ibu.max <= 40) tags.add('优雅酒花');
    if (style.hops?.length === 1 || (hopAroma === 0 && hopBittering === 1)) tags.add('低酒花');
    
    // 麦芽特征标签
    const hasCaramelMalt = style.malts?.some(m => m.name.includes('焦糖') && m.default);
    const hasMunichMalt = style.malts?.some(m => m.name.includes('慕尼黑') && m.default);
    const hasDarkMalt = style.malts?.some(m => (m.name.includes('巧克力') || m.name.includes('烘烤') || m.name.includes('黑麦')) && m.default);
    const hasWheatMalt = style.malts?.some(m => m.name.includes('小麦') && m.default);
    const hasOats = style.malts?.some(m => m.name.includes('燕麦') && m.default);
    
    if (hasCaramelMalt || hasMunichMalt) tags.add('麦芽甜味');
    if (hasDarkMalt) tags.add('烘烤风味');
    if (hasWheatMalt) tags.add('小麦啤酒');
    if (hasOats) tags.add('燕麦口感');
    if (hasMunichMalt) tags.add('慕尼黑麦芽');
    
    // 酵母/发酵特征标签
    const esters = style.yeasts?.map(y => y.esters || '').join('') || '';
    if (esters.includes('香蕉') || esters.includes('丁香')) tags.add('香蕉丁香');
    if (esters.includes('辛香')) tags.add('辛香');
    if (esters.includes('果香') || esters.includes('核果') || esters.includes('柑橘')) tags.add('果香');
    if (esters.includes('干净')) tags.add('干净');
    if (esters.includes('农舍') || esters.includes('皮革')) tags.add('野菌');
    if (esters.includes('乳酸')) tags.add('乳酸');
    
    // 拉格/艾尔标签
    if (style.fermentTemp?.max <= 14) tags.add('拉格');
    else if (style.fermentTemp?.min >= 15) tags.add('艾尔');
    
    // 口感标签
    const avgFG = (style.fg?.min + style.fg?.max) / 2 || 1.012;
    if (avgFG <= 1.010) tags.add('干爽');
    if (avgFG >= 1.014) tags.add('微甜');
    const avgOG = (style.og?.min + style.og?.max) / 2 || 1.050;
    if (avgOG >= 1.060) tags.add('浓郁');
    if (avgOG <= 1.045) tags.add('轻盈');
    if (style.description?.includes('清爽')) tags.add('清爽');
    if (style.description?.includes('浑浊')) tags.add('浑浊');
    if (style.description?.includes('丝滑')) tags.add('丝滑');
    
    // 场景标签
    // 适合夏天：低酒精(<=6.0)且颜色不太深，或中高酒精(<=7.5)但苦度较高(>=20)或描述清爽，且颜色不太深(SRM<=14)
    if (((style.abv?.max <= 6.0) || (style.abv?.max <= 7.5 && (avgIBU >= 20 || style.description?.includes('清爽')))) && avgSRM <= 14) tags.add('适合夏天');
    if ((style.abv?.min >= 6 || avgSRM >= 15 || style.description?.includes('温暖')) && style.abv?.max >= 5) tags.add('适合冬天');
    if (avgIBU >= 15 && avgIBU <= 45 && style.abv?.max <= 6.5) tags.add('适合配餐');
    if (style.abv?.min >= 7 || style.description?.includes('复杂')) tags.add('适合独饮');
    
    // 酸啤标签
    if (style.description?.includes('酸') || style.id?.startsWith('23') || esters.includes('乳酸')) tags.add('酸味');
    if (style.description?.includes('野菌') || esters.includes('农舍')) tags.add('野菌');
    
    // 特殊成分
    if (style.optional?.includes('香菜籽')) tags.add('香料');
    if (style.optional?.includes('海盐')) tags.add('咸味');
    if (style.optional?.includes('咖啡')) tags.add('咖啡');
    
    return tags;
  },
  
  generateCustomerRequest(pool) {
    // 为池中的每个风格提取标签
    const poolWithTags = pool.map(item => ({
      ...item,
      tags: this.getStyleTags(item.style)
    }));
    
    // 定义所有可能的偏好，每个偏好映射到一组标签
    const allPrefs = [
      // 颜色偏好
      { label: '颜色浅一点', tags: ['颜色很浅', '颜色浅', '浅色'], antiTags: ['颜色深', '颜色很深', '黑啤'], weight: 1.5 },
      { label: '颜色深一些', tags: ['颜色深', '颜色很深'], antiTags: ['颜色很浅', '颜色浅', '浅色'], weight: 1.2 },
      { label: '不要黑色的', tags: ['颜色很浅', '颜色浅', '颜色中等', '浅色'], antiTags: ['颜色很深', '黑啤'], weight: 1.0 },
      { label: '喜欢黑啤', tags: ['黑啤', '颜色很深'], antiTags: ['颜色很浅', '颜色浅', '浅色'], weight: 1.5 },
      
      // 苦度偏好
      { label: '不要太苦', tags: ['不苦', '微苦', '低苦味'], antiTags: ['较苦', '很苦', '高苦味'], weight: 1.2 },
      { label: '喜欢苦味', tags: ['较苦', '很苦', '高苦味'], antiTags: ['不苦', '微苦', '低苦味'], weight: 1.2 },
      { label: '苦度适中', tags: ['微苦', '中等苦度'], antiTags: ['很苦', '不苦'], weight: 1.0 },
      
      // 酒精度偏好
      { label: '酒精度低一点', tags: ['低酒精', '低度'], antiTags: ['较高酒精', '高酒精', '烈性'], weight: 1.0 },
      { label: '想要烈一点的', tags: ['较高酒精', '高酒精', '烈性'], antiTags: ['低酒精', '低度'], weight: 1.2 },
      { label: '适中就好', tags: ['中等酒精', '低度'], antiTags: ['高酒精', '烈性'], weight: 1.0 },
      
      // 风味偏好
      { label: '喜欢酒花香气', tags: ['酒花香气', '酒花主导', '优雅酒花'], antiTags: ['低酒花'], weight: 1.5 },
      { label: '喜欢麦芽甜味', tags: ['麦芽甜味', '慕尼黑麦芽'], antiTags: ['酒花主导'], weight: 1.2 },
      { label: '喜欢清爽口感', tags: ['干爽', '清爽', '轻盈'], antiTags: ['浓郁', '微甜'], weight: 1.0 },
      { label: '喜欢浓郁口感', tags: ['浓郁', '微甜', '高酒精'], antiTags: ['干爽', '轻盈', '低酒精'], weight: 1.2 },
      { label: '喜欢果香', tags: ['果香', '香蕉丁香', '辛香'], antiTags: [], weight: 1.0 },
      { label: '喜欢酸味', tags: ['酸味', '乳酸', '野菌'], antiTags: [], weight: 1.5 },
      { label: '小麦啤酒', tags: ['小麦啤酒'], antiTags: [], weight: 1.5 },
      { label: '拉格类型', tags: ['拉格'], antiTags: ['艾尔'], weight: 1.2 },
      { label: '艾尔类型', tags: ['艾尔'], antiTags: ['拉格'], weight: 1.0 },
      { label: '喜欢烘烤风味', tags: ['烘烤风味', '黑啤'], antiTags: ['颜色很浅', '颜色浅'], weight: 1.2 },
      { label: '喜欢丝滑口感', tags: ['燕麦口感', '丝滑'], antiTags: [], weight: 1.0 },
      
      // 场景偏好
      { label: '适合夏天喝', tags: ['适合夏天', '干爽', '清爽'], antiTags: ['适合冬天', '浓郁'], weight: 1.2 },
      { label: '适合冬天喝', tags: ['适合冬天', '浓郁', '高酒精'], antiTags: ['适合夏天', '干爽'], weight: 1.0 },
      { label: '适合配餐', tags: ['适合配餐'], antiTags: ['高酒精', '烈性'], weight: 1.0 },
      { label: '适合独饮', tags: ['适合独饮', '浓郁', '高酒精'], antiTags: ['低酒精'], weight: 1.0 },
    ];
    
    // 为每个偏好计算池中风格的匹配情况
    const prefStats = allPrefs.map(pref => {
      const matches = poolWithTags.filter(item => 
        pref.tags.some(tag => item.tags.has(tag))
      );
      const antiMatches = poolWithTags.filter(item =>
        pref.antiTags.some(tag => item.tags.has(tag))
      );
      // 可接受的风格 = 有匹配标签但没有反标签
      const acceptable = poolWithTags.filter(item => {
        const hasTag = pref.tags.some(tag => item.tags.has(tag));
        const hasAnti = pref.antiTags.some(tag => item.tags.has(tag));
        return hasTag && !hasAnti;
      });
      return { pref, matches, antiMatches, acceptable, matchCount: acceptable.length };
    });
    
    // 只保留有至少2个可接受风格的偏好（确保选择多样性）
    const validPrefs = prefStats.filter(s => s.matchCount >= 2);
    
    // 如果有效偏好太少，降低门槛到1个
    const usablePrefs = validPrefs.length >= 3 ? validPrefs : prefStats.filter(s => s.matchCount >= 1);
    
    // 随机选择1-3个偏好（确保不冲突）
    let selected = [];
    let selectedTags = new Set();
    let selectedAntiTags = new Set();
    const maxPrefs = 1 + Math.floor(Math.random() * 3); // 1-3个
    
    const shuffled = usablePrefs.sort(() => Math.random() - 0.5);
    
    for (const stat of shuffled) {
      if (selected.length >= maxPrefs) break;
      
      const pref = stat.pref;
      
      // 检查是否与已选偏好冲突
      const hasConflict = pref.tags.some(tag => selectedAntiTags.has(tag)) ||
                         pref.antiTags.some(tag => selectedTags.has(tag)) ||
                         selected.some(s => s.pref.tags.some(t => pref.antiTags.includes(t)) ||
                                           s.pref.antiTags.some(t => pref.tags.includes(t)));
      
      if (!hasConflict) {
        selected.push(stat);
        pref.tags.forEach(t => selectedTags.add(t));
        pref.antiTags.forEach(t => selectedAntiTags.add(t));
      }
    }
    
    // 如果选得太少（<1），放宽条件重新选
    if (selected.length === 0 && usablePrefs.length > 0) {
      selected.push(usablePrefs[0]);
    }
    
    const mood = ['happy', 'tired', 'celebrating', 'curious', 'neutral'][Math.floor(Math.random() * 5)];
    
    return {
      mood,
      preferences: selected.map(s => s.pref.label),
      checks: selected.map(s => (style) => {
        const tags = this.getStyleTags(style);
        const hasMatch = s.pref.tags.some(tag => tags.has(tag));
        const hasAnti = s.pref.antiTags.some(tag => tags.has(tag));
        return hasMatch && !hasAnti;
      }),
      weights: selected.map(s => s.pref.weight || 1.0)
    };
  },
  
  calculateBarMatch(style, customer) {
    let score = 0;
    let totalWeight = 0;
    
    // 根据每个偏好计算匹配度（加权）
    customer.checks.forEach((check, idx) => {
      const weight = customer.weights?.[idx] || 1.0;
      totalWeight += weight;
      if (check(style)) {
        score += weight * 100;  // 匹配得满分
      } else {
        score -= weight * 40;   // 不匹配扣分
      }
    });
    
    // 标准化到0-100
    if (totalWeight > 0) {
      score = score / totalWeight;
    }
    
    // 确保分数在0-100之间
    return Math.max(0, Math.min(100, score));
  },
  
  answerBar(selectedIdx) {
    const customer = this.state.bar.currentCustomer;
    if (!customer) return;
    
    const selected = customer.options[selectedIdx];
    const bestMatch = customer.bestMatch;
    const matchScore = this.calculateBarMatch(selected.style, customer.customer);
    
    const isBest = selected.style.id === bestMatch.style.id;
    const isGood = matchScore >= 70;
    const isOk = matchScore >= 40;
    
    // 禁用所有按钮
    document.querySelectorAll('.menu-item').forEach((btn, idx) => {
      btn.classList.add('disabled');
      if (idx === selectedIdx) btn.classList.add('selected');
      // 标记最佳答案
      const opt = customer.options[idx];
      if (opt.style.id === bestMatch.style.id) {
        btn.classList.add('best-match');
      }
    });
    
    // 显示反馈
    const feedback = document.getElementById('bar-feedback');
    feedback.style.display = 'block';
    
    if (isBest) {
      Sound.playSuccess();
      this.state.bar.streak++;
      if (this.state.bar.streak > this.state.bar.bestStreak) {
        this.state.bar.bestStreak = this.state.bar.streak;
      }
      
      const tip = this.calculateTip(matchScore, true);
      this.state.bar.totalTips += tip;
      
      // 升级检查
      if (this.state.bar.streak >= this.state.bar.level * 3) {
        this.state.bar.level++;
        feedback.className = 'bar-feedback excellent';
        feedback.innerHTML = `
          <div class="feedback-title">🎉 完美推荐！</div>
          <div class="feedback-text">客人非常满意！这就是他/她想要的！</div>
          <div class="match-score">匹配度: ${matchScore}%</div>
          <div class="tip-amount">💰 小费 +${tip}元</div>
          <div class="tip-total">累计收入: ${this.state.bar.totalTips}元</div>
          <div class="level-up">⭐ 升级到调酒师等级 ${this.state.bar.level}！</div>
        `;
      } else {
        feedback.className = 'bar-feedback excellent';
        feedback.innerHTML = `
          <div class="feedback-title">😍 太棒了！</div>
          <div class="feedback-text">客人非常喜欢你的推荐！</div>
          <div class="match-score">匹配度: ${matchScore}%</div>
          <div class="tip-amount">💰 小费 +${tip}元</div>
          <div class="tip-total">累计收入: ${this.state.bar.totalTips}元</div>
          <div class="streak">连续好评 ${this.state.bar.streak} 次！</div>
        `;
      }
    } else if (isGood) {
      Sound.playBubble();
      this.state.bar.streak++;
      if (this.state.bar.streak > this.state.bar.bestStreak) {
        this.state.bar.bestStreak = this.state.bar.streak;
      }
      const tip = this.calculateTip(matchScore, false);
      this.state.bar.totalTips += tip;
      feedback.className = 'bar-feedback good';
      feedback.innerHTML = `
        <div class="feedback-title">😊 不错！</div>
        <div class="feedback-text">客人觉得这款酒还可以，虽然不是最理想的。</div>
        <div class="match-score">匹配度: ${matchScore}%</div>
        <div class="tip-amount">💰 小费 +${tip}元</div>
        <div class="tip-total">累计收入: ${this.state.bar.totalTips}元</div>
        <div class="hint">最佳推荐是 <strong>${bestMatch.style.name}</strong></div>
        <div class="streak">连续好评 ${this.state.bar.streak} 次！</div>
      `;
    } else if (isOk) {
      Sound.playWarning();
      this.state.bar.streak = 0;
      const tip = this.calculateTip(matchScore, false);
      this.state.bar.totalTips += tip;
      feedback.className = 'bar-feedback ok';
      feedback.innerHTML = `
        <div class="feedback-title">😐 一般般</div>
        <div class="feedback-text">客人勉强接受了，但似乎不太满意。</div>
        <div class="match-score">匹配度: ${matchScore}%</div>
        <div class="tip-amount">💰 小费 +${tip}元</div>
        <div class="tip-total">累计收入: ${this.state.bar.totalTips}元</div>
        <div class="hint">最佳推荐是 <strong>${bestMatch.style.name}</strong></div>
      `;
    } else {
      Sound.playWarning();
      this.state.bar.streak = 0;
      const tip = this.calculateTip(matchScore, false);
      this.state.bar.totalTips += tip;
      feedback.className = 'bar-feedback bad';
      feedback.innerHTML = `
        <div class="feedback-title">😞 不太合适</div>
        <div class="feedback-text">客人觉得这款酒不太符合他/她的期望。</div>
        <div class="match-score">匹配度: ${matchScore}%</div>
        <div class="tip-amount">💰 小费 +${tip}元</div>
        <div class="tip-total">累计收入: ${this.state.bar.totalTips}元</div>
        <div class="hint">最佳推荐是 <strong>${bestMatch.style.name}</strong></div>
        <div class="hint">客人想要: ${customer.customer.preferences.join('、')}</div>
      `;
    }
    
    // 更新统计
    document.getElementById('bar-streak').textContent = this.state.bar.streak;
    document.getElementById('bar-level').textContent = this.state.bar.level;
    document.getElementById('bar-best').textContent = this.state.bar.bestStreak;
    document.getElementById('bar-tips').textContent = this.state.bar.totalTips;
    this.saveBarStats();
    
    // 显示下一位客人按钮
    document.getElementById('btn-next-customer').style.display = 'block';
  },
  
  // ===== 经典模式（原有功能）=====
  selectFamily(familyKey) {
    Sound.playClick();
    this.state.selectedFamily = familyKey;
    UI.renderStyleList(familyKey);
    this.toPage('style-detail');
  },
  
  selectStyle(style) {
    Sound.playClick();
    this.state.selectedStyle = style;
    UI.renderBrewerSelect(this.state.selectedFamily);
    this.toPage('brewer-select');
  },
  
  selectBrewer(brewer) {
    Sound.playClick();
    this.state.brewer = brewer;
    this.state.step = 0;
    this.resetBrewState();
    this.toPage('brewing');
  },
  
  resetBrewState() {
    const style = this.state.selectedStyle;
    if (!style) return;
    
    this.state.selectedMalts = [];
    this.state.selectedHops = [];
    this.state.selectedYeast = '';
    this.state.selectedFlavors = [];
    this.state.mashTemp = style.mashTemp?.ideal || 65;
    this.state.mashTime = style.mashTime?.ideal || 60;
    this.state.boilTime = style.boilTime?.ideal || 60;
    this.state.fermentTemp = style.fermentTemp?.ideal || 18;
    this.state.fermentTime = style.fermentTime?.ideal || 14;
    this.state.conditionTime = 7;
  },
  
  initBrewing() {
    const style = this.state.selectedStyle;
    if (!style) return;
    
    document.querySelectorAll('.brew-step').forEach((s, i) => {
      s.classList.toggle('active', i === 0);
    });
    
    UI.updateStepIndicator(0);
    UI.renderMashStep(style);
    
    // 初始化动画画布
    const brewingBody = document.getElementById('brewing-body');
    if (brewingBody) {
      Animations.init('brewing-body');
    }
    
    setTimeout(() => {
      const welcomeMsgs = [
        `欢迎来到我的酿酒坊！今天我们要酿造一款${style.name}。`,
        `准备好了吗？${style.name}是一款${style.description?.substring(0, 20) || '独特的啤酒'}...`,
        `好的，让我们开始酿造${style.name}吧！${style.tips?.[0]?.substring(0, 30) || '细节决定成败'}...`
      ];
      const msg = welcomeMsgs[Math.floor(Math.random() * welcomeMsgs.length)];
      UI.showBubble(msg, 'success');
    }, 500);
  },
  
  nextStep() {
    const style = this.state.selectedStyle;
    
    if (this.state.step === 0 && this.state.selectedMalts.length === 0) {
      Sound.playWarning();
      UI.showBubble('至少要选一种麦芽！没有麦芽怎么酿酒？', 'warning');
      return;
    }
    if (this.state.step === 2 && !this.state.selectedYeast) {
      Sound.playWarning();
      UI.showBubble('必须选择酵母！没有酵母啤酒不会发酵。', 'warning');
      return;
    }
    
    // 播放步骤切换音效
    Sound.playClick();
    
    // 播放步骤动画
    if (this.state.step === 0) {
      Animations.playMashing(this.state.selectedMalts.length);
    } else if (this.state.step === 1) {
      Animations.playBoiling(this.state.selectedHops.length);
    } else if (this.state.step === 2) {
      Animations.playFermenting();
    }
    
    this.state.step++;
    
    document.querySelectorAll('.brew-step').forEach((s, i) => {
      s.classList.toggle('active', i === this.state.step);
    });
    UI.updateStepIndicator(this.state.step);
    
    if (this.state.step === 1) {
      UI.renderBoilStep(style);
      UI.showBubble('现在进入煮沸阶段！酒花投放的时机很关键。', 'tip');
    } else if (this.state.step === 2) {
      UI.renderFermentStep(style);
      UI.showBubble('发酵是魔法发生的时刻！温度和酵母选择决定成败。', 'tip');
    } else if (this.state.step === 3) {
      UI.renderFlavorStep(style);
      if (style.optional && style.optional.length > 0) {
        UI.showBubble(`这款风格可以尝试添加：${style.optional.join('、')}。当然也可以什么都不加。`, 'tip');
      } else {
        UI.showBubble('这款传统风格通常不需要额外增味，直接跳过也可以。', 'tip');
      }
    }
    
    window.scrollTo(0, 0);
  },
  
  toggleMalt(maltName) {
    const idx = this.state.selectedMalts.findIndex(m => m.name === maltName);
    if (idx >= 0) {
      this.state.selectedMalts.splice(idx, 1);
      Sound.playClick();
    } else {
      this.state.selectedMalts.push({ name: maltName, weight: 2 });
      Sound.playDrop();
      // 播放麦芽掉落动画
      const maltSelector = document.getElementById('malt-selector');
      if (maltSelector) {
        const btn = maltSelector.querySelector(`[data-malt="${maltName}"]`);
        if (btn) {
          const rect = btn.getBoundingClientRect();
          const container = document.getElementById('brewing-body');
          if (container) {
            const containerRect = container.getBoundingClientRect();
            Animations.createParticle(
              rect.left - containerRect.left + rect.width / 2,
              rect.top - containerRect.top + rect.height / 2,
              'malt',
              { color: '#5B8C3A', size: 8 }
            );
          }
        }
      }
    }
    UI.updateSelectedMalts();
    this.checkWarnings();
  },
  
  adjustMaltWeight(maltName, delta) {
    const malt = this.state.selectedMalts.find(m => m.name === maltName);
    if (malt) {
      malt.weight = Math.max(1, Math.min(20, malt.weight + delta));
      UI.updateSelectedMalts();
      Sound.playClick();
      this.checkWarnings();
    }
  },
  
  adjustHopWeight(hopName, delta) {
    const hop = this.state.selectedHops.find(h => h.name === hopName);
    if (hop) {
      hop.weight = Math.max(0.25, Math.min(5, hop.weight + delta));
      hop.weight = Math.round(hop.weight * 10) / 10;
      UI.updateSelectedHops();
      Sound.playClick();
      this.checkWarnings();
    }
  },
  
  removeMalt(maltName) {
    this.state.selectedMalts = this.state.selectedMalts.filter(m => m.name !== maltName);
    UI.updateSelectedMalts();
    Sound.playClick();
  },
  
  toggleHop(hopName) {
    const idx = this.state.selectedHops.findIndex(h => h.name === hopName);
    if (idx >= 0) {
      this.state.selectedHops.splice(idx, 1);
      Sound.playClick();
    } else {
      this.state.selectedHops.push({ name: hopName, weight: 1.0, boilTime: this.state.boilTime });
      Sound.playHopDrop();
      // 播放酒花掉落动画
      const hopSelector = document.getElementById('hop-selector');
      if (hopSelector) {
        const btn = hopSelector.querySelector(`[data-hop="${hopName}"]`);
        if (btn) {
          const rect = btn.getBoundingClientRect();
          const container = document.getElementById('brewing-body');
          if (container) {
            const containerRect = container.getBoundingClientRect();
            Animations.createParticle(
              rect.left - containerRect.left + rect.width / 2,
              rect.top - containerRect.top + rect.height / 2,
              'hop',
              { color: '#4CAF50', size: 6 }
            );
          }
        }
      }
    }
    UI.updateSelectedHops();
    this.checkWarnings();
  },
  
  removeHop(hopName) {
    this.state.selectedHops = this.state.selectedHops.filter(h => h.name !== hopName);
    UI.updateSelectedHops();
    Sound.playClick();
  },
  
  selectYeast(yeastName) {
    this.state.selectedYeast = yeastName;
    document.querySelectorAll('#yeast-selector .ingredient-btn').forEach(btn => {
      btn.classList.toggle('selected', btn.querySelector('.ing-name')?.textContent === yeastName);
    });
    Sound.playBubble();
    this.checkWarnings();
  },
  
  toggleFlavor(flavorName) {
    const idx = this.state.selectedFlavors.findIndex(f => f.name === flavorName);
    if (idx >= 0) {
      this.state.selectedFlavors.splice(idx, 1);
      Sound.playClick();
    } else {
      this.state.selectedFlavors.push({ name: flavorName });
      Sound.playDrop();
      // 播放增味动画
      Animations.playFlavoring([flavorName]);
    }
    UI.updateSelectedFlavors();
    this.checkWarnings();
  },
  
  removeFlavor(flavorName) {
    this.state.selectedFlavors = this.state.selectedFlavors.filter(f => f.name !== flavorName);
    UI.updateSelectedFlavors();
    Sound.playClick();
  },
  
  checkWarnings() {
    const style = this.state.selectedStyle;
    if (!style) return;
    
    const warnings = BrewLogic.checkWarnings(style, this.state);
    if (warnings.length > 0) {
      const w = warnings[0];
      UI.showBubble(w.text, w.type);
    }
  },
  
  hideBubble() {
    Sound.playClick();
    UI.hideBubble();
  },
  
  finishBrewing() {
    const style = this.state.selectedStyle;
    if (!style) return;
    
    // 播放完成音效
    Sound.playComplete();
    
    // 播放啤酒倒出动画
    const srm = BrewLogic.calculateSRM(this.state.selectedMalts);
    const beerColor = BrewLogic.srmToColor(srm);
    Animations.playPouring(beerColor, 2000);
    
    const og = BrewLogic.calculateOG(this.state.selectedMalts);
    const yeast = INGREDIENTS.yeasts[this.state.selectedYeast];
    const attenuation = yeast?.attenuation || 0.75;
    const fg = BrewLogic.calculateFG(og, attenuation, this.state.fermentTemp, this.state.fermentTime, this.state.mashTemp);
    const abv = BrewLogic.calculateABV(og, fg);
    const ibu = BrewLogic.calculateIBU(this.state.selectedHops.map(h => ({
      name: h.name,
      weight: h.weight || 0.5,
      boilTime: this.state.boilTime
    })), og);
    // srm已在上面计算
    
    const actual = {
      og, fg, ibu, srm, abv,
      yeastName: this.state.selectedYeast,
      fermentTemp: this.state.fermentTemp,
      fermentTime: this.state.fermentTime,
      mashTemp: this.state.mashTemp,
      creativeBonus: this.calculateCreativeBonus(style)
    };
    
    const score = BrewLogic.calculateScore(style, actual);
    this.state.result = { style, actual, score };
    
    // 学徒模式：记录完成并解锁下一个
    if (this.state.currentMode === 'apprentice') {
      this.completeStyle(style.id, score.total);
    }
    
    this.saveToHistory(style, actual, score);
    UI.renderResult(style, actual, score);
    
    // 播放评分音效
    setTimeout(() => {
      if (score.total >= 80) {
        Sound.playSuccess();
      } else if (score.total >= 60) {
        Sound.playBubble();
      } else {
        Sound.playWarning();
      }
      
      // 语音播报评分
      const comment = BrewLogic.generateComment(style, score, actual);
    }, 1500);
    
    this.toPage('result');
  },
  
  calculateCreativeBonus(style) {
    let bonus = 5;
    
    if (this.state.selectedFlavors.length > 0) {
      const optional = style.optional || [];
      const hasRecommended = this.state.selectedFlavors.some(f => 
        optional.some(o => f.name.includes(o) || o.includes(f.name))
      );
      if (hasRecommended) bonus += 3;
      else bonus -= 2;
    }
    
    const ogTarget = style.og?.target || (style.og?.min + style.og?.max) / 2 || 1.050;
    const og = BrewLogic.calculateOG(this.state.selectedMalts);
    if (Math.abs(og - ogTarget) < 0.005) bonus += 2;
    
    return Math.max(0, Math.min(10, bonus));
  },
  
  saveToHistory(style, actual, score) {
    const history = JSON.parse(localStorage.getItem('brewmaster_history') || '[]');
    history.push({
      id: Date.now(),
      name: '',
      styleName: style.name,
      styleId: style.id,
      family: this.state.selectedFamily,
      score: score.total,
      rating: score.rating.level,
      params: {
        og: actual.og.toFixed(3),
        fg: actual.fg.toFixed(3),
        ibu: Math.round(actual.ibu),
        srm: Math.round(actual.srm),
        abv: actual.abv.toFixed(1)
      },
      date: new Date().toLocaleDateString('zh-CN')
    });
    
    if (history.length > 50) history.shift();
    localStorage.setItem('brewmaster_history', JSON.stringify(history));
  },
  
  generateShareImage() {
    Sound.playClick();
    const name = document.getElementById('beer-name')?.value || '未命名佳酿';
    if (this.state.result) {
      this.state.result.name = name;
      const history = JSON.parse(localStorage.getItem('brewmaster_history') || '[]');
      if (history.length > 0) {
        history[history.length - 1].name = name;
        localStorage.setItem('brewmaster_history', JSON.stringify(history));
      }
    }
    
    Share.generate(this.state, this.state.result);
    this.toPage('share');
  },
  
  downloadShareImage() {
    Sound.playClick();
    Share.download();
  },
  
  // ===== PWA 安装 =====
  installPWA() {
    if (this.state.installPrompt) {
      this.state.installPrompt.prompt();
      this.state.installPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('用户已安装到桌面');
        }
        this.state.installPrompt = null;
        const btn = document.getElementById('btn-install');
        if (btn) btn.style.display = 'none';
      });
    }
  },
  
  // ===== 酒窖管理 =====
  toggleGallerySelect() {
    this.state.gallerySelectMode = !this.state.gallerySelectMode;
    this.state.gallerySelected = [];
    UI.renderGallery();
    
    const btnText = document.getElementById('select-mode-text');
    if (btnText) {
      btnText.textContent = this.state.gallerySelectMode ? '✓ 完成' : '✓ 多选';
    }
  },
  
  toggleGalleryItem(id) {
    if (!this.state.gallerySelectMode) return;
    
    const idx = this.state.gallerySelected.indexOf(id);
    if (idx >= 0) {
      this.state.gallerySelected.splice(idx, 1);
    } else {
      this.state.gallerySelected.push(id);
    }
    UI.renderGallery();
  },
  
  deleteSelectedGallery() {
    if (this.state.gallerySelected.length === 0) {
      alert('请先选择要删除的记录');
      return;
    }
    
    if (!confirm(`确定要删除选中的 ${this.state.gallerySelected.length} 条记录吗？`)) return;
    
    let history = JSON.parse(localStorage.getItem('brewmaster_history') || '[]');
    history = history.filter(beer => !this.state.gallerySelected.includes(beer.id));
    localStorage.setItem('brewmaster_history', JSON.stringify(history));
    
    this.state.gallerySelected = [];
    this.state.gallerySelectMode = false;
    UI.renderGallery();
    
    const btnText = document.getElementById('select-mode-text');
    if (btnText) btnText.textContent = '✓ 多选';
  },
  
  clearGallery() {
    const history = JSON.parse(localStorage.getItem('brewmaster_history') || '[]');
    if (history.length === 0) return;
    
    if (!confirm(`确定要清空所有 ${history.length} 条酿造记录吗？此操作不可恢复！`)) return;
    
    localStorage.setItem('brewmaster_history', '[]');
    this.state.gallerySelected = [];
    this.state.gallerySelectMode = false;
    UI.renderGallery();
    
    const btnText = document.getElementById('select-mode-text');
    if (btnText) btnText.textContent = '✓ 多选';
  },
  
  renameGalleryItem(id) {
    const history = JSON.parse(localStorage.getItem('brewmaster_history') || '[]');
    const beer = history.find(b => b.id === id);
    if (!beer) return;
    
    const newName = prompt('给这款啤酒起个新名字：', beer.name || '');
    if (newName === null) return; // 用户取消
    
    beer.name = newName.trim() || beer.name;
    localStorage.setItem('brewmaster_history', JSON.stringify(history));
    UI.renderGallery();
  },
  
  // ===== 酒吧小费 =====
  calculateTip(matchScore, isBest) {
    let baseTip = 0;
    
    if (isBest) {
      // 完美推荐：10-20元
      baseTip = 10 + Math.floor(Math.random() * 11);
    } else if (matchScore >= 70) {
      // 很好：5-10元
      baseTip = 5 + Math.floor(Math.random() * 6);
    } else if (matchScore >= 40) {
      // 一般：1-5元
      baseTip = 1 + Math.floor(Math.random() * 5);
    } else {
      // 不满意：0-2元（同情小费）
      baseTip = Math.floor(Math.random() * 3);
    }
    
    // 连胜加成
    const streakBonus = Math.min(this.state.bar.streak * 2, 20);
    
    // 等级加成
    const levelBonus = (this.state.bar.level - 1) * 3;
    
    return baseTip + streakBonus + levelBonus;
  }
};

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  // 初始化音效系统
  Sound.init();
  
  // 初始化学徒模式解锁（第一个风格默认解锁）
  const unlocked = JSON.parse(localStorage.getItem('brewmaster_unlocked') || '[]');
  if (unlocked.length === 0) {
    // 默认解锁第一个风格（美式清爽拉格或第一个可用的）
    const firstFamily = Object.keys(BJCP_STYLES)[0];
    const firstStyle = BJCP_STYLES[firstFamily]?.styles[0];
    if (firstStyle) {
      unlocked.push(firstStyle.id);
      localStorage.setItem('brewmaster_unlocked', JSON.stringify(unlocked));
    }
  }
  
  // PWA 安装提示
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    game.state.installPrompt = e;
    const btn = document.getElementById('btn-install');
    if (btn) btn.style.display = 'block';
  });
  
  // 检测是否已安装
  if (window.matchMedia('(display-mode: standalone)').matches) {
    const btn = document.getElementById('btn-install');
    if (btn) btn.style.display = 'none';
  }
  
  // 全局点击恢复音频上下文（浏览器自动播放策略）
  const resumeAudio = () => {
    Sound.resume();
    document.removeEventListener('click', resumeAudio);
    document.removeEventListener('touchstart', resumeAudio);
  };
  document.addEventListener('click', resumeAudio);
  document.addEventListener('touchstart', resumeAudio);
  
  console.log('🍀🍺 Hoppy Go Lucky 已加载');
});

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = game;
}
