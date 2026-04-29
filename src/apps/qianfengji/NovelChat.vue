<template>
  <div class="chat-container">
    <!-- 标题栏 -->
    <div class="header">
      <div class="settings-button" @click="showSettings = true">
        <svg class="settings-icon" viewBox="0 0 1024 1024" width="24" height="24">
          <path d="M512.25928 704c-108.8 0-192-83.2-192-192s83.2-192 192-192 192 83.2 192 192-83.2 192-192 192z m0-320c-70.4 0-128 57.6-128 128s57.6 128 128 128 128-57.6 128-128-57.6-128-128-128z" fill="#333333"></path>
          <path d="M640.25928 1024H384.25928c-19.2 0-32-12.8-32-32v-121.6c-25.6-12.8-51.2-25.6-70.4-38.4l-102.4 64c-12.8 6.4-32 6.4-44.8-12.8l-128-224C-6.14072 640 0.25928 620.8 19.45928 614.4l102.4-64v-76.8l-102.4-64C0.25928 403.2-6.14072 384 6.65928 364.8l128-224c6.4-12.8 25.6-19.2 44.8-6.4l102.4 64c19.2-12.8 44.8-32 70.4-38.4V32c0-19.2 12.8-32 32-32h256c19.2 0 32 12.8 32 32v121.6c25.6 12.8 51.2 25.6 70.4 38.4l102.4-64c12.8-6.4 32-6.4 44.8 12.8l128 224c12.8 19.2 6.4 38.4-12.8 44.8l-102.4 64v76.8l102.4 64c12.8 6.4 19.2 25.6 12.8 44.8l-128 224c-6.4 12.8-25.6 19.2-44.8 12.8l-102.4-64c-19.2 12.8-44.8 32-70.4 38.4V992c0 19.2-12.8 32-32 32z m-224-64h192v-108.8c0-12.8 6.4-25.6 19.2-32 32-12.8 64-32 89.6-51.2 12.8-6.4 25.6-6.4 38.4 0l96 57.6 96-166.4-96-57.6c-12.8-12.8-19.2-25.6-12.8-38.4 0-19.2 6.4-32 6.4-51.2s0-32-6.4-51.2c0-12.8 6.4-25.6 12.8-32l96-57.6-96-166.4-96 57.6c-12.8 6.4-25.6 6.4-38.4 0-25.6-19.2-57.6-38.4-89.6-51.2-12.8-12.8-19.2-25.6-19.2-38.4V64H416.25928v108.8c0 12.8-6.4 25.6-19.2 32-32 12.8-64 32-89.6 51.2-12.8 6.4-25.6 6.4-38.4 0l-96-51.2-96 166.4 96 57.6c12.8 6.4 19.2 19.2 12.8 32 0 19.2-6.4 32-6.4 51.2 0 19.2 0 32 6.4 51.2 6.4 12.8 0 25.6-12.8 32l-96 57.6 96 166.4 96-57.6c12.8-6.4 25.6-6.4 38.4 0 25.6 19.2 57.6 38.4 89.6 51.2 12.8 6.4 19.2 19.2 19.2 32V960z" fill="#333333"></path>
        </svg>
      </div>
      <h1 class="header-title">{{ character?.name || '线下聊天' }}</h1>
      <div class="header-right-group">
        <div class="clover-button active" @click="goToOnlineChat">
          <svg class="clover-icon" viewBox="0 0 1024 1024" width="24" height="24">
            <path d="M859.867 448.403c136.9-63.175 54.44-193.784-98.066-152.726-84.072 22.603-158.738 111.715-218.313 145.103 33.388-59.575 122.469-134.255 145.104-218.281C729.65 69.96 599.041-12.468 535.881 124.402c-63.175-136.87-193.784-54.441-152.742 98.097 22.65 84.025 111.731 158.706 145.103 218.281-59.56-33.388-134.208-122.5-218.296-145.103-152.507-41.058-234.951 89.551-98.05 152.726-136.901 63.16-54.457 193.768 98.05 152.726 84.088-22.618 158.737-111.731 218.296-145.103-33.372 59.576-122.453 134.24-145.103 218.328-41.042 152.508 89.566 234.937 152.742 98.051 63.16 136.886 193.769 54.457 152.711-98.051-22.635-84.088-111.716-158.752-145.104-218.328 59.575 33.372 134.24 122.485 218.313 145.103 152.507 41.042 234.967-89.566 98.066-152.726z" fill="#4dcc63"></path>
          </svg>
        </div>
        <div class="header-right" @click="showMenu = true">⋮</div>
      </div>
    </div>

    <!-- 设置对话框 -->
    <div class="modal-overlay" v-if="showSettings" @click.self="showSettings = false">
      <div class="settings-modal">
        <div class="settings-header">
          <h2>设置</h2>
          <div class="close-btn" @click="showSettings = false">×</div>
        </div>
        <div class="settings-content">
          <!-- 1. 输出字数控制 -->
          <div class="setting-item">
            <div class="setting-label">输出字数：{{ outputWords }}字</div>
            <input 
              type="range" 
              v-model="outputWords" 
              min="0" 
              max="1000" 
              class="range-input"
            >
          </div>

          <!-- 2. 文风选择 -->
          <div class="setting-item">
            <div class="setting-label">文风选择</div>
            <div class="style-selector">
              <div class="style-select-box" @click="showStyleDialog = true">
                {{ writingStyle ? writingStyles.find(s => s.id === writingStyle)?.name : '选择文风' }}
              </div>
            </div>
          </div>

          <!-- 3. HTML生成开关 -->
          <div class="setting-item">
            <div class="setting-label">HTML</div>
            <div class="setting-control">
              <div class="switch" :class="{ 'active': enableHtml }" @click="enableHtml = !enableHtml"></div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 文风选择对话框 -->
    <div class="modal-overlay" v-if="showStyleDialog" @click.self="showStyleDialog = false">
      <div class="settings-modal">
        <div class="settings-header">
          <h2>选择文风</h2>
          <div class="close-btn" @click="showStyleDialog = false">×</div>
        </div>
        <div class="settings-content">
          <!-- 新建文风按钮 -->
          <button class="new-style-btn" @click="showNewStyleDialog = true">新建文风</button>
          
          <!-- 文风列表 -->
          <div class="style-list">
            <div class="style-item" v-for="style in writingStyles" :key="style.id">
              <div class="style-info" @click="selectStyle(style.id)">
                <div class="style-name">{{ style.name }}</div>
                <div class="style-description">{{ style.description }}</div>
              </div>
              <div class="style-actions">
                <button class="edit-btn" @click.stop="editStyle(style)">
                  <svg class="edit-icon" viewBox="0 0 1024 1024" width="16" height="16">
                    <path d="M873.9 268.07L669.23 63.31c-8.31-8.31-19.36-12.89-31.12-12.89S615.3 55 606.99 63.31L104.36 566.14c-8.26 8.27-12.96 19.71-12.88 31.4l1.37 203.38c0.16 23.94 19.77 43.54 43.7 43.7l203.3 1.38h0.29c11.6 0 22.93-4.69 31.12-12.89L873.9 330.28c17.15-17.15 17.15-45.06 0-62.21zM328.63 773.92l-163.96-1.11-1.11-164.05 347.88-348.01L676.53 425.9l-347.9 348.02z m398.79-398.95L562.34 209.82l75.77-75.8L803.2 299.17l-75.78 75.8zM851.88 772.88H563.66c-19.88 0-36 16.12-36 36s16.12 36 36 36h288.22c19.88 0 36-16.12 36-36s-16.12-36-36-36zM851.88 636.68H740.36c-19.88 0-36 16.12-36 36s16.12 36 36 36h111.51c19.88 0 36-16.12 36-36s-16.11-36-35.99-36z" fill="#31D0C8"></path>
                  </svg>
                </button>
                <button class="delete-btn" @click.stop="deleteStyle(style.id)">
                  <svg class="delete-icon" viewBox="0 0 1024 1024" width="16" height="16">
                    <path d="M371.3024 433.9712v360.704c0 14.1312 11.4688 25.6 25.6 25.6s25.6-11.4688 25.6-25.6V433.9712c0-14.1312-11.4688-25.6-25.6-25.6s-25.6 11.4688-25.6 25.6zM613.7856 433.9712v360.704c0 14.1312 11.4688 25.6 25.6 25.6s25.6-11.4688 25.6-25.6V433.9712c0-14.1312-11.4688-25.6-25.6-25.6s-25.6 11.4688-25.6 25.6z" fill="#d81e06"></path>
                    <path d="M928.3584 244.3776h-188.16v-34.3552c0-75.8272-61.696-137.5744-137.5744-137.5744H436.48c-75.8272 0-137.5744 61.696-137.5744 137.5744v34.3552H102.8608c-14.1312 0-25.6 11.4688-25.6 25.6s11.4688 25.6 25.6 25.6h50.176v494.7456c0 98.816 80.384 179.2 179.2 179.2h367.872c98.816 0 179.2-80.384 179.2-179.2v-272.7936c0-14.1312-11.4688-25.6-25.6-25.6s-25.6 11.4688-25.6 25.6v272.7936c0 70.6048-57.3952 128-128 128H332.2368c-70.6048 0-128-57.3952-128-128V295.5776h623.9232V358.912c0 14.1312 11.4688 25.6 25.6 25.6s25.6-11.4688 25.6-25.6V295.5776h49.0496c14.1312 0 25.6-11.4688 25.6-25.6s-11.52-25.6-25.6512-25.6z m-578.2528 0v-34.3552c0-47.616 38.7584-86.3744 86.3744-86.3744h166.2464c47.616 0 86.3744 38.7584 86.3744 86.3744v34.3552H350.1056z" fill="#d81e06"></path>
                    <path d="M853.7088 403.9168c-14.1312 0-25.6 11.4688-25.6 25.6v18.0736c0 14.1312 11.4688 25.6 25.6 25.6s25.6-11.4688 25.6-25.6v-18.0736c0-14.1312-11.4176-25.6-25.6-25.6z" fill="#d81e06"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 新建文风对话框 -->
    <div class="modal-overlay" v-if="showNewStyleDialog" @click.self="showNewStyleDialog = false">
      <div class="settings-modal">
        <div class="settings-header">
          <h2>{{ editingStyle ? '编辑文风' : '新建文风' }}</h2>
          <div class="close-btn" @click="closeNewStyleDialog">×</div>
        </div>
        <div class="settings-content">
          <!-- 文风名称 -->
          <div class="form-item">
            <label class="form-label">请输入文风名称</label>
            <input 
              type="text" 
              v-model="newStyleName" 
              class="form-input"
              placeholder="请输入文风名称"
            >
          </div>
          
          <!-- 文风描述 -->
          <div class="form-item">
            <label class="form-label">请输入文风描述</label>
            <textarea 
              v-model="newStyleDescription" 
              class="form-textarea"
              placeholder="请输入文风描述"
              rows="4"
            ></textarea>
          </div>
          
          <!-- 操作按钮 -->
          <div class="dialog-actions">
            <button class="cancel-btn" @click="closeNewStyleDialog">取消</button>
            <button class="confirm-btn" @click="saveStyle">确定</button>
          </div>
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

    <!-- Toast提示 -->
    <div class="toast" v-if="showToast">
      <p>{{ toastMessage }}</p>
    </div>

    <!-- 聊天消息区域 -->
    <div class="messages" ref="messagesRef">
      <div v-if="messages.length === 0" class="empty-chat">
        <div class="avatar large">{{ character?.name?.charAt(0) || '?' }}</div>
        <p class="welcome-text">{{ character?.name }} 正在等待你的线下对话...</p>
        <p class="hint-text">输入小说式对话开始角色扮演</p>
      </div>
      
      <div 
        v-for="(msg, index) in messages" 
        :key="index"
        class="message-wrapper"
        :class="{ 'sent': msg.role === 'user' }"
      >
        <div v-if="msg.role === 'assistant'" class="avatar small">
          {{ character?.name?.charAt(0) || '?' }}
        </div>
        <div v-if="msg.role === 'user'" class="avatar small user-avatar">
          我
        </div>
        <div class="message-bubble" :class="msg.role === 'user' ? 'sent' : 'received'">
          {{ msg.content }}
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
        placeholder="输入小说式对话..."
        @keyup.enter="sendMessage"
        :disabled="isLoading"
      />
      <button class="send-btn" @click="sendMessage" :disabled="isLoading || !inputText.trim()">
        <svg class="send-icon" viewBox="0 0 1092 1024" width="20" height="20">
          <path d="M259.413333 477.866667h320.853334c20.48 0 34.133333 13.653333 34.133333 34.133333s-13.653333 34.133333-34.133333 34.133333H259.413333c0 6.826667-6.826667 13.653333-6.826666 27.306667L68.266667 955.733333l955.733333-443.733333L68.266667 68.266667l184.32 382.293333c6.826667 13.653333 6.826667 20.48 6.826666 27.306667z m791.893334 95.573333l-955.733334 443.733333c-34.133333 13.653333-75.093333 0-88.746666-34.133333-6.826667-20.48-6.826667-40.96 0-61.44l184.32-382.293333c6.826667-20.48 6.826667-40.96 0-61.44L6.826667 95.573333C-6.826667 61.44 6.826667 20.48 40.96 6.826667c13.653333-6.826667 40.96-6.826667 54.613333 0l955.733334 443.733333c34.133333 13.653333 47.786667 54.613333 34.133333 88.746667-6.826667 13.653333-20.48 27.306667-34.133333 34.133333z" fill="#23cf89"></path>
        </svg>
      </button>
    </div>

    <!-- 线下聊天设置界面 -->
    <div class="modal-overlay" v-if="showMenu" @click.self="showMenu = false">
      <div class="settings-modal">
        <div class="settings-header">
          <h2>线下聊天设置</h2>
          <div class="close-btn" @click="showMenu = false">×</div>
        </div>
        <div class="settings-content">
          <!-- 1. 线下记忆自动总结 -->
          <div class="setting-item">
            <div class="setting-label">线下记忆自动总结</div>
            <div class="setting-control">
              <div class="switch" :class="{ 'active': autoSummary }" @click="autoSummary = !autoSummary"></div>
            </div>
          </div>

          <!-- 2. 线下触发频率 -->
          <div class="setting-item">
            <div class="setting-label">线下触发频率</div>
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

          <!-- 3. 线下总结字数 -->
          <div class="setting-item">
            <div class="setting-label">线下总结字数</div>
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
        </div>
      </div>
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

