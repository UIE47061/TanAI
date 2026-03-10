<script setup>
// Dashboard 主應用
</script>

<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<style>
/* 全域樣式重置 */
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #f0f2f5;
  color: #333;
}

#app {
  width: 100%;
  min-height: 100vh;
}

::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-track {
  background: transparent;
}
::-webkit-scrollbar-thumb {
  background: #c5cad3;
  border-radius: 3px;
}
</style>

