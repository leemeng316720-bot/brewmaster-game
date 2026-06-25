// BJCP 2021 精酿啤酒风格数据库 - 游戏用简化版
// 6大流派，每种2-3个代表风格

const BJCP_STYLES = {
  american: {
    name: "美式创新",
    emoji: "🇺🇸",
    description: "大胆奔放，酒花为王",
    brewer: {
      name: "杰克 (Jack)",
      avatar: "🧢",
      style: "T恤牛仔裤，棒球帽反戴",
      personality: "随性、大胆、爱创新",
      catchphrase: "多投点酒花，别怕！"
    },
    styles: [
      {
        id: "21A",
        flavorTags: ["清亮", "酒花香", "干爽", "中高", "柑橘"],
        name: "美式 IPA",
        nameEn: "American IPA",
        description: "酒花香气奔放，苦味清晰，麦芽支撑适中。美式精酿的标志性风格。",
        og: { min: 1.056, max: 1.070, target: 1.062 },
        fg: { min: 1.008, max: 1.016, target: 1.012 },
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
          { name: "淡色麦芽", color: 2.0, gravity: 1.036, default: true },
          { name: "焦糖麦芽40L", color: 40, gravity: 1.034, default: false },
          { name: "焦糖麦芽60L", color: 60, gravity: 1.034, default: false },
          { name: "小麦麦芽", color: 2.0, gravity: 1.038, default: false }
        ],
        hops: [
          { name: "卡斯卡特", alpha: 7.0, type: "aroma", region: "美国" },
          { name: "西楚", alpha: 13.0, type: "dual", region: "美国" },
          { name: "世纪", alpha: 10.5, type: "dual", region: "美国" },
          { name: "哥伦布", alpha: 15.0, type: "bittering", region: "美国" },
          { name: "马赛克", alpha: 12.0, type: "aroma", region: "美国" },
          { name: "银河", alpha: 14.0, type: "aroma", region: "澳大利亚" }
        ],
        yeasts: [
          { name: "美式艾尔酵母", attenuation: 0.76, tempMin: 16, tempMax: 22, ideal: 19, floc: "中", esters: "柑橘" }
        ],
        optional: ["干投酒花"],
        tips: [
          "美式IPA的灵魂是酒花，苦花60分钟投放，香花最后5分钟或干投！",
          "发酵温度控制在19°C左右，太高会产生杂醇味。",
          "OG不要低于1.056，否则酒体撑不起酒花苦味。"
        ]
      },
      {
        id: "21C",
        flavorTags: ["浑浊", "柔和", "果汁感", "中高", "热带水果"],
        name: "浑浊 IPA",
        nameEn: "Hazy IPA",
        description: "果汁感爆棚，酒体丝滑，苦度柔和，外观如橙汁般浑浊。",
        og: { min: 1.060, max: 1.085, target: 1.070 },
        fg: { min: 1.010, max: 1.020, target: 1.014 },
        ibu: { min: 20, max: 50, target: 35 },
        srm: { min: 4, max: 7, target: 5 },
        abv: { min: 6.0, max: 9.0, target: 7.5 },
        mashTemp: { min: 66, max: 69, ideal: 67 },
        mashTime: { min: 60, max: 90, ideal: 60 },
        boilTime: { min: 60, max: 90, ideal: 60 },
        fermentTemp: { min: 18, max: 22, ideal: 19 },
        fermentTime: { min: 10, max: 14, ideal: 12 },
        malts: [
          { name: "皮尔森麦芽", color: 1.8, gravity: 1.037, default: true },
          { name: "燕麦片", color: 1.0, gravity: 1.033, default: true },
          { name: "小麦麦芽", color: 2.0, gravity: 1.038, default: true },
          { name: "焦糖麦芽10L", color: 10, gravity: 1.035, default: false }
        ],
        hops: [
          { name: "西楚", alpha: 13.0, type: "dual", region: "美国" },
          { name: "马赛克", alpha: 12.0, type: "aroma", region: "美国" },
          { name: "银河", alpha: 14.0, type: "aroma", region: "澳大利亚" },
          { name: "尼尔森·索万", alpha: 12.0, type: "aroma", region: "新西兰" },
          { name: "瑞瓦卡", alpha: 13.0, type: "aroma", region: "新西兰" }
        ],
        yeasts: [
          { name: "英式艾尔酵母", attenuation: 0.72, tempMin: 17, tempMax: 22, ideal: 19, floc: "低", esters: "核果" },
          { name: "美式艾尔酵母", attenuation: 0.76, tempMin: 16, tempMax: 22, ideal: 19, floc: "中", esters: "柑橘" }
        ],
        optional: ["干投酒花", "生物转化干投"],
        tips: [
          "浑浊IPA需要大量干投，发酵中干投能产生生物转化，增加复杂度！",
          "燕麦和小麦麦芽是浑浊口感的关键，不要省略！",
          "苦度不要太高，果汁感才是重点。"
        ]
      },
      {
        id: "20C",
        flavorTags: ["黑色", "强烈苦味", "浓郁", "高度", "咖啡"],
        name: "帝国世涛",
        nameEn: "Imperial Stout",
        description: "深黑如夜，酒体厚重，咖啡巧克力风味浓郁，酒精温暖。",
        og: { min: 1.075, max: 1.115, target: 1.090 },
        fg: { min: 1.018, max: 1.030, target: 1.024 },
        ibu: { min: 50, max: 90, target: 70 },
        srm: { min: 30, max: 40, target: 35 },
        abv: { min: 8.0, max: 12.0, target: 10.0 },
        mashTemp: { min: 67, max: 70, ideal: 68 },
        mashTime: { min: 60, max: 90, ideal: 75 },
        boilTime: { min: 60, max: 120, ideal: 90 },
        fermentTemp: { min: 18, max: 20, ideal: 19 },
        fermentTime: { min: 14, max: 21, ideal: 18 },
        malts: [
          { name: "淡色麦芽", color: 2.0, gravity: 1.036, default: true },
          { name: "烘烤大麦", color: 500, gravity: 1.025, default: true },
          { name: "巧克力麦芽", color: 350, gravity: 1.028, default: true },
          { name: "焦糖麦芽80L", color: 80, gravity: 1.034, default: false },
          { name: "燕麦片", color: 1.0, gravity: 1.033, default: false },
          { name: "黑麦芽", color: 550, gravity: 1.025, default: false }
        ],
        hops: [
          { name: "马格努门", alpha: 14.0, type: "bittering", region: "德国" },
          { name: "世纪", alpha: 10.5, type: "dual", region: "美国" },
          { name: "哥伦布", alpha: 15.0, type: "bittering", region: "美国" },
          { name: "北唐", alpha: 10.0, type: "bittering", region: "英国" }
        ],
        yeasts: [
          { name: "美式艾尔酵母", attenuation: 0.76, tempMin: 16, tempMax: 22, ideal: 19, floc: "中", esters: "柑橘" },
          { name: "英式艾尔酵母", attenuation: 0.72, tempMin: 17, tempMax: 22, ideal: 19, floc: "高", esters: "核果" }
        ],
        optional: ["波本桶陈酿", "咖啡", "香草", "椰子"],
        tips: [
          "帝国世涛需要大量烘烤麦芽，但小心不要烤焦了，会发涩！",
          "高酒精度需要大量麦芽支撑，OG至少1.075。",
          "发酵温度不要太高，酒精味已经很重了。"
        ]
      }
    ]
  },

  german: {
    name: "德式经典",
    emoji: "🇩🇪",
    description: "麦芽纯净，工艺严谨，拉格为王",
    brewer: {
      name: "汉斯 (Hans)",
      avatar: "🍺",
      style: "皮围裙、八字胡、手持啤酒杯",
      personality: "严谨、精确、守规矩",
      catchphrase: "温度必须精确到度！"
    },
    styles: [
      {
        id: "5D",
        flavorTags: ["清亮", "优雅酒花", "干爽", "低中", "面包"],
        name: "德式皮尔森",
        nameEn: "German Pils",
        description: "金黄透亮，麦芽干净，酒花优雅，收口干脆。德国酿造工艺的典范。",
        og: { min: 1.044, max: 1.050, target: 1.047 },
        fg: { min: 1.008, max: 1.013, target: 1.010 },
        ibu: { min: 22, max: 40, target: 30 },
        srm: { min: 2, max: 5, target: 3 },
        abv: { min: 4.4, max: 5.2, target: 4.8 },
        mashTemp: { min: 63, max: 65, ideal: 64 },
        mashTime: { min: 60, max: 90, ideal: 60 },
        boilTime: { min: 60, max: 90, ideal: 90 },
        fermentTemp: { min: 8, max: 12, ideal: 10 },
        fermentTime: { min: 14, max: 21, ideal: 18 },
        malts: [
          { name: "皮尔森麦芽", color: 1.8, gravity: 1.037, default: true },
          { name: "维也纳麦芽", color: 4.0, gravity: 1.036, default: false },
          { name: "慕尼黑麦芽", color: 8.0, gravity: 1.035, default: false }
        ],
        hops: [
          { name: "哈拉道", alpha: 5.0, type: "aroma", region: "德国" },
          { name: "泰南格", alpha: 4.5, type: "aroma", region: "德国" },
          { name: "赫斯布鲁克", alpha: 4.0, type: "aroma", region: "德国" },
          { name: "马格努门", alpha: 14.0, type: "bittering", region: "德国" }
        ],
        yeasts: [
          { name: "德式拉格酵母", attenuation: 0.82, tempMin: 7, tempMax: 13, ideal: 10, floc: "高", esters: "干净" }
        ],
        optional: [],
        tips: [
          "皮尔森的灵魂是低温长时间发酵，至少14天！",
          "德国贵族酒花香气优雅，不要用美国酒花替代！",
          "糖化温度要低（64°C），保证发酵度。"
        ]
      },
      {
        id: "10A",
        flavorTags: ["浑浊", "低酒花", "丝滑", "低中", "香蕉丁香"],
        name: "德式小麦啤酒",
        nameEn: "Weissbier",
        description: "浑浊金黄，香蕉丁香香气，泡沫丰富，口感丝滑。巴伐利亚的骄傲。",
        og: { min: 1.044, max: 1.052, target: 1.048 },
        fg: { min: 1.010, max: 1.014, target: 1.012 },
        ibu: { min: 8, max: 15, target: 12 },
        srm: { min: 3, max: 9, target: 5 },
        abv: { min: 4.3, max: 5.6, target: 5.0 },
        mashTemp: { min: 63, max: 68, ideal: 65 },
        mashTime: { min: 60, max: 90, ideal: 60 },
        boilTime: { min: 60, max: 90, ideal: 60 },
        fermentTemp: { min: 17, max: 20, ideal: 18 },
        fermentTime: { min: 7, max: 10, ideal: 8 },
        malts: [
          { name: "小麦麦芽", color: 2.0, gravity: 1.038, default: true },
          { name: "皮尔森麦芽", color: 1.8, gravity: 1.037, default: true },
          { name: "慕尼黑麦芽", color: 8.0, gravity: 1.035, default: false }
        ],
        hops: [
          { name: "哈拉道", alpha: 5.0, type: "aroma", region: "德国" },
          { name: "泰南格", alpha: 4.5, type: "aroma", region: "德国" },
          { name: "赫斯布鲁克", alpha: 4.0, type: "aroma", region: "德国" }
        ],
        yeasts: [
          { name: "德式小麦酵母", attenuation: 0.75, tempMin: 17, tempMax: 22, ideal: 18, floc: "低", esters: "香蕉丁香" }
        ],
        optional: [],
        tips: [
          "小麦酵母是灵魂！发酵温度18°C能产生完美的香蕉丁香味！",
          "小麦麦芽比例要50%以上，否则不够正宗！",
          "苦度很低，酒花只是点缀，不要多投！"
        ]
      },
      {
        id: "4C",
        flavorTags: ["金黄", "优雅酒花", "浓郁", "中高", "焦糖"],
        name: "淡色博克",
        nameEn: "Helles Bock",
        description: "金黄色，麦芽浓郁，酒体饱满，酒精温暖但不刺激。修道院修士的斋戒酒。",
        og: { min: 1.064, max: 1.072, target: 1.068 },
        fg: { min: 1.011, max: 1.018, target: 1.014 },
        ibu: { min: 23, max: 35, target: 28 },
        srm: { min: 6, max: 11, target: 8 },
        abv: { min: 6.3, max: 7.4, target: 6.8 },
        mashTemp: { min: 65, max: 68, ideal: 66 },
        mashTime: { min: 60, max: 90, ideal: 75 },
        boilTime: { min: 60, max: 120, ideal: 90 },
        fermentTemp: { min: 8, max: 12, ideal: 10 },
        fermentTime: { min: 14, max: 28, ideal: 21 },
        malts: [
          { name: "皮尔森麦芽", color: 1.8, gravity: 1.037, default: true },
          { name: "慕尼黑麦芽", color: 8.0, gravity: 1.035, default: true },
          { name: "维也纳麦芽", color: 4.0, gravity: 1.036, default: false },
          { name: "焦糖麦芽20L", color: 20, gravity: 1.034, default: false }
        ],
        hops: [
          { name: "哈拉道", alpha: 5.0, type: "aroma", region: "德国" },
          { name: "泰南格", alpha: 4.5, type: "aroma", region: "德国" },
          { name: "马格努门", alpha: 14.0, type: "bittering", region: "德国" }
        ],
        yeasts: [
          { name: "德式拉格酵母", attenuation: 0.80, tempMin: 7, tempMax: 13, ideal: 10, floc: "高", esters: "干净" }
        ],
        optional: [],
        tips: [
          "博克需要长时间低温发酵，至少3周！",
          "慕尼黑麦芽带来面包般的麦芽风味，是博克的核心。",
          "酒精度高但收口要干净，不能有杂醇味。"
        ]
      }
    ]
  },

  belgian: {
    name: "比利时风情",
    emoji: "🇧🇪",
    description: "酵母复杂，香料丰富，修道院神秘",
    brewer: {
      name: "皮埃尔 (Pierre)",
      avatar: "⛪",
      style: "修道院长袍、念珠、神秘微笑",
      personality: "神秘、热情、爱讲故事",
      catchphrase: "酵母是啤酒的灵魂…"
    },
    styles: [
      {
        id: "24A",
        flavorTags: ["浑浊", "低酒花", "清爽", "低中", "香料"],
        name: "比利时小麦",
        nameEn: "Witbier",
        description: "浑浊苍白，香菜橙皮香气，清爽微酸，夏日最佳。",
        og: { min: 1.044, max: 1.050, target: 1.047 },
        fg: { min: 1.008, max: 1.012, target: 1.010 },
        ibu: { min: 10, max: 20, target: 15 },
        srm: { min: 2, max: 4, target: 3 },
        abv: { min: 4.5, max: 5.5, target: 5.0 },
        mashTemp: { min: 63, max: 66, ideal: 65 },
        mashTime: { min: 60, max: 90, ideal: 60 },
        boilTime: { min: 60, max: 90, ideal: 60 },
        fermentTemp: { min: 18, max: 22, ideal: 20 },
        fermentTime: { min: 7, max: 10, ideal: 8 },
        malts: [
          { name: "皮尔森麦芽", color: 1.8, gravity: 1.037, default: true },
          { name: "小麦麦芽", color: 2.0, gravity: 1.038, default: true },
          { name: "燕麦片", color: 1.0, gravity: 1.033, default: false },
          { name: "焦糖麦芽10L", color: 10, gravity: 1.035, default: false }
        ],
        hops: [
          { name: "萨兹", alpha: 3.5, type: "aroma", region: "捷克" },
          { name: "哈拉道", alpha: 5.0, type: "aroma", region: "德国" },
          { name: "东肯特戈尔丁", alpha: 5.5, type: "aroma", region: "英国" }
        ],
        yeasts: [
          { name: "比利时小麦酵母", attenuation: 0.76, tempMin: 18, tempMax: 24, ideal: 20, floc: "低", esters: "辛香" }
        ],
        optional: ["香菜籽", "橙皮", "黄瓜"],
        tips: [
          "香菜籽和橙皮是比利时小麦的灵魂香料，不要省略！",
          "发酵温度20°C能产生完美的辛香酯味！",
          "苦度很低，酒花只是背景。"
        ]
      },
      {
        id: "25B",
        flavorTags: ["清亮", "优雅酒花", "干爽", "中高", "辛香"],
        name: "赛松",
        nameEn: "Saison",
        description: "干爽辛辣，果香酯味，农舍气息，收口极其干脆。农夫的解渴酒。",
        og: { min: 1.048, max: 1.065, target: 1.055 },
        fg: { min: 1.002, max: 1.008, target: 1.005 },
        ibu: { min: 20, max: 35, target: 28 },
        srm: { min: 5, max: 14, target: 8 },
        abv: { min: 5.0, max: 7.0, target: 6.0 },
        mashTemp: { min: 62, max: 65, ideal: 63 },
        mashTime: { min: 60, max: 90, ideal: 60 },
        boilTime: { min: 60, max: 90, ideal: 60 },
        fermentTemp: { min: 18, max: 25, ideal: 22 },
        fermentTime: { min: 10, max: 14, ideal: 12 },
        malts: [
          { name: "皮尔森麦芽", color: 1.8, gravity: 1.037, default: true },
          { name: "小麦麦芽", color: 2.0, gravity: 1.038, default: false },
          { name: "慕尼黑麦芽", color: 8.0, gravity: 1.035, default: false },
          { name: "焦糖麦芽20L", color: 20, gravity: 1.034, default: false },
          { name: "糖", color: 0, gravity: 1.046, default: false }
        ],
        hops: [
          { name: "萨兹", alpha: 3.5, type: "aroma", region: "捷克" },
          { name: "东肯特戈尔丁", alpha: 5.5, type: "aroma", region: "英国" },
          { name: "斯特林", alpha: 7.0, type: "aroma", region: "美国" }
        ],
        yeasts: [
          { name: "赛松酵母", attenuation: 0.88, tempMin: 18, tempMax: 28, ideal: 22, floc: "中", esters: "辛香果香" },
          { name: "比利时艾尔酵母", attenuation: 0.78, tempMin: 18, tempMax: 24, ideal: 22, floc: "中", esters: "辛香" }
        ],
        optional: ["黑胡椒", "橙皮", "香菜籽"],
        tips: [
          "赛松要发酵到极干，FG低于1.008是目标！",
          "发酵温度可以很高（22-25°C），赛松酵母耐热！",
          "糖化温度要低（63°C），保证高发酵度。"
        ]
      },
      {
        id: "26C",
        flavorTags: ["金黄", "低酒花", "浓郁", "高度", "焦糖"],
        name: "修道院三料",
        nameEn: "Belgian Tripel",
        description: "金黄透亮，复杂酯香，酒精温暖，收口干脆。修道院的巅峰之作。",
        og: { min: 1.075, max: 1.085, target: 1.080 },
        fg: { min: 1.008, max: 1.014, target: 1.011 },
        ibu: { min: 20, max: 40, target: 30 },
        srm: { min: 4.5, max: 6, target: 5 },
        abv: { min: 7.5, max: 9.5, target: 8.5 },
        mashTemp: { min: 63, max: 66, ideal: 65 },
        mashTime: { min: 60, max: 90, ideal: 60 },
        boilTime: { min: 60, max: 90, ideal: 60 },
        fermentTemp: { min: 20, max: 24, ideal: 22 },
        fermentTime: { min: 14, max: 21, ideal: 18 },
        malts: [
          { name: "皮尔森麦芽", color: 1.8, gravity: 1.037, default: true },
          { name: "糖", color: 0, gravity: 1.046, default: true },
          { name: "慕尼黑麦芽", color: 8.0, gravity: 1.035, default: false }
        ],
        hops: [
          { name: "萨兹", alpha: 3.5, type: "aroma", region: "捷克" },
          { name: "泰南格", alpha: 4.5, type: "aroma", region: "德国" },
          { name: "施蒂里亚戈尔丁", alpha: 5.0, type: "aroma", region: "斯洛文尼亚" }
        ],
        yeasts: [
          { name: "比利时艾尔酵母", attenuation: 0.78, tempMin: 18, tempMax: 24, ideal: 22, floc: "中", esters: "辛香" },
          { name: "修道院酵母", attenuation: 0.80, tempMin: 20, tempMax: 26, ideal: 24, floc: "中", esters: "复杂" }
        ],
        optional: ["橙皮", "香菜籽"],
        tips: [
          "三料需要加糖来提高酒精度同时保持干爽！",
          "发酵温度22-24°C能产生复杂的辛香酯味！",
          "皮尔森麦芽是基础，不要用太深的麦芽。"
        ]
      }
    ]
  },

  british: {
    name: "英伦传统",
    emoji: "🇬🇧",
    description: "麦芽焦香，酒体醇厚，历史悠长",
    brewer: {
      name: "亚瑟 (Arthur)",
      avatar: "🎩",
      style: "粗花呢外套、平顶帽、绅士风度",
      personality: "传统、绅士、讲究历史",
      catchphrase: "经典配方永不过时。"
    },
    styles: [
      {
        id: "13C",
        flavorTags: ["深棕", "低酒花", "中等", "低", "烘烤"],
        name: "英式波特",
        nameEn: "English Porter",
        description: "深棕至黑色，烤面包和咖啡风味，酒体中等，温和易饮。伦敦工人的最爱。",
        og: { min: 1.030, max: 1.040, target: 1.035 },
        fg: { min: 1.008, max: 1.014, target: 1.011 },
        ibu: { min: 18, max: 35, target: 25 },
        srm: { min: 20, max: 30, target: 25 },
        abv: { min: 3.0, max: 4.2, target: 3.6 },
        mashTemp: { min: 65, max: 68, ideal: 66 },
        mashTime: { min: 60, max: 90, ideal: 60 },
        boilTime: { min: 60, max: 90, ideal: 60 },
        fermentTemp: { min: 18, max: 20, ideal: 19 },
        fermentTime: { min: 7, max: 10, ideal: 8 },
        malts: [
          { name: "淡色麦芽", color: 2.0, gravity: 1.036, default: true },
          { name: "棕色麦芽", color: 65, gravity: 1.032, default: true },
          { name: "巧克力麦芽", color: 350, gravity: 1.028, default: false },
          { name: "焦糖麦芽60L", color: 60, gravity: 1.034, default: false },
          { name: "烘烤大麦", color: 500, gravity: 1.025, default: false }
        ],
        hops: [
          { name: "东肯特戈尔丁", alpha: 5.5, type: "aroma", region: "英国" },
          { name: "法格", alpha: 4.5, type: "aroma", region: "英国" },
          { name: "北唐", alpha: 10.0, type: "bittering", region: "英国" }
        ],
        yeasts: [
          { name: "英式艾尔酵母", attenuation: 0.72, tempMin: 17, tempMax: 22, ideal: 19, floc: "高", esters: "核果" }
        ],
        optional: [],
        tips: [
          "英式波特是社交啤酒，ABV不要太高！",
          "棕色麦芽带来独特的饼干和坚果风味。",
          "英式酵母产生核果酯味，是英式风格的标志。"
        ]
      },
      {
        id: "16B",
        flavorTags: ["黑色", "低酒花", "丝滑", "低中", "咖啡"],
        name: "燕麦世涛",
        nameEn: "Oatmeal Stout",
        description: "深黑如夜，燕麦带来丝滑口感，咖啡巧克力风味，酒体饱满。早餐啤酒。",
        og: { min: 1.045, max: 1.065, target: 1.055 },
        fg: { min: 1.010, max: 1.020, target: 1.015 },
        ibu: { min: 25, max: 40, target: 32 },
        srm: { min: 22, max: 40, target: 30 },
        abv: { min: 3.8, max: 6.0, target: 5.0 },
        mashTemp: { min: 66, max: 69, ideal: 67 },
        mashTime: { min: 60, max: 90, ideal: 60 },
        boilTime: { min: 60, max: 90, ideal: 60 },
        fermentTemp: { min: 18, max: 20, ideal: 19 },
        fermentTime: { min: 10, max: 14, ideal: 12 },
        malts: [
          { name: "淡色麦芽", color: 2.0, gravity: 1.036, default: true },
          { name: "烘烤大麦", color: 500, gravity: 1.025, default: true },
          { name: "巧克力麦芽", color: 350, gravity: 1.028, default: true },
          { name: "燕麦片", color: 1.0, gravity: 1.033, default: true },
          { name: "焦糖麦芽80L", color: 80, gravity: 1.034, default: false }
        ],
        hops: [
          { name: "东肯特戈尔丁", alpha: 5.5, type: "aroma", region: "英国" },
          { name: "法格", alpha: 4.5, type: "aroma", region: "英国" },
          { name: "北唐", alpha: 10.0, type: "bittering", region: "英国" }
        ],
        yeasts: [
          { name: "英式艾尔酵母", attenuation: 0.72, tempMin: 17, tempMax: 22, ideal: 19, floc: "高", esters: "核果" }
        ],
        optional: ["咖啡", "乳糖"],
        tips: [
          "燕麦片是灵魂！至少10%比例，带来丝滑口感。",
          "烘烤麦芽不要太多，否则会发涩。",
          "英式酵母的核果酯味和烘烤麦芽很搭。"
        ]
      },
      {
        id: "17D",
        flavorTags: ["深棕", "酒花香", "浓郁", "高度", "焦糖"],
        name: "英式大麦酒",
        nameEn: "English Barleywine",
        description: "深琥珀至铜色，麦芽浓郁如蜜糖，酒体厚重，酒精温暖，适合陈年。",
        og: { min: 1.080, max: 1.120, target: 1.100 },
        fg: { min: 1.018, max: 1.030, target: 1.024 },
        ibu: { min: 35, max: 60, target: 48 },
        srm: { min: 8, max: 22, target: 14 },
        abv: { min: 8.0, max: 12.0, target: 10.0 },
        mashTemp: { min: 66, max: 69, ideal: 67 },
        mashTime: { min: 60, max: 90, ideal: 75 },
        boilTime: { min: 60, max: 120, ideal: 90 },
        fermentTemp: { min: 18, max: 20, ideal: 19 },
        fermentTime: { min: 14, max: 28, ideal: 21 },
        malts: [
          { name: "淡色麦芽", color: 2.0, gravity: 1.036, default: true },
          { name: "慕尼黑麦芽", color: 8.0, gravity: 1.035, default: true },
          { name: "焦糖麦芽60L", color: 60, gravity: 1.034, default: false },
          { name: "焦糖麦芽80L", color: 80, gravity: 1.034, default: false },
          { name: "糖", color: 0, gravity: 1.046, default: false }
        ],
        hops: [
          { name: "东肯特戈尔丁", alpha: 5.5, type: "aroma", region: "英国" },
          { name: "法格", alpha: 4.5, type: "aroma", region: "英国" },
          { name: "北唐", alpha: 10.0, type: "bittering", region: "英国" },
          { name: "挑战者", alpha: 8.0, type: "dual", region: "英国" }
        ],
        yeasts: [
          { name: "英式艾尔酵母", attenuation: 0.72, tempMin: 17, tempMax: 22, ideal: 19, floc: "高", esters: "核果" }
        ],
        optional: ["橡木片"],
        tips: [
          "大麦酒需要大量麦芽，OG至少1.080！",
          "长时间煮沸（90分钟）能浓缩麦芽风味。",
          "可以陈年，像红酒一样越放越好喝。"
        ]
      }
    ]
  },

  czech: {
    name: "捷克拉格",
    emoji: "🇨🇿",
    description: "酒花优雅，口感清爽，金色传奇",
    brewer: {
      name: "雅罗斯拉夫 (Jaroslav)",
      avatar: "🍻",
      style: "传统服饰、皮帽、朴实笑容",
      personality: "朴实、专注、耐心",
      catchphrase: "好酒需要耐心等待。"
    },
    styles: [
      {
        id: "3B",
        flavorTags: ["清亮", "优雅酒花", "干爽", "低中", "面包"],
        name: "捷克优质淡色拉格",
        nameEn: "Czech Premium Pale Lager",
        description: "金黄透亮，萨兹酒花优雅花香，麦芽干净，苦度圆润。啤酒之王。",
        og: { min: 1.044, max: 1.060, target: 1.050 },
        fg: { min: 1.013, max: 1.017, target: 1.015 },
        ibu: { min: 30, max: 45, target: 38 },
        srm: { min: 3.5, max: 6, target: 4.5 },
        abv: { min: 4.2, max: 5.8, target: 5.0 },
        mashTemp: { min: 63, max: 65, ideal: 64 },
        mashTime: { min: 60, max: 90, ideal: 60 },
        boilTime: { min: 60, max: 90, ideal: 90 },
        fermentTemp: { min: 8, max: 12, ideal: 10 },
        fermentTime: { min: 14, max: 21, ideal: 18 },
        malts: [
          { name: "皮尔森麦芽", color: 1.8, gravity: 1.037, default: true },
          { name: "慕尼黑麦芽", color: 8.0, gravity: 1.035, default: false },
          { name: "焦糖麦芽20L", color: 20, gravity: 1.034, default: false }
        ],
        hops: [
          { name: "萨兹", alpha: 3.5, type: "aroma", region: "捷克" },
          { name: "斯拉德克", alpha: 5.5, type: "dual", region: "捷克" },
          { name: "普雷米安特", alpha: 8.0, type: "dual", region: "捷克" }
        ],
        yeasts: [
          { name: "捷克拉格酵母", attenuation: 0.78, tempMin: 7, tempMax: 13, ideal: 10, floc: "高", esters: "干净" }
        ],
        optional: [],
        tips: [
          "萨兹酒花是灵魂！它的花香和辛香无可替代！",
          "捷克皮尔森的FG偏高（1.013+），这是特点不是缺陷！",
          "软水很重要，高硫酸盐水会让酒花变粗糙。"
        ]
      },
      {
        id: "3D",
        flavorTags: ["深棕", "优雅酒花", "中等", "低中", "焦糖"],
        name: "捷克深色拉格",
        nameEn: "Czech Dark Lager",
        description: "深琥珀至黑色，焦糖麦芽甜香，酒花苦度平衡，收口干净。",
        og: { min: 1.044, max: 1.060, target: 1.050 },
        fg: { min: 1.012, max: 1.018, target: 1.015 },
        ibu: { min: 18, max: 34, target: 25 },
        srm: { min: 14, max: 25, target: 18 },
        abv: { min: 4.4, max: 5.8, target: 5.0 },
        mashTemp: { min: 65, max: 68, ideal: 66 },
        mashTime: { min: 60, max: 90, ideal: 60 },
        boilTime: { min: 60, max: 90, ideal: 60 },
        fermentTemp: { min: 8, max: 12, ideal: 10 },
        fermentTime: { min: 14, max: 21, ideal: 18 },
        malts: [
          { name: "皮尔森麦芽", color: 1.8, gravity: 1.037, default: true },
          { name: "慕尼黑麦芽", color: 8.0, gravity: 1.035, default: true },
          { name: "焦糖麦芽80L", color: 80, gravity: 1.034, default: true },
          { name: "烘烤大麦", color: 500, gravity: 1.025, default: false }
        ],
        hops: [
          { name: "萨兹", alpha: 3.5, type: "aroma", region: "捷克" },
          { name: "斯拉德克", alpha: 5.5, type: "dual", region: "捷克" }
        ],
        yeasts: [
          { name: "捷克拉格酵母", attenuation: 0.78, tempMin: 7, tempMax: 13, ideal: 10, floc: "高", esters: "干净" }
        ],
        optional: [],
        tips: [
          "深色拉格不是世涛！焦糖甜香是重点，不要烤焦了。",
          "苦度比淡色版本低，让麦芽甜味更突出。",
          "发酵温度保持10°C，拉格酵母喜欢冷。"
        ]
      }
    ]
  },

  sour: {
    name: "酸啤野菌",
    emoji: "🍇",
    description: "酸味明亮，野菌 funky，自然发酵",
    brewer: {
      name: "玛格丽特 (Margaret)",
      avatar: "🔬",
      style: "实验室白大褂、护目镜、好奇眼神",
      personality: "科学、好奇、严谨",
      catchphrase: "野菌需要温柔对待。"
    },
    styles: [
      {
        id: "23A",
        flavorTags: ["浑浊", "极低酒花", "清爽", "低", "酸"],
        name: "柏林酸小麦",
        nameEn: "Berliner Weisse",
        description: "苍白浑浊，乳酸明亮酸味，清爽如柠檬水，酒精极低。夏日解渴神器。",
        og: { min: 1.028, max: 1.032, target: 1.030 },
        fg: { min: 1.003, max: 1.006, target: 1.004 },
        ibu: { min: 3, max: 8, target: 5 },
        srm: { min: 2, max: 3, target: 2.5 },
        abv: { min: 2.8, max: 3.8, target: 3.2 },
        mashTemp: { min: 60, max: 65, ideal: 63 },
        mashTime: { min: 60, max: 90, ideal: 60 },
        boilTime: { min: 15, max: 30, ideal: 15 },
        fermentTemp: { min: 20, max: 22, ideal: 21 },
        fermentTime: { min: 3, max: 7, ideal: 5 },
        malts: [
          { name: "皮尔森麦芽", color: 1.8, gravity: 1.037, default: true },
          { name: "小麦麦芽", color: 2.0, gravity: 1.038, default: true }
        ],
        hops: [
          { name: "萨兹", alpha: 3.5, type: "aroma", region: "捷克" },
          { name: "哈拉道", alpha: 5.0, type: "aroma", region: "德国" }
        ],
        yeasts: [
          { name: "乳酸菌", attenuation: 0.90, tempMin: 20, tempMax: 30, ideal: 21, floc: "低", esters: "乳酸" },
          { name: "艾尔酵母", attenuation: 0.80, tempMin: 15, tempMax: 22, ideal: 21, floc: "中", esters: "干净" }
        ],
        optional: ["水果糖浆", "覆盆子", "百香果"],
        tips: [
          "柏林酸小麦的酸味来自乳酸菌，不是醋酸！",
          "煮沸只需15分钟，酒花只是防腐，不要苦味！",
          "发酵温度21°C，乳酸菌喜欢温暖。"
        ]
      },
      {
        id: "23G",
        flavorTags: ["清亮", "极低酒花", "干爽", "低中", "野菌"],
        name: "古兹",
        nameEn: "Gose",
        description: "苍白至淡金，乳酸酸味，香菜籽辛香，海盐微咸，极其清爽。德国传统酸啤。",
        og: { min: 1.036, max: 1.056, target: 1.045 },
        fg: { min: 1.004, max: 1.010, target: 1.007 },
        ibu: { min: 5, max: 15, target: 10 },
        srm: { min: 3, max: 7, target: 4 },
        abv: { min: 4.0, max: 6.0, target: 5.0 },
        mashTemp: { min: 60, max: 65, ideal: 63 },
        mashTime: { min: 60, max: 90, ideal: 60 },
        boilTime: { min: 60, max: 90, ideal: 60 },
        fermentTemp: { min: 20, max: 25, ideal: 22 },
        fermentTime: { min: 7, max: 14, ideal: 10 },
        malts: [
          { name: "皮尔森麦芽", color: 1.8, gravity: 1.037, default: true },
          { name: "小麦麦芽", color: 2.0, gravity: 1.038, default: true },
          { name: "盐", color: 0, gravity: 0, default: true }
        ],
        hops: [
          { name: "萨兹", alpha: 3.5, type: "aroma", region: "捷克" },
          { name: "哈拉道", alpha: 5.0, type: "aroma", region: "德国" }
        ],
        yeasts: [
          { name: "乳酸菌", attenuation: 0.90, tempMin: 20, tempMax: 30, ideal: 22, floc: "低", esters: "乳酸" },
          { name: "艾尔酵母", attenuation: 0.80, tempMin: 15, tempMax: 22, ideal: 22, floc: "中", esters: "干净" }
        ],
        optional: ["香菜籽", "海盐", "水果"],
        tips: [
          "古兹需要加盐和香菜籽，这是它的标志！",
          "盐不要太多，微咸即可，太多会难喝。",
          "乳酸菌先发酵，艾尔酵母后发酵，顺序很重要！"
        ]
      },
      {
        id: "28A",
        flavorTags: ["清亮", "低酒花", "干爽", "低中", "野菌"],
        name: "布雷特啤酒",
        nameEn: "Brett Beer",
        description: "各种颜色，布雷特酵母带来皮革、农舍、热带水果的复杂风味。野菌入门。",
        og: { min: 1.040, max: 1.080, target: 1.060 },
        fg: { min: 1.002, max: 1.012, target: 1.006 },
        ibu: { min: 10, max: 40, target: 25 },
        srm: { min: 3, max: 30, target: 12 },
        abv: { min: 4.0, max: 10.0, target: 6.5 },
        mashTemp: { min: 62, max: 66, ideal: 64 },
        mashTime: { min: 60, max: 90, ideal: 60 },
        boilTime: { min: 60, max: 90, ideal: 60 },
        fermentTemp: { min: 20, max: 25, ideal: 22 },
        fermentTime: { min: 30, max: 90, ideal: 60 },
        malts: [
          { name: "皮尔森麦芽", color: 1.8, gravity: 1.037, default: true },
          { name: "淡色麦芽", color: 2.0, gravity: 1.036, default: false },
          { name: "小麦麦芽", color: 2.0, gravity: 1.038, default: false },
          { name: "焦糖麦芽40L", color: 40, gravity: 1.034, default: false }
        ],
        hops: [
          { name: "萨兹", alpha: 3.5, type: "aroma", region: "捷克" },
          { name: "东肯特戈尔丁", alpha: 5.5, type: "aroma", region: "英国" },
          { name: "世纪", alpha: 10.5, type: "dual", region: "美国" }
        ],
        yeasts: [
          { name: "布雷特酵母", attenuation: 0.90, tempMin: 18, tempMax: 28, ideal: 22, floc: "低", esters: "农舍皮革" },
          { name: "混合培养物", attenuation: 0.85, tempMin: 18, tempMax: 26, ideal: 22, floc: "低", esters: "复杂" }
        ],
        optional: ["橡木片", "水果", "陈酿时间"],
        tips: [
          "布雷特酵母发酵很慢，需要耐心等待2-3个月！",
          "布雷特会把酒发酵得很干，FG通常低于1.010。",
          "不要用你酿其他酒的设备，布雷特很难清除！"
        ]
      }
    ]
  }
};