// 线下聊天会话ID
const sessionId = ref('')
const messages = computed(() => {
  const session = store.getNovelChatSession(sessionId.value)
  return session ? session.messages : []
})

const inputText = ref('')
const isLoading = ref(false)
const showMenu = ref(false)
const showSettings = ref(false)
const messagesRef = ref(null)

// 设置对话框相关
const outputWords = ref(500)
const writingStyle = ref('')
const enableHtml = ref(false)

// 文风管理相关
const showStyleDialog = ref(false)
const showNewStyleDialog = ref(false)
const showConfirmDialog = ref(false)
const showToast = ref(false)
const toastMessage = ref('')
const confirmMessage = ref('')
const confirmCallback = ref(null)
const editingStyle = ref(null)
const newStyleName = ref('')
const newStyleDescription = ref('')

// 文风列表
const writingStyles = ref([
  { id: '1', name: '默认文风', description: '标准的小说式角色扮演风格' },
  { id: '2', name: '古风', description: '古典文学风格，用词典雅' },
  { id: '3', name: '现代', description: '现代都市风格，口语化表达' }
])

// 设置界面相关变量
const autoSummary = ref(true) // 线下记忆自动总结，默认开启
const triggerFrequency = ref(10) // 线下触发频率，默认10条
const summaryLength = ref(100) // 线下总结字数，默认100字

