<template>
  <div class="courses-container">
    <!-- Unity Background (This would be your Unity WebGL canvas) -->
    <div class="unity-background">
      <!-- Unity canvas would be mounted here -->
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
                <div class="menu-item" :class="{ 'active': activeMenu === 'courses' }" @click="setActiveMenu('courses')">
                  <div class="menu-item-inner">
                    <BookOpen class="menu-icon" />
                    <span class="menu-title">課程介紹</span>
                  </div>
                </div>
                
                <div class="menu-item" :class="{ 'active': activeMenu === 'history' }" @click="setActiveMenu('history')">
                  <div class="menu-item-inner">
                    <History class="menu-icon" />
                    <span class="menu-title">學習歷程</span>
                  </div>
                </div>
                
                <div class="menu-item" :class="{ 'active': activeMenu === 'analysis' }" @click="setActiveMenu('analysis')">
                  <div class="menu-item-inner">
                    <Activity class="menu-icon" />
                    <span class="menu-title">動作分析</span>
                  </div>
                </div>
                
                <div class="menu-item" :class="{ 'active': activeMenu === 'user' }" @click="setActiveMenu('user')">
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
          <div class="content-header">
            <h1 class="content-title">課程介紹</h1>
            <p class="content-description">探索各種運動課程並開始您的學習之旅</p>
          </div>
          
          <!-- Search and Filter Section -->
          <div class="search-filter">
            <div class="search-box">
              <Search class="search-icon" />
              <Input 
                placeholder="搜尋課程..." 
                v-model="searchText"
                class="search-input"
              />
            </div>
            <div class="filters">
              <Select v-model="selectedCategory">
                <SelectTrigger class="filter-select">
                  <SelectValue placeholder="課程類別" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部類別</SelectItem>
                  <SelectItem value="dance">舞蹈</SelectItem>
                  <SelectItem value="fitness">健身</SelectItem>
                  <SelectItem value="yoga">瑜伽</SelectItem>
                  <SelectItem value="martial-arts">武術</SelectItem>
                </SelectContent>
              </Select>
              
              <Select v-model="selectedLevel">
                <SelectTrigger class="filter-select">
                  <SelectValue placeholder="難度等級" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部等級</SelectItem>
                  <SelectItem value="beginner">初學者</SelectItem>
                  <SelectItem value="intermediate">中級</SelectItem>
                  <SelectItem value="advanced">高級</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <!-- Course Grid -->
          <div class="courses-grid">
            <Card v-for="course in courses" :key="course.id" class="course-card">
              <div class="course-image-container">
                <img :src="course.thumbnail" :alt="course.title" class="course-image" />
                <Badge class="course-level" :variant="getLevelVariant(course.level)">
                  {{ getLevelText(course.level) }}
                </Badge>
              </div>
              
              <CardContent>
                <h3 class="course-title">{{ course.title }}</h3>
                <p class="course-instructor">{{ course.instructor }}</p>
                <p class="course-description">{{ course.description }}</p>
                <div class="course-meta">
                  <div class="meta-item">
                    <Clock class="meta-icon" />
                    <span>{{ course.duration }}</span>
                  </div>
                  <div class="meta-item">
                    <Users class="meta-icon" />
                    <span>{{ course.studentsCount }}+ 學生</span>
                  </div>
                </div>
              </CardContent>
              
              <CardFooter>
                <!-- 針對第一個課程（韓舞教學）添加導航功能 -->
                <Button 
                  class="enroll-btn" 
                  @click="goToCourseDetail(course.id)"
                >
                  開始學習
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { 
  Search, 
  BookOpen,
  History, 
  Activity,
  User,
  Clock, 
  Users
} from 'lucide-vue-next'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

// 使用 router 進行導航
const router = useRouter()

// Sidebar state
const isSidebarCollapsed = ref(true)
const activeMenu = ref('courses')

const toggleSidebar = () => {
  isSidebarCollapsed.value = !isSidebarCollapsed.value
}

const setActiveMenu = (menu: string) => {
  activeMenu.value = menu
}

// 導航到課程詳情頁面
const goToCourseDetail = (courseId: number) => {
  router.push(`/courses/${courseId}`)
}

// Course filtering
const searchText = ref('')
const selectedCategory = ref('all')
const selectedLevel = ref('all')

