<template>
  <div class="home-view">
    <!-- 状态栏 -->
    <div class="status-bar">
      <span class="time">{{ currentTime }}</span>
      <div class="status-icons">
        <span>📶</span>
        <span>🔋</span>
      </div>
    </div>

    <!-- 主屏幕 - 可滑动 -->
    <div 
      class="desktop" 
      ref="desktopRef"
      @touchstart="handleTouchStart"
      @touchmove="handleTouchMove"
      @touchend="handleTouchEnd"
    >
      <!-- 页面1：主应用 -->
      <div class="desktop-page page-1" :style="{ transform: `translateX(${pageOffset}px)` }">
        <!-- 时间日期插件 -->
        <div class="widget-date">
          <div class="date-time">{{ currentTime }}</div>
          <div class="date-full">{{ currentDate }}</div>
        </div>

        <!-- 核心应用图标 -->
        <div class="app-grid">
          <div 
            v-for="app in coreApps" 
            :key="app.id"
            class="app-icon"
            @click="openApp(app)"
          >
            <div class="app-icon-img">{{ app.icon }}</div>
            <span class="app-name">{{ app.name }}</span>
          </div>
        </div>

        <!-- 用户自定义图标 -->
        <div class="app-grid" v-if="customApps.length > 0">
          <div 
            v-for="app in customApps" 
            :key="app.id"
            class="app-icon"
            @click="openCustomApp(app)"
          >
            <div class="app-icon-img">{{ app.icon }}</div>
            <span class="app-name">{{ app.name }}</span>
          </div>
        </div>

        <!-- 添加自定义应用按钮 -->
        <div class="app-grid" v-if="canAddMoreApps">
          <div class="app-icon add-app" @click="showAddAppModal = true">
            <div class="app-icon-img add-icon">+</div>
            <span class="app-name">添加应用</span>
          </div>
        </div>
      </div>

      <!-- 页面2：预留空间 -->
      <div class="desktop-page page-2" :style="{ transform: `translateX(${pageOffset}px)` }">
        <div class="reserved-page">
          <div class="reserved-icon">🌟</div>
          <p>更多精彩<br>敬请期待</p>
        </div>
      </div>

      <!-- 页码指示器 -->
      <div class="page-indicator">
        <span class="dot active"></span>
        <span class="dot"></span>
      </div>
    </div>

    <!-- 底部装饰导航 -->
    <div class="bottom-nav">
      <div class="nav-item" v-for="i in 4" :key="i">
        <span class="nav-icon">占位</span>
      </div>
      <div class="home-indicator"></div>
    </div>

    <!-- 添加应用弹窗 -->
    <div class="modal-overlay" v-if="showAddAppModal" @click.self="showAddAppModal = false">
      <div class="modal-content">
        <h3>添加应用</h3>
        <div class="form-group">
          <label>应用名称</label>
          <input 
            type="text" 
            class="input" 
            v-model="newApp.name" 
            placeholder="请输入应用名称"
          />
        </div>
        <div class="form-group">
          <label>应用图标（emoji）</label>
          <input 
            type="text" 
            class="input" 
            v-model="newApp.icon" 
            placeholder="请输入图标 emoji"
          />
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="showAddAppModal = false">取消</button>
          <button class="btn btn-primary" @click="addCustomApp">添加</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../stores/app'

const router = useRouter()
const store = useAppStore()

// 核心应用列表
const coreApps = [
  { id: 'qianfengji', name: '萤窗', icon: '💬', route: '/app/qianfengji' },
  { id: 'tonghangzhe', name: '拾星', icon: '👥', route: '/app/tonghangzhe' },
  { id: 'shujishi', name: '夜航', icon: '⚙️', route: '/app/shujishi' },
  { id: 'shijieshu', name: '世界书', icon: '📚', route: '/app/shijieshu' }
]

// 自定义应用
const customApps = computed(() => store.customIcons)

// 是否可以添加更多应用（限制4个核心应用外加自定义应用）
const canAddMoreApps = computed(() => customApps.value.length < 8)

// 弹窗状态
const showAddAppModal = ref(false)
const newApp = ref({ name: '', icon: '📱' })

// 时间状态
const currentTime = ref('')
const currentDate = ref('')
let timeInterval = null

const updateTime = () => {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('zh-CN', { 
    hour: '2-digit', 
    minute: '2-digit',
    hour12: false
  })
  currentDate.value = now.toLocaleDateString('zh-CN', { 
    month: 'long', 
    day: 'numeric',
    weekday: 'long'
  })
}

// 滑动相关
const desktopRef = ref(null)
const pageOffset = ref(0)
const isDragging = ref(false)
const startX = ref(0)
const currentX = ref(0)

const handleTouchStart = (e) => {
  isDragging.value = true
  startX.value = e.touches[0].clientX
}

