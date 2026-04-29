import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useAppStore = defineStore('app', () => {
  // API配置
  const apiConfig = ref({
    baseUrl: '',
    apiKey: '',
    model: '',
    temperature: 0.7,
    memorySize: 10
  })

  // 预设配置列表
  const presets = ref([])
  const currentPresetId = ref(null)

  // AI角色列表（已添加到千风集的）
  const characters = ref([])
  
  // 未添加的同行者列表
  const pendingCharacters = ref([])

  // 聊天记录
  const chatHistories = ref({})
  
  // 线下聊天记录
  const novelChatHistories = ref([])

  // 用户自定义桌面图标
  const customIcons = ref([])
  
  // 用户面具列表
  const masks = ref([])
  
  // 群聊列表
  const groupChats = ref([])

  // 初始化 - 从localStorage加载数据
  const init = () => {
    const savedApiConfig = localStorage.getItem('lingxu_api_config')
    if (savedApiConfig) {
      apiConfig.value = JSON.parse(savedApiConfig)
    }

    const savedPresets = localStorage.getItem('lingxu_presets')
    if (savedPresets) {
      presets.value = JSON.parse(savedPresets)
    }

    const savedCurrentPresetId = localStorage.getItem('lingxu_current_preset_id')
    if (savedCurrentPresetId) {
      currentPresetId.value = savedCurrentPresetId
    }

    const savedCharacters = localStorage.getItem('lingxu_characters')
    if (savedCharacters) {
      characters.value = JSON.parse(savedCharacters)
    }
    
    // 加载未添加的同行者
    const savedPendingCharacters = localStorage.getItem('lingxu_pending_characters')
    if (savedPendingCharacters) {
      pendingCharacters.value = JSON.parse(savedPendingCharacters)
    }

    const savedChatHistories = localStorage.getItem('lingxu_chat_histories')
    if (savedChatHistories) {
      chatHistories.value = JSON.parse(savedChatHistories)
    }

    const savedNovelChatHistories = localStorage.getItem('lingxu_novel_chat_histories')
    if (savedNovelChatHistories) {
      novelChatHistories.value = JSON.parse(savedNovelChatHistories)
    }

    const savedCustomIcons = localStorage.getItem('lingxu_custom_icons')
    if (savedCustomIcons) {
      customIcons.value = JSON.parse(savedCustomIcons)
    }
    
    const savedMasks = localStorage.getItem('lingxu_masks')
    if (savedMasks) {
      masks.value = JSON.parse(savedMasks)
    }
    
    // 加载群聊数据
    const savedGroupChats = localStorage.getItem('lingxu_group_chats')
    if (savedGroupChats) {
      groupChats.value = JSON.parse(savedGroupChats)
    }
  }

  // 保存API配置
  const saveApiConfig = () => {
    localStorage.setItem('lingxu_api_config', JSON.stringify(apiConfig.value))
  }

  // 保存预设配置
  const savePresets = () => {
    localStorage.setItem('lingxu_presets', JSON.stringify(presets.value))
    localStorage.setItem('lingxu_current_preset_id', currentPresetId.value || '')
  }

  // 保存角色
  const saveCharacters = () => {
    localStorage.setItem('lingxu_characters', JSON.stringify(characters.value))
  }
  
  // 保存未添加的同行者
  const savePendingCharacters = () => {
    localStorage.setItem('lingxu_pending_characters', JSON.stringify(pendingCharacters.value))
  }

  // 保存聊天记录
  const saveChatHistories = () => {
    localStorage.setItem('lingxu_chat_histories', JSON.stringify(chatHistories.value))
  }
  
  // 保存线下聊天记录
  const saveNovelChatHistories = () => {
    localStorage.setItem('lingxu_novel_chat_histories', JSON.stringify(novelChatHistories.value))
  }

  // 保存自定义图标
  const saveCustomIcons = () => {
    localStorage.setItem('lingxu_custom_icons', JSON.stringify(customIcons.value))
  }
  
  // 保存面具
  const saveMasks = () => {
    localStorage.setItem('lingxu_masks', JSON.stringify(masks.value))
  }
  
  // 保存群聊
  const saveGroupChats = () => {
    localStorage.setItem('lingxu_group_chats', JSON.stringify(groupChats.value))
  }

  // 预设管理
  const addPreset = (preset) => {
    const newPreset = {
      id: Date.now().toString(),
      name: preset.name,
      baseUrl: preset.baseUrl,
      apiKey: preset.apiKey,
      model: preset.model,
      temperature: preset.temperature || 0.7,
      memorySize: preset.memorySize || 10
    }
    presets.value.push(newPreset)
    savePresets()
    return newPreset
  }

  const updatePreset = (id, updates) => {
    const index = presets.value.findIndex(p => p.id === id)
    if (index !== -1) {
      presets.value[index] = { ...presets.value[index], ...updates }
      savePresets()
    }
  }

  const deletePreset = (id) => {
    presets.value = presets.value.filter(p => p.id !== id)
    if (currentPresetId.value === id) {
      currentPresetId.value = null
    }
    savePresets()
  }

  const selectPreset = (id) => {
    currentPresetId.value = id
    const preset = presets.value.find(p => p.id === id)
    if (preset) {
      apiConfig.value = {
        baseUrl: preset.baseUrl,
        apiKey: preset.apiKey,
        model: preset.model,
        temperature: preset.temperature,
        memorySize: preset.memorySize
      }
      saveApiConfig()
    }
    savePresets()
  }

  // 角色管理
  const addCharacter = (character) => {
    const newCharacter = {
      id: Date.now().toString(),
      name: character.name,
      avatar: character.avatar || '',
      personality: character.personality,
      createdAt: Date.now()
    }
    // 新建的同行者添加到未添加列表
    pendingCharacters.value.push(newCharacter)
    savePendingCharacters()
    return newCharacter
  }

  const updateCharacter = (id, updates) => {
    // 先检查已添加的角色列表
    let index = characters.value.findIndex(c => c.id === id)
    if (index !== -1) {
      characters.value[index] = { ...characters.value[index], ...updates }
      saveCharacters()
      return
    }
    
    // 再检查未添加的同行者列表
    index = pendingCharacters.value.findIndex(c => c.id === id)
    if (index !== -1) {
      pendingCharacters.value[index] = { ...pendingCharacters.value[index], ...updates }
      savePendingCharacters()
    }
  }

  const deleteCharacter = (id) => {
    // 从已添加的角色列表中删除
    characters.value = characters.value.filter(c => c.id !== id)
    delete chatHistories.value[id]
    saveCharacters()
    saveChatHistories()
    
    // 从未添加的同行者列表中删除
    pendingCharacters.value = pendingCharacters.value.filter(c => c.id !== id)
    savePendingCharacters()
  }
  
  // 将未添加的同行者添加到千风集
  const addPendingCharacterToChat = (id) => {
    const index = pendingCharacters.value.findIndex(c => c.id === id)
    if (index !== -1) {
      const character = pendingCharacters.value[index]
      characters.value.push(character)
      pendingCharacters.value.splice(index, 1)
      saveCharacters()
      savePendingCharacters()
      return character
    }
    return null
  }
  
  // 从千风集移除好友关系（不移除角色本身）
  const removeCharacterFromChat = (id) => {
    const index = characters.value.findIndex(c => c.id === id)
    if (index !== -1) {
      const character = characters.value[index]
      pendingCharacters.value.push(character)
      characters.value.splice(index, 1)
      delete chatHistories.value[id]
      saveCharacters()
      savePendingCharacters()
      saveChatHistories()
      return character
    }
    return null
  }

  // 聊天管理
  const getChatHistory = (characterId) => {
    return chatHistories.value[characterId] || []
  }

  const addMessage = (characterId, message) => {
    if (!chatHistories.value[characterId]) {
      chatHistories.value[characterId] = []
    }
    chatHistories.value[characterId].push({
      ...message,
      timestamp: Date.now()
    })
    saveChatHistories()
  }

  const clearChatHistory = (characterId) => {
    chatHistories.value[characterId] = []
    saveChatHistories()
    
    // 同时清空该角色的线下聊天记录
    novelChatHistories.value = novelChatHistories.value.filter(session => session.characterId !== characterId)
    saveNovelChatHistories()
  }
  
  // 线下聊天管理
  const addNovelChatSession = (characterId, messages = []) => {
    const session = {
      id: Date.now().toString(),
      characterId: characterId,
      messages: messages,
      createdAt: Date.now()
    }
    novelChatHistories.value.push(session)
    saveNovelChatHistories()
    return session
  }
  
  const getNovelChatSessions = (characterId) => {
    return novelChatHistories.value.filter(session => session.characterId === characterId)
  }
  
  const getNovelChatSession = (sessionId) => {
    return novelChatHistories.value.find(session => session.id === sessionId)
  }
  
  const addNovelMessage = (sessionId, message) => {
    const session = getNovelChatSession(sessionId)
    if (session) {
      session.messages.push({
        ...message,
        timestamp: Date.now()
      })
      saveNovelChatHistories()
    }
  }
  
  const deleteNovelChatSession = (sessionId) => {
    novelChatHistories.value = novelChatHistories.value.filter(session => session.id !== sessionId)
    saveNovelChatHistories()
  }

  // 自定义图标管理
  const addCustomIcon = (icon) => {
    const newIcon = {
      id: Date.now().toString(),
      name: icon.name,
      icon: icon.icon || '📱',
      position: icon.position
    }
    customIcons.value.push(newIcon)
    saveCustomIcons()
    return newIcon
  }

  const deleteCustomIcon = (id) => {
    customIcons.value = customIcons.value.filter(i => i.id !== id)
    saveCustomIcons()
  }
  
  // 面具管理
  const addMask = (mask) => {
    const newMask = {
      id: Date.now().toString(),
      name: mask.name,
      avatar: mask.avatar || '',
      personality: mask.personality || '',
      isMain: mask.isMain || false,
      createdAt: Date.now()
    }
    
    // 如果是第一个面具或者设置为主面具，将其他面具设置为非主面具
    if (newMask.isMain || masks.value.length === 0) {
      masks.value.forEach(m => m.isMain = false)
      newMask.isMain = true
    }
    
    masks.value.push(newMask)
    saveMasks()
    return newMask
  }

  const updateMask = (id, updates) => {
    const index = masks.value.findIndex(m => m.id === id)
    if (index !== -1) {
      // 如果设置为主面具，将其他面具设置为非主面具
      if (updates.isMain) {
        masks.value.forEach(m => m.isMain = false)
      }
      masks.value[index] = { ...masks.value[index], ...updates }
      saveMasks()
    }
  }

  const deleteMask = (id) => {
    const mask = masks.value.find(m => m.id === id)
    if (mask && mask.isMain && masks.value.length > 1) {
      // 如果删除的是主面具，将第一个面具设置为主面具
      const firstMask = masks.value.find(m => m.id !== id)
      if (firstMask) {
        firstMask.isMain = true
      }
    }
    masks.value = masks.value.filter(m => m.id !== id)
    saveMasks()
  }

  const setMainMask = (id) => {
    masks.value.forEach(m => m.isMain = false)
    const mask = masks.value.find(m => m.id === id)
    if (mask) {
      mask.isMain = true
      saveMasks()
    }
  }
  
  // 群聊管理
  const addGroupChat = (groupData) => {
    const newGroupChat = {
      id: Date.now().toString(),
      name: groupData.name || '群聊',
      avatar: '', // 可以根据群成员头像生成
      memberIds: groupData.memberIds || [],
      createdAt: Date.now()
    }
    groupChats.value.push(newGroupChat)
    saveGroupChats()
    return newGroupChat
  }

  const updateGroupChat = (id, updates) => {
    const index = groupChats.value.findIndex(g => g.id === id)
    if (index !== -1) {
      groupChats.value[index] = { ...groupChats.value[index], ...updates }
      saveGroupChats()
    }
  }

  const deleteGroupChat = (id) => {
    groupChats.value = groupChats.value.filter(g => g.id !== id)
    delete chatHistories.value[id]
    saveGroupChats()
    saveChatHistories()
  }

  const getGroupChat = (id) => {
    return groupChats.value.find(g => g.id === id)
  }

  const addGroupMember = (groupId, characterId) => {
    const group = getGroupChat(groupId)
    if (group && !group.memberIds.includes(characterId)) {
      group.memberIds.push(characterId)
      saveGroupChats()
    }
  }

  const removeGroupMember = (groupId, characterId) => {
    const group = getGroupChat(groupId)
    if (group) {
      group.memberIds = group.memberIds.filter(id => id !== characterId)
      saveGroupChats()
    }
  }

  // 计算当前选中的预设
  const currentPreset = computed(() => {
    return presets.value.find(p => p.id === currentPresetId.value)
  })

  return {
    // 状态
    apiConfig,
    presets,
    currentPresetId,
    currentPreset,
    characters,
    pendingCharacters,
    chatHistories,
    novelChatHistories,
    customIcons,
    masks,
    groupChats,

    // 方法
    init,
    saveApiConfig,
    savePresets,
    saveCharacters,
    saveChatHistories,
    saveCustomIcons,

    // 预设管理
    addPreset,
    updatePreset,
    deletePreset,
    selectPreset,

    // 角色管理
    addCharacter,
    updateCharacter,
    deleteCharacter,
    addPendingCharacterToChat,
    removeCharacterFromChat,

    // 聊天管理
    getChatHistory,
    addMessage,
    clearChatHistory,
    
    // 线下聊天管理
    addNovelChatSession,
    getNovelChatSessions,
    getNovelChatSession,
    addNovelMessage,
    deleteNovelChatSession,

    // 自定义图标
    addCustomIcon,
    deleteCustomIcon,
    
    // 面具管理
    addMask,
    updateMask,
    deleteMask,
    setMainMask,
    
    // 群聊管理
    addGroupChat,
    updateGroupChat,
    deleteGroupChat,
    getGroupChat,
    addGroupMember,
    removeGroupMember
  }
})
