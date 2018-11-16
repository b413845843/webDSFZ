<template>
    <div>
        <el-row>
            <el-col :span="24">
                <el-card>
                    <el-form style="width:200px">
                        <el-form-item label="">
                            <el-input></el-input>
                            <el-button type="primary" size="small">搜索</el-button>
                        </el-form-item>
                    </el-form>
                </el-card>
            </el-col>
        </el-row>
        
        <el-row class="controlRow">
            <el-card>
                <el-button icon="el-icon-delete" type="danger" size="small">批量删除</el-button>
                <el-button icon="el-icon-refresh" type="danger" size="small" @click="initFormData">刷新列表</el-button>
                <el-button icon="el-icon-circle-plus" type="success" size="small" @click="showTableDialog({type:'add'})">添加信息</el-button>
                <span style="float:right;line-height:100%">{{`共有数据:${tableData.length}条`}}</span>
            </el-card>
        </el-row>
        
        <el-row>
            <el-table :data="tableData" stripe v-loading="loading">
                <el-table-column type="selection">
                </el-table-column>

                <el-table-column
                prop="Number"
                label="SN"
                >
                </el-table-column>

                <el-table-column
                prop="Status"
                label="Status"
                >
                </el-table-column>

                <el-table-column
                prop="Received"
                label="Received"
                >
                </el-table-column>

                <el-table-column
                prop="Jobs"
                label="Jobs"
                >
                </el-table-column>

                <el-table-column
                prop="Ticks"
                label="Ticks"
                >
                </el-table-column>

                <el-table-column label="操作">
                    <template slot-scope="scope">
                            <el-button @click="showTableDialog({type:'edit',row:scope.row})" size="mini" type="primary" icon="el-icon-edit">编辑</el-button>
							<el-button @click="deletePrinter(scope.$index)" size="mini" type="danger" icon="el-icon-delete" >删除</el-button>
                    </template>
                </el-table-column>
            
            </el-table>
        </el-row>


        <!-- 添加表单 dialog -->
        <el-dialog :title="formTitle" :visible.sync="dialogFormVisible">
            <el-form :model="form" size="small" :rules="rules" :ref="dialogForm">
                <el-form-item label="SN" :label-width="formLabelWidth" prop="Number">
                    <el-input v-model="form.Number" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="Status" :label-width="formLabelWidth" prop="Status">
                    <el-select v-model="form.Status" placeholder="选择状态" style="width:100%;">
                        <el-option label="空闲" value="idel"></el-option>
                        <el-option label="忙" value="busy"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="Received" :label-width="formLabelWidth" prop="Received">
                    <el-input v-model="form.Received" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="Jobs" :label-width="formLabelWidth" prop="Jobs">
                    <el-input v-model="form.Jobs" autocomplete="off"></el-input>
                </el-form-item>
                <el-form-item label="Ticks" :label-width="formLabelWidth" prop="Ticks">
                    <el-input v-model="form.Ticks" autocomplete="off"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button type="primary" @click="tableDialogSumbit({type:dialogType})">确 定</el-button>
            </div>
        </el-dialog>
    
    </div>
    
</template>

<script>
import {getAllUsers} from '@/api/user'
import {getPrinterInfo,addPrinter,deletePrinter,editPrinter} from '@/api/info'
import {deepClone} from '@/tools/copy'

const defaultInfo = {
    id:0,
    Number:'0001',
    Status:'idel',
    Received:0,
    Jobs:0,
    Ticks:0
};

export default {
    name:'UerManager',
    mounted(){
        this.initFormData()
        
    },
    data (){
        return {
            loading:true,
            tableData:[],
            dialogFormVisible:false,
						colWidth:100,
						dialogForm:'form',
						form:defaultInfo,
						dialogType:'',
						formLabelWidth:"80px",
						formTitle:'',
            rules:{
                 Number:[
                    { required: true, message: '请输入Number', trigger: 'blur' }
                 ],
                Status:[
                     { required: true, message: '请选择状态', trigger: 'change' }
                ],
                Received:[
                    { required: true, message: '请输入Received', trigger: 'blur' },
                 ],
                Jobs:[
                    { required: true, message: '请输入Jobs', trigger: 'blur' },
                 ],
                Ticks:[
                    { required: true, message: '请输入Ticks', trigger: 'blur' },
                 ],
            }
        }
    },
    methods:{
         addPrinter(){
            this.$refs[this.dialogForm].validate(function (valid){
                if (valid) {
                    this.dialogFormVisible = false
                    // console.log(`add ${JSON.stringify(this.form)}`);
                    this.form.id = 0
                    addPrinter(this.form).then(function (res){
                        if(res){
                            this.tableData.push(res)
                        }
                    }.bind(this))
                    
                } else {
                    console.log('error submit!!');
                    return false;
                    
                }
            }.bind(this) )
            
        },
                
        async deletePrinter(index){
        
            const id = this.tableData[index].id
            console.log(id);

            this.loading = true;
            console.log('开始');

            let res =  await deletePrinter(id)
            
            if(res){
                console.log('删除');
                
                this.tableData.splice(index,1)
            }else{
                console.log('删除失败')
            }
            console.log('关闭');
            
            setTimeout(() => {
                // loadingInstance.close()
                this.loading = false;
            }, 1000);
            
        },
        initFormData(){
            this.loading = true;

            setTimeout(()=>{
                getPrinterInfo().then(function(res){
                console.log(res);
                if(res){
                    this.tableData = res
                }
                this.loading = false
            }.bind(this),function(res){
                this.loading = false
            }.bind(this))
            },200)

            
        },
        showTableDialog({type,row}){
            this.dialogType = type
            console.log(this.$refs.dialogForm);
            // this.$refs[this.dialogForm].clearValidate()
            if('edit' == type){
                this.form = deepClone(row)
                this.formTitle = `编辑 id:${row.id}`
            }else if('add' == type){
                this.form = defaultInfo
                this.formTitle = '添加'
            }else if('delete' == type){
                this.formTitle = `删除 id:${row.id}`
                this.form = deepClone(row)
            }
            this.dialogFormVisible = true
        },
        tableDialogSumbit({type,row}){
            if('edit' == type){
                this.dialogFormVisible = false
                let loadingInstance = this.$loading({ fullscreen: true ,text: `编辑ID号为${this.form.id}的信息`});
                editInfo(this.form).then(function(res){
                    if(res){
                        this.initFormData()
                    }else{
                    }
                    setTimeout(() => {
                                            loadingInstance.close()
                                        }, 2000);
                }.bind(this),function(res){
                    alert('服务器出错 编辑失败')
                    setTimeout(() => {
                                            loadingInstance.close()
                                        }, 2000);
                }.bind(this))
            }else if('add' == type){
                this.addPrinter()
            }
        }
    }
}
</script>

<style scoped>
.controlRow{
    padding:20px 0px;
}
</style>

