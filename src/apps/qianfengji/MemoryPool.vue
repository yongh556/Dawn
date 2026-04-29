<template>
  <div class="memory-pool-container">
    <!-- 标题栏 -->
    <div class="header">
      <div class="header-back" @click="goBack">←</div>
      <h1 class="header-title">记忆数据池</h1>
      <div class="header-right"></div>
    </div>

    <!-- 分类筛选 -->
    <div class="filter-bar">
      <button 
        v-for="filter in filters" 
        :key="filter.value"
        :class="{ 'active': activeFilter === filter.value }"
        @click="activeFilter = filter.value"
      >
        {{ filter.label }}
      </button>
    </div>

    <!-- 记忆列表 -->
    <div class="memory-list">
      <div 
        v-for="memory in filteredMemories" 
        :key="memory.id"
        class="memory-card"
        :class="{ 'online': memory.type === 'online', 'offline': memory.type === 'offline' }"
      >
        <div class="memory-header">
          <div class="memory-type">
            <span class="type-icon">{{ memory.type === 'online' ? '🌐' : '📖' }}</span>
            <span class="type-text">{{ memory.type === 'online' ? '线上聊天' : '线下聊天' }}</span>
          </div>
          <div class="memory-time">{{ formatTime(memory.timestamp) }}</div>
        </div>
        
        <div class="memory-content">
          <h3 class="memory-title">{{ memory.title }}</h3>
          <p class="memory-summary">{{ memory.summary }}</p>
        </div>
        
        <div class="memory-footer">
          <div class="memory-character">{{ memory.characterName }}</div>
          <div class="memory-actions">
            <button class="action-btn edit-btn" @click="editMemory(memory)">编辑</button>
            <button class="action-btn delete-btn" @click="confirmDeleteMemory(memory)">删除</button>
          </div>
        </div>
      </div>
      
      <div v-if="filteredMemories.length === 0" class="empty-state">
        <div class="empty-icon">📝</div>
        <p class="empty-text">暂无记忆数据</p>
      </div>
    </div>

    <!-- 编辑对话框 -->
    <div class="modal-overlay" v-if="showEditModal" @click.self="showEditModal = false">
      <div class="edit-modal">
        <div class="modal-header">
          <h2>{{ editingMemory ? '编辑记忆' : '手动总结' }}</h2>
          <div class="close-btn" @click="showEditModal = false">×</div>
        </div>
        <div class="modal-body">
          <div class="form-group">
            <label>标题</label>
            <input 
              type="text" 
              v-model="editForm.title" 
              placeholder="请输入记忆标题"
            >
          </div>
          <div class="form-group">
            <label>内容摘要</label>
            <textarea 
              v-model="editForm.summary" 
              placeholder="请输入记忆内容摘要"
              rows="4"
            ></textarea>
          </div>
          <div class="form-group">
            <label>来源类型</label>
            <select v-model="editForm.type">
              <option value="online">线上聊天</option>
              <option value="offline">线下聊天</option>
            </select>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn cancel-btn" @click="showEditModal = false">取消</button>
          <button class="btn confirm-btn" @click="saveMemory">确定</button>
        </div>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <div class="modal-overlay" v-if="showDeleteModal" @click.self="showDeleteModal = false">
      <div class="confirm-modal">
        <div class="confirm-content">
          <p>确定要删除这条记忆吗？</p>
        </div>
        <div class="confirm-actions">
          <button class="cancel-btn" @click="showDeleteModal = false">取消</button>
          <button class="confirm-btn" @click="deleteMemory">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

// 模拟记忆数据
const memories = ref([
  {
    id: '1',
    title: '关于甜品店的讨论',
    summary: '今天和阿贝多讨论了新开的甜品店，推荐了提拉米苏',
    type: 'online',
    characterName: '阿贝多',
    timestamp: Date.now() - 3600000
  },
  {
    id: '2',
    title: '线下聊天记录',
    summary: '在图书馆讨论了最新的研究进展',
    type: 'offline',
    characterName: '阿贝多',
    timestamp: Date.now() - 7200000
  },
  {
    id: '3',
    title: '时间感知测试',
    summary: '测试了AI时间感知功能，能够正确识别当前时间',
    type: 'online',
    characterName: '阿贝多',
    timestamp: Date.now() - 10800000
  }
])

// 筛选选项
const filters = [
  { label: '全部', value: 'all' },
  { label: '线上记忆', value: 'online' },
  { label: '线下记忆', value: 'offline' }
]

const activeFilter = ref('all')

// 编辑相关
const showEditModal = ref(false)
const editingMemory = ref(null)
const editForm = ref({
  title: '',
  summary: '',
  type: 'online'
})

// 删除相关
const showDeleteModal = ref(false)
const deletingMemory = ref(null)

// 计算属性：筛选后的记忆列表
const filteredMemories = computed(() => {
  if (activeFilter.value === 'all') {
    return memories.value
  }
  return memories.value.filter(memory => memory.type === activeFilter.value)
})

