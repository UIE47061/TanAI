<script setup>
import { ref } from 'vue'

const props = defineProps({
  data:       { type: Array,  required: true },  // [{ label, values: [n, n, n] }]
  year:       { type: Number, required: true },
  categories: { type: Array,  default: () => ['能源消耗', '商務差旅', '廢棄物'] },
  colors:     { type: Array,  default: () => ['#5b8ff9', '#5ad8a6', '#f6bd16'] }
})

const hoveredBar = ref(null)   // { gi, bi }
const tooltipPos = ref({ x: 0, y: 0 })

function onBarEnter(e, gi, bi) {
  hoveredBar.value = { gi, bi }
  tooltipPos.value = { x: e.clientX, y: e.clientY }
}
function onBarMove(e) {
  tooltipPos.value = { x: e.clientX, y: e.clientY }
}
function onBarLeave() {
  hoveredBar.value = null
}
</script>

<template>
  <div class="card barchart-card">
    <div class="card-head">
      <div>
        <h3 class="card-title">季度排放比較</h3>
        <span class="bar-subtitle">{{ year }} 年各季・單位：公噸 CO₂e</span>
      </div>
    </div>

    <div class="bar-legend">
      <span v-for="(cat, i) in categories" :key="i" class="bar-legend-item">
        <span class="bar-dot" :style="{ background: colors[i] }"></span>{{ cat }}
      </span>
    </div>

    <svg viewBox="0 0 320 180" class="bar-svg">
      <line v-for="i in 4" :key="i"
        x1="40" :y1="20 + (i-1)*45" x2="300" :y2="20 + (i-1)*45"
        stroke="#eef0f4" stroke-width="1"/>
      <text v-for="i in 4" :key="'yt'+i"
        x="36" :y="24 + (i-1)*45" text-anchor="end" font-size="8" fill="#b0b7c3">
        {{ 90 - (i-1)*30 }}
      </text>
      <g v-for="(group, gi) in data" :key="gi" :transform="`translate(${55 + gi * 65}, 0)`">
        <rect v-for="(v, bi) in group.values" :key="bi"
          :x="bi * 14" :y="155 - v * 1.3" :width="10" :height="v * 1.3"
          :rx="2" :fill="colors[bi]"
          :opacity="hoveredBar && hoveredBar.gi === gi && hoveredBar.bi === bi ? 1 : 0.85"
          style="cursor: pointer; transition: opacity .15s;"
          @mouseenter="(e) => onBarEnter(e, gi, bi)"
          @mousemove="onBarMove"
          @mouseleave="onBarLeave"
        />
        <text :x="20" y="172" text-anchor="middle" font-size="10" fill="#8c8c8c">
          {{ group.label }}
        </text>
      </g>
    </svg>

    <div class="bar-totals">
      <div v-for="group in data" :key="group.label" class="bar-total-item">
        <span class="bar-total-label">{{ group.label }} 合計</span>
        <span class="bar-total-val">{{ group.values.reduce((a, b) => a + b, 0) }} 公噸</span>
      </div>
    </div>

    <!-- Hover Tooltip -->
    <teleport to="body">
      <transition name="tt-fade">
        <div v-if="hoveredBar"
          class="chart-tooltip"
          :style="{ left: tooltipPos.x + 14 + 'px', top: tooltipPos.y - 60 + 'px' }"
        >
          <div class="tt-header">
            <span class="tt-dot-inline" :style="{ background: colors[hoveredBar.bi] }"></span>
            {{ data[hoveredBar.gi].label }}・{{ categories[hoveredBar.bi] }}
          </div>
          <div class="tt-row">
            <span class="tt-label">排放量</span>
            <span class="tt-val">{{ data[hoveredBar.gi].values[hoveredBar.bi] }} 公噸 CO₂e</span>
          </div>
          <div class="tt-row">
            <span class="tt-label">佔本季比例</span>
            <span class="tt-val">
              {{ Math.round(data[hoveredBar.gi].values[hoveredBar.bi] / data[hoveredBar.gi].values.reduce((a,b)=>a+b,0) * 100) }}%
            </span>
          </div>
        </div>
      </transition>
    </teleport>
  </div>
</template>

<style scoped>
.bar-svg    { width: 100%; height: auto; display: block; }
.bar-subtitle { font-size: 11px; color: #8c8c8c; display: block; margin-top: 2px; }
.bar-legend { display: flex; gap: 12px; margin-bottom: 8px; }
.bar-legend-item {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: 11px;
  color: #555;
}
.bar-dot { width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; }
.bar-totals {
  display: flex;
  justify-content: space-around;
  border-top: 1px solid #f0f2f5;
  margin-top: 8px;
  padding-top: 10px;
}
.bar-total-item { display: flex; flex-direction: column; align-items: center; gap: 2px; }
.bar-total-label { font-size: 10px; color: #b0b7c3; }
.bar-total-val   { font-size: 12px; font-weight: 700; color: #333; }

/* ===== Tooltip ===== */
.chart-tooltip {
  position: fixed;
  z-index: 9999;
  background: rgba(26, 26, 46, 0.93);
  color: #fff;
  border-radius: 10px;
  padding: 10px 14px;
  min-width: 180px;
  pointer-events: none;
  box-shadow: 0 6px 20px rgba(0,0,0,.2);
}
.tt-header {
  font-size: 12px;
  font-weight: 700;
  color: #e2e8f0;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(255,255,255,.12);
  display: flex;
  align-items: center;
  gap: 6px;
}
.tt-dot-inline {
  width: 8px; height: 8px; border-radius: 2px; flex-shrink: 0; display: inline-block;
}
.tt-row   { display: flex; align-items: center; padding: 2px 0; gap: 8px; }
.tt-label { font-size: 12px; color: #cbd5e0; flex: 1; }
.tt-val   { font-size: 12px; font-weight: 700; color: #fff; }
.tt-fade-enter-active, .tt-fade-leave-active { transition: opacity .15s; }
.tt-fade-enter-from,  .tt-fade-leave-to      { opacity: 0; }
</style>
