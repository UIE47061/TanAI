<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  title: { type: String, required: true },
  value: { type: [String, Number], required: true },
  unit: { type: String, default: '' },
  iconType: { type: String, default: 'emission' },
  trend: { type: String, default: '' },
  trendType: { type: String, default: 'neutral' },
  percentage: { type: Number, default: 0 },
  index: { type: Number, default: 0 },
  tooltipLines: { type: Array, default: () => [] }
})

const showTooltip = ref(false)

const circleColor = computed(() => {
  const colors = ['#5b8ff9', '#5ad8a6', '#5d7092', '#f6bd16']
  return colors[props.index % colors.length]
})

const dashArray = computed(() => {
  const circumference = 2 * Math.PI * 36
  const filled = (props.percentage / 100) * circumference
  return `${filled} ${circumference - filled}`
})

const displayNumber = computed(() => {
  return String(props.index + 1).padStart(2, '0')
})
</script>

<template>
  <div class="kpi-card" @mouseenter="showTooltip = true" @mouseleave="showTooltip = false">
    <!-- Tooltip -->
    <transition name="fade">
      <div v-if="showTooltip && tooltipLines.length" class="kpi-tooltip">
        <div class="tooltip-title">計算說明</div>
        <div v-for="(line, i) in tooltipLines" :key="i" class="tooltip-line">{{ line }}</div>
      </div>
    </transition>
    <div class="kpi-top">
      <h3 class="kpi-title">{{ title }}</h3>
      <span class="material-icons-outlined kpi-more">more_horiz</span>
    </div>
    <div class="kpi-body">
      <div class="circle-wrap">
        <svg width="88" height="88" viewBox="0 0 88 88">
          <circle cx="44" cy="44" r="36" fill="none" stroke="#eef0f4" stroke-width="6"/>
          <circle cx="44" cy="44" r="36" fill="none"
            :stroke="circleColor" stroke-width="6" stroke-linecap="round"
            :stroke-dasharray="dashArray"
            stroke-dashoffset="0"
            transform="rotate(-90 44 44)"
            style="transition: stroke-dasharray .6s ease;"
          />
        </svg>
        <span class="circle-pct">{{ percentage }}%</span>
      </div>
      <div class="kpi-info">
        <span class="kpi-number">{{ displayNumber }}</span>
        <div class="kpi-value-row">
          <span class="kpi-value">{{ value }}</span>
          <span class="kpi-unit">{{ unit }}</span>
        </div>
        <div class="kpi-slider">
          <input type="range" min="0" max="100" :value="percentage" disabled class="mini-range" :style="{ '--range-color': circleColor }">
          <span class="kpi-slider-max">100</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.kpi-card {
  background: #fff;
  border-radius: 14px;
  padding: 20px;
  box-shadow: 0 2px 12px rgba(0,0,0,.06);
  transition: transform .2s, box-shadow .2s;
  position: relative;
}
.kpi-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0,0,0,.1);
}
.kpi-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}
.kpi-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}
.kpi-more {
  font-size: 18px;
  color: #b0b7c3;
  cursor: pointer;
}
.kpi-body {
  display: flex;
  align-items: center;
  gap: 18px;
}
.circle-wrap {
  position: relative;
  flex-shrink: 0;
  width: 88px;
  height: 88px;
}
.circle-pct {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  color: #333;
}
.kpi-info {
  flex: 1;
  min-width: 0;
}
.kpi-number {
  font-size: 28px;
  font-weight: 700;
  color: #333;
  line-height: 1;
}
.kpi-value-row {
  display: flex;
  align-items: baseline;
  gap: 4px;
  margin-top: 2px;
}
.kpi-value {
  font-size: 13px;
  color: #8c8c8c;
  font-weight: 500;
}
.kpi-unit {
  font-size: 12px;
  color: #aaa;
}
.kpi-slider {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}
.mini-range {
  flex: 1;
  -webkit-appearance: none;
  appearance: none;
  height: 4px;
  border-radius: 2px;
  background: #eef0f4;
  outline: none;
}
.mini-range::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 0;
  height: 0;
}
.mini-range {
  background: linear-gradient(to right, var(--range-color) 0%, var(--range-color) var(--pct, 50%), #eef0f4 var(--pct, 50%));
}
.kpi-slider-max {
  font-size: 12px;
  color: #b0b7c3;
  font-weight: 500;
}

/* ===== Tooltip ===== */
.kpi-tooltip {
  position: absolute;
  top: calc(100% + 10px);
  left: 50%;
  transform: translateX(-50%);
  background: rgba(26, 26, 46, 0.93);
  color: #fff;
  border-radius: 10px;
  padding: 12px 16px;
  min-width: 200px;
  max-width: 260px;
  z-index: 100;
  pointer-events: none;
  box-shadow: 0 8px 24px rgba(0,0,0,.18);
}
.kpi-tooltip::before {
  content: '';
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  border-width: 0 6px 6px 6px;
  border-style: solid;
  border-color: transparent transparent rgba(26,26,46,0.93) transparent;
}
.tooltip-title {
  font-size: 12px;
  font-weight: 700;
  color: #a0aec0;
  text-transform: uppercase;
  letter-spacing: .06em;
  margin-bottom: 8px;
  padding-bottom: 6px;
  border-bottom: 1px solid rgba(255,255,255,.12);
}
.tooltip-line {
  font-size: 12px;
  color: #e2e8f0;
  line-height: 1.6;
  padding: 2px 0;
}
.tooltip-line::before {
  content: '• ';
  color: #5b8ff9;
}
.fade-enter-active, .fade-leave-active { transition: opacity .2s, transform .2s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateX(-50%) translateY(-4px); }
</style>
