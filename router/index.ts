// router/index.ts
import { createRouter, createWebHistory } from 'vue-router';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      redirect: '/login'
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../pages/login.vue')
    },
    {
      path: '/admin',
      component: () => import('../layouts/AdminLayout.vue'),
      meta: { requiresAuth: true },
      children: [
        {
          path: '',
          redirect: '/admin/courses'
        },
        {
          path: 'courses',
          name: 'courses',
          component: () => import('../pages/admin/courses.vue')
        },
        {
          path: 'learning-history',
          name: 'learning-history',
          component: () => import('../pages/admin/LearningHistoryPage.vue')
        },
        {
          path: 'motion-analysis',
          name: 'motion-analysis',
          component: () => import('../pages/admin/MotionAnalysisPage.vue')
        },
        {
          path: 'user-management',
          name: 'user-management',
          component: () => import('../pages/admin/UserManagementPage.vue')
        }
      ]
    },
    {
      path: '/:pathMatch(.*)*',
      redirect: '/login'
    }
  ]
});

// 導航守衛
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('user');
  
  if (to.meta.requiresAuth && !isAuthenticated) {
    // 需要認證但未登入，重定向到登入頁面
    next('/login');
  } else if (to.path === '/login' && isAuthenticated) {
    // 已登入但嘗試訪問登入頁面，重定向到課程頁面
    next('/admin/courses');
  } else {
    // 其他情況正常導航
    next();
  }
});

export default router;