<template>
  <div class="app-container">
    <!-- 标题栏 -->
    <div class="header">
      <div class="header-back" @click="goBack">←</div>
      <h1 class="header-title">添加朋友</h1>
      <div class="header-right"></div>
    </div>

    <!-- 内容区域 -->
    <div class="content">
      <!-- 搜索栏 -->
      <div class="search-bar">
        <div class="search-icon">🔍</div>
        <input 
          type="text" 
          v-model="searchQuery"
          placeholder="搜索"
          class="search-input"
        >
      </div>

      <!-- 空状态 -->
      <div v-if="filteredCharacters.length === 0" class="empty-state">
        <div class="empty-state-icon">👥</div>
        <p>暂无可添加的朋友</p>
        <p class="empty-hint">请先在"拾星"中创建角色</p>
      </div>

      <!-- 未添加的同行者列表 -->
      <div v-else>
        <div 
          v-for="char in filteredCharacters" 
          :key="char.id"
          class="list-item"
        >
          <div class="avatar">{{ char.name.charAt(0) }}</div>
          <div class="character-info">
            <div class="character-name">{{ char.name }}</div>
            <div class="character-desc">{{ char.personality?.slice(0, 30) || '暂无描述' }}</div>
          </div>
          <div class="add-button" @click="addFriend(char.id)">添加</div>
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

const searchQuery = ref('')

// 过滤后的未添加同行者列表
const filteredCharacters = computed(() => {
  if (!searchQuery.value.trim()) {
    return store.pendingCharacters
  }
  const query = searchQuery.value.toLowerCase()
  return store.pendingCharacters.filter(char => 
    char.name.toLowerCase().includes(query) ||
    char.personality?.toLowerCase().includes(query)
  )
})

const goBack = () => {
  router.push('/app/qianfengji')
}

const addFriend = (characterId) => {
  const character = store.addPendingCharacterToChat(characterId)
  if (character) {
    // 添加成功后返回千风集首页
    router.push('/app/qianfengji')
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

.header-right {
  width: 48px;
  height: 48px;
}

.content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.content::-webkit-scrollbar {
  width: 0;
}

.search-bar {
  display: flex;
  align-items: center;
  padding: 8px 16px;
  background: var(--bg-color);
  border-bottom: 1px solid var(--border-color);
}

.search-icon {
  font-size: 16px;
  color: var(--text-secondary);
  margin-right: 8px;
}

.search-input {
  flex: 1;
  padding: 8px 12px;
  border: none;
  border-radius: 20px;
  background: var(--surface-color);
  font-size: 14px;
  color: var(--text-primary);
  outline: none;
}

.search-input::placeholder {
  color: var(--text-tertiary);
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

.list-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  background: var(--surface-color);
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

.character-info {
  flex: 1;
  margin-left: 12px;
  overflow: hidden;
}

.character-name {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.character-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.add-button {
  padding: 8px 16px;
  background: var(--primary-color);
  color: white;
  border-radius: 16px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.add-button:active {
  background: var(--primary-dark);
}
</style>