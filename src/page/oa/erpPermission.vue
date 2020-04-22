<template>
    <div class="main">
        <HeadTitle
            title="erp权限异动"
            icon='position'
        ></HeadTitle>
        <div class="content">
            <el-form ref="form" :rules="rules" :model="form" label-width="120px">
                <el-form-item label="姓名" style="width:180px"> 
                        <el-input v-model="userInfo.name" placeholder="请选择" @focus='getPersons'></el-input>
                </el-form-item>
                <el-form-item label="所属部门"> 
                    <el-input v-model="userInfo.officeName" placeholder="所属部门" disabled></el-input>
                </el-form-item>
                <el-form-item label="岗位"> 
                    <el-input v-model="userInfo.userPosition" placeholder="岗位名称"></el-input>
                </el-form-item>
                <el-form-item label="异动原因" prop="moveReason"> 
                    <el-select v-model="form.moveReason" placeholder="请选择" @change="hanldeMoveReason">
                        <el-option
                        v-for="item in moveReasonOptions"
                        :key="item.value"
                        :label="item.key"
                        :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="异动类型" prop="moveType"> 
                    <el-select v-model="form.moveType" placeholder="请选择" @change="hanlderMoveType">
                        <el-option
                        v-for="item in moveTypeOptions"
                        :key="item.value"
                        :label="item.key"
                        :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="需申请权限" prop="wantPriName"> 
                    <el-select v-model="form.wantPriName" multiple  placeholder="请选择" @change="hanlderWantPriName">
                        <el-option
                        v-for="item in wantPriNameOptions"
                        :key="item.value"
                        :label="item.key"
                        :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="textareaBox" label="申请原因" prop="applyReason" >
                     <el-input  type="textarea" v-model.trim="form.applyReason" maxlength="1000" placeholder="请输入申请原因,限定1000字">
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
            return {
                form: {
                    type: [],
                    applyReason: '',
                    peerUserIds:'',
                    moveType:'',
                    wantPriName:'',
                    moveReason:'',
                },
                userInfo:{
                    name:'',
                    officeName:'',
                    userPosition:''
                },
                positionCode:'',
                dimissionCode:'',
                rules: {
                    moveType: [
                        { required: true, message: '请选择异动类型', trigger: 'blur' },
                    ],
                    contractEndDate:[
                        { required: true, message: '请选择合同到期日时间', trigger: 'change' },
                        // { validator: endCheck, trigger: 'change' }
                    ],
                    applyReason:[
                        { required: true, message: '请输入申请原因', trigger: 'blur' },
                        { min:1, max: 1000, message: '长度在不能超过1000字符', trigger: 'blur' }
                    ],
                    moveReason:[
                        { required: true, message: '请输入异动原因', trigger: 'blur' },
                    ],
                    wantPriName:[
                        { required: true, message: '请选择需申请权限', trigger: 'change' },
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
                moveTypeOptions:[
                    // {value:'1',key:'测试'},
                    // {value:'2',key:'运维'},
                    // {value:'3',key:'前端'},
                    // {value:'4',key:'JAVA'},

                ],
                moveReasonOptions:[],
                wantPriNameOptions:[],
                moveReasonCode:'',
                wantPriCode:''

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
            document.title='erp权限异动'
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
            this.axios.get('/move/erpprimove/reason').then(function(res){
                if(res.data.h.code =200 ){
                    console.log(res.data.b)
                    that.moveReasonOptions = res.data.b;
                }
            })
            this.axios.get('/move/erpprimove/type').then(function(res){
                if(res.data.h.code =200 ){
                    console.log(res.data.b)
                    that.moveTypeOptions = res.data.b;
                }
            })
            this.axios.get('/move/erpprimove/wantPri').then(function(res){
                if(res.data.h.code =200 ){
                    console.log(res.data.b)
                    that.wantPriNameOptions = res.data.b;
                }
            })
    
        },
        watch:{
            'form.applyReason':function(val){
                this.wordCount = val.length
            }
        },
        computed:{
            getAddrDetail(){
                return this.$store.state.addressDetail;
            }
        },
        methods:{
            hanlderWantPriName(val){
                console.log(val,'pri')
                console.log(val.join('|'))
                this.wantPriCode = val.join('|');
            },
            hanldeMoveReason(val){
                console.log(val,'mov')
                this.moveReasonCode = val;
            },

            hanlderMoveType(val){
                console.log(val,'eo')
                this.moveTypeCode = val;
            },
            hanlderVal(val){
                 console.log(val,'岗位类别')
                 this.positionCode = val;
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
                let arrName = ''
                let peerUserIds = [];
                let personsData = '';
                 let userPosition = ''
                 let officeName = ''
                this.openAdd=false
                if(this.peopleType.indexOf('other')==0){
                    this.allApprovers[this.approver_index].auditers = JSON.parse(JSON.stringify(arr))
                }else if(this.peopleType.indexOf('per')==0){

                    this.Personnel_data = JSON.parse(JSON.stringify(arr))
                      console.log('peerUserIds',this.Personnel_data )
                    for(let val of this.Personnel_data){
                        console.log(val,'9998')
                        arrName = val.name;
                        peerUserIds = val.userId
                        userPosition= val.userPosition
                        officeName = val.officeName
                    }
                    setTimeout(()=>{
                        personsData = arrName
                        console.log(personsData,'nama')
                        let userId = peerUserIds
                        this.userInfo.name = personsData;
                        this.userInfo.userPosition = userPosition;
                        this.userInfo.officeName = officeName;
                        this.form.peerUserIds = userId;
                    },100)
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
                if(this.userInfo.name==''){
                    this.$message('请选姓名')
                    return 
                }

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
                    applyReason:that.form.applyReason.replace(/\n/g, '<br/>'), 
                    userId:that.form.peerUserIds,
                    name:that.userInfo.name,           
                    exPosition:that.userInfo.userPosition,// 岗位
                    officeName:that.userInfo.officeName,
                    // peerUserIds:that.form.peerUserIds,

                    employeeName:that.userInfo.name,
                    employeeDept:that.userInfo.officeName,
                    position:that.userInfo.userPosition,
                    moveReason:that.moveReasonCode,
                    moveType:that.moveTypeCode,
                    wantPri:that.wantPriCode,
   
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
                // that.axios.post(this.Service.getChangepositionSave + this.Service.queryString(params))
                that.axios({
                    method:"post",
                    url:`${this.Service.getErpprimoveSave}`,
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
    // #myMap{
    //     width: 70%;
    //     position: absolute;
    //     top: 19%;
    //     left: 35%;
    // }
</style>