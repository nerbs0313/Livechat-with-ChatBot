<template>
  <div>
    <header>
      <h1 @click="this.EmptyBtn">[HANDSOME CHAT]</h1>
      <!-- <h2 v-if="typing === 0">.</h2> -->
      <h2 v-if="typing === 1"> {{typingname}} is typing </h2>
    </header>
    <div>
      <div>
        <ul id="chatList" class="list-group list-group-flush">
          <!-- Message loop -->
          <li id="messageLi" class="list-group-item" v-for="message in messages" :key="message.id">
            <span
              :class="{'float-right':message.allign === 0,'float-left':message.allign === 1, 'float-center':message.allign === 2}"
            >{{message.message}}</span>
          </li>
        </ul>
        <div>
          <!-- <head></head> -->
          <!-- <FileHome v-show="this.btn_on"></FileHome> -->
          <!-- <button @click="this.OnBtn">{{btnName}}</button> -->
          <!-- <router-link to="/newV" tag="button">newVue</router-link> -->
        </div>
      </div>
    </div>
    <form @submit.prevent="send">
      <!-- Prevent default event for submit, execute send method instead-->
      <div>
        <input
          type="text"
          class="form-control"
          placeholder="Enter message here"
          v-model="newMessage"
        />
        <!-- binding with newMessage variable -->
      </div>
    </form>
  </div>
</template>

<script>
import io from 'socket.io-client';
// import axios from 'axios';
// import FileHome from "@/components/FileHome";

