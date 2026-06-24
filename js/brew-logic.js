// ===== 酿造计算引擎 =====
// 基于简化版家酿公式

const BrewLogic = {
  // 批次体积（加仑）
  BATCH_SIZE: 5,
  
  // 糖化效率
  MASH_EFFICIENCY: 0.72,
  
  // 计算OG（初始比重）
  // malts: [{name, weight_lbs}]
  calculateOG(malts) {
    let totalPoints = 0;
    for (const malt of malts) {
      const ing = INGREDIENTS.malts[malt.name];
      if (!ing) continue;
      const ppg = ing.ppg || 35;
      const weight = malt.weight || 1; // 默认1磅
      totalPoints += ppg * weight * this.MASH_EFFICIENCY;
    }
    const og = 1 + (totalPoints / (this.BATCH_SIZE * 1000));
    return Math.min(Math.max(og, 1.020), 1.150);
  },
  
  // 计算FG（最终比重）
  // og: 初始比重
  // yeastAttenuation: 酵母发酵度 (0.7-0.9)
  // fermentTemp: 发酵温度
  // fermentTime: 发酵天数
  // mashTemp: 糖化温度（影响可发酵糖比例）
  calculateFG(og, yeastAttenuation, fermentTemp, fermentTime, mashTemp) {
    // 基础FG
    let fg = 1 + ((og - 1) * (1 - yeastAttenuation));
    
    // 温度修正：温度太高，酵母可能过度发酵；太低则发酵不完全
    const yeast = this.getCurrentYeast();
    if (yeast) {
      if (fermentTemp > yeast.tempMax + 3) {
        // 温度过高，可能产生杂醇，但发酵度略高
        fg -= 0.002;
      } else if (fermentTemp < yeast.tempMin - 2) {
        // 温度过低，发酵停滞
        fg += 0.008;
      } else if (fermentTemp < yeast.tempMin) {
        fg += 0.004;
      }
    }
    
    // 时间修正
    if (fermentTime < 7) {
      fg += 0.005 * (7 - fermentTime) / 7;
    }
    
    // 糖化温度修正：高温糖化产生更多不可发酵糖
    if (mashTemp > 68) {
      fg += (mashTemp - 68) * 0.001;
    } else if (mashTemp < 62) {
      fg -= (62 - mashTemp) * 0.0005;
    }
    
    return Math.min(Math.max(fg, 1.000), og - 0.005);
  },
  
  // 计算ABV
  calculateABV(og, fg) {
    return (og - fg) * 131.25;
  },
  
  // 计算IBU（简化Tinseth公式）
  // hops: [{name, weight_oz, boil_time_minutes}]
  // og: 初始比重（高OG降低利用率）
  calculateIBU(hops, og) {
    let totalIBU = 0;
    for (const hop of hops) {
      const ing = INGREDIENTS.hops[hop.name];
      if (!ing) continue;
      
      const alpha = ing.alpha || 5;
      const weight = hop.weight || 0.5; // 默认0.5盎司
      const boilTime = hop.boilTime || 60;
      
      // 利用率（随煮沸时间变化）
      let utilization = 0;
      if (boilTime >= 60) utilization = 0.25;
      else if (boilTime >= 45) utilization = 0.22;
      else if (boilTime >= 30) utilization = 0.18;
      else if (boilTime >= 15) utilization = 0.12;
      else if (boilTime >= 5) utilization = 0.05;
      else utilization = 0.02;
      
      // 高OG修正
      const gravityFactor = og > 1.050 ? 1 / (1 + (og - 1.050) * 10) : 1;
      
      const ibu = (alpha * weight * utilization * 75 * gravityFactor) / this.BATCH_SIZE;
      totalIBU += ibu;
    }
    return Math.max(0, totalIBU);
  },
  
  // 计算SRM（色度）
  // malts: [{name, weight_lbs}]
  calculateSRM(malts) {
    let mcu = 0; // Malt Color Units
    for (const malt of malts) {
      const ing = INGREDIENTS.malts[malt.name];
      if (!ing) continue;
      const color = ing.color || 2;
      const weight = malt.weight || 1;
      mcu += color * weight;
    }
    // Morey公式
    const srm = 1.4922 * Math.pow(mcu / this.BATCH_SIZE, 0.6859);
    return Math.max(1, Math.min(50, srm));
  },
  
  // 获取SRM对应的颜色CSS
  srmToColor(srm) {
    if (srm <= 3) return '#F4D03F'; // 淡稻草
    if (srm <= 5) return '#F5A623'; // 金色
    if (srm <= 7) return '#B8860B'; // 琥珀浅
    if (srm <= 14) return '#8B4513'; // 琥珀
    if (srm <= 20) return '#654321'; // 铜色
    if (srm <= 30) return '#3E2723'; // 棕色
    return '#1a0a00'; // 黑色
  },
  
  // 获取SRM对应的颜色名称
  srmToColorName(srm) {
    if (srm <= 3) return '淡稻草色';
    if (srm <= 5) return '金色';
    if (srm <= 7) return '浅琥珀色';
    if (srm <= 14) return '琥珀色';
    if (srm <= 20) return '铜色';
    if (srm <= 30) return '棕色';
    return '深黑色';
  },
  
  // 评分算法
  calculateScore(style, actual) {
    const scores = {};
    const weights = { og: 15, fg: 15, ibu: 15, srm: 15, abv: 15, process: 20, creative: 5 };
    
    // 参数匹配评分
    scores.og = this.scoreParam(actual.og, style.og.min, style.og.max, style.og.target);
    scores.fg = this.scoreParam(actual.fg, style.fg.min, style.fg.max, style.fg.target);
    scores.ibu = this.scoreParam(actual.ibu, style.ibu.min, style.ibu.max, style.ibu.target);
    scores.srm = this.scoreParam(actual.srm, style.srm.min, style.srm.max, style.srm.target);
    scores.abv = this.scoreParam(actual.abv, style.abv.min, style.abv.max, style.abv.target);
    
    // 工艺评分（基于玩家选择）
    scores.process = this.scoreProcess(style, actual);
    
    // 创意评分
    scores.creative = actual.creativeBonus || 5;
    
    // 总分
    let total = 0;
    for (const key in weights) {
      total += (scores[key] || 0) * (weights[key] / 100);
    }
    
    return {
      total: Math.round(total),
      breakdown: scores,
      rating: this.getRating(total)
    };
  },
  
  // 单项参数评分
  scoreParam(actual, min, max, target) {
    const range = max - min;
    const halfRange = range / 2;
    const center = target || (min + max) / 2;
    
    const diff = Math.abs(actual - center);
    
    if (diff <= range * 0.05) return 100; // 完美
    if (diff <= range * 0.15) return 90;  // 优秀
    if (diff <= range * 0.25) return 80;  // 良好
    if (diff <= range * 0.40) return 70;  // 一般
    if (diff <= range * 0.60) return 60;  // 及格
    if (actual >= min && actual <= max) return 50; // 在范围内但偏差大
    if (diff <= range * 1.0) return 40; // 略超范围
    return 20; // 严重偏差
  },
  
  // 工艺评分
  scoreProcess(style, actual) {
    let score = 100;
    
    // 酵母匹配检查
    if (actual.yeastName) {
      const expectedYeasts = style.yeasts.map(y => y.name);
      const isCorrectYeast = expectedYeasts.some(ey => actual.yeastName.includes(ey) || ey.includes(actual.yeastName));
      if (!isCorrectYeast) {
        score -= 25;
      }
    }
    
    // 温度检查
    if (actual.fermentTemp && style.fermentTemp) {
      if (actual.fermentTemp > style.fermentTemp.max + 5 || actual.fermentTemp < style.fermentTemp.min - 5) {
        score -= 20;
      } else if (actual.fermentTemp > style.fermentTemp.max || actual.fermentTemp < style.fermentTemp.min) {
        score -= 10;
      }
    }
    
    // 发酵时间检查
    if (actual.fermentTime && style.fermentTime) {
      if (actual.fermentTime < style.fermentTime.min * 0.5) {
        score -= 20;
      } else if (actual.fermentTime < style.fermentTime.min * 0.8) {
        score -= 10;
      }
    }
    
    // 糖化温度检查
    if (actual.mashTemp && style.mashTemp) {
      if (actual.mashTemp > style.mashTemp.max + 3 || actual.mashTemp < style.mashTemp.min - 3) {
        score -= 15;
      }
    }
    
    return Math.max(0, score);
  },
  
  // 评级
  getRating(total) {
    if (total >= 95) return { level: '大师级', emoji: '🏆', color: '#FFD700' };
    if (total >= 85) return { level: '优秀', emoji: '⭐', color: '#FFA500' };
    if (total >= 70) return { level: '良好', emoji: '👍', color: '#4CAF50' };
    if (total >= 50) return { level: '一般', emoji: '🤔', color: '#FF9800' };
    return { level: '实验品', emoji: '😅', color: '#9E9E9E' };
  },
  
  // 生成酿酒师评语
  generateComment(style, score, actual) {
    const rating = score.rating;
    const comments = [];
    
    // 基于评级的总体评价
    if (score.total >= 95) {
      comments.push("完美！这可以去参加BJCP比赛了！每一口都是艺术的体现。");
    } else if (score.total >= 85) {
      comments.push("非常出色！接近商业精酿水准，你的酿酒天赋令人惊叹！");
    } else if (score.total >= 70) {
      comments.push("不错的尝试！有潜力成为好酒，再微调一下就更完美了。");
    } else if (score.total >= 50) {
      comments.push("能喝，但离目标风格还有距离。别灰心，酿酒就是不断实验！");
    } else {
      comments.push("这是一次…非常有趣的实验。至少你学到了什么不该做！");
    }
    
    // 具体参数反馈
    const breakdown = score.breakdown;
    if (breakdown.og < 70) {
      comments.push(actual.og > style.og.max ? "OG太高了，麦芽用多了，酒体会太厚重。" : "OG太低，麦芽不够，酒体撑不起来。");
    }
    if (breakdown.fg < 70) {
      comments.push(actual.fg > style.fg.max ? "FG偏高，发酵不完全或糖化温度太高。" : "FG太低，发酵过度了。");
    }
    if (breakdown.ibu < 70) {
      comments.push(actual.ibu > style.ibu.max ? "酒花太多了，苦味会压倒一切！" : "酒花不够，苦味支撑不住麦芽甜味。");
    }
    if (breakdown.srm < 70) {
      comments.push(actual.srm > style.srm.max ? "颜色太深了，深色麦芽用多了。" : "颜色太浅，需要更多特色麦芽。");
    }
    if (breakdown.abv < 70) {
      comments.push(actual.abv > style.abv.max ? "酒精度太高，小心喝多！" : "酒精度不够，发酵需要更充分。");
    }
    if (breakdown.process < 80) {
      comments.push("工艺上有些问题，注意温度和酵母的选择。");
    }
    
    return comments.join('\n\n');
  },
  
  // 获取当前酵母（从游戏状态）
  getCurrentYeast() {
    if (typeof game !== 'undefined' && game.state && game.state.selectedYeast) {
      return INGREDIENTS.yeasts[game.state.selectedYeast];
    }
    return null;
  },
  
  // 检查并生成酿酒师提醒
  checkWarnings(style, state) {
    const warnings = [];
    
    // 温度检查
    if (state.mashTemp) {
      if (state.mashTemp < style.mashTemp.min - 2) {
        warnings.push({ type: 'warning', text: `糖化温度太低了！${style.name}建议${style.mashTemp.min}-${style.mashTemp.max}°C。` });
      } else if (state.mashTemp > style.mashTemp.max + 2) {
        warnings.push({ type: 'warning', text: `糖化温度太高了！超过${style.mashTemp.max}°C酶会失活。` });
      }
    }
    
    if (state.fermentTemp && state.selectedYeast) {
      const yeast = INGREDIENTS.yeasts[state.selectedYeast];
      if (yeast) {
        if (state.fermentTemp > yeast.tempMax + 3) {
          warnings.push({ type: 'warning', text: `发酵温度太高！${state.selectedYeast}最高耐受${yeast.tempMax}°C，再高温会产生杂醇味！` });
        } else if (state.fermentTemp < yeast.tempMin - 3) {
          warnings.push({ type: 'warning', text: `发酵温度太低！${state.selectedYeast}在${yeast.tempMin}°C以下会休眠。` });
        }
      }
    }
    
    // 酵母匹配检查
    if (state.selectedYeast) {
      const expectedYeasts = style.yeasts.map(y => y.name);
      const isCorrect = expectedYeasts.some(ey => state.selectedYeast.includes(ey) || ey.includes(state.selectedYeast));
      if (!isCorrect) {
        warnings.push({ type: 'warning', text: `${state.selectedYeast}不是${style.name}的传统选择，可能会改变风格特征。` });
      }
    }
    
    // 酒花量预估检查
    if (state.selectedHops && state.selectedHops.length > 0) {
      const estimatedIBU = this.calculateIBU(state.selectedHops.map(h => ({ 
        name: h.name, 
        weight: h.weight || 0.5, 
        boilTime: state.boilTime || 60 
      })), 1.050);
      
      if (estimatedIBU > style.ibu.max * 1.3) {
        warnings.push({ type: 'warning', text: `酒花太多了！预估IBU约${Math.round(estimatedIBU)}，远超${style.name}的上限${style.ibu.max}。` });
      } else if (estimatedIBU < style.ibu.min * 0.5) {
        warnings.push({ type: 'warning', text: `酒花似乎不够，预估IBU约${Math.round(estimatedIBU)}，${style.name}需要至少${style.ibu.min}。` });
      }
    }
    
    // 增味检查
    if (state.selectedFlavors && state.selectedFlavors.length > 0) {
      const optional = style.optional || [];
      const hasUnexpected = state.selectedFlavors.some(f => !optional.includes(f.name) && !optional.some(o => f.name.includes(o) || o.includes(f.name)));
      if (hasUnexpected) {
        warnings.push({ type: 'warning', text: `你添加了一些${style.name}不常用的原料，这会让风味偏离传统风格。` });
      }
      if (state.selectedFlavors.length > 3) {
        warnings.push({ type: 'warning', text: `添加物太多了！风味会太杂，建议聚焦1-2种特色。` });
      }
    }
    
    // 鼓励提示
    if (warnings.length === 0 && state.step >= 2) {
      const tips = style.tips || [];
      if (tips.length > 0) {
        const randomTip = tips[Math.floor(Math.random() * tips.length)];
        warnings.push({ type: 'tip', text: randomTip });
      }
    }
    
    return warnings;
  }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = BrewLogic;
}
