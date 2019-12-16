<template>
    <section>
        <HeadTitle
            title="合同"
            icon='hetongshenpi'
        ></HeadTitle>
        <div style="padding-top:30px;">
            <el-form ref="form" :rules="rules" :model="form" label-width="140px">
                <el-form-item label="合同名称" prop="contractName"> 
                    <el-input v-model="form.contractName" placeholder="请输入合同名称"></el-input>
                </el-form-item>
                <el-form-item label="合同编号" prop="contractNoInput"> 
                    <el-input v-model="form.contractNoInput" placeholder="请输入合同编号"></el-input>
                </el-form-item>
                <el-form-item label="送审单位" prop="applyCompany"> 
                    <el-input v-model="form.applyCompany" disabled placeholder="请输入送审单位"></el-input>
                </el-form-item>
                <el-form-item label="项目责任人" prop="applyUserName"> 
                    <el-input v-model="form.applyUserName" disabled placeholder="请输入项目责任人"></el-input>
                </el-form-item>
                <el-form-item label="使用单位" prop="receiveCompany"> 
                    <el-input v-model="form.receiveCompany" placeholder="请输入使用单位"></el-input>
                </el-form-item>
                <el-form-item label="使用单位责任人" prop="reveiveUserName"> 
                    <el-input v-model="form.reveiveUserName" placeholder="请输入单位责任人"></el-input>
                </el-form-item>
                <el-form-item label="合同标的"> 
                    <el-input v-model="form.contractObj" maxlength="50" placeholder="请输入合同标的"></el-input>
                </el-form-item>
                <el-form-item class="textareaBox" label="合同要点说明" prop="contractDesc">
                        <el-input  type="textarea" v-model="form.contractDesc" maxlength="1000" placeholder="请输入合同要点说明">
                        </el-input>
                        <span class="textNum">{{wordCount}}/1000</span>
                </el-form-item>

                <File :accessory="accessory"
                    v-on:remove="removeFile"
                >
                </File>

                 <Approve
                    :approvers_data='approvers_data'
                    v-on:selectOpen='selectOpen'
                    v-on:remove='remove'
                    guideType=2

                >

                </Approve>
                <Copy
                    :receivers_data='receivers_data'
                    v-on:selectOpen='selectOpen'
                    v-on:remove='remove'
                >
                </Copy>

                 <div class="btn_box">
                    <a :class="btnStatus?'btn':'btn disabled'" @click="submitForm('form')">提交</a>
                </div>

            </el-form>
            
        </div>
        <AddressList
            :show="openAdd"
            v-on:close="close"
            v-on:choose="choose"
            :types="peopleType"
            :approvers="approvers_data"
            :receivers="receivers_data"
            
        ></AddressList>
    </section>
</template>

