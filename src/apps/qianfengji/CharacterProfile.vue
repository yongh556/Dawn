<template>
  <div class="profile-container">
    <!-- 顶部封面 -->
    <div class="cover">
      <img :src="character?.cover || defaultCover" class="cover-img">
      <div class="back-btn" @click="goBack"><i class="fas fa-chevron-left"></i></div>
    </div>

    <!-- 个人信息卡 -->
    <div class="profile-card">
      <img :src="character?.avatar || generateAvatar(character?.note || character?.name)" class="avatar">
      <div class="name">{{ character?.note || character?.name || '加载中...' }}</div>
      <div class="signature">{{ character?.personality || '正在从千风中获取人设档案...' }}</div>
    </div>

    <!-- 风闻集录 -->
    <div class="mod-title">风闻集录 <span @click="viewAllMoments">查看全部 <i class="fas fa-chevron-right"></i></span></div>
    <div class="cell-group">
      <div class="cell" @click="viewMoments">
        <div class="cell-info">
          <div style="font-size: 14px; color: var(--text-sub);">过往动态预览</div>
          <div class="moment-imgs">
            <img 
              v-for="(img, index) in moments" 
              :key="index"
              :src="img"
              class="m-img"
            >
          </div>
        </div>
      </div>
    </div>

    <!-- 风之档案 -->
    <div class="mod-title">风之档案</div>
    <div class="archive-grid">
      <div 
        v-for="(item, index) in archives" 
        :key="index"
        class="archive-item"
      >
        <div class="archive-label">{{ item.label }}</div>
        <div class="archive-val">{{ item.val }}</div>
      </div>
    </div>

    <!-- 最近足迹 -->
    <div class="mod-title">最近足迹</div>
    <div class="footprint-list">
      <div 
        v-for="(node, index) in footprints" 
        :key="index"
        class="foot-node"
      >
        <div class="foot-text">{{ node.text }}</div>
        <div class="foot-time">{{ node.time }}</div>
      </div>
    </div>

    <!-- 底部按钮 -->
    <div style="height: 120px;"></div>
    <div class="actions">
      <button class="btn btn-more" @click="toggleSheet(true)">···</button>
      <button class="btn btn-msg" @click="startChat"><i class="fas fa-paper-plane"></i> 发起传风信</button>
    </div>

    <!-- 操作菜单 -->
    <div class="sheet-mask" v-if="showSheet" @click="toggleSheet(false)"></div>
    <div class="action-sheet" :class="{ 'active': showSheet }">
      <div class="sheet-item" @click="modifyNote">修改备注名</div>
      <div class="sheet-item danger" @click="confirmBlock">拉黑伙伴</div>
      <div class="sheet-item danger" @click="confirmDelete">删除同行关系</div>
      <div style="height: 8px; background: var(--white, #FFFFFF);"></div>
      <div class="sheet-cancel" @click="toggleSheet(false)">取消</div>
    </div>

    <!-- 自定义对话框 -->
    <div class="custom-modal-mask" v-if="showModal" @click.self="closeModal">
      <div class="custom-modal" :class="{ 'modal-show': showModal }">
        <div class="modal-body">
          <div class="modal-title">{{ modalConfig.title }}</div>
          <div class="modal-text">{{ modalConfig.text }}</div>
          <input 
            v-if="modalConfig.showInput"
            type="text" 
            v-model="modalInput"
            class="modal-input" 
            :placeholder="modalConfig.placeholder"
          >
        </div>
        <div class="modal-footer">
          <button class="modal-btn cancel" @click="closeModal">取消</button>
          <button 
            class="modal-btn" 
            :class="{ 'danger': modalConfig.isDanger, 'confirm': !modalConfig.isDanger }"
            @click="confirmModal"
          >
            确定
          </button>
        </div>
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

const characterId = route.params.id
const character = computed(() => store.characters.find(c => c.id === characterId))

// 默认封面图
const defaultCover = 'https://images.unsplash.com/photo-1534067783941-51c9c23ecefd?w=800'

// 生成头像
const generateAvatar = (name) => {
  if (!name) return ''
  const seed = name.charAt(0).toUpperCase()
  return `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`
}

// 模拟数据
const moments = ref([
  "https://images.unsplash.com/photo-1528114039593-4366cc08227d?w=200",
  "https://images.unsplash.com/photo-1505333306404-5e1350a4185d?w=200",
  "https://images.unsplash.com/photo-1444858291040-58f756a3bdd6?w=200"
])

const archives = ref([
  { label: "常驻区域", val: "璃月 · 往生堂" },
  { label: "当前状态", val: "听戏品茗中" },
  { label: "风闻标签", val: "#博古通今 #契约" },
  { label: "喜好物品", val: "霓裳花、老茶" }
])

const footprints = ref([
  { text: "在三碗不过岗听了一场关于《创龙点睛》的评书。", time: "1小时前" },
  { text: "前往琥牢山探访了老友，并留下了一壶好茶。", time: "昨天" },
  { text: "于璃月港港口漫步，观察着集市的变迁。", time: "3天前" }
])

