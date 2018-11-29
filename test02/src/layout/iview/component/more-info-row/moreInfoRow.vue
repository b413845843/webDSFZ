<template>
  <div>
    <Row>
      <Col span="8">
      <div v-for="(node,index) of datas" :key="index">
        <node-view :node='node'> </node-view>
      </div>
      </Col>
      <Col span="8">
      <div v-for="(node,index) of detail" :key="index">
        <node-view :node='node'> </node-view>
      </div>
      </Col>
      <Col span="8">
      <div v-for="(node,index) of states" :key="index">
        <node-view :node='node'> </node-view>
      </div>
      </Col>
      <Spin size="large" fix v-if="isLoading"></Spin>
    </Row>
  </div>
</template>

<script>
  import {
    getPrinterInfo
  } from '@/api/info'
  import {
    parseNode2
  } from '@/tools/parseJsonToNode';
  import nodeView from '@/layout/iview/component/node-view'
  export default {
    components:{nodeView},
    name: 'MoreInfoRow',
    props: {
      number: String,
      row: Object
    },
    mounted() {
      this.fetchInfo()
    },
    methods: {
      async fetchInfo() {
        this.isLoading = true

        Promise.all([getPrinterInfo(this.row.Number, 0), getPrinterInfo(this.row.Number, 1), getPrinterInfo(this.row.Number,
          2)]).then(res => {
          console.log(res);
          let nodes = parseNode2(res[0].data)
          this.datas = nodes

          nodes = parseNode2(res[1].data)
          this.detail = nodes

          nodes = parseNode2(res[2].data)
          this.states = nodes
        }).catch(err => {
          console.log(err);
          this.$Message.error({
            content: `错误 : ${err}`
          });
        })

        setTimeout(() => {
          this.isLoading = false
        }, 200);
      }
    },
    data() {
      return {
        datas: {},
        states: {},
        detail: {},
        isLoading: true
      }
    }
  }

</script>
