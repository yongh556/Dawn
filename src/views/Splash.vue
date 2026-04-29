<template>
  <div class="splash-screen" :class="{ 'fade-out': isFadingOut }">
    <div class="splash-content">
      <div class="logo-container">
        <div class="logo">
          <span class="logo-icon">◎</span>
        </div>
        <h1 class="app-name">零序</h1>
        <p class="app-slogan">小手机 · AI角色扮演</p>
      </div>
    </div>
    <div class="splash-footer">
      <div class="loading-dots">
        <span class="dot"></span>
        <span class="dot"></span>
        <span class="dot"></span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const isFadingOut = ref(false)

onMounted(() => {
  setTimeout(() => {
    isFadingOut.value = true
    setTimeout(() => {
      router.replace('/home')
    }, 500)
  }, 2000)
})
</script>

<style scoped>
.splash-screen {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(180deg, #E8F6F3 0%, #98D8C8 50%, #7BC4B0 100%);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: opacity 0.5s ease;
}

.splash-screen.fade-out {
  opacity: 0;
}

.splash-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.logo-container {
  text-align: center;
}

.logo {
  width: 100px;
  height: 100px;
  background: linear-gradient(135deg, #FFFFFF 0%, #E8F6F3 100%);
  border-radius: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 
    0 8px 32px rgba(152, 216, 200, 0.4),
    0 2px 8px rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.logo-icon {
  font-size: 48px;
  color: var(--primary-dark);
}

.app-name {
  font-size: 36px;
  font-weight: 700;
  color: #2D3436;
  margin-bottom: 8px;
  letter-spacing: 8px;
}

.app-slogan {
  font-size: 14px;
  color: #636E72;
  letter-spacing: 2px;
}

.splash-footer {
  padding-bottom: 60px;
}

.loading-dots {
  display: flex;
  gap: 8px;
}

.dot {
  width: 8px;
  height: 8px;
  background: var(--primary-dark);
  border-radius: 50%;
  animation: pulse 1.4s ease-in-out infinite;
}

.dot:nth-child(1) {
  animation-delay: 0s;
}

.dot:nth-child(2) {
  animation-delay: 0.2s;
}

.dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes pulse {
  0%, 80%, 100% {
    transform: scale(0.6);
    opacity: 0.5;
  }
  40% {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