export default {
  //   name: "HelloWorld",
  //   components: {
  //     FileHome
  //   },

  data: function() {
    // data
    return {
      messages: [],
      //   btnName: "btnOn",
      //   btn_on: false,
      newMessage: null,
      name: "임시",
      entered: 0,
      socket: io("localhost:3000"), // socket connection to server
      typing: 0,
      res: null,
      typingname: "",
      test: '바람이 불어오는 곳',
      nickname:""
    };
  },

  created() {
    this.socket.on("nickname", data => {
     this.nickname = data.nickname
    })
    // created callback of vue instance
    this.socket.on("Hello", data => {
      this.messages.push({
        message: data.message,
        allign: 2 // 0: 오른쪽 정렬 , 1: 왼쪽 정렬 , 2 : 가운데 정렬
      });
    });
    this.socket.on("botname", data => {
      if (data.type == "name") {
        this.messages.push({
          message: "안녕 난 11조 chatbot 핸섬가이야!",
          allign: 2
        });
      }
    });
    this.socket.on("NowTime", data => {
      if (data.type == "time") {
        var date = new Date();
        var hours = date.getHours();
        if (6 <= hours && hours <= 9) {
          this.messages.push({
            message:
              "지금은 " +
              date.getHours() +
              "시 입니다. 일찍 일어나는 새가 벌레를 잡는법이죠!",
            allign: 2
          });
        }
        if (10 <= hours && hours <= 13) {
          this.messages.push({
            message:
              "지금은 " +
              date.getHours() +
              "시 입니다. 점심먹기 좋은 시간이네요!",
            allign: 2
          });
        }
        if (14 <= hours && hours <= 17) {
          this.messages.push({
            message:
              "지금은 " +
              date.getHours() +
              "시 입니다. 밥 먹고 졸리지만! 오후 작업도 화이팅!",
            allign: 2
          });
        }
        if (18 <= hours && hours <= 21) {
          this.messages.push({
            message:
              "지금은 " +
              date.getHours() +
              "시 입니다. 수고했으니깐 저녁은 술 한잔과 함께.",
            allign: 2
          });
        }
        if ((22 <= hours && hours <= 24) || (0 <= hours && hours <= 1)) {
          this.messages.push({
            message:
              "지금은 " +
              date.getHours() +
              "시 입니다. 오늘 하루도 수고했어요 푹 쉬어요",
            allign: 2
          });
        }
        if (2 <= hours && hours <= 5) {
          this.messages.push({
            message:
              "지금은 " +
              date.getHours() +
              "시 입니다. 아직도 안자고 뭐해요? 좀 자요!",
            allign: 2
          });
        }
      }
    });
    this.socket.on("UserList", data => {
      this.messages.push({
        message : "채팅방에 있는 사람 목록",
        allign: 2
        });
      for (var key in data.List) {
        if (data.List[key].name != undefined) {
          data.count++;
          this.messages.push({
            message: data.count + ". " + data.List[key].name,
            allign: 2
          });
        }
      }
    });
    this.socket.on("enter", data => {
      this.messages.push({
        message: data.name + "님이 입장하셨습니다.",
        allign: 2
      });
    });
    this.socket.on("chat-message", data => {
      // when "chat-message" comes from the server
      console.log("msg received from server");
      this.messages.push({
        message: data.message,
        allign: 1
      });
    });
    this.socket.on("exit", data => {
      this.messages.push({
        message: data.name + "님이 퇴장하셨습니다.",
        allign: 2
      });
    });
   this.socket.on("typing", data => {
      if (this.typing == 0) {
         this.typing = 1
      }
      // var temp = "";
      // var count = 0;
      // for(var key in data.Typing) {
      //     if(data.Typing[key].name != undefined && data.Typing[key].name != data.name) {
      //         if(temp == "") {
      //             temp = data.Typing[key].name;
      //             count++;
      //         }
      //         else {
      //             temp = temp + ", " + data.Typing[key].name;
      //             count++;
      //         }
      //     }
      // }
      // if(count > 2) {
      //     temp = count + "명의 사용자가 입력중입니다.";
      // }
      this.typingname = data.name
 
    
    });
    this.socket.on("stopTyping", () => {
      // this.newMessage = "";
      this.typing = 0;
    });

    this.socket.on("dbtest-res", (data) => {
      this.messages.push({
        message: data.res[0].name,
        allign: 2
      });
    })
    this.socket.on("insert-res", (data) => {
      this.messages.push({
        message: data.res,
        allign: 2
      });
    })
  },

  // 'User is typing' function
  watch: {
    newMessage(value) {
      value
        ? this.socket.emit("typing", {
            name: this.name ,
            typing: this.typing,
            entered: this.entered
          })
        : this.socket.emit("stopTyping", {
          name: this.name,
          entered: this.entered
        });
    }
  },

  methods: {
    send() {
      // implementation of send method for vue instance
      this.messages.push({
        message: this.newMessage,
        allign: 0
      });
      if (this.entered == 0) {
        this.socket.emit("set-name", {
          name: this.nickname
        });
        this.name = this.nickname;
        this.entered = 1;
      } 
      else {
        this.socket.emit("chat-message", {
          message: this.name + ": " + this.newMessage
        });
        //////////////////////////////////////////////////////
        this.socket.emit("dbtest-message", {
          query: "SELECT * FROM song WHERE name=?",
          params: this.test
        });
        this.socket.emit("insert-message", {
          query: "INSERT INTO song VALUES ?",
          name: "TestName3",
          singer: "TestSinger3",
          number: 10003,
          favorite: 93
        });
        //////////////////////////////////////////////////////
      }
      this.newMessage = "";
    },    

    // login() {
    //   axios.get('http://localhost:3000/users')
    //   .then((response) => {
    //     this.res = response.data[0]
    //   })
    //   this.messages.push("testing " + this.res);
    // },

    // signup() {
    //   var inputdata = {
    //       id: 'TempId222',
    //       password: 'TempPW222',
    //       nickname: 'TempNick222'
    //   };
    //   axios.post('http://localhost:3000/users', inputdata)
    //   .then((response) => {
    //     this.res = response.data
    //   })
    //   if(this.res["result"] == 1) {
    //     alert("회원가입에 성공했습니다");
    //   }
    //   else if(this.res["result"] == 0) {
    //     alert("회원가입에 실패했습니다");
    //   }
    //   else {
    //     alert("Unknown Error");
    //   }
    // },
    
    EmptyBtn() {
      this.messages = [];
    }
    // OnBtn() {
    //   this.btn_on = !this.btn_on;
    //   if (this.btn_on) {
    //     this.btnName = "btnOff";
    //   } else {
    //     this.btnName = "btnOn";
    //   }
    // }
  },
  updated() {
    var container = this.$el.querySelector("#chatList");
    container.scrollTop = container.scrollHeight;
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped="scoped">
@import url(//fonts.googleapis.com/earlyaccess/nanumpenscript.css);
ul {
  height: 90vh;
  /* padding: 0; */
  overflow-y: auto;
  background-color: #808080;
}

li {
  list-style: none;
  background-color: #808080;
  border: none;
  /* margin: 1%; */
  /* padding: 1%; */
  font-size: 45px;
  color: bisque;
  font-family: "Nanum Pen Script", cursive;
}
input {
  position: fixed;
  bottom: 0;
  background-color: #f5f5dc;
}
header {
  padding-bottom: 0.00045cm;
  background-color: bisque;
  width: 100vw;
  font-family: "Nanum Pen Script", cursive;
  margin: 0;
}

@media screen and (max-width: 600px) {
  li {
    list-style: none;
    background-color: #808080;
    border: none;
    /* margin: 1%; */
    /* padding: 1%; */
    font-size: 25px;
    color: bisque;
    font-family: "Nanum Pen Script", cursive;
  }

}
  @media screen and (max-height: 600px) {
  ul {
    height: 78vh;
    /* padding: 0; */
    overflow-y: auto;
    background-color: #808080;
  }
}
@media screen and (max-width: 375px) {
  li {
    list-style: none;
    background-color: #808080;
    border: none;
    /* margin: 1%; */
    /* padding: 1%; */
    font-size: 25px;
    color: bisque;
    font-family: "Nanum Pen Script", cursive;
  }
    ul {
    height: 86vh;
    /* padding: 0; */
    overflow-y: auto;
    background-color: #808080;
  }

}

  @media screen and (max-height: 600px) {
  ul {
    height: 78vh;
    /* padding: 0; */
    overflow-y: auto;
    background-color: #808080;
  }
}
  @media screen and (min-height: 731px) and (min-width: 411px) {
  ul {
    height: 87.5vh;
    /* padding: 0; */
    overflow-y: auto;
    background-color: #808080;
  }

}

  @media screen and (min-height: 823px) and (min-width: 411px) {
  ul {
    height: 88.6vh;
    /* padding: 0; */
    overflow-y: auto;
    background-color: #808080;
  }

}

  @media screen and (min-height: 568px) and (min-width: 320px) {
  ul {
    height: 83.5vh;
    /* padding: 0; */
    overflow-y: auto;
    background-color: #808080;
  }

}
  @media screen and (min-height: 667px) and (min-width: 375px) {
  ul {
    height: 86vh;
    /* padding: 0; */
    overflow-y: auto;
    background-color: #808080;
  }

}
  @media screen and (min-height: 736px) and (min-width: 414px) {
  ul {
    height: 87.5vh;
    /* padding: 0; */
    overflow-y: auto;
    background-color: #808080;
  }

}
  @media screen and (min-height: 812px) and (min-width: 375px) {
  ul {
    height: 90.5vh;
    /* padding: 0; */
    overflow-y: auto;
    background-color: #808080;
  }

}
  @media screen and (min-height: 1024px) and (min-width: 768px) {
  ul {
    height: 90.7vh;
    /* padding: 0; */
    overflow-y: auto;
    background-color: #808080;
  }

}

  @media screen and (min-height: 1366px) and (min-width: 1024px) {
  ul {
    height: 93.2vh;
    /* padding: 0; */
    overflow-y: auto;
    background-color: #808080;
  }

}
</style>