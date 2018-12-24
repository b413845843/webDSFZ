<template>
  <Card>
    <Card>
      <p slot="title">个人资料</p>
      <p> id:{{info.id}} name:{{info.name}} mail:{{info.email}}</p>
    </Card>
    
    <Card class="card">
      <p slot="title">可添加好友用户</p>
      <Row style="margin:4px" v-for="friend in friends" align="middle">
        <Col span="2">
          <span style="padding:4px"> id:{{friend.id}}</span>
        </Col> 
        <Col span="4">
          <span style="padding:4px"> {{friend.name}} </span>
        </Col> 
      </Row>
      <Input v-model="addWho" placeholder="输入想要添加的好友id..." number @on-enter="makeFriend"></Input>
      <Button @click="makeFriend">添加好友</Button>
    </Card>
   
    <Card class="card">
      <p slot="title">当前好友</p>
       <Row style="margin:4px" v-for="(friend, index) in oldFriends" type="flex"  justify="space-between" align="middle">
      <Col span="4">
        <span style="padding:4px">{{friend.name}}</span>
      </Col> 
      <Col span="4">
        <Button type="error" style="float:right"  @click="deleteFriend(index)">删除</Button>
      </Col> 
    </Row>
    </Card>

   <Divider></Divider>
   <Card>
     <p slot="title">添加打印机</p>
     <Input v-model="printer.number" placeholder="输入想要添加序列号..." number @on-enter="addPrinter"></Input>
     <Input v-model="printer.name" placeholder="名字" @on-enter="addPrinter"></Input>
      <Button @click="addPrinter">添加打印机</Button>
   </Card>

  <Card class="card">
      <p slot="title">当前打印机</p>
       <Row style="margin:4px" v-for="(printer, index) in printers" type="flex"  justify="space-between" align="middle">
      <Col span="10">
        <span style="padding:4px">{{printer.name}} number:{{printer.number}}</span>
      </Col> 
      <Col span="4">
        <Button type="error" style="float:right"  @click="deletePrinter(index)">删除</Button>
      </Col> 
    </Row>
  </Card>

  <Divider>组</Divider>
   <Card>
     <p slot="title">添加组</p>
     <Input v-model="group.name" placeholder="名字" @on-enter="addGroup"></Input>
      <Button @click="addGroup">添加组</Button>
   </Card>

  <Card class="card">
      <p slot="title">当前组</p>
       <Row style="margin:4px" v-for="(group, index) in groups" type="flex"  justify="space-between" align="middle">
      <Col span="10">
        <span style="padding:4px">{{group.name}}</span>
      </Col> 
      <Col span="4">
        <Button type="error" style="float:right"  @click="deleteGroup(index)">删除</Button>
      </Col> 
    </Row>
  </Card>

  <Divider>所在组</Divider>
  <Card class="card">
      <p slot="title">所在组</p>
      <div  v-for="(group, index) in owngroups">
        <Row style="margin:4px">
          <Col>
            <span style="padding:4px">{{group.name}}</span>
          </Col> 
        </Row>
        <Row :gutter="4">
          <Col span="14">
            <Input v-model="group.userName" placeholder="输入想要添加组员名称..." number @on-enter="addUserToGroup(index)"></Input>
          </Col>
          <Col span="3"> <Button type="success" style="width:100%;" @click="addUserToGroup(index)">添加组员</Button></Col>
          <Col span="3"><Button type="success" style="width:100%;" @click="getUsersByGroup(index)">查看组员</Button></Col>
        </Row>
        <Row :gutter="4" style="margin-top:4px;">
          <Col span="14">
            <Input v-model="group.number" placeholder="输入想要添加打印机序列号..." number @on-enter="addPrinterToGroup(index)"></Input>
          </Col>
          <Col span="3"><Button type="success" style="width:100%;"  @click="addPrinterToGroup(index)">添加打印机</Button></Col>
          <Col span="3"><Button type="success" style="width:100%;" @click="getPrintersByGroup(index)">查看打印机</Button></Col>
        </Row>
      </div>
     
  </Card>

  </Card>
</template>

<script>
import './userInfoView.less'
import Tables from '@/layout/iview/component/tables'
import userService from '@/api/user.js'

