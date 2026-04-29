<template>
  <div class="app-container">
    <!-- 标题栏 -->
    <div class="header">
      <div class="header-back" @click="goBack">←</div>
      <h1 class="header-title">萤窗</h1>
      <div v-if="activeTab === 'qianfeng'" class="header-right" @click="showMenu = true">
        <div class="plus-button">+</div>
      </div>
      <div v-else class="header-right"></div>
    </div>

    <!-- 内容区域 -->
    <div class="tab-content">
      <!-- 私语 - 聊天列表 -->
      <div v-if="activeTab === 'qianfeng'" class="chat-list">
        <div 
          v-if="characters.length === 0 && groupChats.length === 0" 
          class="empty-state"
        >
          <div class="empty-state-icon">💬</div>
          <p>暂无聊天记录</p>
          <p class="empty-hint">请先在"拾星"中添加AI角色</p>
        </div>
        
        <!-- 单聊列表 -->
        <div 
          v-for="char in characters" 
          :key="char.id"
          class="list-item"
          @click="openChat(char)"
        >
          <div class="avatar">{{ (char.note || char.name).charAt(0) }}</div>
          <div class="chat-info">
            <div class="chat-name">{{ char.note || char.name }}</div>
            <div class="chat-preview">{{ getLastMessage(char.id) }}</div>
          </div>
          <div class="chat-time">{{ getLastTime(char.id) }}</div>
        </div>
        
        <!-- 群聊列表 -->
        <div 
          v-for="group in groupChats" 
          :key="group.id"
          class="list-item group-chat"
          @click="openChat(group)"
        >
          <div class="avatar">👥</div>
          <div class="chat-info">
            <div class="chat-name">{{ group.name }}</div>
            <div class="chat-preview">{{ getLastMessage(group.id) }}</div>
          </div>
          <div class="chat-time">{{ getLastTime(group.id) }}</div>
        </div>
      </div>

      <!-- 星谱 - 通讯录 -->
      <div v-if="activeTab === 'tonghang'" class="contact-list">
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

        <!-- 固定栏目 -->
        <div class="fixed-section">
          <div class="fixed-item" @click="goToAddCharacter">
            <div class="avatar">+</div>
            <div class="fixed-info">
              <div class="fixed-name">新的朋友</div>
            </div>
          </div>
          <div class="fixed-item" @click="goToAddCharacter">
            <div class="avatar">👥</div>
            <div class="fixed-info">
              <div class="fixed-name">群聊</div>
            </div>
          </div>
        </div>

        <!-- 联系人列表 -->
        <div 
          v-if="filteredCharacters.length === 0 && characters.length > 0" 
          class="empty-state"
        >
          <div class="empty-state-icon">🔍</div>
          <p>未找到相关联系人</p>
        </div>
        <div v-else-if="characters.length === 0" class="empty-state">
          <div class="empty-state-icon">👥</div>
          <p>暂无联系人</p>
          <p class="empty-hint">请先在"拾星"中添加AI角色</p>
        </div>
        <div v-else>
          <div 
            v-for="(group, key) in groupedCharacters" 
            :key="key"
          >
            <div class="letter-header" :data-letter="key">{{ key }}</div>
            <div 
          v-for="char in group" 
          :key="char.id"
          class="list-item"
          @click="goToProfile(char)"
        >
              <div class="avatar">{{ (char.note || char.name).charAt(0) }}</div>
              <div class="contact-info">
                <div class="contact-name">{{ char.note || char.name }}</div>
                <div class="contact-desc">{{ char.personality?.slice(0, 30) || '暂无描述' }}</div>
              </div>
            </div>
          </div>
        </div>

        <!-- 字母索引条 -->
        <div class="letter-index">
          <div 
            v-for="letter in letters" 
            :key="letter"
            class="index-letter"
            @click="scrollToLetter(letter)"
          >
            {{ letter }}
          </div>
        </div>
      </div>

      <!-- 夏集 - 朋友圈 -->
      <div v-if="activeTab === 'fushi'" class="moments-page">
        <div class="empty-state">
          <div class="empty-state-icon">🌸</div>
          <p>暂无所见</p>
          <p class="empty-hint">朋友圈功能开发中</p>
        </div>
      </div>

      <!-- 枕梦 - 个人中心 -->
      <div v-if="activeTab === 'yuyun'" class="profile-page">
        <div class="profile-header">
          <div class="avatar large">我</div>
          <div class="profile-name">用户</div>
        </div>
        <div class="profile-menu">
          <div class="menu-item">
            <span>我的收藏</span>
            <span class="arrow">›</span>
          </div>
          <div class="menu-item" @click="goToMasks">
            <span>我的面具</span>
            <span class="arrow">›</span>
          </div>
          <div class="menu-item">
            <span>设置</span>
            <span class="arrow">›</span>
          </div>
          <div class="menu-item">
            <span>关于</span>
            <span class="arrow">›</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 标签栏 -->
    <div class="tab-bar">
      <div 
        v-for="tab in tabs" 
        :key="tab.id"
        class="tab-item"
        :class="{ active: activeTab === tab.id }"
        @click="activeTab = tab.id"
      >
        {{ tab.name }}
      </div>
    </div>

    <!-- 菜单弹窗 -->
    <div class="menu-overlay" v-if="activeTab === 'qianfeng' && showMenu" @click.self="showMenu = false">
      <div class="menu-popup">
        <div class="menu-item" @click="goToCreateGroupChat">
          <span>发起群聊</span>
        </div>
        <div class="menu-item" @click="goToAddCharacter">
          <span>添加朋友</span>
        </div>
        <div class="menu-item" @click="goToAddCharacter">
          <span>扫一扫</span>
        </div>
        <div class="menu-item" @click="goToAddCharacter">
          <span>收付款</span>
        </div>
      </div>
    </div>

    <!-- 创建群聊对话框 -->
    <div class="dialog-overlay" v-if="showCreateGroupDialog" @click.self="showCreateGroupDialog = false">
      <div class="dialog">
        <div class="dialog-header">
          <h3>发起群聊</h3>
          <div class="dialog-close" @click="showCreateGroupDialog = false">×</div>
        </div>
        <div class="dialog-body">
          <!-- 群名称输入 -->
          <div class="input-group">
            <label>群名称</label>
            <input 
              type="text" 
              v-model="newGroupName" 
              placeholder="请输入群名称"
              class="dialog-input"
            >
          </div>
          
          <!-- 选择成员 -->
          <div class="input-group">
            <label>选择成员</label>
            <div class="character-list">
              <div 
                v-for="char in characters" 
                :key="char.id"
                class="character-item"
                :class="{ selected: selectedCharacterIds.includes(char.id) }"
                @click="toggleCharacterSelection(char.id)"
              >
                <div class="avatar">{{ (char.note || char.name).charAt(0) }}</div>
                <div class="character-name">{{ char.name }}</div>
                <div class="checkbox" :class="{ checked: selectedCharacterIds.includes(char.id) }"></div>
              </div>
            </div>
          </div>
        </div>
        <div class="dialog-footer">
          <button class="btn cancel" @click="showCreateGroupDialog = false">取消</button>
          <button class="btn confirm" @click="createGroupChat" :disabled="selectedCharacterIds.length === 0">创建</button>
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

