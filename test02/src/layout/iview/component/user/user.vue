<template>
<div>
  <div class="nameDiv">你好 <span class="name">{{userName}}</span>
  </div>
  <div class="user-dropList">
    <Dropdown @on-click='handleClick'>
      <Avatar icon="ios-person" />
      <Icon :size="18" type="md-arrow-dropdown"></Icon>
      <DropdownMenu slot="list">
        <DropdownItem name="info">个人信息</DropdownItem>
        <DropdownItem name="logout">退出登录</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  </div>
</div>
</template>

<script>
  import './user.less'
  import { mapActions } from 'vuex'
  import { getUser, getRemark } from '@/lib/util'
  export default {
    name: 'User',
    computed: {
      userName() {
        return getRemark() + ' ' + getUser()
      }
    },
    methods: {
      ...mapActions([
        'handleLogout'
      ]),
      logout() {
        this.handleLogout().then(() => {
            this.$router.push({
              name: 'login'
            })
          })
      },
      handleClick (name) {
        if (name === 'logout') {
          this.logout()
        } else if (name === 'info') {
          console.log(this.$router)
          this.$router.push('/userInfo')
        }
      }
    }
  }

</script>