// 输入框相关变量
const showFrequencyInput = ref(false)
const frequencyInput = ref('')
const showSummaryLengthInput = ref(false)
const summaryLengthInput = ref('')

const goToOnlineChat = () => {
  // 如果自动总结功能开启且当前会话有聊天记录，则进行总结
  if (autoSummary.value) {
    const session = store.getNovelChatSession(sessionId.value)
    if (session && session.messages.length > 0) {
      // 这里可以实现线下记忆总结逻辑
      // 目前可以先记录一个提示
      console.log(`总结线下聊天记录，共${session.messages.length}条消息`)
    }
  }
  
  router.push(`/app/qianfengji/chat/${characterId.value}`)
}

// 文风管理相关函数
const selectStyle = (styleId) => {
  writingStyle.value = styleId
  showStyleDialog.value = false
}

const editStyle = (style) => {
  editingStyle.value = style
  newStyleName.value = style.name
  newStyleDescription.value = style.description
  showNewStyleDialog.value = true
}

const deleteStyle = (styleId) => {
  confirmMessage.value = '确定要删除这个文风吗？'
  confirmCallback.value = () => {
    writingStyles.value = writingStyles.value.filter(s => s.id !== styleId)
    if (writingStyle.value === styleId) {
      writingStyle.value = ''
    }
  }
  showConfirmDialog.value = true
}

