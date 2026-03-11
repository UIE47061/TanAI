<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  year:    { type: Number, required: true },
  months:  { type: Array,  required: true },
  values:  { type: Array,  required: true },
  targets: { type: Array,  required: true },
  max:     { type: Number, default: 200 },
  unit:    { type: String, default: '公噸 CO₂e' },
  yTicks:  { type: Array,  default: () => [0, 50, 100, 150, 200] }
})

const hoveredIdx  = ref(null)
const tooltipPos  = ref({ x: 0, y: 0 })

function onPointEnter(e, i) {
  hoveredIdx.value = i
  tooltipPos.value = { x: e.clientX, y: e.clientY }
}
function onPointMove(e) {
  tooltipPos.value = { x: e.clientX, y: e.clientY }
}
function onPointLeave() {
  hoveredIdx.value = null
}

const W = 760, H = 220, PX = 50

const stepX = computed(() => (W - PX - 20) / (props.values.length - 1))

const areaPoints = computed(() =>
  props.values.map((v, i) => {
    const x = PX + i * stepX.value
    const y = H - 30 - (v / props.max) * (H - 60)
    return `${x},${y}`
  }).join(' ')
)

const areaPath = computed(() => {
  const pts = props.values.map((v, i) => {
    const x = PX + i * stepX.value
    const y = H - 30 - (v / props.max) * (H - 60)
    return `${x},${y}`
  })
  const last = PX + (props.values.length - 1) * stepX.value
  return `M${pts[0]} L${pts.join(' L')} L${last},${H - 30} L${PX},${H - 30} Z`
})

const targetPoints = computed(() =>
  props.targets.map((v, i) => {
    const x = PX + i * stepX.value
    const y = H - 30 - (v / props.max) * (H - 60)
    return `${x},${y}`
  }).join(' ')
)

const yTickPositions = computed(() =>
  props.yTicks.map(v => ({
    value: v,
    y: H - 30 - (v / props.max) * (H - 60)
  }))
)

const total    = computed(() => props.values.reduce((a, b) => a + b, 0))
const avg      = computed(() => Math.round(total.value / props.values.length))
const maxVal   = computed(() => Math.max(...props.values))
const minVal   = computed(() => Math.min(...props.values))
const maxMonth = computed(() => props.months[props.values.indexOf(maxVal.value)])
const minMonth = computed(() => props.months[props.values.indexOf(minVal.value)])
const trend    = computed(() => {
  const first = props.values[0]
  const last  = props.values[props.values.length - 1]
  const pct   = Math.round(Math.abs((last - first) / first) * 100)
  return { pct, down: last < first }
})
</script>

