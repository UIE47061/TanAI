<script setup>
import { ref } from 'vue'
import KpiCard    from '@/components/KpiCard.vue'
import SensorCard from '@/components/SensorCard.vue'
import AreaChart  from '@/components/charts/AreaChart.vue'
import RadarChart from '@/components/charts/RadarChart.vue'
import BarChart   from '@/components/charts/BarChart.vue'
import GaugeChart from '@/components/charts/GaugeChart.vue'

// ── KPI ────────────────────────────────────────────────────
const kpiData = ref([
  {
    title: '年度總碳排放', value: '1,245', unit: '公噸 CO₂e', iconType: 'emission',
    trend: '+5.2% 年成長', trendType: 'up', percentage: 25,
    tooltipLines: [
      '計算期間：2025 年 1月–11月',
      '基準年總量：4,980 公噸 CO₂e',
      '本期佔比：1,245 / 4,980 = 25%',
      '涵蓋 Scope 1 & 2 直接排放'
    ]
  },
  {
    title: '商務差旅排放', value: '456', unit: '公噸 CO₂e', iconType: 'travel',
    trend: '-2.1% 較上月', trendType: 'down', percentage: 50,
    tooltipLines: [
      '計算期間：2025 年 1月–11月',
      '年度差旅碳排上限：912 公噸 CO₂e',
      '本期佔比：456 / 912 = 50%',
      '含航空、鐵路、租車等交通方式'
    ]
  },
  {
    title: '廢棄物處理排放', value: '287', unit: '公噸 CO₂e', iconType: 'waste',
    trend: '+1.3% 較上月', trendType: 'up', percentage: 75,
    tooltipLines: [
      '計算期間：2025 年 1月–11月',
      '年度廢棄物碳排上限：383 公噸 CO₂e',
      '本期佔比：287 / 383 ≈ 75%',
      '含掩埋、焚化、回收等處理方式'
    ]
  },
  {
    title: '感測設備在線率', value: '24 / 27', unit: '設備', iconType: 'sensor',
    trend: '3 台離線', trendType: 'warning', percentage: 89,
    tooltipLines: [
      '總設備數：27 台',
      '在線設備：24 台',
      '離線設備：3 台（需維護）',
      '在線率：24 / 27 ≈ 89%'
    ]
  }
])

// ── 年度趨勢 ───────────────────────────────────────────────
const trendYear    = 2025
const trendMonths  = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
const trendValues  = [160, 140, 170, 145, 135, 155, 125, 130, 128, 118, 105]
const trendTargets = [155, 150, 145, 140, 135, 130, 125, 120, 115, 110, 105]

// ── 雷達圖 ─────────────────────────────────────────────────
const radarLabels       = ['能源', '差旅', '廢棄', '物流', '採購', '其他']
const radarValues       = [0.8, 0.6, 0.7, 0.5, 0.9, 0.4]  // 0–1 scale（用於圖形比例）
// 依比例分配年度總排放 1245 公噸
const radarActualValues = (() => {
  const total = 1245
  const sum   = radarValues.reduce((a, b) => a + b, 0)
  return radarValues.map(v => Math.round(v / sum * total))
})()

// ── 季度柱狀圖 ─────────────────────────────────────────────
const barData = ref([
  { label: 'Q1', values: [85, 60, 45] },
  { label: 'Q2', values: [70, 80, 55] },
  { label: 'Q3', values: [90, 50, 65] },
  { label: 'Q4', values: [60, 75, 70] }
])

// ── 部門排名 ───────────────────────────────────────────────
const departmentRanking = ref([
  { rank: 1, name: '業務部',    emissions: 345, change: '+12%', changeType: 'up' },
  { rank: 2, name: '人力資源部', emissions: 298, change: '-5%',  changeType: 'down' },
  { rank: 3, name: '營運部',    emissions: 287, change: '+8%',  changeType: 'up' },
  { rank: 4, name: '行銷部',    emissions: 215, change: '+3%',  changeType: 'up' },
  { rank: 5, name: '研發部',    emissions: 100, change: '-15%', changeType: 'down' }
])

// ── 近期活動 ───────────────────────────────────────────────
const activities = ref([
  { icon: 'local_shipping', text: '物流碳排報告已更新', amount: '9600$', color: '#5b8ff9' },
  { icon: 'flight',         text: '差旅排放數據同步',   amount: '960$',  color: '#5ad8a6' }
])

// ── 儀表盤 / 感測器 ────────────────────────────────────────
const gaugePercent = ref(50)

const sensors = ref([
  { id: 1, name: '智慧垃圾桶 A',  status: 'online',  lastUpdate: '5 分鐘前' },
  { id: 2, name: '智慧垃圾桶 B',  status: 'offline', lastUpdate: '2 小時前' },
  { id: 3, name: '環境感測器 C',  status: 'warning', lastUpdate: '10 分鐘前' },
  { id: 4, name: '能源監測器 D',  status: 'online',  lastUpdate: '1 分鐘前' }
])

// ── 日期 ───────────────────────────────────────────────────
const currentDate = new Date()
const dateStr = `${currentDate.toLocaleDateString('en-US', { month: 'long' })} ${currentDate.getDate()}, ${['SUN','MON','TUE','WED','THU','FRI','SAT'][currentDate.getDay()]}`
</script>