const confirmAction = () => {
  if (confirmCallback.value) {
    confirmCallback.value()
  }
  showConfirmDialog.value = false
  confirmCallback.value = null
}

const closeNewStyleDialog = () => {
  showNewStyleDialog.value = false
  editingStyle.value = null
  newStyleName.value = ''
  newStyleDescription.value = ''
}

const showToastMessage = (message) => {
  toastMessage.value = message
  showToast.value = true
  setTimeout(() => {
    showToast.value = false
  }, 3000)
}

const saveStyle = () => {
  if (!newStyleName.value.trim()) {
    showToastMessage('请输入文风名称')
    return
  }
  
  if (editingStyle.value) {
    // 编辑现有文风
    const index = writingStyles.value.findIndex(s => s.id === editingStyle.value.id)
    if (index !== -1) {
      writingStyles.value[index].name = newStyleName.value
      writingStyles.value[index].description = newStyleDescription.value
    }
  } else {
    // 创建新文风
    const newStyle = {
      id: Date.now().toString(),
      name: newStyleName.value,
      description: newStyleDescription.value
    }
    writingStyles.value.push(newStyle)
  }
  
  closeNewStyleDialog()
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

const scrollToBottom = () => {
  nextTick(() => {
    if (messagesRef.value) {
      messagesRef.value.scrollTop = messagesRef.value.scrollHeight
    }
  })
}

const sendMessage = async () => {
  if (!inputText.value.trim() || isLoading.value) return

  const userMessage = inputText.value.trim()
  inputText.value = ''

  // 添加用户消息到线下聊天会话
  store.addNovelMessage(sessionId.value, {
    role: 'user',
    content: userMessage
  })

  scrollToBottom()

  // 检查API配置
  const { baseUrl, apiKey, model, temperature, memorySize } = store.apiConfig
  
  if (!baseUrl || !apiKey || !model) {
    setTimeout(() => {
      store.addNovelMessage(sessionId.value, {
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
    
    const systemPrompt = character.value 
      ? `你是一个名为"${character.value.name}"的角色。\n设定：${character.value.personality || '暂无设定'}\n\n这是线下聊天场景，使用小说式角色扮演风格回复。\n请遵循以下规则：\n1. 不用括号写动作、神态、心理活动\n2. 直接用叙述句把动作、场景、表情、心理全写进段落里\n3. 使用标准中文标点，对话用中文双引号单独标出来，左双引号用「“」，右双引号用「”」，禁止出现两个右引号的情况\n4. 全程角色视角，没有"我想""我觉得"这种上帝视角乱入\n5. 一整段流畅下来，像在看小说，而不是简单的对话+括号\n6. 风格要细腻、有画面感、沉浸式\n\n例如：\n阿贝多看着你毫不客气地伸出手，径直从他刚放在桌上的纸袋里抓了一大把爆米花。你脸颊微鼓，像只囮积着过冬粮食的仓鼠，香甜的焦糖气息立刻在客厅里弥漫开来。他将装着提子的另一个袋子也放到桌上，自己则靠在餐桌边缘，那双蓝绿色的眼阵安静地注视着你，目光柔和。刚刚从外面回来的凉意还未从他身上完全散去，但看着你满足的样子，他的嘴角不自觉地勾起一抹极浅的弧度。\n“味道如何?那位老奶奶的手艺，应该没让你失望。”他轻声问道，声音清朗悦耳。`
      : '你是一个友好的AI助手。请使用小说式角色扮演风格回复，动作、神态、心理直接写进叙述中，对话用中文双引号标出，左双引号用「“」，右双引号用「”」。'

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

    store.addNovelMessage(sessionId.value, {
      role: 'assistant',
      content: reply
    })
  } catch (error) {
    console.error('API请求错误:', error)
    store.addNovelMessage(sessionId.value, {
      role: 'assistant',
      content: `连接失败: ${error.message}\n请检查"夜航"中的API配置是否正确。`
    })
  } finally {
    isLoading.value = false
    scrollToBottom()
  }
}



onMounted(() => {
  // 检查是否有指定的会话ID
  const querySessionId = route.query.sessionId
  
  if (querySessionId) {
    // 加载指定的会话
    const session = store.getNovelChatSession(querySessionId)
    if (session) {
      sessionId.value = session.id
    } else {
      // 如果会话不存在，创建新会话
      const newSession = store.addNovelChatSession(characterId.value)
      sessionId.value = newSession.id
    }
  } else {
    // 创建新的线下聊天会话
    const session = store.addNovelChatSession(characterId.value)
    sessionId.value = session.id
  }
  
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
  padding: 0 8px;
  border-bottom: 1px solid var(--border-color);
  position: relative;
}

.settings-button {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: 50%;
  transition: background 0.2s;
}

.settings-button:active {
  background: var(--bg-color);
}

.settings-icon {
  fill: var(--text-primary);
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

.clover-button.active {
  background: var(--primary-light);
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

/* 设置界面样式 */
.settings-modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 400px;
  background: var(--surface-color);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 1000;
}

.settings-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
  border-bottom: 1px solid var(--border-color);
}

.settings-header h2 {
  margin: 0;
  font-size: 18px;
  color: var(--text-primary);
}

.close-btn {
  font-size: 24px;
  cursor: pointer;
  color: var(--text-secondary);
}

.settings-content {
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

/* 滑动条样式 */
.range-input {
  width: 100%;
  height: 6px;
  margin-top: 8px;
  -webkit-appearance: none;
  appearance: none;
  background: var(--border-color);
  border-radius: 3px;
  outline: none;
}

.range-input::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  width: 18px;
  height: 18px;
  background: var(--primary-color);
  border-radius: 50%;
  cursor: pointer;
}

.range-input::-moz-range-thumb {
  width: 18px;
  height: 18px;
  background: var(--primary-color);
  border-radius: 50%;
  cursor: pointer;
  border: none;
}

/* 文风选择器样式 */
.style-selector {
  width: 100%;
}

.style-select-box {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-color);
  color: var(--text-primary);
  font-size: 14px;
  cursor: pointer;
  text-align: left;
}

.style-select-box:active {
  background: var(--primary-light);
  border-color: var(--primary-color);
}

/* 文风选择对话框样式 */
.new-style-btn {
  width: 100%;
  padding: 10px;
  margin-bottom: 16px;
  border: 1px solid var(--primary-color);
  border-radius: 6px;
  background: var(--primary-light);
  color: white;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.new-style-btn:active {
  background: var(--primary-color);
  color: white;
}

.style-list {
  max-height: 300px;
  overflow-y: auto;
}

.style-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  margin-bottom: 8px;
  background: var(--bg-color);
}

.style-info {
  flex: 1;
  cursor: pointer;
}

.style-name {
  font-size: 14px;
  font-weight: 500;
  color: var(--text-primary);
  margin-bottom: 4px;
}

.style-description {
  font-size: 12px;
  color: var(--text-secondary);
}

.style-actions {
  display: flex;
  gap: 8px;
}

.edit-btn, .delete-btn {
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 4px;
  background: transparent;
  cursor: pointer;
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.edit-btn:active {
  background: var(--primary-light);
}

.delete-btn:active {
  background: rgba(255, 0, 0, 0.1);
}

/* 新建文风对话框样式 */
.form-item {
  margin-bottom: 16px;
}

.form-label {
  display: block;
  font-size: 14px;
  color: var(--text-primary);
  margin-bottom: 8px;
}

.form-input, .form-textarea {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  background: var(--bg-color);
  color: var(--text-primary);
  font-size: 14px;
}

.form-textarea {
  resize: vertical;
}

.form-input:focus, .form-textarea:focus {
  outline: none;
  border-color: #98D8C8;
  box-shadow: 0 0 0 2px rgba(152, 216, 200, 0.25);
}

.dialog-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.cancel-btn, .confirm-btn {
  flex: 1;
  padding: 10px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.cancel-btn {
  background: var(--bg-color);
  color: var(--text-primary);
}

.cancel-btn:active {
  background: var(--border-color);
}

.confirm-btn {
  background: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
}

.confirm-btn:active {
  background: var(--primary-dark);
}

/* 确认对话框样式 */
.confirm-modal {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 320px;
  background: var(--surface-color);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  z-index: 1001;
}

.confirm-content {
  padding: 24px;
  text-align: center;
}

.confirm-content p {
  margin: 0;
  font-size: 16px;
  color: var(--text-primary);
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
  font-size: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.confirm-actions .cancel-btn {
  background: var(--bg-color);
  color: var(--text-primary);
  border-right: 1px solid var(--border-color);
  border-radius: 0 0 0 12px;
}

.confirm-actions .cancel-btn:active {
  background: var(--border-color);
}

.confirm-actions .confirm-btn {
  background: var(--primary-color);
  color: white;
  border-radius: 0 0 12px 0;
}

.confirm-actions .confirm-btn:active {
  background: var(--primary-dark);
}

/* Toast提示样式 */
.toast {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--primary-color);
  color: white;
  padding: 12px 24px;
  border-radius: 8px;
  font-size: 14px;
  z-index: 1002;
  animation: toast-fade 3s ease-in-out;
}

@keyframes toast-fade {
  0% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
  20% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  80% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
  100% {
    opacity: 0;
    transform: translate(-50%, -50%) scale(0.8);
  }
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

/* 按钮样式 */
.input-button {
  padding: 6px 12px;
  border: 1px solid var(--border-color);
  border-radius: 6px;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  background: var(--surface-color);
  color: var(--text-primary);
}

.input-button:active {
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

.message-bubble {
  max-width: 80%;
  padding: 14px 18px;
  border-radius: 18px;
  font-size: 15px;
  line-height: 1.6;
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

.modal-content {
  background: var(--surface-color);
  width: 70%;
  max-width: 280px;
  border-radius: 16px;
  overflow: hidden;
}

.modal-content .menu-item {
  padding: 16px;
  text-align: center;
  border-bottom: 1px solid var(--border-color);
  cursor: pointer;
}

.modal-content .menu-item:last-child {
  border-bottom: none;
  color: var(--text-secondary);
}

.modal-content .menu-item:first-child {
  color: var(--error-color);
}

.modal-content .menu-item:active {
  background: var(--bg-color);
}
</style>
