<template>
  <div id="main">
    <header id="head">Sign Up</header>
    <div id="second">
      <form @submit="onSubmit">
        <input placeholder="Enter your Name" v-model="uname" />
        <br />
        <br />
        <input placeholder="Enter your ID" v-model="uid" />
        <br />
        <br />
        <input placeholder="Enter your password" v-model="password" />
        <br />
        <br />
        <button type="submit" @click="this.signUpCheck">Sign Up</button>
      </form>
    </div>
  </div>
</template>

<script>
import io from "socket.io-client";
import { mapMutations } from "vuex";

export default {
  name: "Sig",
  data: () => ({
    socket: io("localhost:3000"),
    uid: "",
    password: "",
    uname: ""
  }),
  // created() {
  //   this.socket.on("signup_succeed", () => {
  //     alert("회원가입에 성공했습니다.")
  //     this.BackToLogin()
  //     this.sinsuccess()
  //   })
  //   this.socket.on("signup_failed", (data) => {
  //     alert("Error가 발생했습니다.\n"+data.err.errno)
  //   })
  // },
  methods: {
    ...mapMutations({
      sigokreturnlog : 'sigokreturnlog'
    }),
    signUpCheck() {
      if (this.uid != "" && this.password != "" && this.uname) {
        this.socket.emit("signupCheck", {
          query: "INSERT INTO userlist VALUES ?",
          id: this.uid,
          password: this.password,
          nickname: this.uname
        });
        // this.sigokreturnlog()
      } else {
        alert("빈칸이 존재합니다.");
      }
    },
    created() {
      this.socket.on("signup_succeed", () => {
        alert("회원가입에 성공했습니다.");
        this.sigokreturnlog()
      });
      this.socket.on("signup_failed", data => {
        alert("Error가 발생했습니다.\n" + data.err.errno);
      });
    },
    // BackToLogin() {
    //   this.$router.push({ path: "/" }); //회원가입 완료
    // }
  }
};
</script>

<style lang="scss" scoped>
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
#second {
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
</style>