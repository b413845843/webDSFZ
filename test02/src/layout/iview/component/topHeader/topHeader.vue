<template>
  <div class="header">
    <a @click="handleChange" type="text" :class="['sider-trigger-a', collapsed ? 'collapsed' : '']">
      <Icon :type="icon" :size="size" />
    </a>
    <div class="custom-content-con">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import './topHeader.less'
  export default {
    props: {
      collapsed: Boolean,
      icon: {
        type: String,
        default: 'ios-arrow-back'
      },
      size: {
        type: Number,
        default: 26
      }
    },
    methods: {
      handleChange() {
        this.$emit('on-change', !this.collapsed)
      }
    }
  }

</script>
