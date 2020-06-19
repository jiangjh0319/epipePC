<template>
    <div class="main">
        <HeadTitle
            title="出差"
            icon='chucha'
        ></HeadTitle>
        <div class="content">
            <el-form ref="form" :rules="rules" :model="form" label-width="100px">
                 <!-- <el-form-item label="请假类型" prop="leaveType">
                    <el-select v-model="form.leaveType" placeholder="请选择">
                        <el-option
                        v-for="item in form.type"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item> -->
                <el-form-item label="标题" prop="stampApplyTitle"> 
                    <el-input v-model="form.stampApplyTitle" placeholder="请输入标题" ></el-input>
                </el-form-item>
                <div v-for="(v,index) in form.list" :key="index">
                    <el-form-item v-if="ishowDelet"> 
                        行程明细（{{index+1}}）<el-button type="danger" round @click="deleteRules(v,index)">删除</el-button>
                    </el-form-item>
                    <el-form-item label="出差地点" :prop="'list.'+index+'.addressDetail'" :rules="[{required: true, message: '请选择出差地点'}]"> 
                        <el-input v-model="v.addressDetail" placeholder="请选择出差地点" @focus='getFocus(index)'></el-input>
                    </el-form-item>

                    <el-form-item label="开始时间" :prop="'list.'+index+'.beginTime'" :rules="[{required: true, message: '请选择开始时间'}]">
                        <!-- <el-input v-model="form.name"></el-input> -->
                        <el-date-picker
                            v-model="v.beginTime"
                            type="datetime"
                            placeholder="请选择">
                        </el-date-picker>
                    </el-form-item>

                    <el-form-item label="结束时间"  :prop="'list.'+index+'.endTime'" :rules="[{required: true, message: '请选择结束时间'}]">
                        <el-date-picker
                            v-model="v.endTime"
                            type="datetime"
                            placeholder="请选择">
                        </el-date-picker>
                        <!-- <el-input v-model="form.name"></el-input> -->
                    </el-form-item>

                    <el-form-item label="时长 (天)" :prop="'list.'+index+'.day'" :rules="[{required: true, message: '请输入时长天数'}]"> 
                        <el-input v-model="v.day" placeholder="请输入时长 (0.5为单位)"></el-input>
                    </el-form-item>
                    <el-form-item label="同行人员" :prop="'list.'+index+'.persons'" :rules="[{required: true, message: '请选择同行人员'}]"> 
                        <el-input v-model="v.persons" placeholder="请选择" @focus='getPersons(index)'></el-input>
                    </el-form-item>
                </div>
                     <el-form-item> 
                        <el-button type="primary" round @click="addList">增加行程明细</el-button>
                    </el-form-item>
                <el-form-item class="textareaBox" label="出差事由" prop="desc" >
                     <el-input  type="textarea" v-model="form.desc" maxlength="150" placeholder="请输入出差事由">
                     </el-input>
                     <span class="textNum">{{wordCount}}/150</span>
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
        
        <el-dialog  
        title="出差地点"
        :visible.sync="dialogVisible"
        width="80%"
        :close-on-click-modal="false"
        >
        <template>
            <my-map id="myMap" @func="getMsgFormSon" @hanlerfunc="getMsgData"></my-map>
        </template>
        <span slot="footer" class="dialog-footer">
            <el-button @click="dialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="dialogVisible = false">确 定</el-button>
        </span>
        </el-dialog>

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
                    type: [],
                    stampApplyTitle:'',
                    name: '',
                    desc: '',//出差事由
                    list:[
                        {
                            day:'',//天数
                            beginTime:'',//开始时间
                            endTime:'',//结束时间
                            persons:'',//同行人员
                            peerUserIds:'',
                            addressDetail:'',//出差地点,
                            data:[],
                        }
                    ],
                },
                rules: {
                    stampApplyTitle:[
                        { required: true, message: '标题不能为空', trigger: 'blur' },
                        { min:2, max: 100, message: '长度在不能超过100字符或少于2个字符', trigger: 'blur' }
                    ],
                    leaveType: [
                        { required: true, message: '请选择请假类型', trigger: 'change' },
                    ],
                    day: [
                        { required: true, message: '请输入出差时长', trigger: 'blur' },
                        { validator: checkDay, trigger: 'blur' }
                    ],
                    // persons: [
                    //     { required: true, message: '请选择同行人员', trigger: 'blur' },
                    //     { validator: checkDay, trigger: 'blur' }
                    // ],
                    beginTime:[
                        { required: true, message: '请选择开始时间', trigger: 'change' },
                        { validator: beginCheck, trigger: 'change' }

                    ],
                    endTime:[
                        { required: true, message: '请选择结束时间', trigger: 'change' },
                        { validator: endCheck, trigger: 'change' }

                    ],
                    desc:[
                        { required: true, message: '请输入出差事由', trigger: 'blur' },
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
                _index:0,
                isMore:true,
                ishowDelet:false,
                 linkAuditNum:'',
                applyLinkIds:'',
                allApprovers:[],
                showCopy:false,
                showGroup:false,
                approver_index:0,
                personsData:[],
                per_index:0,
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
            document.title='出差'
            let that = this;
             this.axios.get('/work/leave/type/list').then(function(res){
                if(res.data.h.code =200 ){
                    res.data.b.data.forEach(item=>{
                        that.form.type.push({value:item.id,label:item.name})
                    })
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
                this.form.list[this._index].addressDetail = val.address
                this.form.list[this._index].userlocation = val.point;
            },
            getMsgFormSon(data){
                if(data==undefined){

                }else{
                    this.form.list[this._index].addressDetail = data.addr;
                    this.form.list[this._index].userlocation = data.point;
                }
            },
            addList() {//添加明细
                this.form.list.push({
                    day:'',//天数
                    beginTime:'',//开始时间
                    endTime:'',//结束时间
                    persons:'',//同行人员
                    addressDetail:'',//出差地点
                    userlocation:'',
                    data:[],
            })
            this.ishowDelet = true;
            },
            deleteRules(item, index) {
                if(this.form.list.length==2){
                    this.ishowDelet = false;
                }
                var index = this.form.list.indexOf(item)
                if (index !== -1) {
                    this.form.list.splice(index, 1)
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
            getPersons(index){
                this.per_index = index;
                this.Personnel_data = this.form.list[index].data
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
                this.openAdd=false
                if(this.peopleType.indexOf('other')==0){
                    this.allApprovers[this.approver_index].auditers = JSON.parse(JSON.stringify(arr))
                }else if(this.peopleType.indexOf('per')==0){
                    let arrs = JSON.parse(JSON.stringify(arr))
                    this.form.list[this.per_index].data = arrs
                    for(let val of arrs){
                        peerUserIds.push(val.userId)
                        arrName.push(val.name)
                    }

                    this.form.list[this.per_index].persons = arrName.join(',');
                    this.form.list[this.per_index].peerUserIds = peerUserIds.join(',')
                       
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
                }

                let that = this;
                let auditUserIds = '',receiverIds = '',auditCompanyIds="",receiverCompanyIds="",fileObj,params,approves;
                receiverIds = this.Util.getIds(this.receivers_data,'userId')
                receiverCompanyIds = this.Util.getIds(this.receivers_data,'companyId')
                fileObj = this.Util.fileFo(this.accessory)
                approves = this.Util.approverFormat(this.allApprovers,this.linkAuditNum)

          
                 params = {
                    Id :'', // id
                    tripTitle:that.form.stampApplyTitle,//标题
                    tripReason : encodeURI(that.form.desc.replace(/\n/g, '<br/>')), //出差事由
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

                    this.form.list.forEach((item,index)=>{
                     params['tripList['+index+'].detailAddress'] = item.addressDetail;
                     params['tripList['+index+'].beginTime'] = that.Util.getDate(item.beginTime);
                     params['tripList['+index+'].endTime'] = that.Util.getDate(item.endTime);
                     params['tripList['+index+'].tripDuration'] = item.day;
                     params['tripList['+index+'].peerNames'] = item.persons;
                     params['tripList['+index+'].peerUserIds'] = item.peerUserIds;
                     params['tripList['+index+'].destination'] = item.addressDetail;
                     params['tripList['+index+'].lon'] = item.userlocation.lng
                     params['tripList['+index+'].lat'] = item.userlocation.lat

                })
                that.axios.post(this.Service.saveTrip + this.Service.queryString(params)).then(function (res){
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