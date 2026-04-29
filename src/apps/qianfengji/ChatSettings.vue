<template>
  <div class="chat-settings-container">
    <!-- 标题栏 -->
    <div class="header">
      <div class="header-back" @click="goBack">←</div>
      <h1 class="header-title">聊天设置</h1>
      <div class="header-right"></div>
    </div>

    <!-- 设置内容区域 -->
    <div class="settings-content">
      <!-- 1. AI时间感知 -->
      <div class="setting-item">
        <div class="setting-label">AI时间感知</div>
        <div class="setting-control">
          <div class="switch" :class="{ 'active': aiTimeAwareness }" @click="aiTimeAwareness = !aiTimeAwareness"></div>
        </div>
      </div>

      <!-- 2. 线上记忆自动总结 -->
      <div class="setting-item">
        <div class="setting-label">线上记忆自动总结</div>
        <div class="setting-control">
          <div class="switch" :class="{ 'active': autoSummary }" @click="autoSummary = !autoSummary"></div>
        </div>
      </div>

      <!-- 3. 线上触发频率 -->
      <div class="setting-item">
        <div class="setting-label">线上触发频率</div>
        <div class="setting-control">
          <div class="input-button" @click="showFrequencyInput = !showFrequencyInput">
            {{ triggerFrequency }}条
          </div>
          <div class="input-popup" v-if="showFrequencyInput">
            <input 
              type="number" 
              v-model="frequencyInput" 
              @keyup.enter="saveFrequency"
              @blur="saveFrequency"
              placeholder="请输入触发频率"
            >
          </div>
        </div>
      </div>

      <!-- 4. 线上总结字数 -->
      <div class="setting-item">
        <div class="setting-label">线上总结字数</div>
        <div class="setting-control">
          <div class="input-button" @click="showSummaryLengthInput = !showSummaryLengthInput">
            {{ summaryLength }}字
          </div>
          <div class="input-popup" v-if="showSummaryLengthInput">
            <input 
              type="number" 
              v-model="summaryLengthInput" 
              @keyup.enter="saveSummaryLength"
              @blur="saveSummaryLength"
              placeholder="请输入总结字数"
            >
          </div>
        </div>
      </div>

      <!-- 5. 记忆数据池 -->
      <div class="setting-item">
        <div class="setting-label">记忆数据池</div>
        <div class="setting-control">
          <div class="action-button" @click="goToMemoryPool">查看</div>
        </div>
      </div>

      <!-- 6. 用户面具 -->
      <div class="setting-item">
        <div class="setting-label">用户面具</div>
        <div class="setting-control">
          <div class="mask-button" @click="showMaskDialog = true">
            {{ selectedMaskId ? masks.find(m => m.id === selectedMaskId)?.name : '请选择面具' }}
            <span v-if="selectedMaskId && masks.find(m => m.id === selectedMaskId)?.isMain" class="main-mask-badge">主</span>
            <span class="dropdown-icon">▼</span>
          </div>
        </div>
      </div>

      <!-- 7. 设置聊天背景 -->
      <div class="setting-item">
        <div class="setting-label">设置聊天背景</div>
        <div class="setting-control">
          <div class="action-button" @click="showBackgroundInput = !showBackgroundInput">更换</div>
          <div class="input-popup" v-if="showBackgroundInput">
            <input 
              type="text" 
              v-model="backgroundUrl" 
              @keyup.enter="saveBackground"
              @blur="saveBackground"
              placeholder="请输入背景图片URL"
            >
            <input type="file" @change="handleBackgroundUpload" accept="image/*">
          </div>
        </div>
      </div>

      <!-- 8. 清空聊天记录 -->
      <div class="setting-item">
        <div class="setting-label">清空聊天记录</div>
        <div class="setting-control">
          <div class="action-button danger" @click="confirmClearChat">清空</div>
        </div>
      </div>
    </div>

    <!-- 确认对话框 -->
    <div class="modal-overlay" v-if="showConfirmDialog" @click.self="showConfirmDialog = false">
      <div class="confirm-modal">
        <div class="confirm-content">
          <p>{{ confirmMessage }}</p>
        </div>
        <div class="confirm-actions">
          <button class="cancel-btn" @click="showConfirmDialog = false">取消</button>
          <button class="confirm-btn" @click="confirmAction">确定</button>
        </div>
      </div>
    </div>

    <!-- 面具选择对话框 -->
    <div class="modal-overlay" v-if="showMaskDialog" @click.self="showMaskDialog = false">
      <div class="mask-dialog">
        <div class="dialog-header">
          <h2>选择用户面具</h2>
          <div class="close-btn" @click="showMaskDialog = false">×</div>
        </div>
        <div class="dialog-body">
          <div class="mask-grid">
            <div 
              v-for="mask in masks" 
              :key="mask.id"
              class="mask-card"
              :class="{ 'selected': selectedMaskId === mask.id, 'main': mask.isMain }"
              @click="selectMask(mask.id)"
            >
              <div class="mask-card-avatar">{{ mask.avatar || mask.name.charAt(0) }}</div>
              <div class="mask-card-name">{{ mask.name }}</div>
              <span v-if="mask.isMain" class="main-badge">主</span>
            </div>
            <div 
              class="mask-card"
              :class="{ 'selected': selectedMaskId === '' }"
              @click="selectMask('')"
            >
              <div class="mask-card-avatar">?</div>
              <div class="mask-card-name">无面具</div>
            </div>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '../../stores/app'

