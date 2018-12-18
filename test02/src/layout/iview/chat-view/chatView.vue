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
          <p v-html="msg.message.replace(/\#[\u4E00-\u9FA5]{1,3}\;/gi, emotion)" class="msg"></p>
        </Col>
      </Row>
    </div>
    <!-- <ButtonGroup> -->
      <CheckboxGroup v-model="theContacts">@ 
        <Checkbox v-for="(user,index) in contacts" :key="index" :label="user.name"></Checkbox>
      </CheckboxGroup>

      <Row type="flex" justify="space-between" :gutter="20">
        <Col span="20">
          <Input placeholder="输入些东西..." v-model="text" @on-enter="sendMessage" @on-change="change">
          
          <Poptip placement="top" width="400" slot="append">
              <Button><Icon type="ios-outlet" size="20" /></Button>
                <emotion :height="200" @emotion="handleEmotion" slot="content"></emotion>
            </Poptip>
          </Input>
        </Col>
        <Col span="2">
          <Button type="primary" @click="sendMessage">发送</Button>
        </Col>
        <Col span="2">
          <Button type="primary" @click="sendMessageDingDing">钉钉</Button>
        </Col>
      </Row>
      
      
    <!-- </ButtonGroup> -->
    
    
    
  </Card>
</template>

<script>
import './chatView.less'
import Emotion from '_c/emotion'
import io from 'socket.io-client'
import axios from 'axios'
import { getToken, getUser } from '@/lib/util'
const serverUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:80' : 'http://149.28.58.202:80'
const dingdingUrl = process.env.NODE_ENV === 'development' ? '/ding/robot/send?access_token=c36a71fce0a28ed3b9b3c85a93a34845534c92a6cad1d4b3ee6409ad7366dac5' : 'ding/robot/send?access_token=c36a71fce0a28ed3b9b3c85a93a34845534c92a6cad1d4b3ee6409ad7366dac5'

const USER_ENTER_LEAV = 'userEnterOrLeave'
const LS_MESSAGES = 'messages'

export default {
  name: 'chatView',
  components: { Emotion },
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
      conState: false,
      contacts: [
        {
          name: '莹莹',
          number: 15812450271
        },
        {
          name: '罗桂梅',
          number: 13725274502
        },
        {
          name: '霍工',
          number: 15975322483
        },
        {
          name: 'cgb',
          number: 18122752153
        }
        ],
        theContacts: []
    }
  },
  computed: {
    tagColor (){
      return this.conState ? 'success' : 'error'
    }
  },
  methods: {
    emotion (res) {
      let word = res.replace(/\#|\;/gi,'')
      const list = ['微笑', '撇嘴', '色', '发呆', '得意', '流泪', '害羞', '闭嘴', '睡', '大哭', '尴尬', '发怒', '调皮', '呲牙', '惊讶', '难过', '酷', '冷汗', '抓狂', '吐', '偷笑', '可爱', '白眼', '傲慢', '饥饿', '困', '惊恐', '流汗', '憨笑', '大兵', '奋斗', '咒骂', '疑问', '嘘', '晕', '折磨', '衰', '骷髅', '敲打', '再见', '擦汗', '抠鼻', '鼓掌', '糗大了', '坏笑', '左哼哼', '右哼哼', '哈欠', '鄙视', '委屈', '快哭了', '阴险', '亲亲', '吓', '可怜', '菜刀', '西瓜', '啤酒', '篮球', '乒乓', '咖啡', '饭', '猪头', '玫瑰', '凋谢', '示爱', '爱心', '心碎', '蛋糕', '闪电', '炸弹', '刀', '足球', '瓢虫', '便便', '月亮', '太阳', '礼物', '拥抱', '强', '弱', '握手', '胜利', '抱拳', '勾引', '拳头', '差劲', '爱你', 'NO', 'OK', '爱情', '飞吻', '跳跳', '发抖', '怄火', '转圈', '磕头', '回头', '跳绳', '挥手', '激动', '街舞', '献吻', '左太极', '右太极']
      let index = list.indexOf(word)
      return `<img src="https://res.wx.qq.com/mpres/htmledition/images/icon/emotion/${index}.gif" align="middle">`   
    },
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
    sendMessageDingDing () {
      let to = this.contacts.filter(user => {
        console.log(user.name);
        console.log(this.theContacts.indexOf(user.name));
        
        return this.theContacts.indexOf(user.name) >= 0
      }).map( user => {
        return user.number
      })
      console.log(to);
      
      let data = {
          'msgtype': 'text', 
          'text': {
              'content': this.text
          },
          'at': {
            'atMobiles': to,
            'isAtAll': false
          }
      }
      axios.post(dingdingUrl, data ,
      {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        this.text = ''
      }).catch(err => {
        this.$Message.error({
          content: `发送失败 ${err}`
        })
      })
    },
    clearMessages () {
      console.log('clear');

      this.messages = []
    },
    handleEmotion(emoji) {
      this.text += emoji
    },
    change(e) {
      console.log(e);
      if (e === '@') {
        
      }
      
    }
  }
}
</script>
