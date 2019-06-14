<template>
    <div class="main">
        <HeadTitle
            title="请假"
            icon='qingjia'
        ></HeadTitle>
        <div class="content">
            <el-form ref="form" :rules="rules" :model="form" label-width="100px">
                 <el-form-item label="请假类型" prop="leaveType">
                    <!-- <el-input v-model="form.name"></el-input> -->
                    <el-select v-model="form.leaveType" placeholder="请选择">
                        <el-option
                        v-for="item in form.type"
                        :key="item.value"
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

                <el-form-item label="时长 (天)" prop="day"> 
                    <el-input v-model="form.day" placeholder="请输入时长 (0.5为单位)"></el-input>
                </el-form-item>

                <el-form-item class="textareaBox" label="请假事由" prop="desc" >
                     <el-input  type="textarea" v-model="form.desc" maxlength="150" placeholder="请输入请假事由">
                     </el-input>
                     <span class="textNum">{{wordCount}}/150</span>
                     <!-- <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div> -->
                </el-form-item>

                <File :accessory="accessory"
                    v-on:remove="removeFile"
                >

                </File>

                <!-- <el-form-item class="fileUpload" label="附件">
                    
                    <a class="file-btn" v-if="accessory.length<10">上传附件
                        <input type="file" @change="change">
                    </a>
                    <span class="el-upload__tip">仅支持图片、文档( .doc/.docx/.ppt/.pptx/.txt/.jpg/.jpeg/.png/.xlsx/.xls/.pdf/.zip/.rar)</span>

                    <div>
                        <ul class="file-list" v-if="accessory.length">
                            <li class="file-item" v-for="(item,index) in accessory" :key="index">
                                <div class="item-content">
                                    <img src="./../../assets/wenjian.png" v-if="!item.isImg"/>
                                    <img v-else :src="item.url"/>
                                    <div class="file-info">
                                        <p class="omit">{{item.fileName}}</p>
                                        <span>{{item.fileSize |fileSize}}</span>
                                    </div>
                                    <div v-if="!item.status"  class="progress">
                                        <el-progress :percentage="item.percentage" stroke-width="15" :show-text="false" status="success"></el-progress>
                                    </div>
                                </div>
                                
                                <div v-if="item.status">
                                    <el-button >查看</el-button>
                                    <el-button @click="removeFile(index)">删除</el-button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </el-form-item> -->



                
                <el-form-item  label="审批人">
                    <span style="color:#24b36b;cursor: pointer;" @click="dialogVisible=true">审批指引</span>
                    <div class="approver-list">
                        <div class="approver-li" v-for="(item,index) in approvers_data" :key="index">
                            <div class="ap_item user-info">
                                <svg style="width:15px;height:15px;" class="icon" aria-hidden="false" @click="remove(0,index)">
                                    <use xlink:href="#icon-shanchu"></use>
                                </svg>
                                <img :src="item.profileImg"/>
                                <p class="omit">{{item.name}}</p>
                            </div>
                            <div class="arrows">
                                <svg style="width:15px;height:15px" class="icon" aria-hidden="false">
                                    <use xlink:href="#icon-jiantou1"></use>
                                </svg>
                            </div>
                        </div>

                        <div class="approver-li">
                            <div class="approver-add"  @click="selectOpen('app')">
                                <svg style="width:50px;height:50px;" class="icon" aria-hidden="false">
                                    <use xlink:href="#icon-tianjiarenyuan"></use>
                                </svg>
                                <div>添加</div>
                            </div>
                        </div>
                    </div>

                    <el-dialog
                    title="请参考以下流程添加审批人"
                    :visible.sync="dialogVisible"
                    width="400px"
                    >
                    <div class="guide_content">
                        <div style="margin-bottom:0.2rem;overflow:hidden">
                            <div class="guide_item" v-for="(item,index) in guideData[1]" :key="index">
                            <svg  class="icon" aria-hidden="false">
                                <use xlink:href="#icon-shenpiliuchengtouxiang"></use>
                            </svg>
                            <p>{{item}}</p>
                            <span v-if="index==guideData[1].length-1&item=='人事行政部门'">(抄送)</span>
                            <div class="guide_arrows">
                                <svg style="font-size: 0.12rem" class="icon" aria-hidden="false" v-if="index!=guideData[1].length-1">
                                    <use xlink:href="#icon-jiantou1"></use>
                                </svg>
                            </div>
                            </div>
                        </div>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="dialogVisible = false">知道了</el-button>
                    </span>
                    </el-dialog>

                </el-form-item>
                
                <el-form-item  label="抄送人">
                    <span>审批通过后抄送相关人</span>
                    <div class="approver-list">
                        <div class="approver-li" v-for="(item,index) in receivers_data" :key="index">
                            <div class="user-info">
                                <svg style="width:15px;height:15px;" class="icon" aria-hidden="false" @click="remove(1,index)">
                                    <use xlink:href="#icon-shanchu"></use>
                                </svg>
                                <img :src="item.profileImg"/>
                                <p class="omit">{{item.name}}</p>
                            </div>
                            <div class="arrows">
                                <svg style="width:15px;height:15px" class="icon" aria-hidden="false">
                                    <use xlink:href="#icon-jiantou1"></use>
                                </svg>
                            </div>
                        </div>

                        <div class="approver-li">
                            <div class="approver-add"  @click="selectOpen('rec')">
                                <svg style="width:50px;height:50px;" class="icon" aria-hidden="false">
                                    <use xlink:href="#icon-tianjiarenyuan"></use>
                                </svg>
                                <div>添加</div>
                            </div>
                        </div>
                    </div>
                </el-form-item>
                
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
            
        ></AddressList>
    </div>
