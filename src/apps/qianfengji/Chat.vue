<template>
  <div class="chat-container">
    <!-- 标题栏 -->
    <div class="header">
      <div class="header-back" @click="goBack">←</div>
      <h1 class="header-title">{{ character?.name || '聊天' }}</h1>
      <div class="header-right-group">
        <div class="clover-button" @click="handleCloverClick">
          <svg class="clover-icon" viewBox="0 0 1024 1024" width="24" height="24">
            <path d="M859.867 448.403c136.9-63.175 54.44-193.784-98.066-152.726-84.072 22.603-158.738 111.715-218.313 145.103 33.388-59.575 122.469-134.255 145.104-218.281C729.65 69.96 599.041-12.468 535.881 124.402c-63.175-136.87-193.784-54.441-152.742 98.097 22.65 84.025 111.731 158.706 145.103 218.281-59.56-33.388-134.208-122.5-218.296-145.103-152.507-41.058-234.951 89.551-98.05 152.726-136.901 63.16-54.457 193.768 98.05 152.726 84.088-22.618 158.737-111.731 218.296-145.103-33.372 59.576-122.453 134.24-145.103 218.328-41.042 152.508 89.566 234.937 152.742 98.051 63.16 136.886 193.769 54.457 152.711-98.051-22.635-84.088-111.716-158.752-145.104-218.328 59.575 33.372 134.24 122.485 218.313 145.103 152.507 41.042 234.967-89.566 98.066-152.726z" fill="#4dcc63"></path>
          </svg>
        </div>
        <div class="header-right" @click="goToSettings">⋮</div>
      </div>
    </div>

    <!-- 聊天消息区域 -->
    <div class="messages" ref="messagesRef">
      <div v-if="messages.length === 0" class="empty-chat">
        <div class="avatar large">{{ character?.name?.charAt(0) || '?' }}</div>
        <p class="welcome-text">{{ character?.name }} 正在等待你的消息...</p>
        <p class="hint-text">发送消息开始对话</p>
      </div>
      
      <div v-if="messages.length > 0">
        <div 
          v-for="(item, index) in getMessagesWithNovelButtons()" 
          :key="index"
        >
          <!-- 时间戳 -->
          <div v-if="item.type === 'timestamp'" class="timestamp">
            <span>{{ formatTime(item.data.time) }}</span>
          </div>
          
          <!-- 线上消息 -->
          <div 
            v-if="item.type === 'message'"
            class="message-wrapper"
            :class="{ 'sent': item.data.role === 'user' }"
          >
            <div v-if="item.data.role === 'assistant'" class="avatar small">
              {{ character?.name?.charAt(0) || '?' }}
            </div>
            <div v-if="item.data.role === 'user'" class="avatar small user-avatar">
              我
            </div>
            <div class="message-bubble" :class="item.data.role === 'user' ? 'sent' : 'received'">
              {{ item.data.content }}
            </div>
          </div>
          
          <!-- 线下聊天记录按钮 -->
          <div v-if="item.type === 'novel_button'" class="novel-chat-button">
            <button @click="viewNovelChat(item.data.id)">点击查看线下聊天记录</button>
          </div>
        </div>
      </div>

      <!-- 正在输入提示 -->
      <div v-if="isLoading" class="message-wrapper">
        <div class="avatar small">{{ character?.name?.charAt(0) || '?' }}</div>
        <div class="message-bubble received loading">
          <span class="dot"></span>
          <span class="dot"></span>
          <span class="dot"></span>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-area">
      <input 
        type="text" 
        class="input"
        v-model="inputText"
        placeholder="发送消息..."
        @keyup.enter="sendMessage"
        :disabled="isLoading"
      />
      <button class="send-btn" @click="sendMessage" :disabled="isLoading || !inputText.trim()">
        <svg class="send-icon" viewBox="0 0 1092 1024" width="20" height="20">
          <path d="M259.413333 477.866667h320.853334c20.48 0 34.133333 13.653333 34.133333 34.133333s-13.653333 34.133333-34.133333 34.133333H259.413333c0 6.826667-6.826667 13.653333-6.826666 27.306667L68.266667 955.733333l955.733333-443.733333L68.266667 68.266667l184.32 382.293333c6.826667 13.653333 6.826667 20.48 6.826666 27.306667z m791.893334 95.573333l-955.733334 443.733333c-34.133333 13.653333-75.093333 0-88.746666-34.133333-6.826667-20.48-6.826667-40.96 0-61.44l184.32-382.293333c6.826667-20.48 6.826667-40.96 0-61.44L6.826667 95.573333C-6.826667 61.44 6.826667 20.48 40.96 6.826667c13.653333-6.826667 40.96-6.826667 54.613333 0l955.733334 443.733333c34.133333 13.653333 47.786667 54.613333 34.133333 88.746667-6.826667 13.653333-20.48 27.306667-34.133333 34.133333z" fill="#23cf89"></path>
        </svg>
      </button>
    </div>



  </div>
