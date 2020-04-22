<template>
    <div class="main">
        <HeadTitle
            title="报销"
            icon='reimburse'
        ></HeadTitle>
        <div class="content">
            <el-form ref="form" :rules="rules" :model="form" label-width="140px">
                <el-form-item label="文件标题" prop="reimburseApplyTitle"> 
                    <el-input v-model="form.reimburseApplyTitle" placeholder="请输入标题" ></el-input>
                </el-form-item>
                <el-form-item label="报销人" style="width:180px"> 
                        <el-input v-model="userInfo.name" placeholder="请选择"  disabled></el-input>
                </el-form-item>
                <el-form-item label="所属部门"> 
                    <el-input v-model="userInfo.officeName" placeholder="所属部门" disabled></el-input>
                </el-form-item>
                <div v-for="(v,index) in form.list" :key="index">
                    <el-form-item v-if="ishowDelet"> 
                        报销明细（{{index+1}}）<el-button type="danger" round @click="deleteRules(v,index)">删除</el-button>
                    </el-form-item>

                    <el-form-item label="金额" :prop="'list.'+index+'.reimburseAmount'" :rules="[{required: true, message: '请输入金额'}]"> 
                        <el-input v-model="v.reimburseAmount" type="number" placeholder="请输入金额"></el-input>
                    </el-form-item>
                    <el-form-item label="日期" :prop="'list.'+index+'.reimburseDate'" :rules="[{required: true, message: '请输入日期'}]">
                        <el-date-picker
                            v-model="v.reimburseDate"
                            type="date"
                            placeholder="请选择">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="报销类别"  :prop="'list.'+index+'.positionType'" :rules="[{required: true, message: '请选择报销类别'}]"> 
                    <el-select v-model="v.positionType" placeholder="请选择" @change="hanlderVal">
                        <el-option
                        v-for="item in positionTypeOptions"
                        :key="item.value"
                        :label="item.key"
                        :value="item.value"
                        >
                        </el-option>
                    </el-select>
                    </el-form-item>
                    <el-form-item class="textareaBox" label="费用明细"  :prop="'list.'+index+'.materialReceiveRemarks'" :rules="[{required: true, message: '请输入费用明细'}]" >
                     <el-input  type="textarea" v-model="v.materialReceiveRemarks" maxlength="1000" placeholder="请输入费用明细">
                     </el-input>
                    
                    </el-form-item>
                </div>
                <el-form-item label="总报销金额"> 
                    <el-input v-model="totalAmount" placeholder="总报销金额" disabled ></el-input>
                </el-form-item>
                <el-form-item> 
                    <el-button type="primary" round @click="addList">+ 增加报销明细</el-button>
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
            return {
                form: {
                    type: [],
                    reimburseApplyTitle:'',
                    list:[
                        {
                            reimburseAmount:'',
                            reimburseDate:'',
                            positionType:'',
                            materialReceiveRemarks:''
                        }
                    ],
                },
          
                userInfo:{},
                positionTypeOptions:[],
                rules: {
                    reimburseApplyTitle:[
                        { required: true, message: '请输入文件标题', trigger: 'blur' },
                        { min:2, max: 100, message: '文件标题不能低于2个或超过100个字符', trigger: 'blur' }
                    ],
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
            document.title='报销'
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
            this.axios.post('/user/current/userinfo').then((res)=>{
            this.userInfo.name = res.data.b.name
            this.userInfo.officeName = res.data.b.officeName
            this.userInfo.userPosition = res.data.b.userPosition
            this.userInfo.userId = res.data.b.id
            })
            this.axios.get('/work/reimburse/type').then(res=>{
                if(res.data.h.code =200 ){
                //    console.log(res.data.b)
                   this.positionTypeOptions = res.data.b;
                }
            })
        },
        watch:{
      
        },
        computed:{
            getAddrDetail(){
                return this.$store.state.addressDetail;
            },
            totalAmount(){
                let count = 0 ;
                this.form.list.forEach(item =>{
                    count+= (item.reimburseAmount - 0)
                })

                return count + '元'
            },
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
                            reimburseAmount:'',
                            reimburseDate:'',
                            positionType:'',
                            materialReceiveRemarks:''
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
                        this.form.list[this._index].persons = personsData;
                        this.form.list[this._index].peerUserIds = userId;
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
                    reimburseApplyTitle:that.form.reimburseApplyTitle,//标题
                    officeName:that.userInfo.officeName,


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
                        console.log('to',item)
                     params['list['+index+'].reimburseAmount'] = item.reimburseAmount;
                     params['list['+index+'].reimburseDate'] =that.Util.getDate(item.reimburseDate);
                     params['list['+index+'].reimburseType'] = item.positionType;
                     params['list['+index+'].reimburseDesc'] = item.materialReceiveRemarks;


                })
                that.axios({
                    method:"post",
                    url:`${this.Service.getReimburseSave}`,
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
                // that.axios.post(this.Service.recipientsApi + this.Service.queryString(params))
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