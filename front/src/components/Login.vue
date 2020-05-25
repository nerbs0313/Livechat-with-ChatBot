<template>
  <div id="mainDiv">
    <header id="head">Log In</header>
    <div id="secondDiv">
      <form @submit="onSubmit">
        <br />
        <input placeholder="Enter your ID" v-model="uid" />
        <br />
        <br />
        <input placeholder="Enter your password" v-model="password" />
        <br />
        <br />
        <button type="submit" @click="this.loginCheck">Login</button>
        <button type="submit" @click="this.MoveToSignup">Sign up</button>
      </form>
    </div>
  </div>
</template>

<script>

import io from 'socket.io-client';
import { mapMutations } from 'vuex'
export default {
  name: "Login",
  data: () => ({
    socket: io("localhost:3000"),
    uid: "",
    password: "",
  }),
  created() {
    this.socket.on("login_succeed", (data) => {
      this.login(data.res[0])
    })
    this.socket.on("login_failed", (data) => {
      alert("Error가 발생했습니다."+data.err.errno)
    })
  },

  methods: {
    ...mapMutations({
      loginsuccess : 'loginsuccess',
      sigsuccess : 'sigsuccess'
    }),
    onSubmit() {
      console.log(this.uid);
      console.log(this.password);
    },
    loginCheck() {
      if(this.uid != "" && this.password != "") {
        this.socket.emit("loginCheck", {
          query: 'SELECT * from Userlist WHERE id=?',
          id: this.uid        
        })
        this.loginsuccess()
      }
      else {
        alert("빈칸이 존재합니다.")
      }
    },
    login(data) {
      if(data.id == this.uid && data.password == this.password) {
        alert("로그인에 성공했습니다.\n환영합니다 "+data.nickname+"님")
        // this.MoveToChatroom()
        this.socket.emit("nickname",{
          nickname : data.nickname
        })
      }
      else {
        alert("아이디 또는 비밀번호가 틀렸습니다.")
      }
    },
    // MoveToChatroom() {
    //   this.$router.push({ path: "/HelloWorld" });
    // },
    MoveToSignup() {
      this.sigsuccess()
    }
  }
};
</script>

<style scoped="scoped">
@import url(//fonts.googleapis.com/earlyaccess/nanumpenscript.css);
#head {
  background-color: #f29886;
  width: 100vw;
  font-family: "Nanum Pen Script", cursive;
  font-size: 50px;
  border-radius: 2%;
  left: 0;
  width: 100%;
  height: 20%;
}
#secondDiv {
  font-family: "Nanum Pen Script", cursive;
  background-color: bisque;
  padding-top: 5%;
  padding-bottom: 20%;
  width: 100vw;
  height: 92vh;
  font-family: "Nanum Pen Script", cursive;
  border-radius: 0%;
}

input {
  border-radius: 400%;
  text-align: center;
  width: 300px;
}

button {
  background-color: #f5f5cd;
  border-radius: 10%;
  transition-duration: 0.4s;
}

button:hover {
  background-color: #008cba;
  color: white;
}

/* @media screen and (min-height: 512px) {
  #secondDiv {
    height: 50vh;
    
  }
} */
</style>