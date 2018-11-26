<template>
  <div>
    <h3>{{tt(title)}}</h3>
    <div v-for="({title,content,datas},index) in items" class="nodeleaf" :key="index">
      <h4 v-if="datas">{{tt(title)}}</h4>
      <div v-if="datas" class="nodeleaf">
        <p v-for="(data,index) in datas" :key="index">
          <span class="leafTitle">{{tt(data.title)}}</span> : <span class="leafContent">{{data.content}}</span>
        </p>
      </div>
      <p v-else class="nodeleaf"> <span class="leafTitle">{{tt(title)}}</span> : <span class="leafContent">{{content}}</span></p>
    </div>
  </div>
</template>

<script>
import Vue from 'vue/dist/vue.js'
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
    watch: {
      node(){
        this.nodesInit()
      }
    },
    mounted(){
      this.nodesInit()
    },
    methods:{
      nodesInit(){
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
      },
      tt: function(key){        
        if(this.$t !== undefined){
          return this.$t(key)
        }else{          
          return key
        }
      }
    }
  }

</script>

<style lang="less" scoped>

</style>
