/**
 * 区域新型电力系统 · 碳感知计算与决策平台
 * 核心生产业务数据库与时空模型资产
 * 场景基准：上海临港新型电力系统示范区（源-网-荷-储-充）
 * 排放核算基准：生态环境部2024年官方电力碳足迹因子公告
 */

window.CARBON_DATA = {
  // 1. 系统元信息与运行时配置
  meta: {
    systemName: "国网区域新型电力系统 · 碳感知计算与决策平台",
    subTitle: "Carbon-Aware Computing & Attribution Platform for Regional Power Systems",
    regionName: "上海临港新片区综合能源示范区",
    dataResolution: "时空精度: 15秒 / 100m² 网格",
    blockchainNode: "国网可信区块链 (沪东节点 #0472)",
    standardRef: "MEE-2024-CF / ISO-14064-1 / IEC-61850-90-8",
    systemVersion: "v3.4.1-Release (Build 2026.09)"
  },

  // 2. 生态环境部2024官方基准碳排放因子库 (kgCO₂e/kWh 及 gCO₂/kWh)
  emissionFactorLib: [
    { type: "燃煤发电", fuel: "coal", code: "GEN-COAL", factor: 0.9240, unit: "kgCO₂e/kWh", gCO2: 924.0, authority: "生态环境部2024官方公报", status: "现行基准", certLevel: "国家一级" },
    { type: "燃气发电", fuel: "gas", code: "GEN-GAS", factor: 0.4503, unit: "kgCO₂e/kWh", gCO2: 450.3, authority: "生态环境部2024官方公报", status: "现行基准", certLevel: "国家一级" },
    { type: "海上风电", fuel: "wind", code: "GEN-WIND", factor: 0.0324, unit: "kgCO₂e/kWh", gCO2: 32.4, authority: "全生命周期LCA核算规程", status: "现行基准", certLevel: "绿电认证" },
    { type: "分布式光伏", fuel: "solar", code: "GEN-SOLAR", factor: 0.0200, unit: "kgCO₂e/kWh", gCO2: 20.0, authority: "全生命周期LCA核算规程", status: "现行基准", certLevel: "绿电认证" },
    { type: "水力发电", fuel: "hydro", code: "GEN-HYDRO", factor: 0.0141, unit: "kgCO₂e/kWh", gCO2: 14.1, authority: "生态环境部2024官方公报", status: "现行基准", certLevel: "绿电认证" },
    { type: "核能发电", fuel: "nuclear", code: "GEN-NUC", factor: 0.0065, unit: "kgCO₂e/kWh", gCO2: 6.5, authority: "生态环境部2024官方公报", status: "现行基准", certLevel: "清洁基荷" },
    { type: "全国电网平均", fuel: "grid", code: "GRID-AVG", factor: 0.5777, unit: "kgCO₂e/kWh", gCO2: 577.7, authority: "国标GB/T 32150-2024", status: "统计基准", certLevel: "电网标杆" },
    { type: "华东区域电网", fuel: "regional", code: "GRID-EC", factor: 0.5500, unit: "kgCO₂e/kWh", gCO2: 550.0, authority: "区域电网折算基准", status: "现行基准", certLevel: "华东标底" }
  ],

  // 3. 24小时分时物理出力与动态碳因子（时序曲线）
  // 满足物理规律：白日光伏高发动态碳因子谷底 (400左右)，晚高峰火电顶峰升至720
  timeseries24h: [
    { time: "00:00", coal: 350, gas: 100, wind: 150, solar: 0, load: 550, ef: 640.2, cemsCo2: 368.4, temp: 22.4, windSpeed: 6.2, solarRad: 0 },
    { time: "02:00", coal: 300, gas: 80, wind: 180, solar: 0, load: 500, ef: 591.4, cemsCo2: 313.2, temp: 21.8, windSpeed: 6.8, solarRad: 0 },
    { time: "04:00", coal: 310, gas: 70, wind: 170, solar: 0, load: 490, ef: 605.1, cemsCo2: 318.0, temp: 21.2, windSpeed: 6.4, solarRad: 0 },
    { time: "06:00", coal: 400, gas: 120, wind: 120, solar: 10, load: 600, ef: 679.5, cemsCo2: 423.6, temp: 23.1, windSpeed: 5.8, solarRad: 85 },
    { time: "08:00", coal: 500, gas: 150, wind: 100, solar: 80, load: 750, ef: 686.9, cemsCo2: 529.5, temp: 26.5, windSpeed: 4.9, solarRad: 340 },
    { time: "10:00", coal: 350, gas: 100, wind: 90, solar: 250, load: 700, ef: 478.2, cemsCo2: 368.4, temp: 29.8, windSpeed: 4.2, solarRad: 690 },
    { time: "12:00", coal: 280, gas: 80, wind: 80, solar: 320, load: 680, ef: 398.6, cemsCo2: 294.7, temp: 32.1, windSpeed: 3.8, solarRad: 880 },
    { time: "14:00", coal: 300, gas: 90, wind: 100, solar: 280, load: 700, ef: 443.1, cemsCo2: 317.7, temp: 31.8, windSpeed: 4.5, solarRad: 750 },
    { time: "16:00", coal: 380, gas: 120, wind: 110, solar: 150, load: 720, ef: 572.8, cemsCo2: 405.1, temp: 29.4, windSpeed: 5.1, solarRad: 380 },
    { time: "18:00", coal: 550, gas: 180, wind: 90, solar: 20, load: 800, ef: 721.5, cemsCo2: 589.2, temp: 27.6, windSpeed: 5.7, solarRad: 45 },
    { time: "20:00", coal: 500, gas: 160, wind: 100, solar: 0, load: 720, ef: 702.3, cemsCo2: 534.0, temp: 26.0, windSpeed: 6.1, solarRad: 0 },
    { time: "22:00", coal: 400, gas: 120, wind: 140, solar: 0, load: 600, ef: 651.2, cemsCo2: 423.6, temp: 24.5, windSpeed: 6.5, solarRad: 0 }
  ],

  // 4. 六大多源异质数据源运行状态与接入指标看板
  dataSources: [
    {
      id: "ds-01",
      name: "EMS 机组遥测与热工监测系统",
      code: "EMS-DCS-NODE",
      category: "发电侧结构化流",
      protocol: "OPC UA / IEC 61850",
      frequency: "15 秒",
      todayVolume: "1,247,680",
      throughput: "3,480 条/秒",
      latency: "18 ms",
      health: 99.94,
      status: "RUNNING",
      statusText: "实时吞吐正常",
      metrics: "火电/燃气出力、煤耗率、主蒸汽温度、炉膛热工状态"
    },
    {
      id: "ds-02",
      name: "SCADA 电网拓扑与全网潮流系统",
      code: "SCADA-EMS-EAST",
      category: "电网侧拓扑与时序",
      protocol: "IEC 60870-5-104",
      frequency: "30 秒",
      todayVolume: "892,400",
      throughput: "2,120 条/秒",
      latency: "24 ms",
      health: 99.88,
      status: "RUNNING",
      statusText: "母线潮流平衡",
      metrics: "220kV/110kV母线电压、线路有功/无功、网架拓扑态势"
    },
    {
      id: "ds-03",
      name: "CEMS 烟气排放连续在线监测系统",
      code: "CEMS-ENV-ONLINE",
      category: "环保实测直采流",
      protocol: "HJ/T 212-2017 / MQTT",
      frequency: "60 秒",
      todayVolume: "198,600",
      throughput: "450 条/秒",
      latency: "45 ms",
      health: 99.72,
      status: "RUNNING",
      statusText: "双探头校准通过",
      metrics: "脱硫脱硝排口CO₂容积比、干基烟气标态流量、氧含量"
    },
    {
      id: "ds-04",
      name: "临港海上风电与分布式光伏集群",
      code: "RENEWABLE-CLUSTER",
      category: "新能源群测群控",
      protocol: "REST API / Modbus TCP",
      frequency: "5 分钟",
      todayVolume: "124,560",
      throughput: "320 条/秒",
      latency: "120 ms",
      health: 98.45,
      status: "WARNING",
      statusText: "海缆东侧轻微延时",
      metrics: "风速切入切出状态、轮毂转速、组串辐照度、阵列反照率"
    },
    {
      id: "ds-05",
      name: "高精度微气象与辐射遥感数值预报",
      code: "METEO-ERA5-PRO",
      category: "气象感知与空间反演",
      protocol: "gRPC / NetCDF4 API",
      frequency: "15 分钟",
      todayVolume: "24,800",
      throughput: "110 条/秒",
      latency: "85 ms",
      health: 99.90,
      status: "RUNNING",
      statusText: "中尺度模式平稳",
      metrics: "2m环境气温、地表总辐照度GHI、10m风向风速矢量场"
    },
    {
      id: "ds-06",
      name: "全国碳排放权交易系统 (CEA 行情)",
      code: "CETS-MARKET-FEED",
      category: "碳交易与配额清算",
      protocol: "HTTPS / FIX Protocol",
      frequency: "实时撮合 / 日结",
      todayVolume: "12,650",
      throughput: "45 笔/分",
      latency: "32 ms",
      health: 100.0,
      status: "RUNNING",
      statusText: "收盘撮合完成",
      metrics: "CEA综合价格(82.40元/吨)、换手率、大宗协议转让"
    }
  ],

  // 5. 跨源多维特征关联发现网络 (HGSL & TransTab 引擎)
  crossSourceAssociations: [
    {
      id: "rel-01",
      headEntity: "机组煤质低位发热量 (NCV)",
      relation: "强关联驱动 (因果反比)",
      tailEntity: "CEMS排口瞬时碳排放强度",
      confidence: 0.942,
      sourceFrom: "EMS煤化验台账",
      sourceTo: "CEMS烟气实测",
      method: "TransTab语义编码 + HGSL自演化",
      validation: "物理热力学定律校验 PASS",
      isNewlyDiscovered: false
    },
    {
      id: "rel-02",
      headEntity: "微气象局域地表温度 (+3.2℃)",
      relation: "跨源滞后诱发 (滞后22分钟)",
      tailEntity: "智算中心与工业制冷负荷脉冲",
      confidence: 0.918,
      sourceFrom: "微气象高精度网格",
      sourceTo: "电网AMI计量表计",
      method: "DTW动态时间弯曲 + 互信息对齐",
      validation: "空调冷负荷模型校验 PASS",
      isNewlyDiscovered: true
    },
    {
      id: "rel-03",
      headEntity: "海上风电场出力骤降 (42MW/h)",
      relation: "网架潮流互补与爬坡补偿",
      tailEntity: "#2燃气机组快速二次调频出力",
      confidence: 0.895,
      sourceFrom: "新能源SCADA",
      sourceTo: "机组DCS控制流",
      method: "HGSL异质图拓扑推演",
      validation: "电网潮流功率守恒 PASS",
      isNewlyDiscovered: false
    },
    {
      id: "rel-04",
      headEntity: "全网动态碳因子谷底阶段 (400g/kWh)",
      relation: "协同调度响应引导 (隐式对齐)",
      tailEntity: "企业C (数据中心) 批处理任务错峰调度",
      confidence: 0.884,
      sourceFrom: "动态碳因子计算引擎",
      sourceTo: "企业能管能效系统",
      method: "跨模态联合潜空间投影",
      validation: "碳交易收益核算 PASS",
      isNewlyDiscovered: true
    },
    {
      id: "rel-05",
      headEntity: "220kV中心变电站母线潮流",
      relation: "拓扑辐射分流与碳流分配",
      tailEntity: "东区/西区变电站节点碳流率",
      confidence: 0.966,
      sourceFrom: "SCADA状态估计",
      sourceTo: "碳排放流分析引擎",
      method: "电力碳排放流理论矩阵映射",
      validation: "基尔霍夫碳流守恒律 PASS",
      isNewlyDiscovered: false
    },
    {
      id: "rel-06",
      headEntity: "全国碳市场CEA配额结算周期",
      relation: "合规边际成本约束",
      tailEntity: "企业A (化工联合体) 自备机组掺烧比",
      confidence: 0.853,
      sourceFrom: "全国碳交易行情",
      sourceTo: "ERP生产运行排程",
      method: "RotatE复数空间嵌入挖掘",
      validation: "业务合规约束方程 PASS",
      isNewlyDiscovered: true
    }
  ],

  // 6. 时空多模态动态融合流（融合前与融合后指标对比）
  fusionPerformance: {
    dataCompletenessBefore: "87.4%",
    dataCompletenessAfter: "99.6%",
    timeAlignmentErrorBefore: "±42.5 秒",
    timeAlignmentErrorAfter: "< 1.2 秒",
    fusionDelay: "1.65 秒",
    spatialInterpolationAccuracy: "96.8%",
    moeRouter: {
      temporalExpertWeight: 64.2, // 时间序列微观波动专家
      spatialExpertWeight: 35.8,  // 空间区域拓扑扩散专家
      activeState: "双专家自适应协同平衡"
    }
  },

  // 7. 电力全环节碳排放知识图谱设计 (18实体 + 20核心关系)
  knowledgeGraph: {
    categories: [
      { name: "物理机组与场站", itemStyle: { color: "#ef4444" } },
      { name: "输变电电网设施", itemStyle: { color: "#06b6d4" } },
      { name: "用电终端企业", itemStyle: { color: "#8b5cf6" } },
      { name: "能源与燃料本体", itemStyle: { color: "#f59e0b" } },
      { name: "政策与核算标准", itemStyle: { color: "#10b981" } },
      { name: "电碳市场指标", itemStyle: { color: "#ec4899" } }
    ],
    nodes: [
      // 发电侧实体
      { id: "G1", name: "#1超临界燃煤机组", category: 0, symbolSize: 52, fuel: "动力煤", capacity: "600 MW", ef: "924 gCO₂/kWh", location: "临港电厂一期", cemsStatus: "双探头正常" },
      { id: "G2", name: "#2联合循环燃气机组", category: 0, symbolSize: 46, fuel: "天然气", capacity: "400 MW", ef: "450 gCO₂/kWh", location: "临港燃气调峰", cemsStatus: "探头在线" },
      { id: "G3", name: "临港近海海上风电场", category: 0, symbolSize: 42, fuel: "风能(零碳)", capacity: "120 MW", ef: "32 gCO₂/kWh", location: "杭州湾北部海域", cemsStatus: "免检绿电" },
      { id: "G4", name: "综合保税区分布式光伏", category: 0, symbolSize: 38, fuel: "太阳能(零碳)", capacity: "50 MW", ef: "20 gCO₂/kWh", location: "保税区屋顶集群", cemsStatus: "免检绿电" },

      // 电网侧设施
      { id: "S1", name: "220kV 中心变电站", category: 1, symbolSize: 50, voltage: "220 kV", capacity: "3×240 MVA", carbonInflow: "492 tCO₂/h", lossRate: "0.82%", checkStatus: "流入流出完全守恒" },
      { id: "S2", name: "110kV 东区枢纽站", category: 1, symbolSize: 44, voltage: "110 kV", capacity: "2×63 MVA", carbonInflow: "284 tCO₂/h", lossRate: "0.76%", checkStatus: "平衡校验通过" },
      { id: "S3", name: "110kV 西区枢纽站", category: 1, symbolSize: 44, voltage: "110 kV", capacity: "2×63 MVA", carbonInflow: "196 tCO₂/h", lossRate: "0.79%", checkStatus: "平衡校验通过" },

      // 用电终端侧
      { id: "C1", name: "企业A (先进高精化工)", category: 2, symbolSize: 48, industry: "化学原料制造", maxLoad: "200 MW", curLoad: "168 MW", carbonIntensity: "520 gCO₂/kWh", quotaUsed: "64.2%" },
      { id: "C2", name: "企业B (智能重型制造)", category: 2, symbolSize: 44, industry: "高端装备工业", maxLoad: "150 MW", curLoad: "124 MW", carbonIntensity: "485 gCO₂/kWh", quotaUsed: "58.1%" },
      { id: "C3", name: "企业C (临云绿色智算中心)", category: 2, symbolSize: 44, industry: "IDC算力集群", maxLoad: "100 MW", curLoad: "88 MW", carbonIntensity: "398 gCO₂/kWh", quotaUsed: "47.5%" },

      // 燃料实体
      { id: "F1", name: "标准动力煤 (5000大卡)", category: 3, symbolSize: 34, ncv: "20.93 MJ/kg", efDefault: "924 g/kWh", carbonRatio: "54.8%" },
      { id: "F2", name: "管输天然气", category: 3, symbolSize: 34, ncv: "38.93 MJ/m³", efDefault: "450 g/kWh", carbonRatio: "32.1%" },
      { id: "F3", name: "海上风力动能", category: 3, symbolSize: 30, ncv: "自然动能", efDefault: "32 g/kWh", carbonRatio: "0%" },
      { id: "F4", name: "太阳能辐照流", category: 3, symbolSize: 30, ncv: "光量子能", efDefault: "20 g/kWh", carbonRatio: "0%" },

      // 政策与规程实体
      { id: "P1", name: "2024年电力碳足迹因子公告", category: 4, symbolSize: 36, org: "中华人民共和国生态环境部", docCode: "国环规气候〔2024〕12号", effectiveDate: "2024-06" },
      { id: "P2", name: "上海碳排放权交易管理办法", category: 4, symbolSize: 36, org: "上海市生态环境局", docCode: "沪环规〔2023〕8号", effectiveDate: "2023-12" },

      // 电碳数据与市场指标
      { id: "E1", name: "示范区动态碳因子结算中心", category: 5, symbolSize: 42, curValue: "520.4 gCO₂/kWh", updateFreq: "15秒滚动", algo: "源荷潮流加权算法" },
      { id: "Q1", name: "全国碳排放配额 (CEA)", category: 5, symbolSize: 38, price: "82.40 元/吨", turnover: "18.4 万吨/日", benchmark: "生态环境部基准配额" }
    ],
    links: [
      // 物理供电与拓扑关系
      { source: "G1", target: "S1", relation: "物理并网供电", carbonFlow: "323.4 tCO₂/h", powerFlow: "350 MW", lineType: "220kV出线" },
      { source: "G2", target: "S1", relation: "物理并网供电", carbonFlow: "45.0 tCO₂/h", powerFlow: "100 MW", lineType: "220kV出线" },
      { source: "G3", target: "S2", relation: "清洁绿电汇聚", carbonFlow: "4.8 tCO₂/h", powerFlow: "150 MW", lineType: "110kV海缆联络线" },
      { source: "G4", target: "S3", relation: "分布式消纳供电", carbonFlow: "0.8 tCO₂/h", powerFlow: "40 MW", lineType: "35kV环网" },
      { source: "S1", target: "S2", relation: "主干高压输电", carbonFlow: "182.5 tCO₂/h", powerFlow: "220 MW", lineType: "220kV联络双线" },
      { source: "S1", target: "S3", relation: "主干高压输电", carbonFlow: "135.2 tCO₂/h", powerFlow: "160 MW", lineType: "220kV联络双线" },
      { source: "S2", target: "C1", relation: "重工业直供专线", carbonFlow: "118.2 tCO₂/h", powerFlow: "140 MW", lineType: "110kV专线" },
      { source: "S2", target: "C2", relation: "产业园区专线", carbonFlow: "72.4 tCO₂/h", powerFlow: "95 MW", lineType: "110kV专线" },
      { source: "S3", target: "C3", relation: "智算专属双回路", carbonFlow: "41.6 tCO₂/h", powerFlow: "88 MW", lineType: "110kV专线" },

      // 燃料供给与利用
      { source: "G1", target: "F1", relation: "主消耗燃料", spec: "超临界煤粉直吹式" },
      { source: "G2", target: "F2", relation: "主消耗燃料", spec: "F级燃气轮机联合循环" },
      { source: "G3", target: "F3", relation: "利用一次能源", spec: "海上直驱永磁风电机组" },
      { source: "G4", target: "F4", relation: "利用一次能源", spec: "N型TOPCon高效光伏组件" },

      // 因子与政策约束关系
      { source: "F1", target: "E1", relation: "基准因子映射", weight: 0.9240 },
      { source: "F2", target: "E1", relation: "基准因子映射", weight: 0.4503 },
      { source: "P1", target: "E1", relation: "法定规程约束", detail: "确立2024最新官方碳足迹核算方法" },
      { source: "P2", target: "C1", relation: "重点纳管履约", detail: "年排放量超2.6万吨重点监控" },
      { source: "P2", target: "C2", relation: "能耗双控考核", detail: "单位工业增加值能耗强度约束" },
      { source: "Q1", target: "P2", relation: "交易市场支撑", detail: "碳排放权交易配额清缴抵销机制" },
      { source: "E1", target: "C3", relation: "动态碳核算反馈", detail: "提供15分钟级动态电碳因子账单" }
    ]
  },

  // 8. 企业穿透式用电碳足迹精准核算账本
  enterpriseAccounting: {
    C1: {
      enterpriseId: "C1",
      name: "企业A · 临港先进高精化工联合体",
      industry: "化学原料与合成材料制造",
      monthlyPowerUsage: "120,960 MWh",
      totalCarbonEmissions: "62,899.2 tCO₂",
      averageCarbonIntensity: "520.0 gCO₂/kWh",
      greenPowerShare: "16.8%",
      sourceBreakdown: [
        { source: "#1超临界燃煤机组", share: 64.5, power: "78,019 MWh", ef: 924, emissions: "72,089 tCO₂" },
        { source: "#2联合循环燃气机组", share: 18.7, power: "22,620 MWh", ef: 450, emissions: "10,179 tCO₂" },
        { source: "海上风电与分布式光伏", share: 16.8, power: "20,321 MWh", ef: 28, emissions: "569 tCO₂" }
      ],
      quotaCompliance: {
        allocatedQuota: "75,000 tCO₂/月",
        consumedQuota: "62,899.2 tCO₂",
        usagePercent: 83.87,
        status: "SAFE_COMPLIANT",
        statusText: "配额健康充足 (结余 12,100.8 吨)"
      },
      traceRoute: ["#1火电 / #2燃气机组", "220kV中心站(S1)", "110kV东区站(S2)", "企业专用降压变", "聚合车间电碳表计"],
      auditProofHash: "0x8fa910e34c990b712fa998a4e32dca917721860a9f",
      auditAgency: "国网上海电科院碳计量检测认证中心"
    },
    C2: {
      enterpriseId: "C2",
      name: "企业B · 临港高端智能装备重工基地",
      industry: "高端数控机床与海洋装备制造",
      monthlyPowerUsage: "89,280 MWh",
      totalCarbonEmissions: "43,211.5 tCO₂",
      averageCarbonIntensity: "484.0 gCO₂/kWh",
      greenPowerShare: "24.2%",
      sourceBreakdown: [
        { source: "#1超临界燃煤机组", share: 55.4, power: "49,461 MWh", ef: 924, emissions: "45,702 tCO₂" },
        { source: "#2联合循环燃气机组", share: 20.4, power: "18,213 MWh", ef: 450, emissions: "8,196 tCO₂" },
        { source: "海上风电与分布式光伏", share: 24.2, power: "21,606 MWh", ef: 28, emissions: "605 tCO₂" }
      ],
      quotaCompliance: {
        allocatedQuota: "52,000 tCO₂/月",
        consumedQuota: "43,211.5 tCO₂",
        usagePercent: 83.10,
        status: "SAFE_COMPLIANT",
        statusText: "配额健康充足 (结余 8,788.5 吨)"
      },
      traceRoute: ["#1火电 / 海上风电(G3)", "220kV中心站(S1)", "110kV东区站(S2)", "智能产线总配电箱"],
      auditProofHash: "0x3bc7211904a8e80718dca318e90bb24401884f18d7",
      auditAgency: "国网上海电科院碳计量检测认证中心"
    },
    C3: {
      enterpriseId: "C3",
      name: "企业C · 临云绿色智算中心 (AIDC)",
      industry: "人工智能与大规模超算集群",
      monthlyPowerUsage: "63,360 MWh",
      totalCarbonEmissions: "25,217.3 tCO₂",
      averageCarbonIntensity: "398.0 gCO₂/kWh",
      greenPowerShare: "41.5%",
      sourceBreakdown: [
        { source: "#1超临界燃煤机组", share: 38.5, power: "24,394 MWh", ef: 924, emissions: "22,540 tCO₂" },
        { source: "#2联合循环燃气机组", share: 20.0, power: "12,672 MWh", ef: 450, emissions: "5,702 tCO₂" },
        { source: "海上风电与分布式光伏", share: 41.5, power: "26,294 MWh", ef: 28, emissions: "736 tCO₂" }
      ],
      quotaCompliance: {
        allocatedQuota: "38,000 tCO₂/月",
        consumedQuota: "25,217.3 tCO₂",
        usagePercent: 66.36,
        status: "GREEN_EXEMPLAR",
        statusText: "标杆示范企业 (结余 12,782.7 吨)"
      },
      traceRoute: ["海上风电(G3) / 分布式光伏(G4)", "220kV中心站(S1)", "110kV西区站(S3)", "AIDC变配电单元"],
      auditProofHash: "0x11e405a769018bdf88231aa49219bfe728001d29fa",
      auditAgency: "国家能效与绿色数据中心测评室"
    }
  },

  // 9. 因果图推理与关键影响因子定量归因三大典型运行场景
  reasoningScenarios: [
    {
      id: "scene-01",
      title: "场景一：盛夏持续高温引发区域电网碳强度脉冲式抬升",
      targetQuery: "诊断分析 2026-07-18 14:00 区域综合动态碳因子异常升至 720 gCO₂/kWh 的深层归因",
      pathDescription: "微气象气温异常高企 (+3.8℃) → 空调制冷集中负荷激增 (+180MW) → 新能源消纳已至极值 → #1火电与#2燃气机组二次调频爬坡补充 → 区域综合碳排放通量激增",
      pathSteps: [
        { step: 1, node: "微气象空间网格", state: "地表气温达到 36.8℃ (异常阈值 +3.8℃)", probability: 0.96 },
        { step: 2, node: "企业A/B民商集中负荷", state: "暖通中央空调负荷突增 180 MW", probability: 0.92 },
        { step: 3, node: "海上风电与光伏场站", state: "海上轻风无风，风电出力回落 38%", probability: 0.88 },
        { step: 4, node: "#1火电机组 / #2燃气机组", state: "调度调用高碳化石基荷机组顶峰出力至 92% 额定容量", probability: 0.94 },
        { step: 5, node: "区域动态碳因子输出", state: "电碳强度由 480 gCO₂/kWh 脉冲式抬升至 721.5 gCO₂/kWh", probability: 0.98 }
      ],
      ruleActivations: [
        { rule: "R-101: 极端气温 → 敏感情境负荷跃阶 (置信度 0.94)", impact: 0.44 },
        { rule: "R-204: 间歇性新能源受阻 → 增量化石调峰补偿 (置信度 0.91)", impact: 0.32 },
        { rule: "R-305: 高碳机组爬坡率 → 排放流率线性传导 (置信度 0.96)", impact: 0.18 },
        { rule: "R-402: 线路轻载损耗增益波动 (置信度 0.62)", impact: 0.06 }
      ],
      topFactors: [
        { rank: 1, name: "微气象高温引发空调降温负荷激增", contribution: 44.2, confidence: 0.92, category: "气象与负荷突变" },
        { rank: 2, name: "海上风电场风速骤降导致零碳电力缺口", contribution: 31.8, confidence: 0.89, category: "新能源间歇性" },
        { rank: 3, name: "火电顶峰机组比重被动拉升", contribution: 18.0, confidence: 0.95, category: "电源结构退化" },
        { rank: 4, name: "高负荷下变电线损边际上升", contribution: 6.0, confidence: 0.81, category: "网络输配损耗" }
      ],
      decisionAdvice: "建议通过需求侧响应 (DR) 引导智算中心转移高负载算力任务至夜间，并启动临港综合储能电站 30MW/60MWh 顶峰削峰，预计可平抑碳强度 142 gCO₂/kWh。"
    },
    {
      id: "scene-02",
      title: "场景二：沿海低风速窗口期新能源脱网与电网碳流重构",
      targetQuery: "定量归因 2026-08-04 19:30 新能源消纳占比由 35% 骤降至 9% 的碳排放连锁效应",
      pathDescription: "近海季风衰减断档 → 海上风电场群功率降落落差达 110MW → 储能电站SOC受限 → 主网调入高比例火电潮流 → 东区/西区变电站节点碳流率全线反弹",
      pathSteps: [
        { step: 1, node: "近海微气象浮标", state: "海平面10米风速从 8.5m/s 骤降至 1.8m/s (低于切入风速)", probability: 0.98 },
        { step: 2, node: "临港近海海上风电", state: "机组大面积切出，有效出力由 120MW 归落至 18MW", probability: 0.95 },
        { step: 3, node: "临港分布式储能", state: "储能系统SOC达 15% 截止放电阈值，无法持续支撑缺口", probability: 0.89 },
        { step: 4, node: "中心变电站受进潮流", state: "调度下达外网高碳火电重载输送指令", probability: 0.93 },
        { step: 5, node: "用电终端碳账单", state: "企业A/B实时用电折算碳因子单小时抬升 36.5%", probability: 0.97 }
      ],
      ruleActivations: [
        { rule: "R-202: 新能源急速跌落 → 惯量备用启动约束 (置信度 0.95)", impact: 0.52 },
        { rule: "R-310: 外网火电潮流代偿 → 节点碳流率扩散 (置信度 0.92)", impact: 0.30 },
        { rule: "R-108: 储能边际衰减效应 (置信度 0.84)", impact: 0.14 },
        { rule: "R-405: 辅机能耗附加损耗 (置信度 0.65)", impact: 0.04 }
      ],
      topFactors: [
        { rank: 1, name: "近海风速骤降致使海上风电出力跌落", contribution: 52.4, confidence: 0.96, category: "自然资源突变" },
        { rank: 2, name: "外部电网常规火电替代输入量激增", contribution: 29.6, confidence: 0.93, category: "潮流路径重构" },
        { rank: 3, name: "本地储能深度放电达下限无法补充", contribution: 14.1, confidence: 0.88, category: "灵活性资源受限" },
        { rank: 4, name: "区域电网潮流无功重分配线损增加", contribution: 3.9, confidence: 0.79, category: "网架运行损耗" }
      ],
      decisionAdvice: "建议联调临港深水港光伏屋顶与港口岸电双向V2G回馈，并在次日计划中提升区域气电响应权重以替代重煤电代偿。"
    },
    {
      id: "scene-03",
      title: "场景三：火电机组燃料批次热值偏离导致吨电碳强度异动",
      targetQuery: "溯源核实 #1火电机组在额定工况下单位发电碳排放偏离设计基准 +8.6% 的机理成因",
      pathDescription: "入炉动力煤热值由 5100 kcal/kg 跌落至 4420 kcal/kg → 锅炉燃烧不充分与飞灰可燃物抬升 → 供电标准煤耗上升 28g/kWh → CEMS连续监测CO₂通量超常",
      pathSteps: [
        { step: 1, node: "燃料输煤与混配仓", state: "新批次进口褐煤混掺入炉，实测收到基低位发热量 18.5 MJ/kg", probability: 0.97 },
        { step: 2, node: "锅炉燃烧热力系统", state: "炉膛火焰中心偏移，排烟温度抬升 12℃，热效率下降 2.4%", probability: 0.94 },
        { step: 3, node: "给煤机与送风机", state: "给煤量被迫增加 11.2% 以维持 400MW 额定负荷", probability: 0.93 },
        { step: 4, node: "CEMS 烟气在线监测", state: "排口烟气CO₂浓度均值升至 14.8%，小时碳通量超标", probability: 0.98 },
        { step: 5, node: "机组实时排放因子", state: "机组实测碳强度从 924 g/kWh 异常走高至 1003.5 g/kWh", probability: 0.99 }
      ],
      ruleActivations: [
        { rule: "R-501: 燃料发热量偏离 → 燃烧效率与供电煤耗非线性恶化 (置信度 0.98)", impact: 0.61 },
        { rule: "R-504: 助燃配风扰动 → 不完全燃烧产物增加 (置信度 0.88)", impact: 0.23 },
        { rule: "R-302: 机组低效区运行附加碳排放 (置信度 0.82)", impact: 0.12 },
        { rule: "R-601: 脱硫脱硝系统厂用电率抬升 (置信度 0.70)", impact: 0.04 }
      ],
      topFactors: [
        { rank: 1, name: "入炉煤批次低位发热量(NCV)大幅低于配煤设计值", contribution: 61.2, confidence: 0.97, category: "原料品质劣变" },
        { rank: 2, name: "过量空气系数与炉膛配风不匹配致热损失增大", contribution: 22.8, confidence: 0.90, category: "热工燃烧工况" },
        { rank: 3, name: "制粉系统单耗增加导致厂用电率升高", contribution: 11.9, confidence: 0.85, category: "厂用电消耗" },
        { rank: 4, name: "环保脱硫浆液循环泵全开附加能耗", contribution: 4.1, confidence: 0.76, category: "环保辅助系统" }
      ],
      decisionAdvice: "建议电厂燃料运行部立即切回高热值优质烟煤仓底配比，优化二次风门开度，并通报上海环境能源交易所锁定批次排放数据核查。"
    }
  ]
};
