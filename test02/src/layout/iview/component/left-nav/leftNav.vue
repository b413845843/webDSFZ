<template>
  <div>
    <div class="layout-logo">
      <img src="@/assets/DSLogo.png" class="logo"></img>
    </div>

    <Menu active-name="1-2" theme="dark" width="auto" :open-names="['1']" v-if="!collapsed">
      <Submenu name="1">
        <template slot="title">
          <Icon type="md-print"></Icon>
          打印机状态
        </template>
        <MenuItem name="1-1" to="/home/">打印机</MenuItem>
      </Submenu>
      <!-- v-if="$store.state.user.remark ==='管理员'" -->
      <Submenu name="2">
        <template slot="title">
          <Icon type="md-contact"></Icon>
          资料管理
        </template>
        <MenuItem name="2-1" to="/usersManager">
          用户
        </MenuItem>
        <MenuItem name="2-2" to="/userInfo">
          好友
        </MenuItem>
        <MenuItem name="2-3" to="/chat">
          聊天室
        </MenuItem>
        
      </Submenu>
      <Submenu name="3">
        <template slot="title">
          <Icon type="ios-document" />
          文件预览
        </template>
        <MenuItem name="2-3" to="/pdf">
          pdf
        </MenuItem>
      </Submenu>
    </Menu>

    <div v-show="collapsed" style="margin-top:20px" class='ide-menu-wrapper'>
      <router-link style="display:block;color:white" to="/home"><common-icon type="md-print"  class="icon"></common-icon></router-link>
      <router-link style="display:block;color:white" to="/usersManager"><common-icon type="md-contact" class="icon"></common-icon></router-link>
    </div>
  </div>
</template>

<script>
import './leftNav.less'
import CommonIcon from '@/layout/iview/component/common-icon'
export default {
  components: { CommonIcon },
  props: { collapsed: Boolean },
  name: 'LeftNav'
}
</script>
