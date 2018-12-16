<template>
  <Card class="warp">
    <Row type="flex" justify="space-between" align="middle">
      <Col>
        <Tag type="dot" :color="tagColor">
          聊天室 <span>当前:{{ chatRoomUsersCount }}人</span>
        </Tag> 
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

const USER_ENTER_LEAV = 'userEnterOrLeave'
const LS_MESSAGES = 'messages'

export default {
  name: 'chatView',
  mounted() {
    this.socketStart()
    this.user = getUser()
    
    if (localStorage.getItem(LS_MESSAGES)) {
      var msgs = JSON.parse(localStorage.getItem(LS_MESSAGES))
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
  },
  data() {
    return {
      socket: null,
      messages: [],
      text: '',
      user: '',
      chatRoomUsersCount: 0,
      conState: false
    }
  },
  computed: {
    tagColor (){
      return this.conState ? 'success' : 'error'
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
          this.conState = true
        }.bind(this));

        this.socket.on(USER_ENTER_LEAV, function(data) {
          let tips = ''
          if (data.type === 0) {
            console.log(`进来 ${JSON.stringify(data)}`)
            
            tips = `${data.user} 进入聊天室`
          } else {
            console.log(`离开 ${JSON.stringify(data)}`)
            tips = `${data.user} 离开聊天室`
          }

          this.chatRoomUsersCount = data.count
          if (data.user !== this.user) {
            this.$Message.info({
              content: tips
            })
          }
        }.bind(this));

        this.socket.on('newMessage', function(data) {
          console.log(`${this.user} recevice message :`);
          console.log(data);
          this.messages.push(data);
          localStorage.setItem(LS_MESSAGES, JSON.stringify(this.messages))
          this.$nextTick(() => {
            console.log('chat dom更新了');
            console.log(`${this.chatRoomUsersCount}`)
            this.$refs.chat.scrollTop = this.$refs.chat.scrollHeight
          })
        }.bind(this));

        this.socket.on('disconnect', function() {
          this.conState = false
        }.bind(this));
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