const activeTab = ref('qianfeng')
const showMenu = ref(false)
const searchQuery = ref('')
const showCreateGroupDialog = ref(false)
const newGroupName = ref('')
const selectedCharacterIds = ref([])

const tabs = [
  { id: 'qianfeng', name: '私语' },
  { id: 'tonghang', name: '星谱' },
  { id: 'fushi', name: '夏集' },
  { id: 'yuyun', name: '枕梦' }
]

const characters = computed(() => store.characters)
const groupChats = computed(() => store.groupChats)

// 过滤后的联系人列表
const filteredCharacters = computed(() => {
  if (!searchQuery.value.trim()) {
    return characters.value
  }
  const query = searchQuery.value.toLowerCase()
  return characters.value.filter(char => 
    char.name.toLowerCase().includes(query) ||
    char.personality?.toLowerCase().includes(query)
  )
})

// 按字母分组的联系人列表
const groupedCharacters = computed(() => {
  const groups = {}
  filteredCharacters.value.forEach(char => {
    const firstLetter = char.name.charAt(0).toUpperCase()
    const letter = /[A-Z]/.test(firstLetter) ? firstLetter : '#'
    if (!groups[letter]) {
      groups[letter] = []
    }
    groups[letter].push(char)
  })
  // 按字母排序
  const sortedGroups = {}
  Object.keys(groups).sort().forEach(key => {
    sortedGroups[key] = groups[key]
  })
  return sortedGroups
})

