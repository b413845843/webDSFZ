<template>
  <div>
    <h3>{{title}}</h3>
    <div v-for="({title,content,datas},index) in items" class="leaf" :key="index">
      <h4 v-if="datas">{{title}}</h4>
      <div v-if="datas" class="leaf">
        <p v-for="(data,index) in datas" :key="index">
          <span class="leafTitle">{{data.title}}</span> : <span class="leafContent">{{data.content}}</span>
        </p>
      </div>
      <p v-else class="leaf"> <span class="leafTitle">{{title}}</span> : <span class="leafContent">{{content}}</span></p>
    </div>
  </div>
</template>

<style scoped>
  .leaf {
    padding-left: 10px;
  }

  .leafTitle {
    color: rgb(107, 105, 105)
  }

  .leafContent {
    color: dodgerblue;
    font-weight: bold
  }

</style>

<script>
  export default {
    name: 'nodeView',
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
