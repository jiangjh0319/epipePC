<template>
    <section>
        <HeadTitle
            title="用印"
            icon='hetongshenpi'
        ></HeadTitle>
        <div style="padding-top:30px;">
            <el-form ref="form" :rules="rules" :model="form" label-width="140px">
                <el-form-item label="标题" prop="stampApplyTitle"> 
                    <el-input v-model="form.stampApplyTitle" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="用印部门" prop="departmentName"> 
                    <el-input v-model="form.departmentName" disabled placeholder="请输入用印部门"></el-input>
                </el-form-item>
                <el-form-item label="用印承办人" prop="userName"> 
                    <el-input v-model="form.userName" disabled placeholder="请输入用印承办人"></el-input>
                </el-form-item>
                <el-form-item label="文件名称" prop="stampFileName"> 
                    <el-input v-model="form.stampFileName" placeholder="请输入文件名称"></el-input>
                </el-form-item>
                <el-form-item label="文件类别" prop="stamp"> 
                    <el-select v-model="form.stamp" placeholder="请选择">
                        <el-option
                        v-for="item in stampType"
                        :key="item.value"
                        :label="item.key"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="文件数量" prop="fileQuantity"> 
                    <el-input v-model.number="form.fileQuantity" maxlength="50" placeholder="请输入文件数量"></el-input>
                </el-form-item>
                <el-form-item label="印章名称" prop="type">  
                     <el-select v-model="form.type" placeholder="请选择">
                        <el-option
                        v-for="item in stampName"
                        :key="item.value"
                        :label="item.key"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="textareaBox" label="用印说明" prop="stampApplyReason">
                        <el-input  type="textarea" v-model="form.stampApplyReason" maxlength="1000" placeholder="请输入用印说明">
                        </el-input>
                        <span class="textNum">{{wordCount}}/1000</span>
                </el-form-item>

                <File :accessory="accessory"
                    v-on:remove="removeFile"
                    num=50
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
            :isMore="isMore"
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
                    stampApplyTitle:'',
                    departmentName:'',
                    userName:'',
                    stampFileName:'',
                    fileQuantity:'',
                    stampApplyReason:'',

                    type:'',
                    stamp:'',
                },

                stampName:[],
                stampType:[],
                rules:{
                    stampApplyTitle:[
                        { required: true, message: '内容不能为空', trigger: 'blur' },
                        { min:2, max: 100, message: '长度在不能超过100字符或少于2个字符', trigger: 'blur' }
                    ],
                    stampFileName:[
                        { required: true, message: '内容不能为空', trigger: 'blur' },
                        { min:6, max: 64, message: '长度在不能超过64字符或少于6个字符', trigger: 'blur' }
                    ],
                    stamp:[
                        { required: true, message: '内容不能为空', chang: 'blur' },
                    ],
                    type:[
                        { required: true, message: '内容不能为空', chang: 'blur' },
                    ],
                    fileQuantity:[
                        { required: true, message: '内容不能为空', trigger: 'blur' },
                        { type: 'number', message: '年龄必须为数字值'}
                    ],

                    stampApplyReason:[
                        { required: true, message: '合同详情不能为空', trigger: 'blur' },
                        { min:1, max: 1000, message: '长度在不能超过1000字符', trigger: 'blur' }
                    ]
                },
                btnStatus:true,
                openAdd:false,
                peopleType:false,//打开通讯录类型

                linkAuditNum:'',
                applyLinkIds:'',
                isMore:true,
                allApprovers:[],
                showCopy:false,
                showGroup:false,
                approver_index:0,
            }
        },
        watch:{
            'form.stampApplyReason':function(val){
                this.wordCount = val.length
            }
        },
        created(){
            document.title='用印'

            this.Ajax.get('/user/info').then(res=>{
                this.form.departmentName = res.data.b.officeName
                this.form.userName = res.data.b.name
            })

            this.Ajax.get('/work/stamp/fileCategory').then((res)=>{
                if(res.data.h.code =200 ) this.stampType = res.data.b
            })
            this.Ajax.get('/work/stamp/sealName').then((res)=>{
                if(res.data.h.code =200 ) this.stampName = res.data.b;
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
                this.isMore = true;
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
                this.isMore = this.allApprovers[index].remarks=='0'?false:true;
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
                    Id :'', // id
                    stampApplyTitle:that.form.stampApplyTitle,//标题
                    stampFileName:that.form.stampFileName, //文件名称
                    sealName:this.form.stamp, //印章名称
                    fileCategory:that.form.type, //文件类别
                    fileQuantity:that.form.fileQuantity, //文件数量
                    stampApplyReason:that.form.stampApplyReason, 

                    Url : fileObj.urlStr, //附件
                    fileName:fileObj.fileNameStr, 
                    fileSize:fileObj.fileSizeStr,
                    // auditUserIds, //审批人
                    receiverIds, //抄送人
                    // auditCompanyIds,
                    // receiverCompanyIds,
                    draftFlag : 0, //草稿还是发送

                    receiverCompanyIds,
                    auditUserIds:approves.userIdsStr, //审批人
                    auditCompanyIds:approves.companyIdsStr,
                    applyLinkIds:this.applyLinkIds,
                    linkAuditNum:approves.numStr,
                }

                this.Ajax.postForm('/work/stamp/save',params).then(res=>{
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
    right:-120px;
}

</style>