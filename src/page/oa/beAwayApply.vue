<template>
    <div class="main">
        <HeadTitle
            title="公出"
            icon='gongchu'
        ></HeadTitle>
        <div class="content">
            <el-form ref="form" :rules="rules" :model="form" label-width="100px">
                <el-form-item label="公出事由" prop="awayReason"> 
                    <el-input v-model="form.awayReason" placeholder="请输入公出事由" ></el-input>
                </el-form-item>
                 <el-form-item label="公出类型" prop="awayType">
                    <el-select v-model="form.awayType" placeholder="请选择">
                        <el-option
                        v-for="item in form.type"
                        :key="item.key"
                        :label="item.label"
                        :value="item.value">
                        </el-option>
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

                    <el-form-item label="公出地点" prop="addressDetail" :rules="[{required: true, message: '请选择出差地点'}]"> 
                        <el-input v-model="form.addressDetail" placeholder="请选择出差地点" @focus='getFocus(index)'></el-input>
                    </el-form-item>

                    <!-- <el-form-item label="时长 (天)"> 
                        <el-input v-model="form.day" placeholder="请输入时长 (0.5为单位)"></el-input>
                    </el-form-item> -->
                    <el-form-item label="同行人员" prop="persons" :rules="[{required: true, message: '请选择同行人员'}]"> 
                        <el-input v-model="form.persons" placeholder="请选择" @focus='getPersons'></el-input>
                    </el-form-item>
                <el-form-item class="textareaBox" label="附件内容" prop="desc" >
                     <el-input  type="textarea" v-model="form.desc" maxlength="150" placeholder="请输入要点内容，限定1000字">
                     </el-input>
                     <span class="textNum">{{wordCount}}/1000</span>
                     <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                </el-form-item>

                <File :accessory="accessory"
                    v-on:remove="removeFile"
                >

                </File>

                <Approve
                    :approvers_data='approvers_data'
                    v-on:selectOpen='selectOpen'
                    v-on:remove='remove'
                    guideType=0
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
        
        <el-dialog  
        title="公出地点"
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

    </div>
</template>

<script>
    import HeadTitle from './../../components/common/headTitle.vue'
    import Approve from './../../components/oa/approve_contacts.vue'
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
                    awayType:'',//公出类型
                    awayReason:'',//公出事由
                    desc: '',//公出出事由
                    beginTime:'',//开始时间
                    endTime:'',//结束时间
                    persons:'',//同行人员
                    addressDetail:'',//公出地点
                    userlocation:'',
                    peerUserIds:''
                },
                rules: {
                    awayReason:[
                        { required: true, message: '请输入公出事由', trigger: 'blur' },
                        { min:2, max: 100, message: '长度在不能超过100字符或少于2个字符', trigger: 'blur' }
                    ],
                    awayType: [
                        { required: true, message: '请选择公出类型', trigger: 'change' },
                    ],
                    day: [
                        { required: true, message: '请输入请假时长', trigger: 'blur' },
                        { validator: checkDay, trigger: 'blur' }
                    ],
                    persons: [
                        { required: true, message: '请选择同行人员', trigger: 'blur' },
                        { validator: checkDay, trigger: 'blur' }
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
            document.title='公出申请'
            let that = this;
             this.axios.get('/outsign/task/type').then(function(res){
                 console.log(res.data.b)
                if(res.data.h.code =200 ){
                    res.data.b.type.forEach(item=>{
                        that.form.type.push({value:item.value,label:item.key})
                    })
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
                if(this.peopleType.indexOf('app')==0){
                    
                     this.approvers_data = JSON.parse(JSON.stringify(arr))
                }else if(this.peopleType.indexOf('per')==0){

                    this.Personnel_data = JSON.parse(JSON.stringify(arr))
                    console.log(arr)
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
           

                let that = this;
                let auditUserIds = '',receiverIds = '',auditCompanyIds="",receiverCompanyIds="",fileObj;
                let beginTime = '',endTime = '',day = '';

                receiverIds = that.Util.getIds(that.receivers_data,'userId')
                auditUserIds = that.Util.getIds(that.approvers_data,'userId')
                auditCompanyIds = that.Util.getIds(that.approvers_data,'companyId')
                receiverCompanyIds = that.Util.getIds(that.receivers_data,'companyId')
                fileObj = that.Util.fileFo(that.accessory)

          
                let params = {
                    Id :'', // id
                    outSideReason : encodeURI(that.form.desc.replace(/\n/g, '<br/>')), //外出事由
                    outsideType:that.form.awayType,//外出类型
                    beginTime:that.Util.getDate(that.form.beginTime),//开始时间
                    endTime:that.Util.getDate( that.form.endTime),//结束时间
                    outsideAddress:that.form.addressDetail,//外出地点
                    detailAddress:that.form.addressDetail,//详细地点
                    peerNames:that.form.persons,//同行人员
                    peerUserIds:that.form.peerUserIds,
                    applyContent:that.form.desc,//申请内容
                    lon:that.form.userlocation.lng,//经度
                    lat:that.form.userlocation.lat,//纬度
                    url : fileObj.urlStr, //附件
                    auditUserIds, //审批人
                    receiverIds, //抄送人
                    draftFlag : 0, //草稿还是发送
                    auditCompanyIds,//审批人的公司id
                    receiverCompanyIds,//抄送人的公司id
                    fileName :fileObj.fileNameStr, //文件名称 
                    fileSize :fileObj.fileSizeStr, //文件大小
                    
                }
                console.log('params',params)
            
                if(!this.approvers_data.length){
                    this.$message.error('请选择审批人');
                    return;
                }
                that.axios.post(this.Service.saveAwayApply + this.Service.queryString(params)).then(function (res){
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