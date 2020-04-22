<template>
    <div class="main">
        <HeadTitle
            title="借款"
            icon='borrow'
        ></HeadTitle>
        <div class="content">
            <el-form ref="form" :rules="rules" :model="form" label-width="130px">
                <el-form-item label="文件标题" prop="borrowTitle"> 
                    <el-input v-model="form.borrowTitle" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="申请人" > 
                    <el-input v-model="form.userName" disabled placeholder="请输入提交人"></el-input>
                </el-form-item>
                <el-form-item label="所属部门"> 
                    <el-input v-model="form.departmentName" disabled placeholder="请输入所属部门"></el-input>
                </el-form-item>


                <el-form-item label="借款金额" prop="borrowerAmount"> 
                    <el-input v-model="form.borrowerAmount" placeholder="请输入借款金额" type='number'></el-input>
                </el-form-item>

                <el-form-item label="使用日期" prop="useDate">
                    <el-date-picker
                        v-model="form.useDate"
                        type="date"
                        placeholder="请选择">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="预计归还日期" prop="returnDate">
                    <el-date-picker
                        v-model="form.returnDate"
                        type="date"
                        placeholder="请选择">
                    </el-date-picker>
                </el-form-item>
                 <el-form-item label="收款人全称" prop="borrowerName"> 
                    <el-input v-model="form.borrowerName" placeholder="请输入收款人全称"></el-input>
                </el-form-item>
                 <el-form-item label="银行账户" prop="borrowerAccount" > 
                    <el-input v-model="form.borrowerAccount" placeholder="请输入银行账户" type="number"></el-input>
                </el-form-item>
                 <el-form-item label="开户行" prop="borrowerBank"> 
                    <el-input v-model="form.borrowerBank" placeholder="请输入开户行"></el-input>
                </el-form-item>
                 <el-form-item class="textareaBox" label="借款事由" prop="borrowReason">
                     <el-input  type="textarea" v-model="form.borrowReason" maxlength="1000" placeholder="请输入借款事由">
                     </el-input>
                     <span class="textpayAmount">{{borrowReasonCount}}/1000</span>
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
                    borrowTitle:'',
                    borrowerAmount:'',
                    type: [],
                    mealPersons:'',
                    borrowReason:'',
                    mealStandard:'',
                    borrowerName:'',
                    borrowerAccount:'',
                    borrowerBank:'',
                    useDate:'',
                    returnDate:'',
                    endTime:'',
                    departmentName:'',
                    userName:''
                },
                rules: {
                    borrowTitle:[
                        { required: true, message: '请输入文件标题', trigger: 'blur' },
                        { min:1, max: 1000, message: '长度在不能超过100字符', trigger: 'blur' }

                    ],
                    borrowerAmount: [
                        { required: true, message: '请输入借款金额', trigger: 'blur' },
                        { validator: checkDay, trigger: 'blur' }
                    ],
                    useDate:[
                        { required: true, message: '请选择使用时间', trigger: 'change' },
                    ],
                    returnDate:[
                        {  required: true, message: '请选择预计归还日期时间', trigger: 'change' },
                    ],
                    mealStandard:[
                        { required: true, message: '请输入就餐标准', trigger: 'blur' },
                        { min:1, max: 500, message: '长度在不能超过500字符', trigger: 'blur' }
                    ],
                    mealPersons:[
                        { required: true, message: '请输入人员名单', trigger: 'blur' },
                        { min:1, max: 500, message: '长度在不能超过500字符', trigger: 'blur' }
                    ],
                    borrowReason:[
                        { required: true, message: '请输入借款事由', trigger: 'blur' },
                        { min:1, max: 1000, message: '长度在不能超过1000字符', trigger: 'blur' }
                    ],
                    borrowerName:[
                        { required: true, message: '请输入收款人全称', trigger: 'blur' },
                    ],
                    borrowerAccount:[
                        { required: true, message: '请输入银行账户', trigger: 'blur' },
                    ],
                    borrowerBank:[
                        { required: true, message: '请输入开户行', trigger: 'blur' },
                    ]
                },
                
                approvers_data:[],//审批人
                receivers_data:[],//抄送人
                peopleType:false,//打开通讯录类型
                openAdd:false,
                accessory:[],
                btnStatus:true,
                borrowReasonCount:0,
                isMore:true,
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
            document.title='借款'
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
            'form.borrowReason':function(val){
                this.borrowReasonCount = val.length
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
                this.isMore = this.allApprovers[index].remarks=='0'?false:true;
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
                    // borrowTitle:this.form.borrowTitle,
                    // borrowReason: this.form.borrowReason.replace(/\n/g, '<br/>'),
                    // // useDate:this.Util.getDate(this.form.useDate), 
                    // // returnDate:this.Util.getDate(this.form.returnDate), 
                    // useDate:'2020-1-5',//付款时间
                    // returnDate:'2020-1-15',//付款时间
                    // borroweAmount:this.form.borrowerAmount,
                    // borrowerBank:this.form.borrowerBank,
                    // borrowerAccount:this.form.borrowerAccount,
                    // borrowerName:this.form.borrowerName, //收款人
                    borrowTitle:this.form.borrowTitle,//标题
                    borrowReason:this.form.borrowReason.replace(/\n/g, '<br/>'), //付款说明
                    borrowAmount:this.form.borrowerAmount, //付款金额
                    borrowerBank:this.form.borrowerBank,
                    useDate:this.Util.getDate(this.form.useDate),//付款时间
                    returnDate:this.Util.getDate(this.form.returnDate),//付款时间
                    borrowerAccount:this.form.borrowerAccount,
                    borrowerName:this.form.borrowerName, //收款人
            
         
                    urls : fileObj.urlStr, //附件
                    fileNames: fileObj.fileNameStr, 
                    fileSizes: fileObj.fileSizeStr,
                    receiverIds, //抄送人
                    receiverCompanyIds,
                    
                    auditUserIds:approves.userIdsStr, //审批人
                    auditCompanyIds:approves.companyIdsStr,
                    applyLinkIds:this.applyLinkIds,
                    linkAuditNum:approves.numStr,
                    draftFlag : 0, //草稿还是发送
                    }
                let that = this;
                this.Ajax.postForm('/work/borrow/save',params)
                //  that.axios({
                // method:"post",
                // url:`${this.Service.getBorrowSave}`,
                // headers:{
                //     'Content-type': 'application/x-www-form-urlencoded'
                // },
                // data:params,
                // transformRequest: [function (data) {
                //     let ret = ''
                //     for (let it in data) {
                //     ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                //     }
                //     return ret
                // }],
                // })
                .then( (res)=>{

                    console.log(res)
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