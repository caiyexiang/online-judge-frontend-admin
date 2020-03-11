import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'
import Empty from '@/layout/empty'
import { PERMISSION_ENUM } from '@/utils/constant'
const { ADMIN, TEACHER, ASSISTANT, STUDENT } = PERMISSION_ENUM

export const constantRoutes = [
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index'),
      },
    ],
  },
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true,
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true,
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true,
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard' },
      },
    ],
  },
  {
    path: '/profile',
    component: Layout,
    redirect: '/profile/index',
    hidden: true,
    children: [
      {
        path: 'index',
        component: () => import('@/views/profile/index'),
        name: 'Profile',
        meta: { title: '用户资料', icon: 'user' },
      },
    ],
  },
]

export const asyncRoutes = [
  {
    path: '/log',
    component: Layout,
    meta: {
      permission: ADMIN,
    },
    redirect: '/log/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/log/index'),
        name: 'Log',
        meta: { title: '日志', icon: 'log' },
      },
    ],
  },

  {
    path: '/problem-select',
    component: Layout,
    redirect: '/problem-select/index',
    meta: {
      permission: TEACHER,
      title: '添加问题',
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/contest/problem-select'),
        name: 'ProblemSelect',
      },
    ],
    hidden: true,
  },

  {
    path: '/announcement',
    component: Layout,
    meta: {
      permission: ADMIN,
    },
    redirect: '/announcement/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/announcement/index'),
        name: 'Announcement',
        meta: { title: '公告', icon: 'announcement' },
      },
    ],
  },

  {
    path: '/user',
    component: Layout,
    redirect: '/user/student',
    meta: {
      permission: TEACHER,
      icon: 'user',
      title: '用户管理',
    },
    children: [
      {
        path: 'student',
        component: () => import('@/views/user/index'),
        name: 'Student',
        meta: { title: '学生管理', permission: TEACHER, icon: 'student' },
      },
      {
        path: 'assistant',
        component: () => import('@/views/user/assistant'),
        name: 'Assistant',
        meta: { title: '助教管理', permission: TEACHER, icon: 'assistant' },
      },
      {
        path: 'teacher',
        component: () => import('@/views/user/index'),
        name: 'Teacher',
        meta: { title: '教师管理', permission: ADMIN, icon: 'teacher' },
      },
      {
        path: 'admin',
        component: () => import('@/views/user/index'),
        name: 'Admin',
        meta: { title: '管理员管理', permission: ADMIN, icon: 'admin' },
      },
    ],
  },

  {
    path: '/problem',
    component: Layout,
    redirect: '/problem/index',
    meta: {
      permission: TEACHER,
      title: '题库',
      icon: 'problem',
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/problem/index'),
        name: 'Problem',
        meta: { title: '题库' },
      },
      {
        path: 'choice/:id(\\d+)',
        component: () => import('@/views/problem/choice-detail'),
        name: 'EditChoice',
        meta: { title: '选择题详情' },
        hidden: true,
      },
      {
        path: 'choice/add',
        component: () => import('@/views/problem/choice-detail'),
        name: 'AddChoice',
        meta: { title: '新增选择题' },
        hidden: true,
      },
      {
        path: 'fill-in/:id(\\d+)',
        component: () => import('@/views/problem/fill-in-detail'),
        name: 'EditFillIn',
        meta: { title: '填空题详情' },
        hidden: true,
      },
      {
        path: 'fill-in/add',
        component: () => import('@/views/problem/fill-in-detail'),
        name: 'AddFillIn',
        meta: { title: '新增填空题' },
        hidden: true,
      },
      {
        path: 'qa/:id(\\d+)',
        component: () => import('@/views/problem/qa-detail'),
        name: 'EditQA',
        meta: { title: '问答题详情' },
        hidden: true,
      },
      {
        path: 'qa/add',
        component: () => import('@/views/problem/qa-detail'),
        name: 'AddQA',
        meta: { title: '新增问答题' },
        hidden: true,
      },
      {
        path: 'coding/:id(\\d+)',
        component: () => import('@/views/problem/coding-detail'),
        name: 'EditCoding',
        meta: { title: '编程题详情' },
        hidden: true,
      },
      {
        path: 'coding/add',
        component: () => import('@/views/problem/coding-detail'),
        name: 'AddCoding',
        meta: { title: '新增编程题' },
        hidden: true,
      },
      {
        path: 'code-fill/:id(\\d+)',
        component: () => import('@/views/problem/code-fill-detail'),
        name: 'EditCodeFill',
        meta: { title: '代码补全题详情' },
        hidden: true,
      },
      {
        path: 'code-fill/add',
        component: () => import('@/views/problem/code-fill-detail'),
        name: 'AddCodeFill',
        meta: { title: '新增代码补全题' },
        hidden: true,
      },
    ],
  },

  {
    path: '/course',
    component: Layout,
    redirect: '/course/index',
    meta: {
      permission: TEACHER,
      icon: 'course',
      title: '课程',
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/course/index'),
        name: 'Course',
        meta: { title: '课程管理', permission: ADMIN, icon: 'course' },
      },
      {
        path: 'group',
        component: () => import('@/views/group/index'),
        name: 'Group',
        meta: { title: '班级管理', icon: 'group', permission: TEACHER },
      },
      {
        path: 'tag',
        component: () => import('@/views/tag/index'),
        name: 'Tag',
        meta: { title: '知识点管理', icon: 'tag', permission: TEACHER },
      },
    ],
  },

  {
    path: '/exam-mode',
    component: Layout,
    meta: {
      permission: ADMIN,
    },
    redirect: '/exam-mode/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/exam-mode/index'),
        name: 'ExamMode',
        meta: { title: '考试模式', icon: 'exam' },
      },
    ],
  },

  {
    path: '/judger',
    component: Layout,
    meta: {
      permission: ADMIN,
    },
    redirect: '/judger/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/judger/index'),
        name: 'Judger',
        meta: { title: '判题机状态', icon: 'judger' },
      },
    ],
  },

  {
    path: '/code-check',
    component: Layout,
    meta: {
      permission: TEACHER,
      title: '代码查重',
      icon: 'search',
    },
    redirect: '/code-check/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/code-check/index'),
        name: 'CodeCheck',
        meta: { title: '代码查重' },
      },
      {
        path: 'task-log/:id(\\d+)',
        hidden: true,
        component: () => import('@/views/code-check/task-log'),
        name: 'TaskLog',
        meta: { title: '任务结果' },
      },
    ],
  },

  {
    path: '/contest',
    component: Layout,
    redirect: '/contest/index',
    meta: {
      permission: ASSISTANT,
      title: '测验',
      icon: 'contest',
    },
    children: [
      {
        path: 'index',
        component: () => import('@/views/contest/index'),
        name: 'Contest',
        meta: { permission: ASSISTANT, title: '测验管理', icon: 'contest' },
      },
      {
        path: ':id(\\d+)',
        component: () => import('@/views/contest/detail'),
        name: 'EditContest',
        meta: { title: '测验详情', permission: TEACHER },
        hidden: true,
      },
      {
        path: 'add',
        component: () => import('@/views/contest/detail'),
        name: 'AddContest',
        meta: { title: '新增测验', permission: TEACHER },
        hidden: true,
      },
      {
        path: ':contest(\\d+)/review',
        component: Empty,
        redirect: 'index',
        meta: { title: '批阅列表' },
        hidden: true,
        children: [
          {
            path: 'index',
            component: () => import('@/views/contest/review/index'),
            name: 'Review',
            hidden: true,
          },
          {
            path: ':submission(\\d+)',
            component: () => import('@/views/contest/review/detail'),
            name: 'EditReview',
            meta: { title: '学生测验成绩批阅' },
            hidden: true,
          },
        ],
      },
      {
        path: 'template',
        component: Empty,
        redirect: '/contest/template/index',
        meta: { title: '测验模版', permission: TEACHER, icon: 'template' },
        children: [
          {
            path: 'index',
            component: () => import('@/views/contest/template'),
            name: 'Template',
          },
          {
            path: 'add',
            component: () => import('@/views/contest/detail'),
            name: 'AddTemplate',
            meta: { title: '添加测验模版' },
            hidden: true,
          },
          {
            path: ':id(\\d+)',
            component: () => import('@/views/contest/detail'),
            name: 'EditTemplate',
            meta: { title: '测验模版详情' },
            hidden: true,
          },
        ],
      },
    ],
  },

  {
    path: '/oj',
    component: Layout,
    children: [
      {
        path: `${document.location.protocol}//${document.location.host}/`,
        meta: { title: '前往OJ首页', icon: 'link' },
      },
    ],
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true },
]

const createRouter = () =>
  new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes,
  })

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
