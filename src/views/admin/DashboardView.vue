<script setup>
import { ref, computed } from 'vue'
import KpiCard from '@/components/KpiCard.vue'
import SensorCard from '@/components/SensorCard.vue'

// KPI 資料
const kpiData = ref([
  { title: '年度總碳排放', value: '1,245', unit: '公噸 CO₂e', iconType: 'emission', trend: '+5.2% 年成長', trendType: 'up', percentage: 25 },
  { title: '商務差旅排放', value: '456', unit: '公噸 CO₂e', iconType: 'travel', trend: '-2.1% 較上月', trendType: 'down', percentage: 50 },
  { title: '廢棄物處理排放', value: '287', unit: '公噸 CO₂e', iconType: 'waste', trend: '+1.3% 較上月', trendType: 'up', percentage: 75 },
  { title: '感測設備在線率', value: '24 / 27', unit: '設備', iconType: 'sensor', trend: '3 台離線', trendType: 'warning', percentage: 100 }
])

// 月份趨勢資料
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov']
const trendValues = [160, 140, 170, 145, 135, 155, 125, 130, 128, 118, 105]
const trendMax = 200

// 折線圖路徑
const areaPoints = computed(() => {
  const w = 760; const h = 220; const px = 30
  const stepX = (w - px * 2) / (trendValues.length - 1)
  return trendValues.map((v, i) => {
    const x = px + i * stepX
    const y = h - 30 - ((v / trendMax) * (h - 60))
    return `${x},${y}`
  }).join(' ')
})
const areaPath = computed(() => {
  const w = 760; const h = 220; const px = 30
  const stepX = (w - px * 2) / (trendValues.length - 1)
  const pts = trendValues.map((v, i) => {
    const x = px + i * stepX
    const y = h - 30 - ((v / trendMax) * (h - 60))
    return `${x},${y}`
  })
  const first = px
  const last = px + (trendValues.length - 1) * stepX
  return `M${pts[0]} L${pts.join(' L')} L${last},${h - 30} L${first},${h - 30} Z`
})

// 每日柱狀圖
const dailyData = [65, 80, 55, 90, 70, 85, 60]
const dailyDays = ['M', 'T', 'W', 'T', 'F', 'S', 'S']