// 返回上一页
const goBack = () => {
  const characterId = route.query.characterId
  if (characterId) {
    router.push(`/app/qianfengji/chat/${characterId}`)
  } else {
    router.push('/app/qianfengji')
  }
}

// 格式化时间
const formatTime = (timestamp) => {
  const date = new Date(timestamp)
  const now = new Date()
  
  const isToday = date.toDateString() === now.toDateString()
  const isYesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString() === date.toDateString()
  
  if (isToday) {
    return `今天 ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
  } else if (isYesterday) {
    return `昨天 ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
  } else {
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`
  }
}

// 编辑记忆
const editMemory = (memory) => {
  editingMemory.value = memory
  editForm.value = { ...memory }
  showEditModal.value = true
}

// 保存记忆
const saveMemory = () => {
  if (editingMemory.value) {
    // 编辑现有记忆
    const index = memories.value.findIndex(m => m.id === editingMemory.value.id)
    if (index !== -1) {
      memories.value[index] = { ...editForm.value, id: editingMemory.value.id }
    }
  } else {
    // 添加新记忆
    memories.value.push({
      ...editForm.value,
      id: Date.now().toString(),
      timestamp: Date.now()
    })
  }
  
  showEditModal.value = false
  editingMemory.value = null
}

// 确认删除记忆
const confirmDeleteMemory = (memory) => {
  deletingMemory.value = memory
  showDeleteModal.value = true
}

// 删除记忆
const deleteMemory = () => {
  if (deletingMemory.value) {
    memories.value = memories.value.filter(m => m.id !== deletingMemory.value.id)
  }
  
  showDeleteModal.value = false
  deletingMemory.value = null
}
</script>

<style scoped>
.memory-pool-container {
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
  padding: 0 8px;
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

.filter-bar {
  display: flex;
  background: var(--surface-color);
  border-bottom: 1px solid var(--border-color);
  padding: 8px 16px;
  gap: 8px;
}

.filter-bar button {
  padding: 6px 16px;
  border: 1px solid var(--border-color);
  border-radius: 16px;
  background: var(--surface-color);
  color: var(--text-secondary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.filter-bar button.active {
  background: var(--primary-color);
  color: var(--text-primary);
  border-color: var(--primary-color);
}

.memory-list {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.memory-card {
  background: var(--surface-color);
  border-radius: 12px;
  padding: 16px;
  margin-bottom: 12px;
  border-left: 3px solid var(--border-color);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.memory-card.online {
  border-left-color: #4dcc63;
}

.memory-card.offline {
  border-left-color: #1890ff;
}

.memory-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.memory-type {
  display: flex;
  align-items: center;
  gap: 8px;
}

.type-icon {
  font-size: 16px;
}

.type-text {
  font-size: 14px;
  color: var(--text-secondary);
}

.memory-time {
  font-size: 12px;
  color: var(--text-tertiary);
}

.memory-content {
  margin-bottom: 12px;
}

.memory-title {
  font-size: 16px;
  font-weight: 600;
  margin: 0 0 8px 0;
  color: var(--text-primary);
}

.memory-summary {
  font-size: 14px;
  color: var(--text-secondary);
  line-height: 1.5;
  margin: 0;
}

.memory-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.memory-character {
  font-size: 13px;
  color: var(--text-tertiary);
}

.memory-actions {
  display: flex;
  gap: 8px;
}

.action-btn {
  padding: 4px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.edit-btn {
  background: var(--surface-color);
  color: var(--text-secondary);
}

.delete-btn {
  background: #ff4d4f;
  color: white;
  border-color: #ff4d4f;
}

.action-btn:active {
  transform: scale(0.95);
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 200px;
  color: var(--text-tertiary);
}

.empty-icon {
  font-size: 48px;
  margin-bottom: 16px;
}

.empty-text {
  font-size: 14px;
}

/* 模态框样式 */
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

.edit-modal {
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

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.modal-header h2 {
  margin: 0;
  font-size: 18px;
  color: var(--text-primary);
}

.close-btn {
  font-size: 24px;
  cursor: pointer;
  color: var(--text-secondary);
}

.modal-body {
  padding: 20px;
}

.form-group {
  margin-bottom: 16px;
}

.form-group label {
  display: block;
  font-size: 14px;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.form-group input,
.form-group textarea,
.form-group select {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
  background: var(--bg-color);
  color: var(--text-primary);
}

.form-group textarea {
  resize: vertical;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
}

.btn {
  padding: 8px 16px;
  border: 1px solid var(--border-color);
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: var(--surface-color);
  color: var(--text-secondary);
}

.confirm-btn {
  background: var(--primary-color);
  color: var(--text-primary);
  border-color: var(--primary-color);
}

.btn:active {
  transform: scale(0.95);
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
  background: #ff4d4f;
  color: white;
  border-bottom-right-radius: 12px;
}

.confirm-actions .confirm-btn:active {
  background: #ff7875;
}
</style>
