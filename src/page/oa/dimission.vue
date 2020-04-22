<template>
    <div class="main">
        <HeadTitle
            title="离职"
            icon='dimission'
        ></HeadTitle>
        <div class="content">
            <el-form ref="form" :rules="rules" :model="form" label-width="120px">
                <el-form-item label="文件标题" prop="dimissionTitle"> 
                    <el-input v-model="form.dimissionTitle" placeholder="请输入标题" ></el-input>
                </el-form-item>
                <el-form-item label="离职人姓名" style="width:180px"> 
                        <el-input v-model="form.name" placeholder="请选择" @focus='getPersons'></el-input>
                </el-form-item>
                <el-form-item label="所属部门"> 
                    <el-input v-model="form.officeName" placeholder="所属部门"></el-input>
                </el-form-item>
                <el-form-item label="员工编号" prop="employeeNo"> 
                    <el-input v-model="form.employeeNo" placeholder="请输入员工编号" ></el-input>
                </el-form-item>
                <el-form-item label="岗位"> 
                    <el-input v-model="userInfo.userPosition" placeholder="岗位名称" disabled></el-input>
                </el-form-item>
                <el-form-item label="岗位类别" prop="positionType"> 
                    <el-select v-model="form.positionType" placeholder="请选择" @change="hanlderVal">
                        <el-option
                        v-for="item in positionTypeOptions"
                        :key="item.value"
                        :label="item.key"
                        :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="学历" prop="education"> 
                    <el-input v-model="form.education" placeholder="请输入最高学历"></el-input>
                </el-form-item>
                <el-form-item label="入职日期"  prop="hireDate">
                        <el-date-picker
                            v-model="form.hireDate"
                            type="date"
                            placeholder="请选择">
                        </el-date-picker>
                </el-form-item>
                <el-form-item label="合同到期"  prop="contractEndDate">
                        <el-date-picker
                            v-model="form.contractEndDate"
                            type="date"
                            placeholder="请选择">
                        </el-date-picker>
                </el-form-item>
                <el-form-item label="离职类别" prop="dimissionType"> 
                    <el-select v-model="form.dimissionType" placeholder="请选择" @change="hanlderDimissionType">
                        <el-option
                        v-for="item in dimissionTypeOptions"
                        :key="item.value"
                        :label="item.key"
                        :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="最后工作日"  prop="dimissionDate">
                        <el-date-picker
                            v-model="form.dimissionDate"
                            type="date"
                            placeholder="请选择">
                        </el-date-picker>
                </el-form-item>
                <el-form-item class="textareaBox" label="离职原因" prop="dimissionDesc" >
                     <el-input  type="textarea" v-model.trim="form.dimissionDesc" maxlength="1000" placeholder="请输入离职原因,限定1000字">
                     </el-input>
                     <span class="textNum">{{wordCount}}/1000</span>
                     <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
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
    // import Approve from './../../components/oa/approve_contacts.vue'
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
            //     if (this.form.contractEndDate!=''&&value.getTime()>=this.form.contractEndDate.getTime()) {
            //         callback(new Error('入职日期时间不能大于合同到期时间'));
            //     } else {
            //      callback();
            //     }
            // };
            // var endCheck = (rule, value, callback) => {
            //     if (this.form.hireDate!=''&&value.getTime()<=this.form.hireDate.getTime()) {
            //         callback(new Error('合同到期时间不能小于入职日期时间'));
                   
            //     } else {
            //      callback();
            //     }
            // };
            return {
                form: {
                    type: [],
                    dimissionTitle:'',
                    employeeNo:'',
                    positionType:'',
                    education:'',
                    hireDate:'',
                    dimissionDate:'',
                    dimissionDesc: '',
                    peerUserIds:'',
                    officeName:'',
                    name:'',
                    userId:'',
                },
                userInfo:{},
                positionCode:'',
                isMore:true,
                dimissionCode:'',
                positionTypeOptions:[],
                dimissionTypeOptions:[],
                rules: {
                    dimissionTitle:[
                        { required: true, message: '文件标题不能为空', trigger: 'blur' },
                        { min:2, max: 100, message: '长度在不能超过100字符或少于2个字符', trigger: 'blur' }
                    ],
                    employeeNo: [
                        { required: true, message: '请输入员工编号', trigger: 'blur' },
                    ],
                    positionType: [
                        { required: true, message: '请选择岗位类别', trigger: 'blur' },
                    ],
                    education: [
                        { required: true, message: '请输入最高学历', trigger: 'blur' },
                    ],
                    hireDate:[
                        { required: true, message: '请选择入职日期时间', trigger: 'change' },
                        // { validator: beginCheck, trigger: 'change' }

                    ],
                    contractEndDate:[
                        { required: true, message: '请选择合同到期日时间', trigger: 'change' },
                        // { validator: endCheck, trigger: 'change' }
                    ],
                    dimissionType:[
                        { required: true, message: '请选择离职类别', trigger: 'blur' },
                    ],
                    dimissionDate:[
                       { required: true, message: '请选择最后工作日', trigger: 'blur' },
                    ],
                    dimissionDesc:[
                        { required: true, message: '请输入离职原因', trigger: 'blur' },
                        { min:1, max: 1000, message: '长度在不能超过1000字符', trigger: 'blur' }
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
                _index:0,
                ishowDelet:false,
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
            Copy,
            myMap,
            Personnel
        },
        created(){
            document.title='离职'
            let that = this;
             this.axios.get('/work/leave/type/list').then(function(res){
                if(res.data.h.code =200 ){
                    res.data.b.data.forEach(item=>{
                        that.form.type.push({value:item.id,label:item.name})
                    })
                }
            })
            
            this.axios.get(this.Service.getPositionType).then(res=>{//岗位类别
                if(res.data.h.code =200 ){
                //    console.log(res.data.b)
                   this.positionTypeOptions = res.data.b;
                }
            })
            this.axios.get(this.Service.getDimissionType).then(res=>{//离职类别
                if(res.data.h.code =200 ){
                   console.log(res.data.b)
                   this.dimissionTypeOptions = res.data.b;
                }
            })

            this.axios.get('/process/apply/enter?req=4').then((res)=>{
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
            'form.dimissionDesc':function(val){
                this.wordCount = val.length
            }
        },
        computed:{
            getAddrDetail(){
                return this.$store.state.addressDetail;
            }
        },
        methods:{
            hanlderVal(val){
                 console.log(val,'岗位类别')
                 this.positionCode = val;
            },
            hanlderDimissionType(val){
                console.log(val,'离职类型')
                this.dimissionCode = val;
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
                console.log(arr)
                let arrName = [];
                let peerUserIds = [];
                let personsData = '';
                this.openAdd=false
                if(this.peopleType.indexOf('other')==0){
                    this.allApprovers[this.approver_index].auditers = JSON.parse(JSON.stringify(arr))
                }else if(this.peopleType.indexOf('per')==0){
                        this.form.name = arr[0].name
                        this.form.officeName = arr[0].officeName
                        this.form.userId = arr[0].userId
                       
                }else{
                   this.receivers_data = JSON.parse(JSON.stringify(arr))
                }
            },
            selectOpen(type){
                this.peopleType = type+(Math.random()+'').slice(2,10)
                this.isMore = true;
                if(type=='per'){
                    this.isMore=false;
                }
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
                }

                let that = this;
                let auditUserIds = '',receiverIds = '',auditCompanyIds="",receiverCompanyIds="",fileObj,params,approves;
                receiverIds = this.Util.getIds(this.receivers_data,'userId')
                receiverCompanyIds = this.Util.getIds(this.receivers_data,'companyId')
                fileObj = this.Util.fileFo(this.accessory)
                approves = this.Util.approverFormat(this.allApprovers,this.linkAuditNum)

          
                 params = {
                    Id :'', // id
                    dimissionTitle:that.form.dimissionTitle,//标题
                    dimissionDesc:that.form.dimissionDesc.replace(/\n/g, '<br/>'), //离职原因
                    employeeNo:that.form.employeeNo, //员工编号
                    education:that.form.education, //学历
                    position:that.userInfo.userPosition,// 岗位
                    positionType:that.positionCode,// 岗位类型
                    employeeNameId:that.form.userId,
                    employeeName:that.form.name,//
                    // peerUserIds:that.form.peerUserIds,
                    dimissionType:that.dimissionCode,
                    hireDate: that.Util.getDate(that.form.hireDate),//入职时间
                    dimissionDate:that.Util.getDate(that.form.dimissionDate),//离职日期
                    contractEndDate:that.Util.getDate(that.form.contractEndDate),//合同终止日期

                    auditUserIds, //审批人
                    receiverIds, //抄送人
                    draftFlag : 0, //草稿还是发送
                    auditCompanyIds,//审批人的公司id
                    receiverCompanyIds,//抄送人的公司id
                    auditUserIds:approves.userIdsStr, //审批人
                    auditCompanyIds:approves.companyIdsStr,
                    applyLinkIds:this.applyLinkIds,
                    linkAuditNum:approves.numStr,
                    urls : fileObj.urlStr, //附件
                    fileNames :fileObj.fileNameStr, //文件名称 
                    fileSizes :fileObj.fileSizeStr, //文件大小
                    
                }
                that.axios.post(this.Service.getDimission + this.Service.queryString(params)).then(function (res){
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
    // #myMap{
    //     width: 70%;
    //     position: absolute;
    //     top: 19%;
    //     left: 35%;
    // }
</style>