<script>
    import File from './../../components/oa/file.vue'
    import Approve from './../../components/oa/approve_contacts.vue'
    import Copy from './../../components/oa/copy_contacts.vue'
    import AddressList from './../../components/common/addressList.vue'
    import HeadTitle from './../../components/common/headTitle.vue'
    export default {
        data() {
            return {
                wordCount:0,
                accessory:[],
                approvers_data:[],
                receivers_data:[],
                form:{
                    contractName:'',
                    contractNoInput:'',
                    applyCompany:'',
                    applyUserName:'',
                    receiveCompany:'',
                    reveiveUserName:'',
                    contractObj:'',
                    contractDesc:'',
                },
                rules:{
                    contractNoInput:[
                        { required: true, message: '内容不能为空', trigger: 'blur' },
                        { pattern: /[^\u4e00-\u9fa5]/g, message: '不能输入中文字符', trigger: 'blur' },
                    ],
                    contractName:[
                        { required: true, message: '内容不能为空', trigger: 'blur' },
                        { min:2, max: 100, message: '长度在不能超过100字符或少于2个字符', trigger: 'blur' }
                    ],
                    receiveCompany:[
                        { required: true, message: '内容不能为空', trigger: 'blur' },
                        { min:6, max: 64, message: '长度在不能超过64字符或少于6个字符', trigger: 'blur' }
                    ],
                    reveiveUserName:[
                        { required: true, message: '内容不能为空', trigger: 'blur' },
                        { pattern: /[^0-9]/g, message: '名称不能包含数字', trigger: 'blur' },
                        { min:2, max: 12, message: '长度在不能超过12字符或少于2个字符', trigger: 'blur' }
                    ],
                    contractDesc:[
                        { required: true, message: '合同详情不能为空', trigger: 'blur' },
                        { min:1, max: 1000, message: '长度在不能超过1000字符', trigger: 'blur' }
                    ]
                },
                btnStatus:true,
                openAdd:false,
                peopleType:false,//打开通讯录类型

            }
        },
        created(){
            document.title='合同'

            this.Ajax.get('/user/info').then(res=>{
                this.form.applyCompany = res.data.b.organName
                this.form.applyUserName = res.data.b.name
            })
        },
        watch:{
            'form.contractDesc':function(val){
                this.wordCount = val.length
            }
        },
        components:{
            HeadTitle,
            File,
            Approve,
            AddressList,
            Copy
        },
        methods:{
            removeFile(index){
                this.accessory.splice(index,1)
            },
            close(){
                this.openAdd=false
            },
            selectOpen(type){
                this.peopleType = type+(Math.random()+'').slice(2,10)
                this.openAdd = true
            },
            remove(type,index){
                if(type){
                    this.receivers_data.splice(index,1)
                }else{
                    this.approvers_data.splice(index,1)
                }
            },
            choose(arr){
                this.openAdd=false
                if(this.peopleType.indexOf('app')!=0){
                    this.receivers_data = JSON.parse(JSON.stringify(arr))
                }else{
                    this.approvers_data = JSON.parse(JSON.stringify(arr))
                }
            },
            submitForm(formName){
                if(!this.btnStatus) return ''

                this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.submit()
                } else {
                    return false;
                    
                }
                });
            },
            submit(){

                if(!this.approvers_data.length){
                    this.$message.error('请选择审批人');
                    return;
                }

                let that = this;
                
                let auditUserIds = '',receiverIds = '',auditCompanyIds="",receiverCompanyIds="",fileObj,params;

                receiverIds = that.Util.getIds(that.receivers_data,'userId')
                auditUserIds = that.Util.getIds(that.approvers_data,'userId')
                auditCompanyIds = that.Util.getIds(that.approvers_data,'companyId')
                receiverCompanyIds = that.Util.getIds(that.receivers_data,'companyId')
                 fileObj = that.Util.fileFo(that.accessory)

                params = {
                    Id :'', // id
                    contractName:that.form.contractName,//合同名称
                    contractNoInput:that.form.contractNoInput, //合同编号
                    applyCompany:that.form.applyCompany,//送审单位名称
                    applyUserName:that.form.applyUserName, //项目责任人
                    receiveCompany:that.form.receiveCompany, //使用单位名称
                    reveiveUserName:that.form.reveiveUserName, //使用单位负责人
                    contractDesc:that.form.contractDesc.replace(/\n/g, '<br/>'), //合同要点说明
                    contractObj:that.form.contractObj, //合同标的
                    Url : fileObj.urlStr, //附件
                    fileName:fileObj.fileNameStr, 
                    fileSize:fileObj.fileSizeStr,
                    auditUserIds, //审批人
                    receiverIds, //抄送人
                    auditCompanyIds,
                    receiverCompanyIds,
                    draftFlag : 0, //草稿还是发送
                }

                this.Ajax.postForm('/work/contract/save',params).then(res=>{
                    if(res.data.h.code!=200){
                                that.$message(res.data.h.msg)
                            }else if(res.data.h.code == 200){
                             that.btnStatus = false;
                                that.$message({
                                    showClose: true,
                                    message: '提交成功!',
                                    type: 'success',
                                    onClose:function(){
                                        location.href = that.Service.baseUrl+'myApply'
                                        setTimeout(()=>{
                                        that.btnStatus = true
                                    },2000)
                                    }
                                });
                                
                            }
                })

            }
        }
    }
</script>

<style lang="stylus" scoped>
 @import "./../../style/oa.styl"

section {
    padding 30px;
}


</style>