<template>
    <Modal
        v-model="toShow"
        @on-cancel="actionCancel"
        >
        <div slot="header">
            <h4 style="height:26px">打印</h4>
        </div> 
        
        <Row style="display:table;">
           
            <RadioGroup v-model="printType" style="padding-left:10px;display: table-cell; vertical-align: middle;">
                 <span>打印类型 : </span>
                <Radio  label="图片"></Radio>
                <Radio  label="文本"></Radio>
                <Radio  label="16进制指令"></Radio>
            </RadioGroup>

             <Tag type="border" style="float:right">设备编码:<span>{{number}}</span></Tag>
            
        </Row>
       
        
        <Row v-if="printType === '图片'">
            <Divider dashed />
            <input type="file" id="btn_file" style="display:none" @change="getFile"></input>
            <!-- <input  type="file"  @change="getFile" ></input> -->
            <Button type="primary" @click="F_Open_dialog">选择图片</Button>
            <Card v-if="imageSource !== ''" :dis-hover="true" style="margin-top:10px">
                <div style="text-align:center">
                    <img :src="imageSource" alt=""  style="width:98%">
                    <h3>{{imageName}}</h3>
                </div>
            </Card>
        </Row>
        <Row v-else>
            
          <Form :label-width="40">
               <Divider dashed />
                    <FormItem  label="内容" class="formitemMargin">
                <Input v-model="sendData.content"></Input>
              </FormItem>
          </Form>
        </Row>
            <Form inline :label-width="90">
                <Row v-if="printType === '图片'">
                    <Divider dashed />
                    <Col span=12>
                        <FormItem  label="图片输出宽度">
                            <Input v-model="sendData.imgW"></Input>
                        </FormItem>
                        
                    </Col>
                    <Col span=12>
                        <FormItem  label="图片输出高度">
                            <Input v-model="sendData.imgH"></Input>
                        </FormItem>
                    </Col>
                 </Row>
                 <Row v-if="printType === '图片'">
                    <Col span=12>
                        <FormItem  label="图片X坐标" class="formitemMargin">
                            <Input v-model="sendData.orgX"></Input>
                       </FormItem>
                        
                    </Col>
                    <Col span=12>
                        <FormItem  label="图片Y坐标" class="formitemMargin">
                           <Input v-model="sendData.orgY"></Input>
                        </FormItem>
                    </Col>
                 </Row>
                

                
                  <Row>
                      <Divider dashed />
                       <Col span=12>
                            <FormItem  label="数据类型" style="width:95%;" class="formitemMargin">
                                <Select v-model="sendData.dataFmt">
                                    <Option value="img">img</Option>
                                    <Option value="text">text</Option>
                                    <Option value="dat">dat</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span=12>
                            <FormItem  label="数据内容编码" style="width:95%;" class="formitemMargin">
                                <Select v-model="sendData.encodeType">
                                    <Option value="string">string</Option>
                                    <Option value="base64">base64</Option>
                                    <Option value="hex">hex</Option>
                                    <Option value="json">json</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>

                
                  <Row>
                      <Divider dashed />
                       <Col span=12>
                            <FormItem  label="作业数据类型" style="width:95%;" class="formitemMargin">
                                <Select v-model="sendData.jobType">
                                    <Option value="print">print</Option>
                                    <Option value="control">control</Option>
                                    <Option value="config">config</Option>
                                    <Option value="DFU">DFU</Option>
                                </Select>
                            </FormItem>
                        </Col>
                        <Col span=12>
                            <FormItem  label="目标设备" style="width:95%;" class="formitemMargin">
                                <Select v-model="sendData.devType">
                                    <Option value="wifi" >wifi</Option>
                                    <Option value="device" >device</Option>
                                </Select>
                            </FormItem>
                        </Col>
                    </Row>
            </Form>
        
        <Row v-if="msg">
            <Divider dashed />
            <h5 >信息:</h5>
            <p style='display:block;word-break: break-all;word-wrap: break-word;'>{{JSON.stringify(msg)}}</p>
        </Row>
       
           
        <div slot="footer">
            <Button type="text" @click="actionCancel">取消</Button>
            <Button type="primary" @click="actionOK">发送</Button>
        </div> 
        <Spin size="large" fix v-if="isLoading"></Spin>
    </Modal>
