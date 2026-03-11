<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import {
  Search, ChevronDown, ChevronUp, Leaf, Trash2, FileText, Zap, ArrowRight,
  Cog, Truck, Microscope, Megaphone, FolderOpen, Users
} from 'lucide-vue-next'
import { allEmployees, deptConfig } from '@/data/employeeData.js'

const router = useRouter()

const deptIcons = { '製造部': Cog, '物流部': Truck, '研發部': Microscope, '行銷部': Megaphone, '行政部': FolderOpen, '人資部': Users }

const searchQuery   = ref('')
const filterDept    = ref('全部')
const collapsedDept = ref({})

function toggleDept(name) {
  collapsedDept.value[name] = !collapsedDept.value[name]
}

const filtered = computed(() => {
  const q = searchQuery.value.trim().toLowerCase()
  return allEmployees.filter(e => {
    const matchDept = filterDept.value === '全部' || e.dept === filterDept.value
    const matchName = !q || e.name.includes(q) || e.role.toLowerCase().includes(q)
    return matchDept && matchName
  })
})

const grouped = computed(() => {
  return deptConfig.map(dc => ({
    ...dc,
    employees: filtered.value.filter(e => e.dept === dc.name)
  })).filter(g => g.employees.length > 0)
})

function avatarInitial(name) { return name.charAt(0) }

function goDetail(id) { router.push(`/admin/employees/${id}`) }
</script>

<template>
  <div class="employees-page">
    <div class="page-header">
      <div>
        <h1>員工管理</h1>
        <p>查看各部門員工及其碳排放、廢棄物、用電等詳細資訊</p>
      </div>
    </div>

    <!-- 搜尋 & 篩選 -->
    <div class="filter-bar">
      <div class="search-wrap">
        <Search :size="15" color="#b0b7c3" class="search-icon" />
        <input v-model="searchQuery" class="search-input" placeholder="搜尋姓名或職稱…" />
      </div>
      <div class="dept-tabs">
        <button
          v-for="opt in ['全部', ...deptConfig.map(d => d.name)]"
          :key="opt"
          class="dept-tab"
          :class="{ active: filterDept === opt }"
          @click="filterDept = opt"
        >{{ opt }}</button>
      </div>
    </div>

    <!-- 無結果 -->
    <div v-if="grouped.length === 0" class="empty-state">
      <Search :size="36" color="#d9d9d9" />
      <p>找不到符合條件的員工</p>
    </div>

    <!-- 部門群組 -->
    <div v-for="group in grouped" :key="group.name" class="dept-section">
      <div class="dept-section-header" @click="toggleDept(group.name)">
        <div class="dept-section-left">
          <div class="dept-icon-wrap" :style="{ background: group.bg }">
            <component :is="deptIcons[group.name]" :size="17" :color="group.color" />
          </div>
          <span class="dept-section-name" :style="{ color: group.color }">{{ group.name }}</span>
          <span class="dept-count">{{ group.employees.length }} 人</span>
        </div>
        <ChevronUp v-if="!collapsedDept[group.name]" :size="18" color="#b0b7c3" />
        <ChevronDown v-else :size="18" color="#b0b7c3" />
      </div>

      <div v-show="!collapsedDept[group.name]" class="emp-grid">
        <div
          v-for="emp in group.employees"
          :key="emp.id"
          class="emp-card"
          @click="goDetail(emp.id)"
        >
          <div class="emp-card-top">
            <div class="emp-avatar" :style="{ background: group.bg, color: group.color }">
              {{ avatarInitial(emp.name) }}
            </div>
            <div class="emp-info">
              <div class="emp-name">{{ emp.name }}</div>
              <div class="emp-role">{{ emp.role }}</div>
            </div>
            <span class="chg-badge" :class="emp.up ? 'up' : 'down'">{{ emp.trend }}</span>
          </div>

          <div class="emp-divider"></div>

          <div class="emp-metrics">
            <div class="emp-metric">
              <Leaf :size="12" color="#52c41a" />
              <span>{{ emp.emissions }} tCO₂e</span>
            </div>
            <div class="emp-metric">
              <Trash2 :size="12" color="#fa8c16" />
              <span>{{ emp.waste }} kg</span>
            </div>
            <div class="emp-metric">
              <FileText :size="12" color="#36cfc9" />
              <span>{{ emp.paper }} 令</span>
            </div>
            <div class="emp-metric">
              <Zap :size="12" color="#f6c23e" />
              <span>{{ emp.electricity.toLocaleString() }} kWh</span>
            </div>
          </div>

          <div class="emp-footer">
            <span>查看詳情</span>
            <ArrowRight :size="13" color="#5b8ff9" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.employees-page { padding: 28px 32px; }
