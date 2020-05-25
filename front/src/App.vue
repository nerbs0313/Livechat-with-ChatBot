<template>
  <div id="app">  
    <Login v-if = "getLoginok == false && getSigok == true"  />
    <HelloWorld v-if = "getLoginok == true" />
    <Sig v-if = "getSigok == false"/>
  </div>
</template>

<script>
import Login from './components/Login.vue'
import HelloWorld from './components/HelloWorld.vue'
import Sig from './components/Sig.vue'
import {mapGetters} from 'vuex'

export default {
  name: 'app',
  data(){
    return{
      //check : this.$store.state.loginok
    }
  },
  components: {
    HelloWorld,
    Sig,
    Login
  },
  computed:{
    ...mapGetters({
      getLoginok : 'getLoginok',
      getSigok : 'getSigok'
    })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin:0;
}
</style>