const handleTouchMove = (e) => {
  if (!isDragging.value) return
  currentX.value = e.touches[0].clientX
  const diff = currentX.value - startX.value
  
  if (pageOffset.value === 0 && diff < 0) {
    pageOffset.value = diff / 3
  } else if (pageOffset.value < 0 && diff > 0) {
    pageOffset.value = -375 + diff / 3
  }
}

const handleTouchEnd = () => {
  isDragging.value = false
  const diff = currentX.value - startX.value
  
  if (diff < -100) {
    // 向左滑 - 到第二页
    pageOffset.value = -375
  } else if (diff > 100) {
    // 向右滑 - 回第一页
    pageOffset.value = 0
  } else {
    // 回到原位
    pageOffset.value = pageOffset.value < -187 ? -375 : 0
  }
}

// 打开应用
const openApp = (app) => {
  router.push(app.route)
}

const openCustomApp = (app) => {
  // 自定义应用暂无功能，仅提示
  alert(`"${app.name}" 暂未开放`)
}

// 添加自定义应用
const addCustomApp = () => {
  if (!newApp.value.name) {
    alert('请输入应用名称')
    return
  }
  
  // 检查是否与核心应用重名
  if (coreApps.some(app => app.name === newApp.value.name)) {
    alert('不能与核心应用重名')
    return
  }
  
  store.addCustomIcon({
    name: newApp.value.name,
    icon: newApp.value.icon || '📱'
  })
  
  newApp.value = { name: '', icon: '📱' }
  showAddAppModal.value = false
}

onMounted(() => {
  updateTime()
  timeInterval = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  if (timeInterval) {
    clearInterval(timeInterval)
  }
})
</script>

<style scoped>
.home-view {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(180deg, #F5FBF9 0%, #E8F6F3 100%);
  overflow: hidden;
}

.status-bar {
  height: 44px;
  padding: 0 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  color: var(--text-primary);
  background: transparent;
}

.status-icons {
  display: flex;
  gap: 4px;
}

.desktop {
  flex: 1;
  position: relative;
  overflow: hidden;
}

.desktop-page {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  padding: 20px;
  transition: transform 0.3s ease;
}

.page-1 {
  background: linear-gradient(180deg, #F5FBF9 0%, #E8F6F3 100%);
}

.page-2 {
  left: 100%;
  background: linear-gradient(180deg, #E8F6F3 0%, #D4EFDF 100%);
}

.page-indicator {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: 8px;
}

.page-indicator .dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-tertiary);
  transition: all 0.3s ease;
}

.page-indicator .dot.active {
  width: 18px;
  border-radius: 3px;
  background: var(--primary-dark);
}

/* 时间日期插件 */
.widget-date {
  text-align: center;
  padding: 20px 0;
}

.date-time {
  font-size: 48px;
  font-weight: 200;
  color: var(--text-primary);
  letter-spacing: 2px;
}

.date-full {
  font-size: 14px;
  color: var(--text-secondary);
  margin-top: 4px;
}

/* 应用网格 */
.app-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  padding: 16px 0;
}

.app-icon {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  transition: transform 0.2s ease;
}

.app-icon:active {
  transform: scale(0.9);
}

.app-icon-img {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, var(--primary-light) 0%, var(--primary-color) 100%);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  box-shadow: 0 4px 12px var(--shadow-color);
}

.add-app .app-icon-img {
  background: linear-gradient(135deg, #F5F5F5 0%, #E0E0E0 100%);
  color: var(--text-tertiary);
}

.add-icon {
  font-size: 32px;
  font-weight: 300;
}

.app-name {
  font-size: 12px;
  color: var(--text-primary);
  text-align: center;
}

/* 预留页面 */
.reserved-page {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
}

.reserved-icon {
  font-size: 64px;
  margin-bottom: 16px;
  animation: pulse 2s ease-in-out infinite;
}

/* 底部导航 */
.bottom-nav {
  height: 34px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background: var(--surface-color);
  border-top: 1px solid var(--border-color);
  position: relative;
}

.nav-item {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-icon {
  font-size: 10px;
  color: var(--text-tertiary);
  padding: 4px 8px;
  background: var(--bg-color);
  border-radius: 4px;
}

.home-indicator {
  position: absolute;
  top: 8px;
  left: 50%;
  transform: translateX(-50%);
  width: 134px;
  height: 5px;
  background: var(--text-tertiary);
  border-radius: 3px;
}

/* 弹窗样式 */
.modal-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: var(--surface-color);
  width: 90%;
  max-width: 320px;
  border-radius: 20px;
  padding: 24px;
}

.modal-content h3 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 18px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: var(--text-secondary);
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.modal-actions .btn {
  flex: 1;
}
</style>
