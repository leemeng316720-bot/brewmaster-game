// ===== BJCP 2021 扩展风格数据 =====
// 从PDF提取的额外风格

const BJCP_EXTENDED = {
  american: {
    styles: [
      {
        id: "1D",
        flavorTags: ["清亮", "酒花香", "清爽", "低中", "小麦"],
        name: "美国小麦啤酒",
        nameEn: "American Wheat Beer",
        description: "清爽小麦风味，低苦度，适合夏日畅饮。",
        og: { min: 1.042, max: 1.055, target: 1.048 },
        fg: { min: 1.006, max: 1.012, target: 1.009 },
        ibu: { min: 8, max: 20, target: 14 },
        srm: { min: 2, max: 5, target: 3.5 },
        abv: { min: 4.2, max: 5.6, target: 4.9 },
        mashTemp: { min: 63, max: 66, ideal: 64 },
        mashTime: { min: 60, max: 90, ideal: 60 },
        boilTime: { min: 60, max: 90, ideal: 60 },
        fermentTemp: { min: 18, max: 22, ideal: 20 },
        fermentTime: { min: 7, max: 10, ideal: 8 },
        malts: [
          { name: "小麦麦芽", color: 2.0, gravity: 1.038, default: true },
          { name: "皮尔森麦芽", color: 1.8, gravity: 1.037, default: true }
        ],
        hops: [
          { name: "卡斯卡特", alpha: 7.0, type: "aroma", region: "美国" },
          { name: "世纪", alpha: 10.5, type: "dual", region: "美国" }
        ],
        yeasts: [
          { name: "美式艾尔酵母", attenuation: 0.80, tempMin: 16, tempMax: 22, ideal: 20, floc: "中", esters: "柑橘" }
        ],
        optional: [],
        tips: ["小麦麦芽比例30-50%，带来清爽口感！", "苦度很低，酒花只是点缀。"]
      },
      {
        id: "2A",
        flavorTags: ["清亮", "极低酒花", "清爽", "低", "面包"],
        name: "国际淡色拉格",
        nameEn: "International Pale Lager",
        description: "全球大众市场拉格，清爽解渴，低苦度。",
        og: { min: 1.042, max: 1.050, target: 1.046 },
        fg: { min: 1.008, max: 1.012, target: 1.010 },
        ibu: { min: 18, max: 25, target: 22 },
        srm: { min: 2, max: 6, target: 4 },
        abv: { min: 4.5, max: 6.0, target: 5.2 },
        mashTemp: { min: 63, max: 65, ideal: 64 },
        mashTime: { min: 60, max: 90, ideal: 60 },
        boilTime: { min: 60, max: 90, ideal: 60 },
        fermentTemp: { min: 8, max: 12, ideal: 10 },
        fermentTime: { min: 14, max: 21, ideal: 17 },
        malts: [
          { name: "皮尔森麦芽", color: 1.8, gravity: 1.037, default: true }
        ],
        hops: [
          { name: "萨兹", alpha: 3.5, type: "aroma", region: "捷克" },
          { name: "哈拉道", alpha: 5.0, type: "aroma", region: "德国" }
        ],
        yeasts: [
          { name: "德式拉格酵母", attenuation: 0.84, tempMin: 7, tempMax: 13, ideal: 10, floc: "高", esters: "干净" }
        ],
        optional: [],
        tips: ["低温长时间发酵是拉格的灵魂！", "皮尔森麦芽带来干净麦芽风味。"]
      },
      {
        id: "2B",
        flavorTags: ["琥珀", "极低酒花", "中等", "低中", "焦糖"],
        name: "国际琥珀色拉格",
        nameEn: "International Amber Lager",
        description: "琥珀色泽，焦糖麦芽甜香，中等苦度。",
        og: { min: 1.042, max: 1.055, target: 1.048 },
        fg: { min: 1.008, max: 1.014, target: 1.011 },
        ibu: { min: 8, max: 25, target: 16 },
        srm: { min: 6, max: 14, target: 10 },
        abv: { min: 4.5, max: 6.0, target: 5.2 },
        mashTemp: { min: 65, max: 68, ideal: 66 },
        mashTime: { min: 60, max: 90, ideal: 60 },
        boilTime: { min: 60, max: 90, ideal: 60 },
        fermentTemp: { min: 8, max: 12, ideal: 10 },
        fermentTime: { min: 14, max: 21, ideal: 17 },
        malts: [
          { name: "皮尔森麦芽", color: 1.8, gravity: 1.037, default: true },
          { name: "慕尼黑麦芽", color: 8.0, gravity: 1.035, default: false }
        ],
        hops: [
          { name: "萨兹", alpha: 3.5, type: "aroma", region: "捷克" },
          { name: "哈拉道", alpha: 5.0, type: "aroma", region: "德国" }
        ],
        yeasts: [
          { name: "德式拉格酵母", attenuation: 0.84, tempMin: 7, tempMax: 13, ideal: 10, floc: "高", esters: "干净" }
        ],
        optional: [],
        tips: ["慕尼黑麦芽带来面包般的焦糖风味。", "苦度适中，麦芽甜味突出。"]
      },
      {
        id: "2C",
        flavorTags: ["深棕", "极低酒花", "中等", "低中", "烘烤"],
        name: "国际深色拉格",
        nameEn: "International Dark Lager",
        description: "深琥珀至黑色，烘烤麦芽风味，低苦度。",
        og: { min: 1.044, max: 1.056, target: 1.050 },
        fg: { min: 1.008, max: 1.012, target: 1.010 },
        ibu: { min: 8, max: 20, target: 14 },
        srm: { min: 14, max: 30, target: 22 },
        abv: { min: 4.2, max: 6.0, target: 5.1 },
        mashTemp: { min: 65, max: 68, ideal: 66 },
        mashTime: { min: 60, max: 90, ideal: 60 },
        boilTime: { min: 60, max: 90, ideal: 60 },
        fermentTemp: { min: 8, max: 12, ideal: 10 },
        fermentTime: { min: 14, max: 21, ideal: 17 },
        malts: [
          { name: "皮尔森麦芽", color: 1.8, gravity: 1.037, default: true },
          { name: "慕尼黑麦芽", color: 8.0, gravity: 1.035, default: true },
          { name: "焦糖麦芽60L", color: 60, gravity: 1.034, default: false }
        ],
        hops: [
          { name: "萨兹", alpha: 3.5, type: "aroma", region: "捷克" },
          { name: "哈拉道", alpha: 5.0, type: "aroma", region: "德国" }
        ],
        yeasts: [
          { name: "德式拉格酵母", attenuation: 0.84, tempMin: 7, tempMax: 13, ideal: 10, floc: "高", esters: "干净" }
        ],
        optional: [],
        tips: ["深色麦芽带来焦糖甜香，不要烤焦！", "苦度很低，让麦芽风味主导。"]
      },
      {
        id: "21B",
        flavorTags: ["清亮", "酒花香", "干爽", "中高", "特殊"],
        name: "特殊IPA",
        nameEn: "Specialty IPA",
        description: "IPA的变体家族，黑色、棕色、红色、白色、比利时等风格。",
        og: { min: 1.056, max: 1.070, target: 1.063 },
        fg: { min: 1.008, max: 1.014, target: 1.011 },
        ibu: { min: 40, max: 70, target: 55 },
        srm: { min: 6, max: 14, target: 10 },
        abv: { min: 5.5, max: 7.5, target: 6.5 },
        mashTemp: { min: 65, max: 67, ideal: 66 },
        mashTime: { min: 60, max: 90, ideal: 60 },
        boilTime: { min: 60, max: 90, ideal: 60 },
        fermentTemp: { min: 18, max: 22, ideal: 19 },
        fermentTime: { min: 10, max: 14, ideal: 12 },
        malts: [
          { name: "皮尔森麦芽", color: 1.8, gravity: 1.037, default: true },
          { name: "淡色麦芽", color: 2.0, gravity: 1.036, default: true }
        ],
        hops: [
          { name: "卡斯卡特", alpha: 7.0, type: "aroma", region: "美国" },
          { name: "西楚", alpha: 13.0, type: "dual", region: "美国" },
          { name: "世纪", alpha: 10.5, type: "dual", region: "美国" },
          { name: "马赛克", alpha: 12.0, type: "aroma", region: "美国" }
        ],
        yeasts: [
          { name: "美式艾尔酵母", attenuation: 0.80, tempMin: 16, tempMax: 22, ideal: 19, floc: "中", esters: "柑橘" }
        ],
        optional: ["干投酒花"],
        tips: ["特殊IPA是IPA的创意变体，大胆尝试不同风格！", "酒花是核心，苦度和香气要平衡。"]
      },
      {
        id: "22D",
        flavorTags: ["清亮", "酒花香", "浓郁", "高度", "小麦"],
        name: "小麦烈酒",
        nameEn: "Wheatwine",
        description: "高酒精度小麦啤酒，酒体饱满，麦芽浓郁。",
        og: { min: 1.080, max: 1.120, target: 1.100 },
        fg: { min: 1.016, max: 1.030, target: 1.023 },
        ibu: { min: 50, max: 100, target: 75 },
        srm: { min: 9, max: 18, target: 13.5 },
        abv: { min: 8.0, max: 12.0, target: 10.0 },
        mashTemp: { min: 66, max: 69, ideal: 67 },
        mashTime: { min: 60, max: 90, ideal: 75 },
        boilTime: { min: 60, max: 120, ideal: 90 },
        fermentTemp: { min: 18, max: 20, ideal: 19 },
        fermentTime: { min: 14, max: 21, ideal: 18 },
        malts: [
          { name: "小麦麦芽", color: 2.0, gravity: 1.038, default: true },
          { name: "皮尔森麦芽", color: 1.8, gravity: 1.037, default: true },
          { name: "慕尼黑麦芽", color: 8.0, gravity: 1.035, default: false }
        ],
        hops: [
          { name: "马格努门", alpha: 14.0, type: "bittering", region: "德国" },
          { name: "世纪", alpha: 10.5, type: "dual", region: "美国" },
          { name: "哥伦布", alpha: 15.0, type: "bittering", region: "美国" }
        ],
        yeasts: [
          { name: "美式艾尔酵母", attenuation: 0.80, tempMin: 16, tempMax: 22, ideal: 19, floc: "中", esters: "柑橘" }
        ],
        optional: ["橡木片"],
        tips: ["小麦烈酒需要大量小麦麦芽，至少40%！", "高酒精度需要大量酒花支撑，IBU至少50。"]
      }
    ]
  },
  
  german: {
    styles: [
      {
        id: "4B",
        flavorTags: ["琥珀", "优雅酒花", "中等", "低中", "焦糖"],
        name: "节日啤酒",
        nameEn: "Festbier",
        description: "慕尼黑啤酒节现代版本，金黄透亮，麦芽浓郁，酒体饱满。",
        og: { min: 1.044, max: 1.048, target: 1.046 },
        fg: { min: 1.006, max: 1.012, target: 1.009 },
        ibu: { min: 16, max: 22, target: 19 },
        srm: { min: 3, max: 5, target: 4 },
        abv: { min: 4.7, max: 5.4, target: 5.1 },
        mashTemp: { min: 64, max: 66, ideal: 65 },
        mashTime: { min: 60, max: 90, ideal: 60 },
        boilTime: { min: 60, max: 90, ideal: 60 },
        fermentTemp: { min: 8, max: 12, ideal: 10 },
        fermentTime: { min: 14, max: 21, ideal: 17 },
        malts: [
          { name: "皮尔森麦芽", color: 1.8, gravity: 1.037, default: true },
          { name: "慕尼黑麦芽", color: 8.0, gravity: 1.035, default: true }
        ],
        hops: [
          { name: "哈拉道", alpha: 5.0, type: "aroma", region: "德国" },
          { name: "泰南格", alpha: 4.5, type: "aroma", region: "德国" }
        ],
        yeasts: [
          { name: "德式拉格酵母", attenuation: 0.84, tempMin: 7, tempMax: 13, ideal: 10, floc: "高", esters: "干净" }
        ],
        optional: [],
        tips: ["节日啤酒比三月啤酒更淡更清爽，现代版本！", "慕尼黑麦芽带来面包般的浓郁风味。"]
      },
      {
        id: "5A",
        flavorTags: ["清亮", "极低酒花", "清爽", "低", "面包"],
        name: "德国清爽啤酒",
        nameEn: "German Leichtbier",
        description: "极低酒精度，清爽解渴，德国社交啤酒。",
        og: { min: 1.026, max: 1.034, target: 1.030 },
        fg: { min: 1.006, max: 1.010, target: 1.008 },
        ibu: { min: 15, max: 28, target: 22 },
        srm: { min: 1.5, max: 4, target: 2.8 },
        abv: { min: 2.4, max: 3.6, target: 3.0 },
        mashTemp: { min: 63, max: 65, ideal: 64 },
        mashTime: { min: 60, max: 90, ideal: 60 },
        boilTime: { min: 60, max: 90, ideal: 60 },
        fermentTemp: { min: 8, max: 12, ideal: 10 },
        fermentTime: { min: 14, max: 21, ideal: 17 },
        malts: [
          { name: "皮尔森麦芽", color: 1.8, gravity: 1.037, default: true }
        ],
        hops: [
          { name: "哈拉道", alpha: 5.0, type: "aroma", region: "德国" },
          { name: "泰南格", alpha: 4.5, type: "aroma", region: "德国" }
        ],
        yeasts: [
          { name: "德式拉格酵母", attenuation: 0.84, tempMin: 7, tempMax: 13, ideal: 10, floc: "高", esters: "干净" }
        ],
        optional: [],
        tips: ["酒精度极低，适合畅饮！", "皮尔森麦芽带来干净清爽的风味。"]
      },
      {
        id: "5B",
        flavorTags: ["清亮", "优雅酒花", "干爽", "低中", "面包"],
        name: "科隆啤酒",
        nameEn: "Kölsch",
        description: "上层发酵的拉格风格，金黄透亮，细腻优雅，科隆特产。",
        og: { min: 1.044, max: 1.050, target: 1.047 },
        fg: { min: 1.007, max: 1.011, target: 1.009 },
        ibu: { min: 18, max: 30, target: 24 },
        srm: { min: 3, max: 5, target: 4 },
        abv: { min: 4.4, max: 5.2, target: 4.8 },
        mashTemp: { min: 64, max: 66, ideal: 65 },
        mashTime: { min: 60, max: 90, ideal: 60 },
        boilTime: { min: 60, max: 90, ideal: 60 },
        fermentTemp: { min: 13, max: 16, ideal: 14 },
        fermentTime: { min: 14, max: 21, ideal: 17 },
        malts: [
          { name: "皮尔森麦芽", color: 1.8, gravity: 1.037, default: true }
        ],
        hops: [
          { name: "哈拉道", alpha: 5.0, type: "aroma", region: "德国" },
          { name: "泰南格", alpha: 4.5, type: "aroma", region: "德国" }
        ],
        yeasts: [
          { name: "艾尔酵母", attenuation: 0.82, tempMin: 13, tempMax: 16, ideal: 14, floc: "中", esters: "干净" }
        ],
        optional: [],
        tips: ["科隆啤酒是上层发酵的拉格，温度控制很关键！", "发酵温度14°C，不能太高！"]
      },
      {
        id: "5C",
        flavorTags: ["清亮", "优雅酒花", "干爽", "低中", "面包"],
        name: "德国淡色出口啤酒",
        nameEn: "German Helles Exportbier",
        description: "比Helles更浓郁，麦芽风味更突出，出口版本。",
        og: { min: 1.050, max: 1.058, target: 1.054 },
        fg: { min: 1.008, max: 1.015, target: 1.011 },
        ibu: { min: 20, max: 30, target: 25 },
        srm: { min: 3.5, max: 5, target: 4.2 },
        abv: { min: 4.4, max: 5.2, target: 4.8 },
        mashTemp: { min: 64, max: 66, ideal: 65 },
        mashTime: { min: 60, max: 90, ideal: 60 },
        boilTime: { min: 60, max: 90, ideal: 60 },
        fermentTemp: { min: 8, max: 12, ideal: 10 },
        fermentTime: { min: 14, max: 21, ideal: 17 },
        malts: [
          { name: "皮尔森麦芽", color: 1.8, gravity: 1.037, default: true },
          { name: "慕尼黑麦芽", color: 8.0, gravity: 1.035, default: false }
        ],
        hops: [
          { name: "哈拉道", alpha: 5.0, type: "aroma", region: "德国" },
          { name: "泰南格", alpha: 4.5, type: "aroma", region: "德国" }
        ],
        yeasts: [
          { name: "德式拉格酵母", attenuation: 0.84, tempMin: 7, tempMax: 13, ideal: 10, floc: "高", esters: "干净" }
        ],
        optional: [],
        tips: ["出口版本比标准Helles更浓郁！", "慕尼黑麦芽增加麦芽深度。"]
      },
      {
        id: "6A",
        flavorTags: ["琥珀", "优雅酒花", "中等", "中高", "焦糖"],
        name: "三月啤酒",
        nameEn: "Märzen",
        description: "传统慕尼黑啤酒节啤酒，琥珀色，麦芽浓郁，酒体饱满。",
        og: { min: 1.044, max: 1.050, target: 1.047 },
        fg: { min: 1.010, max: 1.014, target: 1.012 },
        ibu: { min: 22, max: 40, target: 31 },
        srm: { min: 2, max: 4, target: 3 },
        abv: { min: 4.4, max: 5.2, target: 4.8 },
        mashTemp: { min: 65, max: 68, ideal: 66 },
        mashTime: { min: 60, max: 90, ideal: 60 },
        boilTime: { min: 60, max: 90, ideal: 60 },
        fermentTemp: { min: 8, max: 12, ideal: 10 },
        fermentTime: { min: 14, max: 21, ideal: 17 },
        malts: [
          { name: "皮尔森麦芽", color: 1.8, gravity: 1.037, default: true },
          { name: "维也纳麦芽", color: 4.0, gravity: 1.036, default: true },
          { name: "慕尼黑麦芽", color: 8.0, gravity: 1.035, default: false }
        ],
        hops: [
          { name: "哈拉道", alpha: 5.0, type: "aroma", region: "德国" },
          { name: "泰南格", alpha: 4.5, type: "aroma", region: "德国" }
        ],
        yeasts: [
          { name: "德式拉格酵母", attenuation: 0.84, tempMin: 7, tempMax: 13, ideal: 10, floc: "高", esters: "干净" }
        ],
        optional: [],
        tips: ["三月啤酒是传统的啤酒节啤酒！", "维也纳麦芽带来面包般的琥珀色风味。"]
      },
      {
        id: "6B",
        flavorTags: ["琥珀", "低酒花", "中等", "低中", "烟熏"],
        name: "烟熏啤酒",
        nameEn: "Rauchbier",
        description: "班贝格特产，使用烟熏麦芽，培根般的烟熏风味。",
        og: { min: 1.050, max: 1.057, target: 1.054 },
        fg: { min: 1.012, max: 1.016, target: 1.014 },
        ibu: { min: 20, max: 30, target: 25 },
        srm: { min: 12, max: 22, target: 17 },
        abv: { min: 4.8, max: 6.0, target: 5.4 },
        mashTemp: { min: 65, max: 68, ideal: 66 },
        mashTime: { min: 60, max: 90, ideal: 60 },
        boilTime: { min: 60, max: 90, ideal: 60 },
        fermentTemp: { min: 8, max: 12, ideal: 10 },
        fermentTime: { min: 14, max: 21, ideal: 17 },
        malts: [
          { name: "皮尔森麦芽", color: 1.8, gravity: 1.037, default: true },
          { name: "慕尼黑麦芽", color: 8.0, gravity: 1.035, default: true }
        ],
        hops: [
          { name: "哈拉道", alpha: 5.0, type: "aroma", region: "德国" },
          { name: "泰南格", alpha: 4.5, type: "aroma", region: "德国" }
        ],
        yeasts: [
          { name: "德式拉格酵母", attenuation: 0.84, tempMin: 7, tempMax: 13, ideal: 10, floc: "高", esters: "干净" }
        ],
        optional: ["烟熏麦芽"],
        tips: ["烟熏啤酒的灵魂是烟熏麦芽！", "像培根一样的烟熏风味，爱的人很爱。"]
      },
      {
        id: "6C",
        flavorTags: ["深棕", "低酒花", "浓郁", "高度", "焦糖"],
        name: "深色博克",
        nameEn: "Dunkles Bock",
        description: "深色博克，焦糖麦芽甜香，酒体厚重，酒精温暖。",
        og: { min: 1.064, max: 1.072, target: 1.068 },
        fg: { min: 1.013, max: 1.019, target: 1.016 },
        ibu: { min: 20, max: 27, target: 24 },
        srm: { min: 14, max: 22, target: 18 },
        abv: { min: 6.3, max: 7.2, target: 6.8 },
        mashTemp: { min: 66, max: 68, ideal: 67 },
        mashTime: { min: 60, max: 90, ideal: 75 },
        boilTime: { min: 60, max: 120, ideal: 90 },
        fermentTemp: { min: 8, max: 12, ideal: 10 },
        fermentTime: { min: 21, max: 28, ideal: 24 },
        malts: [
          { name: "皮尔森麦芽", color: 1.8, gravity: 1.037, default: true },
          { name: "慕尼黑麦芽", color: 8.0, gravity: 1.035, default: true },
          { name: "焦糖麦芽60L", color: 60, gravity: 1.034, default: false }
        ],
        hops: [
          { name: "哈拉道", alpha: 5.0, type: "aroma", region: "德国" },
          { name: "泰南格", alpha: 4.5, type: "aroma", region: "德国" }
        ],
        yeasts: [
          { name: "德式拉格酵母", attenuation: 0.84, tempMin: 7, tempMax: 13, ideal: 10, floc: "高", esters: "干净" }
        ],
        optional: [],
        tips: ["深色博克需要长时间低温发酵，至少3周！", "慕尼黑麦芽带来浓郁的面包焦糖风味。"]
      },
      {
        id: "7B",
        flavorTags: ["清亮", "极低酒花", "中等", "低", "面包"],
        name: "德国老式啤酒",
        nameEn: "Altbier",
        description: "杜塞尔多夫特产，琥珀色，上层发酵但低温熟成，坚果焦糖风味。",
        og: { min: 1.048, max: 1.055, target: 1.051 },
        fg: { min: 1.010, max: 1.014, target: 1.012 },
        ibu: { min: 18, max: 30, target: 24 },
        srm: { min: 9, max: 15, target: 12 },
        abv: { min: 4.7, max: 5.5, target: 5.1 },
        mashTemp: { min: 65, max: 68, ideal: 66 },
        mashTime: { min: 60, max: 90, ideal: 60 },
        boilTime: { min: 60, max: 90, ideal: 60 },
        fermentTemp: { min: 13, max: 16, ideal: 14 },
        fermentTime: { min: 14, max: 21, ideal: 17 },
        malts: [
          { name: "皮尔森麦芽", color: 1.8, gravity: 1.037, default: true },
          { name: "慕尼黑麦芽", color: 8.0, gravity: 1.035, default: true }
        ],
        hops: [
          { name: "哈拉道", alpha: 5.0, type: "aroma", region: "德国" },
          { name: "泰南格", alpha: 4.5, type: "aroma", region: "德国" },
          { name: "斯帕尔特", alpha: 4.5, type: "aroma", region: "德国" }
        ],
        yeasts: [
          { name: "艾尔酵母", attenuation: 0.76, tempMin: 13, tempMax: 16, ideal: 14, floc: "高", esters: "干净" }
        ],
        optional: [],
        tips: ["老式啤酒是上层发酵但低温熟成，很独特！", "发酵温度14°C，介于艾尔和拉格之间。"]
      }
    ]
  },
  
  british: {
    styles: [
      {
        id: "12B",
        flavorTags: ["清亮", "极低酒花", "清爽", "低", "面包"],
        name: "澳大利亚气泡艾尔",
        nameEn: "Australian Sparkling Ale",
        description: "澳大利亚特产，高碳酸化，清爽果香，低苦度。",
        og: { min: 1.038, max: 1.053, target: 1.046 },
        fg: { min: 1.006, max: 1.012, target: 1.009 },
        ibu: { min: 20, max: 45, target: 32 },
        srm: { min: 2, max: 5, target: 3.5 },
        abv: { min: 3.8, max: 5.0, target: 4.4 },
        mashTemp: { min: 64, max: 66, ideal: 65 },
        mashTime: { min: 60, max: 90, ideal: 60 },
        boilTime: { min: 60, max: 90, ideal: 60 },
        fermentTemp: { min: 18, max: 22, ideal: 20 },
        fermentTime: { min: 7, max: 10, ideal: 8 },
        malts: [
          { name: "淡色麦芽", color: 2.0, gravity: 1.036, default: true },
          { name: "皮尔森麦芽", color: 1.8, gravity: 1.037, default: false }
        ],
        hops: [
          { name: "东肯特戈尔丁", alpha: 5.5, type: "aroma", region: "英国" },
          { name: "法格", alpha: 4.5, type: "aroma", region: "英国" }
        ],
        yeasts: [
          { name: "英式艾尔酵母", attenuation: 0.76, tempMin: 17, tempMax: 22, ideal: 20, floc: "高", esters: "核果" }
        ],
        optional: [],
        tips: ["澳大利亚气泡艾尔碳酸化水平很高！", "英式酵母带来核果酯香。"]
      },
      {
        id: "15B",
        flavorTags: ["黑色", "低酒花", "中等", "低", "咖啡"],
        name: "爱尔兰世涛",
        nameEn: "Irish Stout",
        description: "吉尼斯风格，深黑如夜，咖啡烘烤风味，奶油般口感。",
        og: { min: 1.036, max: 1.046, target: 1.041 },
        fg: { min: 1.010, max: 1.014, target: 1.012 },
        ibu: { min: 18, max: 28, target: 23 },
        srm: { min: 9, max: 14, target: 11.5 },
        abv: { min: 3.8, max: 5.0, target: 4.4 },
        mashTemp: { min: 66, max: 69, ideal: 67 },
        mashTime: { min: 60, max: 90, ideal: 60 },
        boilTime: { min: 60, max: 90, ideal: 60 },
        fermentTemp: { min: 18, max: 20, ideal: 19 },
        fermentTime: { min: 7, max: 10, ideal: 8 },
        malts: [
          { name: "淡色麦芽", color: 2.0, gravity: 1.036, default: true },
          { name: "烘烤大麦", color: 500, gravity: 1.025, default: true },
          { name: "焦糖麦芽60L", color: 60, gravity: 1.034, default: false }
        ],
        hops: [
          { name: "北唐", alpha: 10.0, type: "bittering", region: "英国" },
          { name: "法格", alpha: 4.5, type: "aroma", region: "英国" }
        ],
        yeasts: [
          { name: "英式艾尔酵母", attenuation: 0.76, tempMin: 17, tempMax: 22, ideal: 19, floc: "高", esters: "核果" }
        ],
        optional: ["乳糖"],
        tips: ["爱尔兰世涛的灵魂是烘烤大麦！", "氮气注入带来奶油般口感（游戏中模拟）。"]
      },
      {
        id: "16A",
        flavorTags: ["黑色", "极低酒花", "浓郁", "低", "巧克力"],
        name: "甜世涛",
        nameEn: "Sweet Stout",
        description: "乳糖增甜，深黑浓郁，咖啡巧克力与奶油甜味平衡。",
        og: { min: 1.044, max: 1.060, target: 1.052 },
        fg: { min: 1.012, max: 1.024, target: 1.018 },
        ibu: { min: 20, max: 40, target: 30 },
        srm: { min: 30, max: 40, target: 35 },
        abv: { min: 4.0, max: 6.0, target: 5.0 },
        mashTemp: { min: 67, max: 70, ideal: 68 },
        mashTime: { min: 60, max: 90, ideal: 60 },
        boilTime: { min: 60, max: 90, ideal: 60 },
        fermentTemp: { min: 18, max: 20, ideal: 19 },
        fermentTime: { min: 10, max: 14, ideal: 12 },
        malts: [
          { name: "淡色麦芽", color: 2.0, gravity: 1.036, default: true },
          { name: "烘烤大麦", color: 500, gravity: 1.025, default: true },
          { name: "巧克力麦芽", color: 350, gravity: 1.028, default: true },
          { name: "乳糖", color: 0, gravity: 1.040, default: true }
        ],
        hops: [
          { name: "北唐", alpha: 10.0, type: "bittering", region: "英国" },
          { name: "法格", alpha: 4.5, type: "aroma", region: "英国" }
        ],
        yeasts: [
          { name: "英式艾尔酵母", attenuation: 0.72, tempMin: 17, tempMax: 22, ideal: 19, floc: "高", esters: "核果" }
        ],
        optional: ["乳糖", "咖啡"],
        tips: ["甜世涛的灵魂是乳糖！酵母无法发酵乳糖，留下甜味。", "FG较高，酒体饱满。"]
      },
      {
        id: "16C",
        flavorTags: ["黑色", "低酒花", "浓郁", "低中", "热带水果"],
        name: "热带世涛",
        nameEn: "Tropical Stout",
        description: "热带地区版本世涛，甜度高，酒体厚重，烘烤风味浓郁。",
        og: { min: 1.045, max: 1.065, target: 1.055 },
        fg: { min: 1.010, max: 1.018, target: 1.014 },
        ibu: { min: 25, max: 40, target: 32 },
        srm: { min: 22, max: 40, target: 31 },
        abv: { min: 4.2, max: 5.9, target: 5.1 },
        mashTemp: { min: 66, max: 69, ideal: 67 },
        mashTime: { min: 60, max: 90, ideal: 60 },
        boilTime: { min: 60, max: 90, ideal: 60 },
        fermentTemp: { min: 18, max: 22, ideal: 20 },
        fermentTime: { min: 10, max: 14, ideal: 12 },
        malts: [
          { name: "淡色麦芽", color: 2.0, gravity: 1.036, default: true },
          { name: "烘烤大麦", color: 500, gravity: 1.025, default: true },
          { name: "巧克力麦芽", color: 350, gravity: 1.028, default: false }
        ],
        hops: [
          { name: "北唐", alpha: 10.0, type: "bittering", region: "英国" },
          { name: "法格", alpha: 4.5, type: "aroma", region: "英国" }
        ],
        yeasts: [
          { name: "英式艾尔酵母", attenuation: 0.76, tempMin: 17, tempMax: 22, ideal: 20, floc: "高", esters: "核果" }
        ],
        optional: ["咖啡", "乳糖"],
        tips: ["热带世涛比传统世涛更甜更厚重！", "适合热带气候饮用。"]
      },
      {
        id: "17B",
        flavorTags: ["深棕", "酒花香", "浓郁", "高度", "焦糖"],
        name: "老艾尔",
        nameEn: "Old Ale",
        description: "陈酿艾尔，氧化风味，干果蜜糖，酒精温暖，适合陈年。",
        og: { min: 1.055, max: 1.080, target: 1.067 },
        fg: { min: 1.015, max: 1.022, target: 1.018 },
        ibu: { min: 30, max: 60, target: 45 },
        srm: { min: 8, max: 22, target: 15 },
        abv: { min: 5.5, max: 8.0, target: 6.8 },
        mashTemp: { min: 66, max: 69, ideal: 67 },
        mashTime: { min: 60, max: 90, ideal: 75 },
        boilTime: { min: 60, max: 120, ideal: 90 },
        fermentTemp: { min: 18, max: 20, ideal: 19 },
        fermentTime: { min: 14, max: 21, ideal: 17 },
        malts: [
          { name: "淡色麦芽", color: 2.0, gravity: 1.036, default: true },
          { name: "慕尼黑麦芽", color: 8.0, gravity: 1.035, default: true },
          { name: "焦糖麦芽80L", color: 80, gravity: 1.034, default: false }
        ],
        hops: [
          { name: "东肯特戈尔丁", alpha: 5.5, type: "aroma", region: "英国" },
          { name: "法格", alpha: 4.5, type: "aroma", region: "英国" },
          { name: "挑战者", alpha: 8.0, type: "dual", region: "英国" }
        ],
        yeasts: [
          { name: "英式艾尔酵母", attenuation: 0.76, tempMin: 17, tempMax: 22, ideal: 19, floc: "高", esters: "核果" }
        ],
        optional: ["橡木片"],
        tips: ["老艾尔适合陈年，像红酒一样越放越好！", "氧化带来干果和雪莉酒风味。"]
      }
    ]
  },
  
  sour: {
    styles: [
      {
        id: "23F",
        flavorTags: ["清亮", "极低酒花", "清爽", "低", "水果"],
        name: "水果增味兰比克",
        nameEn: "Fruit Lambic",
        description: "传统兰比克加入水果陈酿，酸甜平衡，野菌复杂。",
        og: { min: 1.040, max: 1.054, target: 1.047 },
        fg: { min: 1.000, max: 1.006, target: 1.003 },
        ibu: { min: 0, max: 10, target: 5 },
        srm: { min: 5, max: 6, target: 5.5 },
        abv: { min: 5.0, max: 8.0, target: 6.5 },
        mashTemp: { min: 60, max: 65, ideal: 62 },
        mashTime: { min: 60, max: 90, ideal: 60 },
        boilTime: { min: 60, max: 180, ideal: 120 },
        fermentTemp: { min: 20, max: 25, ideal: 22 },
        fermentTime: { min: 30, max: 90, ideal: 60 },
        malts: [
          { name: "皮尔森麦芽", color: 1.8, gravity: 1.037, default: true },
          { name: "小麦麦芽", color: 2.0, gravity: 1.038, default: true }
        ],
        hops: [
          { name: "陈化酒花", alpha: 2.0, type: "aroma", region: "比利时" }
        ],
        yeasts: [
          { name: "混合培养物", attenuation: 0.88, tempMin: 18, tempMax: 26, ideal: 22, floc: "低", esters: "复杂" }
        ],
        optional: ["樱桃", "覆盆子", "桃子"],
        tips: ["兰比克需要长时间陈酿，至少6个月！", "陈化酒花提供防腐但不增加苦味。"]
      }
    ]
  },
  
  belgian: {
    styles: [
      {
        id: "25C",
        flavorTags: ["金黄", "低酒花", "干爽", "高度", "辛香"],
        name: "比利时金色烈性艾尔",
        nameEn: "Belgian Golden Strong Ale",
        description: "杜瓦尔风格，金黄透亮，高酒精度，辛香酯味，收口干脆。",
        og: { min: 1.048, max: 1.065, target: 1.056 },
        fg: { min: 1.002, max: 1.008, target: 1.005 },
        ibu: { min: 20, max: 35, target: 28 },
        srm: { min: 5, max: 14, target: 9.5 },
        abv: { min: 3.5, max: 5.0, target: 4.2 },
        mashTemp: { min: 63, max: 66, ideal: 64 },
        mashTime: { min: 60, max: 90, ideal: 60 },
        boilTime: { min: 60, max: 90, ideal: 60 },
        fermentTemp: { min: 20, max: 24, ideal: 22 },
        fermentTime: { min: 14, max: 21, ideal: 17 },
        malts: [
          { name: "皮尔森麦芽", color: 1.8, gravity: 1.037, default: true },
          { name: "糖", color: 0, gravity: 1.046, default: true }
        ],
        hops: [
          { name: "萨兹", alpha: 3.5, type: "aroma", region: "捷克" },
          { name: "施蒂里亚戈尔丁", alpha: 5.0, type: "aroma", region: "斯洛文尼亚" }
        ],
        yeasts: [
          { name: "修道院酵母", attenuation: 0.84, tempMin: 20, tempMax: 26, ideal: 24, floc: "中", esters: "复杂" }
        ],
        optional: [],
        tips: ["金色烈性艾尔需要加糖提高酒精度同时保持干爽！", "发酵温度22-24°C产生复杂辛香酯味。"]
      }
    ]
  }
};

// 合并到主数据库
let _merged = false;
function mergeExtendedStyles() {
  if (_merged) return;
  _merged = true;
  for (const family in BJCP_EXTENDED) {
    if (BJCP_STYLES[family]) {
      BJCP_STYLES[family].styles = BJCP_STYLES[family].styles.concat(BJCP_EXTENDED[family].styles);
    }
  }
  console.log('🍺 已加载扩展风格，总计:', Object.values(BJCP_STYLES).reduce((sum, f) => sum + f.styles.length, 0), '种');
}

// 页面加载时自动合并
if (typeof document !== 'undefined') {
  document.addEventListener('DOMContentLoaded', mergeExtendedStyles);
} else {
  // Node环境
  mergeExtendedStyles();
}

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BJCP_EXTENDED, mergeExtendedStyles };
}