// 通用原料库（用于计算）
const INGREDIENTS = {
  malts: {
    "皮尔森麦芽": { ppg: 37, color: 1.8, category: "基础" },
    "淡色麦芽": { ppg: 36, color: 2.0, category: "基础" },
    "小麦麦芽": { ppg: 38, color: 2.0, category: "基础" },
    "慕尼黑麦芽": { ppg: 35, color: 8.0, category: "特色" },
    "维也纳麦芽": { ppg: 36, color: 4.0, category: "特色" },
    "焦糖麦芽10L": { ppg: 35, color: 10, category: "焦糖" },
    "焦糖麦芽20L": { ppg: 34, color: 20, category: "焦糖" },
    "焦糖麦芽40L": { ppg: 34, color: 40, category: "焦糖" },
    "焦糖麦芽60L": { ppg: 34, color: 60, category: "焦糖" },
    "焦糖麦芽80L": { ppg: 34, color: 80, category: "焦糖" },
    "巧克力麦芽": { ppg: 28, color: 350, category: "烘烤" },
    "烘烤大麦": { ppg: 25, color: 500, category: "烘烤" },
    "黑麦芽": { ppg: 25, color: 550, category: "烘烤" },
    "棕色麦芽": { ppg: 32, color: 65, category: "烘烤" },
    "燕麦片": { ppg: 33, color: 1.0, category: "辅料" },
    "乳糖": { ppg: 40, color: 0, category: "辅料" },
    "糖": { ppg: 46, color: 0, category: "辅料" },
    "盐": { ppg: 0, color: 0, category: "辅料" }
  },
  hops: {
    "卡斯卡特": { alpha: 7.0, region: "美国", type: "aroma" },
    "西楚": { alpha: 13.0, region: "美国", type: "dual" },
    "世纪": { alpha: 10.5, region: "美国", type: "dual" },
    "哥伦布": { alpha: 15.0, region: "美国", type: "bittering" },
    "马赛克": { alpha: 12.0, region: "美国", type: "aroma" },
    "银河": { alpha: 14.0, region: "澳大利亚", type: "aroma" },
    "尼尔森·索万": { alpha: 12.0, region: "新西兰", type: "aroma" },
    "瑞瓦卡": { alpha: 13.0, region: "新西兰", type: "aroma" },
    "马格努门": { alpha: 14.0, region: "德国", type: "bittering" },
    "哈拉道": { alpha: 5.0, region: "德国", type: "aroma" },
    "泰南格": { alpha: 4.5, region: "德国", type: "aroma" },
    "赫斯布鲁克": { alpha: 4.0, region: "德国", type: "aroma" },
    "萨兹": { alpha: 3.5, region: "捷克", type: "aroma" },
    "斯拉德克": { alpha: 5.5, region: "捷克", type: "dual" },
    "普雷米安特": { alpha: 8.0, region: "捷克", type: "dual" },
    "东肯特戈尔丁": { alpha: 5.5, region: "英国", type: "aroma" },
    "法格": { alpha: 4.5, region: "英国", type: "aroma" },
    "北唐": { alpha: 10.0, region: "英国", type: "bittering" },
    "挑战者": { alpha: 8.0, region: "英国", type: "dual" },
    "斯特林": { alpha: 7.0, region: "美国", type: "aroma" },
    "施蒂里亚戈尔丁": { alpha: 5.0, region: "斯洛文尼亚", type: "aroma" },
    "斯帕尔特": { alpha: 4.5, region: "德国", type: "aroma" },
    "陈化酒花": { alpha: 2.0, region: "比利时", type: "aroma" }
  },
  yeasts: {
    "美式艾尔酵母": { attenuation: 0.80, tempMin: 16, tempMax: 22, esters: "柑橘" },
    "英式艾尔酵母": { attenuation: 0.76, tempMin: 17, tempMax: 22, esters: "核果" },
    "德式拉格酵母": { attenuation: 0.84, tempMin: 7, tempMax: 13, esters: "干净" },
    "捷克拉格酵母": { attenuation: 0.82, tempMin: 7, tempMax: 13, esters: "干净" },
    "德式小麦酵母": { attenuation: 0.78, tempMin: 17, tempMax: 22, esters: "香蕉丁香" },
    "比利时小麦酵母": { attenuation: 0.78, tempMin: 18, tempMax: 24, esters: "辛香" },
    "赛松酵母": { attenuation: 0.90, tempMin: 18, tempMax: 28, esters: "辛香果香" },
    "比利时艾尔酵母": { attenuation: 0.82, tempMin: 18, tempMax: 24, esters: "辛香" },
    "修道院酵母": { attenuation: 0.84, tempMin: 20, tempMax: 26, esters: "复杂" },
    "布雷特酵母": { attenuation: 0.92, tempMin: 18, tempMax: 28, esters: "农舍皮革" },
    "混合培养物": { attenuation: 0.88, tempMin: 18, tempMax: 26, esters: "复杂" },
    "乳酸菌": { attenuation: 0.92, tempMin: 20, tempMax: 30, esters: "乳酸" },
    "艾尔酵母": { attenuation: 0.82, tempMin: 15, tempMax: 22, esters: "干净" }
  }
};

// 导出
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { BJCP_STYLES, INGREDIENTS };
}
