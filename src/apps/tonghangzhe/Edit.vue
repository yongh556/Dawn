<template>
  <div class="app-container">
    <!-- 标题栏 -->
    <div class="header">
      <div class="header-back" @click="goBack">←</div>
      <h1 class="header-title">{{ isEdit ? '编辑角色' : '新建角色' }}</h1>
      <div class="header-save" @click="saveCharacter">保存</div>
    </div>

    <!-- 表单内容 -->
    <div class="content">
      <div class="form-section">
        <label class="form-label">角色头像</label>
        <div class="avatar-input">
          <div class="avatar large">{{ form.name?.charAt(0) || '?' }}</div>
          <p class="avatar-hint">头像将根据名称首字母自动生成</p>
        </div>
      </div>

      <div class="form-section">
        <label class="form-label">角色名称</label>
        <input 
          type="text" 
          class="input" 
          v-model="form.name" 
          placeholder="请输入角色名称"
        />
      </div>

      <div class="form-section">
        <label class="form-label">角色设定</label>
        <textarea 
          class="input textarea" 
          v-model="form.personality" 
          placeholder="请输入角色设定..."
          rows="8"
        ></textarea>
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

const characterId = computed(() => route.params.id)
const isEdit = computed(() => !!characterId.value)

const form = ref({
  name: '',
  personality: ''
})

onMounted(() => {
  if (characterId.value) {
    const char = store.characters.find(c => c.id === characterId.value)
    if (char) {
      form.value = {
        name: char.name,
        personality: char.personality || ''
      }
    }
  }
})

const goBack = () => {
  router.back()
}

const saveCharacter = () => {
  if (!form.value.name.trim()) {
    alert('请输入角色名称')
    return
  }

  if (isEdit.value) {
    store.updateCharacter(characterId.value, {
      name: form.value.name,
      personality: form.value.personality
    })
  } else {
    store.addCharacter({
      name: form.value.name,
      personality: form.value.personality
    })
  }

  router.back()
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

.header-save {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  color: var(--primary-dark);
  font-weight: 500;
  cursor: pointer;
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

.form-section {
  margin-bottom: 24px;
}

.form-label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 8px;
}

.input {
  width: 100%;
  padding: 14px 16px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  font-size: 15px;
  background: var(--surface-color);
  transition: all 0.2s;
}

.input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px var(--primary-light);
}

.textarea {
  resize: none;
  line-height: 1.6;
}

.avatar-input {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  background: var(--surface-color);
  border-radius: 12px;
}

.avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-light), var(--primary-color));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 600;
  color: var(--text-primary);
}

.avatar.large {
  width: 80px;
  height: 80px;
  font-size: 32px;
}

.avatar-hint {
  margin-top: 12px;
  font-size: 13px;
  color: var(--text-tertiary);
}
</style>
