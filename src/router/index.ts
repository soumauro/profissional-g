import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },
  {
    path: '/about',
    name: 'about',
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
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
    path: '/exame/:uuid',
    name: 'exameuser',
    component: () => import(/* webpackChunkName: "about" */ '../views/makeexame.vue'),
    props:true
  },
  {
    path: '/examesadmin',
    name: 'exames',
    component: () => import( '../views/exames.vue')
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
