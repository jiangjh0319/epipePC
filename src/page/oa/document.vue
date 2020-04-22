<template>
    <div class="main">
        <HeadTitle
            title="行文呈批"
            icon='employee'
        ></HeadTitle>
        <div class="content">
            <el-form ref="form" :rules="rules" :model="form" label-width="160px">
                <el-form-item label="文件标题" prop="documentTitle"> 
                    <el-input v-model="form.documentTitle" placeholder="请输入文件标题" ></el-input>
                </el-form-item>
                <el-form-item label="申请人"> 
                    <el-input v-model="form.userName" placeholder="请输入申请人" disabled></el-input>
                </el-form-item>
                <el-form-item label="所属部门"> 
                    <el-input v-model="form.departmentName" placeholder="请输入所属部门" disabled></el-input>
                </el-form-item>
                <el-form-item label="文件编号" prop="documentNo"> 
                    <el-input v-model="form.documentNo" placeholder="请输入文件编号" ></el-input>
                </el-form-item>
                <el-form-item class="textareaBox" label="主送" prop="sendTo" >
                     <el-input  type="textarea" v-model.trim="form.sendTo" maxlength="200" placeholder="请输入主送内容,限定200字">
                     </el-input>
                     <span class="textNum">{{sendLen}}/200</span>
                </el-form-item>
                <el-form-item class="textareaBox" label="抄送" prop="copyTo" >
                     <el-input  type="textarea" v-model.trim="form.copyTo" maxlength="200" placeholder="请输入抄送,限定200字">
                     </el-input>
                     <span class="textNum">{{copyLen}}/200</span>
                </el-form-item>
                <el-form-item class="textareaBox" label="事由" prop="documentReason" >
                     <el-input  type="textarea" v-model.trim="form.documentReason" maxlength="1000" placeholder="请输入事由,限定1000字">
                     </el-input>
                     <span class="textNum">{{textNum}}/1000</span>
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
            //     if (this.form.endTime!=''&&value.getTime()>=this.form.endTime.getTime()) {
            //         callback(new Error('用车时间不能大于返回时间'));
            //     } else {
            //      callback();
            //     }
            // };
            // var endCheck = (rule, value, callback) => {
            //     if (this.form.beginTime!=''&&value.getTime()<=this.form.beginTime.getTime()) {
            //         callback(new Error('返回时间不能小于用车时间'));
                   
            //     } else {
            //      callback();
            //     }
            // };
            return {
                form: {
                    type: [],
                    documentTitle:'',//文件标题
                    userName:'',
                    departmentName:'',
                    sendTo:'',
                    copyTo:'',
                    documentReason:'',
                    documentNo:'',
                    num:'',
                    arrivalDate:'',
                    employeeReason:'',
                    sexType:'',
                    marriageType:'',
                    ageName:'',
                    educationName:'',
                    major:'',
                    highestEducationName:'',
                    jobExperienceName:'',
   
                    userlocation:'',
                    peerUserIds:''
                },
                    qualifications:'',//证书
                    computerLevel:'',//计算机水平
                    foreignLevel:'', //外语水平
                    skill:'',//特殊技能
                    writings:'', //写作
                    priority:'', //优先录用
                    condition:'',
                    isComplie:'',
                sexTypeOptions:[],
                marriageTypeOptions:[],
                ageNameOptions:[],
                educationNameOptions:[],
                highestEducationNameOptions:[],
                jobExperienceNameOptions:[],
                centerDialogVisible: false,
                visitTrafficWay:'',
                rules: {
                    documentTitle:[
                        { required: true, message: '文件标题不能为空', trigger: 'blur' },
                        { min:2, max: 100, message: '长度在不能超过100字符或少于2个字符', trigger: 'blur' }
                    ],
                    documentNo: [
                        { required: true, message: '文件编号不能为空', trigger: 'blur' },
                    ],
                    num: [
                        { required: true, message: '请输入需求人数', trigger: 'blur' },
                    ],
                    arrivalDate:[
                        { required: true, message: '请选择到岗日期', trigger: 'change' }
                    ],
                    employeeReason:[
                        { required: true, message: '请输入申请理由', trigger: 'blur' },
                    ],
                    sexType:[
                        { required: true, message: '性别不能为空', trigger: 'blur' },
                    ],
                    marriageType:[
                        { required: true, message: '婚姻不能为空', trigger: 'blur' },
                    ],
                    ageName:[
                        { required: true, message: '年龄不能为空', trigger: 'blur' },
                    ],
                    educationName:[
                         { required: true, message: '学历不能为空', trigger: 'blur' },
                    ],
                    major:[
                        { required: true, message: '专业不能为空', trigger: 'blur' },
                    ],
                    highestEducationName:[
                        { required: true, message: '最高学历毕业学校不能为空', trigger: 'blur' },
                    ],
                    jobExperienceName:[
                        { required: true, message: '工作经验不能为空', trigger: 'blur' },
                    ],
                    sendTo:[
                        {required: true, message: '请输入主送内容', trigger: 'blur'},
                        { min:1, max: 200, message: '长度在不能超过200字符或少于1个字符', trigger: 'blur' }
                    ],
                    copyTo:[
                         {required: true, message: '请输入抄送', trigger: 'blur'},
                         { min:1, max: 200, message: '长度在不能超过200字符或少于1个字符', trigger: 'blur' }
                    ],
                    documentReason:[
                        {required: true, message: '请输入事由', trigger: 'blur'},
                         { min:1, max: 1000, message: '长度在不能超过1000字符或少于1个字符', trigger: 'blur' }
                    ]
                },
                approvers_data:[],//审批人
                receivers_data:[],//抄送人
                Personnel_data:[],//同行人员
                peopleType:false,//打开通讯录类型
                openAdd:false,
                isMore:true,
                accessory:[],
                btnStatus:true,
                wordCount:0,
                sendLen:0,
                copyLen:0,
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
                allApprovers:[],
                ishowDelet:false,
                sexVal:'',
                marriage:'',
                age:'',
                education:'',
                highEducation:'',
                jobExperience:'',
               
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
            document.title='行文呈批'
            let that = this;
             this.axios.get('/outsign/task/type').then(function(res){
                 console.log(res.data.b)
                if(res.data.h.code =200 ){
                    res.data.b.type.forEach(item=>{
                        that.form.type.push({value:item.value,label:item.key})
                    })
                }
            })
            this.axios.get('/work/sex/type').then(res=>{
                if(res.data.h.code==200){
                    this.sexTypeOptions = res.data.b;
                }
            })
             this.axios.get('/work/marriage/type').then(res=>{
                if(res.data.h.code==200){
                    this.marriageTypeOptions = res.data.b;
                }
            })
            this.axios.get('/work/education/type').then(res=>{
                if(res.data.h.code==200){
                    this.educationNameOptions = res.data.b;
                }
            })
            
            this.axios.get('/work/age/type').then(res=>{
                if(res.data.h.code==200){
                    this.ageNameOptions = res.data.b;
                }
            })
              this.axios.get('/work/highestEducation/type').then(res=>{
                if(res.data.h.code==200){
                    this.highestEducationNameOptions = res.data.b;
                }
            })
            this.axios.get('/work/jobExperience/type').then(res=>{
                if(res.data.h.code==200){
                    this.jobExperienceNameOptions = res.data.b;
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
            'form.employeeReason':function(val){
                this.wordCount = val.length
            },
            'form.sendTo':function(val){
                this.sendLen = val.length
            },
            'form.copyTo':function(val){
                this.copyLen = val.length
            },
             'form.documentReason':function(val){
                this.textNum = val.length
            },
        },
        computed:{
            getAddrDetail(){
                return this.$store.state.addressDetail;
            }
        },
        methods:{
            moreSelect(){
                this.centerDialogVisible = true;
            },
            toLink(){
             this.$router.push({path:'/menu'})
            console.log(6655)
            },
            hanlderVisitTrafficName(val){
                console.log(val,'到访交通工具')
                this.visitTrafficWay = val;
            },
            hanlderComplie(val){
                console.log(val,'编制')
                this.isComplie = val;

            },
            hanldersexType(val){
                console.log('性别',val)
                this.sexVal = val;
            },
            hanlderMarriageType(val){
                console.log('婚姻',val)
                this.marriage = val;
            },
            hanlderAgeName(val){
                console.log(val,'年龄')
                this.age = val;
            },
            hanlderEducationName(val){
                console.log(val)
                this.education = val;
            },
            hanlderHighestEducationName(val){
                console.log(val)
                this.highEducation = val;
            },
            hanlderJobExperienceName(val){
                console.log(val)
                this.jobExperience = val;
            },
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
                        this.form.persons = this.personsData;
                        this.form.peerUserIds = userId;
                }else{
                   this.receivers_data = JSON.parse(JSON.stringify(arr))
                }
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
                }else if(this.form.documentReason.length>1000||this.form.documentReason.length<6){
                    this.$message('事由不能少于6个或超过1000字符!')
                    return 
                }else if(this.form.sendTo.length>200||this.form.sendTo.length<1){
                    this.$message('主送内容不能少于1个或超过200字符')
                    return 
                }else if(this.form.copyTo.length>200||this.form.copyTo.length<1){
                    this.$message('抄送内容不能少于1个或超过200字符')
                    return 
                }
                
                let that = this;
                let beginTime = '',endTime = '',day = '';

                let auditUserIds = '',receiverIds = '',auditCompanyIds="",receiverCompanyIds="",fileObj,params,approves;
                receiverIds = this.Util.getIds(this.receivers_data,'userId')
                receiverCompanyIds = this.Util.getIds(this.receivers_data,'companyId')
                fileObj = this.Util.fileFo(this.accessory)
                approves = this.Util.approverFormat(this.allApprovers,this.linkAuditNum)

          
                 params = {
                    Id :'', // id
                    documentTitle:that.form.documentTitle,//文件标题
                    documentReason: that.form.documentReason, 
                    documentNo:that.form.documentNo, 
                    sendTo:that.form.sendTo,
                    copyTo:that.form.copyTo,
               
    
 
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
                that.axios({
                    method:"post",
                    url:`${this.Service.getDocumentSave}`,
                    headers:{
                        'Content-type': 'application/x-www-form-urlencoded'
                    },
                    data:params,
                      transformRequest: [function (data) {
                        let ret = ''
                        for (let it in data) {
                        ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
                        }
                        return ret
                    }],
                })
                // that.axios(this.Service.getEmployeeSave + params)
                .then(function (res){
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
    .title_food{
        position :absolute;
        cursor:pointer;
        left: 30%;
        z-index :1000;
    }
</style>