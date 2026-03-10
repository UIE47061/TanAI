<script setup>
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()

const logout = () => router.push('/login')

const navItems = [
  { icon: 'dashboard', label: 'Dashboard', route: '/admin/dashboard' },
  { icon: 'bolt', label: 'Emissions', route: '/admin/emissions' },
  { icon: 'sensors', label: 'Sensors', route: '/admin/sensors' },
  { icon: 'corporate_fare', label: 'Departments', route: '/admin/departments' },
  { icon: 'bar_chart', label: 'Reports', route: '/admin/reports' },
  { icon: 'eco', label: 'ESG Goals', route: '/admin/esg-goals' },
  { icon: 'settings', label: 'Settings', route: '/admin/settings' },
]
</script>

<template>
  <div class="layout">
    <!-- ===== Sidebar ===== -->
    <aside class="sidebar">
      <div class="sidebar-top">
        <div class="avatar">
          <span class="material-icons-outlined avatar-icon">person</span>
        </div>
        <nav class="sidebar-nav">
          <RouterLink
            v-for="item in navItems" :key="item.label"
            :to="item.route"
            class="nav-item"
            :class="{ active: route.path === item.route }"
          >
            <span class="material-icons-outlined">{{ item.icon }}</span>
            <span class="nav-label">{{ item.label }}</span>
          </RouterLink>
        </nav>
      </div>
      <a href="#" class="nav-item logout-item" @click.prevent="logout">
        <span class="material-icons-outlined">logout</span>
        <span class="nav-label">Logout</span>
      </a>
    </aside>

    <!-- ===== Page Content ===== -->
    <main class="content">
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
.layout {
  display: flex;
  min-height: 100vh;
  background: #f0f2f5;
}

/* ===== Sidebar ===== */
.sidebar {
  width: 200px;
  background: #fff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 30px 16px 24px;
  border-right: 1px solid #eef0f4;
  position: sticky;
  top: 0;
  height: 100vh;
  flex-shrink: 0;
}
.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #eef0f4;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 28px;
}
.avatar-icon { font-size: 28px; color: #b0b7c3; }
.sidebar-nav { display: flex; flex-direction: column; gap: 4px; }
.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 11px 14px;
  border-radius: 10px;
  text-decoration: none;
  color: #8c8c8c;
  font-size: 14px;
  font-weight: 500;
  transition: all .2s;
}
.nav-item .material-icons-outlined { font-size: 20px; }
.nav-item:hover { background: #f5f7fa; color: #333; }
.nav-item.active {
  background: #e8f0fe;
  color: #5b8ff9;
  font-weight: 600;
}
.logout-item { color: #b0b7c3; }
.logout-item:hover { color: #f5222d; background: #fff1f0; }

.content {
  flex: 1;
  overflow-y: auto;
  min-width: 0;
}

@media (max-width: 768px) {
  .sidebar { display: none; }
}
</style>
