<script setup>
import { computed } from 'vue'

const props = defineProps({
  labels:       { type: Array, required: true },
  values:       { type: Array, required: true },  // 0–1 scale（控制雷達圖形狀）
  actualValues: { type: Array, default: () => [] } // 實際排放量（公噸）
})

const radarGrid = (scale) => {
  const cx = 80, cy = 80, r = 60
  return Array.from({ length: props.labels.length }, (_, i) => {
    const angle = (Math.PI * 2 * i) / props.labels.length - Math.PI / 2
    return `${cx + r * scale * Math.cos(angle)},${cy + r * scale * Math.sin(angle)}`
  }).join(' ')
}

const radarPoints = computed(() => {
  const cx = 80, cy = 80, r = 60
  return props.values.map((v, i) => {
    const angle = (Math.PI * 2 * i) / props.values.length - Math.PI / 2
    return `${cx + r * v * Math.cos(angle)},${cy + r * v * Math.sin(angle)}`
  }).join(' ')
})

const labelPositions = computed(() => {
  const cx = 80, cy = 80, r = 75
  return props.labels.map((label, i) => {
    const angle = (Math.PI * 2 * i) / props.labels.length - Math.PI / 2
    return { label, x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) }
  })
})
</script>

<template>
  <div class="card radar-card">
    <div class="card-head">
      <h3 class="card-title">排放類型分布</h3>
    </div>
    <svg viewBox="0 0 160 160" class="radar-svg">
      <polygon v-for="s in [1, .75, .5, .25]" :key="s"
        :points="radarGrid(s)" fill="none" stroke="#e8ecf1" stroke-width="1"/>
      <polygon :points="radarPoints" fill="rgba(91,143,249,.2)" stroke="#5b8ff9" stroke-width="2"/>
      <text v-for="lp in labelPositions" :key="lp.label"
        :x="lp.x" :y="lp.y" text-anchor="middle" font-size="9" fill="#8c8c8c">{{ lp.label }}</text>
    </svg>
    <div class="radar-legend">
      <div v-for="(val, i) in values" :key="i" class="radar-legend-item">
        <span class="radar-dot"></span>
        <span class="radar-legend-label">{{ labels[i] }}</span>
        <span class="radar-legend-val">
          {{ actualValues.length ? actualValues[i] + ' 公噸' : Math.round(val * 100) + '%' }}
        </span>
      </div>
    </div>
    <div class="radar-note">單位：公噸 CO₂e（各類別年度排放估算值）</div>
  </div>
</template>

<style scoped>
.radar-svg { width: 100%; max-height: 150px; display: block; margin: 0 auto; }
.radar-legend {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4px 8px;
  margin-top: 8px;
  padding: 0 4px;
}
.radar-legend-item { display: flex; align-items: center; gap: 5px; }
.radar-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #5b8ff9;
  flex-shrink: 0;
}
.radar-legend-label { font-size: 11px; color: #555; flex: 1; }
.radar-legend-val   { font-size: 11px; font-weight: 700; color: #5b8ff9; }
.radar-note {
  font-size: 10px;
  color: #b0b7c3;
  text-align: center;
  margin-top: 8px;
  padding-top: 6px;
  border-top: 1px solid #f0f2f5;
}
</style>
