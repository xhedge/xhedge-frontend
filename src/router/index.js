import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import Create from '../views/Create.vue'
import MyTokens from '../views/MyTokens.vue'
import Operate from '../views/Operate.vue'
import Validators from '../views/Validators.vue'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/create',
    name: 'Create',
    component: Create
  },
  {
    path: '/mytokens',
    name: 'MyTokens',
    component: MyTokens
  },
  {
    path: '/operate',
    name: 'Operate',
    component: Operate
  },
  {
    path: '/validators',
    name: 'Validators',
    component: Validators
  }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

export default router