// 字母索引
const letters = computed(() => {
  return Object.keys(groupedCharacters.value).sort()
})

// 滚动到指定字母分组
const scrollToLetter = (letter) => {
  const element = document.querySelector(`[data-letter="${letter}"]`)
  if (element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const goBack = () => {
  router.push('/home')
}

const openChat = (char) => {
  router.push(`/app/qianfengji/chat/${char.id}`)
}

const goToMasks = () => {
  router.push('/app/qianfengji/masks')
}

const goToAddCharacter = () => {
  router.push('/app/qianfengji/add-friend')
}

const goToCreateGroupChat = () => {
  showMenu.value = false
  showCreateGroupDialog.value = true
  newGroupName.value = ''
  selectedCharacterIds.value = []
}

const toggleCharacterSelection = (characterId) => {
  const index = selectedCharacterIds.value.indexOf(characterId)
  if (index > -1) {
    selectedCharacterIds.value.splice(index, 1)
  } else {
    selectedCharacterIds.value.push(characterId)
  }
}

const createGroupChat = () => {
  if (selectedCharacterIds.value.length === 0) return
  
  const groupData = {
    name: newGroupName.value || '群聊',
    memberIds: selectedCharacterIds.value
  }
  
  store.addGroupChat(groupData)
  showCreateGroupDialog.value = false
}

const goToProfile = (char) => {
  router.push(`/app/qianfengji/profile/${char.id}`)
}

const getLastMessage = (charId) => {
  const history = store.getChatHistory(charId)
  if (history.length === 0) return '暂无消息'
  const lastMsg = history[history.length - 1]
  return lastMsg.content.slice(0, 30)
}

const getLastTime = (charId) => {
  const history = store.getChatHistory(charId)
  if (history.length === 0) return ''
  const lastMsg = history[history.length - 1]
  const date = new Date(lastMsg.timestamp)
  return date.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' })
}
</script>

<style scoped>
.app-container {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: var(--bg-color);
  position: relative;
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
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.header-right:active {
  background: var(--bg-color);
  border-radius: 50%;
}

.plus-button {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: var(--primary-color);
  color: var(--text-primary);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  font-weight: bold;
}

.tab-bar {
  display: flex;
  background: var(--surface-color);
  border-top: 1px solid var(--border-color);
}

.tab-item {
  flex: 1;
  padding: 14px;
  text-align: center;
  font-size: 14px;
  color: var(--text-secondary);
  cursor: pointer;
  position: relative;
}

.tab-item.active {
  color: var(--primary-dark);
  font-weight: 600;
}

.tab-item.active::after {
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 30px;
  height: 3px;
  background: var(--primary-color);
  border-radius: 2px;
}

.tab-content {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
}

.tab-content::-webkit-scrollbar {
  width: 0;
}

.chat-list {
  background: var(--surface-color);
}

.contact-list {
  background: var(--surface-color);
  position: relative;
}

.list-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
}

.list-item:active {
  background: var(--bg-color);
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

.avatar.large {
  width: 72px;
  height: 72px;
  font-size: 28px;
}

.chat-info,
.contact-info {
  flex: 1;
  margin-left: 12px;
  overflow: hidden;
}

.chat-name,
.contact-name {
  font-size: 16px;
  font-weight: 500;
  color: var(--text-primary);
}

.chat-preview,
.contact-desc {
  font-size: 13px;
  color: var(--text-secondary);
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.chat-time {
  font-size: 12px;
  color: var(--text-tertiary);
  margin-left: 8px;
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

/* 通讯录搜索栏 */
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

/* 固定栏目 */
.fixed-section {
  background: var(--surface-color);
  border-bottom: 1px solid var(--border-color);
}

.fixed-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
}

.fixed-item:active {
  background: var(--bg-color);
}

.fixed-info {
  flex: 1;
  margin-left: 12px;
}

.fixed-name {
  font-size: 16px;
  color: var(--text-primary);
}

/* 字母分组标题 */
.letter-header {
  padding: 4px 16px;
  background: var(--bg-color);
  font-size: 12px;
  color: var(--text-secondary);
  font-weight: 600;
  border-top: 1px solid var(--border-color);
}

/* 字母索引条 */
.letter-index {
  position: fixed;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 100;
}

.index-letter {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  color: var(--text-secondary);
  cursor: pointer;
  border-radius: 50%;
}

.index-letter:hover {
  background: var(--bg-color);
  color: var(--primary-color);
}

/* 朋友圈 */
.moments-page {
  padding: 20px;
}

/* 个人中心 */
.profile-page {
  background: var(--surface-color);
}

.profile-header {
  padding: 40px 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: linear-gradient(180deg, var(--primary-light) 0%, var(--surface-color) 100%);
}

.profile-name {
  margin-top: 16px;
  font-size: 18px;
  font-weight: 600;
}

.profile-menu {
  margin-top: 20px;
}

.menu-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  background: var(--surface-color);
  border-bottom: 1px solid var(--border-color);
  font-size: 15px;
}

.menu-item:active {
  background: var(--bg-color);
}

.arrow {
  color: var(--text-tertiary);
  font-size: 20px;
}

/* 菜单弹窗 */
.menu-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1000;
}

.menu-popup {
  position: absolute;
  top: 64px;
  right: 20px;
  background: var(--surface-color);
  width: 120px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  overflow: hidden;
  z-index: 1001;
}

.menu-popup .menu-item {
  padding: 12px 16px;
  text-align: left;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
  font-size: 14px;
}

.menu-popup .menu-item:last-child {
  border-bottom: none;
}

.menu-popup .menu-item:active {
  background: var(--bg-color);
}

/* 创建群聊对话框 */
.dialog-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding-top: 100px;
  z-index: 2000;
}

.dialog {
  background: var(--surface-color);
  border-radius: 20px;
  width: 90%;
  max-width: 375px;
  max-height: 70vh;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.dialog-header h3 {
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-primary);
}

.dialog-close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  cursor: pointer;
  border-radius: 50%;
}

