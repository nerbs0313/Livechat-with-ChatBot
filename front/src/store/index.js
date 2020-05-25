import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export const store = new Vuex.Store({
    state:{
        loginok : false,
        sigok: true
    },
    mutations: {
        loginsuccess(state){
            state.loginok = true
        },
        sigsuccess(state){
            state.sigok = false
        },
        sigokreturnlog(state){
            state.sigok = true
        }
    },
    getters:{
        getLoginok(state){
            return state.loginok
        },
        getSigok(state){
            return state.sigok
        }
    }
})
// export default new Vuex.Store({
//     state:{
//         loginok: false,
//         sigok: true
//     },
//     mutations: {
//         loginsuccess(state){
//             state.loginok = true
//         },
//         sinsuccess(state){
//             state.sigok = false
//         }
//     }
// })