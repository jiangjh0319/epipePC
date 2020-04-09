<template>
    <section>
        <HeadTitle
            title="补卡"
            icon='hetongshenpi'
        ></HeadTitle>
        <div style="padding-top:30px;">
            <el-form ref="form" :rules="rules" :model="form" label-width="140px">
                <el-form-item label="文件标题" prop="absenceTitle"> 
                    <el-input v-model="form.absenceTitle" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="提交人" > 
                    <el-input v-model="form.userName" disabled placeholder="请输入提交人"></el-input>
                </el-form-item>
                <el-form-item label="所属部门"> 
                    <el-input v-model="form.departmentName" disabled placeholder="请输入所属部门"></el-input>
                </el-form-item>

                <div v-for="(item,index) in form.datas" :key="index">
                    <div class="info" v-if="form.datas.length>1">
                        <span>异常信息({{index+1}})</span>

                        <a>删除</a>
                    </div>
                    <el-form-item label="日期" :prop="'datas[0].absenceDate'">
                    <!-- <el-input v-model="form.name"></el-input> -->
                        <el-date-picker
                            v-model="item.absenceDate"
                            type="datetime"
                            placeholder="请选择">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item class="textareaBox" label="原因" :prop="'datas[0].absenceReason'">
                            <el-input  type="textarea" v-model="item.absenceReason" maxlength="1000" placeholder="请输入异常原因">
                            </el-input>
                            <span class="textNum">{{item.wordCount}}/1000</span>
                    </el-form-item>
                </div>
              

                <File :accessory="accessory"
                    v-on:remove="removeFile"
                >
                </File>

                <!-- <Approve
                    :approvers_data='approvers_data'
                    v-on:selectOpen='selectOpen'
                    v-on:remove='remove'
                    guideType=2
                >

                </Approve> -->
                <Approve
                    :approver_list='allApprovers'
                    v-on:selectOpen='selectOpen'
                    v-on:remove='remove'
                    hintType=2
                    v-on:del_poeple="del_poeple"
                    v-on:address="add_people"
                >
                </Approve>

                <Copy
                    :receivers_data='receivers_data'
                    v-on:selectOpen='selectOpen'
                    v-on:remove='remove'
                >
                </Copy>

                 <div class="btn_box">
                    <a :class="btnStatus?'btn':'btn disabled'"  @click="submitForm('form')">提交</a>
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
    // import Approve from './../../components/oa/approve_contacts.vue'
    import Approve from './../../components/oa/new_approve.vue'
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
                    absenceTitle:'',
                    userName:'',
                    departmentName:'',
                    datas:[
                        {
                            absenceDate:'',
                            absenceReason:'',
                            wordCount:0,

                        }
                    ]
                },

                stampName:[],
                stampType:[],
                rules:{
                    absenceTitle:[
                        { required: true, message: '内容不能为空', trigger: 'blur' },
                        { min:2, max: 100, message: '长度在不能超过100字符或少于2个字符', trigger: 'blur' }
                    ],
                    'datas[0].absenceDate':[
                        { required: true, message: '请选择补卡时间', trigger: 'blur' },
                    ],
                    'datas[0].absenceReason':[
                        { required: true, message: '异常信息不能为空', trigger: 'blur' },
                        { min:6, max: 1000, message: '长度在不能超过100字符或少于6个字符', trigger: 'blur' }

                    ]
                },
                btnStatus:true,
                openAdd:false,
                peopleType:false,//打开通讯录类型
                
                linkAuditNum:'',
                applyLinkIds:'',
                allApprovers:[],
                showCopy:false,
                showGroup:false,
                approver_index:0,

            }
        },
        watch:{
            'form.datas':{
                deep:true,
                handler:function(newVal,oldVal){

                    newVal.forEach(item=>{
                        item.wordCount = item.absenceReason.length
                    })
                }
            }
        },
        created(){
            document.title='补卡'

            this.Ajax.get('/user/info').then(res=>{
                this.form.departmentName = res.data.b.officeName
                this.form.userName = res.data.b.name
            })
            // added 新审批组件获取审批人数据
            this.axios.get('/process/apply/enter?req=7').then((res)=>{
                let data = res.data.b;
                this.allApprovers  = this.Util.approverDataInit(data.links);
                this.linkAuditNum = data.linkAuditNum;
                this.applyLinkIds = data.applyLinkIds;
                
                this.showCopy = data.approvalReceiverFlag=='1'?true:false;
                if(data.receivers.length>0){
                        this.receivers_data = data.receivers
                }
            })
         
        },
        mounted(){
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
                // modify 修改审批组件方法
                this.openAdd=false
                if(this.peopleType.indexOf('other')!=0){
                    this.receivers_data = JSON.parse(JSON.stringify(arr))
                }else{
                    this.allApprovers[this.approver_index].auditers = JSON.parse(JSON.stringify(arr))
                }
            },
            // added 审批组件新增函数 --start 
            add_people(index){
                this.approver_index = index
                this.showGroup = this.allApprovers[index].approvalUserScope=='0'?true:false;
                this.approvers_data = this.allApprovers[index].auditers
                this.peopleType = 'other'+(Math.random()+'').slice(2,10)
                setTimeout(()=>{
                    this.openAdd = true
                },200)
            },
            del_poeple(index,num){
                this.allApprovers[index].auditers.splice(num,1)
            },
            // --end
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
            // modify 修改submit函数
            submit(){
                let that = this;

                if(this.Util.checkApprovers(this.allApprovers)){
                    this.$message('请选择审批人!')
                    return 
                }

                let auditUserIds = '',receiverIds = '',auditCompanyIds="",receiverCompanyIds="",fileObj,params,approves;
                receiverIds = this.Util.getIds(this.receivers_data,'userId')
                receiverCompanyIds = this.Util.getIds(this.receivers_data,'companyId')
                fileObj = this.Util.fileFo(this.accessory)
                approves = this.Util.approverFormat(this.allApprovers,this.linkAuditNum)
                
                // if(!this.approvers_data.length){
                //     this.$message.error('请选择审批人');
                //     return;
                // }

                // let that = this;
                
                // let auditUserIds = '',receiverIds = '',auditCompanyIds="",receiverCompanyIds="",fileObj,params;

                // receiverIds = that.Util.getIds(that.receivers_data,'userId')
                // auditUserIds = that.Util.getIds(that.approvers_data,'userId')
                // auditCompanyIds = that.Util.getIds(that.approvers_data,'companyId')
                // receiverCompanyIds = that.Util.getIds(that.receivers_data,'companyId')
                // fileObj = that.Util.fileFo(that.accessory)

                params = {
                    id :'', // id
                    absenceTitle:that.form.absenceTitle,//标题

                    url : fileObj.urlStr, //附件
                    fileName:fileObj.fileNameStr, 
                    fileSize:fileObj.fileSizeStr,
                    // auditUserIds, //审批人
                    // receiverIds, //抄送人

                    receiverCompanyIds,
                    auditUserIds:approves.userIdsStr, //审批人
                    auditCompanyIds:approves.companyIdsStr,
                    applyLinkIds:this.applyLinkIds,
                    linkAuditNum:approves.numStr,

                    auditCompanyIds,
                    receiverCompanyIds,
                    draftFlag : 0, //草稿还是发送
                }

                that.form.datas.forEach((item,index)=>{
                    params['absenceList['+index+'].absenceDate'] = that.Util.getDate(item.absenceDate)
                    params['absenceList['+index+'].absenceReason'] = item.absenceReason.replace(/\n/g, '<br/>')
                })


                this.Ajax.postForm('/work/absence/save',params).then(res=>{
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

.textNum{
    right:-120px ;
}

.info{

    span{
        color:#609df6;
    }

    a{
        color:#fd545c;
        cursor pointer;
    }
}

iframe{
}


</style>