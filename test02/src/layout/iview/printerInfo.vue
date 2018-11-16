<template>
    <div id="printerInfo">
      <Row style="padding-bottom:10px">
          
          <Tag style="height:100%">
                <CheckboxGroup v-model="filterValue" style="display:inline">
                    <Checkbox label="Busy"></Checkbox>
                    <Checkbox label="Ready"></Checkbox>
                    <Checkbox label="Warn"></Checkbox>
                    <Checkbox label="Dead"></Checkbox>
                    <Checkbox label="None"></Checkbox>
                </CheckboxGroup>
          </Tag>
             <!-- <Button type="info" @click="clickFilter"><Icon type="md-search" size=16 />过滤 </Button> -->
            <Button type="info" @click="fetchData"><Icon type="md-refresh" size=16 /> 刷新列表</Button>
          <!-- <Button type="success" @click="showAddModal"><Icon type="md-add" />添加</Button> -->
          <!-- <Button type="error"><Icon type="md-trash" />删除全部</Button> -->
       
          <Poptip  trigger="hover" placement="left" @on-popper-show="fetchVersion" style="float:right;margin-right:10px;">
              
              <Button type="text" ><Icon type="md-information-circle" size=14 /> 版本信息</Button>
                <div v-if="version" class="versionSpan" slot="content"> 
                    <p>webVer : 1.0.0.1</p>
                    <p> dsPrnService : {{version.dsPrnService.Ver}} </p>
                    <p>libdsDevJsLib.so : {{version.DevLib['libdsDevJsLib.so'].Ver}} </p>
                    <p>libdsDevBmp.so : {{version.DevLib['libdsDevBmp.so'].Ver}} </p>
                    
                </div>
                <p v-else slot="content">获取数据...</p>
                <Spin size="large" fix v-if="versonFetching"></Spin>
          </Poptip>
         
      </Row>
            
        <Table stripe :columns="tableCols" :data="tableData" :loading="tableLoading" @on-filter-change="filterChange"> </Table>
        
        <Row>
             <Page :total="tableData.length" size="small" show-elevator show-sizer style="margin-top:10px"/>
        </Row>
       
        
        <Modal v-model="deleteModel" title="删除" ref="deleteModel">
            <div>准备删除</div>
        </Modal>

        <Modal v-model="editeModel" title="编辑" ref="editeModel">
            <div>编辑</div>
        </Modal>
        
        <Modal v-model="addModel" :title="type=='add'?'添加':'编辑'" ref="addModel" footer-hide>
            <Form ref="infoForm" :model="newInfo" :label-width="80" >
                <FormItem label="SN" prop="Number">
                    <Input v-model="newInfo.Number" placeholder="SN"></Input>
                </FormItem>
                <FormItem label="Model" prop="Model">
                    <Input v-model="newInfo.Model" placeholder="Model"></Input>
                </FormItem>
                <FormItem label="status" prop="Status">
                    <Select v-model="newInfo.Status">
                        <Option v-for="statu in status" :value="statu":key='statu'>{{statu}}</Option>
                        
                    </Select>
                </FormItem>
                <FormItem label="Received" prop="Received">
                    <Input v-model="newInfo.Received" placeholder="Received"></Input>
                </FormItem>
                <FormItem label="Jobs" prop="Jobs">
                    <Input v-model="newInfo.Jobs" placeholder="Jobs"></Input>
                </FormItem>
                <FormItem label="Ticks" prop="Ticks">
                    <Input v-model="newInfo.Ticks" placeholder="Ticks"></Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSubmit('infoForm')">确定</Button>
                    <Button @click="handleReset('infoForm')" style="margin-left: 8px">复位</Button>
                </FormItem>
            </Form>
        </Modal>
        <config-view 
        :show="showConfig" 
        :isLoading="isGettingConfig"  
        @action="configAction"
        @get-config="fetchConfig"
        :json="configJson"></config-view>

        <print-view 
        :show="showPrint" 
        @action="printAction"
        :number=configNumber
        ></print-view>
    </div>
</template>

<style scoped>
.versionSpan{
    float: right;
}
</style>


