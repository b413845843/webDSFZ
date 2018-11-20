<template>
  <Button @click="click" size="small">
    <span v-if="'Ready' == type || 'Online' == type" class="ivu-tag-success  ivu-tag-dot-inner"></span>
    <span v-else-if=" 'Error' == type" class="ivu-tag-error .ivu-tag-error.ivu-tag-dot .ivu-tag-dot-inner  ivu-tag-dot-inner"></span>
    <span v-else class="ivu-tag-warning .ivu-tag-warning.ivu-tag-dot .ivu-tag-dot-inner  ivu-tag-dot-inner"></span>
    {{text==''?'未知':text}}
    <slot></slot>
  </Button>
</template>

<script>
  export default {
    name: 'dotLink',
    props: ['click', 'text', 'type']
  }
</script>

<style lang="less" scoped>
  @import './dotLink.less';

  * {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
  }

</style>
