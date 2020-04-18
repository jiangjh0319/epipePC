<template>
    <section>
        <HeadTitle
            title="请示函"
            icon='qingshihan'
        ></HeadTitle>
        <div style="padding-top:30px;">
            <el-form ref="form" :rules="rules" :model="form" label-width="110px">
                <el-form-item label="主题" prop="theme"> 
                    <el-input v-model="form.theme" placeholder="请输入主题"></el-input>
                </el-form-item>

                <el-form-item label="请示类型" prop="letterType">
                    <!-- <el-input v-model="form.name"></el-input> -->
                    <el-select v-model="form.letterType" placeholder="请选择">
                        <el-option
                        v-for="item in form.type"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item class="textareaBox" label="请示函内容" prop="desc">
                        <el-input  type="textarea" v-model="form.desc" maxlength="1000" placeholder="请输入请示函事由">
                        </el-input>
                        <span class="textNum">{{wordCount}}/1000</span>
                </el-form-item>

                <File :accessory="accessory"
                    v-on:remove="removeFile"
                >
                </File>

                <!-- <Approve
                    :approvers_data='approvers_data'
                    v-on:selectOpen='selectOpen'
                    v-on:remove='remove'
                    guideType=3
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
                    theme:'',
                    desc:'',
                    letterType:'',
                    type:[],
                },
                rules:{
                    letterType: [
                        { required: true, message: '请选择请示类型', trigger: 'change' },
                    ],
                    desc:[
                        { required: true, message: '请示函内容不能为空', trigger: 'blur' },
                    ],
                    theme:[
                        { required: true, message: '主题能为空', trigger: 'blur' },
                        { min:2, max: 100, message: '长度在不能超过100字符或少于2个字符', trigger: 'blur' }
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
        components:{
            HeadTitle,
            File,
            Approve,
            AddressList,
            Copy
        },
        created(){
            document.title='请示函'
            this.axios.get('/work/letter/type').then((res)=>{
                if(res.data.h.code =200 ){
                    res.data.b.forEach(item=>{
                        this.form.type.push({value:item.value,label:item.key})
                    })
                }
            })
            // added 新审批组件获取审批人数据
            this.axios.get('/process/apply/enter?req=1').then((res)=>{
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
        watch:{
            'form.desc':function(val){
                this.wordCount = val.length
            }
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
                //  fileObj = that.Util.fileFo(that.accessory)
                
                params = {
                    Id :'', // id
                    theme:that.form.theme,//主题
                    content:that.form.desc.replace(/\n/g, '<br/>'), //请示函内容0
                    Url : fileObj.urlStr, //附件
                    letterType:that.form.letterType,
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


                this.Ajax.postForm('/work/letter/save',params).then(res=>{
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