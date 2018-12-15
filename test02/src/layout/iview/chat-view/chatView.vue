<template>
  <Card class="warp">
    <Row type="flex" justify="space-between" align="middle">
      <Col>
        <h4>聊天室</h4>
      </Col>
      <Col>
        <Button class="clearButton" @click="clearMessages" size="small">清空聊天</Button>
      </Col>
    </Row>

    <div class="chat" ref="chat">
      <Row type="flex" align="middle"  v-for="(msg,index) in messages" :key="`${index} + ${msg.user} `" class="line" :justify="msg.user === user ? `end`:`start`">
        <Col :order="msg.user === user ? 1 : 0">
          <Avatar style="color: #f56a00;background-color: #fde3cf">{{ msg.user }}</Avatar>
        </Col>
        <Col :order="msg.user === user ? 0 : 1">
          <span class="msg">{{msg.message}}</span>
        </Col>
      </Row>
    </div>
    <Input placeholder="输入些东西..." v-model="text" @on-enter="sendMessage">
       <Button slot="append" type="primary" @click="sendMessage">发送</Button>
    </Input>
  </Card>
</template>

<script>
import './chatView.less'
import io from 'socket.io-client'
import { getToken, getUser } from '@/lib/util'
const serverUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:80' : 'http://149.28.58.202:80'
export default {
  name: 'chatView',
  mounted() {
    this.socketStart()
    this.user = getUser()
    
    
    if (localStorage.getItem('messages')) {
      var msgs = JSON.parse(localStorage.getItem('messages'))
      this.messages = msgs
    } else {
      this.messages = []
    }
    this.$nextTick(() => {
      console.log('chat dom更新了');
      this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight
    })
  },
  destroyed() {
    console.log('离开chat');
    this.socket.close()
    localStorage.setItem('messages', JSON.stringify(this.messages))
  },
  data() {
    return {
      socket: null,
      messages: [],
      text: '',
      user: ''
    }
  },
  methods: {
    socketStart() {
      console.log(`init socket: ${getToken()}`);
      try {
        this.socket = io(serverUrl, {
          query: {
            token: getToken()
          }
        })

        this.socket.on('connect', function() {
        });

        this.socket.on('newMessage', function(data) {
          console.log(`${this.user} recevice message :`);
          console.log(data);
          this.messages.push(data);
          this.$nextTick(() => {
            console.log('chat dom更新了');
            this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight
          })
        }.bind(this));

        this.socket.on('disconnect', function() {

        });
      } catch (error) {
        console.log(error);
      }
    },
    sendMessage: function() {
      if (this.text !== '') {
        console.log(`server:${serverUrl} send message`);
        this.socket.emit('newMessage', { message: this.text })
        this.text = ''
      }
    },
    clearMessages () {
      console.log('clear');

      this.messages = []
    }
  }
}
</script>
