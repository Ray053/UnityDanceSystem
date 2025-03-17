<template>
    <div class="courses-page">
      <div class="page-header">
        <div class="search-filter">
          <div class="search-box">
            <Search class="search-icon" />
            <input 
              type="text" 
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
            
            <Select v-model="sortOption">
              <SelectTrigger class="filter-select">
                <SelectValue placeholder="排序方式" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">最新上架</SelectItem>
                <SelectItem value="popular">最受歡迎</SelectItem>
                <SelectItem value="name-asc">名稱 A-Z</SelectItem>
                <SelectItem value="name-desc">名稱 Z-A</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Button class="add-course-btn">
          <Plus class="btn-icon" />
          新增課程
        </Button>
      </div>
      
      <div class="courses-grid">
        <Card v-for="course in filteredCourses" :key="course.id" class="course-card">
          <div class="course-image-container">
            <img :src="course.thumbnail" :alt="course.title" class="course-image" />
            <div class="course-level" :class="course.level">
              {{ getLevelText(course.level) }}
            </div>
          </div>
          
          <CardHeader>
            <CardTitle>{{ course.title }}</CardTitle>
            <CardDescription>{{ course.instructor }}</CardDescription>
          </CardHeader>
          
          <CardContent>
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
            <div class="course-tags">
              <Badge v-for="tag in course.tags" :key="tag" variant="secondary" class="course-tag">
                {{ tag }}
              </Badge>
            </div>
            <div class="card-actions">
              <Button variant="ghost" size="sm">
                <Pencil class="action-icon" />
                編輯
              </Button>
              <Button variant="ghost" size="sm">
                <Eye class="action-icon" />
                預覽
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
      
      <div v-if="filteredCourses.length === 0" class="no-courses">
        <div class="empty-state">
          <DatabaseIcon class="empty-icon" />
          <h3>找不到課程</h3>
          <p>沒有符合搜尋條件的課程。嘗試調整過濾條件或清除搜尋。</p>
          <Button @click="resetFilters">清除所有過濾</Button>
        </div>
      </div>
      
      <div class="pagination">
        <Button variant="outline" size="sm" class="pagination-btn" :disabled="currentPage === 1" @click="currentPage--">
          <ChevronLeft class="pagination-icon" />
          上一頁
        </Button>
        <span class="page-info">第 {{ currentPage }} 頁，共 {{ totalPages }} 頁</span>
        <Button variant="outline" size="sm" class="pagination-btn" :disabled="currentPage === totalPages" @click="currentPage++">
          下一頁
          <ChevronRight class="pagination-icon" />
        </Button>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed } from 'vue';
  import { 
    Search, 
    Clock, 
    Users, 
    Plus, 
    Pencil, 
    Eye, 
    ChevronLeft, 
    ChevronRight 
  } from 'lucide-vue-next';
  import { Database as DatabaseIcon } from 'lucide-vue-next';
  import { 
    Card, 
    CardHeader, 
    CardTitle, 
    CardDescription, 
    CardContent, 
    CardFooter 
  } from '@/components/ui/card';
  import { 
    Select, 
    SelectContent, 
    SelectItem, 
    SelectTrigger, 
    SelectValue 
  } from '@/components/ui/select';
  import { Button } from '@/components/ui/button';
  import { Badge } from '@/components/ui/badge';
  
  // 過濾選項
  const searchText = ref('');
  const selectedCategory = ref('all');
  const selectedLevel = ref('all');
  const sortOption = ref('newest');
  const currentPage = ref(1);
  const itemsPerPage = 8;
  
  // 課程數據
  const courses = ref([
    {
      id: 1,
      title: '現代舞入門基礎',
      description: '適合初學者的現代舞入門課程，學習基本姿勢、動作和表現技巧。',
      instructor: '李明儀 講師',
      level: 'beginner',
      category: 'dance',
      duration: '8 小時',
      studentsCount: 152,
      tags: ['現代舞', '基礎', '表演藝術'],
      thumbnail: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      createdAt: '2023-08-15'
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
      tags: ['芭蕾', '姿態', '基礎'],
      thumbnail: 'https://images.unsplash.com/photo-1546483875-ad9014c88eba?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1508&q=80',
      createdAt: '2023-07-20'
    },
    {
      id: 3,
      title: '嘻哈舞步進階',
      description: '適合已有嘻哈舞基礎的學生，學習更複雜的動作和組合。',
      instructor: '陳志豪 講師',
      level: 'intermediate',
      category: 'dance',
      duration: '12 小時',
      studentsCount: 78,
      tags: ['嘻哈', '街舞', '進階'],
      thumbnail: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      createdAt: '2023-09-05'
    },
    {
      id: 4,
      title: '瑜伽與身心平衡',
      description: '結合呼吸與體位法，提升身體柔軟度和心靈平靜。',
      instructor: '林靜怡 講師',
      level: 'beginner',
      category: 'yoga',
      duration: '6 小時',
      studentsCount: 215,
      tags: ['瑜伽', '冥想', '健康'],
      thumbnail: 'https://images.unsplash.com/photo-1575052814086-f385e2e2ad1b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      createdAt: '2023-06-30'
    },
    {
      id: 5,
      title: '功能性健身訓練',
      description: '透過多關節運動提升日常生活中的身體功能和表現。',
      instructor: '張健銘 講師',
      level: 'intermediate',
      category: 'fitness',
      duration: '9 小時',
      studentsCount: 132,
      tags: ['健身', '功能性', '肌力'],
      thumbnail: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      createdAt: '2023-08-22'
    },
    {
      id: 6,
      title: '太極拳基礎',
      description: '學習太極拳的基本動作和呼吸技巧，提升身體協調性和平衡感。',
      instructor: '吳大維 講師',
      level: 'beginner',
      category: 'martial-arts',
      duration: '7 小時',
      studentsCount: 65,
      tags: ['太極', '武術', '平衡'],
      thumbnail: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1398&q=80',
      createdAt: '2023-07-10'
    },
    {
      id: 7,
      title: '拉丁舞專業課程',
      description: '包含恰恰、倫巴、森巴等多種拉丁舞種，適合想挑戰自我的舞者。',
      instructor: '孫美玲 講師',
      level: 'advanced',
      category: 'dance',
      duration: '15 小時',
      studentsCount: 42,
      tags: ['拉丁舞', '專業', '表演'],
      thumbnail: 'https://images.unsplash.com/photo-1504609813442-a9924e2e9c5c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      createdAt: '2023-09-15'
    },
    {
      id: 8,
      title: '高強度間歇訓練',
      description: '透過短時間高強度運動提升心肺功能和燃燒脂肪。',
      instructor: '黃偉誠 講師',
      level: 'advanced',
      category: 'fitness',
      duration: '5 小時',
      studentsCount: 187,
      tags: ['HIIT', '燃脂', '心肺'],
      thumbnail: 'https://images.unsplash.com/photo-1549060279-7e168fcee0c2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      createdAt: '2023-08-05'
    },
    {
      id: 9,
      title: '冥想與正念練習',
      description: '學習各種冥想技巧，培養正念感知和壓力管理能力。',
      instructor: '謝雅芳 講師',
      level: 'beginner',
      category: 'yoga',
      duration: '4 小時',
      studentsCount: 95,
      tags: ['冥想', '正念', '壓力管理'],
      thumbnail: 'https://images.unsplash.com/photo-1536623975707-c4b3b2af565d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80',
      createdAt: '2023-07-25'
    },
    {
      id: 10,
      title: '武術與自我防衛',
      description: '結合多種武術技巧，學習實用的自我防衛方法。',
      instructor: '劉志強 講師',
      level: 'intermediate',
      category: 'martial-arts',
      duration: '11 小時',
      studentsCount: 74,
      tags: ['武術', '自我防衛', '技巧'],
      thumbnail: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1447&q=80',
      createdAt: '2023-09-01'
    }
  ]);
  
  // 過濾和排序課程
  const filteredCourses = computed(() => {
    // 應用過濾條件
    let result = courses.value.filter(course => {
      // 搜尋文字
      const searchMatch = !searchText.value || 
        course.title.toLowerCase().includes(searchText.value.toLowerCase()) ||
        course.description.toLowerCase().includes(searchText.value.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchText.value.toLowerCase());
      
      // 類別過濾
      const categoryMatch = selectedCategory.value === 'all' || course.category === selectedCategory.value;
      
      // 難度過濾
      const levelMatch = selectedLevel.value === 'all' || course.level === selectedLevel.value;
      
      return searchMatch && categoryMatch && levelMatch;
    });
    
    // 應用排序
    switch (sortOption.value) {
      case 'newest':
        result = result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
      case 'popular':
        result = result.sort((a, b) => b.studentsCount - a.studentsCount);
        break;
      case 'name-asc':
        result = result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'name-desc':
        result = result.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }
    
    return result;
  });
  
  // 分頁計算
  const totalItems = computed(() => filteredCourses.value.length);
  const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage));
  const displayedCourses = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredCourses.value.slice(start, end);
  });
  
  // 重置過濾器
  const resetFilters = () => {
    searchText.value = '';
    selectedCategory.value = 'all';
    selectedLevel.value = 'all';
    sortOption.value = 'newest';
    currentPage.value = 1;
  };
  
  // 轉換難度等級文字
  const getLevelText = (level: string) => {
    switch (level) {
      case 'beginner': return '入門';
      case 'intermediate': return '中級';
      case 'advanced': return '高級';
      default: return '全部等級';
    }
  };
  </script>
  
  <style src="@/assets/css/courses.css"></style>