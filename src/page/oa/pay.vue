<template>
    <div class="main">
        <HeadTitle
            title="付款"
            icon='qingjia'
        ></HeadTitle>
        <div class="content">
            <el-form ref="form" :rules="rules" :model="form" label-width="130px">
                <el-form-item label="文件标题" prop="payTitle"> 
                    <el-input v-model="form.payTitle" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="申请人" > 
                    <el-input v-model="form.userName" disabled placeholder="请输入提交人"></el-input>
                </el-form-item>
                <el-form-item label="所属部门"> 
                    <el-input v-model="form.departmentName" disabled placeholder="请输入所属部门"></el-input>
                </el-form-item>


                <el-form-item label="付款金额" prop="payAmount"> 
                    <el-input v-model="form.payAmount" placeholder="请输入付款金额"></el-input>
                </el-form-item>

                <el-form-item label="付款方式" prop="payType">
                    <!-- <el-input v-model="form.name"></el-input> -->
                    <el-select v-model="form.payType" placeholder="请选择">
                        <el-option :label="item.key" :value="item.value" v-for="item in form.type" :key="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="付款日期" prop="payTime">
                    <!-- <el-input v-model="form.name"></el-input> -->
                    <el-date-picker
                        v-model="form.payTime"
                        type="datetime"
                        placeholder="请选择">
                    </el-date-picker>
                </el-form-item>
                 <el-form-item label="收款人全称"> 
                    <el-input v-model="form.receiverName" placeholder="请输入收款人全称"></el-input>
                </el-form-item>
                 <el-form-item label="银行账户" > 
                    <el-input v-model="form.bankAcount" placeholder="请输入银行账户"></el-input>
                </el-form-item>
                 <el-form-item label="开户行" > 
                    <el-input v-model="form.bankName" placeholder="请输入开户行"></el-input>
                </el-form-item>
                 <el-form-item class="textareaBox" label="付款事由" prop="payReason" >
                     <el-input  type="textarea" v-model="form.payReason" maxlength="1000" placeholder="请输入付款事由">
                     </el-input>
                     <span class="textpayAmount">{{payReasonCount}}/1000</span>
                </el-form-item>

                <File :accessory="accessory"
                    v-on:remove="removeFile"
                >

                </File>

                <!-- <Approve
                    :approvers_data='approvers_data'
                    v-on:selectOpen='selectOpen'
                    v-on:remove='remove'
                    guideType=0
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
    </div>
</template>