</template>

<script setup>
import { ref, computed, nextTick, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAppStore } from '../../stores/app'

const router = useRouter()
const route = useRoute()
const store = useAppStore()

const characterId = computed(() => route.params.id)
const character = computed(() => store.characters.find(c => c.id === characterId.value))
const messages = computed(() => store.getChatHistory(characterId.value))
const novelSessions = computed(() => store.getNovelChatSessions(characterId.value))

const inputText = ref('')
const isLoading = ref(false)
const messagesRef = ref(null)

// 用户面具
const masks = computed(() => store.masks)
const selectedMaskId = ref('')

// AI时间感知设置
const aiTimeAwareness = ref(true)

// 初始化默认面具（主面具或空）
onMounted(() => {
  const mainMask = masks.value.find(m => m.isMain)
  if (mainMask) {
    selectedMaskId.value = mainMask.id
  }
})

const goBack = () => {
  router.push('/app/qianfengji')
}

const goToSettings = () => {
  router.push({
    path: '/app/qianfengji/chat-settings',
    query: { characterId: characterId.value }
  })
}

const handleCloverClick = () => {
  router.push(`/app/qianfengji/novel/${characterId.value}`)
}

// 查看线下聊天记录
const viewNovelChat = (sessionId) => {
  // 这里可以实现查看线下聊天记录的逻辑
  // 目前可以跳转到线下聊天页面并加载指定的会话
  router.push(`/app/qianfengji/novel/${characterId.value}?sessionId=${sessionId}`)
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
    return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')} ${date.getHours()}:${date.getMinutes().toString().padStart(2, '0')}`
  }
}

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight
    }
  })
}

// 获取包含线下聊天记录按钮的完整消息列表
const getMessagesWithNovelButtons = () => {
  const result = []
  
  // 获取所有消息和线下会话，按时间排序
  const allItems = []
  
  // 添加线上消息
  messages.value.forEach(msg => {
    allItems.push({
      type: 'message',
      data: msg
    })
  })
  
  // 添加线下会话（只显示有消息的会话）
  novelSessions.value.forEach(session => {
    if (session.messages.length > 0) {
      allItems.push({
        type: 'novel_button',
        data: session
      })
    }
  })
  
  // 按时间排序
  allItems.sort((a, b) => {
    const timeA = a.type === 'message' ? a.data.timestamp : a.data.createdAt
    const timeB = b.type === 'message' ? b.data.timestamp : b.data.createdAt
    return timeA - timeB
  })
  
  // 添加时间戳
  const finalItems = []
  let lastTimestamp = null
  
  allItems.forEach((item, index) => {
    const currentTime = item.type === 'message' ? item.data.timestamp : item.data.createdAt
    
    // 如果是第一条消息，或者与上一条消息的时间差超过5分钟，显示时间戳
    if (lastTimestamp === null || currentTime - lastTimestamp > 5 * 60 * 1000) {
      finalItems.push({
        type: 'timestamp',
        data: {
          time: currentTime
        }
      })
    }
    
    finalItems.push(item)
    lastTimestamp = currentTime
  })
  
  return finalItems
}