const router = useRouter()
const route = useRoute()
const store = useAppStore()

const characterId = computed(() => route.query.characterId)
const character = computed(() => store.characters.find(c => c.id === characterId.value))

// 设置界面相关变量
const aiTimeAwareness = ref(true) // AI时间感知，默认开启
const autoSummary = ref(true) // 线上记忆自动总结，默认开启
const triggerFrequency = ref(20) // 线上触发频率，默认20条
const summaryLength = ref(100) // 线上总结字数，默认100字
// 用户面具
const masks = computed(() => store.masks)
const selectedMaskId = ref('')
const showMaskDialog = ref(false)

// 初始化默认面具（主面具或空）
onMounted(() => {
  const mainMask = masks.value.find(m => m.isMain)
  if (mainMask) {
    selectedMaskId.value = mainMask.id
  }
})

// 选择面具
const selectMask = (maskId) => {
  selectedMaskId.value = maskId
  showMaskDialog.value = false
}

// 输入框相关变量
const showFrequencyInput = ref(false)
const frequencyInput = ref('')
const showSummaryLengthInput = ref(false)
const summaryLengthInput = ref('')
const showBackgroundInput = ref(false)
const backgroundUrl = ref('')

// 确认对话框相关变量
const showConfirmDialog = ref(false)
const confirmMessage = ref('')
const confirmCallback = ref(null)

const goBack = () => {
  router.push(`/app/qianfengji/chat/${characterId.value}`)
}

// 设置界面相关函数
const saveFrequency = () => {
  if (frequencyInput.value && parseInt(frequencyInput.value) > 0) {
    triggerFrequency.value = parseInt(frequencyInput.value)
  }
  showFrequencyInput.value = false
}

const saveSummaryLength = () => {
  if (summaryLengthInput.value && parseInt(summaryLengthInput.value) > 0) {
    summaryLength.value = parseInt(summaryLengthInput.value)
  }
  showSummaryLengthInput.value = false
}

const goToMemoryPool = () => {
  router.push({
    path: '/app/qianfengji/memory-pool',
    query: { characterId: characterId.value }
  })
}

const saveBackground = () => {
  showBackgroundInput.value = false
}

const handleBackgroundUpload = (event) => {
  const file = event.target.files[0]
  if (file) {
    // 这里可以实现文件上传逻辑
    const reader = new FileReader()
    reader.onload = (e) => {
      backgroundUrl.value = e.target.result
      saveBackground()
    }
    reader.readAsDataURL(file)
  }
}

const confirmClearChat = () => {
  confirmMessage.value = '确定要清空聊天记录吗？'
  confirmCallback.value = () => {
    store.clearChatHistory(characterId.value)
    router.push(`/app/qianfengji/chat/${characterId.value}`)
  }
  showConfirmDialog.value = true
}

const confirmAction = () => {
  if (confirmCallback.value) {
    confirmCallback.value()
    showConfirmDialog.value = false
    confirmCallback.value = null
  }
}
</script>

<style scoped>
.chat-settings-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-color);
}

