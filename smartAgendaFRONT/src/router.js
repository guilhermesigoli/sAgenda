import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/views/login/Login.vue'
import Acessar from '@/views/login/Acessar.vue'
import Registrar from '@/views/login/Registrar.vue'
import Main from '@/views/main/Main.vue'
import VisaoGeral from '@/views/main/VisaoGeral.vue'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: "/",
      redirect: "/login"
    },
    {
      path: '/login',
      name: 'Login',
      component: Login,
      redirect: '/login/acessar',
      children:[
        {
            path: 'acessar',
            name: 'Acessar',
            component: Acessar
        },
        {
            path: 'registrar',
            name: 'registrar',
            component: Registrar
        },
      ]
    },
    {
        path: '/main',
        name: 'Main',
        component: Main,
        redirect: '/main/visaogeral',
        children: [
          {
            path: 'visaogeral',
            name: 'VisaoGeral',
            component: VisaoGeral
          },
        ]
    },
]
})