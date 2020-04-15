<template>
    <div class="main">
        <HeadTitle
            title="就餐"
            icon='qingjia'
        ></HeadTitle>
        <div class="content">
            <el-form ref="form" :rules="rules" :model="form" label-width="130px">
                <el-form-item label="文件标题" prop="mealTitle"> 
                    <el-input v-model="form.mealTitle" placeholder="请输入标题"></el-input>
                </el-form-item>
                <el-form-item label="提交人" > 
                    <el-input v-model="form.userName" disabled placeholder="请输入提交人"></el-input>
                </el-form-item>
                <el-form-item label="所属部门"> 
                    <el-input v-model="form.departmentName" disabled placeholder="请输入所属部门"></el-input>
                </el-form-item>


                <el-form-item label="就餐人数" prop="num"> 
                    <el-input v-model="form.num" placeholder="请输入就餐人数"></el-input>
                </el-form-item>

                <el-form-item label="就餐类型" prop="mealType">
                    <!-- <el-input v-model="form.name"></el-input> -->
                    <el-select v-model="form.mealType" placeholder="请选择">
                        <el-option :label="item.key" :value="item.value" v-for="item in form.type" :key="item.value"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="开始时间" prop="beginTime">
                    <!-- <el-input v-model="form.name"></el-input> -->
                    <el-date-picker
                        v-model="form.beginTime"
                        type="datetime"
                        placeholder="请选择">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="结束时间" prop="endTime">
                    <el-date-picker
                        v-model="form.endTime"
                        type="datetime"
                        placeholder="请选择">
                    </el-date-picker>
                    <!-- <el-input v-model="form.name"></el-input> -->
                </el-form-item>
                <el-form-item class="textareaBox" label="就餐标准" prop="mealStandard" >
                     <el-input  type="textarea" v-model="form.mealStandard" maxlength="500" placeholder="请输入就餐标准">
                     </el-input>
                     <span class="textNum">{{mealStandardCount}}/500</span>
                </el-form-item>
                 <el-form-item class="textareaBox" label="人员名单" prop="mealPersons" >
                     <el-input  type="textarea" v-model="form.mealPersons" maxlength="500" placeholder="请输入人员名单">
                     </el-input>
                     <span class="textNum">{{mealPersonsCount}}/500</span>
                </el-form-item>
                 <el-form-item class="textareaBox" label="备注" prop="mealRemarks" >
                     <el-input  type="textarea" v-model="form.mealRemarks" maxlength="1000" placeholder="请输入备注">
                     </el-input>
                     <span class="textNum">{{mealRemarksCount}}/1000</span>
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
                    callback(new Error('请输入正确的就餐人数'));
                } else {
                 callback();
                }
            };
            var beginCheck = (rule, value, callback) => {
                if (this.form.endTime!=''&&value.getTime()>=this.form.endTime.getTime()) {
                    callback(new Error('开始时间不能大于结束时间'));
                } else {
                 callback();
                }
            };
            var endCheck = (rule, value, callback) => {
                if (this.form.beginTime!=''&&value.getTime()<=this.form.beginTime.getTime()) {
                    callback(new Error('结束时间不能小于开始时间'));
                   
                } else {
                 callback();
                }
            };
            return {
                form: {
                    name: '',
                    mealTitle:'',
                    num:'',
                    type: [],
                    mealType:'',
                    mealPersons:'',
                    mealRemarks:'',
                    mealStandard:'',
                    beginTime:'',
                    endTime:'',
                    departmentName:'',
                    userName:''
                },
                rules: {
                    mealTitle:[
                        { required: true, message: '请输入文件标题', trigger: 'blur' },
                        { min:1, max: 1000, message: '长度在不能超过100字符', trigger: 'blur' }

                    ],
                    num: [
                        { required: true, message: '请输入就餐人数', trigger: 'blur' },
                        { validator: checkDay, trigger: 'blur' }
                    ],
                    beginTime:[
                        { required: true, message: '请选择开始时间', trigger: 'change' },
                        { validator: beginCheck, trigger: 'change' }

                    ],
                    mealType:[
                        { required: true, message: '请选择就餐类型', trigger: 'change' },
                    ],
                    endTime:[
                        { required: true, message: '请选择结束时间', trigger: 'change' },
                        { validator: endCheck, trigger: 'change' }

                    ],
                    mealStandard:[
                        { required: true, message: '请输入就餐标准', trigger: 'blur' },
                        { min:1, max: 500, message: '长度在不能超过500字符', trigger: 'blur' }
                    ],
                    mealPersons:[
                        { required: true, message: '请输入人员名单', trigger: 'blur' },
                        { min:1, max: 500, message: '长度在不能超过500字符', trigger: 'blur' }
                    ],
                    mealRemarks:[
                        { min:1, max: 1000, message: '长度在不能超过1000字符', trigger: 'blur' }
                    ]
                },
                approvers_data:[],//审批人
                receivers_data:[],//抄送人
                peopleType:false,//打开通讯录类型
                openAdd:false,
                accessory:[],
                btnStatus:true,
                mealStandardCount:0,
                mealPersonsCount:0,
                mealRemarksCount:0,

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
            document.title='就餐'
            this.Ajax.get('/user/info').then(res=>{
                this.form.departmentName = res.data.b.officeName
                this.form.userName = res.data.b.name
            })
            this.Ajax.get('/work/meal/type').then((res)=>{
                if(res.data.h.code =200 ) this.form.type = res.data.b;
            })
            // added 新审批组件获取审批人数据
            this.axios.get('/process/apply/enter?req=16').then((res)=>{
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
            'form.mealRemarks':function(val){
                this.mealRemarksCount = val.length
            }
        },
        methods:{
            close(){
                this.openAdd=false
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
                    Id :'', // id
                    beginTime:that.Util.getDate(that.form.beginTime), //开始时间
                    endTime :that.Util.getDate( that.form.endTime), //结束时间
                    mealType : that.form.mealType,//就餐类型
                    mealNums:that.form.num, //就餐人数
                    mealPersons: that.form.mealPersons.replace(/\n/g, '<br/>'),
                    mealRemarks: that.form.mealRemarks.replace(/\n/g, '<br/>'),
                    mealStandard: that.form.mealStandard.replace(/\n/g, '<br/>'), //就餐标准
                    
                    // auditUserIds, //审批人
                    receiverIds, //抄送人
                    // auditCompanyIds,
                    // receiverCompanyIds,
                    url : fileObj.urlStr, //附件
                    fileName :fileObj.fileNameStr, //文件名称 
                    fileSize :fileObj.fileSizeStr, //文件大小
                    draftFlag : 0, //草稿还是发送

                    receiverCompanyIds,
                    auditUserIds:approves.userIdsStr, //审批人
                    auditCompanyIds:approves.companyIdsStr,
                    applyLinkIds:this.applyLinkIds,
                    linkAuditNum:approves.numStr,
                    }

                that.Ajax.postForm('/work/meal/save',params).then( (res)=>{
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