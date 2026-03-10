<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const selectedRole = ref('enterprise')
const username = ref('')
const password = ref('')
const loading = ref(false)
const showPassword = ref(false)
const errorMsg = ref('')

const handleLogin = async () => {
  if (!username.value || !password.value) {
    errorMsg.value = '請填寫帳號與密碼'
    return
  }
  errorMsg.value = ''
  loading.value = true
  await new Promise(r => setTimeout(r, 700))
  loading.value = false
  if (selectedRole.value === 'employee') {
    router.push('/employee/dashboard')
  } else {
    router.push('/admin/dashboard')
  }
}
</script>

<template>
  <div class="page">
    <div class="card">
      <!-- Logo -->
      <div class="logo">
        <span class="material-icons-outlined logo-icon">eco</span>
        <span class="logo-text">TanAI</span>
      </div>

      <h1 class="title">登入</h1>
      <p class="subtitle">請選擇您的身份後登入</p>

      <!-- 身份切換 -->
      <div class="role-switch">
        <button
          class="role-btn"
          :class="{ active: selectedRole === 'enterprise' }"
          @click="selectedRole = 'enterprise'"
        >
          企業端
        </button>
        <button
          class="role-btn"
          :class="{ active: selectedRole === 'employee' }"
          @click="selectedRole = 'employee'"
        >
          員工端
        </button>
      </div>

      <!-- 表單 -->
      <form @submit.prevent="handleLogin">
        <div class="field">
          <label>帳號</label>
          <input
            v-model="username"
            type="text"
            :placeholder="selectedRole === 'enterprise' ? '管理員帳號 / Email' : '員工編號 / Email'"
            autocomplete="username"
          >
        </div>

        <div class="field">
          <label>密碼</label>
          <div class="pw-wrap">
            <input
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="請輸入密碼"
              autocomplete="current-password"
            >
            <button type="button" class="eye" @click="showPassword = !showPassword" tabindex="-1">
              <span class="material-icons-outlined">{{ showPassword ? 'visibility_off' : 'visibility' }}</span>
            </button>
          </div>
        </div>

        <div class="row-between">
          <label class="remember"><input type="checkbox"> 記住我</label>
          <a href="#" class="link">忘記密碼？</a>
        </div>

        <p v-if="errorMsg" class="error">{{ errorMsg }}</p>

        <button type="submit" class="submit-btn" :disabled="loading">
          <span v-if="!loading">登入</span>
          <span v-else class="spinner"></span>
        </button>
      </form>

      <p class="footer-hint">尚未有帳號？<a href="#" class="link">聯絡管理員</a></p>
    </div>
  </div>
</template>

<style scoped>
.page {
  min-height: 100vh;
  background: #f5f6f8;
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  padding: 24px;
}

.card {
  background: #fff;
  border-radius: 16px;
  padding: 40px 36px;
  width: 100%;
  max-width: 380px;
  box-shadow: 0 2px 20px rgba(0, 0, 0, .07);
}

/* Logo */
.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 28px;
}
.logo-icon {
  font-size: 22px;
  color: #5b8ff9;
}
.logo-text {
  font-size: 18px;
  font-weight: 700;
  color: #1a1a2e;
  letter-spacing: .5px;
}

/* Heading */
.title {
  font-size: 22px;
  font-weight: 700;
  color: #1a1a2e;
  margin: 0 0 4px;
}
.subtitle {
  font-size: 13px;
  color: #9ca3af;
  margin: 0 0 24px;
}

/* Role switch */
.role-switch {
  display: flex;
  background: #f3f4f6;
  border-radius: 10px;
  padding: 4px;
  gap: 4px;
  margin-bottom: 24px;
}
.role-btn {
  flex: 1;
  padding: 9px;
  border: none;
  border-radius: 7px;
  background: transparent;
  font-size: 13px;
  font-weight: 500;
  color: #6b7280;
  cursor: pointer;
  transition: all .18s;
  font-family: inherit;
}
.role-btn.active {
  background: #fff;
  color: #1a1a2e;
  font-weight: 600;
  box-shadow: 0 1px 6px rgba(0, 0, 0, .1);
}

/* Fields */
.field {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
}
.field label {
  font-size: 13px;
  font-weight: 500;
  color: #374151;
}
.field input,
.pw-wrap input {
  border: 1.5px solid #e5e7eb;
  border-radius: 9px;
  padding: 11px 14px;
  font-size: 14px;
  color: #1a1a2e;
  outline: none;
  transition: border-color .18s;
  font-family: inherit;
  width: 100%;
  box-sizing: border-box;
  background: #fafafa;
}
.field input:focus,
.pw-wrap input:focus {
  border-color: #5b8ff9;
  background: #fff;
}
.field input::placeholder,
.pw-wrap input::placeholder {
  color: #c4c9d4;
}

.pw-wrap {
  position: relative;
}
.pw-wrap input {
  padding-right: 40px;
}
.eye {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  color: #9ca3af;
  display: flex;
  align-items: center;
}
.eye:hover { color: #5b8ff9; }
.eye .material-icons-outlined { font-size: 18px; }

/* Options row */
.row-between {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}
.remember {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 13px;
  color: #6b7280;
  cursor: pointer;
}
.remember input { accent-color: #5b8ff9; cursor: pointer; }
.link {
  font-size: 13px;
  color: #5b8ff9;
  text-decoration: none;
}
.link:hover { text-decoration: underline; }

/* Error */
.error {
  font-size: 13px;
  color: #ef4444;
  margin: -8px 0 12px;
}

/* Submit */
.submit-btn {
  width: 100%;
  padding: 13px;
  background: #5b8ff9;
  border: none;
  border-radius: 10px;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: background .18s, transform .15s;
  font-family: inherit;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 46px;
}
.submit-btn:hover:not(:disabled) {
  background: #4478e8;
  transform: translateY(-1px);
}
.submit-btn:disabled { opacity: .65; cursor: not-allowed; }

.spinner {
  width: 18px;
  height: 18px;
  border: 2.5px solid rgba(255, 255, 255, .4);
  border-top-color: #fff;
  border-radius: 50%;
  animation: spin .65s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }

/* Footer */
.footer-hint {
  text-align: center;
  font-size: 13px;
  color: #9ca3af;
  margin-top: 20px;
}
</style>
