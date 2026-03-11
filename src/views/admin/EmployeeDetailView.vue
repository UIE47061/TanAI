<script setup>
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import {
  ArrowLeft, Leaf, Trash2, FileText, Zap, Map, TrendingDown, TrendingUp,
  Cog, Truck, Microscope, Megaphone, FolderOpen, Users, ClipboardList,
  ChevronLeft, ChevronRight
} from 'lucide-vue-next'
import { allEmployees, deptConfig, deptAvg, generateLogs } from '@/data/employeeData.js'

const route  = useRoute()
const router = useRouter()

const deptIcons = { '製造部': Cog, '物流部': Truck, '研發部': Microscope, '行銷部': Megaphone, '行政部': FolderOpen, '人資部': Users }

const emp = computed(() => allEmployees.find(e => e.id === Number(route.params.id)))
const dc  = computed(() => deptConfig.find(d => d.name === emp.value?.dept))
const avg = computed(() => deptAvg[emp.value?.dept] ?? {})

// 月度排放（由基礎值生成 12 個月的模擬資料）
const monthlyEmissions = computed(() => {
  if (!emp.value) return []
  const base  = emp.value.emissions
  const seed  = emp.value.id
  const noise = [0.08, -0.06, 0.12, -0.04, 0.09, -0.10, 0.05, -0.08, 0.03, -0.12, -0.07, -0.15]
  return noise.map((n, i) => +( base * (1 + n + (seed % 3) * 0.01 - i * 0.008) ).toFixed(2))
})

const maxMonthly = computed(() => Math.max(...monthlyEmissions.value))
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

// 排放來源細分（根據各指標折算 tCO₂e）
const sources = computed(() => {
  if (!emp.value) return []
  const e = emp.value
  const electricity_co2 = +(e.electricity * 0.000494).toFixed(3)   // kWh → tCO₂e (台電係數)
  const travel_co2      = +(e.travel      * 0.000133).toFixed(3)   // km → tCO₂e (轎車均值)
  const waste_co2       = +(e.waste       * 0.000510).toFixed(3)   // kg → tCO₂e
  const paper_co2       = +(e.paper       * 0.000680).toFixed(3)   // 令 → tCO₂e
  const total           = electricity_co2 + travel_co2 + waste_co2 + paper_co2
  return [
    { label: '用電',   icon: Zap,      color: '#f6c23e', val: electricity_co2, raw: `${e.electricity.toLocaleString()} kWh`,   pct: Math.round(electricity_co2 / total * 100) },
    { label: '差旅',   icon: Map,      color: '#5b8ff9', val: travel_co2,      raw: `${e.travel.toLocaleString()} km`,          pct: Math.round(travel_co2      / total * 100) },
    { label: '廢棄物', icon: Trash2,   color: '#ff7a45', val: waste_co2,       raw: `${e.waste} kg`,                            pct: Math.round(waste_co2       / total * 100) },
    { label: '紙張',   icon: FileText, color: '#36cfc9', val: paper_co2,       raw: `${e.paper} 令`,                            pct: Math.round(paper_co2       / total * 100) },
  ]
})

// 與部門平均比較
const comparison = computed(() => {
  if (!emp.value) return []
  const e = emp.value, a = avg.value
  return [
    { label: '碳排放量',   icon: Leaf,     color: '#52c41a', unit: 'tCO₂e', personal: e.emissions,    deptAvg: a.emissions,    diff: +(e.emissions    - a.emissions   ).toFixed(2) },
    { label: '廢棄物',     icon: Trash2,   color: '#fa8c16', unit: 'kg',    personal: e.waste,         deptAvg: a.waste,         diff: +(e.waste         - a.waste        ).toFixed(1) },
    { label: '紙張用量',   icon: FileText, color: '#36cfc9', unit: '令',    personal: e.paper,         deptAvg: a.paper,         diff: +(e.paper         - a.paper        ).toFixed(1) },
    { label: '用電量',     icon: Zap,      color: '#f6c23e', unit: 'kWh',   personal: e.electricity,   deptAvg: a.electricity,   diff: +(e.electricity   - a.electricity  ).toFixed(0) },
    { label: '差旅里程',   icon: Map,      color: '#5b8ff9', unit: 'km',    personal: e.travel,        deptAvg: a.travel,        diff: +(e.travel         - a.travel       ).toFixed(0) },
  ]
})

