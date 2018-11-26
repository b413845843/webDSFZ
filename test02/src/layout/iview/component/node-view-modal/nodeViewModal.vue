<template>
  <Modal v-model="show" @on-cancel="actionCancel" @on-ok="actionOK" class="modal">
    <div slot="header">
      <Tag type="border" class="title">设备编码:<span>{{number}}</span></Tag>
    </div>
    <node-view v-for="(node,index) in nodes" :node="node" :key="index"></node-view>
    <div slot="footer">
      <Button type="primary" @click="$emit('action','ok')">确定</Button>
    </div>
  </Modal>
</template>

<script>
import './nodeViewModal.less'
export default {
  name: 'NodeViewModal',
  props:{
    nodes:Array,
    toShow:Boolean,
    number:String
  },
  computed:{
    show:{
      set() {

      },
      get() {
        return this.toShow
      }
    }
  },
  methods:{
    actionOK() {
      this.$emit('action', 'ok')
    },
    actionCancel() {
      this.$emit('action', 'cancel')
    },
  }
}
</script>