<template>
  <main class="main">
    <!-- Topbar -->
    <header class="topbar">
      <div>
        <h1 class="page-title">Dashboard</h1>
        <p class="page-date">{{ dateStr }}</p>
      </div>
      <div class="topbar-right">
        <div class="search-box">
          <span class="material-icons-outlined search-icon">search</span>
          <input type="text" placeholder="Search..." class="search-input">
        </div>
      </div>
    </header>

    <!-- Row 1: KPI Cards -->
    <div class="row-1">
      <div class="kpi-grid">
        <KpiCard
          v-for="(kpi, idx) in kpiData" :key="idx"
          :title="kpi.title" :value="kpi.value" :unit="kpi.unit"
          :icon-type="kpi.iconType" :trend="kpi.trend" :trend-type="kpi.trendType"
          :percentage="kpi.percentage" :index="idx"
          :tooltip-lines="kpi.tooltipLines"
        />
      </div>
    </div>

    <!-- Row 2: Area Chart + Radar + Activity -->
    <div class="row-2">
      <AreaChart
        :year="trendYear" :months="trendMonths"
        :values="trendValues" :targets="trendTargets"
      />
      <div class="side-stack">
        <RadarChart :labels="radarLabels" :values="radarValues" :actual-values="radarActualValues"/>
        <div class="card activity-card">
          <h3 class="card-title">近期活動</h3>
          <div class="activity-list">
            <div v-for="(a, i) in activities" :key="i" class="activity-row">
              <span class="material-icons-outlined act-icon" :style="{ color: a.color }">{{ a.icon }}</span>
              <span class="act-text">{{ a.text }}</span>
              <span class="act-amount">{{ a.amount }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Row 3: Bar Chart + Ranking Table + Gauge -->
    <div class="row-3">
      <BarChart :data="barData" :year="trendYear"/>

      <div class="card table-card">
        <h3 class="card-title">碳排放排行</h3>
        <table class="ranking-table">
          <thead>
            <tr><th>#</th><th>部門</th><th>排放量</th><th>變化</th></tr>
          </thead>
          <tbody>
            <tr v-for="d in departmentRanking" :key="d.rank">
              <td><span class="rank-badge">{{ d.rank }}</span></td>
              <td>{{ d.name }}</td>
              <td>{{ d.emissions }}</td>
              <td><span :class="d.changeType === 'up' ? 'change-up' : 'change-down'">{{ d.change }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>

      <GaugeChart :percent="gaugePercent"/>
    </div>

    <!-- Row 4: Sensor Grid -->
    <div class="row-4">
      <div class="card sensor-section">
        <div class="card-head">
          <h3 class="card-title">感測設備狀態</h3>
          <div class="status-pills">
            <span class="pill online">21 正常</span>
            <span class="pill warning">3 警告</span>
            <span class="pill offline">3 離線</span>
          </div>
        </div>
        <div class="sensor-grid">
          <SensorCard v-for="s in sensors" :key="s.id"
            :name="s.name" :status="s.status" :last-update="s.lastUpdate"/>
        </div>
      </div>
    </div>
  </main>
</template>

<style scoped>
/* ===== Layout ===== */
.main {
  flex: 1;
  padding: 28px 32px;
  overflow-y: auto;
  min-width: 0;
}

/* ===== Topbar ===== */
.topbar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 28px;
}
.page-title { font-size: 24px; font-weight: 700; color: #1a1a2e; }
.page-date  { font-size: 13px; color: #8c8c8c; margin-top: 2px; }
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid #e8ecf1;
  border-radius: 10px;
  padding: 8px 14px;
}
.search-icon  { font-size: 18px; color: #b0b7c3; }
.search-input {
  border: none; outline: none;
  font-size: 13px; width: 160px;
  font-family: inherit; color: #333;
}

/* ===== Row 1: KPI Grid ===== */
.row-1 { margin-bottom: 20px; }
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}

/* ===== Row 2: Area + Side ===== */
.row-2 {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 20px;
  margin-bottom: 20px;
}
.side-stack { display: flex; flex-direction: column; gap: 20px; }

/* ===== Row 2: Activity Card ===== */
.activity-list { display: flex; flex-direction: column; gap: 12px; }
.activity-row  { display: flex; align-items: center; gap: 10px; }
.act-icon      { font-size: 20px; }
.act-text      { flex: 1; font-size: 13px; color: #555; }
.act-amount    { font-size: 14px; font-weight: 700; color: #333; }

/* ===== Row 3: Bar + Table + Gauge ===== */
.row-3 {
  display: grid;
  grid-template-columns: 1fr 1.2fr 200px;
  gap: 20px;
  margin-bottom: 20px;
}

/* ===== Row 3: Ranking Table ===== */
.ranking-table { width: 100%; border-collapse: collapse; font-size: 13px; }
.ranking-table th {
  text-align: left; padding: 10px 12px;
  color: #8c8c8c; font-weight: 600; font-size: 12px;
  border-bottom: 1px solid #eef0f4;
}
.ranking-table td { padding: 10px 12px; color: #333; border-bottom: 1px solid #f5f7fa; }
.ranking-table tbody tr:hover { background: #f9fbff; }

/* ===== Row 4: Sensors ===== */
.row-4 { margin-bottom: 20px; }
.sensor-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

/* ===== Responsive ===== */
@media (max-width: 1200px) {
  .kpi-grid    { grid-template-columns: repeat(2, 1fr); }
  .row-2       { grid-template-columns: 1fr; }
  .side-stack  { flex-direction: row; }
  .row-3       { grid-template-columns: 1fr 1fr; }
  .sensor-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .main        { padding: 16px; }
  .kpi-grid    { grid-template-columns: 1fr; }
  .row-3       { grid-template-columns: 1fr; }
  .side-stack  { flex-direction: column; }
  .sensor-grid { grid-template-columns: 1fr; }
}
</style>
