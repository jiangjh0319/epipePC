<template>
    <div class="main">
        <HeadTitle
            title="采购"
            icon='buy'
        ></HeadTitle>
        <div class="content">
            <el-form ref="form" :rules="rules" :model="form" label-width="130px">
                <el-form-item label="申请事由" prop="userBuyApplyTheme"> 
                    <el-input v-model="form.userBuyApplyTheme" placeholder="请输入申请事由" ></el-input>
                </el-form-item>
                <el-form-item label="采购类型" prop="typeValue"> 
                    <el-select v-model="form.typeValue" placeholder="请选择" @change="hanlderVal">
                        <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.key"
                        :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="期望交付日期"  prop="hopeDeliveryDate">
                        <el-date-picker
                            v-model="form.hopeDeliveryDate"
                            type="date"
                            placeholder="请选择">
                        </el-date-picker>
                </el-form-item>
                <div v-for="(v,index) in form.list" :key="index">
                    <el-form-item v-if="ishowDelet"> 
                        采购明细（{{index+1}}）<el-button type="danger" round @click="deleteRules(v,index)">删除</el-button>
                    </el-form-item>

                    <el-form-item label="名称" :prop="'list.'+index+'.name'" :rules="[{required: true, message: '请输入名称'}]"> 
                        <el-input v-model="v.name" placeholder="请输入名称"></el-input>
                    </el-form-item>
                    <el-form-item label="规格" :prop="'list.'+index+'.specifications'" :rules="[{required: true, message: '请输入规格'}]"> 
                        <el-input v-model="v.specifications" placeholder="请输入规格"></el-input>
                    </el-form-item>
                    <el-form-item label="数量" :prop="'list.'+index+'.number'" :rules="[{required: true, message: '请输入数量'}]"> 
                        <el-input v-model="v.number" type="number" @input="totalPriceF" placeholder="请输入数量"></el-input>
                    </el-form-item>
                    <el-form-item label="单位" :prop="'list.'+index+'.unit'" :rules="[{required: true, message: '请输入单位'}]"> 
                        <el-input v-model="v.unit" placeholder="请输入单位"></el-input>
                    </el-form-item>
                    <el-form-item label="价格" :prop="'list.'+index+'.price'" :rules="[{required: true, message: '请输入价格'}]"> 
                        <el-input v-model="v.price" type="number" @input="totalPriceF" placeholder="请输入价格"></el-input>
                    </el-form-item>
                </div>
                <el-form-item> 
                    <el-button type="primary" round @click="addList">+ 增加采购明细</el-button>
                </el-form-item>
                 <el-form-item label="总价格"> 
                    <el-input v-model="totalPrice"  disabled></el-input>
                </el-form-item>
                <el-form-item label="支付方式" prop="payType"> 
                    <el-select v-model="form.payType" placeholder="请选择" @change="hanlderPayType">
                        <el-option
                        v-for="item in optionsPayType"
                        :key="item.value"
                        :label="item.key"
                        :value="item.value"
                        >
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item class="textareaBox" label="备注" prop="userBuyApplyRemarks" >
                     <el-input  type="textarea" v-model="form.userBuyApplyRemarks" maxlength="150" placeholder="请输入备注,限定1000字">
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
                    type: [],
                    userBuyApplyTheme:'',//申请事由
                    userBuyApplyRemarks: '',//备注
                    list:[
                        {
                            name:'',//物品名称
                            specifications:'',//规格
                            unit:'',//单位
                            price:'',//价格
                            number:''//数量
                        }
                    ],
                    typeValue: '',
                    hopeDeliveryDate:'',
                    totalPrice:0,
                    payType:''
                },
                buyTypeCode:'',
                payTypeCode:'',
                options: [],
                optionsPayType:[],
                rules: {
                    userBuyApplyTheme:[
                        { required: true, message: '申请事由不能为空', trigger: 'blur' },
                        { min:2, max: 100, message: '申请事由不能低于2个或超过100个字符', trigger: 'blur' }
                    ],
                    userBuyApplyRemarks:[
                        { required: true, message: '请输入备注', trigger: 'blur' },
                        { min:1, max: 150, message: '长度在不能超过150字符', trigger: 'blur' }
                    ],
                    hopeDeliveryDate:[
                        {required: true, message: '请选择时间'}
                    ],
                    typeValue:[
                        {required: true, message: '请选择采购类型'}
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
                isMore:true,
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
            document.title='采购'
            let that = this;
             this.axios.get('/work/leave/type/list').then(function(res){
                if(res.data.h.code =200 ){
                    res.data.b.data.forEach(item=>{
                        that.form.type.push({value:item.id,label:item.name})
                    })
                }
            })
            this.axios.get(this.Service.getBuyTypeApi).then(res=>{//采购类型
                // console.log('采购类型',res)
                if(res.data.h.code =200 ){
                //    console.log(res.data.b)
                   this.options = res.data.b;
                }
            })
            this.axios.get(this.Service.getPayTypeApi).then(res=>{//支付方式
                // console.log('支付方式',res)
                if(res.data.h.code =200 ){
                //    console.log(res.data.b)
                   this.optionsPayType = res.data.b;
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
            'form.userBuyApplyRemarks':function(val){
                this.wordCount = val.length
            }
        },
        computed:{
            getAddrDetail(){
                return this.$store.state.addressDetail;
            }
        },
        methods:{
            totalPriceF(){
                let total = 0
                this.form.list.forEach(item=>{
                    let num = item.number==''?0:item.number
                    let price = item.price==''?0:item.price

                    if(isNaN(num)||isNaN(price)){
                        return
                    }
                    total+=parseFloat(num) * parseFloat(price)
                })
                this.totalPrice = total.toFixed(1)+'元';
             },
            hanlderVal(val){
                console.log(val,'采购')
                this.buyTypeCode = val;
            },
            hanlderPayType(val){
                console.log(val,'支付')
                this.payTypeCode = val;
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
            addList() {//添加明细
                this.form.list.push({
                    name:'',
                    specifications:'',
                    number:'',
                    unit:'',
                    price:''

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
                    this.totalPriceF()
                }
            },
             add_people(index){
                this.approver_index = index
                this.showGroup = this.allApprovers[index].approvalUserScope=='0'?true:false;
                this.approvers_data = this.allApprovers[index].auditers
                this.isMore = this.allApprovers[index].remarks=='0'?false:true;
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
                    userBuyApplyTheme:that.form.userBuyApplyTheme,//标题
                    userBuyApplyRemarks :that.form.userBuyApplyRemarks, //备注
                    payType:that.payTypeCode,//支付方式
                    buyType:that.buyTypeCode,//采购类型
                    hopeDeliveryDate: that.Util.getDate(that.form.hopeDeliveryDate),//交付日期
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
                     params['list['+index+'].name'] = item.name;
                     params['list['+index+'].specifications'] = item.specifications;
                     params['list['+index+'].number'] = item.number;
                     params['list['+index+'].unit'] = item.unit;
                     params['list['+index+'].price'] = item.price;
                    
                })
                that.axios({
                    method:"post",
                    url:`${this.Service.getBuySaveApi}`,
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