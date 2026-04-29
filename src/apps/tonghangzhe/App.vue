<template>
  <div class="app-container">
    <!-- 标题栏 -->
    <div class="header">
      <div class="header-back" @click="goBack">←</div>
      <h1 class="header-title">拾星</h1>
      <div class="header-add" @click="addCharacter">+</div>
    </div>

    <!-- 角色列表 -->
    <div class="content">
      <div v-if="characters.length === 0" class="empty-state">
        <div class="empty-state-icon">👥</div>
        <p>暂无角色</p>
        <p class="empty-hint">点击右上角"+"添加AI角色</p>
      </div>

      <div 
        v-else
        v-for="char in characters" 
        :key="char.id"
        class="character-card"
        @click="editCharacter(char)"
      >
        <div class="avatar">{{ char.name.charAt(0) }}</div>
        <div class="character-info">
          <div class="character-name">{{ char.name }}</div>
          <div class="character-desc">{{ char.personality?.slice(0, 40) || '暂无设定' }}</div>
        </div>
        <div class="character-actions">
          <span class="edit-btn" @click.stop="editCharacter(char)">编辑</span>
          <span class="delete-btn" @click.stop="deleteCharacter(char)">删除</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAppStore } from '../../stores/app'

const router = useRouter()
const store = useAppStore()

const characters = computed(() => store.characters)

const goBack = () => {
  router.push('/home')
}

const addCharacter = () => {
  router.push('/app/tonghangzhe/edit')
}

const editCharacter = (char) => {
  router.push(`/app/tonghangzhe/edit/${char.id}`)
}

const deleteCharacter = (char) => {
  if (confirm(`确定要删除角色"${char.name}"吗？`)) {
    store.deleteCharacter(char.id)
  }
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

.header-add {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  color: var(--primary-dark);
  cursor: pointer;
}

.content {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
}

.character-card {
  display: flex;
  align-items: center;
  padding: 16px;
  background: var(--surface-color);
  border-radius: 16px;
  margin-bottom: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  cursor: pointer;
}

.character-card:active {
  background: var(--bg-color);
}

.avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, var(--primary-light), var(--primary-color));
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  font-weight: 600;
  color: var(--text-primary);
  flex-shrink: 0;
}

.character-info {
  flex: 1;
  margin-left: 16px;
  overflow: hidden;
}

.character-name {
  font-size: 17px;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.character-desc {
  font-size: 13px;
  color: var(--text-secondary);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.character-actions {
  display: flex;
  gap: 8px;
}

.edit-btn,
.delete-btn {
  padding: 6px 12px;
  font-size: 12px;
  border-radius: 6px;
  cursor: pointer;
}

.edit-btn {
  background: var(--primary-light);
  color: var(--primary-dark);
}

.delete-btn {
  background: #FFE5E0;
  color: var(--error-color);
}

.edit-btn:active,
.delete-btn:active {
  opacity: 0.7;
}

.empty-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
}

.empty-state-icon {
  font-size: 64px;
  margin-bottom: 16px;
}

.empty-hint {
  font-size: 14px;
  margin-top: 8px;
}
</style>
