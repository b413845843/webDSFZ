<template>
  <Card class="warp">
    <Row>
      <span>聊天室</span>
      <Button class="clearButton" @click="clearMessages">清空聊天</Button>
    </Row>
    
    <div class="chat">
      <div v-for="msg in messages" class="line">
        <Avatar style="color: #f56a00;background-color: #fde3cf">{{ msg.user }}</Avatar>
        <span class="msg">{{msg.message}}</span>
      </div>
    </div>
    <Input placeholder="输入些东西..." v-model="text" @on-enter="sendMessage">
       <Button slot="append" type="primary" @click="sendMessage">发送</Button>
    </Input>
  </Card>
</template>

<script>
import './chatView.less'
import io from 'socket.io-client'
const serverUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:80' : 'http://149.28.58.202:80'
export default {
  name: 'chatView',
  mounted() {
    this.socketStart()
  },
  data() {
    return {
      socket: null,
      messages: [],
      text: ''
    }
  },
  destroyed() {
    console.log('离开chat');
    this.socket.close()
  },
  methods: {
    socketStart() {
      console.log('init socket');
      try {
        this.socket = io(serverUrl, {
          query: {
            token: this.$store.getters.token
          }
        })

        this.socket.on('connect', function() {
          
        });

        this.socket.on('newMessage', function(data) {
          console.log(`recevice message :`);
          console.log(data);
          this.messages.push(data)
        }.bind(this));

        this.socket.on('disconnect', function() {

        });
      } catch (error) {
        console.log(error);
      }
    },
    sendMessage: function() {
      if (this.text !== '') {
        console.log(`server:${serverUrl} ${this.$store.getters.user} send message`);
        this.socket.emit('newMessage', { message: this.text })
        this.text = ''
      }
    },
    clearMessages (){
      console.log('clear');

      this.messages = []
    }
  }
}
</script>