.page-header { margin-bottom: 20px; }
.page-header h1 { font-size: 26px; font-weight: 700; margin-bottom: 4px; }
.page-header p  { color: #8c8c8c; font-size: 14px; }

/* ── Filter Bar ───────────────────────────────────── */
.filter-bar {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
  flex-wrap: wrap;
}
.search-wrap {
  position: relative;
  flex: 0 0 220px;
}
.search-icon {
  position: absolute;
  left: 10px; top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
}
.search-input {
  width: 100%;
  border: 1px solid #e8eaef;
  border-radius: 8px;
  padding: 8px 12px 8px 30px;
  font-size: 13px;
  outline: none;
  color: #333;
  background: #fff;
  transition: border-color .15s;
  box-sizing: border-box;
}
.search-input:focus { border-color: #5b8ff9; box-shadow: 0 0 0 3px rgba(91,143,249,.12); }

.dept-tabs { display: flex; gap: 6px; flex-wrap: wrap; }
.dept-tab {
  padding: 6px 14px;
  border-radius: 20px;
  border: 1px solid #e8eaef;
  background: #fff;
  font-size: 12px;
  font-weight: 500;
  color: #595959;
  cursor: pointer;
  transition: all .15s;
}
.dept-tab:hover  { border-color: #5b8ff9; color: #5b8ff9; }
.dept-tab.active { background: #5b8ff9; border-color: #5b8ff9; color: #fff; }

/* ── Empty ────────────────────────────────────────── */
.empty-state {
  text-align: center; padding: 60px 0;
  color: #b0b7c3; font-size: 14px;
  display: flex; flex-direction: column; align-items: center; gap: 12px;
}

/* ── Dept Section ─────────────────────────────────── */
.dept-section { margin-bottom: 24px; }

.dept-section-header {
  display: flex; align-items: center; justify-content: space-between;
  background: #fff;
  border-radius: 12px;
  padding: 14px 20px;
  box-shadow: 0 2px 8px rgba(0,0,0,.05);
  cursor: pointer;
  margin-bottom: 12px;
  user-select: none;
  transition: box-shadow .15s;
}
.dept-section-header:hover { box-shadow: 0 4px 14px rgba(0,0,0,.09); }

.dept-section-left { display: flex; align-items: center; gap: 10px; }
.dept-icon-wrap {
  width: 32px; height: 32px;
  border-radius: 8px;
  display: flex; align-items: center; justify-content: center;
}
.dept-section-name { font-size: 15px; font-weight: 700; }
.dept-count {
  font-size: 12px; color: #8c8c8c;
  background: #f0f2f5; border-radius: 10px; padding: 2px 8px;
}

/* ── Employee Grid ────────────────────────────────── */
.emp-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 14px;
}

.emp-card {
  background: #fff;
  border-radius: 12px;
  padding: 16px;
  box-shadow: 0 2px 8px rgba(0,0,0,.05);
  cursor: pointer;
  transition: transform .15s, box-shadow .15s;
  border: 1.5px solid transparent;
}
.emp-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 18px rgba(91,143,249,.14);
  border-color: #c8daff;
}

.emp-card-top { display: flex; align-items: flex-start; gap: 10px; }

.emp-avatar {
  width: 40px; height: 40px;
  border-radius: 10px;
  font-size: 17px; font-weight: 700;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
}
.emp-info { flex: 1; min-width: 0; }
.emp-name { font-size: 14px; font-weight: 700; color: #1a1a2e; }
.emp-role { font-size: 11px; color: #8c8c8c; margin-top: 2px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

.chg-badge {
  display: inline-block; border-radius: 20px; flex-shrink: 0;
  padding: 2px 7px; font-size: 11px; font-weight: 600;
}
.chg-badge.up   { background: #fff1f0; color: #f5222d; }
.chg-badge.down { background: #f6ffed; color: #389e0d; }

.emp-divider { border-top: 1px solid #f0f2f5; margin: 10px 0; }

.emp-metrics {
  display: grid; grid-template-columns: 1fr 1fr; gap: 6px;
}
.emp-metric {
  display: flex; align-items: center; gap: 4px;
  font-size: 12px; font-weight: 600; color: #333;
}

.emp-footer {
  display: flex; align-items: center; justify-content: flex-end; gap: 4px;
  margin-top: 10px;
  font-size: 12px; font-weight: 600; color: #5b8ff9;
}
</style>
