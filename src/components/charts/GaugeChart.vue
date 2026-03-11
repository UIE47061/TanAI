<script setup>
import { computed } from 'vue'

const props = defineProps({
  percent: { type: Number, required: true }
})

const needleX2 = computed(() => 70 + 40 * Math.cos((-180 + props.percent * 1.8) * Math.PI / 180))
const needleY2 = computed(() => 80 + 40 * Math.sin((-180 + props.percent * 1.8) * Math.PI / 180))
</script>

<template>
  <div class="card gauge-card">
    <h3 class="card-title">減碳目標達成率</h3>
    <div class="gauge-wrap">
      <svg viewBox="0 0 140 90" class="gauge-svg">
        <defs>
          <linearGradient id="gaugeGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stop-color="#f6bd16"/>
            <stop offset="50%"  stop-color="#5ad8a6"/>
            <stop offset="100%" stop-color="#5b8ff9"/>
          </linearGradient>
        </defs>
        <path d="M15,80 A55,55 0 0,1 125,80"
          fill="none" stroke="#eef0f4" stroke-width="10" stroke-linecap="round"/>
        <path d="M15,80 A55,55 0 0,1 125,80"
          fill="none" stroke="url(#gaugeGrad)" stroke-width="10" stroke-linecap="round"
          :stroke-dasharray="`${percent * 1.73} 173`"/>
        <line x1="70" y1="80" :x2="needleX2" :y2="needleY2"
          stroke="#333" stroke-width="2" stroke-linecap="round"/>
        <circle cx="70" cy="80" r="4" fill="#333"/>
      </svg>
      <div class="gauge-labels">
        <span>0%</span>
        <span class="gauge-center">{{ percent }}%</span>
        <span>100%</span>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gauge-card  { display: flex; flex-direction: column; align-items: center; }
.gauge-wrap  { text-align: center; flex: 1; display: flex; flex-direction: column; justify-content: center; }
.gauge-svg   { width: 140px; display: block; margin: 0 auto; }
.gauge-labels {
  display: flex;
  justify-content: space-between;
  width: 140px;
  margin: 4px auto 0;
  font-size: 11px;
  color: #8c8c8c;
}
.gauge-center { font-size: 18px; font-weight: 700; color: #333; margin-top: -8px; }
</style>
