<template>
  <div class="app-container">
    <!-- 标题栏 -->
    <div class="header">
      <div class="header-back" @click="goBack">←</div>
      <h1 class="header-title">夜航</h1>
      <div class="header-right"></div>
    </div>

    <div class="content">
      <!-- API配置区域 -->
      <div class="config-section">
        <h3 class="section-title">API 配置</h3>
        
        <div class="form-group">
          <label class="form-label">Base URL（API地址）</label>
          <input 
            type="text" 
            class="input" 
            v-model="apiConfig.baseUrl" 
            placeholder="例如：https://api.openai.com/v1"
          />
        </div>

        <div class="form-group">
          <label class="form-label">API Key（密钥）</label>
          <input 
            type="password" 
            class="input" 
            v-model="apiConfig.apiKey" 
            placeholder="请输入API密钥"
          />
        </div>

        <!-- 预设配置管理 -->
        <div class="form-group">
          <div class="preset-header">
            <label class="form-label">预设配置</label>
            <button class="btn-small" @click="showPresetModal = true">+ 新建</button>
          </div>
          
          <!-- 预设列表 -->
          <div v-if="presets.length > 0" class="preset-list">
            <div 
              v-for="preset in presets" 
              :key="preset.id"
              class="preset-item"
              :class="{ active: currentPresetId === preset.id }"
              @click="selectPreset(preset.id)"
            >
              <div class="preset-info">
                <span class="preset-name">{{ preset.name }}</span>
                <span class="preset-model">{{ preset.model || '未设置模型' }}</span>
              </div>
              <div class="preset-actions" @click.stop>
                <span class="preset-edit" @click="editPreset(preset)">编辑</span>
                <span class="preset-delete" @click="deletePreset(preset.id)">删除</span>
              </div>
            </div>
          </div>
          <p v-else class="preset-hint">暂无预设配置，点击"新建"添加</p>
        </div>

        <div class="form-group">
          <label class="form-label">Model Name（模型名称）</label>
          <div class="model-input-wrapper">
            <input 
              type="text" 
              class="input" 
              v-model="apiConfig.model" 
              placeholder="例如：gpt-3.5-turbo"
              list="model-list"
            />
            <datalist id="model-list">
              <option v-for="model in modelList" :key="model" :value="model" />
            </datalist>
          </div>
          <button 
            class="btn btn-secondary fetch-btn" 
            @click="fetchModels"
            :disabled="!apiConfig.baseUrl || isFetching"
          >
            {{ isFetching ? '获取中...' : '拉取模型列表' }}
          </button>
          <div v-if="modelList.length > 0" class="model-hint">
            可用模型：{{ modelList.slice(0, 5).join('、') }}{{ modelList.length > 5 ? '...' : '' }}
          </div>
        </div>
      </div>

      <!-- 进阶参数 -->
      <div class="config-section">
        <h3 class="section-title">进阶参数</h3>

        <div class="form-group">
          <label class="form-label">
            温度参数（Temperature）
            <span class="param-value">{{ apiConfig.temperature }}</span>
          </label>
          <div class="slider-container">
            <span class="slider-label">保守</span>
            <input 
              type="range" 
              class="slider" 
              v-model.number="apiConfig.temperature" 
              min="0" 
              max="2" 
              step="0.1"
            />
            <span class="slider-label">创意</span>
          </div>
          <p class="param-hint">控制AI回答的随机性，较低值更稳定，较高值更有创意</p>
        </div>

        <div class="form-group">
          <label class="form-label">
            记忆条数（Message Window Memory）
            <span class="param-value">{{ apiConfig.memorySize }} 条</span>
          </label>
          <div class="slider-container">
            <span class="slider-label">5</span>
            <input 
              type="range" 
              class="slider" 
              v-model.number="apiConfig.memorySize" 
              min="5" 
              max="50" 
              step="5"
            />
            <span class="slider-label">50</span>
          </div>
          <p class="param-hint">设置AI在对话中能记住多少轮之前的消息</p>
        </div>
      </div>

      <!-- 保存按钮 -->
      <div class="save-section">
        <button class="btn btn-primary save-btn" @click="saveConfig">保存配置</button>
      </div>
    </div>

    <!-- 预设配置弹窗 -->
    <div class="modal-overlay" v-if="showPresetModal" @click.self="closePresetModal">
      <div class="modal-content">
        <h3>{{ editingPreset ? '编辑预设' : '新建预设' }}</h3>
        <div class="form-group">
          <label class="form-label">预设名称</label>
          <input 
            type="text" 
            class="input" 
            v-model="presetForm.name" 
            placeholder="例如：GPT-4"
          />
        </div>
        <div class="form-group">
          <label class="form-label">Base URL</label>
          <input 
            type="text" 
            class="input" 
            v-model="presetForm.baseUrl" 
            placeholder="API地址"
          />
        </div>
        <div class="form-group">
          <label class="form-label">API Key</label>
          <input 
            type="password" 
            class="input" 
            v-model="presetForm.apiKey" 
            placeholder="API密钥"
          />
        </div>
        <div class="form-group">
          <label class="form-label">Model</label>
          <input 
            type="text" 
            class="input" 
            v-model="presetForm.model" 
            placeholder="模型名称"
          />
        </div>
        <div class="modal-actions">
          <button class="btn btn-secondary" @click="closePresetModal">取消</button>
          <button class="btn btn-primary" @click="savePreset">保存</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../../stores/app'

const router = useRouter()
const store = useAppStore()

// API配置
const apiConfig = ref({ ...store.apiConfig })

// 预设相关
const showPresetModal = ref(false)
const editingPreset = ref(null)
const presetForm = ref({
  name: '',
  baseUrl: '',
  apiKey: '',
  model: ''
})

