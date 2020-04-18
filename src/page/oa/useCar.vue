<template>
    <div class="main">
        <HeadTitle
            title="用车"
            icon='useCar'
        ></HeadTitle>
        <div class="content">
            <el-form ref="form" :rules="rules" :model="form" label-width="100px">
                <el-form-item label="文件标题" prop="carTitle"> 
                    <el-input v-model="form.carTitle" placeholder="请输入文件标题" ></el-input>
                </el-form-item>
                <el-form-item label="用车人"> 
                    <el-input v-model="form.userName" placeholder="请输入申请人" disabled></el-input>
                </el-form-item>
                <el-form-item label="用车部门"> 
                    <el-input v-model="form.departmentName" placeholder="请输入所属部门" disabled></el-input>
                </el-form-item>
                <el-form-item label="车辆类型" prop="carType"> 
                    <el-input v-model="form.carType" placeholder="请输入所需车辆类型" ></el-input>
                </el-form-item>
                <el-form-item label="数量(辆)" prop="carNum"> 
                    <el-input v-model="form.carNum" placeholder="请输入车辆数量" type="number" ></el-input>
                </el-form-item>
                 <!-- <el-form-item label="公出类型" prop="awayType">
                    <el-select v-model="form.awayType" placeholder="请选择">
                        <el-option
                        v-for="item in form.type"
                        :key="item.key"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item> -->
                    <el-form-item label="用车时间" prop="beginTime">
                        <!-- <el-input v-model="form.name"></el-input> -->
                        <el-date-picker
                            v-model="form.beginTime"
                            type="datetime"
                            placeholder="请选择">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="返回时间" prop="endTime">
                        <el-date-picker
                            v-model="form.endTime"
                            type="datetime"
                            placeholder="请选择">
                        </el-date-picker>
                        <!-- <el-input v-model="form.name"></el-input> -->
                    </el-form-item>

                    <!-- <el-form-item label="随行人员" prop="persons" :rules="[{required: true, message: '请选择同行人员'}]"> 
                        <el-input v-model="form.persons" placeholder="请选择" @focus='getPersons'></el-input>
                    </el-form-item> -->
                    <el-form-item label="随行人员" prop="persons"> 
                    <el-input v-model="form.persons" placeholder="请输入随行人员(多个用逗号隔开)"></el-input>
                     </el-form-item>
                <el-form-item class="textareaBox" label="用车事由" prop="desc" >
                     <el-input  type="textarea" v-model="form.desc" maxlength="150" placeholder="请输入用车事由,限定1000字">
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
                    v-on:selectOpen='selectOpen'
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
            var beginCheck = (rule, value, callback) => {
                if (this.form.endTime!=''&&value.getTime()>=this.form.endTime.getTime()) {
                    callback(new Error('用车时间不能大于返回时间'));
                } else {
                 callback();
                }
            };
            var endCheck = (rule, value, callback) => {
                if (this.form.beginTime!=''&&value.getTime()<=this.form.beginTime.getTime()) {
                    callback(new Error('返回时间不能小于用车时间'));
                   
                } else {
                 callback();
                }
            };
            return {
                form: {
                    type: [],
                    carTitle:'',//文件标题
                    userName:'',//用车人
                    departmentName:'',//用车部门
                    carType:'',//车辆类型
                    carNum:'',//数量（辆）
                    desc: '',//用车事由
                    beginTime:'',//开始时间
                    endTime:'',//结束时间
                    persons:'',//随行人员
                    userlocation:'',
                    peerUserIds:''
                },
                rules: {
                    carTitle:[
                        { required: true, message: '文件标题不能为空', trigger: 'blur' },
                        { min:2, max: 100, message: '长度在不能超过100字符或少于2个字符', trigger: 'blur' }
                    ],
                    carType: [
                        { required: true, message: '车辆类型不能为空', trigger: 'blur' },
                        // { validator: checkDay, trigger: 'blur' }
                    ],
                    carNum: [
                        { required: true, message: '车辆数量不能为空', trigger: 'blur' },
                    ],
                    persons: [
                        { required: true, message: '请输入随行人员', trigger: 'blur' },
                    ],
                    beginTime:[
                        { required: true, message: '请选择开始时间', trigger: 'change' },
                        { validator: beginCheck, trigger: 'change' }

                    ],
                    endTime:[
                        { required: true, message: '请选择结束时间', trigger: 'change' },
                        { validator: endCheck, trigger: 'change' }

                    ],
                    desc:[
                        { required: true, message: '请输入请假事由', trigger: 'blur' },
                        { min:1, max: 150, message: '长度在不能超过150字符', trigger: 'blur' }
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
            document.title='用车'
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
            'form.desc':function(val){
                this.wordCount = val.length
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
                }else if(this.form.desc.length>1000||this.form.desc.length<6){
                    this.$message('用车事由不能少于6个或超过1000字符!')
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
                    carTitle:that.form.carTitle,//文件标题
                    carType: that.form.carType,  //车型
                    carNum: that.form.carNum,  //用车数量
                    beginTime:that.Util.getDate(that.form.beginTime),//开始时间
                    endTime:that.Util.getDate( that.form.endTime),//结束时间
 

                    peerNames: that.form.persons.replace(',','|'),  //同行人员姓名
                    peerUserIds:that.form.peerUserIds,
                    carReason:that.form.desc,//用车事由
    

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
            
                that.axios.post(this.Service.useCarApi + this.Service.queryString(params)).then(function (res){
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