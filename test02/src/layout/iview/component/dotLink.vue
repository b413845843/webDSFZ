<template>
    <Button @click="click" size="small">
        <span v-if="'Ready' == type || 'Online' == type" class="ivu-tag-success  ivu-tag-dot-inner"></span>
        <span v-else-if=" 'Error' == type" class="ivu-tag-error .ivu-tag-error.ivu-tag-dot .ivu-tag-dot-inner  ivu-tag-dot-inner"></span>
        <span v-else class="ivu-tag-warning .ivu-tag-warning.ivu-tag-dot .ivu-tag-dot-inner  ivu-tag-dot-inner"></span>
        {{text==''?'未知':text}}
    </Button>
</template>

<script>
export default {
    name:'dotLink',
    props:["click","text","type"]
}
</script>


<style scoped>
.tag-dot-inner {
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-right: 8px;
    border-radius: 50%;
    background: #e8eaec;
    position: relative;
    top: 1px;
}

.tag-error, .tag-primary, .tag-success, .tag-warning {
    border: 0;
}

.tag-success, .tag-success .tag-dot .tag-dot-inner {
    background: #19be6b;
}

.tag-error, .tag-error .icon-ios-close, .tag-error .icon-ios-close:hover, .tag-error a, .tag-error a:hover, .tag-primary, .tag-primary .icon-ios-close, .tag-primary .icon-ios-close:hover, .tag-primary a, .tag-primary a:hover, .tag-success, .tag-success .icon-ios-close, .tag-success .icon-ios-close:hover, .tag-success a, .tag-success a:hover, .tag-warning, .tag-warning .icon-ios-close, .tag-warning .icon-ios-close:hover, .tag-warning a, .tag-warning a:hover {
    color: #fff;
}

* {
    box-sizing: border-box;
    -webkit-tap-highlight-color: transparent;
}
</style>