.header {
  height: 56px;
  background: var(--surface-color);
  display: flex;
  align-items: center;
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
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

.header-right {
  width: 48px;
}

.settings-content {
  flex: 1;
  overflow-y: auto;
  padding: 20px;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid var(--border-color);
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-label {
  font-size: 15px;
  color: var(--text-primary);
}

.setting-control {
  position: relative;
}

/* 开关样式 */
.switch {
  width: 48px;
  height: 24px;
  background: var(--border-color);
  border-radius: 12px;
  cursor: pointer;
  position: relative;
  transition: background-color 0.3s;
}

.switch::before {
  content: '';
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: var(--text-primary);
  border-radius: 50%;
  transition: transform 0.3s;
}

.switch.active {
  background: var(--primary-color);
}

.switch.active::before {
  transform: translateX(24px);
}

/* 用户面具选择框样式 */
.mask-button {
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  background: var(--bg-color);
  color: var(--text-primary);
  font-size: 14px;
  min-width: 120px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
}

.mask-button:hover {
  border-color: var(--primary-color);
}

.dropdown-icon {
  margin-left: 8px;
  font-size: 12px;
  color: var(--text-secondary);
}

.main-mask-badge {
  display: inline-block;
  margin-left: 8px;
  padding: 2px 6px;
  background: var(--primary-color);
  color: white;
  font-size: 12px;
  border-radius: 10px;
}

/* 面具选择对话框样式 */
.mask-dialog {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 400px;
  background: var(--surface-color);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.dialog-header h2 {
  margin: 0;
  font-size: 18px;
  color: var(--text-primary);
}

.close-btn {
  font-size: 24px;
  cursor: pointer;
  color: var(--text-secondary);
}

.dialog-body {
  padding: 20px;
}

.mask-grid {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mask-card {
  display: flex;
  align-items: center;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  position: relative;
}

.mask-card:hover {
  border-color: var(--primary-color);
  background: var(--bg-color);
}

.mask-card.selected {
  border-color: var(--primary-color);
  background: rgba(77, 204, 99, 0.1);
}

.mask-card.main {
  border-color: var(--primary-color);
  background: rgba(77, 204, 99, 0.05);
}

.mask-card-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--primary-color);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  font-weight: 600;
  margin-right: 12px;
}

.mask-card-name {
  font-size: 14px;
  color: var(--text-primary);
  flex: 1;
}

.main-badge {
  position: absolute;
  top: 8px;
  right: 8px;
  padding: 2px 6px;
  background: var(--primary-color);
  color: white;
  font-size: 12px;
  border-radius: 10px;
}

/* 按钮样式 */
.input-button, .action-button {
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.input-button {
  background: var(--surface-color);
  color: var(--text-primary);
}

.action-button {
  background: var(--primary-light);
  color: var(--primary-color);
}

.action-button.danger {
  background: #ff4d4f;
  color: white;
}

.input-button:active, .action-button:active {
  transform: scale(0.95);
}

/* 输入框弹窗 */
.input-popup {
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 8px;
  background: var(--surface-color);
  padding: 12px;
  border-radius: 8px;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.2);
  z-index: 1001;
}

.input-popup input {
  width: 120px;
  padding: 8px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
  background: var(--surface-color);
  color: var(--text-primary);
}

.input-popup input:focus {
  outline: none;
  border-color: var(--primary-color);
}

/* 菜单弹窗 */
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
  z-index: 100;
}

/* 确认对话框样式 */
.confirm-modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 80%;
  max-width: 320px;
  background: var(--surface-color);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 1001;
}

.confirm-content {
  padding: 24px 20px;
  text-align: center;
}

.confirm-content p {
  margin: 0;
  font-size: 15px;
  color: var(--text-primary);
  line-height: 1.5;
}

.confirm-actions {
  display: flex;
  border-top: 1px solid var(--border-color);
}

.confirm-actions .cancel-btn,
.confirm-actions .confirm-btn {
  flex: 1;
  padding: 12px;
  border: none;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.2s;
}

.confirm-actions .cancel-btn {
  border-right: 1px solid var(--border-color);
  background: var(--surface-color);
  color: var(--text-secondary);
  border-bottom-left-radius: 12px;
}

.confirm-actions .cancel-btn:active {
  background: var(--bg-color);
}

.confirm-actions .confirm-btn {
  background: var(--primary-color);
  color: var(--text-primary);
  border-bottom-right-radius: 12px;
}

.confirm-actions .confirm-btn:active {
  background: var(--primary-light);
}
</style>