// 模型列表
const modelList = ref([])
const isFetching = ref(false)

// 计算属性
const presets = computed(() => store.presets)
const currentPresetId = computed(() => store.currentPresetId)

// 监听配置变化，自动保存到store
watch(apiConfig, (newVal) => {
  store.apiConfig = { ...newVal }
}, { deep: true })

const goBack = () => {
  router.push('/home')
}

// 保存配置
const saveConfig = () => {
  store.apiConfig = { ...apiConfig.value }
  store.saveApiConfig()
  alert('配置已保存！')
}

// 拉取模型列表
const fetchModels = async () => {
  if (!apiConfig.value.baseUrl) return

  isFetching.value = true
  modelList.value = []

  try {
    // 尝试获取模型列表
    const response = await fetch(`${apiConfig.value.baseUrl}/models`, {
      headers: {
        'Authorization': `Bearer ${apiConfig.value.apiKey}`
      }
    })

    if (!response.ok) {
      throw new Error(`请求失败: ${response.status}`)
    }

    const data = await response.json()
    
    if (data.data && Array.isArray(data.data)) {
      modelList.value = data.data.map(m => m.id)
    } else if (data.models && Array.isArray(data.models)) {
      // 某些API可能返回models字段
      modelList.value = data.models.map(m => m.id || m.name)
    }
  } catch (error) {
    console.error('获取模型列表失败:', error)
    alert(`获取模型列表失败: ${error.message}`)
  } finally {
    isFetching.value = false
  }
}

// 预设管理
const editPreset = (preset) => {
  editingPreset.value = preset
  presetForm.value = {
    name: preset.name,
    baseUrl: preset.baseUrl,
    apiKey: preset.apiKey,
    model: preset.model
  }
  showPresetModal.value = true
}

const deletePreset = (id) => {
  if (confirm('确定要删除这个预设吗？')) {
    store.deletePreset(id)
  }
}

const selectPreset = (id) => {
  store.selectPreset(id)
  // 更新表单
  apiConfig.value = { ...store.apiConfig }
}

const closePresetModal = () => {
  showPresetModal.value = false
  editingPreset.value = null
  presetForm.value = {
    name: '',
    baseUrl: '',
    apiKey: '',
    model: ''
  }
}

const savePreset = () => {
  if (!presetForm.value.name) {
    alert('请输入预设名称')
    return
  }

  if (editingPreset.value) {
    store.updatePreset(editingPreset.value.id, presetForm.value)
  } else {
    store.addPreset(presetForm.value)
  }

  closePresetModal()
}
</script>

<style scoped>
.app-container {
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
  overflow-y: auto;
  padding: 20px;
  -webkit-overflow-scrolling: touch;
}

.content::-webkit-scrollbar {
  width: 0;
}

.config-section {
  background: var(--surface-color);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
}

.section-title {
  font-size: 16px;
  font-weight: 600;
  margin-bottom: 16px;
  color: var(--text-primary);
}

.form-group {
  margin-bottom: 20px;
}

.form-group:last-child {
  margin-bottom: 0;
}

.form-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.param-value {
  font-weight: 600;
  color: var(--primary-dark);
}

.input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 14px;
  background: var(--bg-color);
  transition: all 0.2s;
}

.input:focus {
  outline: none;
  border-color: var(--primary-color);
  background: var(--surface-color);
}

.btn-small {
  padding: 4px 12px;
  font-size: 12px;
  border: none;
  border-radius: 6px;
  background: var(--primary-color);
  color: var(--text-primary);
  cursor: pointer;
}

.btn-small:active {
  opacity: 0.8;
}

.preset-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preset-list {
  margin-top: 12px;
}

.preset-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: var(--bg-color);
  border-radius: 10px;
  margin-bottom: 8px;
  cursor: pointer;
}

.preset-item.active {
  background: var(--primary-light);
  border: 1px solid var(--primary-color);
}

.preset-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.preset-name {
  font-size: 14px;
  font-weight: 500;
}

.preset-model {
  font-size: 12px;
  color: var(--text-tertiary);
}

.preset-actions {
  display: flex;
  gap: 8px;
}

.preset-edit,
.preset-delete {
  padding: 4px 8px;
  font-size: 11px;
  border-radius: 4px;
  cursor: pointer;
}

.preset-edit {
  background: var(--primary-light);
  color: var(--primary-dark);
}

.preset-delete {
  background: #FFE5E0;
  color: var(--error-color);
}

.preset-hint {
  font-size: 13px;
  color: var(--text-tertiary);
  margin-top: 8px;
}

.model-input-wrapper {
  position: relative;
}

.fetch-btn {
  width: 100%;
  margin-top: 12px;
  padding: 10px;
}

.model-hint {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-top: 8px;
}

/* 滑块样式 */
.slider-container {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px 0;
}

.slider-label {
  font-size: 12px;
  color: var(--text-tertiary);
  width: 32px;
  text-align: center;
}

.slider {
  flex: 1;
  height: 6px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--border-color);
  border-radius: 3px;
  outline: none;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: var(--primary-color);
  cursor: pointer;
  box-shadow: 0 2px 6px var(--shadow-color);
}

.param-hint {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-top: 8px;
}

.save-section {
  margin-top: 20px;
}

.save-btn {
  width: 100%;
  padding: 16px;
  font-size: 16px;
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
  z-index: 100;
}

.modal-content {
  background: var(--surface-color);
  width: 90%;
  max-width: 340px;
  border-radius: 20px;
  padding: 24px;
}

.modal-content h3 {
  text-align: center;
  margin-bottom: 20px;
  font-size: 18px;
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