// 雷達圖資料
const radarLabels = ['能源', '差旅', '廢棄', '物流', '採購', '其他']
const radarValues = [0.8, 0.6, 0.7, 0.5, 0.9, 0.4]
const radarPoints = computed(() => {
  const cx = 80; const cy = 80; const r = 60
  return radarValues.map((v, i) => {
    const angle = (Math.PI * 2 * i) / radarValues.length - Math.PI / 2
    return `${cx + r * v * Math.cos(angle)},${cy + r * v * Math.sin(angle)}`
  }).join(' ')
})
const radarGrid = (scale) => {
  const cx = 80; const cy = 80; const r = 60
  return Array.from({ length: radarLabels.length }, (_, i) => {
    const angle = (Math.PI * 2 * i) / radarLabels.length - Math.PI / 2
    return `${cx + r * scale * Math.cos(angle)},${cy + r * scale * Math.sin(angle)}`
  }).join(' ')
}
const radarLabelPos = computed(() => {
  const cx = 80; const cy = 80; const r = 75
  return radarLabels.map((label, i) => {
    const angle = (Math.PI * 2 * i) / radarLabels.length - Math.PI / 2
    return { label, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
  })
})

// 底部柱狀圖
const barData = ref([
  { label: 'Q1', values: [85, 60, 45] },
  { label: 'Q2', values: [70, 80, 55] },
  { label: 'Q3', values: [90, 50, 65] },
  { label: 'Q4', values: [60, 75, 70] },
])

// 部門排名
const departmentRanking = ref([
  { rank: 1, name: '業務部', emissions: 345, change: '+12%', changeType: 'up' },
  { rank: 2, name: '人力資源部', emissions: 298, change: '-5%', changeType: 'down' },
  { rank: 3, name: '營運部', emissions: 287, change: '+8%', changeType: 'up' },
  { rank: 4, name: '行銷部', emissions: 215, change: '+3%', changeType: 'up' },
  { rank: 5, name: '研發部', emissions: 100, change: '-15%', changeType: 'down' }
])

// 活動資料
const activities = ref([
  { icon: 'local_shipping', text: '物流碳排報告已更新', amount: '9600$', color: '#5b8ff9' },
  { icon: 'flight', text: '差旅排放數據同步', amount: '960$', color: '#5ad8a6' }
])

// 儀表盤
const gaugePercent = ref(50)

// 感測器
const sensors = ref([
  { id: 1, name: '智慧垃圾桶 A', status: 'online', lastUpdate: '5 分鐘前' },
  { id: 2, name: '智慧垃圾桶 B', status: 'offline', lastUpdate: '2 小時前' },
  { id: 3, name: '環境感測器 C', status: 'warning', lastUpdate: '10 分鐘前' },
  { id: 4, name: '能源監測器 D', status: 'online', lastUpdate: '1 分鐘前' }
])

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

      <!-- Row 1: KPI Cards + Daily Charts -->
      <div class="row-1">
        <div class="kpi-grid">
          <KpiCard
            v-for="(kpi, idx) in kpiData" :key="idx"
            :title="kpi.title" :value="kpi.value" :unit="kpi.unit"
            :icon-type="kpi.iconType" :trend="kpi.trend" :trend-type="kpi.trendType"
            :percentage="kpi.percentage" :index="idx"
          />
        </div>
        <!-- <div class="card daily-card">
          <div class="card-head">
            <h3 class="card-title">Daily charts</h3>
            <span class="daily-subtitle">本週設備與排放概況</span>
          </div>
          <div class="daily-bars">
            <div v-for="(val, i) in dailyData" :key="i" class="daily-col">
              <div class="bar-track">
                <div class="bar-fill" :style="{ height: val + '%' }">
                  <div class="bar-blue"></div>
                  <div class="bar-green"></div>
                </div>
              </div>
              <span class="bar-label">{{ dailyDays[i] }}</span>
            </div>
          </div>
        </div> -->
      </div>

      <!-- Row 2: Area Chart + Radar + Activity -->
      <div class="row-2">
        <div class="card area-card">
          <div class="card-head">
            <h3 class="card-title">年度碳排趨勢</h3>
            <div class="legend">
              <span class="legend-item"><span class="dot blue"></span>排放量</span>
              <span class="legend-item"><span class="dot green"></span>目標</span>
            </div>
          </div>
          <svg class="area-svg" viewBox="0 0 760 220" preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#5b8ff9" stop-opacity=".3"/>
                <stop offset="100%" stop-color="#5b8ff9" stop-opacity=".02"/>
              </linearGradient>
            </defs>
            <line v-for="i in 5" :key="i" x1="30" :y1="30 + (i-1)*40" x2="730" :y2="30 + (i-1)*40" stroke="#eef0f4" stroke-width="1"/>
            <path :d="areaPath" fill="url(#areaGrad)"/>
            <polyline :points="areaPoints" fill="none" stroke="#5b8ff9" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>
            <circle v-for="(pt, i) in areaPoints.split(' ')" :key="i" :cx="pt.split(',')[0]" :cy="pt.split(',')[1]" r="3.5" fill="#fff" stroke="#5b8ff9" stroke-width="2"/>
          </svg>
          <div class="x-labels">
            <span v-for="m in months" :key="m">{{ m }}</span>
          </div>
        </div>

        <div class="side-stack">
          <div class="card radar-card">
            <h3 class="card-title">排放類型分布</h3>
            <svg viewBox="0 0 160 160" class="radar-svg">
              <polygon v-for="s in [1, .75, .5, .25]" :key="s" :points="radarGrid(s)" fill="none" stroke="#e8ecf1" stroke-width="1"/>
              <polygon :points="radarPoints" fill="rgba(91,143,249,.2)" stroke="#5b8ff9" stroke-width="2"/>
              <text v-for="lp in radarLabelPos" :key="lp.label" :x="lp.x" :y="lp.y" text-anchor="middle" font-size="9" fill="#8c8c8c">{{ lp.label }}</text>
            </svg>
          </div>
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

      <!-- Row 3: Bar Chart + Table + Gauge -->
      <div class="row-3">
        <div class="card barchart-card">
          <div class="card-head">
            <h3 class="card-title">季度排放比較</h3>
          </div>
          <svg viewBox="0 0 320 180" class="bar-svg">
            <line v-for="i in 4" :key="i" x1="40" :y1="20 + (i-1)*45" x2="300" :y2="20 + (i-1)*45" stroke="#eef0f4" stroke-width="1"/>
            <g v-for="(group, gi) in barData" :key="gi" :transform="`translate(${55 + gi * 65}, 0)`">
              <rect v-for="(v, bi) in group.values" :key="bi"
                :x="bi * 14" :y="155 - v * 1.3" :width="10" :height="v * 1.3"
                :rx="2"
                :fill="['#5b8ff9','#5ad8a6','#f6bd16'][bi]"
                opacity="0.85"
              />
              <text :x="20" y="172" text-anchor="middle" font-size="10" fill="#8c8c8c">{{ group.label }}</text>
            </g>
          </svg>
        </div>

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

        <div class="card gauge-card">
          <h3 class="card-title">減碳目標達成率</h3>
          <div class="gauge-wrap">
            <svg viewBox="0 0 140 90" class="gauge-svg">
              <defs>
                <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stop-color="#f6bd16"/>
                  <stop offset="50%" stop-color="#5ad8a6"/>
                  <stop offset="100%" stop-color="#5b8ff9"/>
                </linearGradient>
              </defs>
              <path d="M15,80 A55,55 0 0,1 125,80" fill="none" stroke="#eef0f4" stroke-width="10" stroke-linecap="round"/>
              <path d="M15,80 A55,55 0 0,1 125,80" fill="none" stroke="url(#gaugeGrad)" stroke-width="10" stroke-linecap="round"
                :stroke-dasharray="`${gaugePercent * 1.73} 173`"/>
              <!-- Needle -->
              <line x1="70" y1="80" :x2="70 + 40 * Math.cos((-180 + gaugePercent * 1.8) * Math.PI / 180)" :y2="80 + 40 * Math.sin((-180 + gaugePercent * 1.8) * Math.PI / 180)" stroke="#333" stroke-width="2" stroke-linecap="round"/>
              <circle cx="70" cy="80" r="4" fill="#333"/>
            </svg>
            <div class="gauge-labels">
              <span>0%</span>
              <span class="gauge-center">{{ gaugePercent }}%</span>
              <span>100%</span>
            </div>
          </div>
        </div>
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
            <SensorCard v-for="s in sensors" :key="s.id" :name="s.name" :status="s.status" :last-update="s.lastUpdate"/>
          </div>
        </div>
      </div>
  </main>
</template>

<style scoped>
/* ===== Main ===== */
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
.page-date { font-size: 13px; color: #8c8c8c; margin-top: 2px; }
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  background: #fff;
  border: 1px solid #e8ecf1;
  border-radius: 10px;
  padding: 8px 14px;
}
.search-icon { font-size: 18px; color: #b0b7c3; }
.search-input {
  border: none;
  outline: none;
  font-size: 13px;
  width: 160px;
  font-family: inherit;
  color: #333;
}

/* ===== Cards ===== */
.card {
  background: #fff;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,.06);
}
.card-title {
  font-size: 15px;
  font-weight: 600;
  color: #333;
  margin: 0 0 14px;
}
.card-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 14px;
}
.card-head .card-title { margin-bottom: 0; }

/* ===== Row 1: KPI + Daily ===== */
.row-1 {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
}
.kpi-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  gap: 16px;
}
.daily-card {
  width: 100%;
  display: flex;
  flex-direction: column;
}
.daily-subtitle {
  font-size: 12px;
  color: #8c8c8c;
  font-weight: 500;
}
.daily-bars {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 12px;
  padding-top: 8px;
  height: 160px;
}
.daily-col {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}
.bar-track {
  width: 100%;
  max-width: 48px;
  height: 138px;
  display: flex;
  align-items: flex-end;
}
.bar-fill {
  width: 100%;
  border-radius: 4px 4px 0 0;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
.bar-blue { background: #5b8ff9; flex: 3 1 0; }
.bar-green { background: #5ad8a6; flex: 2 1 0; }
.bar-label { font-size: 11px; color: #8c8c8c; font-weight: 500; }

/* ===== Row 2: Area + Side Stack ===== */
.row-2 {
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 20px;
  margin-bottom: 20px;
}
.area-card { overflow: hidden; }
.area-svg { width: 100%; height: 220px; display: block; }
.x-labels {
  display: flex;
  justify-content: space-between;
  padding: 8px 30px 0;
  font-size: 11px;
  color: #8c8c8c;
}
.legend { display: flex; gap: 16px; }
.legend-item { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #8c8c8c; }
.dot { width: 8px; height: 8px; border-radius: 50%; }
.dot.blue { background: #5b8ff9; }
.dot.green { background: #5ad8a6; }

.side-stack {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
.radar-svg { width: 100%; max-height: 170px; display: block; margin: 0 auto; }
.activity-list { display: flex; flex-direction: column; gap: 12px; }
.activity-row {
  display: flex;
  align-items: center;
  gap: 10px;
}
.act-icon { font-size: 20px; }
.act-text { flex: 1; font-size: 13px; color: #555; }
.act-amount { font-size: 14px; font-weight: 700; color: #333; }

/* ===== Row 3: Bar + Table + Gauge ===== */
.row-3 {
  display: grid;
  grid-template-columns: 1fr 1.2fr 200px;
  gap: 20px;
  margin-bottom: 20px;
}
.bar-svg { width: 100%; height: auto; display: block; }

.ranking-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 13px;
}
.ranking-table th {
  text-align: left;
  padding: 10px 12px;
  color: #8c8c8c;
  font-weight: 600;
  font-size: 12px;
  border-bottom: 1px solid #eef0f4;
}
.ranking-table td {
  padding: 10px 12px;
  color: #333;
  border-bottom: 1px solid #f5f7fa;
}
.ranking-table tbody tr:hover { background: #f9fbff; }
.rank-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 8px;
  background: #eef3ff;
  color: #5b8ff9;
  font-weight: 700;
  font-size: 12px;
}
.change-up { color: #f5222d; font-weight: 600; font-size: 12px; }
.change-down { color: #52c41a; font-weight: 600; font-size: 12px; }

.gauge-card {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.gauge-wrap { text-align: center; flex: 1; display: flex; flex-direction: column; justify-content: center; }
.gauge-svg { width: 140px; display: block; margin: 0 auto; }
.gauge-labels {
  display: flex;
  justify-content: space-between;
  width: 140px;
  margin: 4px auto 0;
  font-size: 11px;
  color: #8c8c8c;
}
.gauge-center { font-size: 18px; font-weight: 700; color: #333; margin-top: -8px; }

/* ===== Row 4: Sensors ===== */
.row-4 { margin-bottom: 20px; }
.status-pills { display: flex; gap: 10px; }
.pill {
  font-size: 12px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 12px;
}
.pill.online { background: #f6ffed; color: #52c41a; }
.pill.warning { background: #fffbe6; color: #faad14; }
.pill.offline { background: #fff1f0; color: #f5222d; }
.sensor-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 14px;
}

/* ===== Responsive ===== */
@media (max-width: 1200px) {
  .row-1 { flex-wrap: wrap; }
  .kpi-grid { grid-template-columns: repeat(2, 1fr); }
  .row-2 { grid-template-columns: 1fr; }
  .side-stack { flex-direction: row; }
  .row-3 { grid-template-columns: 1fr 1fr; }
  .gauge-card { grid-column: span 2; }
  .sensor-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .main { padding: 16px; }
  .kpi-grid { grid-template-columns: 1fr; }
  .row-3 { grid-template-columns: 1fr; }
  .gauge-card { grid-column: span 1; }
  .side-stack { flex-direction: column; }
  .sensor-grid { grid-template-columns: 1fr; }
}
</style>
