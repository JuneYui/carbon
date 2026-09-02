/**
 * 区域新型电力系统 · 碳感知计算与决策平台
 * 高级数据可视化与图谱计算引擎 (ECharts 5.x + HTML5 Canvas 拓扑场)
 */

window.CARBON_CHARTS = {
  instances: {},
  canvasAnimId: null,

  // 1. 初始化驾驶舱全景图表群
  initCockpitCharts: function(tsData) {
    this.initDynamicCarbonFactorChart(tsData);
    this.initGenerationMixRing(tsData);
    this.initCemsStreamChart(tsData);
    this.initCarbonFlowTopologyCanvas();
  },

  // 1.1 24小时分时动态碳因子与多源出力堆叠演化图
  initDynamicCarbonFactorChart: function(data) {
    const dom = document.getElementById("dynamicEfChart");
    if (!dom) return;
    if (this.instances.dynamicEfChart) {
      this.instances.dynamicEfChart.dispose();
    }
    const chart = echarts.init(dom);
    this.instances.dynamicEfChart = chart;

    const times = data.map(d => d.time);
    const coalData = data.map(d => d.coal);
    const gasData = data.map(d => d.gas);
    const windData = data.map(d => d.wind);
    const solarData = data.map(d => d.solar);
    const efData = data.map(d => d.ef);

    const option = {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(15, 23, 42, 0.92)",
        borderColor: "rgba(56, 189, 248, 0.3)",
        textStyle: { color: "#e2e8f0", fontSize: 12 },
        formatter: function(params) {
          let str = `<div style="font-weight:700;margin-bottom:6px;color:#38bdf8;">时间断面: ${params[0].name}</div>`;
          params.forEach(p => {
            str += `<div style="display:flex;justify-content:space-between;gap:16px;margin:2px 0;">
              <span>${p.marker} ${p.seriesName}</span>
              <span style="font-family:monospace;font-weight:600;">${p.value} ${p.seriesName.includes("碳因子") ? "g/kWh" : "MW"}</span>
            </div>`;
          });
          return str;
        }
      },
      legend: {
        data: ["超临界煤电", "联合循环燃气", "海上风电", "分布式光伏", "区域动态碳因子 (EF)"],
        textStyle: { color: "#94a3b8", fontSize: 11 },
        top: 2,
        right: 10
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "6%",
        top: "18%",
        containLabel: true
      },
      xAxis: {
        type: "category",
        boundaryGap: false,
        data: times,
        axisLine: { lineStyle: { color: "rgba(255,255,255,0.15)" } },
        axisLabel: { color: "#64748b", fontSize: 11, fontFamily: "monospace" }
      },
      yAxis: [
        {
          type: "value",
          name: "发电功率 (MW)",
          nameTextStyle: { color: "#64748b", fontSize: 10 },
          splitLine: { lineStyle: { color: "rgba(255,255,255,0.04)" } },
          axisLabel: { color: "#64748b", fontSize: 11, fontFamily: "monospace" }
        },
        {
          type: "value",
          name: "动态碳因子 (gCO₂/kWh)",
          nameTextStyle: { color: "#38bdf8", fontSize: 10 },
          min: 300,
          max: 800,
          splitLine: { show: false },
          axisLabel: { color: "#38bdf8", fontSize: 11, fontFamily: "monospace" }
        }
      ],
      series: [
        {
          name: "超临界煤电",
          type: "line",
          stack: "Total",
          areaStyle: { color: "rgba(239, 68, 68, 0.45)" },
          lineStyle: { width: 1, color: "#ef4444" },
          itemStyle: { color: "#ef4444" },
          showSymbol: false,
          data: coalData
        },
        {
          name: "联合循环燃气",
          type: "line",
          stack: "Total",
          areaStyle: { color: "rgba(249, 115, 22, 0.45)" },
          lineStyle: { width: 1, color: "#f97316" },
          itemStyle: { color: "#f97316" },
          showSymbol: false,
          data: gasData
        },
        {
          name: "海上风电",
          type: "line",
          stack: "Total",
          areaStyle: { color: "rgba(16, 185, 129, 0.45)" },
          lineStyle: { width: 1, color: "#10b981" },
          itemStyle: { color: "#10b981" },
          showSymbol: false,
          data: windData
        },
        {
          name: "分布式光伏",
          type: "line",
          stack: "Total",
          areaStyle: { color: "rgba(234, 179, 8, 0.55)" },
          lineStyle: { width: 1, color: "#eab308" },
          itemStyle: { color: "#eab308" },
          showSymbol: false,
          data: solarData
        },
        {
          name: "区域动态碳因子 (EF)",
          type: "line",
          yAxisIndex: 1,
          lineStyle: { width: 3, color: "#38bdf8", shadowColor: "rgba(56, 189, 248, 0.6)", shadowBlur: 10 },
          itemStyle: { color: "#38bdf8" },
          symbol: "circle",
          symbolSize: 6,
          markPoint: {
            symbol: "pin",
            symbolSize: 42,
            data: [
              { type: "min", name: "午间最低碳谷值", itemStyle: { color: "#10b981" } },
              { type: "max", name: "晚间最高碳峰值", itemStyle: { color: "#ef4444" } }
            ],
            label: { fontSize: 10, fontFamily: "monospace" }
          },
          data: efData
        }
      ]
    };

    chart.setOption(option);
  },

  // 1.2 实时电源结构与碳排放环形图
  initGenerationMixRing: function(data) {
    const dom = document.getElementById("genMixRingChart");
    if (!dom) return;
    if (this.instances.genMixRingChart) this.instances.genMixRingChart.dispose();
    const chart = echarts.init(dom);
    this.instances.genMixRingChart = chart;

    // 当前截面（默认截取午间新能源高发阶段 12:00 进行典型展示）
    const curr = data[6] || data[0];

    const option = {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        borderColor: "rgba(56, 189, 248, 0.3)",
        formatter: "{b}: {c} MW ({d}%)"
      },
      legend: {
        orient: "vertical",
        right: "5%",
        top: "center",
        textStyle: { color: "#94a3b8", fontSize: 11 },
        itemGap: 10
      },
      series: [
        {
          name: "电源出力构成",
          type: "pie",
          radius: ["48%", "72%"],
          center: ["38%", "50%"],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 6,
            borderColor: "rgba(15, 23, 42, 0.8)",
            borderWidth: 2
          },
          label: {
            show: false,
            position: "center"
          },
          emphasis: {
            label: {
              show: true,
              fontSize: 13,
              fontWeight: "bold",
              color: "#ffffff",
              formatter: "{b}\n{d}%"
            }
          },
          labelLine: { show: false },
          data: [
            { value: curr.coal, name: "燃煤机组 (高碳基荷)", itemStyle: { color: "#ef4444" } },
            { value: curr.gas, name: "燃气机组 (中碳调峰)", itemStyle: { color: "#f97316" } },
            { value: curr.wind, name: "海上风电 (零碳绿电)", itemStyle: { color: "#10b981" } },
            { value: curr.solar, name: "分布式光伏 (零碳绿电)", itemStyle: { color: "#eab308" } }
          ]
        }
      ]
    };
    chart.setOption(option);
  },

  // 1.3 CEMS 烟气二氧化碳排放实测流
  initCemsStreamChart: function(data) {
    const dom = document.getElementById("cemsStreamChart");
    if (!dom) return;
    if (this.instances.cemsStreamChart) this.instances.cemsStreamChart.dispose();
    const chart = echarts.init(dom);
    this.instances.cemsStreamChart = chart;

    const times = data.map(d => d.time);
    const cemsCo2 = data.map(d => d.cemsCo2);

    const option = {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        borderColor: "rgba(239, 68, 68, 0.4)",
        formatter: "{b}<br/>CEMS烟气CO₂通量: <b>{c} tCO₂/h</b>"
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "6%",
        top: "16%",
        containLabel: true
      },
      xAxis: {
        type: "category",
        data: times,
        axisLine: { lineStyle: { color: "rgba(255,255,255,0.12)" } },
        axisLabel: { color: "#64748b", fontSize: 10, fontFamily: "monospace" }
      },
      yAxis: {
        type: "value",
        name: "CO₂通量 (t/h)",
        nameTextStyle: { color: "#64748b", fontSize: 10 },
        splitLine: { lineStyle: { color: "rgba(255,255,255,0.04)" } },
        axisLabel: { color: "#64748b", fontSize: 10, fontFamily: "monospace" }
      },
      series: [
        {
          name: "CEMS在线监测排量",
          type: "line",
          smooth: true,
          showSymbol: false,
          lineStyle: { width: 2, color: "#f43f5e" },
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(244, 63, 94, 0.4)" },
              { offset: 1, color: "rgba(244, 63, 94, 0.0)" }
            ])
          },
          data: cemsCo2
        }
      ]
    };
    chart.setOption(option);
  },

  // 1.4 HTML5 Canvas 拓扑场与碳流粒子轨迹场
  initCarbonFlowTopologyCanvas: function() {
    const canvas = document.getElementById("carbonFlowCanvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");

    // 自适应 DPR
    const rect = canvas.parentElement.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const width = rect.width;
    const height = rect.height;

    // 拓扑节点定义（源 -> 网 -> 荷）
    const nodes = [
      // 发电侧 (左侧)
      { id: "G1", label: "#1超临界燃煤机组", x: width * 0.12, y: height * 0.20, color: "#ef4444", power: "350 MW", carbonRate: "323.4 t/h", type: "thermal" },
      { id: "G2", label: "#2联合循环燃气", x: width * 0.12, y: height * 0.42, color: "#f97316", power: "100 MW", carbonRate: "45.0 t/h", type: "gas" },
      { id: "G3", label: "临港近海海上风电", x: width * 0.12, y: height * 0.65, color: "#10b981", power: "150 MW", carbonRate: "4.8 t/h", type: "renewable" },
      { id: "G4", label: "分布式屋顶光伏", x: width * 0.12, y: height * 0.85, color: "#eab308", power: "40 MW", carbonRate: "0.8 t/h", type: "renewable" },

      // 电网枢纽侧 (中间)
      { id: "S1", label: "220kV 中心变电站", x: width * 0.48, y: height * 0.32, color: "#06b6d4", power: "450 MW", carbonRate: "368.4 t/h", type: "substation" },
      { id: "S2", label: "110kV 东区枢纽站", x: width * 0.48, y: height * 0.60, color: "#06b6d4", power: "235 MW", carbonRate: "190.6 t/h", type: "substation" },
      { id: "S3", label: "110kV 西区枢纽站", x: width * 0.48, y: height * 0.82, color: "#06b6d4", power: "128 MW", carbonRate: "42.4 t/h", type: "substation" },

      // 用电终端侧 (右侧)
      { id: "C1", label: "企业A (先进高精化工)", x: width * 0.86, y: height * 0.25, color: "#8b5cf6", power: "140 MW", carbonIntensity: "520 g/kWh", type: "consumer" },
      { id: "C2", label: "企业B (智能装备重工)", x: width * 0.86, y: height * 0.55, color: "#8b5cf6", power: "95 MW", carbonIntensity: "484 g/kWh", type: "consumer" },
      { id: "C3", label: "企业C (临云智算中心)", x: width * 0.86, y: height * 0.82, color: "#8b5cf6", power: "88 MW", carbonIntensity: "398 g/kWh", type: "consumer" }
    ];

    // 有向能量与碳流管道
    const pipes = [
      { from: "G1", to: "S1", color: "#ef4444", particleSpeed: 1.4 },
      { from: "G2", to: "S1", color: "#f97316", particleSpeed: 1.1 },
      { from: "G3", to: "S2", color: "#10b981", particleSpeed: 1.6 },
      { from: "G4", to: "S3", color: "#eab308", particleSpeed: 0.9 },
      { from: "S1", to: "S2", color: "#06b6d4", particleSpeed: 1.3 },
      { from: "S1", to: "S3", color: "#06b6d4", particleSpeed: 1.2 },
      { from: "S2", to: "C1", color: "#ec4899", particleSpeed: 1.5 },
      { from: "S2", to: "C2", color: "#8b5cf6", particleSpeed: 1.2 },
      { from: "S3", to: "C3", color: "#38bdf8", particleSpeed: 1.4 }
    ];

    // 初始化粒子群
    const particles = [];
    const numParticles = 48;
    for (let i = 0; i < numParticles; i++) {
      const pipeIndex = i % pipes.length;
      particles.push({
        pipeIndex: pipeIndex,
        progress: Math.random(),
        speed: 0.003 * pipes[pipeIndex].particleSpeed,
        size: 2.5 + Math.random() * 2
      });
    }

    if (window.CARBON_CHARTS.canvasAnimId) {
      cancelAnimationFrame(window.CARBON_CHARTS.canvasAnimId);
    }

    function getNode(id) {
      return nodes.find(n => n.id === id);
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      // 1. 绘制网格背景线
      ctx.strokeStyle = "rgba(56, 189, 248, 0.04)";
      ctx.lineWidth = 1;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }

      // 2. 绘制管道发光基底
      pipes.forEach(p => {
        const n1 = getNode(p.from);
        const n2 = getNode(p.to);
        if (!n1 || !n2) return;

        // 管道外发光
        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.bezierCurveTo(
          (n1.x + n2.x) / 2, n1.y,
          (n1.x + n2.x) / 2, n2.y,
          n2.x, n2.y
        );
        ctx.strokeStyle = "rgba(56, 189, 248, 0.08)";
        ctx.lineWidth = 6;
        ctx.stroke();

        // 管道内实线
        ctx.beginPath();
        ctx.moveTo(n1.x, n1.y);
        ctx.bezierCurveTo(
          (n1.x + n2.x) / 2, n1.y,
          (n1.x + n2.x) / 2, n2.y,
          n2.x, n2.y
        );
        ctx.strokeStyle = "rgba(255, 255, 255, 0.12)";
        ctx.lineWidth = 2;
        ctx.stroke();
      });

      // 3. 绘制流动碳粒子
      particles.forEach(pt => {
        const pipe = pipes[pt.pipeIndex];
        const n1 = getNode(pipe.from);
        const n2 = getNode(pipe.to);
        if (!n1 || !n2) return;

        pt.progress += pt.speed;
        if (pt.progress >= 1) pt.progress = 0;

        const t = pt.progress;
        // 三次贝塞尔点计算
        const cp1x = (n1.x + n2.x) / 2;
        const cp1y = n1.y;
        const cp2x = (n1.x + n2.x) / 2;
        const cp2y = n2.y;

        const cx = Math.pow(1 - t, 3) * n1.x + 3 * Math.pow(1 - t, 2) * t * cp1x + 3 * (1 - t) * Math.pow(t, 2) * cp2x + Math.pow(t, 3) * n2.x;
        const cy = Math.pow(1 - t, 3) * n1.y + 3 * Math.pow(1 - t, 2) * t * cp1y + 3 * (1 - t) * Math.pow(t, 2) * cp2y + Math.pow(t, 3) * n2.y;

        ctx.beginPath();
        ctx.arc(cx, cy, pt.size, 0, Math.PI * 2);
        ctx.fillStyle = pipe.color;
        ctx.shadowColor = pipe.color;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      // 4. 绘制拓扑节点
      nodes.forEach(n => {
        // 外圈光晕
        ctx.beginPath();
        ctx.arc(n.x, n.y, 16, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(15, 23, 42, 0.85)";
        ctx.strokeStyle = n.color;
        ctx.lineWidth = 2;
        ctx.shadowColor = n.color;
        ctx.shadowBlur = 8;
        ctx.stroke();
        ctx.fill();
        ctx.shadowBlur = 0;

        // 内核实心
        ctx.beginPath();
        ctx.arc(n.x, n.y, 6, 0, Math.PI * 2);
        ctx.fillStyle = n.color;
        ctx.fill();

        // 节点标签文字
        ctx.font = "600 11px -apple-system, sans-serif";
        ctx.fillStyle = "#e2e8f0";
        ctx.textAlign = n.x > width * 0.5 ? (n.x > width * 0.8 ? "right" : "center") : "left";
        const textOffsetX = n.x > width * 0.8 ? -22 : 22;
        ctx.fillText(n.label, n.x + textOffsetX, n.y - 2);

        // 节点副指标 (功率 / 碳排)
        ctx.font = "500 10px monospace";
        ctx.fillStyle = "#94a3b8";
        const sub = n.power ? `${n.power} | ${n.carbonRate || n.carbonIntensity}` : "";
        ctx.fillText(sub, n.x + textOffsetX, n.y + 12);
      });

      window.CARBON_CHARTS.canvasAnimId = requestAnimationFrame(render);
    }

    render();
  },

  // 2. 初始化多源融合中心关联图与对比图
  initFusionCharts: function(perf) {
    this.initFusionCompareChart();
    this.initMoeRouterChart(perf.moeRouter);
  },

  // 2.1 融合前后时序平滑度与对齐精度对比图 (ECharts)
  initFusionCompareChart: function() {
    const dom = document.getElementById("fusionCompareChart");
    if (!dom) return;
    if (this.instances.fusionCompareChart) this.instances.fusionCompareChart.dispose();
    const chart = echarts.init(dom);
    this.instances.fusionCompareChart = chart;

    const points = 50;
    const xLabels = [];
    const rawData = [];
    const fusedData = [];

    for (let i = 0; i < points; i++) {
      xLabels.push(`T+${i * 15}s`);
      const base = 520 + 60 * Math.sin(i / 6);
      // 融合前：多采样率跳变、时延与抖动噪声
      const noise = (Math.random() - 0.5) * 55 + (i % 7 === 0 ? 40 : 0);
      rawData.push((base + noise).toFixed(1));
      // 融合后：状态空间动态连续对齐平滑曲线
      fusedData.push((base).toFixed(1));
    }

    const option = {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        borderColor: "rgba(56, 189, 248, 0.3)"
      },
      legend: {
        data: ["融合前原始多模态异构信号 (含时延与抖动)", "时空大模型+SSM多模态融合连续基准"],
        textStyle: { color: "#94a3b8", fontSize: 11 },
        top: 4
      },
      grid: { left: "3%", right: "4%", bottom: "6%", top: "18%", containLabel: true },
      xAxis: {
        type: "category",
        data: xLabels,
        axisLine: { lineStyle: { color: "rgba(255,255,255,0.12)" } },
        axisLabel: { color: "#64748b", fontSize: 10, fontFamily: "monospace" }
      },
      yAxis: {
        type: "value",
        name: "等效碳排放通量 (t/h)",
        nameTextStyle: { color: "#64748b", fontSize: 10 },
        splitLine: { lineStyle: { color: "rgba(255,255,255,0.04)" } },
        axisLabel: { color: "#64748b", fontSize: 10, fontFamily: "monospace" }
      },
      series: [
        {
          name: "融合前原始多模态异构信号 (含时延与抖动)",
          type: "line",
          lineStyle: { width: 1.2, color: "#f59e0b", type: "dashed" },
          itemStyle: { color: "#f59e0b" },
          showSymbol: true,
          symbolSize: 4,
          data: rawData
        },
        {
          name: "时空大模型+SSM多模态融合连续基准",
          type: "line",
          smooth: true,
          lineStyle: { width: 3, color: "#06b6d4" },
          itemStyle: { color: "#06b6d4" },
          showSymbol: false,
          areaStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: "rgba(6, 182, 212, 0.3)" },
              { offset: 1, color: "rgba(6, 182, 212, 0.0)" }
            ])
          },
          data: fusedData
        }
      ]
    };
    chart.setOption(option);
  },

  // 2.2 时空 MoE 专家动态路由仪表盘
  initMoeRouterChart: function(moeData) {
    const dom = document.getElementById("moeRouterChart");
    if (!dom) return;
    if (this.instances.moeRouterChart) this.instances.moeRouterChart.dispose();
    const chart = echarts.init(dom);
    this.instances.moeRouterChart = chart;

    const option = {
      backgroundColor: "transparent",
      tooltip: {
        formatter: "{b}: {c}% 权重分配"
      },
      series: [
        {
          type: "gauge",
          center: ["50%", "58%"],
          radius: "82%",
          startAngle: 190,
          endAngle: -10,
          min: 0,
          max: 100,
          progress: {
            show: true,
            width: 14,
            itemStyle: {
              color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
                { offset: 0, color: "#06b6d4" },
                { offset: 1, color: "#10b981" }
              ])
            }
          },
          pointer: {
            length: "60%",
            width: 4,
            itemStyle: { color: "#38bdf8" }
          },
          axisLine: {
            lineStyle: { width: 14, color: [[1, "rgba(255,255,255,0.06)"]] }
          },
          axisTick: { show: false },
          splitLine: { length: 8, lineStyle: { width: 2, color: "#64748b" } },
          axisLabel: { color: "#64748b", distance: 18, fontSize: 10, fontFamily: "monospace" },
          title: {
            offsetCenter: [0, "30%"],
            fontSize: 12,
            color: "#94a3b8"
          },
          detail: {
            valueAnimation: true,
            fontSize: 20,
            offsetCenter: [0, "-10%"],
            formatter: "{value}%",
            color: "#ffffff",
            fontFamily: "monospace"
          },
          data: [{ value: moeData.temporalExpertWeight, name: "时间专家动态权重分配" }]
        }
      ]
    };
    chart.setOption(option);
  },

  // 3. 初始化电力全环节知识图谱浏览器 (ECharts Graph 力导向)
  initKnowledgeGraph: function(kgData, onNodeClickCallback) {
    const dom = document.getElementById("knowledgeGraphChart");
    if (!dom) return;
    if (this.instances.kgChart) this.instances.kgChart.dispose();
    const chart = echarts.init(dom);
    this.instances.kgChart = chart;

    const graphNodes = kgData.nodes.map(n => ({
      id: n.id,
      name: n.name,
      category: n.category,
      symbolSize: n.symbolSize || 42,
      rawMeta: n,
      label: {
        show: true,
        fontSize: 11,
        color: "#e2e8f0",
        position: "bottom"
      }
    }));

    const graphLinks = kgData.links.map(l => ({
      source: l.source,
      target: l.target,
      value: l.relation,
      rawMeta: l,
      lineStyle: {
        width: 2,
        curveness: 0.15,
        color: "rgba(56, 189, 248, 0.4)"
      },
      label: {
        show: true,
        formatter: l.relation,
        fontSize: 10,
        color: "#94a3b8"
      }
    }));

    const option = {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "item",
        backgroundColor: "rgba(15, 23, 42, 0.95)",
        borderColor: "rgba(56, 189, 248, 0.4)",
        textStyle: { color: "#f8fafc", fontSize: 12 },
        formatter: function(params) {
          if (params.dataType === "node") {
            const m = params.data.rawMeta;
            let res = `<div style="font-weight:700;color:#38bdf8;margin-bottom:4px;">${m.name} (${m.id})</div>`;
            for (let k in m) {
              if (!["id", "name", "category", "symbolSize"].includes(k)) {
                res += `<div style="font-size:11px;color:#94a3b8;">${k}: <b style="color:#ffffff;">${m[k]}</b></div>`;
              }
            }
            return res;
          } else if (params.dataType === "edge") {
            const l = params.data.rawMeta;
            return `<div style="font-weight:700;color:#10b981;">关系: ${l.relation}</div>
                    <div style="font-size:11px;color:#94a3b8;">源端: ${l.source} → 汇端: ${l.target}</div>
                    ${l.carbonFlow ? `<div style="font-size:11px;color:#cbd5e1;">碳流量: ${l.carbonFlow}</div>` : ""}
                    ${l.powerFlow ? `<div style="font-size:11px;color:#cbd5e1;">有功潮流: ${l.powerFlow}</div>` : ""}`;
          }
        }
      },
      legend: {
        data: kgData.categories.map(c => c.name),
        textStyle: { color: "#94a3b8", fontSize: 11 },
        bottom: 12
      },
      series: [
        {
          name: "电力全环节碳排放知识图谱",
          type: "graph",
          layout: "force",
          data: graphNodes,
          links: graphLinks,
          categories: kgData.categories,
          roam: true,
          draggable: true,
          force: {
            repulsion: 380,
            edgeLength: [80, 160],
            gravity: 0.12
          },
          emphasis: {
            focus: "adjacency",
            lineStyle: {
              width: 5,
              color: "#38bdf8"
            }
          }
        }
      ]
    };

    chart.setOption(option);

    chart.on("click", function(params) {
      if (params.dataType === "node" && onNodeClickCallback) {
        onNodeClickCallback(params.data.rawMeta);
      }
    });
  },

  // 3.1 高亮企业碳来源回溯拓扑链路
  highlightTraceRoute: function(routeNodes) {
    if (!this.instances.kgChart) return;
    const option = this.instances.kgChart.getOption();
    const nodes = option.series[0].data;
    const links = option.series[0].links;

    nodes.forEach(n => {
      const isHit = routeNodes.some(r => r.includes(n.id) || r.includes(n.name.split(" ")[0]));
      if (isHit) {
        n.itemStyle = { shadowColor: "#38bdf8", shadowBlur: 25, borderColor: "#ffffff", borderWidth: 3 };
      } else {
        n.itemStyle = { opacity: 0.4 };
      }
    });

    links.forEach(l => {
      l.lineStyle = { opacity: 0.25, width: 1 };
    });

    this.instances.kgChart.setOption(option);
  },

  // 4. 初始化因果推理归因贡献度柱状图
  initReasoningFactorChart: function(factors) {
    const dom = document.getElementById("reasoningFactorChart");
    if (!dom) return;
    if (this.instances.reasoningFactorChart) this.instances.reasoningFactorChart.dispose();
    const chart = echarts.init(dom);
    this.instances.reasoningFactorChart = chart;

    const names = factors.map(f => f.name).reverse();
    const values = factors.map(f => f.contribution).reverse();

    const option = {
      backgroundColor: "transparent",
      tooltip: {
        trigger: "axis",
        axisPointer: { type: "shadow" },
        backgroundColor: "rgba(15, 23, 42, 0.9)",
        borderColor: "rgba(6, 182, 212, 0.3)",
        formatter: "{b}: <b>{c}% 贡献度</b>"
      },
      grid: { left: "4%", right: "8%", top: "4%", bottom: "4%", containLabel: true },
      xAxis: {
        type: "value",
        max: 70,
        splitLine: { lineStyle: { color: "rgba(255,255,255,0.05)" } },
        axisLabel: { color: "#64748b", fontSize: 10, fontFamily: "monospace" }
      },
      yAxis: {
        type: "category",
        data: names,
        axisLine: { lineStyle: { color: "rgba(255,255,255,0.1)" } },
        axisLabel: { color: "#cbd5e1", fontSize: 11 }
      },
      series: [
        {
          name: "因果贡献度得分",
          type: "bar",
          data: values,
          barWidth: 14,
          itemStyle: {
            borderRadius: [0, 6, 6, 0],
            color: new echarts.graphic.LinearGradient(0, 0, 1, 0, [
              { offset: 0, color: "#06b6d4" },
              { offset: 1, color: "#ef4444" }
            ])
          },
          label: {
            show: true,
            position: "right",
            formatter: "{c}%",
            color: "#ffffff",
            fontSize: 11,
            fontFamily: "monospace"
          }
        }
      ]
    };
    chart.setOption(option);
  },

  // 5. 窗口变化自动 Resize
  handleResize: function() {
    for (let k in this.instances) {
      if (this.instances[k] && typeof this.instances[k].resize === "function") {
        this.instances[k].resize();
      }
    }
  }
};

window.addEventListener("resize", () => {
  window.CARBON_CHARTS.handleResize();
});
