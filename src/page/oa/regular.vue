<template>
    <div class="main">
        <HeadTitle
            title="员工转正"
            icon='regular'
        ></HeadTitle>
        <div class="content">
            <el-form ref="form" :rules="rules" :model="form" label-width="120px">
                <el-form-item label="文件标题" prop="regularTitle"> 
                    <el-input v-model="form.regularTitle" placeholder="请输入标题" ></el-input>
                </el-form-item>
                <el-form-item label="转正员工姓名" style="width:180px"> 
                        <el-input v-model="userInfo.name" placeholder="请选择" @focus='getPersons' disabled></el-input>
                </el-form-item>
                <el-form-item label="所属部门"> 
                    <el-input v-model="userInfo.officeName" placeholder="所属部门" disabled></el-input>
                </el-form-item>
                <el-form-item label="岗位"> 
                    <el-input v-model="userInfo.userPosition" placeholder="岗位名称" disabled></el-input>
                </el-form-item>
                <el-form-item label="年龄" prop="age"> 
                    <el-input v-model="form.age" placeholder="请输入年龄" type="number" ></el-input>
                </el-form-item>
                <el-form-item label="性别" prop="sexName"> 
                    <el-select v-model="form.sexName" placeholder="请选择" @change="hanlderVal">
                        <el-option
                        v-for="item in sexNameOptions"
                        :key="item.value"
                        :label="item.key"
                        :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="籍贯" prop="birthPlace"> 
                    <el-input v-model="form.birthPlace" placeholder="请输入籍贯"></el-input>
                </el-form-item>
             
                <el-form-item label="出生时间"  prop="birthday">
                        <el-date-picker
                            v-model="form.birthday"
                            type="date"
                            placeholder="请选择">
                        </el-date-picker>
                </el-form-item>
                <el-form-item label="学历" prop="education"> 
                    <el-input v-model="form.education" placeholder="请输入学历"></el-input>
                </el-form-item>
                <el-form-item label="专业" prop="major"> 
                    <el-input v-model="form.major" placeholder="请输入专业"></el-input>
                </el-form-item>
                <el-form-item label="毕业时间"  prop="graduationDate">
                        <el-date-picker
                            v-model="form.graduationDate"
                            type="date"
                            placeholder="请选择">
                        </el-date-picker>
                </el-form-item>
                <el-form-item label="入司时间"  prop="hireDate">
                        <el-date-picker
                            v-model="form.hireDate"
                            type="date"
                            placeholder="请选择">
                        </el-date-picker>
                </el-form-item>
                <el-form-item label="试用开始时间"  prop="beginTime">
                        <el-date-picker
                            v-model="form.beginTime"
                            type="date"
                            placeholder="请选择">
                        </el-date-picker>
                </el-form-item>
                <el-form-item label="试用结束时间"  prop="endTime">
                        <el-date-picker
                            v-model="form.endTime"
                            type="date"
                            placeholder="请选择">
                        </el-date-picker>
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
            var beginCheck = (rule, value, callback) => {
                if (this.form.beginTime!=''&&value.getTime()>=this.form.endTime.getTime()) {
                    callback(new Error('试用开始时间不能大于试用结束时间'));
                } else {
                 callback();
                }
            };
            var endCheck = (rule, value, callback) => {
                if (this.form.endTime!=''&&value.getTime()<=this.form.beginTime.getTime()) {
                    callback(new Error('试用结束时间不能小于试用开始时间'));
                   
                } else {
                 callback();
                }
            };
            return {
                form: {
                    type: [],
                    regularTitle:'',
                    age:'',
                    education:'',
                    birthday:'',
                    beginTime:'',
                    endTime:'',
                    birthPlace:'',
                    hireDate:'',
                    major:'',
                },
                userInfo:{},
                positionCode:'',
                dimissionCode:'',
                sexNameOptions:[],
                rules: {
                    regularTitle:[
                        { required: true, message: '文件标题不能为空', trigger: 'blur' },
                        { min:2, max: 100, message: '长度在不能超过100字符或少于2个字符', trigger: 'blur' }
                    ],
                    employeeNo: [
                        { required: true, message: '请输入员工编号', trigger: 'blur' },
                    ],
                    sexName: [
                        { required: true, message: '请选择性别', trigger: 'blur' },
                    ],
                    age:[
                         { required: true, message: '请输入年龄', trigger: 'blur' },
                    ],
                    education: [
                        { required: true, message: '请输入最高学历', trigger: 'blur' },
                    ],
                    birthday:[
                        { required: true, message: '请选择出生时间', trigger: 'change' },
                        // { validator: beginCheck, trigger: 'change' }
                    ],
                    graduationDate:[
                        { required: true, message: '请选择毕业时间', trigger: 'change' },
                        // { validator: endCheck, trigger: 'change' }
                    ],
                    beginTime:[
                       { required: true, message: '请选择使用开始时间', trigger: 'blur' },
                       { validator: beginCheck , trigger: 'change' }
                    ],
                    endTime:[
                        { required: true, message: '请选择使用结束时间', trigger: 'blur' },
                        { validator: endCheck, trigger: 'change' }
                    ],
                    birthPlace:[
                         { required: true, message: '籍贯不能为空', trigger: 'blur' },
                         { max: 100, message: '长度在不能超过10字符', trigger: 'blur' }
                    ],
                    hireDate:[
                         { required: true, message: '请选择入司时间', trigger: 'blur' },
                    ],
                    major:[
                          { required: true, message: '请输入专业', trigger: 'blur' },
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
                sexNum:''
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
            document.title='员工转正'
            let that = this;
             this.axios.get('/work/leave/type/list').then(function(res){
                if(res.data.h.code =200 ){
                    res.data.b.data.forEach(item=>{
                        that.form.type.push({value:item.id,label:item.name})
                    })
                }
            })
            
            this.axios.get('/work/sex/type').then(res=>{//岗位类别
                if(res.data.h.code =200 ){
                //    console.log(res.data.b)
                   this.sexNameOptions = res.data.b;
                }
            })

            this.axios.post('/user/current/userinfo').then((res)=>{
            this.userInfo.name = res.data.b.name
            this.userInfo.officeName = res.data.b.officeName
            this.userInfo.userPosition = res.data.b.userPosition
            this.userInfo.userId = res.data.b.id
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
                 this.sexNum = val;
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
                return
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
                let arrName = [];
                let peerUserIds = [];
                let personsData = '';
                this.openAdd=false
                if(this.peopleType.indexOf('other')==0){
                    this.allApprovers[this.approver_index].auditers = JSON.parse(JSON.stringify(arr))
                }else if(this.peopleType.indexOf('per')==0){

                    this.Personnel_data = JSON.parse(JSON.stringify(arr))
                      console.log('peerUserIds',this.Personnel_data )
                    for(let val of this.Personnel_data){
                        arrName.push(val.name)
                        peerUserIds.push(val.userId)
                    }
                    setTimeout(()=>{
                        personsData = arrName.join(',');
                        let userId = peerUserIds.join(',')
                        this.form.persons = personsData;
                        this.form.peerUserIds = userId;
                    },300)

                        console.log('peerUserIds',peerUserIds)

                       
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
                }

                let that = this;
                let auditUserIds = '',receiverIds = '',auditCompanyIds="",receiverCompanyIds="",fileObj,params,approves;
                receiverIds = this.Util.getIds(this.receivers_data,'userId')
                receiverCompanyIds = this.Util.getIds(this.receivers_data,'companyId')
                fileObj = this.Util.fileFo(this.accessory)
                approves = this.Util.approverFormat(this.allApprovers,this.linkAuditNum)

          
                 params = {
                    Id :'', // id
                    regularTitle:that.form.regularTitle,//标题
                    age:that.form.age, //年龄
                    education:that.form.education, //学历
                    position:that.userInfo.userPosition,// 岗位
                    employeeNameId:that.userInfo.userId,
                    major:that.form.major,
                    birthPlace:that.form.birthPlace,
                    employeeName:that.userInfo.name,
                    birthday: that.Util.getDate(that.form.birthday),
                    beginTime:that.Util.getDate(that.form.beginTime),
                    hireDate:that.Util.getDate(that.form.hireDate),
                    endTime:that.Util.getDate(that.form.endTime),
                    graduationDate:that.Util.getDate(that.form.graduationDate),
                    sex:that.sexNum,
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
                that.axios.post(this.Service.getRegularSave + this.Service.queryString(params)).then(function (res){
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