const express = require('express');
const fs = require('fs');
const app = express();
//////////////////////////////////////////////////////
var mysql = require('mysql');
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'apmsetup',
    database: 'Handsome'
});

connection.connect();
//////////////////////////////////////////////////////

// connection.query('SELECT * from song', function(err, rows, fields) {
//     if(!err) {
//         console.log('The solution is: ', rows);
//     }
//     else {
//         console.log('Error while performing Query.', err);
//     }
// });

//connection.end();

var port = process.env.PORT || 3000;

const server = app.listen(port, function () {
    console.log('Listening on port *: ' + port);
})

const io = require('socket.io')(server);
const dialogflow = require("dialogflow");
const keyFile = JSON.parse(fs.readFileSync("key.json"));
var Nickname = new Array();
var Typing = new Array();

const projectId = keyFile["project_id"];
const privateKey = keyFile["private_key"];
const clientEmail = keyFile["client_email"];

console.log(projectId, privateKey, clientEmail);
// Instantiates a session client
let config = {
    credentials: {
        private_key: privateKey,
        client_email: clientEmail
    }
};
const sessionClient = new dialogflow.SessionsClient(config);

app.use(express.static('dist'));

io.on('connection', (socket) => {
    console.log(socket.client.id); // Prints client socket id
    socket.emit('Hello', {
        message: "환영합니다. 사용하실 닉네임을 입력해주세요."
    });
    socket.on('nickname', (data) => {
        socket.broadcast.emit('nickname', (data));

    });
    socket.on('set-name', (data) => {
        Nickname.push({
            id: socket.client.id,
            name: data.name
        });
        io.emit('enter', (data));
    });
    socket.on('chat-message', async data => {
        // io.emit("chat-message", data);
        if (data.message.includes('/')) { await tryDF(data.message); }
        //await tryDF(data.message);
    });
    async function tryDF(data) {
        let response = await detectIntent(projectId, socket.client.id, data, "ko-KR");//123~ 세션아이디  ko-KR 언어
        // console.log("response:" + response.queryResult.fulfillmentText);
        // console.log(response.queryResult.action);
        if (response.queryResult.queryText.includes("오전")) {
            io.emit("chat-message", {
                message: "bot: 오전이네요! 출근 준비는 다 하셨나요?"
            });
        }
        else if (response.queryResult.queryText.includes("오후")) {
            io.emit("chat-message", {
                message: "bot: 오후시간 피곤하지만 화이팅!"
            });
        }
        else if (response.queryResult.queryText.includes("아침")) {
            io.emit("chat-message", {
                message: "bot: 아침일찍 일어나셨네요! 아침밥은 꼭 먹어요!"
            });
        }
        else if (response.queryResult.queryText.includes("새벽")) {
            io.emit("chat-message", {
                message: "bot: 늦은 새벽 아직 안 주무시고 뭐해요?"
            });
        }
        else if (response.queryResult.queryText.includes("밤")) {
            io.emit("chat-message", {
                message: "bot: 저녁은 드셨나요? 오늘 하루도 수고했어요!"
            });
        }
        // console.log(response.queryResult.queryText);
        // console.log(response.queryResult.allRequiredParamsPresent);
        // console.log(response.queryResult.outputContexts);

        // let payload = response.queryResult.fulfillmentMessages.find(elem=>{return elem.message==='payload'});
        // if (payload){console.log(payload.payload.fields.hint.stringValue);}
        else {
            io.emit("chat-message", {
                message: "bot: " + response.queryResult.fulfillmentText
            });
        }
    }
    socket.on('chat-message', data => {
        socket.broadcast.emit('chat-message', (data));
        if (data.message.indexOf("봇 이름이 뭐야?") != -1) {
            socket.emit('botname', {
                sender: data.sender,
                type: "name"
            });
        }
        if (data.message.indexOf("채팅방에 누가 있어?") != -1) {
            socket.emit('UserList', {
                List: Nickname,
                count: 0
            });
        }
        if (data.message.indexOf("봇 지금 몇시야?") != -1) {
            socket.emit("NowTime", {
                sender: data.sender,
                type: "time"
            });
        }
    });
    //////////////////////////////////////////////////////
    socket.on("loginCheck", (data) => {
        connection.query(data.query, [data.id], function (err, result, fields) {
            if (!err) {
                console.log('The solution is: ', result);
                socket.emit("login_succeed", {
                    res: result
                })
            }
            else {
                console.log('Error while performing Query.', err);
                socket.emit("login_failed", {
                    err: err
                })
            }
        });
    })
    socket.on("signupCheck", (data) => {
        var values = [
            [data.id, data.password, data.nickname]
        ]
        connection.query(data.query, [values], function (err, result) {
            if (!err) {
                socket.emit("signup_succeed", {
                    res: result
                });
            }
            else {
                console.log('Error while performing Query.', err);
                socket.emit("signup_failed", {
                    err: err
                });
            }
        })
    })
    //////////////////////////////////////////////////////
    socket.on('typing', (data) => {
        socket.broadcast.emit('typing', (data));
        // if(data.entered != 0) {
        //     var exist = 0;
        //     for(var key in Typing) {
        //         if(Typing[key].name == data.name) {
        //             exist = 1;
        //         }
        //     }
        //     if(exist == 0) {
        //         Typing.push({
        //             name: data.name
        //         })
        //     }
        //     socket.broadcast.emit('typing', {
        //         Typing: Typing
        //     })
        // }
    });
    socket.on('stopTyping', () => {
        socket.broadcast.emit('stopTyping');
    })
    // socket.on('stopTyping', (data) => {
    //     for(var key in Typing) {
    //         if(Typing[key].name == data.name) {
    //             socket.broadcast.emit('stopTyping');
    //         }
    //         delete Typing[key];
    //         break;
    //     }
    // });
    socket.on('disconnect', () => {
        console.log(socket.client.id);
        for (var key in Nickname) {
            console.log(Nickname[key]);
            if (Nickname[key].id == socket.client.id) {
                socket.broadcast.emit('exit', {
                    name: Nickname[key].name
                });
                delete Nickname[key];
                break;
            }
        }
    });
});
async function detectIntent(projectId, sessionId, query, languageCode) {
    // The path to identify the agent that owns the created intent.
    const sessionPath = sessionClient.sessionPath(projectId, sessionId);
  
    // The text query request.
    const request = {
      session: sessionPath,
      queryInput: {
        text: {
          text: query,
          languageCode: languageCode
        }
      }
    };
  
    // if (contexts && contexts.length > 0) {
    //   request.queryParams = {
    //     contexts: contexts,
    //   };
    // }
  
    const responses = await sessionClient.detectIntent(request);
    return responses[0];
  }