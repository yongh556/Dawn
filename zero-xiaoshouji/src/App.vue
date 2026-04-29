<template>
  <div class="phone-container">
    <div class="phone-frame">
      <div class="status-bar">
        <span class="time">{{ currentTime }}</span>
        <div class="status-icons">
          <span class="signal">📶</span>
          <span class="battery">🔋</span>
        </div>
      </div>
      <div class="screen">
        <SplashScreen v-if="showSplash" @done="onSplashDone" />
        <router-view v-else />
      </div>
      <div class="home-indicator"></div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import SplashScreen from './components/SplashScreen.vue'

const showSplash = ref(true)
const currentTime = ref('')

const updateTime = () => {
  const now = new Date()
  currentTime.value = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`
}

const onSplashDone = () => {
  showSplash.value = false
}

let timer
onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<style>
@import url('https://fonts.googleapis.com/css2?family=Noto+Sans+SC:wght@300;400;500;600;700&display=swap');

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

:root {
  --primary: #98D8C8;
  --primary-dark: #7BC4B0;
  --primary-light: #B8E6D9;
  --bg-screen: #F5FBF8;
  --bg-card: #FFFFFF;
  --text-primary: #2D3436;
  --text-secondary: #636E72;
  --accent: #F8B500;
  --danger: #FF6B6B;
  --border: #E8F0EC;
}

body {
  font-family: 'Noto Sans SC', 'PingFang SC', -apple-system, sans-serif;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.phone-container {
  perspective: 1000px;
}

.phone-frame {
  width: 375px;
  height: 812px;
  background: #1a1a1a;
  border-radius: 40px;
  padding: 12px;
  box-shadow: 
    0 0 0 2px #333,
    0 20px 60px rgba(0,0,0,0.5),
    inset 0 0 20px rgba(255,255,255,0.05);
  position: relative;
}

.screen {
  width: 100%;
  height: 100%;
  background: var(--bg-screen);
  border-radius: 32px;
  overflow: hidden;
  position: relative;
}

.status-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 44px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  z-index: 100;
}

.status-icons {
  display: flex;
  gap: 6px;
}

.home-indicator {
  position: absolute;
  bottom: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 134px;
  height: 5px;
  background: #fff;
  border-radius: 3px;
}

@media (max-width: 420px) {
  .phone-frame {
    width: 100vw;
    height: 100vh;
    border-radius: 0;
    padding: 0;
  }
  
  .screen {
    border-radius: 0;
  }
  
  .home-indicator {
    display: none;
  }
}
</style>
