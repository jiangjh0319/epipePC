<template>
    <div class="main">
        <HeadTitle
            title="请假"
            icon='qingjia'
        ></HeadTitle>
        <div class="content">
            <el-form ref="form" :model="form" label-width="100px">
                 <el-form-item label="请假类型">
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

                <el-form-item label="开始时间">
                    <!-- <el-input v-model="form.name"></el-input> -->
                    <el-date-picker
                        v-model="form.beginTime"
                        type="datetime"
                        placeholder="请选择">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="结束时间">
                    <el-date-picker
                        v-model="form.endTime"
                        type="datetime"
                        placeholder="请选择">
                    </el-date-picker>
                    <!-- <el-input v-model="form.name"></el-input> -->
                </el-form-item>

                <el-form-item label="时长 (天)">
                    <el-input v-model="form.day" placeholder="请输入时长 (0.5为单位)"></el-input>
                </el-form-item>

                <el-form-item class="textareaBox" label="请假事由">
                     <el-input  type="textarea" v-model="form.desc">
                     </el-input>
                     <!-- <span class="textNum">0/150</span> -->
                     <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
                </el-form-item>
                <!-- <el-form-item class="textareaBox" label="附件">
                    <el-upload
                    class="upload-demo"
                    action="https://jsonplaceholder.typicode.com/posts/"
                    :on-preview="handlePreview"
                    :on-remove="handleRemove"
                    :before-remove="beforeRemove"
                    multiple
                    :limit="3"
                    :on-exceed="handleExceed"
                    :file-list="fileList">
                    <el-button size="small" type="success">添加附件</el-button>
                    <span slot="tip" class="el-upload__tip">仅支持图片、文档( .doc/.docx/.ppt/.pptx/.txt/.jpg/.jpeg/.png/.xlsx/.xls/.pdf)</span>
                    </el-upload>
                </el-form-item> -->

                <el-form-item class="fileUpload" label="附件">
                    
                    <a>上传附件
                        <input type="file" >
                    </a>
                    <span class="el-upload__tip">仅支持图片、文档( .doc/.docx/.ppt/.pptx/.txt/.jpg/.jpeg/.png/.xlsx/.xls/.pdf)</span>

                    <div>
                        <ul>
                            <li>
                                <img/>
                                <div>
                                    <p>请假申请表</p>
                                    <span></span>
                                </div>
                                <div>
                                    <el-button >查看</el-button>
                                    <el-button >删除</el-button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </el-form-item>



                
                <el-form-item  label="审批人">
                    <span>审批指引</span>
                    <div class="approver-list">
                        <div class="approver-li" v-for="(item,index) in approvers_data" :key="index">
                            <div class="ap_item">
                                <img :src="item.profileImg"/>
                                {{item.name}}
                            </div>
                            <div class="arrows">
                                <svg style="width:15px;height:15px" class="icon" aria-hidden="false">
                                    <use xlink:href="#icon-jiantou1"></use>
                                </svg>
                            </div>
                        </div>

                        <div class="approver-li">
                            <div class="approver-add"  @click="selectOpen(0)">
                                <svg style="width:50px;height:50px;" class="icon" aria-hidden="false">
                                    <use xlink:href="#icon-tianjiarenyuan"></use>
                                </svg>
                                <div>添加</div>
                            </div>
                        </div>
                    </div>
                </el-form-item>
                
                <el-form-item  label="抄送人">
                    <span>审批通过后抄送相关人</span>
                    <div class="approver-list">
                        <div class="approver-li" v-for="(item,index) in receivers_data" :key="index">
                            <div class="user-info">
                                <svg style="width:15px;height:15px;" class="icon" aria-hidden="false">
                                    <use xlink:href="#icon-shanchu"></use>
                                </svg>
                                <img :src="item.profileImg"/>
                                {{item.name}}
                            </div>
                            <div class="arrows">
                                <svg style="width:15px;height:15px" class="icon" aria-hidden="false">
                                    <use xlink:href="#icon-jiantou1"></use>
                                </svg>
                            </div>
                        </div>

                        <div class="approver-li">
                            <div class="approver-add"  @click="selectOpen(1)">
                                <svg style="width:50px;height:50px;" class="icon" aria-hidden="false">
                                    <use xlink:href="#icon-tianjiarenyuan"></use>
                                </svg>
                                <div>添加</div>
                            </div>
                        </div>
                    </div>
                </el-form-item>

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

    export default {
        data() {
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
                approvers_data:[],//审批人
                receivers_data:[],//抄送人
                peopleType:0,//打开通讯录类型
                openAdd:false,
            }
        },
        components:{
            HeadTitle,
            AddressList
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
        methods:{
            close(){
                this.openAdd=false
            },
            choose(arr){
                this.openAdd=false
           
                if(this.peopleType){
                    this.receivers_data = JSON.parse(JSON.stringify(arr))
                }else{
                    this.approvers_data = JSON.parse(JSON.stringify(arr))
                }
            },
            selectOpen(type){
                this.peopleType = type

                this.openAdd = true
            }
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

     .textNum{
            position absolute
            right 0;
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


    .fileUpload{

    }




    .approver-list{
        box-sizing border-box
        width 650px;
        padding 15px
        background-color #f5f5f5
        overflow hidden
        border-radius 4px;
    }

    .approver-li{
        display flex;
        float left
        line-height 20px;
        width 75px;
        height 100%
        text-align center
        margin-right 10px;

        img{
            display inline-block
            width 50px
            height 50px
            border-radius 50%; 
        }
    }

    .arrows{
      width 16px;
      margin-left 10px

    svg{
        margin-top:20px;
    }
  }

  .user-info{
      position relative

      svg{
          position absolute 
          right 0px
          top 0px
          cursor pointer
      }
  }

  .approver-add{
    cursor pointer
  }
    

</style>