<template>
  <div class="card area-card">
    <div class="card-head">
      <div>
        <h3 class="card-title">年度碳排趨勢</h3>
        <span class="area-subtitle">{{ year }} 年月度排放量（單位：{{ unit }}）</span>
      </div>
      <div class="legend">
        <span class="legend-item"><span class="dot blue"></span>實際排放量</span>
        <span class="legend-item"><span class="dot green"></span>減碳目標</span>
      </div>
    </div>

    <svg class="area-svg" viewBox="0 0 760 220" preserveAspectRatio="none">
      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#5b8ff9" stop-opacity=".3"/>
          <stop offset="100%" stop-color="#5b8ff9" stop-opacity=".02"/>
        </linearGradient>
      </defs>
      <g v-for="tick in yTickPositions" :key="tick.value">
        <line x1="50" :y1="tick.y" x2="740" :y2="tick.y" stroke="#eef0f4" stroke-width="1"/>
        <text :x="44" :y="tick.y + 4" text-anchor="end" font-size="9" fill="#b0b7c3">{{ tick.value }}</text>
      </g>
      <text x="8" y="30" font-size="8.5" fill="#b0b7c3" transform="rotate(-90, 8, 30)" text-anchor="end">{{ unit }}</text>
      <path :d="areaPath" fill="url(#areaGrad)"/>
      <polyline :points="targetPoints" fill="none" stroke="#5ad8a6" stroke-width="2"
        stroke-dasharray="6 4" stroke-linecap="round" stroke-linejoin="round"/>
      <polyline :points="areaPoints" fill="none" stroke="#5b8ff9" stroke-width="2.5"
        stroke-linecap="round" stroke-linejoin="round"/>
      <!-- 資料點：使用 values 直接計算座標，支援 hover -->
      <circle v-for="(v, i) in values" :key="i"
        :cx="PX + i * stepX" :cy="H - 30 - (v / max) * (H - 60)"
        :r="hoveredIdx === i ? 6 : 3.5"
        fill="#fff" stroke="#5b8ff9" stroke-width="2"
        style="cursor: pointer; transition: r .15s;"
        @mouseenter="(e) => onPointEnter(e, i)"
        @mousemove="onPointMove"
        @mouseleave="onPointLeave"
      />
    </svg>

    <div class="x-labels">
      <span v-for="m in months" :key="m">{{ m }}</span>
    </div>

    <div class="area-stats">
      <div class="area-stat-item">
        <span class="area-stat-label">年度累計</span>
        <span class="area-stat-value">{{ total.toLocaleString() }} 公噸</span>
      </div>
      <div class="area-stat-item">
        <span class="area-stat-label">月均排放</span>
        <span class="area-stat-value">{{ avg }} 公噸</span>
      </div>
      <div class="area-stat-item">
        <span class="area-stat-label">最高月份</span>
        <span class="area-stat-value area-stat-up">{{ maxVal }} 公噸（{{ maxMonth }}）</span>
      </div>
      <div class="area-stat-item">
        <span class="area-stat-label">最低月份</span>
        <span class="area-stat-value area-stat-down">{{ minVal }} 公噸（{{ minMonth }}）</span>
      </div>
      <div class="area-stat-item">
        <span class="area-stat-label">年初至今趨勢</span>
        <span class="area-stat-value" :class="trend.down ? 'area-stat-down' : 'area-stat-up'">
          {{ trend.down ? '↓' : '↑' }} {{ trend.pct }}% 相較年初
        </span>
      </div>
    </div>

    <!-- Hover Tooltip -->
    <teleport to="body">
      <transition name="tt-fade">
        <div v-if="hoveredIdx !== null"
          class="chart-tooltip"
          :style="{ left: tooltipPos.x + 14 + 'px', top: tooltipPos.y - 60 + 'px' }"
        >
          <div class="tt-header">{{ months[hoveredIdx] }}・{{ year }}</div>
          <div class="tt-row">
            <span class="tt-dot" style="background:#5b8ff9"></span>
            <span class="tt-label">實際排放</span>
            <span class="tt-val">{{ values[hoveredIdx] }} 公噸</span>
          </div>
          <div class="tt-row">
            <span class="tt-dot" style="background:#5ad8a6; border-style: dashed;"></span>
            <span class="tt-label">減碳目標</span>
            <span class="tt-val">{{ targets[hoveredIdx] }} 公噸</span>
          </div>
          <div class="tt-divider"></div>
          <div class="tt-row">
            <span class="tt-label">差異</span>
            <span class="tt-val" :style="{ color: values[hoveredIdx] > targets[hoveredIdx] ? '#f5222d' : '#52c41a' }">
              {{ values[hoveredIdx] > targets[hoveredIdx] ? '+' : '' }}{{ values[hoveredIdx] - targets[hoveredIdx] }} 公噸
            </span>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<style scoped>
.area-card    { overflow: hidden; }
.area-subtitle {
  font-size: 12px;
  color: #8c8c8c;
  font-weight: 400;
  margin-top: 2px;
  display: block;
}
.area-svg { width: 100%; height: 220px; display: block; }
.x-labels {
  display: flex;
  justify-content: space-between;
  padding: 6px 50px 0 50px;
  font-size: 11px;
  color: #8c8c8c;
}
.area-stats {
  display: flex;
  border-top: 1px solid #f0f2f5;
  margin-top: 12px;
  padding-top: 12px;
}
.area-stat-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 3px;
  border-right: 1px solid #f0f2f5;
  padding: 0 8px;
}
.area-stat-item:last-child { border-right: none; }
.area-stat-label { font-size: 11px; color: #b0b7c3; font-weight: 500; }
.area-stat-value { font-size: 13px; font-weight: 700; color: #333; }
.area-stat-up   { color: #f5222d; }
.area-stat-down { color: #52c41a; }

/* ===== Tooltip ===== */
.chart-tooltip {
  position: fixed;
  z-index: 9999;
  background: rgba(26, 26, 46, 0.93);
  color: #fff;
  border-radius: 10px;
  padding: 10px 14px;
  min-width: 170px;
  pointer-events: none;
  box-shadow: 0 6px 20px rgba(0,0,0,.2);
}
.tt-header {
  font-size: 12px;
  font-weight: 700;
  color: #a0aec0;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(255,255,255,.12);
}
.tt-row { display: flex; align-items: center; gap: 6px; padding: 2px 0; }
.tt-dot {
  width: 8px; height: 8px; border-radius: 50%;
  border: 1.5px solid transparent;
  flex-shrink: 0;
}
.tt-label { font-size: 12px; color: #cbd5e0; flex: 1; }
.tt-val   { font-size: 12px; font-weight: 700; color: #fff; }
.tt-divider { border-top: 1px solid rgba(255,255,255,.12); margin: 6px 0 4px; }
.tt-fade-enter-active, .tt-fade-leave-active { transition: opacity .15s; }
.tt-fade-enter-from,  .tt-fade-leave-to      { opacity: 0; }
</style>