// 操作菜单
const showSheet = ref(false)

const toggleSheet = (show) => {
  showSheet.value = show
}

// 对话框
const showModal = ref(false)
const modalConfig = ref({
  title: '',
  text: '',
  showInput: false,
  placeholder: '',
  isDanger: false,
  onConfirm: null
})
const modalInput = ref('')

const showCustomModal = (config) => {
  modalConfig.value = config
  modalInput.value = config.inputValue || ''
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const confirmModal = () => {
  if (modalConfig.value.onConfirm) {
    modalConfig.value.onConfirm(modalInput.value)
  }
}

// 功能函数
const goBack = () => {
  router.push('/app/qianfengji')
}

const viewAllMoments = () => {
  alert('跳转完整列表')
}

const viewMoments = () => {
  alert('跳转朋友圈')
}

const startChat = () => {
  router.push(`/app/qianfengji/chat/${characterId}`)
}

const modifyNote = () => {
  toggleSheet(false)
  showCustomModal({
    title: "修改备注名",
    text: "请为你的伙伴设置一个专属称呼",
    showInput: true,
    placeholder: "输入备注...",
    inputValue: character.value?.note || character.value?.name,
    onConfirm: (val) => {
      if (val) {
        store.updateCharacter(characterId, { note: val })
        closeModal()
        setTimeout(() => {
          showCustomModal({
            title: "修改成功",
            text: `备注名已修改为：${val}`,
            onConfirm: () => {
              closeModal()
            }
          })
        }, 200)
      }
    }
  })
}

const confirmBlock = () => {
  toggleSheet(false)
  showCustomModal({
    title: "确定拉黑？",
    text: "拉黑后将不再接收对方的消息通知。",
    isDanger: true,
    onConfirm: () => {
      closeModal()
      setTimeout(() => {
        showCustomModal({ 
          title: "提示", 
          text: "已成功拉黑该伙伴", 
          onConfirm: () => {
            closeModal()
          } 
        })
      }, 200)
    }
  })
}

const confirmDelete = () => {
  toggleSheet(false)
  showCustomModal({
    title: "删除同行关系",
    text: "确定要删除吗？此操作将清空所有共同记忆。",
    isDanger: true,
    onConfirm: () => {
      store.removeCharacterFromChat(characterId)
      closeModal()
      setTimeout(() => {
        showCustomModal({ 
          title: "提示", 
          text: "已成功删除同行关系", 
          onConfirm: () => {
            router.push('/app/qianfengji')
          } 
        })
      }, 200)
    }
  })
}
</script>

<style scoped>
.profile-container {
  min-height: 100vh;
  background: var(--milk-bg, #F7FCFA);
  color: var(--text-main, #2C3E50);
  position: relative;
}

/* 顶部封面 */
.cover {
  height: 200px;
  background: #E0E0E0;
  position: relative;
  overflow: hidden;
}

.cover-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.back-btn {
  position: absolute;
  top: 50px;
  left: 20px;
  width: 40px;
  height: 40px;
  background: rgba(0,0,0,0.2);
  backdrop-filter: blur(10px);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  border: 0.5px solid rgba(255,255,255,0.3);
  z-index: 10;
  cursor: pointer;
}

/* 个人信息卡 */
.profile-card {
  margin: -40px 16px 0;
  background: var(--white, #FFFFFF);
  border-radius: 24px;
  padding: 20px;
  position: relative;
  box-shadow: 0 8px 30px rgba(0,0,0,0.04);
  text-align: center;
}

.avatar {
  width: 90px;
  height: 90px;
  border-radius: 32px;
  border: 4px solid var(--white, #FFFFFF);
  margin: -65px auto 12px;
  box-shadow: 0 4px 15px rgba(0,0,0,0.1);
  background: #EEE;
  object-fit: cover;
}

.name {
  font-size: 22px;
  font-weight: 800;
}

.signature {
  font-size: 13px;
  color: var(--text-sub, #95A5A6);
  margin: 8px 20px 0;
  line-height: 1.4;
}

/* 模块标题 */
.mod-title {
  padding: 24px 20px 12px;
  font-size: 15px;
  font-weight: 700;
  color: var(--text-main, #2C3E50);
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.mod-title span {
  font-size: 12px;
  color: var(--milk-green, #A8E6CF);
  font-weight: 500;
  cursor: pointer;
}

/* 朋友圈预览项 */
.cell-group {
  margin: 0 16px;
  background: var(--white, #FFFFFF);
  border-radius: 20px;
  border: 0.5px solid var(--border, #F0F4F2);
  overflow: hidden;
}

.cell {
  padding: 18px;
  display: flex;
  align-items: center;
  cursor: pointer;
}

.cell:active {
  background: #F5F5F5;
}

.cell-info {
  flex: 1;
}

.moment-imgs {
  display: flex;
  gap: 6px;
  margin-top: 10px;
}

.m-img {
  width: 64px;
  height: 64px;
  border-radius: 10px;
  background: #F0F4F2;
  object-fit: cover;
  border: 0.5px solid var(--border, #F0F4F2);
}

/* 动态档案网格 */
.archive-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 10px;
  padding: 0 16px;
}

.archive-item {
  background: var(--white, #FFFFFF);
  padding: 16px;
  border-radius: 18px;
  border: 0.5px solid var(--border, #F0F4F2);
}

.archive-label {
  font-size: 11px;
  color: var(--text-sub, #95A5A6);
  margin-bottom: 4px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.archive-val {
  font-size: 14px;
  font-weight: 700;
  color: var(--text-main, #2C3E50);
}

/* 最近足迹流 */
.footprint-list {
  margin: 0 20px;
  border-left: 2px solid var(--milk-green, #A8E6CF);
  padding-left: 20px;
}

.foot-node {
  position: relative;
  padding-bottom: 24px;
}

.foot-node::before {
  content: "";
  position: absolute;
  left: -26px;
  top: 4px;
  width: 10px;
  height: 10px;
  background: var(--white, #FFFFFF);
  border: 2.5px solid var(--milk-green, #A8E6CF);
  border-radius: 50%;
}

.foot-text {
  font-size: 14px;
  line-height: 1.5;
  margin-bottom: 4px;
}

.foot-time {
  font-size: 11px;
  color: var(--text-sub, #95A5A6);
}

/* 底部按钮 */
.actions {
  position: sticky;
  bottom: 20px;
  padding: 0 32px;
  display: flex;
  gap: 10px;
  z-index: 100;
  padding-bottom: env(safe-area-inset-bottom);
}

.btn {
  flex: 1;
  height: 52px;
  border-radius: 16px;
  border: none;
  font-weight: 700;
  font-size: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  box-shadow: 0 8px 20px rgba(0,0,0,0.05);
  cursor: pointer;
}

.btn-msg {
  background: var(--milk-green, #A8E6CF);
  color: white;
}

.btn-more {
  background: white;
  color: var(--text-main, #2C3E50);
  border: 0.5px solid var(--border, #F0F4F2);
}

/* 操作菜单 */
.sheet-mask {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
  z-index: 1000;
  opacity: 0;
  transition: opacity 0.3s;
}

.action-sheet {
  position: absolute;
  left: 0;
  right: 0;
  width: calc(100% - 30px);
  max-width: 340px;
  margin: 0 auto;
  bottom: -100%;
  background: var(--white, #FFFFFF);
  border-radius: 24px;
  transition: bottom 0.3s cubic-bezier(0.25, 1, 0.5, 1);
  z-index: 1001;
  padding-bottom: env(safe-area-inset-bottom);
  max-height: 70vh;
  overflow-y: auto;
}

.action-sheet.active {
  bottom: 20px;
}

.sheet-active {
  overflow: hidden;
}

.sheet-active .sheet-mask {
  opacity: 1;
}

.sheet-item {
  padding: 20px;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  border-bottom: 0.5px solid var(--border, #F0F4F2);
  cursor: pointer;
}

.sheet-item:active {
  background: #F9F9F9;
}

.sheet-item.danger {
  color: #FF5252;
}

.sheet-cancel {
  padding: 20px;
  text-align: center;
  font-size: 16px;
  color: var(--text-sub, #95A5A6);
  cursor: pointer;
}

/* 自定义对话框 */
.custom-modal-mask {
  position: absolute;
  inset: 0;
  background: rgba(0,0,0,0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  animation: fadeIn 0.2s;
}

.custom-modal {
  width: 85%;
  max-width: 320px;
  background: var(--white, #FFFFFF);
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
  transform: scale(0.9);
  transition: 0.2s;
  z-index: 1001;
  position: relative;
}

.custom-modal.modal-show {
  transform: scale(1);
}

.modal-body {
  padding: 24px 20px;
  text-align: center;
}

.modal-title {
  font-size: 17px;
  font-weight: 800;
  margin-bottom: 10px;
}

.modal-text {
  font-size: 14px;
  color: var(--text-sub, #95A5A6);
  line-height: 1.5;
}

.modal-input {
  width: 100%;
  border: 1px solid var(--border, #F0F4F2);
  background: var(--milk-bg, #F7FCFA);
  padding: 12px;
  border-radius: 12px;
  margin-top: 15px;
  outline: none;
  font-size: 15px;
}

.modal-footer {
  display: flex;
  border-top: 0.5px solid var(--border, #F0F4F2);
}

.modal-btn {
  flex: 1;
  padding: 16px 24px;
  border: none;
  background: transparent;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  z-index: 1002;
  position: relative;
  pointer-events: auto;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 56px;
}

.modal-btn.cancel {
  color: var(--text-sub, #95A5A6);
}

.modal-btn.confirm {
  color: var(--milk-green, #A8E6CF);
  border-left: 0.5px solid var(--border, #F0F4F2);
}

.modal-btn.danger {
  color: #FF5252;
  border-left: 0.5px solid var(--border, #F0F4F2);
  z-index: 1003;
  position: relative;
  pointer-events: auto;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
</style>
