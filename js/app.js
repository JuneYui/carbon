/**
 * 区域新型电力系统 · 碳感知计算与决策平台
 * 核心业务驱动控制器 (Vue 3 Production SPA)
 */

const { createApp, ref, computed, onMounted, nextTick } = Vue;

const app = createApp({
  setup() {
    const data = window.CARBON_DATA;

    // 1. 全局与导航状态
    const activeTab = ref("cockpit"); // cockpit | fusion | kg | reasoning | architecture
    const currentTimeStr = ref("");
    const currentDateStr = ref("");
    const networkLatency = ref(28);
    const systemHealth = ref(99.92);

    // 2. 驾驶舱实时微动效指标
    const liveLoad = ref(680.4);
    const liveCarbonFlux = ref(384.2);
    const liveDynamicEf = ref(442.8);
    const liveRenewableShare = ref(38.6);

    // 3. 知识图谱模块状态
    const selectedKgCategory = ref("all");
    const activeEnterpriseId = ref("C1");
    const activeNodeDetail = ref(null);
    const kgPipelineStep = ref(4); // 1:实体抽取 2:关系连接 3:双重校验 4:图谱成型
    const isPipelinePlaying = ref(false);

    // 4. 因果推理模块状态
    const activeScenarioId = ref("scene-01");
    const reasoningStep = ref(5);
    const isReasoningRunning = ref(false);

    // 计算属性：当前选中的企业核算数据
    const currentAccounting = computed(() => {
      return data.enterpriseAccounting[activeEnterpriseId.value] || data.enterpriseAccounting.C1;
    });

    // 计算属性：当前选中的因果推理场景数据
    const currentScenario = computed(() => {
      return data.reasoningScenarios.find(s => s.id === activeScenarioId.value) || data.reasoningScenarios[0];
    });

    // 5. 导航切换处理
    const switchTab = (tabKey) => {
      activeTab.value = tabKey;
      nextTick(() => {
        window.CARBON_CHARTS.handleResize();
        if (tabKey === "cockpit") {
          window.CARBON_CHARTS.initCockpitCharts(data.timeseries24h);
        } else if (tabKey === "fusion") {
          window.CARBON_CHARTS.initFusionCharts(data.fusionPerformance);
        } else if (tabKey === "kg") {
          window.CARBON_CHARTS.initKnowledgeGraph(data.knowledgeGraph, handleKgNodeClick);
          // 默认高亮当前企业供电链路
          highlightEnterpriseRoute();
        } else if (tabKey === "reasoning") {
          window.CARBON_CHARTS.initReasoningFactorChart(currentScenario.value.topFactors);
        }
      });
    };

    // 6. 实时时钟与微脉冲跳动
    const startRealtimeClock = () => {
      const updateTime = () => {
        const now = new Date();
        const y = now.getFullYear();
        const m = String(now.getMonth() + 1).padStart(2, "0");
        const d = String(now.getDate()).padStart(2, "0");
        const hh = String(now.getHours()).padStart(2, "0");
        const mm = String(now.getMinutes()).padStart(2, "0");
        const ss = String(now.getSeconds()).padStart(2, "0");
        const weekDays = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        const wk = weekDays[now.getDay()];

        currentTimeStr.value = `${hh}:${mm}:${ss}`;
        currentDateStr.value = `${y}-${m}-${d} ${wk}`;

        // 模拟工业现场微采样抖动，体现实时在线感
        if (Math.random() > 0.6) {
          networkLatency.value = 24 + Math.floor(Math.random() * 9);
          liveLoad.value = Number((680 + (Math.random() - 0.5) * 4).toFixed(1));
          liveCarbonFlux.value = Number((384 + (Math.random() - 0.5) * 2.5).toFixed(1));
          liveDynamicEf.value = Number((442 + (Math.random() - 0.5) * 1.8).toFixed(1));
        }
      };
      updateTime();
      setInterval(updateTime, 1000);
    };

    // 7. 知识图谱交互逻辑
    const handleKgNodeClick = (nodeMeta) => {
      activeNodeDetail.value = nodeMeta;
    };

    const closeNodeModal = () => {
      activeNodeDetail.value = null;
    };

    const highlightEnterpriseRoute = () => {
      const acc = currentAccounting.value;
      if (acc && acc.traceRoute) {
        window.CARBON_CHARTS.highlightTraceRoute(acc.traceRoute);
      }
    };

    const selectEnterprise = (entId) => {
      activeEnterpriseId.value = entId;
      highlightEnterpriseRoute();
    };

    // 图谱构建流水线四步回放演示
    const playKgPipeline = () => {
      if (isPipelinePlaying.value) return;
      isPipelinePlaying.value = true;
      kgPipelineStep.value = 1;

      setTimeout(() => {
        kgPipelineStep.value = 2;
        setTimeout(() => {
          kgPipelineStep.value = 3;
          setTimeout(() => {
            kgPipelineStep.value = 4;
            isPipelinePlaying.value = false;
            window.CARBON_CHARTS.initKnowledgeGraph(data.knowledgeGraph, handleKgNodeClick);
            highlightEnterpriseRoute();
          }, 1800);
        }, 1800);
      }, 1600);
    };

    // 8. 因果推理交互逻辑
    const selectScenario = (scId) => {
      activeScenarioId.value = scId;
      reasoningStep.value = 5;
      nextTick(() => {
        window.CARBON_CHARTS.initReasoningFactorChart(currentScenario.value.topFactors);
      });
    };

    // 执行因果路径游走推演
    const runCausalReasoning = () => {
      if (isReasoningRunning.value) return;
      isReasoningRunning.value = true;
      reasoningStep.value = 1;

      const timer = setInterval(() => {
        if (reasoningStep.value < 5) {
          reasoningStep.value++;
        } else {
          clearInterval(timer);
          isReasoningRunning.value = false;
          window.CARBON_CHARTS.initReasoningFactorChart(currentScenario.value.topFactors);
        }
      }, 800);
    };

    // 9. 生命周期挂载
    onMounted(() => {
      startRealtimeClock();
      // 初始化首屏驾驶舱图表
      nextTick(() => {
        window.CARBON_CHARTS.initCockpitCharts(data.timeseries24h);
      });
    });

    return {
      data,
      activeTab,
      currentTimeStr,
      currentDateStr,
      networkLatency,
      systemHealth,
      liveLoad,
      liveCarbonFlux,
      liveDynamicEf,
      liveRenewableShare,
      selectedKgCategory,
      activeEnterpriseId,
      currentAccounting,
      activeNodeDetail,
      kgPipelineStep,
      isPipelinePlaying,
      activeScenarioId,
      currentScenario,
      reasoningStep,
      isReasoningRunning,
      switchTab,
      selectEnterprise,
      closeNodeModal,
      playKgPipeline,
      selectScenario,
      runCausalReasoning
    };
  }
});

app.mount("#app");