// ── 活動記錄檔 ────────────────────────────────────────────────
const logIcons  = { waste: Trash2, paper: FileText, electricity: Zap, travel: Map }
const filterType  = ref('all')
const filterMonth = ref('')
const currentPage = ref(0)
const PAGE_SIZE   = 15

watch([filterType, filterMonth], () => { currentPage.value = 0 })

const allLogs = computed(() => emp.value ? generateLogs(emp.value) : [])

const logTypeTabs = computed(() => [
  { value: 'all',         label: '全部',   icon: ClipboardList, count: allLogs.value.length },
  { value: 'waste',       label: '廢棄物', icon: Trash2,        count: allLogs.value.filter(l => l.type === 'waste').length },
  { value: 'paper',       label: '紙張',   icon: FileText,      count: allLogs.value.filter(l => l.type === 'paper').length },
  { value: 'electricity', label: '用電',   icon: Zap,           count: allLogs.value.filter(l => l.type === 'electricity').length },
  { value: 'travel',      label: '差旅',   icon: Map,           count: allLogs.value.filter(l => l.type === 'travel').length },
])

const filteredLogs = computed(() =>
  allLogs.value.filter(log => {
    const typeOk  = filterType.value === 'all' || log.type === filterType.value
    const monthOk = !filterMonth.value || log.datetime.slice(5, 7) === filterMonth.value
    return typeOk && monthOk
  })
)

const totalPages    = computed(() => Math.ceil(filteredLogs.value.length / PAGE_SIZE))
const paginatedLogs = computed(() =>
  filteredLogs.value.slice(currentPage.value * PAGE_SIZE, (currentPage.value + 1) * PAGE_SIZE)
)
</script>

