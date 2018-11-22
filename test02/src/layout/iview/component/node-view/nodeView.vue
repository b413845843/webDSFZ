<template>
  <div>
    <h3>{{title}}</h3>
    <div v-for="({title,content,datas},index) in items" class="nodeleaf" :key="index">
      <h4 v-if="datas">{{title}}</h4>
      <div v-if="datas" class="nodeleaf">
        <p v-for="(data,index) in datas" :key="index">
          <span class="leafTitle">{{data.title}}</span> : <span class="leafContent">{{data.content}}</span>
        </p>
      </div>
      <p v-else class="nodeleaf"> <span class="leafTitle">{{title}}</span> : <span class="leafContent">{{content}}</span></p>
    </div>
  </div>
</template>

<script>
import './nodeView.less'
  export default {
    name: 'NodeView',
    props: {
      node: Object
    },
    data() {
      return {
        items: [],
        title: ''
      }
    },
    created: function () {
      if (this.node) {
        this.title = this.node.name
        this.items = this.node.nodes.filter(node => {
          if (node.name === 'SEP') {
            return false
          }
          return true;
        }).map(node => {
          return {
            title: node.name,
            content: node.value,
            datas: node.dataType === 'multiString' ? node.value.split(';').map(e => {
              let o = e.split('=')
              return {
                title: o[0],
                content: o[1]
              }
            }) : null
          }
        })
      };
    }
  }

</script>

<style lang="less" scoped>

</style>