</template>

<script>
    import HeadTitle from './../../components/common/headTitle.vue'
    import AddressList from './../../components/common/addressList.vue'
    import File from './../../components/oa/file.vue'

    export default {
        data() {
             var checkDay = (rule, value, callback) => {
                if (value*10%5!=0) {
                    console.log(this.form.beginTime)
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
                    name: '',
                    day:'',
                    type: [],
                    leaveType:'',
                    desc: '',
                    beginTime:'',
                    endTime:'',
                },
                rules: {
                    leaveType: [
                        { required: true, message: '请选择请假类型', trigger: 'change' },
                    ],
                    day: [
                        { required: true, message: '请输入请假时长', trigger: 'blur' },
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
                peopleType:false,//打开通讯录类型
                openAdd:false,
                accessory:[],
                dialogVisible:false,
                btnStatus:true,
                wordCount:0,
                guideData:[
                ['发起人','部门负责人','人事行政部门','总经理','人事行政部门'],// 
                ['发起人','部门负责人','财务管理中心','总经理','人事行政部门'],
                ['发起人','部门负责人','财务管理中心','法务部','总经理','董事办'],
                ['发起人','相关领导1','相关领导2','相关领导3','公司领导','董事办'],
                ['发起人','部门负责人','总经理','人事行政部门'],
                ['发起人','部门负责人','财务管理中心','法务部','用印管理部门','总经理','董事办'],
                ['发起人','部门负责人','综合管理中心','财务管理中心','总经理','董事办'],//离职
                ['发起人','部门负责人','总经理','综合管理中心','董事办'], //接待
                ['发起人','部门负责人','综合管理中心','总经理','人事行政部门'], //补卡
                ['发起人','部门负责人','综合管理中心','总经理','董事办'],//用人 转正
                ['发起人','部门负责人','财务管理中心','总经理','董事办'],//付款 借款
                ['发起人','部门负责人','综合管理中心'],//用车
                ['发起人','部门负责人','研发中心负责人','总经理','董事办'],//项目立项
                ]
            }
        },
        components:{
            HeadTitle,
            AddressList,
            File
        },
        created(){
            let that = this;
             this.axios.get('/work/leave/type/list').then(function(res){
                if(res.data.h.code =200 ){
                    res.data.b.data.forEach(item=>{
                        that.form.type.push({value:item.id,label:item.name})
                    })
                }
            })
        },
        watch:{
            'form.desc':function(val){
                this.wordCount = val.length
            }
        },
        methods:{
            close(){
                this.openAdd=false
            },
            choose(arr){
                this.openAdd=false
           
                if(this.peopleType.indexOf('app')!=0){
                    this.receivers_data = JSON.parse(JSON.stringify(arr))
                }else{
                    this.approvers_data = JSON.parse(JSON.stringify(arr))
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
                this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.submit()
                } else {
                    console.log('error submit!!');
                    return false;
                }
                });
            },
            submit(){
                let that = this;
                
        let auditUserIds = '',receiverIds = '',auditCompanyIds="",receiverCompanyIds="",fileObj;

                receiverIds = that.Util.getIds(that.receivers_data,'userId')
                auditUserIds = that.Util.getIds(that.approvers_data,'userId')
                auditCompanyIds = that.Util.getIds(that.approvers_data,'companyId')
                receiverCompanyIds = that.Util.getIds(that.receivers_data,'companyId')
                 fileObj = that.Util.fileFo(that.accessory)

                that.axios.post(this.Service.saveLeave + this.Service.queryString({
                    Id :'', // id
                    leaveType: that.form.leaveType, //请假类型
                    beginTime:that.Util.getDate(that.form.beginTime), //开始时间
                    endTime :that.Util.getDate( that.form.endTime), //结束时间
                    leaveDuration : that.form.day, //请假天数
                    auditUserIds, //审批人
                    receiverIds, //抄送人
                    auditCompanyIds,
                    receiverCompanyIds,
                    reason : encodeURI(that.form.desc), //请假事由
                    url : fileObj.urlStr, //附件
                    fileName :fileObj.fileNameStr, //文件名称 
                    fileSize :fileObj.fileSizeStr, //文件大小
                    draftFlag : 0, //草稿还是发送
                    })).then(function (res){
                        if(res.data.h.code!=200){
                            that.$message(res.data.h.msg)
                        }else if(res.data.h.code == 200){
                            console.log(res.data.b)
                             that.$message({
                                showClose: true,
                                message: '提交成功!',
                                type: 'success',
                                onClose:function(){
                                    location.href = that.Service.baseUrl+'myApply'
                                }
                                });
                            
                        }
                })
            },
            removeFile(index){
                this.accessory.splice(index,1)
            },
            change(evfile){
                let that = this;
                let file = evfile.target.files[0] //Blob 对象，上传的文件
                let file_obj = {},size=0;

                that.accessory.forEach(el=>{
                    size+=el.fileSize
                })

                file_obj.fileName = file.name
                file_obj.fileSize = file.size
                if(size+file.size>100 * 1024 * 1024){
                    this.$message.error('上传的附件大小不能超过100M')
                    return false;
                }

                if(!/\.(doc|docx|ppt|pptx|txt|jpg|jpeg|png|xlsx|xls|pdf|zip|rar)$/.test(file_obj.fileName)){
                            this.$message.error('你选择的附件格式不支持')
                            return false;
                }

                file_obj.url = '1.text'
                file_obj.isImg = this.isImg(file.name)
                file_obj.status = false
                file_obj.percentage = 0
                let index = that.accessory.length

                that.accessory[index]=file_obj
                this.$set(this.accessory,index,file_obj)


                this.axios.get('/public/upload/token?suffix='+file.name.substring(file.name.lastIndexOf('.') + 1)).then(res=>{
                    
                    let uptoken  = res.data.b.uploadToken
                    var key = res.data.b.key
                    let config = {
                        useCdnDomain: true,   //表示是否使用 cdn 加速域名，为布尔值，true 表示使用，默认为 false。
                        region: qiniu.region.z2     // 根据具体提示修改上传地区,当为 null 或 undefined 时，自动分析上传域名区域
                    };

                    let putExtra = {
                        fname: file.name,  //文件原文件名
                        params: {}, //用来放置自定义变量
                        mimeType: null  //用来限制上传文件类型，为 null 时表示不对文件类型限制；限制类型放到数组里： ["image/png", "image/jpeg", "image/gif"]
                    };

                     var observable = qiniu.upload(file, key, uptoken, putExtra, config);
                        observable.subscribe({
                        next: (result) => {
                        // 主要用来展示进度
                            that.accessory[index].percentage = parseInt(result.total.percent)

                        },
                        error: (errResult) => {
                        // 失败报错信息
                            that.accessory[index].status = false 
                            that.accessory.splice(index,1)
                            this.$message.error('文件上传失败');
                        },
                        complete: (result) => {
                        // 接收成功后返回的信息
                            that.accessory[index].url = 'https://qiniu.epipe.cn/'+result.key
                            that.accessory[index].status = true
                        }
                        })

                })
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

//    附件

    /deep/ .el-upload__tip{
        margin-left 20px;
        font-size 14px;
    }

    /deep/ .upload-demo{
        width 650px;
    }

    .main >>>.el-upload-list__item-name{
        height 40px;
        font-size 16px;
        line-height 40px;
    }


    .approver-list{
        box-sizing border-box
        width 650px;
        padding 15px
        padding-top:0;
        background-color #f5f5f5
        overflow hidden
        border-radius 4px;
    }

    .approver-li{
        display flex;
        position relative;
        float left
        line-height 20px;
        width 75px;
        height 100%
        text-align center
        margin-right 10px;
        margin-top:15px;

        img{
            display inline-block
            width 50px
            height 50px
            border-radius 50%; 
        }
    }

    .arrows{
        position:absolute;
        right:-10px;
        width 16px;
        margin-left 10px

        svg{
            margin-top:20px;
        }
    }

  .user-info{
      position relative;
      width:100%;
      text-align:center;

      svg{
          position absolute 
          right 10px
          top -2px
          cursor pointer
          background-color:#fff;
          border-radius 50%;
      }
  }

  .approver-add{
    cursor pointer
    margin:0;
    width:100%;
    text-align:center;
  }


  .main>>>.el-input__inner{
  border 1px solid #ccc;
}


 .guide_content{
          background-color #fff;
          z-index 10
          padding-bottom 15px;

    }

    .guide_item{
      position relative;
      width 25%;
      text-align center;
      line-height:normal;

      svg{
          width 40px;
          height:40px;
      }

      span{
        font-size 14px;
        color #999;
      }

    }

    .guide_arrows{
          position absolute;
          right 0px;
          top 15px;
    }

    .guide_arrows svg{
        width:15px;
        height:15px;
    }

    .guide_item:nth-child(1),.guide_item:nth-child(2),.guide_item:nth-child(3),.guide_item:nth-child(4) {
        float left;
        padding-bottom 35px;
    }

    .guide_item:nth-child(4) .guide_arrows{
        transform rotate(90deg)
        position absolute;
        width 20px;
        height 12px;
        bottom -50px;
        left 0;
        right 0;
        margin auto ;
    }


    .guide_item:nth-child(5),.guide_item:nth-child(6),.guide_item:nth-child(7){
        float right;

        .guide_arrows{
          position absolute;
          left -90px;
          top 10px;
          transform rotate(180deg)
        }
    }

    //  .guide_item:nth-child(6){
    //     padding-bottom 35px;
    //  }

    // .guide_item:nth-child(6) .guide_arrows{
    //     transform rotate(90deg)
    //     position absolute;
    //     width 20px;
    //     height 12px;
    //     bottom -50px;
    //     left 0;
    //     right 0;
    //     margin auto ;
    // }

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


    .btn_box{
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