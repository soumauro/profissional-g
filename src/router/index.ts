import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
    meta: { requiresAuth: true }
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/login',
    name: 'login',
    component: () => import(/* webpackChunkName: "about" */ '../views/login.vue')
  },
  {
    path: '/landpage',
    name: 'LandingPage',
    component: () => import(/* webpackChunkName: "about" */ '../views/LandingPage.vue')
  },
  {
    path: '/questionsview/:uuid',
    name: 'QuestionsView',
    component: () => import(/* webpackChunkName: "about" */ '../views/QuestionsView.vue'),
    props:true
  },
  {
    path: '/questionsview2/:uuid',
    name: 'QuestionsView2',
    component: () => import(/* webpackChunkName: "about" */ '../views/questionviewantigas.vue'),
    props:true
  },
  {
    path: '/exame/:uuid',
    name: 'exameuser',
    component: () => import(/* webpackChunkName: "about" */ '../views/makeexame.vue'),
    props:true,
    meta: { requiresAuth: true }
  },
  {
    path: '/exames2/:uuid',
    name: 'exameuser2',
    component: () => import(/* webpackChunkName: "about" */ '../views/makeexame2.vue'),
    props:true,
    meta: { requiresAuth: true }
  },
  {
    path: '/review/:uuid',
    name: "ReviewPage",
    component: () => import(/* webpackChunkName: "about" */ '../views/makereview.vue'),
    props:true,
    meta: { requiresAuth: true }
  },
  {
    path: '/reviewew/:uuid',
    name: "ReviewPage2",
    component: () => import(/* webpackChunkName: "about" */ '../views/makereview2.vue'),
    props:true,
    meta: { requiresAuth: true }
  },
  {
    path: '/examesadmin',
    name: 'exames',
    component: () => import( '../views/exames.vue')
  },
  {
    path: '/examesadmin2',
    name: "ExamesView_a",
    component: () => import( '../views/exames_a.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
