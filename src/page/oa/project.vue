<template>
    <div class="main">
        <HeadTitle
            title="项目立项"
            icon='project'
        ></HeadTitle>
        <div class="content">
            <el-form ref="form" :rules="rules" :model="form" label-width="140px">
                <el-form-item label="文件标题" prop="projectTitle"> 
                    <el-input v-model="form.projectTitle" placeholder="请输入文件标题" ></el-input>
                </el-form-item>
                <el-form-item label="立项申请人"> 
                    <el-input v-model="form.userName" placeholder="请输入申请人" disabled></el-input>
                </el-form-item>
                <el-form-item label="所属部门"> 
                    <el-input v-model="form.departmentName" placeholder="请输入所属部门" disabled></el-input>
                </el-form-item>
                <el-form-item label="项目编号" prop="projectNo"> 
                    <el-input v-model="form.projectNo" placeholder="请输入项目编号" type="number"></el-input>
                </el-form-item>
                <el-form-item label="申请时间" prop="applyDate">
                    <el-date-picker
                        v-model="form.applyDate"
                        type="datetime"
                        placeholder="请选择">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="项目名称" prop="projectName"> 
                    <el-input v-model="form.projectName" placeholder="请输入项目名称" ></el-input>
                </el-form-item>
                <el-form-item label="预估金额(元)" prop="projectBudget"> 
                    <el-input v-model="form.projectBudget" placeholder="请输入项目预估金额" type="number"></el-input>
                </el-form-item>
                <el-form-item label="立项时间" prop="buildDate">
                    <el-date-picker
                        v-model="form.buildDate"
                        type="datetime"
                        placeholder="请选择">
                    </el-date-picker>
                </el-form-item>
                <el-form-item label="项目周期" prop="projectDate"> 
                    <el-input v-model="form.projectDate" placeholder="请输入项目周期"></el-input>
                </el-form-item>
                <el-form-item label="单位联系人" prop="connectionName"> 
                    <el-input v-model="form.connectionName" placeholder="请输入单位联系人"></el-input>
                </el-form-item>
                <el-form-item class="textareaBox" label="项目背景" prop="projectBackground" >
                     <el-input  type="textarea" v-model.trim="form.projectBackground" maxlength="150" placeholder="请输入项目背景,限定1000字">
                     </el-input>
                     <span class="textNum">{{wordCount}}/1000</span>
                </el-form-item>
                <el-form-item class="textareaBox" label="项目需求概述" prop="description" >
                     <el-input  type="textarea" v-model.trim="form.description" maxlength="1000" placeholder="请输入项目需求概述,限定1000字">
                     </el-input>
                     <span class="textNum">{{descriptionConut}}/1000</span>
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
                    hintType=0
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
                <Personnel
                :Personnel_data='Personnel_data'
                v-on:selectOpen='selectOpen'
                v-on:remove='remove'
                v-show="isShowPer"
                >
                </Personnel>
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
            :personnels="Personnel_data"
            :isMore="isMore"
        ></AddressList>
    
    </div>
</template>