const sendMessage = async () => {
  if (!inputText.value.trim() || isLoading.value) return

  const userMessage = inputText.value.trim()
  inputText.value = ''

  // 添加用户消息
  store.addMessage(characterId.value, {
    role: 'user',
    content: userMessage
  })

  scrollToBottom()

  // 检查API配置
  const { baseUrl, apiKey, model, temperature, memorySize } = store.apiConfig
  
  if (!baseUrl || !apiKey || !model) {
    // 如果没有配置API，显示提示消息
    setTimeout(() => {
      store.addMessage(characterId.value, {
        role: 'assistant',
        content: '请先在"夜航"中配置AI模型接口，才能与我聊天哦~'
      })
      scrollToBottom()
    }, 500)
    return
  }

  isLoading.value = true

  try {
    // 构建消息历史（根据记忆条数限制）
    const history = messages.value.slice(-memorySize * 2)
    
    // 获取当前北京时间（UTC+8）
    const now = new Date()
    const utcTime = now.getTime()
    const beijingTime = new Date(utcTime + 8 * 60 * 60 * 1000)
    
    const year = beijingTime.getUTCFullYear()
    const month = beijingTime.getUTCMonth() + 1
    const day = beijingTime.getUTCDate()
    const hours = beijingTime.getUTCHours()
    const minutes = beijingTime.getUTCMinutes().toString().padStart(2, '0')
    
    const beijingTimeStr = `${year}年${month}月${day}日 ${hours}:${minutes}`
    const timeInfo = aiTimeAwareness.value 
      ? `\n\n当前北京时间：${beijingTimeStr}`
      : ''

    // 获取用户面具信息
    const selectedMask = selectedMaskId.value ? masks.value.find(m => m.id === selectedMaskId.value) : null
    const userInfo = selectedMask 
      ? `用户信息：\n- 姓名：${selectedMask.name}\n- 人设：${selectedMask.personality || '暂无设定'}`
      : '用户信息：暂无设定'

    const systemPrompt = character.value 
      ? `你是一个名为"${character.value.name}"的角色。\n设定：${character.value.personality || '暂无设定'}${timeInfo}\n\n${userInfo}\n\n重要指令：请发送多条独立消息，而不是一条长消息！\n\n具体要求：\n1. 发送2-4条独立的消息，每条消息都是一个完整的短句\n2. 每条消息之间要有自然的对话节奏感，就像真人在微信聊天一样\n3. 绝对禁止将多条内容合并成一条消息发送\n4. 每条消息独立显示在聊天界面中，不要用换行符连接\n\n示例格式：\n消息1：这是第一条消息\n消息2：这是第二条消息\n消息3：这是第三条消息\n\n微信体风格要求：\n- 简洁自然，像日常微信聊天一样\n- 严格禁止使用任何括号()、方括号[]或其他符号来描写动作、表情、心理活动\n- 只回复人物说出口的话，不要添加任何动作描写\n- 配合表情符号和语气词增加真实感\n- 请始终保持角色设定，用第一人称回复\n- 根据用户的人设信息来调整对话方式，让对话更加自然真实。`
      : `你是一个友好的AI助手。${timeInfo}\n\n${userInfo}\n\n请发送多条独立消息，每条消息都是一个完整的短句。禁止将多条内容合并成一条消息发送。`

    const apiMessages = [
      { role: 'system', content: systemPrompt },
      ...history.map(m => ({ role: m.role, content: m.content }))
    ]

    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: apiMessages,
        temperature: temperature,
        stream: false
      })
    })

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status}`)
    }

    const data = await response.json()
    const reply = data.choices?.[0]?.message?.content || '抱歉，我暂时无法回答。'

    // 拆分消息并连续发送
    // 按换行符拆分，或者按句号、感叹号、问号等标点符号拆分
    const messageParts = reply.split(/[\n。！？.!?]/).filter(part => part.trim())
    
    // 如果没有拆分出多条消息，就使用原消息
    if (messageParts.length <= 1) {
      store.addMessage(characterId.value, {
        role: 'assistant',
        content: reply
      })
    } else {
      // 连续发送多条消息，模拟真人聊天节奏
      messageParts.forEach((part, index) => {
        setTimeout(() => {
          store.addMessage(characterId.value, {
            role: 'assistant',
            content: part.trim() + (index < messageParts.length - 1 ? '。' : '')
          })
          scrollToBottom()
        }, index * 500) // 每条消息间隔500毫秒
      })
    }
  } catch (error) {
    console.error('API请求错误:', error)
    store.addMessage(characterId.value, {
      role: 'assistant',
      content: `连接失败: ${error.message}\n请检查"夜航"中的API配置是否正确。`
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}



onMounted(() => {
  scrollToBottom()
})
</script>

<style scoped>
.chat-container {
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

.header-right-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.clover-button {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  transition: background 0.2s;
}

.clover-button:active {
  background: var(--bg-color);
}

.clover-icon {
  fill: #4dcc63;
}

.header-right {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  cursor: pointer;
}

.messages {
  flex: 1;
  overflow-y: auto;
  padding: 16px;
  -webkit-overflow-scrolling: touch;
}

.messages::-webkit-scrollbar {
  width: 0;
}

.empty-chat {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: var(--text-tertiary);
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
}

.avatar.large {
  width: 72px;
  height: 72px;
  font-size: 28px;
  margin-bottom: 16px;
}

.avatar.small {
  width: 36px;
  height: 36px;
  font-size: 14px;
}

.welcome-text {
  font-size: 15px;
  margin-top: 16px;
}

.hint-text {
  font-size: 13px;
  margin-top: 8px;
  opacity: 0.7;
}

.message-wrapper {
  display: flex;
  align-items: flex-start;
  margin-bottom: 16px;
  gap: 12px;
}

.message-wrapper.sent {
  flex-direction: row-reverse;
}

.user-avatar {
  background: linear-gradient(135deg, var(--primary-light), var(--primary-color));
}

.novel-chat-button {
  display: flex;
  justify-content: center;
  margin: 16px 0;
}

.novel-chat-button button {
  padding: 8px 16px;
  background: var(--primary-light);
  border: 1px solid var(--primary-color);
  border-radius: 16px;
  color: var(--primary-color);
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.novel-chat-button button:active {
  background: var(--primary-color);
  color: var(--text-primary);
}

.message-bubble {
  max-width: 70%;
  padding: 12px 16px;
  border-radius: 18px;
  font-size: 15px;
  line-height: 1.5;
  word-break: break-word;
}

.message-bubble.sent {
  background: var(--primary-color);
  color: var(--text-primary);
  border-bottom-right-radius: 4px;
  margin-left: 8px;
}

.message-bubble.received {
  background: var(--surface-color);
  border: 1px solid var(--border-color);
  border-bottom-left-radius: 4px;
  margin-right: 8px;
}

.message-bubble.loading {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 12px 20px;
}

.message-bubble.loading .dot {
  width: 6px;
  height: 6px;
  background: var(--text-tertiary);
  border-radius: 50%;
  animation: pulse 1.4s ease-in-out infinite;
}

.message-bubble.loading .dot:nth-child(1) { animation-delay: 0s; }
.message-bubble.loading .dot:nth-child(2) { animation-delay: 0.2s; }
.message-bubble.loading .dot:nth-child(3) { animation-delay: 0.4s; }

@keyframes pulse {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
  40% { transform: scale(1); opacity: 1; }
}

.input-area {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  background: var(--surface-color);
  border-top: 1px solid var(--border-color);
  gap: 12px;
}

.input-area .input {
  flex: 1;
  padding: 12px 16px;
  border: 1px solid var(--border-color);
  border-radius: 24px;
  font-size: 15px;
  background: var(--bg-color);
}

.input-area .input:focus {
  outline: none;
  border-color: var(--primary-color);
}

.send-btn {
  width: 44px;
  height: 44px;
  border: none;
  border-radius: 50%;
  background: var(--primary-color);
  color: var(--text-primary);
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.send-btn:active {
  transform: scale(0.95);
}

.send-btn:disabled {
  background: var(--border-color);
  cursor: not-allowed;
}

/* 时间戳样式 */
.timestamp {
  display: flex;
  justify-content: center;
  margin: 16px 0;
}

.timestamp::before {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border-color);
  margin-right: 8px;
}

.timestamp::after {
  content: '';
  flex: 1;
  height: 1px;
  background: var(--border-color);
  margin-left: 8px;
}

.timestamp span {
  padding: 4px 8px;
  background: var(--bg-color);
  color: var(--text-secondary);
  font-size: 12px;
  border-radius: 4px;
}
</style>