// Sample courses data
const courses = ref([
  {
    id: 1,
    title: '韓舞教學',
    description: '適合初學者的舞蹈入門課程，學習基本姿勢、動作和表現技巧。',
    instructor: '周逸凡 講師',
    level: 'beginner',
    category: 'dance',
    duration: '8 小時',
    studentsCount: 152,
    thumbnail: '/image/toobad.jpg',
  },
  {
    id: 2,
    title: '芭蕾基礎技巧',
    description: '學習芭蕾舞的五個基本位置和手位，培養優雅的姿態和平衡感。',
    instructor: '王美玲 講師',
    level: 'beginner',
    category: 'dance',
    duration: '10 小時',
    studentsCount: 98,
    thumbnail: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1508&q=80',
  },
  {
    id: 3,
    title: '瑜伽與身心平衡',
    description: '結合呼吸與體位法，提升身體柔軟度和心靈平靜。',
    instructor: '林靜怡 講師',
    level: 'beginner',
    category: 'yoga',
    duration: '6 小時',
    studentsCount: 215,
    thumbnail: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
  {
    id: 4,
    title: '功能性健身訓練',
    description: '透過多關節運動提升日常生活中的身體功能和表現。',
    instructor: '張健銘 講師',
    level: 'intermediate',
    category: 'fitness',
    duration: '9 小時',
    studentsCount: 132,
    thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
  },
])

// Helper functions
const getLevelText = (level: string) => {
  switch (level) {
    case 'beginner': return '入門'
    case 'intermediate': return '中級'
    case 'advanced': return '高級'
    default: return '全部等級'
  }
}

const getLevelVariant = (level: string) => {
  switch (level) {
    case 'beginner': return 'default'
    case 'intermediate': return 'secondary'
    case 'advanced': return 'destructive'
    default: return 'outline'
  }
}
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
  background-color: #1a1a2e; /* Fallback if Unity not loaded */
}

/* Glass Container for All Content */
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
  max-width: 1872px; /* Allows for very large screens while maintaining some padding */
}

.content-wrapper {
  display: flex;
  width: 100%;
  height: 100%;
}

/* Sidebar Styles */
.sidebar {
  flex: 0 0 auto; /* 不伸縮，保持原始大小 */
  height: 100%;
  transition: width 0.3s ease;
  z-index: 10;
}

.navbar {
  height: 100%;
  /* background: rgba(26, 26, 46, 0.9); */
  overflow: hidden;
  transition: width 0.3s ease;
  width: 52px; /* 摺疊時的寬度 */
}

.sidebar.open .navbar {
  width: 240px; /* 展開時的寬度 */
}

/* 側邊欄展開時，主內容區域左側內邊距調整 */
.sidebar.open ~ .main-content {
  padding-left: 264px; /* 240px navbar width + 24px padding */
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

/* Main Content Styles */
.main-content {
  flex: 1;
  padding: 24px;
  overflow-y: auto;
  height: 100%;
  transition: padding-left 0.3s ease;
}

/* Content Header */
.content-header {
  margin-bottom: 24px;
}

.content-title {
  font-size: 24px;
  font-weight: 600;
  color: #fff;
  margin-bottom: 8px;
}

.content-description {
  font-size: 16px;
  color: rgba(255, 255, 255, 0.8);
}

/* Search and Filter Section */
.search-filter {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-bottom: 24px;
}

.search-box {
  position: relative;
  flex: 1;
  min-width: 200px;
}

.search-icon {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
  width: 18px;
  height: 18px;
}

.search-input {
  padding-left: 36px;
}

.filters {
  display: flex;
  gap: 12px;
}

.filter-select {
  min-width: 140px;
}

/* Course Grid */
.courses-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 24px;
  margin-top: 24px;
}

.course-card {
  overflow: hidden;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.course-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
}

.course-image-container {
  position: relative;
  height: 160px;
  overflow: hidden;
}

.course-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.course-card:hover .course-image {
  transform: scale(1.05);
}

.course-level {
  position: absolute;
  top: 10px;
  right: 10px;
}

.course-title {
  font-size: 18px;
  font-weight: 600;
  margin-bottom: 4px;
  color: #fff;
}

.course-instructor {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.8);
  margin-bottom: 12px;
}

.course-description {
  font-size: 14px;
  color: rgba(255, 255, 255, 0.7);
  margin-bottom: 16px;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.course-meta {
  display: flex;
  gap: 16px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.6);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.meta-icon {
  width: 16px;
  height: 16px;
}

.enroll-btn {
  width: 100%;
}

/* Responsive Adjustments */
@media (max-width: 1200px) {
  .glass-container {
    width: 95%;
    height: 90vh;
  }
}

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
  
  .search-filter {
    flex-direction: column;
  }
  
  .courses-grid {
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
  }
  
  /* 響應式時調整側邊欄展開後的主內容區域 */
  .sidebar.open ~ .main-content {
    padding-left: 24px;
  }
}
</style>