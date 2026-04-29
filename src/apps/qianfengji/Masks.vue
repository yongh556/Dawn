<template>
  <div class="masks-container">
    <!-- 标题栏 -->
    <div class="header">
      <div class="header-back" @click="goBack">←</div>
      <h1 class="header-title">面具管理</h1>
      <div class="header-right" @click="showAddModal = true">+</div>
    </div>

    <!-- 面具列表 -->
    <div class="masks-list">
      <div v-if="masks.length === 0" class="empty-state">
        <div class="empty-state-icon">🎭</div>
        <p>暂无面具</p>
        <p class="empty-hint">点击右上角添加面具</p>
      </div>
      
      <div 
        v-for="mask in masks" 
        :key="mask.id"
        class="mask-item"
      >
        <div class="mask-info">
          <div class="avatar">{{ mask.avatar || mask.name.charAt(0) }}</div>
          <div class="mask-details">
            <div class="mask-name">{{ mask.name }}</div>
            <div class="mask-personality">{{ mask.personality || '暂无描述' }}</div>
            <div v-if="mask.isMain" class="main-badge">主面具</div>
          </div>
        </div>
        <div class="mask-actions">
          <button class="action-btn edit" @click="editMask(mask)">
            <svg class="edit-icon" viewBox="0 0 1024 1024" width="20" height="20">
              <path d="M873.9 268.07L669.23 63.31c-8.31-8.31-19.36-12.89-31.12-12.89S615.3 55 606.99 63.31L104.36 566.14c-8.26 8.27-12.96 19.71-12.88 31.4l1.37 203.38c0.16 23.94 19.77 43.54 43.7 43.7l203.3 1.38h0.29c11.6 0 22.93-4.69 31.12-12.89L873.9 330.28c17.15-17.15 17.15-45.06 0-62.21zM328.63 773.92l-163.96-1.11-1.11-164.05 347.88-348.01L676.53 425.9l-347.9 348.02z m398.79-398.95L562.34 209.82l75.77-75.8L803.2 299.17l-75.78 75.8zM851.88 772.88H563.66c-19.88 0-36 16.12-36 36s16.12 36 36 36h288.22c19.88 0 36-16.12 36-36s-16.12-36-36-36zM851.88 636.68H740.36c-19.88 0-36 16.12-36 36s16.12 36 36 36h111.51c19.88 0 36-16.12 36-36s-16.11-36-35.99-36z" fill="#31D0C8"></path>
            </svg>
          </button>
          <button class="action-btn delete" @click="confirmDelete(mask)">
            <svg class="delete-icon" viewBox="0 0 1024 1024" width="20" height="20">
              <path d="M371.3024 433.9712v360.704c0 14.1312 11.4688 25.6 25.6 25.6s25.6-11.4688 25.6-25.6V433.9712c0-14.1312-11.4688-25.6-25.6-25.6s-25.6 11.4688-25.6 25.6zM613.7856 433.9712v360.704c0 14.1312 11.4688 25.6 25.6 25.6s25.6-11.4688 25.6-25.6V433.9712c0-14.1312-11.4688-25.6-25.6-25.6s-25.6 11.4688-25.6 25.6z" fill="#d81e06"></path>
              <path d="M928.3584 244.3776h-188.16v-34.3552c0-75.8272-61.696-137.5744-137.5744-137.5744H436.48c-75.8272 0-137.5744 61.696-137.5744 137.5744v34.3552H102.8608c-14.1312 0-25.6 11.4688-25.6 25.6s11.4688 25.6 25.6 25.6h50.176v494.7456c0 98.816 80.384 179.2 179.2 179.2h367.872c98.816 0 179.2-80.384 179.2-179.2v-272.7936c0-14.1312-11.4688-25.6-25.6-25.6s-25.6 11.4688-25.6 25.6v272.7936c0 70.6048-57.3952 128-128 128H332.2368c-70.6048 0-128-57.3952-128-128V295.5776h623.9232V358.912c0 14.1312 11.4688 25.6 25.6 25.6s25.6-11.4688 25.6-25.6V295.5776h49.0496c14.1312 0 25.6-11.4688 25.6-25.6s-11.52-25.6-25.6512-25.6z m-578.2528 0v-34.3552c0-47.616 38.7584-86.3744 86.3744-86.3744h166.2464c47.616 0 86.3744 38.7584 86.3744 86.3744v34.3552H350.1056z" fill="#d81e06"></path>
              <path d="M853.7088 403.9168c-14.1312 0-25.6 11.4688-25.6 25.6v18.0736c0 14.1312 11.4688 25.6 25.6 25.6s25.6-11.4688 25.6-25.6v-18.0736c0-14.1312-11.4176-25.6-25.6-25.6z" fill="#d81e06"></path>
            </svg>
          </button>
          <button 
            v-if="!mask.isMain"
            class="action-btn set-main" 
            @click="setMainMask(mask)"
          >
            设为主面具
          </button>
        </div>
      </div>
    </div>

    <!-- 添加/编辑面具对话框 -->
    <div class="modal-overlay" v-if="showAddModal || showEditModal" @click.self="closeModal">
      <div class="modal-content">
        <div class="modal-header">
          <h2>{{ showEditModal ? '编辑面具' : '新增面具' }}</h2>
          <div class="close-btn" @click="closeModal">×</div>
        </div>
        <div class="modal-body">
          <div class="avatar-section">
            <div class="avatar-large">{{ currentMask.avatar || (currentMask.name ? currentMask.name.charAt(0) : '我') }}</div>
          </div>
          <div class="form-group">
            <label>我的姓名</label>
            <input 
              type="text" 
              v-model="currentMask.name" 
              placeholder="请输入面具名称"
              class="form-input"
            >
          </div>
          <div class="form-group">
            <label>我的人设</label>
            <textarea 
              v-model="currentMask.personality" 
              placeholder="请输入人设描述"
              class="form-textarea"
              rows="4"
            ></textarea>
          </div>
          <div class="form-group">
            <label>
              <input 
                type="checkbox" 
                v-model="currentMask.isMain"
                class="checkbox"
              >
              设为主面具
            </label>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn cancel" @click="closeModal">取消</button>
          <button class="btn confirm" @click="saveMask">确定</button>
        </div>
      </div>
    </div>

    <!-- 删除确认对话框 -->
    <div class="modal-overlay" v-if="showDeleteModal" @click.self="showDeleteModal = false">
      <div class="modal-content confirm-modal">
        <div class="modal-header">
          <h2>确认删除</h2>
        </div>
        <div class="modal-body">
          <p>确定要删除面具"{{ deleteMaskName }}"吗？</p>
        </div>
        <div class="modal-footer">
          <button class="btn cancel" @click="showDeleteModal = false">取消</button>
          <button class="btn confirm danger" @click="deleteMask">删除</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../../stores/app'