<script>
    import HeadTitle from './../../components/common/headTitle.vue'
    import Approve from './../../components/oa/new_approve.vue'
    import Copy from './../../components/oa/copy_contacts.vue'
    import Personnel from './../../components/oa/personnel_contacts.vue'
    import AddressList from './../../components/common/addressList.vue'
    import File from './../../components/oa/file.vue'
    import myMap from './../../components/common/map.vue'
    // import BMap from 'BMap'
    export default {
        data() {
             var checkDay = (rule, value, callback) => {
                if (value*10%5!=0) {
                    callback(new Error('请输入正确的请假天数'));
                } else {
                 callback();
                }
            };
            // var beginCheck = (rule, value, callback) => {
            //     if (this.form.buildDate!=''&&value.getTime()>=this.form.buildDate.getTime()) {
            //         callback(new Error('用车时间不能大于返回时间'));
            //     } else {
            //      callback();
            //     }
            // };
            // var endCheck = (rule, value, callback) => {
            //     if (this.form.applyDate!=''&&value.getTime()<=this.form.applyDate.getTime()) {
            //         callback(new Error('返回时间不能小于用车时间'));
                   
            //     } else {
            //      callback();
            //     }
            // };
            return {
                form: {
                    type: [],
                    projectTitle:'',//文件标题
                    userName:'',//用车人
                    departmentName:'',//用车部门
                    projectNo:'',//项目编号
                    projectName:'',//项目名称
                    projectBudget:'',//
                    projectBackground: '',//背景
                    applyDate:'',//开始时间
                    buildDate:'',//结束时间
                    projectDate:'',//周期
                    connectionName:'',
                    description:'',
                    userlocation:'',
                    peerUserIds:''
                },
                rules: {
                    projectTitle:[
                        { required: true, message: '文件标题不能为空', trigger: 'blur' },
                        { min:2, max: 100, message: '长度在不能超过100字符或少于2个字符', trigger: 'blur' }
                    ],
                    projectNo: [
                        { required: true, message: '项目编号不能为空', trigger: 'blur' },
                        // { validator: checkDay, trigger: 'blur' }
                    ],
                    projectName: [
                        { required: true, message: '项目名称不能为空', trigger: 'blur' },
                    ],
                    projectBudget:[
                        { required: true, message: '预估金额不能为空', trigger: 'blur' },
                    ],
                    projectDate: [
                        { required: true, message: '项目周期不能为空', trigger: 'blur' },
                    ],
                    applyDate:[
                        { required: true, message: '申请时间不能为空', trigger: 'change' },
                        // { validator: beginCheck, trigger: 'change' }
                    ],
                    buildDate:[
                        { required: true, message: '立项时间不能为空', trigger: 'change' },
                        // { validator: endCheck, trigger: 'change' }
                    ],
                    connectionName:[
                        { required: true, message: '单位联系人不能为空', trigger: 'blur' },
                    ],
                    projectBackground:[
                        { required: true, message: '项目背景不能为空', trigger: 'blur' },
                        { min:6, max: 1000, message: '长度在不能超过1000字符或者不能少于6个字符', trigger: 'blur' }
                    ],
                    description:[
                        { required: true, message: '项目需求概述不能为空', trigger: 'blur' },
                        { min:6, max: 1000, message: '长度在不能超过1000字符或者不能少于6个字符', trigger: 'blur' }
                    ]
                },
                approvers_data:[],//审批人
                receivers_data:[],//抄送人
                Personnel_data:[],//同行人员
                peopleType:false,//打开通讯录类型
                openAdd:false,
                accessory:[],
                btnStatus:true,
                wordCount:0,
                dialogVisible:false,
                address_detail: "", //详细地址
                userlocation:'',
                clearable: true,
                suggestId: "suggestId",
                map : {},
                mk: {},
                showMap:false,
                isShowPer:false,
                personsData:'',
                _index:0,
                showCopy:false,
                showGroup:false,
                approver_index:0,
                linkAuditNum:'',
                applyLinkIds:'',
                isMore:true,
                allApprovers:[],
                ishowDelet:false
            }
        },
        components:{
            HeadTitle,
            AddressList,
            File,
            Approve,
            Copy,
            myMap,
            Personnel
        },
        created(){
            document.title='项目立项'
            let that = this;
             this.axios.get('/outsign/task/type').then(function(res){
                 console.log(res.data.b)
                if(res.data.h.code =200 ){
                    res.data.b.type.forEach(item=>{
                        that.form.type.push({value:item.value,label:item.key})
                    })
                }
            })
            this.axios.post('/user/current/userinfo').then(function(res){
                that.form.departmentName = res.data.b.officeName
                that.form.userName = res.data.b.name
            })
            this.axios.get('/process/apply/enter?req=3').then((res)=>{
                let data = res.data.b;
                console.log(data,'data')
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
            'form.projectBackground':function(val){
                this.wordCount = val.length
            },
            'form.description':function(val){
                this.descriptionConut = val.length
            }
        },
        computed:{
            getAddrDetail(){
                return this.$store.state.addressDetail;
            }
        },
        methods:{
            getMsgData(val){
                this.form.addressDetail = val.address
                this.form.userlocation = val.point;
            },
            getMsgFormSon(data){
                if(data==undefined){

                }else{
                    this.form.addressDetail = data.addr;
                    this.form.userlocation = data.point;
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
            getPersons(){
                this.selectOpen('per');
            },
            getFocus(i){
                this.dialogVisible = true;
                this._index = i;
            },
            close(){
                this.openAdd=false
            },
            choose(arr){
                let arrName = []
                let peerUserIds = [];
                this.openAdd=false
                if(this.peopleType.indexOf('other')==0){
                    this.allApprovers[this.approver_index].auditers = JSON.parse(JSON.stringify(arr))
                    
                }else if(this.peopleType.indexOf('per')==0){

                    this.Personnel_data = JSON.parse(JSON.stringify(arr))
                    for(let val of this.Personnel_data){
                        peerUserIds.push(val.userId)
                        arrName.push(val.name)
                    }
                        let userId = peerUserIds.join(',')
                        this.personsData = arrName.join(',');
                        this.form.projectDate = this.personsData;
                        this.form.peerUserIds = userId;
                }else{
                   this.receivers_data = JSON.parse(JSON.stringify(arr))
                }
            },
            selectOpen(type){
                this.peopleType = type+(Math.random()+'').slice(2,10)
                this.openAdd = true
                this.isMore = true;
            },
            remove(type,index){
                if(type){
                    this.receivers_data.splice(index,1)
                }else{
                    this.approvers_data.splice(index,1)
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
                if(this.Util.checkApprovers(this.allApprovers)){
                    this.$message('请选择审批人!')
                    return 
                }else if(this.form.projectBackground.length>1000||this.form.projectBackground.length<6){
                    this.$message('项目背景不能少于6个或超过1000字符!')
                    return 
                }
                
                let that = this;
                let applyDate = '',buildDate = '',day = '';

                let auditUserIds = '',receiverIds = '',auditCompanyIds="",receiverCompanyIds="",fileObj,params,approves;
                receiverIds = this.Util.getIds(this.receivers_data,'userId')
                receiverCompanyIds = this.Util.getIds(this.receivers_data,'companyId')
                fileObj = this.Util.fileFo(this.accessory)
                approves = this.Util.approverFormat(this.allApprovers,this.linkAuditNum)

          
                 params = {
                    Id :'', // id
                    projectTitle:that.form.projectTitle,//文件标题
                    projectNo: that.form.projectNo,  
                    projectName: that.form.projectName,  //项目名称
                    applyDate:that.Util.getDate(that.form.applyDate),
                    projectBudget:that.form.projectBudget,
                    buildDate:that.Util.getDate( that.form.buildDate),
                    projectDate: that.form.projectDate,  //周期
                    connectionName:that.form.connectionName,
                    projectBackground:that.form.projectBackground,//项目背景
                    description:that.form.description, 
    

                    peerUserIds:that.form.peerUserIds,
                    url : fileObj.urlStr, //附件
                    receiverIds, //抄送人
                    receiverCompanyIds,
                    auditUserIds:approves.userIdsStr, //审批人
                    auditCompanyIds:approves.companyIdsStr,
                    applyLinkIds:this.applyLinkIds,
                    linkAuditNum:approves.numStr,
                    draftFlag : 0, //草稿还是发送
                    fileName :fileObj.fileNameStr, //文件名称 
                    fileSize :fileObj.fileSizeStr, //文件大小
                    
                }
            
                that.axios.post(this.Service.getProjectSave + this.Service.queryString(params)).then(function (res){
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