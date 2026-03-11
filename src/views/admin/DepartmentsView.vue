<script setup>
import { ref, computed } from 'vue'
import {
  Building2, Leaf, Trash2, FileText, User, Trophy,
  Cog, Truck, Microscope, Megaphone, FolderOpen, Users, Zap
} from 'lucide-vue-next'

const deptIcons = { '製造部': Cog, '物流部': Truck, '研發部': Microscope, '行銷部': Megaphone, '行政部': FolderOpen, '人資部': Users }

const departments = ref([
  { name: '製造部', emissions: 420, change: '+3.2%', up: true,  employees: 120, waste: 8500,  paper: 480, electricity: 185000, travel: 12000 },
  { name: '物流部', emissions: 260, change: '+2.1%', up: true,  employees:  80, waste: 5200,  paper: 240, electricity:  68000, travel: 28000 },
  { name: '研發部', emissions: 210, change: '-1.5%', up: false, employees:  60, waste: 2800,  paper: 360, electricity:  95000, travel:  8000 },
  { name: '行銷部', emissions: 150, change: '+0.8%', up: true,  employees:  45, waste: 1800,  paper: 420, electricity:  32000, travel: 22000 },
  { name: '行政部', emissions: 120, change: '-2.4%', up: false, employees:  30, waste: 1200,  paper: 680, electricity:  28000, travel:  3500 },
  { name: '人資部', emissions:  85, change: '-1.1%', up: false, employees:  20, waste:  600,  paper: 310, electricity:  15000, travel:  2000 },
])

const enriched = computed(() => {
  const maxEmissions = Math.max(...departments.value.map(d => d.emissions))
  const maxWaste     = Math.max(...departments.value.map(d => d.waste))
  const maxPaper     = Math.max(...departments.value.map(d => d.paper))
  return departments.value.map(d => ({
    ...d,
    emissionsPct:    Math.round(d.emissions   / maxEmissions * 100),
    wastePct:        Math.round(d.waste       / maxWaste    * 100),
    paperPct:        Math.round(d.paper       / maxPaper    * 100),
    perCapita:       (d.emissions   / d.employees).toFixed(2),
    perCapitaWaste:  Math.round(d.waste       / d.employees),
    perCapitaPaper:  (d.paper       / d.employees).toFixed(1),
    perCapitaElec:   Math.round(d.electricity / d.employees).toLocaleString(),
  }))
})

const totalEmissions = computed(() => departments.value.reduce((a, d) => a + d.emissions, 0))
const totalWaste     = computed(() => departments.value.reduce((a, d) => a + d.waste, 0))
const totalPaper     = computed(() => departments.value.reduce((a, d) => a + d.paper, 0))
const totalEmployees = computed(() => departments.value.reduce((a, d) => a + d.employees, 0))
const avgPerCapita   = computed(() => (totalEmissions.value / totalEmployees.value).toFixed(2))
const bestDept       = computed(() => [...enriched.value].sort((a, b) => +a.perCapita - +b.perCapita)[0])
</script>