</template>

<style scoped>

.col{
    height: 100%;
}

.btn {
    width: 100%;
    height: 100%;
    display: inline-block;
    text-align: center
}


.leaf{
    padding-left: 0px;
    margin-bottom: 5px;
}

.leafTitle{
    color: rgb(107, 105, 105)
}

.leafContent{
    color: dodgerblue;
    font-weight: bold
}

.formitemMargin{
    margin-bottom:0px;
}
</style>

<script>

import { Base64 } from 'js-base64';
import {postPrint} from '@/api/info'
function stringToHex(str){
　　　　var val="";
　　　　for(var i = 0; i < str.length; i++){
　　　　　　if(val == "")
　　　　　　　　val = str.charCodeAt(i).toString(16);
　　　　　　else
　　　　　　　　val += "," + str.charCodeAt(i).toString(16);
　　　　}
　　　　return val;
}

String.prototype.StrCut2Arr=function(n){
	var str=this;
	var arr=[];
	var len=Math.ceil(str.length/n);
	for(var i=0;i < len;i++){
		if(str.length >= n){
			var strCut=str.substring(0,n);
			arr.push(strCut);
			str=str.substring(n);
		}else{
			str=str;
			arr.push(str);
		}
	}
	return arr;
}

export default {
    props:{'json':Object,'show':Boolean,'number':String},
    computed:{
        toShow: {
            set(value){
                console.log(this.show);
            },
            get:function () {
                return this.show
            }
        },
        data:{
            set(value){
                console.log(value);
                
            },
            get(){
                if(this.json){
                    let data = {}
                    let items = []
                    data.items = items


                   return data
                }else{
                    return null
                }
            }
        }
    },
    watch:{
        show:function () {
            this.msg = this.imageName = this.imageSource = ''
        }
    },
    data(){
        return{
            op:0,
            wod:true,
            printType:'图片',
            content:'10170000',
            sendData:{
                dataFmt: "dat",
                devType: "wifi",
                encodeType: "hex",
                jobType: "control",
                content:"10170000"
                },
            imageSource:'',
            imageName:'',
            isLoading:false,
            msg:''
        }
    },
     methods:{
        async actionOK(){
            console.log(this.printType);
            this.isLoading = true
            this.msg = ''
            if(this.printType === '图片'){
                this.sendData.datas = this.imageSource
            }else{
                //文本或者是hex
                if(this.sendData.encodeType === 'base64'){
                    console.log(this.sendData.content);

                    this.sendData.datas = Base64.encode(this.sendData.content)
                    console.log(this.sendData.datas);
                    
                }else{
                    this.sendData.datas = this.sendData.content
                }
                
            }
            this.sendData.number = this.number
            console.log(JSON.stringify(this.sendData));
            
            this.$emit('action','ok')
            this.showPrint = true

            let res = await postPrint(this.sendData).then(res=>{
                 this.msg = res.data
            }).catch(err=>{
                console.log(err);
                this.$Message.error({
                    content:`错误 : ${err}`
                });
            })          
           
            this.isLoading = false
        },
        actionCancel(){
            
            this.$emit('action','cancel')
        },
        changeClick(type){
            this.$emit('get-config',type)
            this.wod = type == 'WIFI'
        },
        getFile (e) {
            let file = e.target.files[0]

            if(!file){
                this.imageName = this.imageSource = ''
                console.log('取消');
                
                return
            }

            let res = /image\/\w+/.test(file.type)
            if(!res){
                this.$Message.error({
                    content:'只能选择图片'
                })
                this.imageName =this.imageSource = ''
                return
            }

            console.log(`文件名:${file.name} 大小:${file.size} 类型:${file.type} path:${e.target.value}`);
            this.imageName = file.name
            let reader = new FileReader();
            reader.readAsDataURL(file)
            reader.onload = function(event){
                console.log(event.target.result);
                this.imageSource = event.target.result
            }.bind(this)
            
        },F_Open_dialog() { 
            document.getElementById("btn_file").click(); 
        }
    },
    
}
</script>