<template>
  <div class="detail-page">
    <button class="back-btn" @click="router.push('/admin/employees')">
      <ArrowLeft :size="15" /> 返回員工列表
    </button>

    <div v-if="!emp" class="not-found">找不到此員工資料。</div>

    <template v-else>
      <!-- ── Header ───────────────────────────────────────── -->
      <div class="emp-header card">
        <div class="emp-avatar-lg" :style="{ background: dc?.bg, color: dc?.color }">
          {{ emp.name.charAt(0) }}
        </div>
        <div class="emp-header-info">
          <div class="emp-header-name">{{ emp.name }}</div>
          <div class="emp-header-meta">
            <component :is="deptIcons[emp.dept]" :size="14" :color="dc?.color" />
            <span :style="{ color: dc?.color }">{{ emp.dept }}</span>
            <span class="meta-sep">·</span>
            <span>{{ emp.role }}</span>
          </div>
        </div>
        <span class="chg-badge-lg" :class="emp.up ? 'up' : 'down'">
          <component :is="emp.up ? TrendingUp : TrendingDown" :size="14" />
          {{ emp.trend }}
        </span>
      </div>

      <!-- ── KPI Row ──────────────────────────────────────── -->
      <div class="kpi-row">
        <div class="kpi-card">
          <div class="kpi-ic" style="background:#fff1f0"><Leaf     :size="18" color="#f5222d"/></div>
          <div class="kpi-label">年度碳排放</div>
          <div class="kpi-val">{{ emp.emissions }} <em>tCO₂e</em></div>
        </div>
        <div class="kpi-card">
          <div class="kpi-ic" style="background:#fff7e6"><Trash2   :size="18" color="#fa8c16"/></div>
          <div class="kpi-label">廢棄物</div>
          <div class="kpi-val">{{ emp.waste }} <em>kg</em></div>
        </div>
        <div class="kpi-card">
          <div class="kpi-ic" style="background:#e6fffb"><FileText :size="18" color="#36cfc9"/></div>
          <div class="kpi-label">紙張用量</div>
          <div class="kpi-val">{{ emp.paper }} <em>令</em></div>
        </div>
        <div class="kpi-card">
          <div class="kpi-ic" style="background:#fffbe6"><Zap      :size="18" color="#f6c23e"/></div>
          <div class="kpi-label">用電量</div>
          <div class="kpi-val">{{ emp.electricity.toLocaleString() }} <em>kWh</em></div>
        </div>
        <div class="kpi-card">
          <div class="kpi-ic" style="background:#eff4ff"><Map      :size="18" color="#5b8ff9"/></div>
          <div class="kpi-label">差旅里程</div>
          <div class="kpi-val">{{ emp.travel.toLocaleString() }} <em>km</em></div>
        </div>
      </div>

      <!-- ── 月度排放趨勢 ──────────────────────────────────── -->
      <div class="card">
        <h3 class="card-title">月度碳排趨勢</h3>
        <p class="card-sub">個人年度每月排放量預估（tCO₂e）</p>
        <div class="bar-chart">
          <div
            v-for="(v, i) in monthlyEmissions"
            :key="i"
            class="bar-col"
            :title="`${months[i]}: ${v} tCO₂e`"
          >
            <div class="bar-label-top">{{ v }}</div>
            <div
              class="bar-fill"
              :style="{ height: (v / maxMonthly * 100) + '%', background: dc?.color }"
            ></div>
            <div class="bar-month">{{ months[i] }}</div>
          </div>
        </div>
      </div>

      <!-- ── 排放來源細分 ──────────────────────────────────── -->
      <div class="card">
        <h3 class="card-title">排放來源細分</h3>
        <p class="card-sub">各類別消耗折算為 tCO₂e（使用官方排放係數計算）</p>
        <div class="source-list">
          <div v-for="s in sources" :key="s.label" class="source-row">
            <div class="source-label-wrap">
              <div class="source-icon-wrap" :style="{ background: s.color + '22' }">
                <component :is="s.icon" :size="14" :color="s.color" />
              </div>
              <span class="source-label">{{ s.label }}</span>
              <span class="source-raw">{{ s.raw }}</span>
            </div>
            <div class="source-bar-wrap">
              <div class="source-bar" :style="{ width: s.pct + '%', background: s.color }"></div>
            </div>
            <span class="source-pct">{{ s.pct }}%</span>
            <span class="source-val">{{ s.val }} tCO₂e</span>
          </div>
        </div>
      </div>

      <!-- ── 與部門平均對比 ────────────────────────────────── -->
      <div class="card">
        <h3 class="card-title">與部門平均對比</h3>
        <p class="card-sub">個人數據 vs 部門 {{ emp.dept }} 平均值</p>
        <div class="table-scroll">
          <table class="cmp-table">
            <thead>
              <tr>
                <th>項目</th>
                <th>個人</th>
                <th>部門平均</th>
                <th>差異</th>
                <th>狀態</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in comparison" :key="row.label">
                <td>
                  <div class="cmp-label-cell">
                    <div class="cmp-ic" :style="{ background: row.color + '22' }">
                      <component :is="row.icon" :size="13" :color="row.color" />
                    </div>
                    {{ row.label }}
                  </div>
                </td>
                <td class="fw-bold">{{ row.personal }} {{ row.unit }}</td>
                <td class="text-gray">{{ row.deptAvg }} {{ row.unit }}</td>
                <td>
                  <span :style="{ color: row.diff > 0 ? '#f5222d' : '#52c41a' }">
                    {{ row.diff > 0 ? '+' : '' }}{{ row.diff }} {{ row.unit }}
                  </span>
                </td>
                <td>
                  <span class="status-badge" :class="row.diff > 0 ? 'above' : 'below'">
                    {{ row.diff > 0 ? '高於平均' : '低於平均' }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- ── 活動記錄檔 ──────────────────────────────────── -->
      <div class="card">
        <div class="log-head">
          <div>
            <h3 class="card-title">活動記錄檔</h3>
            <p class="card-sub">廢棄物、紙張、用電及差旅的詳細紀錄（2025 年）</p>
          </div>
          <select v-model="filterMonth" class="log-select">
            <option value="">全年</option>
            <option v-for="(m, i) in months" :key="i" :value="String(i+1).padStart(2,'0')">{{ m }}</option>
          </select>
        </div>

        <div class="log-type-tabs">
          <button
            v-for="tab in logTypeTabs" :key="tab.value"
            class="log-tab"
            :class="{ active: filterType === tab.value }"
            @click="filterType = tab.value"
          >
            <component :is="tab.icon" :size="13" />
            <span>{{ tab.label }}</span>
            <span class="log-tab-count">{{ tab.count }}</span>
          </button>
        </div>

        <div class="log-list">
          <div v-for="(log, i) in paginatedLogs" :key="i" class="log-item">
            <div class="log-date-col">
              <span class="log-month">{{ log.datetime.slice(5, 7) }}月{{ log.datetime.slice(8, 10) }}日</span>
              <span class="log-time-stamp">{{ log.datetime.slice(11) }}</span>
            </div>
            <div class="log-icon-wrap" :style="{ background: log.color + '22' }">
              <component :is="logIcons[log.type]" :size="14" :color="log.color" />
            </div>
            <div class="log-content">
              <div class="log-note">{{ log.note }}</div>
              <div class="log-meta">{{ log.datetime.slice(0, 10) }}</div>
            </div>
            <span class="log-amount" :style="{ color: log.color }">
              {{ log.amount }}<em>{{ log.unit }}</em>
            </span>
          </div>
          <div v-if="filteredLogs.length === 0" class="log-empty">此篩選範圍無記錄</div>
        </div>

        <div v-if="totalPages > 1" class="log-pagination">
          <button class="pg-btn" :disabled="currentPage === 0" @click="currentPage--">
            <ChevronLeft :size="14" />
          </button>
          <span class="pg-info">{{ currentPage + 1 }} / {{ totalPages }}（共 {{ filteredLogs.length }} 筆）</span>
          <button class="pg-btn" :disabled="currentPage >= totalPages - 1" @click="currentPage++">
            <ChevronRight :size="14" />
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<style scoped>
.detail-page { padding: 28px 32px; }

.back-btn {
  display: inline-flex; align-items: center; gap: 6px;
  font-size: 13px; font-weight: 600; color: #5b8ff9;
  background: none; border: none; cursor: pointer; padding: 0; margin-bottom: 20px;
  transition: opacity .15s;
}
.back-btn:hover { opacity: .75; }

.not-found { text-align: center; padding: 60px; color: #8c8c8c; }

/* ── Card base ─────────────────────────────────────── */
.card {
  background: #fff; border-radius: 14px;
  padding: 22px 24px;
  box-shadow: 0 2px 12px rgba(0,0,0,.06);
  margin-bottom: 20px;
}
.card-title { font-size: 16px; font-weight: 600; color: #1a1a2e; margin-bottom: 4px; }
.card-sub   { font-size: 12px; color: #8c8c8c; margin-bottom: 16px; }

/* ── Header ───────────────────────────────────────── */
.emp-header { display: flex; align-items: center; gap: 16px; }
.emp-avatar-lg {
  width: 60px; height: 60px; border-radius: 16px;
  font-size: 24px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.emp-header-info { flex: 1; }
.emp-header-name { font-size: 22px; font-weight: 700; color: #1a1a2e; }
.emp-header-meta { display: flex; align-items: center; gap: 6px; margin-top: 4px; font-size: 13px; color: #595959; }
.meta-sep { color: #d9d9d9; }

.chg-badge-lg {
  display: inline-flex; align-items: center; gap: 4px;
  border-radius: 20px; padding: 5px 12px;
  font-size: 13px; font-weight: 700;
}
.chg-badge-lg.up   { background: #fff1f0; color: #f5222d; }
.chg-badge-lg.down { background: #f6ffed; color: #389e0d; }

/* ── KPI Row ──────────────────────────────────────── */
.kpi-row {
  display: grid; grid-template-columns: repeat(5, 1fr);
  gap: 14px; margin-bottom: 20px;
}
.kpi-card {
  background: #fff; border-radius: 12px;
  padding: 16px; text-align: center;
  box-shadow: 0 2px 8px rgba(0,0,0,.05);
  display: flex; flex-direction: column; align-items: center; gap: 6px;
}
.kpi-ic {
  width: 38px; height: 38px; border-radius: 10px;
  display: flex; align-items: center; justify-content: center;
}
.kpi-label { font-size: 11px; color: #8c8c8c; }
.kpi-val { font-size: 18px; font-weight: 700; color: #1a1a2e; }
.kpi-val em { font-style: normal; font-size: 11px; color: #8c8c8c; font-weight: 400; }

/* ── Monthly Bar Chart ────────────────────────────── */
.bar-chart {
  display: flex; align-items: flex-end; gap: 6px;
  height: 140px; padding-bottom: 20px; position: relative;
}
.bar-col {
  flex: 1; display: flex; flex-direction: column; align-items: center;
  height: 100%; justify-content: flex-end; position: relative;
}
.bar-label-top {
  font-size: 9px; color: #8c8c8c; font-weight: 600;
  margin-bottom: 2px; white-space: nowrap;
}
.bar-fill {
  width: 100%; border-radius: 4px 4px 0 0;
  transition: height .4s ease; min-height: 4px;
  opacity: .85;
}
.bar-fill:hover { opacity: 1; }
.bar-month {
  position: absolute; bottom: 0; font-size: 9px; color: #b0b7c3; margin-top: 4px;
}

/* ── Source breakdown ─────────────────────────────── */
.source-list { display: flex; flex-direction: column; gap: 12px; }
.source-row  { display: flex; align-items: center; gap: 12px; }
.source-label-wrap { display: flex; align-items: center; gap: 8px; width: 200px; flex-shrink: 0; }
.source-icon-wrap {
  width: 26px; height: 26px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.source-label { font-size: 13px; font-weight: 600; color: #333; }
.source-raw   { font-size: 11px; color: #b0b7c3; margin-left: auto; }
.source-bar-wrap {
  flex: 1; height: 10px; background: #f0f2f5; border-radius: 5px; overflow: hidden;
}
.source-bar { height: 100%; border-radius: 5px; transition: width .4s ease; }
.source-pct { font-size: 12px; font-weight: 700; color: #333; min-width: 34px; text-align: right; }
.source-val { font-size: 12px; color: #8c8c8c; min-width: 80px; text-align: right; }

/* ── Comparison Table ─────────────────────────────── */
.table-scroll { overflow-x: auto; }
.cmp-table { width: 100%; border-collapse: collapse; }
.cmp-table th,
.cmp-table td { padding: 11px 14px; text-align: left; border-bottom: 1px solid #f0f2f5; font-size: 13px; }
.cmp-table th { color: #8c8c8c; font-size: 12px; font-weight: 600; background: #fafbfc; }
.cmp-table tbody tr:hover { background: #f5f8ff; }
.cmp-table tbody tr:last-child td { border-bottom: none; }

.cmp-label-cell { display: flex; align-items: center; gap: 8px; }
.cmp-ic {
  width: 24px; height: 24px; border-radius: 6px;
  display: flex; align-items: center; justify-content: center; flex-shrink: 0;
}
.fw-bold  { font-weight: 700; }
.text-gray { color: #8c8c8c; }

.status-badge {
  display: inline-block; border-radius: 20px;
  padding: 2px 8px; font-size: 11px; font-weight: 600;
}
.status-badge.above { background: #fff1f0; color: #f5222d; }
.status-badge.below { background: #f6ffed; color: #389e0d; }

/* ── Activity Log ─────────────────────────────────── */
.log-head {
  display: flex; align-items: flex-start; justify-content: space-between;
  margin-bottom: 12px;
}
.log-head .card-title { margin-bottom: 2px; }
.log-head .card-sub   { margin-bottom: 0; }

.log-select {
  appearance: none; -webkit-appearance: none;
  border: 1px solid #e8eaef; background: #f5f7fa;
  border-radius: 8px; padding: 6px 28px 6px 12px; font-size: 12px;
  font-weight: 600; color: #333; cursor: pointer; outline: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%235b8ff9'/%3E%3C/svg%3E");
  background-repeat: no-repeat; background-position: right 10px center; background-size: 8px 5px;
  transition: border-color .15s;
}
.log-select:hover { border-color: #5b8ff9; }

.log-type-tabs {
  display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 16px;
}
.log-tab {
  display: inline-flex; align-items: center; gap: 5px;
  padding: 6px 12px; border-radius: 20px; font-size: 12px; font-weight: 500;
  border: 1px solid #e8eaef; background: #fff; color: #595959;
  cursor: pointer; transition: all .15s;
}
.log-tab:hover  { border-color: #5b8ff9; color: #5b8ff9; }
.log-tab.active { background: #5b8ff9; border-color: #5b8ff9; color: #fff; }
.log-tab-count {
  background: rgba(0,0,0,.08); border-radius: 10px;
  padding: 1px 6px; font-size: 11px;
}
.log-tab.active .log-tab-count { background: rgba(255,255,255,.25); }

.log-list { display: flex; flex-direction: column; }

.log-item {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 4px;
  border-bottom: 1px solid #f0f2f5;
  transition: background .12s;
  border-radius: 6px;
}
.log-item:hover { background: #f8faff; }
.log-item:last-child { border-bottom: none; }

.log-date-col {
  display: flex; flex-direction: column; align-items: center;
  min-width: 32px; flex-shrink: 0;
}
.log-month { font-size: 11px; color: #1a1a2e; font-weight: 700; line-height: 1.3; white-space: nowrap; }
.log-time-stamp { font-size: 10px; color: #7c8db5; font-weight: 500; letter-spacing: 0.3px; margin-top: 2px; }

.log-icon-wrap {
  width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
  display: flex; align-items: center; justify-content: center;
}
.log-content  { flex: 1; min-width: 0; }
.log-note     { font-size: 13px; font-weight: 600; color: #333; }
.log-meta     { font-size: 11px; color: #b0b7c3; margin-top: 1px; }

.log-amount { font-size: 14px; font-weight: 700; white-space: nowrap; }
.log-amount em { font-style: normal; font-size: 11px; font-weight: 400; margin-left: 2px; }

.log-empty {
  text-align: center; padding: 32px;
  color: #b0b7c3; font-size: 13px;
}

.log-pagination {
  display: flex; align-items: center; justify-content: center;
  gap: 12px; padding-top: 14px; border-top: 1px solid #f0f2f5; margin-top: 4px;
}
.pg-btn {
  width: 30px; height: 30px; border-radius: 8px;
  border: 1px solid #e8eaef; background: #f5f7fa;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: all .15s; color: #5b8ff9;
}
.pg-btn:disabled { color: #ccc; cursor: not-allowed; }
.pg-btn:not(:disabled):hover { background: #e5edff; border-color: #5b8ff9; }
.pg-info { font-size: 12px; color: #8c8c8c; font-weight: 500; }
</style>