<template>
  <div class="departments-page">

    <div class="page-header">
      <h1>部門排放管理</h1>
      <p>各部門碳排放、廢棄物、用電與紙張消耗即時分析</p>
    </div>

    <!-- KPI Row -->
    <div class="kpi-row">
      <div class="kpi-card">
        <div class="kpi-icon" style="background:#eff4ff"><Building2 :size="20" color="#5b8ff9"/></div>
        <div>
          <div class="kpi-label">部門數量</div>
          <div class="kpi-value">{{ departments.length }} <span>個</span></div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon" style="background:#fff1f0"><Leaf :size="20" color="#f5222d"/></div>
        <div>
          <div class="kpi-label">年度總排放</div>
          <div class="kpi-value">{{ totalEmissions.toLocaleString() }} <span>tCO₂e</span></div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon" style="background:#fff7e6"><Trash2 :size="20" color="#fa8c16"/></div>
        <div>
          <div class="kpi-label">廢棄物總量</div>
          <div class="kpi-value">{{ totalWaste.toLocaleString() }} <span>kg</span></div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon" style="background:#e6fffb"><FileText :size="20" color="#36cfc9"/></div>
        <div>
          <div class="kpi-label">紙張用量</div>
          <div class="kpi-value">{{ totalPaper.toLocaleString() }} <span>令</span></div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon" style="background:#f9f0ff"><User :size="20" color="#9b59b6"/></div>
        <div>
          <div class="kpi-label">人均碳排</div>
          <div class="kpi-value">{{ avgPerCapita }} <span>tCO₂e/人</span></div>
        </div>
      </div>
      <div class="kpi-card">
        <div class="kpi-icon" style="background:#f6ffed"><Trophy :size="20" color="#52c41a"/></div>
        <div>
          <div class="kpi-label">人均最優部門</div>
          <div class="kpi-value kpi-dept">{{ bestDept.name }}</div>
        </div>
      </div>
    </div>

    <!-- 排放排名 + 廢棄物&紙張 -->
    <div class="two-col">
      <div class="card">
        <h3 class="card-title">碳排放量排名</h3>
        <div v-for="(d, i) in enriched" :key="d.name" class="rank-row">
          <span class="rank-no" :class="i < 3 ? 'rank-top' : ''">{{ i + 1 }}</span>
          <span class="rank-icon"><component :is="deptIcons[d.name]" :size="15" /></span>
          <span class="rank-name">{{ d.name }}</span>
          <div class="rank-bar-wrap">
            <div class="rank-bar emission-bar" :style="{ width: d.emissionsPct + '%' }"></div>
          </div>
          <span class="rank-num">{{ d.emissions }}</span>
          <span class="rank-unit">tCO₂e</span>
          <span class="rank-change" :class="d.up ? 'up' : 'down'">{{ d.change }}</span>
        </div>
      </div>

      <div class="card">
        <h3 class="card-title">廢棄物 ＆ 紙張消耗排名</h3>
        <div class="sub-label"><Trash2 :size="13" color="#fa8c16" style="vertical-align:-2px"/> 廢棄物（kg）</div>
        <div v-for="d in [...enriched].sort((a,b) => b.waste - a.waste)" :key="'w'+d.name" class="rank-row compact">
          <span class="rank-icon"><component :is="deptIcons[d.name]" :size="15" /></span>
          <span class="rank-name">{{ d.name }}</span>
          <div class="rank-bar-wrap">
            <div class="rank-bar waste-bar" :style="{ width: d.wastePct + '%' }"></div>
          </div>
          <span class="rank-num">{{ d.waste.toLocaleString() }}</span>
          <span class="rank-unit">kg</span>
        </div>
        <div class="sub-label" style="margin-top:16px"><FileText :size="13" color="#36cfc9" style="vertical-align:-2px"/> 紙張（令）</div>
        <div v-for="d in [...enriched].sort((a,b) => b.paper - a.paper)" :key="'p'+d.name" class="rank-row compact">
          <span class="rank-icon"><component :is="deptIcons[d.name]" :size="15" /></span>
          <span class="rank-name">{{ d.name }}</span>
          <div class="rank-bar-wrap">
            <div class="rank-bar paper-bar" :style="{ width: d.paperPct + '%' }"></div>
          </div>
          <span class="rank-num">{{ d.paper }}</span>
          <span class="rank-unit">令</span>
        </div>
      </div>
    </div>

    <!-- 完整明細表格 -->
    <div class="card">
      <h3 class="card-title">各部門完整明細</h3>
      <div class="table-scroll">
        <table class="dept-table">
          <thead>
            <tr>
              <th>部門</th>
              <th>員工數</th>
              <th>碳排放量</th>
              <th>廢棄物</th>
              <th>紙張用量</th>
              <th>用電量</th>
              <th>差旅里程</th>
              <th>人均碳排</th>
              <th>年度變化</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="d in enriched" :key="d.name">
              <td class="dept-name-cell"><component :is="deptIcons[d.name]" :size="15" />{{ d.name }}</td>
              <td>{{ d.employees }} 人</td>
              <td><span class="badge emission">{{ d.emissions }} tCO₂e</span></td>
              <td>{{ d.waste.toLocaleString() }} kg</td>
              <td>{{ d.paper }} 令</td>
              <td>{{ d.electricity.toLocaleString() }} kWh</td>
              <td>{{ d.travel.toLocaleString() }} km</td>
              <td><span class="badge per-cap">{{ d.perCapita }} t/人</span></td>
              <td><span class="chg-badge" :class="d.up ? 'up' : 'down'">{{ d.change }}</span></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- 人均表現分析 -->
    <div class="card">
      <h3 class="card-title">人均表現分析</h3>
      <p class="card-subtitle">每位員工年度平均資源消耗量</p>
      <div class="pc-grid">
        <div v-for="d in enriched" :key="'pc'+d.name" class="pc-card">
          <div class="pc-header">
            <div class="pc-icon"><component :is="deptIcons[d.name]" :size="22" /></div>
            <div class="pc-info">
              <div class="pc-name">{{ d.name }}</div>
              <div class="pc-emp">{{ d.employees }} 人</div>
            </div>
            <span class="chg-badge" :class="d.up ? 'up' : 'down'">{{ d.change }}</span>
          </div>
          <div class="pc-divider"></div>
          <div class="pc-metrics">
            <div class="pc-metric">
              <span class="pc-metric-label"><Leaf :size="12" color="#52c41a" style="vertical-align:-2px;margin-right:3px"/>人均碳排</span>
              <span class="pc-metric-val">{{ d.perCapita }} <em>tCO₂e</em></span>
            </div>
            <div class="pc-metric">
              <span class="pc-metric-label"><Trash2 :size="12" color="#fa8c16" style="vertical-align:-2px;margin-right:3px"/>人均廢棄物</span>
              <span class="pc-metric-val">{{ d.perCapitaWaste }} <em>kg</em></span>
            </div>
            <div class="pc-metric">
              <span class="pc-metric-label"><FileText :size="12" color="#36cfc9" style="vertical-align:-2px;margin-right:3px"/>人均紙張</span>
              <span class="pc-metric-val">{{ d.perCapitaPaper }} <em>令</em></span>
            </div>
            <div class="pc-metric">
              <span class="pc-metric-label"><Zap :size="12" color="#f6c23e" style="vertical-align:-2px;margin-right:3px"/>人均用電</span>
              <span class="pc-metric-val">{{ d.perCapitaElec }} <em>kWh</em></span>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<style scoped>