<script>
    import HeadTitle from './../../components/common/headTitle.vue'
    // import Approve from './../../components/oa/approve_contacts.vue'
    import Approve from './../../components/oa/new_approve.vue'
    import Copy from './../../components/oa/copy_contacts.vue'
    import AddressList from './../../components/common/addressList.vue'
    import File from './../../components/oa/file.vue'

    export default {
        data() {
             var checkDay = (rule, value, callback) => {
                if (isNaN(value)) {
                    callback(new Error('请输入正确的付款金额'));
                } else {
                 callback();
                }
            };
            return {
                form: {
                    name: '',
                    payTitle:'',
                    payAmount:'',
                    type: [],
                    payType:'',
                    mealPersons:'',
                    payReason:'',
                    mealStandard:'',
                    payTime:'',
                    endTime:'',
                    departmentName:'',
                    userName:''
                },
                rules: {
                    payTitle:[
                        { required: true, message: '请输入文件标题', trigger: 'blur' },
                        { min:1, max: 1000, message: '长度在不能超过100字符', trigger: 'blur' }

                    ],
                    payAmount: [
                        { required: true, message: '请输入就餐人数', trigger: 'blur' },
                        { validator: checkDay, trigger: 'blur' }
                    ],
                    payTime:[
                        { required: true, message: '请选择付款时间', trigger: 'change' },
                    ],
                    payType:[
                        { required: true, message: '请选择就餐类型', trigger: 'change' },
                    ],
                    mealStandard:[
                        { required: true, message: '请输入就餐标准', trigger: 'blur' },
                        { min:1, max: 500, message: '长度在不能超过500字符', trigger: 'blur' }
                    ],
                    mealPersons:[
                        { required: true, message: '请输入人员名单', trigger: 'blur' },
                        { min:1, max: 500, message: '长度在不能超过500字符', trigger: 'blur' }
                    ],
                    payReason:[
                        { min:1, max: 1000, message: '长度在不能超过1000字符', trigger: 'blur' }
                    ]
                },
                
                approvers_data:[],//审批人
                receivers_data:[],//抄送人
                peopleType:false,//打开通讯录类型
                openAdd:false,
                accessory:[],
                btnStatus:true,
                payReasonCount:0,

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
            AddressList,
            File,
            Approve,
            Copy
        },
        created(){
            document.title='付款'
            this.Ajax.get('/user/info').then(res=>{
                this.form.departmentName = res.data.b.officeName
                this.form.userName = res.data.b.name
            })
            this.Ajax.get('/work/pay/type').then((res)=>{
                    if(res.data.h.code =200 ) this.form.type = res.data.b;
            })

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
        watch:{
            'form.mealStandard':function(val){
                this.mealStandardCount = val.length
            },
            'form.mealPersons':function(val){
                this.mealPersonsCount = val.length
            },
            'form.payReason':function(val){
                this.payReasonCount = val.length
            }
        },
        methods:{
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
                if(this.peopleType.indexOf('other')!=0){
                    this.receivers_data = JSON.parse(JSON.stringify(arr))
                }else{
                    this.allApprovers[this.approver_index].auditers = JSON.parse(JSON.stringify(arr))
                }
            },
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

                if(this.Util.checkApprovers(this.allApprovers)){
                    this.$message('请选择审批人!')
                    return 
                }

                let auditUserIds = '',receiverIds = '',auditCompanyIds="",receiverCompanyIds="",fileObj,params,approves;
                receiverIds = this.Util.getIds(this.receivers_data,'userId')
                receiverCompanyIds = this.Util.getIds(this.receivers_data,'companyId')
                fileObj = this.Util.fileFo(this.accessory)
                approves = this.Util.approverFormat(this.allApprovers,this.linkAuditNum)



                 params = {
                    Id :'', // id
                    payDate:this.Util.getDate(this.form.payTime), 
                    payType : this.form.payType,
                    payAmount:this.form.payAmount,
                    bankName:this.form.bankName,
                    bankAcount:this.form.bankAcount,
                    receiverName:this.form.receiverName, //收款人
                    payReason: this.form.payReason.replace(/\n/g, '<br/>'),
                    payTitle:this.form.payTitle,
                    urls : fileObj.urlStr, //附件
                    fileNames: fileObj.fileNameStr, 
                    fileSizes: fileObj.fileSizeStr,
                    receiverIds, //抄送人
                    receiverCompanyIds,
                    
                    auditUserIds:approves.userIdsStr, //审批人
                    auditCompanyIds:approves.companyIdsStr,
                    applyLinkIds:this.applyLinkIds,
                    linkAuditNum:approves.numStr,
                    
                    receiverCompanyIds,
                    draftFlag : 0, //草稿还是发送
                    }
                let that = this;
                this.Ajax.postForm('/work/pay/save',params).then( (res)=>{
                        if(res.data.h.code!=200){
                            this.$message(res.data.h.msg)
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
            },
            removeFile(index){
                this.accessory.splice(index,1)
            },
        }
    }
</script>

<style lang="stylus" scoped>
    // @import "./../../style/oa.styl"

    .main{
        padding 30px
    }

    .content{
        padding-top  30px
    }

    /deep/ .el-form-item__label{
            font-size 16px;
    }

    /deep/ .el-input__inner{
            width 240px
        }
     /deep/ .textareaBox{
        width 650px
        position relative
     }

     .main>>>.el-textarea__inner{
         border-color:#ccc;
        letter-spacing: 2px;
     }

    .textNum{
            position absolute
            right: -90px;
            bottom: -5px;
            color #999
    }   

    .textNum{
        right:-120px;
    }
    
     /deep/ .textareaBox textarea{
        width 650px
        height 145px;
        resize none
        padding-bottom 30px;
    }

  .main>>>.el-input__inner{
    border 1px solid #ccc;
    }

    .main>>>.el-dialog__header{
        border-bottom:1px solid #ccc;
        padding:10px;
        line-height:20px;

        .el-dialog__headerbtn{
            top:15px;
            right:10px;
        }

        .el-dialog__title{
            font-size 16px;
        }
    }
    .main>>>.el-dialog__footer{
        text-align center;
    }

    .main>>>.el-dialog__body{
        padding-bottom:0px;
    }

  .main  .btn_box{
        width:780px;
        text-align center;

        .disabled{
            background-color:#96ecc1;
        }
    }

    .btn_box .btn{
        display: inline-block;
        width 160px;
        height:35px;
        line-height 35px;
        text-align center;
        color #fff;
        border-radius 4px;
        background-color:#24b36b;
        cursor pointer;
    }



</style>