.dialog-close:active {
  background: var(--bg-color);
}

.dialog-body {
  padding: 20px;
  max-height: 50vh;
  overflow-y: auto;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
}

.dialog-input {
  width: 100%;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 12px;
  background: var(--surface-color);
  font-size: 14px;
  color: var(--text-primary);
  outline: none;
}

.dialog-input:focus {
  border-color: var(--primary-color);
}

.character-list {
  max-height: 300px;
  overflow-y: auto;
}

.character-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  border-radius: 12px;
  cursor: pointer;
  margin-bottom: 8px;
}

.character-item:hover {
  background: var(--bg-color);
}

.character-item.selected {
  background: rgba(255, 165, 0, 0.1);
}

.character-name {
  flex: 1;
  margin-left: 12px;
  font-size: 14px;
  color: var(--text-primary);
}

.checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid var(--border-color);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.checkbox.checked {
  background: var(--primary-color);
  border-color: var(--primary-color);
}

.checkbox.checked::after {
  content: '✓';
  color: white;
  font-size: 12px;
  font-weight: bold;
}

.dialog-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 20px;
  border-top: 1px solid var(--border-color);
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 12px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
}

.btn.cancel {
  background: var(--bg-color);
  color: var(--text-secondary);
}

.btn.confirm {
  background: var(--primary-color);
  color: white;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
