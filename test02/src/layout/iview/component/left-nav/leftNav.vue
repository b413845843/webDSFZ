<template>
  <div>
     <div class="layout-logo">
      <img src="@/assets/DSLogo.png" class="logo"></img>
    </div>
  
  <Menu active-name="1-2" theme="dark" width="auto" :open-names="['1']">
    <Submenu name="1">
      <template slot="title">
        <Icon type="ios-navigate"></Icon>
        数据管理
      </template>
      <MenuItem name="1-1" to="/home/">打印机</MenuItem>
    </Submenu>
    <Submenu name="2">
      <template slot="title">
        <Icon type="ios-keypad"></Icon>
        ai
      </template>
      <MenuItem name="2-1">
      <router-link to="/home/foo">foo</router-link>
      </MenuItem>
      <MenuItem name="2-2">
      <router-link to="/home/bar">bar</router-link>
      </MenuItem>
    </Submenu>
    <Submenu name="3">
      <template slot="title">
        <Icon type="ios-analytics"></Icon>
        Item 3
      </template>
      <MenuItem name="3-1">Option 1</MenuItem>
      <MenuItem name="3-2">Option 2</MenuItem>
    </Submenu>
  </Menu>
  </div>
</template>

<script>
import './leftNav.less'
export default {
  name: 'LeftNav'
}
</script>
