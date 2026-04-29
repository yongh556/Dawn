<template>
  <div class="app-container">
    <!-- 标题栏 -->
    <div class="header">
      <div class="header-back" @click="goBack">←</div>
      <h1 class="header-title">世界书</h1>
      <div class="header-right"></div>
    </div>

    <!-- 内容 -->
    <div class="content">
      <div class="placeholder-page">
        <div class="placeholder-icon">📖</div>
        <h2>世界书</h2>
        <p>记录万千世界的点点滴滴</p>
        <div class="coming-soon">
          <span class="pulse">●</span>
          即将开放
        </div>
      </div>

      <div class="features-preview">
        <div class="feature-item">
          <span class="feature-icon">📝</span>
          <span class="feature-text">世界观设定</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">🌐</span>
          <span class="feature-text">故事线管理</span>
        </div>
        <div class="feature-item">
          <span class="feature-icon">✨</span>
          <span class="feature-text">灵感记录</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goBack = () => {
  router.push('/home')
}
</script>

<style scoped>
.app-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #F5FBF9 0%, #E8F6F3 100%);
}

.header {
  height: 56px;
  background: var(--surface-color);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 8px 0 0;
  border-bottom: 1px solid var(--border-color);
}

.header-back {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
}

.header-back:active {
  background: var(--bg-color);
  border-radius: 50%;
}

.header-title {
  font-size: 18px;
  font-weight: 600;
  flex: 1;
  text-align: center;
}

.header-right {
  width: 48px;
}

.content {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
}

.placeholder-page {
  text-align: center;
  margin-bottom: 60px;
}

.placeholder-icon {
  font-size: 80px;
  margin-bottom: 20px;
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

.placeholder-page h2 {
  font-size: 28px;
  font-weight: 600;
  margin-bottom: 8px;
  color: var(--text-primary);
}

.placeholder-page p {
  font-size: 14px;
  color: var(--text-secondary);
  margin-bottom: 24px;
}

.coming-soon {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 20px;
  background: var(--primary-light);
  border-radius: 20px;
  font-size: 14px;
  color: var(--primary-dark);
}

.pulse {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.3;
  }
  50% {
    opacity: 1;
  }
}

.features-preview {
  display: flex;
  gap: 32px;
}

.feature-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
}

.feature-icon {
  font-size: 32px;
  opacity: 0.5;
}

.feature-text {
  font-size: 12px;
  color: var(--text-tertiary);
}
</style>
