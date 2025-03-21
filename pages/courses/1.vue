<template>
    <div class="courses-container">
      <!-- Unity Background (可用簡單背景替代) -->
      <div class="unity-background">
        <!-- 未來可放Unity canvas -->
      </div>
  
      <!-- Glass Container for All Content -->
      <div class="glass-container">
        <div class="content-wrapper">
          <!-- Side Navigation -->
          <div class="sidebar" :class="{ 'open': !isSidebarCollapsed }">
            <div class="navbar">
              <div class="navbar-inner">
                <div class="sidebar-header">
                  <button class="menu-btn" @click="toggleSidebar">
                    <div class="hamburger" :class="{ 'active': !isSidebarCollapsed }">
                      <span></span>
                      <span></span>
                      <span></span>
                    </div>
                  </button>
                  <div class="logo">課程平台</div>
                </div>
                
                <div class="menu">
                  <div class="menu-item active">
                    <div class="menu-item-inner">
                      <BookOpen class="menu-icon" />
                      <span class="menu-title">課程介紹</span>
                    </div>
                  </div>
                  
                  <div class="menu-item">
                    <div class="menu-item-inner">
                      <History class="menu-icon" />
                      <span class="menu-title">學習歷程</span>
                    </div>
                  </div>
                  
                  <div class="menu-item">
                    <div class="menu-item-inner">
                      <Activity class="menu-icon" />
                      <span class="menu-title">動作分析</span>
                    </div>
                  </div>
                  
                  <div class="menu-item">
                    <div class="menu-item-inner">
                      <User class="menu-icon" />
                      <span class="menu-title">用戶管理</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
  
          <!-- Main Content Area -->
          <div class="main-content">
            <!-- Breadcrumb Navigation -->
            <div class="breadcrumb-nav mb-4">
              <div class="flex text-sm text-gray-400">
                <span>課程</span>
                <ChevronRight class="w-4 h-4 mx-2" />
                <span class="text-white">{{ course.title }}</span>
              </div>
            </div>
  
            <!-- Course Title and Info -->
            <div class="course-header mb-6">
              <h1 class="text-2xl font-bold text-white">{{ course.title }}</h1>
              <div class="flex items-center gap-3 mt-2">
                <div class="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">{{ levelText }}</div>
                <span class="text-white opacity-70">{{ course.instructor }}</span>
              </div>
            </div>
            
            <!-- Video Player Section -->
            <div class="video-section mb-8">
              <!-- Video Player Container -->
              <div class="relative aspect-video bg-black rounded-lg overflow-hidden shadow-lg mb-4">
                <video
                  ref="videoPlayer"
                  class="w-full h-full object-contain"
                  :class="{ 'scale-x-[-1]': isMirrored }"
                  @timeupdate="updateProgress"
                  @loadedmetadata="videoLoaded"
                  @ended="isPlaying = false"
                >
                  <source :src="course.videoUrl" type="video/mp4" />
                  您的瀏覽器不支持視頻標籤
                </video>
  
                <!-- Camera Overlay (when enabled) -->
                <video
                  v-if="isCameraOn"
                  ref="cameraFeed"
                  class="absolute inset-0 w-full h-full object-contain opacity-40 z-10"
                  :class="{ 'scale-x-[-1]': isMirrored }"
                  autoplay
                  muted
                ></video>
  
                <!-- Video Controls Overlay (appears on hover) -->
                <div
                  class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 hover:opacity-100 transition-opacity duration-300"
                  @click="togglePlay"
                >
                  <button
                    v-if="!isPlaying"
                    class="bg-white/20 hover:bg-white/30 h-16 w-16 rounded-full flex items-center justify-center text-white opacity-80 hover:opacity-100"
                  >
                    <Play class="h-8 w-8" />
                  </button>
                </div>
              </div>
  
              <!-- Video Controls -->
              <div class="glass-controls p-4 rounded-lg mb-6">
                <!-- Progress Bar -->
                <div class="relative h-2 bg-gray-700 rounded-full mb-4 cursor-pointer" @click="seek">
                  <div class="absolute inset-y-0 left-0 bg-blue-500 rounded-full" :style="{ width: `${progress}%` }"></div>
                </div>
  
                <!-- Time Display -->
                <div class="flex justify-between text-xs text-gray-400 mb-3">
                  <span>{{ formatTime(currentTime) }}</span>
                  <span>{{ formatTime(duration) }}</span>
                </div>
  
                <!-- Control Buttons -->
                <div class="flex items-center justify-between">
                  <div class="flex items-center space-x-2">
                    <!-- Backward 5s -->
                    <button @click="skipBackward" class="p-2 text-white hover:bg-white/10 rounded-full">
                      <Rewind class="h-5 w-5" />
                    </button>
  
                    <!-- Play/Pause -->
                    <button @click="togglePlay" class="p-2 text-white hover:bg-white/10 rounded-full">
                      <Play v-if="!isPlaying" class="h-5 w-5" />
                      <Pause v-else class="h-5 w-5" />
                    </button>
  
                    <!-- Forward 5s -->
                    <button @click="skipForward" class="p-2 text-white hover:bg-white/10 rounded-full">
                      <FastForward class="h-5 w-5" />
                    </button>
                  </div>
  
                  <div class="flex items-center space-x-3">
                    <!-- Playback Speed -->
                    <div class="relative">
                      <button 
                        @click="toggleSpeedMenu" 
                        class="p-2 text-xs text-white hover:bg-white/10 rounded-lg"
                      >
                        {{ playbackRate }}x
                      </button>
                      <div v-if="showSpeedMenu" class="absolute bottom-full mb-2 bg-gray-800 rounded-lg shadow-lg p-1 z-20">
                        <div class="flex flex-col">
                          <button
                            v-for="rate in [0.5, 0.75, 1.0, 1.25, 1.5, 2.0]"
                            :key="rate"
                            class="px-4 py-1 text-white text-sm hover:bg-white/10 rounded-md"
                            :class="{ 'bg-white/10': playbackRate === rate }"
                            @click="setPlaybackRate(rate)"
                          >
                            {{ rate }}x
                          </button>
                        </div>
                      </div>
                    </div>
  
                    <!-- Mirror Mode -->
                    <button
                      @click="toggleMirror"
                      class="p-2 rounded-full hover:bg-white/10"
                      :class="{ 'text-blue-500': isMirrored, 'text-white': !isMirrored }"
                    >
                      <FlipHorizontal class="h-5 w-5" />
                    </button>
  
                    <!-- Camera Toggle -->
                    <button
                      @click="toggleCamera"
                      class="p-2 rounded-full hover:bg-white/10"
                      :class="{ 'text-blue-500': isCameraOn, 'text-white': !isCameraOn }"
                    >
                      <Camera class="h-5 w-5" />
                    </button>
  
                    <!-- Volume -->
                    <div class="flex items-center">
                      <button @click="toggleMute" class="p-2 text-white hover:bg-white/10 rounded-full">
                        <VolumeX v-if="isMuted" class="h-5 w-5" />
                        <Volume2 v-else-if="volume > 0.5" class="h-5 w-5" />
                        <Volume1 v-else-if="volume > 0" class="h-5 w-5" />
                        <Volume class="h-5 w-5" v-else />
                      </button>
                      <input 
                        type="range" 
                        min="0" 
                        max="1" 
                        step="0.01" 
                        v-model="volume" 
                        @input="updateVolume" 
                        class="w-20 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
  
                    <!-- Fullscreen -->
                    <button @click="toggleFullscreen" class="p-2 text-white hover:bg-white/10 rounded-full">
                      <Maximize class="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
  
            <!-- Course Content Tabs -->
            <div class="tabs-container">
              <div class="tabs-header mb-6">
                <button 
                  v-for="tab in tabs" 
                  :key="tab.id"
                  class="px-4 py-2 text-white border-b-2 mr-4"
                  :class="tab.id === activeTab ? 'border-blue-500' : 'border-transparent opacity-70'"
                  @click="activeTab = tab.id"
                >
                  {{ tab.label }}
                </button>
              </div>
              
              <!-- Overview Tab -->
              <div v-if="activeTab === 'overview'" class="glass-panel p-6 rounded-lg text-gray-300">
                <h3 class="text-xl font-semibold text-white mb-4">課程介紹</h3>
                <p class="mb-4">{{ course.description }}</p>
                
                <h4 class="text-lg font-semibold text-white mt-6 mb-2">學習目標</h4>
                <ul class="list-disc pl-5 space-y-1">
                  <li v-for="(item, index) in course.learningObjectives" :key="index">
                    {{ item }}
                  </li>
                </ul>
              </div>
              
              <!-- Lessons Tab -->
              <div v-if="activeTab === 'lessons'" class="glass-panel p-6 rounded-lg">
                <h3 class="text-xl font-semibold text-white mb-4">課程章節</h3>
                <div class="space-y-2">
                  <div
                    v-for="(lesson, index) in course.lessons"
                    :key="index"
                    class="flex items-center p-3 rounded-md hover:bg-white/10 cursor-pointer transition-colors"
                    @click="selectLesson(index)"
                  >
                    <span class="w-8 h-8 flex items-center justify-center rounded-full bg-blue-500 text-white mr-3">
                      {{ index + 1 }}
                    </span>
                    <div>
                      <h4 class="text-white font-medium">{{ lesson.title }}</h4>
                      <p class="text-sm text-gray-400">{{ lesson.duration }}</p>
                    </div>
                    <span class="ml-auto text-gray-400">
                      <Play v-if="currentLessonIndex === index" class="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </div>
              
              <!-- Notes Tab -->
              <div v-if="activeTab === 'notes'" class="glass-panel p-6 rounded-lg">
                <h3 class="text-xl font-semibold text-white mb-4">我的筆記</h3>
                <textarea
                  v-model="notes"
                  placeholder="在這裡記錄課程筆記..."
                  class="w-full h-40 p-3 bg-white/10 border border-gray-600 rounded-md text-white"
                ></textarea>
                <button 
                  @click="saveNotes" 
                  class="mt-4 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md"
                >
                  儲存筆記
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
  import { 
    BookOpen, History, Activity, User,
    Play, Pause, Rewind, FastForward,
    Volume, Volume1, Volume2, VolumeX,
    FlipHorizontal, Camera, Maximize, ChevronRight
  } from 'lucide-vue-next'
  
  // 側邊欄狀態
  const isSidebarCollapsed = ref(true)
  const toggleSidebar = () => {
    isSidebarCollapsed.value = !isSidebarCollapsed.value
  }
  
  // 課程資料 (韓舞課程)
  const course = ref({
    id: '1',
    title: '韓舞教學',
    instructor: '周逸凡 講師',
    level: 'beginner',
    videoUrl: '/videos/toobad.mp4', // 範例影片，實際使用時請替換
    description: '適合初學者的舞蹈入門課程，學習基本姿勢、動作和表現技巧。本課程將幫助您掌握韓舞的基本節奏、動作和風格，不需要任何舞蹈基礎，從零開始學習。',
    learningObjectives: [
      '掌握韓舞基本動作和姿勢',
      '理解韓舞的節奏和音樂感',
      '學習如何自信表演和展示動作',
      '完成一段完整的舞蹈編排'
    ],
    lessons: [
      { title: '入門與熱身', duration: '15 分鐘', videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4' },
      { title: '基本步伐與動作', duration: '25 分鐘', videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4' },
      { title: '上半身動作練習', duration: '20 分鐘', videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4' },
      { title: '動作組合訓練', duration: '30 分鐘', videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4' },
      { title: '整體編排與表演', duration: '25 分鐘', videoUrl: 'https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4' }
    ]
  })
  
  // 課程等級文本
  const levelText = computed(() => {
    switch (course.value.level) {
      case 'beginner': return '入門'
      case 'intermediate': return '中級'
      case 'advanced': return '高級'
      default: return '入門'
    }
  })
  
  // 標籤頁設定
  const tabs = [
    { id: 'overview', label: '課程概述' },
    { id: 'lessons', label: '課程章節' },
    { id: 'notes', label: '筆記' }
  ]
  const activeTab = ref('overview')
  
  // 影片播放器相關
  const videoPlayer = ref(null)
  const cameraFeed = ref(null)
  const isPlaying = ref(false)
  const isMuted = ref(false)
  const isMirrored = ref(false)
  const isCameraOn = ref(false)
  const volume = ref(1)
  const currentTime = ref(0)
  const duration = ref(0)
  const progress = ref(0)
  const playbackRate = ref(1.0)
  const showSpeedMenu = ref(false)
  const currentLessonIndex = ref(0)
  const notes = ref('')
  
  // 影片播放器功能
  function videoLoaded() {
    if (!videoPlayer.value) return
    duration.value = videoPlayer.value.duration
  }
  
  function updateProgress() {
    if (!videoPlayer.value) return
    currentTime.value = videoPlayer.value.currentTime
    progress.value = (currentTime.value / duration.value) * 100 || 0
  }
  
  function togglePlay() {
    if (!videoPlayer.value) return
    
    if (videoPlayer.value.paused) {
      videoPlayer.value.play()
        .then(() => { isPlaying.value = true })
        .catch(err => console.error('Play failed:', err))
    } else {
      videoPlayer.value.pause()
      isPlaying.value = false
    }
  }
  
  function skipForward() {
    if (!videoPlayer.value) return
    videoPlayer.value.currentTime += 5
  }
  
  function skipBackward() {
    if (!videoPlayer.value) return
    videoPlayer.value.currentTime -= 5
  }
  
  function seek(event) {
    if (!videoPlayer.value) return
    
    const target = event.target
    const rect = target.getBoundingClientRect()
    const percent = (event.clientX - rect.left) / rect.width
    videoPlayer.value.currentTime = percent * duration.value
  }
  
  function toggleMute() {
    if (!videoPlayer.value) return
    
    videoPlayer.value.muted = !videoPlayer.value.muted
    isMuted.value = videoPlayer.value.muted
  }
  
  function updateVolume() {
    if (!videoPlayer.value) return
    
    videoPlayer.value.volume = Number(volume.value)
    isMuted.value = Number(volume.value) === 0
  }
  
  function toggleMirror() {
    isMirrored.value = !isMirrored.value
  }
  
  function toggleSpeedMenu() {
    showSpeedMenu.value = !showSpeedMenu.value
  }
  
  function setPlaybackRate(rate) {
    if (!videoPlayer.value) return
    
    playbackRate.value = rate
    videoPlayer.value.playbackRate = rate
    showSpeedMenu.value = false
  }
  
  function toggleFullscreen() {
    if (!videoPlayer.value) return
    
    if (!document.fullscreenElement) {
      videoPlayer.value.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  }
  
  // 格式化時間為 mm:ss 格式
  function formatTime(seconds) {
    if (isNaN(seconds) || seconds === Infinity) return '00:00'
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }
  
  // 攝影機功能
  async function toggleCamera() {
    if (!isCameraOn.value) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true })
        if (cameraFeed.value) {
          cameraFeed.value.srcObject = stream
          isCameraOn.value = true
        }
      } catch (err) {
        console.error('Error accessing camera:', err)
        alert('無法訪問攝像頭。請確保已授予攝像頭訪問權限。')
      }
    } else {
      if (cameraFeed.value && cameraFeed.value.srcObject) {
        const tracks = cameraFeed.value.srcObject.getTracks()
        tracks.forEach(track => track.stop())
        cameraFeed.value.srcObject = null
        isCameraOn.value = false
      }
    }
  }
  
  // 課程章節選擇
  function selectLesson(index) {
    currentLessonIndex.value = index
    
    // 更新影片來源
    if (videoPlayer.value && course.value.lessons[index]) {
      const wasPlaying = !videoPlayer.value.paused
      videoPlayer.value.src = course.value.lessons[index].videoUrl
      videoPlayer.value.load()
      if (wasPlaying) {
        videoPlayer.value.play().then(() => {
          isPlaying.value = true
        }).catch(error => {
          console.error('Failed to play video:', error)
          isPlaying.value = false
        })
      }
    }
  }
  
  // 筆記功能
  function saveNotes() {
    localStorage.setItem(`notes_course_${course.value.id}`, notes.value)
    alert('筆記已儲存！')
  }
  
  // 鍵盤快捷鍵
  function handleKeydown(event) {
    if (event.target instanceof HTMLTextAreaElement) return
    
    switch (event.code) {
      case 'Space':
        togglePlay()
        event.preventDefault()
        break
      case 'ArrowRight':
        skipForward()
        event.preventDefault()
        break
      case 'ArrowLeft':
        skipBackward()
        event.preventDefault()
        break
      case 'KeyM':
        toggleMute()
        event.preventDefault()
        break
      case 'KeyF':
        toggleMirror()
        event.preventDefault()
        break
    }
  }
  
  // 生命週期鉤子
  onMounted(() => {
    // 載入儲存的筆記
    const savedNotes = localStorage.getItem(`notes_course_${course.value.id}`)
    if (savedNotes) {
      notes.value = savedNotes
    }
    
    // 添加鍵盤事件監聽器
    window.addEventListener('keydown', handleKeydown)
    
    // 點擊外部時關閉速度選單
    document.addEventListener('click', (e) => {
      if (showSpeedMenu.value) {
        showSpeedMenu.value = false
      }
    }, { capture: true })
  })
  
  onBeforeUnmount(() => {
    // 移除事件監聽器
    window.removeEventListener('keydown', handleKeydown)
    
    // 關閉攝影機（如果開啟）
    if (isCameraOn.value && cameraFeed.value?.srcObject) {
      const tracks = cameraFeed.value.srcObject.getTracks()
      tracks.forEach(track => track.stop())
    }
  })
  </script>
  
  <style scoped>
  .courses-container {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 24px;
    box-sizing: border-box;
  }
  
  .unity-background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
    background-color: #1a1a2e; /* 預設背景色 */
  }
  
  /* 玻璃容器樣式 */
  .glass-container {
    width: calc(100% - 48px);
    height: calc(100vh - 48px);
    margin: 0 auto;
    background: linear-gradient(116deg, rgba(255, 255, 255, 0.2) 33.48%, rgba(153, 153, 153, 0.2) 96.52%);
    backdrop-filter: blur(10px);
    border-radius: 12px;
    box-shadow: 0px 0px 20px 0px rgba(255, 255, 255, 0.5) inset;
    position: relative;
    z-index: 1;
    display: flex;
    overflow: hidden;
    max-width: 1872px;
  }
  
  .content-wrapper {
    display: flex;
    width: 100%;
    height: 100%;
  }
  
  /* 側邊欄樣式 */
  .sidebar {
    flex: 0 0 auto;
    height: 100%;
    transition: width 0.3s ease;
    z-index: 10;
  }
  
  .navbar {
    height: 100%;
    overflow: hidden;
    transition: width 0.3s ease;
    width: 52px; /* 摺疊時的寬度 */
  }
  
  .sidebar.open .navbar {
    width: 240px; /* 展開時的寬度 */
  }
  
  .navbar-inner {
    position: relative;
    height: 100%;
    width: 240px;
    overflow: hidden;
  }
  
  .sidebar-header {
    height: 60px;
    display: flex;
    align-items: center;
    width: 240px;
    padding: 0 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    white-space: nowrap;
    overflow: hidden;
  }
  
  .menu-btn {
    width: 30px;
    height: 30px;
    background: transparent;
    border: none;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0;
  }
  
  .hamburger {
    width: 20px;
    height: 20px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    transition: transform 0.3s ease;
  }
  
  .hamburger span {
    display: block;
    height: 2px;
    width: 100%;
    background-color: white;
    border-radius: 2px;
    transition: all 0.3s ease-in-out;
    transform-origin: center;
  }
  
  .hamburger.active span:nth-child(1) {
    transform: translateY(9px) rotate(45deg);
  }
  
  .hamburger.active span:nth-child(2) {
    opacity: 0;
  }
  
  .hamburger.active span:nth-child(3) {
    transform: translateY(-9px) rotate(-45deg);
  }
  
  .logo {
    color: white;
    font-weight: 600;
    margin-left: 15px;
    font-size: 16px;
    white-space: nowrap;
  }
  
  .menu {
    width: 240px;
    padding: 10px 0;
  }
  
  .menu-item {
    position: relative;
    width: 240px;
    cursor: pointer;
  }
  
  .menu-item.active {
    background: rgba(255, 255, 255, 0.1);
  }
  
  .menu-item-inner {
    padding: 15px 16px;
    display: flex;
    align-items: center;
    width: 240px;
    box-sizing: border-box;
  }
  
  .menu-icon {
    width: 20px;
    height: 20px;
    color: white;
    flex-shrink: 0;
  }
  
  .menu-title {
    margin-left: 15px;
    color: white;
    font-size: 14px;
    white-space: nowrap;
  }
  
  .menu-item:hover {
    background: rgba(255, 255, 255, 0.05);
  }
  
  /* 主內容區域樣式 */
  .main-content {
    flex: 1;
    padding: 24px;
    overflow-y: auto;
    height: 100%;
  }
  
  /* 玻璃面板樣式 */
  .glass-controls, .glass-panel {
    background: linear-gradient(116deg, rgba(255, 255, 255, 0.1) 33.48%, rgba(153, 153, 153, 0.1) 96.52%);
    backdrop-filter: blur(12px);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
  
  /* 響應式設計 */
  @media (max-width: 768px) {
    .content-wrapper {
      flex-direction: column;
    }
    
    .navbar {
      width: 100%;
      height: auto;
    }
    
    .sidebar.open .navbar {
      height: auto;
    }
    
    .navbar-inner {
      width: 100%;
    }
    
    .sidebar-header {
      width: 100%;
    }
    
    .menu-item {
      width: 100%;
    }
  }
  
  /* 自定義範圍輸入樣式 */
  input[type="range"] {
    -webkit-appearance: none;
    height: 4px;
    background: #4a5568;
    border-radius: 5px;
    background-size: 0% 100%;
    background-repeat: no-repeat;
  }
  
  input[type="range"]::-webkit-slider-thumb {
    -webkit-appearance: none;
    height: 12px;
    width: 12px;
    border-radius: 50%;
    background: #3b82f6;
    cursor: pointer;
  }
  
  /* 動畫效果 */
  @keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  .animate-fade-in {
    animation: fadeIn 0.3s ease;
  }
  </style>