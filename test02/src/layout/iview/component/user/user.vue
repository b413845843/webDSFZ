<template>
  <div class="user-dropList">
    <Dropdown>
        <Avatar icon="ios-person" />
        <Icon :size="18" type="md-arrow-dropdown"></Icon>
        <DropdownMenu slot="list">
            <DropdownItem>退出登录</DropdownItem>
        </DropdownMenu>
    </Dropdown>
  </div>
</template>

<script>
import './user.less'

export default {
  name: 'User'
}
</script>
