import Vue from 'vue'
import VueRouter from 'vue-router'

import HomeView from '../views/HomeView.vue'
import key_crawling from '../views/key_crawling.vue'

import eventAPI_homepage from '../views/eventAPI_homepage.vue'
import calendar from '../views/calendar.vue'
import adminpage from '../views/adminpage.vue'
import Login from '../views/Login.vue'


import Member from '../views/Member.vue'
import Subscribe from '../views/Subscribe.vue'

// 키워드 검색할때 쓰는 것
import keywordView from '../views/keywordView.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: HomeView
  },

  {
    path: '/keyword',
    name: 'key_Detail',
    component: keywordView
  },
  {
    // 와일드 카드인 *는 위에 경로들 외에 다른 경로로 들어가면 나오는 페이지
    path: '/eventCrawling',
    name: 'crawling',
    component: key_crawling
  },
  {
    path: '/eventAPI',
    name: 'apiHome',
    component: eventAPI_homepage
  },
  {
    path: '/calendar',
    name: 'calendar2',
    component: calendar
  },
  {
    path: '/adminpage',
    name: 'adminpage',
    component: adminpage,
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/member',
    name: 'Member',
    component: Member
  },
  {
    path: '/subscribe',
    name: 'Subscribe',
    component: Subscribe
  },



]



const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})




export default router