const router = useRouter()
const store = useAppStore()

const masks = computed(() => store.masks)

// 对话框状态
const showAddModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)

// 当前编辑的面具
const currentMask = ref({
  id: '',
  name: '',
  avatar: '',
  personality: '',
  isMain: false
})

// 删除相关
const deleteMaskId = ref('')
const deleteMaskName = ref('')

const goBack = () => {
  router.push('/app/qianfengji')
}

const closeModal = () => {
  showAddModal.value = false
  showEditModal.value = false
  showDeleteModal.value = false
  resetCurrentMask()
}

const resetCurrentMask = () => {
  currentMask.value = {
    id: '',
    name: '',
    avatar: '',
    personality: '',
    isMain: false
  }
}

const editMask = (mask) => {
  currentMask.value = { ...mask }
  showEditModal.value = true
}

const confirmDelete = (mask) => {
  deleteMaskId.value = mask.id
  deleteMaskName.value = mask.name
  showDeleteModal.value = true
}

const saveMask = () => {
  if (!currentMask.value.name.trim()) {
    alert('请输入面具名称')
    return
  }

  if (showEditModal.value) {
    store.updateMask(currentMask.value.id, currentMask.value)
  } else {
    store.addMask(currentMask.value)
  }

  closeModal()
}

const deleteMask = () => {
  store.deleteMask(deleteMaskId.value)
  showDeleteModal.value = false
}

const setMainMask = (mask) => {
  store.setMainMask(mask.id)
}
</script>

<style scoped>
.masks-container {
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
}

.header-right {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
}

.header-right:active {
  background: var(--bg-color);
  border-radius: 50%;
}

.masks-list {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.masks-list::-webkit-scrollbar {
  width: 0;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 80px 20px;
  color: var(--text-tertiary);
}

.empty-state-icon {
  font-size: 56px;
  margin-bottom: 16px;
}

.empty-hint {
  font-size: 13px;
  margin-top: 8px;
}

.mask-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  background: var(--surface-color);
  border-bottom: 1px solid var(--border-color);
}

.mask-info {
  display: flex;
  align-items: center;
  flex: 1;
}

.avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-light), var(--primary-color));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
  flex-shrink: 0;
}

.mask-details {
  margin-left: 12px;
  flex: 1;
}

.mask-name {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.mask-personality {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 4px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.main-badge {
  display: inline-block;
  padding: 2px 8px;
  background: var(--primary-light);
  color: var(--primary-color);
  font-size: 12px;
  border-radius: 10px;
  margin-top: 4px;
}

.mask-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

.action-btn {
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--surface-color);
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.action-btn:active {
  background: var(--bg-color);
}

.action-btn.edit {
  border-color: #31D0C8;
}

.action-btn.delete {
  border-color: #d81e06;
}

.action-btn.set-main {
  border-color: var(--primary-color);
  color: var(--primary-color);
}

.edit-icon, .delete-icon {
  vertical-align: middle;
}

/* 对话框样式 */
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
  max-width: 400px;
  border-radius: 12px;
  overflow: hidden;
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

.avatar-section {
  display: flex;
  justify-content: center;
  margin-bottom: 20px;
}

.avatar-large {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-light), var(--primary-color));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 600;
  color: var(--text-primary);
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

.form-input, .form-textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
  background: var(--bg-color);
  color: var(--text-primary);
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #98D8C8;
  box-shadow: 0 0 0 2px rgba(152, 216, 200, 0.25);
}

.checkbox {
  margin-right: 8px;
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
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn.cancel {
  background: var(--surface-color);
  color: var(--text-primary);
}

.btn.confirm {
  background: var(--primary-color);
  color: var(--text-primary);
  border-color: var(--primary-color);
}

.btn.confirm.danger {
  background: #d81e06;
  border-color: #d81e06;
}

.btn:active {
  transform: scale(0.95);
}

.confirm-modal {
  max-width: 320px;
}
</style>