<script>
import {deepClone} from '@/tools/copy'
import {getPrinterList,getPrinterInfo,addPrinter,editPrinter,deletePrinter,getVersion,getConfig,postPrint} from '@/api/info'
import { Node,parseNode,parseNode2 } from "@/tools/parseJsonToNode";
import nodeView from '@/layout/iview/component/nodeView.vue'

const status = ['Ready','Busy','Warn','Error','None','Dead']
function defaultInfo () {
    
    return {
        Number:Math.floor( (Math.random () * 20000 + 1) ),
        Model:'DL-210',
        Status:status[ Math.floor( (Math.random () * 4 + 1) )],
        Received:1234,
        Jobs:Math.floor( (Math.random () * 255 + 1) ),
        Ticks:Math.floor( (Math.random () * 50 + 1) )
    }

}

export default { 
    components:{'node-view':nodeView},
    data(){
        return {
            tableCols:[
                    {
                        type: 'selection',
                        width: 60,
                        align: 'center'
                    },
                     {
                        type: 'expand',
                        width: 50,
                        render: (h, params) => {
                            return h('more-info-row', {
                                props: {
                                    row: params.row
                                }
                            })
                        }
                    },
                     {
                        title: '设备编码',
                        key: 'Number',
                        render: (h,params) => {
                            
                            return h('a',
                            {
                                on:{
                                    click: ()=> {
                                        console.log(`请求info 0 ${params.row.Number}`);
                                        
                                        this.fetchInfo(params.row.Number,0)
                                    }
                                }
                            },
                            params.row.Number.toUpperCase())
                        }
                    },
                    {
                        title: '型号',
                        key: 'Model',
                        render: (h,params) => {
                            return h('a',
                            {
                                on:{
                                    click: ()=> {
                                        console.log(`请求info 1 ${params.row.Number}`);
                                        
                                        this.fetchInfo(params.row.Number,1)
                                    }
                                }
                            },
                            params.row.Model)
                        }
                    },
                    {
                        title: '网络/状态',
                        key: 'Status',
                        render: (h,params) => {
                            // const color = params.row.Status === 'Ready'?'success':'error'
                            // const type = params.row.Net === 'Online'?'Ready':'Error'
                            
                            return h('dot-link',{
                               props:{
                                   click:()=>{
                                       console.log(`请求info 1 ${params.row.Number}`);
                                        
                                        this.fetchInfo(params.row.Number,2)
                                   },
                                   text:params.row.Status,
                                   type:params.row.Net
                               }
                            })
                        }
                    },
                    {
                        title: '接收缓存',
                        key: 'Received'
                    },
                    {
                        title: '作业数',
                        key: 'Jobs'
                    },
                    {
                        title: '心跳数',
                        key: 'Ticks'
                    },
                    {
                        title:'操作',
                        render:function (h,params){

                            return h('div',[
                                h('a',{
                                    style:{
                                        marginRight:'20px',
                                        color:'#000'
                                    },
                                    on:{
                                        click:()=>{
                                            console.log(`index ${params.index} number ${params.row.Number}`)
                                            this.showPrint = true
                                            this.configNumber = params.row.Number;
                                        }
                                    }
                                },[
                                    h('Icon',{
                                        props:{
                                            type:'md-print',
                                            size:16
                                        }
                                    })
                                ]),
                                h('a',{
                                    style:{
                                        marginRight:'20px',
                                        color:'#000'
                                        // border:0,
                                        // backgroundColor: 'transparent'
                                    },
                                    on:{
                                        click:()=>{
                                            console.log(`index ${params.index} number ${params.row.Number}`)
                                            this.configNumber = params.row.Number;
                                            this.fetchConfig('WIFI')
                                        }
                                    }
                                },[
                                    h('Icon',{
                                        props:{
                                            type:'md-hammer',
                                            size:16
                                        }
                                    })
                                ]),
                                h('a',{
                                    style:{
                                        color:'#000'
                                    }
                                },[
                                    h('Icon',{
                                        props:{
                                            type:'md-trash',
                                            size:16
                                        }
                                    })
                                ])
                            ])
                           
                        }.bind(this)
                    }
            ],
            infoRules:{
                Number:[
                    {required: true, message: 's', trigger: 'blur'}
                    ],
                Model:[
                    {required: true, message: 's', trigger: 'blur'}
                ],
                Status:[
                    {required: true, message: 's', trigger: 'blur'},
                    { type: 'enum',enum: ['Ready', 'Busy','None'], trigger: 'blur' }
                    ],
                Received:[
                    {required: true, message: 's', trigger: 'blur'}
                ],
                Jobs:[
                    {required: true, message: 's', trigger: 'blur'}
                ],
                Ticks:[
                    {required: true, message: 's', trigger: 'blur'}
                ],

            },
            tableData:[],
            tableLoading:true,
            deleteModel:false,
            editeModel:false,
            addModel:false,
            newInfo:{
                'Number':'',
                'Model':'',
                'Status':'',
                'Received':0,
                'Jobs':0,
                'Ticks':0
            },
            type:'',
            status:status,
            version:null,
            versonFetching:false,
            showConfig:false,
            isGettingConfig:false,
            configJson:{},
            configNumber:'',
            showPrint:false,
            isGettingPrinting:false,
            filterValue:[]
        }
    },

    mounted(){
        this.$Message.config({
            top: 100,
            duration: 2
        });
        this.fetchData()
        // this.fetchVersion()
    },

    methods:{
        configAction (action,data){
            console.info(JSON.stringify(data))
            this.showConfig = false
            
        },
        printAction (action){
            if(action == 'cancel'){
                this.showPrint = false
            }
        },

        async fetchVersion(){
            this.versonFetching = true
            this.version = null
            let res = await getVersion('json').then(res=>{
                this.version = res.data;
                console.log(res.data);
            }).catch(err=>{
                console.log(`catch ${err}`);
            })


           
            this.versonFetching = false
        },
        async fetchConfig(type){
            this.showConfig = true
            this.isGettingConfig = true
            this.configJson = null
            await getConfig(this.configNumber,type).then(res=>{
                this.configJson = res.data 

            }).catch(err=>{
                console.log(err);
                this.$Message.error({
                    content:`错误 : ${err}`
                });
            })
            // if (type === 'DEVICE') this.configJson = JSON.parse('{"Edit Items":{"DevID":"020101d801eeffff","Blue Tooth":{"Model":{"DataType":"string","NodeVal":"Seed BTPRINTER","Length":17,"path":"Blue Tooth.Model"},"Password":{"DataType":"string","NodeVal":"0000","Length":5,"path":"Blue Tooth.Password"}},"Card Type":{"DataType":"value","NodeVal":0,"Min":0,"Max":255,"path":"Card Type"},"Emulation":{"DataType":"list","NodeVal":"3","ListVal":"DS_EMUL;EV_EMUL;STAR_EMUL;DSBMP_EMUL","path":"Emulation"},"Erase Temp":{"DataType":"value","NodeVal":10,"Min":0,"Max":20,"path":"Erase Temp"},"Ethernet":{"Gateway":{"DataType":"data","NodeVal":"c0a80001","Length":4,"Tag":"Tag_IP","path":"Ethernet.Gateway"},"IP Address":{"DataType":"data","NodeVal":"c0a80007","Length":4,"Tag":"Tag_IP","path":"Ethernet.IP Address"},"Port":{"DataType":"value","NodeVal":9100,"Min":0,"Max":65535,"path":"Ethernet.Port"}},"Input Card":{"DataType":"list","NodeVal":"2","ListVal":"Card Box;Manual;Auto","path":"Input Card"},"Output Card":{"DataType":"list","NodeVal":"0","ListVal":"Card Box;Manual;Back;None","path":"Output Card"},"Print Speed":{"DataType":"value","NodeVal":10,"Min":0,"Max":20,"path":"Print Speed"},"Print Temp":{"DataType":"value","NodeVal":10,"Min":0,"Max":20,"path":"Print Temp"},"USB_ID":{"DataType":"list","NodeVal":"0","ListVal":"ON;OFF;","path":"USB_ID"},"WiFi Cfg":{"DHCP":{"DataType":"list","NodeVal":"1","ListVal":"OFF;ON","path":"WiFi Cfg.DHCP"},"DNS":{"DataType":"data","NodeVal":"c0a80064","Length":4,"Tag":"Tag_IP","path":"WiFi Cfg.DNS"},"Gateway":{"DataType":"data","NodeVal":"c0a800fe","Length":4,"Tag":"Tag_IP","path":"WiFi Cfg.Gateway"},"IP Address":{"DataType":"data","NodeVal":"c0a80001","Length":4,"Tag":"Tag_IP","path":"WiFi Cfg.IP Address"},"Password":{"DataType":"string","NodeVal":"dascom","Length":9,"path":"WiFi Cfg.Password"},"SSID":{"DataType":"string","NodeVal":"SeedWIFIPrinter","Length":24,"path":"WiFi Cfg.SSID"},"Subnet Mask":{"DataType":"data","NodeVal":"ffffff00","Length":4,"Tag":"Tag_IP","path":"WiFi Cfg.Subnet Mask"},"WiFi Enable":{"DataType":"list","NodeVal":"0","ListVal":"OFF;ON","path":"WiFi Cfg.WiFi Enable"},"WiFi Mode":{"DataType":"list","NodeVal":"1","ListVal":"CLIENT;SERVER","path":"WiFi Cfg.WiFi Mode"}}},"Cfg Packet":{"NodeVal":"AgEB2AHu//9EUjEwRURTAAAAAAAAAAAAAbgh3gEBAAYCAQAAAAADAQMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAQEDAAAABAEAAAAAAAAAAAAAAAAAAQAKAQBTZWVkV0lGSVByaW50ZXIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAoKCgoKCsCoAAH///8AwKgA/sCoAGTAqAAKZGFzY29tAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFTZWVkIEJUUFJJTlRFUgAAADAwMDAAAAAAAAAAAQAAAMCoAAEXAMCoAAeMI8CoAAEDAMIBAAAA////AFAAAAAAAAAAAwAAAAT/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAAIACgoKCgoAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA","path":"Cfg Packet"}}')
            console.log('stop loading');
             setTimeout(() => {
                    this.isGettingConfig = false
                }, 50);
           
        },
        async fetchData(){
            this.tableLoading = true
            this.tableData = []
            console.log('start fetch data');
            let res = await getPrinterList().then(res=>{
                 this.tableData = res.data 
            }).catch(err=>{
                console.log(err);
                this.$Message.error({
                    content:`错误 : ${err}`
                });
                this.tableData = []
            })

            this.tableLoading = false            
        },
        async fetchInfo(number,type){
            let res = await getPrinterInfo(number,type).then(res=>{
                  let nodes = parseNode2(res.data)
                
                 let ff = nodes.map(node=>{
                     return <node-view node={node} ></node-view>;
                 })

               this.$Modal.info({
                    title:`设备  ${number}`,
                  

                    render: (h,params)=>{
                    
                        return ff
                    },
                    maskClosable:true
                })
            }).catch(err=>{
                console.log(err);
                this.$Message.error({
                    content:`错误 : ${err}`
                });
            })

            this.tableLoading = false 
            
          


            
        },
        showDeleteModal(row){
            this.deleteModel = true
        },
        showAddModal(){
            this.newInfo = defaultInfo()
            this.type = 'add'
            this.addModel = true
        },
        showEditModal(row){
            this.newInfo = deepClone(row)
            this.type = 'edit'
            this.addModel = true
        },
         handleSubmit (name) {
            this.$refs[name].validate(async function(valid){
                if(valid){
                    this.$Message.info({
                        content:'验证成功'
                    })

                    let res
                    if('add' == this.type){
                        res = await addPrinter(this.newInfo)
                    }else{
                        res = await editPrinter(this.newInfo)
                    }
                     let message =  this.type=='add'?'添加':'编辑';
                    if(res.data == undefined){
                        this.$Message.error({
                            content:`错误 : ${err}`
                        });
                    }else{
                        this.$Message.success({
                            content:`${message}成功`
                        })

                        this.fetchData()
                    }

                    this.addModel = false

                }else{
                    this.$Message.error({
                        content:'验证失败'
                    })
                }
            }.bind(this))
        },
        handleReset (name) {
            this.$refs[name].resetFields()
        },
        filterChange(value){
            console.log(value);
            
        }
        
    }
}
</script>