export default {
  name: 'userInfoView',
  components: { Tables },
  mounted() {
    this.fetchData()
  },
  data() {
    return {
      groupAddUserNmae: '',
      groupAddPrinterrNmae: '',
      users: [],
      printers: [],
      groups: [],
      owngroups: [],
      friends: [],
      addWho: null,
      info: {},
      oldFriends: [],
      printer: {
        name: '',
        number: ''
      },
      group: {
        name: ''
      }
    }
  },
  methods: {
    fetchData() {
      userService.getUserInfo().then(res => {
        console.log(res.data)
        this.info = res.data.user
        this.oldFriends = res.data.friends
      }).catch(err => {
        this.$Message.error({
          content: `个人信息获取失败 ${err}`
        })
      })

      userService.getAllUsers().then(res => {
        this.friends = res.data.users
        console.log(this.friends)
      }).catch(err => {
        this.$Message.error({
          content: `全部用户获取失败 ${err}`
        })
      })

      userService.getAllPrinters().then(res => {
        this.printers = res.data.printers
        console.log(this.printers)
      }).catch(err => {
        this.$Message.error({
          content: `全部打印机获取失败 ${err}`
        })
      })

      userService.getAllGroups().then(res => {
        this.groups = res.data.groups
        console.log(this.groups)
      })

      userService.getAllOwnGroups().then(res => {
        res.data.groups.map(g => {
          g.userName = ''
          g.number = ''
          return g
        })
        this.owngroups = res.data.groups
        console.log(this.groups)
      })
    },
    makeFriend() {
      if (this.addWho !== '') {
        const uid = this.info.id
        const fid = this.addWho
        console.log(`uid:${uid} fid:${fid}`)
        userService.makeFriend(uid, fid).then(res => {
          this.$Message.info({
            content: res.data.message
          })
          this.fetchData()
        }).catch(err => {
          this.$Message.error({
            content: `添加好友失败 ${err}`
          })
        })
      }
    },
    deleteFriend(index) {
      console.log(index)
      const uid = this.info.id
      const fid = this.oldFriends[index]['id']

       userService.deleteFriend(uid, fid).then(res => {
          this.$Message.info({
            content: res.data.message
          })
          this.fetchData()
        }).catch(err => {
          this.$Message.error({
            content: `删除好友失败 ${err}`
          })
        })
    },
    addPrinter() {
      this.printer.mid = this.info.id
      userService.addPrinter(this.printer).then(res => {
          this.$Message.info({
            content: res.data.message
          })
          this.fetchData()
        }).catch(err => {
          this.$Message.error({
            content: `添加打印机失败 ${err}`
          })
        })
    },
    deletePrinter(index) {
      console.log(index)
      let p = this.printers[index]
       userService.deletePrinter(p).then(res => {
          this.$Message.info({
            content: res.data.message
          })
          this.fetchData()
        }).catch(err => {
          this.$Message.error({
            content: `删除打印机失败 ${err}`
          })
        })
    },
    addGroup() {
      this.group.mid = this.info.id
      console.log(`fuck`)
      userService.addGroup(this.group).then(res => {
          this.$Message.info({
            content: res.data.message
          })
          this.fetchData()
        }).catch(err => {
          this.$Message.error({
            content: `添加组失败 ${err}`
          })
        })
    },
    deleteGroup(index) {
      console.log(index)
      let p = this.groups[index]
       userService.deleteGroup(p).then(res => {
          this.$Message.info({
            content: res.data.message
          })
          this.fetchData()
        }).catch(err => {
          this.$Message.error({
            content: `删除组失败 ${err}`
          })
        })
    },
    addUserToGroup(index) {
      let p = this.owngroups[index]
      // alert(JSON.stringify(p))
       userService.addUserToGroup(p.userName, p.id).then(res => {
          this.$Message.info({
            content: res.data.message
          })
          this.fetchData()
        }).catch(err => {
          this.$Message.error({
            content: `删除组失败 ${err}`
          })
        })
    },
    getUsersByGroup(index) {
      let g = this.owngroups[index]
       userService.getUsersByGroup(g.id).then(res => {
          this.$Message.info({
            content: JSON.stringify(res.data.users) 
          })
        }).catch(err => {
          this.$Message.error({
            content: `获取组成员失败 ${err}`
          })
        })
    },
    addPrinterToGroup(index) {
        let g = this.owngroups[index]
      // alert(JSON.stringify(g))
       userService.addPrinterToGroup(g.number, g.id).then(res => {
          this.$Message.info({
            content: res.data.message
          })

        }).catch(err => {
          this.$Message.error({
            content: `删除组失败 ${err}`
          })
        })
    },
    getPrintersByGroup(index) {
       let g = this.owngroups[index]
       userService.getPrintersByGroup(g.id).then(res => {
          this.$Message.info({
            content: JSON.stringify(res.data.printers) 
          })
        }).catch(err => {
          this.$Message.error({
            content: `获取组打印机失败 ${err}`
          })
        })
    }
  }
}

</script>
