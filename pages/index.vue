<script setup lang="ts">
import {
    CircleUser,
    File,
    Home,
    LineChart,
    ListFilter,
    MoreHorizontal,
    Package,
    Package2,
    PanelLeft,
    PlusCircle,
    Search,
    Settings,
    ShoppingCart,
    Users2,
} from 'lucide-vue-next'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { Input } from '@/components/ui/input'
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table'
import {
    Tabs,
    TabsContent,
    TabsList,
    TabsTrigger,
} from '@/components/ui/tabs'
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from '@/components/ui/tooltip'
import { Icon } from '@iconify/vue'
const colorMode = useColorMode()

import { useRouter } from 'vue-router'

const router = useRouter()

// 頁面加載時重定向到登入頁面
onMounted(() => {
  navigateTo('/login');
});

// 或者使用 Nuxt 的中間件進行重定向
definePageMeta({
  middleware: [
    function() {
      return navigateTo('/login');
    }
  ]
});
</script>

<template>
   <div>
    <!-- 此頁面不會顯示，因為它會立即重定向 -->
    <p>正在導向登入頁面...</p>
  </div>
</template>