import Vue from 'vue'
import Vuex from 'vuex'
import LoginService from "@/services/LoginService.js"

Vue.use(Vuex)

const loginService = new LoginService();

const state = {
  user: {},
  token: ''
}


const mutations ={
  setUser(state, value){
      state.user = value;
  },
  setToken(state, value){
    state.token = value;
  }
}

const actions = {
    setUser(context, payload){
        context.commit('setUser', payload);
    },
    setToken(context, payload){
        context.commit('setToken', payload);
    },
    async login(context, payload){
        return await loginService.login(payload).then(response => {
            context.dispatch('setUser', response.data.username);
            context.dispatch('setToken', response.data.token);
            return response.status;
        }).catch(error => {
            return error
        })
    }
}

export default new Vuex.Store({
  state: state,
  mutations: mutations,
  actions: actions
})