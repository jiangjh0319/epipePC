<template>
    <div class="main">
        <HeadTitle
            title="档案移交"
            icon='chucha'
        ></HeadTitle>
        <div class="content">
            <el-form ref="form" :rules="rules" :model="form" label-width="100px">
                <el-form-item label="移交编号" prop="dossierBorrowNo"> 
                    <el-input v-model="form.applyNum" readonly placeholder="请输入移交编号" ></el-input>
                </el-form-item>
                <el-form-item label="移交申请人" prop="browwUser"> 
                    <el-input v-model="form.userName" readonly placeholder="请输入移交申请人" ></el-input>
                </el-form-item>
                <el-form-item label="所属部门"> 
                    <el-input v-model="form.departmentName" readonly placeholder="所属部门" ></el-input>
                </el-form-item>
                <el-form-item label="移交名称" prop="browwName" > 
                    <el-input v-model="form.browwName" placeholder="请输入移交名称" ></el-input>
                </el-form-item>
                <el-form-item label="移交日期" prop="returnDate">
                        <el-date-picker
                            v-model="form.returnDate"
                            type="datetime"
                            placeholder="请选择">
                        </el-date-picker>
                </el-form-item>
                <el-form-item label="接收人" prop="persons"> 
                        <el-input v-model="form.persons" placeholder="请选择" @focus='getPersons'></el-input>
                </el-form-item>
                 <el-form-item label="接收部门"> 
                    <el-input v-model="form.officeName" placeholder="请输入接收部门" ></el-input>
                </el-form-item>
                
                <div v-for="(v,index) in form.list" :key="index">
                    <el-form-item v-if="ishowDelet"> 
                        档案明细（{{index+1}}）<el-button type="danger" round @click="deleteRules(v,index)">删除</el-button>
                    </el-form-item>
                    <el-form-item label="档案名称">  
                        <el-select v-model="v.name" filterable  clearable placeholder="搜索档案名称" @change="selectValue" @focus="hanlderIndex(index)">
                            <el-option
                            v-for="item in newArr"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                            </el-option>
                        </el-select> 
                       
                    </el-form-item>
                    <el-form-item label="档案编号"> 
                        <el-input v-model="v.no" readonly placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="存放位置"> 
                        <el-input v-model="v.dossierLocationName" readonly placeholder=""></el-input>
                    </el-form-item>
                    <el-form-item label="管理员"> 
                        <el-input v-model="v.managerName" readonly placeholder=""></el-input>
                    </el-form-item>
                </div>
                     <el-form-item> 
                        <el-button type="primary" round @click="addList">增加档案明细</el-button>
                    </el-form-item>
                <el-form-item class="textareaBox" label="移交说明" prop="desc" >
                     <el-input  type="textarea" v-model="form.desc" maxlength="150" placeholder="请输入移交说明">
                     </el-input>
                     <span class="textNum">{{wordCount}}/150</span>
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
            return {
                form: {
                    applyNum:'',
                    departmentName:'',
                    userName:'',
                    browwName:'',
                    returnDate:'',
                    persons:'',
                    officeName:'',
                    list:[
                        {
                            name:'',
                            id:'',
                            no:'',
                            dossierLocationName:'',
                            dossierLocationId:'',
                            managerId:'',
                            managerName:'',
                            isShowRadio:false
                        }
                    ],
                },
                rules: {
                    browwName:[
                        { required: true, message: '移交名称不能为空', trigger: 'blur' },
                        { min:2, max: 100, message: '长度在不能超过100字符或少于2个字符', trigger: 'blur' }
                    ],
                    returnDate:[
                        { required: true, message: '请选择时间', trigger: 'change' }
                    ],
                    persons:[
                        {required: true, message: '请选择接收人', trigger: 'change'}
                    ],
                    desc:[
                        { required: true, message: '请输入移交说明', trigger: 'blur' },
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
                userInfo:{},
                per_index:0,
                newArr:[],
                selectIndex:0,
                radio:[]
              
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
            document.title='档案移交'
            let that = this;
            this.axios.post('/user/current/userinfo').then(function(res){
                that.form.departmentName = res.data.b.officeName
                that.form.userName = res.data.b.name
            })  
            this.axios.get('work/dossierTransferApply/no').then(res=>{
                console.log(res,'移交编号数据')
                if(res.data.h.code==200){
                    this.form.applyNum = res.data.b.no;
                }else{
                    this.$toast(res.data.h.msg)
                }
            })

            this.axios.get("work/dossierBorrowApply/token?pageNo=1&pageSize=10").then(res=>{
                if(res.data.h.code==200){
                console.log(res.data.b.b.dataList,'档案名称')
                this.newArr = res.data.b.b.dataList;
                console.log(this.newArr,'new')
                return
                if(this.newArr.length==0){
                    this.columns.push('暂无数据')
                }else{
                    for(let val of this.newArr){
                        // console.log(val,'val')
                        this.columns.push(val.name)
                        this.archNameIds.push(val.id)
                    }
                }
                }else{
                    this.$toast(res.data.h.msg)
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
            hanlderIndex(index){
                console.log(index,'inde')
                this.selectIndex = index;
            },
            selectValue(id){
                    
                let selectArr = []
                    this.item = this.newArr.find((item,index) => {
                        if(item.id==id){  
                            console.log(item,'item')
                            this.form.list[this.selectIndex].name = item.name;
                            this.form.list[this.selectIndex].id = item.id;
                            this.form.list[this.selectIndex].no = item.no;
                            this.form.list[this.selectIndex].dossierLocationName = item.dossierLocationName;
                            this.form.list[this.selectIndex].dossierLocationId = item.dossierLocationId;
                            this.form.list[this.selectIndex].managerName = item.managerName;
                            this.form.list[this.selectIndex].managerId = item.managerId;

                            this.form.list[this.selectIndex].isShowRadio = item.containPage=='1'?true:false;
                            this.form.list[this.selectIndex].dossierId = item.id;
                            this.form.list[this.selectIndex].containPage = item.containPage;
                        }          
                    })    
            },
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
            changeRadio(name){
                console.log('name',name)
                this.form.list[this.selectIndex].whetherNeedPage = name;
        
            },
            addList() {//添加明细
                this.form.list.push({
                    name:'',
                    id:'',
                    no:'',
                    dossierLocationName:'',
                    dossierLocationId:'',
                    managerId:'',
                    managerName:'',
                    isShowRadio:false
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
            getPersons(){
                // this.per_index = index;
                // this.Personnel_data = this.form.list[index].data
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
                    console.log(arr[0],'arr')
                    this.userInfo = arr[0]
                    this.form.persons = arr[0].name
                    this.form.officeName = arr[0].officeName
                    // this.form.userId = arr[0].userId
                    // let arrs = JSON.parse(JSON.stringify(arr))
                    // this.form.list[this.per_index].data = arrs
                    // for(let val of arrs){
                    //     peerUserIds.push(val.userId)
                    //     arrName.push(val.name)
                    // }

                    // this.form.list[this.per_index].persons = arrName.join(',');
                    // this.form.list[this.per_index].peerUserIds = peerUserIds.join(',')
                       
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
                    dossierTransferNo:that.form.applyNum,//移交编号
                    transferReason : encodeURI(that.form.desc.replace(/\n/g, '<br/>')), //移交说明
                    transferName:that.form.browwName,//移交名称
                    transferDate:that.Util.getDate(that.form.returnDate),//移交日期
                    // receiveCompany:that.userInfo.companyName,//接收人公司
                    receiveOffice:that.userInfo.officeName,//接收人部门
                    receiveId:that.userInfo.userId,//接收人ID
                    

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
                     params['dmInfo['+index+'].dossier'] = item.name;
                     params['dmInfo['+index+'].dossierId'] = item.id;
                     params['dmInfo['+index+'].oldDossierLocation'] = item.dossierLocationName;
                     params['dmInfo['+index+'].oldDossierLocationId'] = item.dossierLocationId;
                     params['dmInfo['+index+'].dossierBorrowNoDm'] = item.no;
                     params['dmInfo['+index+'].handleUser'] = item.managerName;
                     params['dmInfo['+index+'].handleUserId'] = item.managerId;
              

                })
                console.log(params)
                // return
                that.axios.post(this.Service.saveDossierTransferApply + this.Service.queryString(params)).then(function (res){
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