<template>
    <div>
        <Row>
            <Col span="8">
                <div v-for="node of datas">
                    <node-view :node='node'> </node-view>
                </div>
            </Col>
            <Col span="8">
                <div v-for="node of detail">
                    <node-view :node='node'> </node-view>
                </div>
            </Col>
            <Col span="8">
                <div v-for="node of states">
                    <node-view :node='node'> </node-view>
                </div>
            </Col>
             <Spin size="large" fix v-if="isLoading"></Spin>
        </Row>
    </div>
</template>

<style scoped>

</style>

<script>

import {getPrinterInfo} from '@/api/info'
import { parseNode2 } from "@/tools/parseJsonToNode";

export default {
    props:{
        number:String,
        row:Object
    },
    mounted(){
        this.fetchInfo()
    },
    methods:{
        async fetchInfo(){
            this.isLoading = true

            // let res = await getPrinterInfo(this.row.Number,0)
            // let nodes = parseNode2(res.data)
            // this.datas = nodes

            // res = await getPrinterInfo(this.row.Number,1)
            // nodes = parseNode2(res.data)
            // this.detail = nodes

            // res = await getPrinterInfo(this.row.Number,2)
            // nodes = parseNode2(res.data)
            // this.states = nodes


            Promise.all([getPrinterInfo(this.row.Number,0),getPrinterInfo(this.row.Number,1),getPrinterInfo(this.row.Number,2)]).then(res =>{
                console.log(res);
                let nodes = parseNode2(res[0].data)
                this.datas = nodes

                nodes = parseNode2(res[1].data)
                this.detail = nodes

                nodes = parseNode2(res[2].data)
                this.states = nodes
            }).catch(err=>{
                console.log(err);
                this.$Message.error({
                    content:`错误 : ${err}`
                });
            })

            setTimeout(() => {
                this.isLoading = false
            }, 200);
            
        }
    },
    data(){
        return {
            datas:{},
            states:{},
            detail:{},
            isLoading:true
        }
    }
}
</script>