.departments-page { padding: 28px 32px; }
.page-header h1   { font-size: 26px; font-weight: 700; margin-bottom: 6px; }
.page-header p    { color: #8c8c8c; margin-bottom: 24px; }

/* ── KPI Row ──────────────────────────────────── */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 16px;
  margin-bottom: 20px;
}
.kpi-card {
  display: flex;
  align-items: center;
  gap: 12px;
  background: #fff;
  border-radius: 14px;
  padding: 16px 18px;
  box-shadow: 0 2px 12px rgba(0,0,0,.06);
}
.kpi-icon {
  font-size: 20px;
  width: 44px; height: 44px;
  border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.kpi-label { font-size: 12px; color: #8c8c8c; margin-bottom: 4px; }
.kpi-value { font-size: 20px; font-weight: 700; color: #1a1a2e; line-height: 1.2; }
.kpi-value span { font-size: 11px; color: #8c8c8c; font-weight: 400; margin-left: 2px; }
.kpi-dept  { font-size: 17px; }

/* ── Two-column ───────────────────────────────── */
.two-col {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
}
.two-col > .card { margin-bottom: 0; }

/* ── Card ─────────────────────────────────────── */
.card {
  background: #fff;
  border-radius: 14px;
  padding: 22px 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,.06);
  margin-bottom: 20px;
}
.card-title    { font-size: 16px; font-weight: 600; margin-bottom: 16px; color: #1a1a2e; }
.card-subtitle { font-size: 12px; color: #8c8c8c; margin-top: -10px; margin-bottom: 16px; }

.sub-label {
  font-size: 12px; font-weight: 600;
  color: #595959; margin-bottom: 10px;
}

/* ── Rank Rows ────────────────────────────────── */
.rank-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 10px;
}
.rank-row.compact { margin-bottom: 7px; }

.rank-no { width: 18px; font-size: 12px; font-weight: 700; color: #b0b7c3; text-align: center; flex-shrink: 0; }
.rank-no.rank-top { color: #5b8ff9; }
.rank-icon { font-size: 16px; flex-shrink: 0; }
.rank-name { width: 50px; font-size: 13px; font-weight: 600; color: #333; flex-shrink: 0; }

.rank-bar-wrap {
  flex: 1; height: 8px;
  background: #f0f2f5;
  border-radius: 4px; overflow: hidden;
}
.rank-bar { height: 100%; border-radius: 4px; transition: width .4s ease; }
.emission-bar { background: linear-gradient(90deg, #5b8ff9, #89b2fd); }
.waste-bar    { background: linear-gradient(90deg, #ff7a45, #ffab87); }
.paper-bar    { background: linear-gradient(90deg, #36cfc9, #87e8de); }

.rank-num    { font-size: 13px; font-weight: 700; color: #333; text-align: right; min-width: 38px; }
.rank-unit   { font-size: 11px; color: #b0b7c3; min-width: 32px; }
.rank-change { font-size: 12px; font-weight: 600; min-width: 42px; text-align: right; }
.rank-change.up   { color: #f5222d; }
.rank-change.down { color: #52c41a; }

/* ── Table ────────────────────────────────────── */
.table-scroll { overflow-x: auto; }
.dept-table { width: 100%; border-collapse: collapse; white-space: nowrap; }
.dept-table th,
.dept-table td { text-align: left; padding: 11px 14px; border-bottom: 1px solid #f0f2f5; font-size: 13px; }
.dept-table th { color: #8c8c8c; font-weight: 600; font-size: 12px; background: #fafbfc; }
.dept-table tbody tr:hover { background: #f5f8ff; }
.dept-table tbody tr:last-child td { border-bottom: none; }

.dept-name-cell { display: flex; align-items: center; gap: 6px; font-weight: 600; color: #333; }

.badge {
  display: inline-block; border-radius: 6px;
  padding: 2px 8px; font-size: 12px; font-weight: 600;
}
.badge.emission { background: #eff4ff; color: #3a6fe8; }
.badge.per-cap  { background: #f9f0ff; color: #7c3aed; }

.chg-badge {
  display: inline-block; border-radius: 20px;
  padding: 2px 9px; font-size: 12px; font-weight: 600;
}
.chg-badge.up   { background: #fff1f0; color: #f5222d; }
.chg-badge.down { background: #f6ffed; color: #389e0d; }

/* ── Per-capita Grid ──────────────────────────── */
.pc-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}
.pc-card {
  border: 1px solid #f0f2f5;
  border-radius: 12px;
  padding: 16px;
  background: #fafbfc;
}
.pc-header {
  display: flex; align-items: center; gap: 10px; margin-bottom: 10px;
}
.pc-icon {
  font-size: 22px; width: 42px; height: 42px;
  border-radius: 10px; background: #fff;
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 2px 8px rgba(0,0,0,.07);
  flex-shrink: 0;
}
.pc-info    { flex: 1; }
.pc-name    { font-size: 14px; font-weight: 700; color: #1a1a2e; }
.pc-emp     { font-size: 11px; color: #8c8c8c; }

.pc-divider { border-top: 1px solid #eef0f4; margin: 10px 0; }
.pc-metrics { display: flex; flex-direction: column; gap: 8px; }
.pc-metric  { display: flex; align-items: center; justify-content: space-between; }
.pc-metric-label { font-size: 12px; color: #595959; }
.pc-metric-val   { font-size: 13px; font-weight: 700; color: #1a1a2e; }
.pc-metric-val em {
  font-style: normal; font-size: 11px;
  color: #8c8c8c; font-weight: 400; margin-left: 2px;
}
</style>