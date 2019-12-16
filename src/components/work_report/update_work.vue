<template>
    <div class="main" v-show="show">
        
        <div class="infor">
                <div class="infor-title">
                                <img  class="profileImg" :src="info.urls"/>{{info.reportTitle}}
                    <div class="close" @click.stop="control">
                        <svg  class="icon" aria-hidden="false">
                            <use xlink:href="#icon-x"></use>
                        </svg>
                    </div>
                </div>
                <div class="infor-content">
                    <el-scrollbar class="default-scrollbar footer-scrollbar" wrap-class="default-scrollbar__wrap"  view-class="default-scrollbar__view" :native="false">

                    <div class="border_bottom">
                        <p style="margin-bottom:10px;">周报日期 : <span>{{info.reportTime}}</span> </p>
                        <p>提交时间 : <span>{{info.submitTime}}</span> </p>
                    </div>
                    
                     <el-form ref="form" :rules="rules" :model="form" label-width="140px">
                        <el-form-item class="textareaBox" label="时间" >
                            <TimeTab time_type="week" :reportTime='reportTime' font_color="#609ef7" v-on:data_time="day_data_time"></TimeTab>
                        </el-form-item>
                        <el-form-item class="textareaBox" label="本周工作总结" prop="summary">
                                <el-input type="textarea" :rows="6" class="textarea" v-model="form.summary" maxlength="1000" placeholder="请输入本周工作总结">
                                </el-input>
                                <span class="textNum">{{summaryCount}}/1000</span>
                        </el-form-item>
                        <el-form-item class="textareaBox" label="下周工作计划" prop="plan">
                                <el-input type="textarea" :rows="6" class="textarea" v-model="form.plan" maxlength="1000" placeholder="请输入下周工作计划">
                                </el-input>
                                <span class="textNum">{{planCount}}/1000</span>
                        </el-form-item>
                        <el-form-item class="textareaBox" label="备注" prop="remark">

                                <el-input  :rows="3" class="textarea"  type="textarea" v-model="form.remark" maxlength="40" placeholder="请输入备注">
                                </el-input>
                                <span class="textNum">{{remarkCount}}/40</span>
                        </el-form-item>
                        <File :accessory="accessory"
                            v-on:remove="removeFile"
                        >
                        </File>

                        <Copy
                            :receivers_data='receivers_data'
                            v-on:selectOpen='selectOpen'
                            v-on:remove='remove'
                        >
                        </Copy>

                    </el-form>
                    </el-scrollbar>

                </div>
        </div>

    </div>
</template>

<script>
    import File from './../oa/file.vue'
    import Copy from './../oa/copy_contacts.vue'
    import AddressList from './../common/addressList.vue'
    import Comment from './comment.vue'
    export default {
        data() {
            return {
                info:{},
                planCount:0,
                summaryCount:0,
                remarkCount:0,
                accessory:[],
                openAdd:false,
                peopleType:'',
                receivers_data:[],
                reportTime:'',
                reportTimeStr:'',
                 form:{
                    summary : '',
                    plan : '',
                    remark : ''
                },
                rules:{
                    summary:[
                        { required: true, message: '请输入下周工作总结', trigger: 'blur' },
                        { required: true, message: '请输入下周工作总结', trigger: 'change' },
                    ],
                    plan:[
                        { required: true, message: '请输入本月工作计划', trigger: 'blur' },
                        { required: true, message: '请输入本月工作计划', trigger: 'change' },
                    ],

                }
            }
        },   
        props:['show','id'],
        components:{
            Comment,
        },
        watch:{
            show(){
                 if(this.show){
                    document.querySelector('#app').style.overflowY='hidden'
                    this.getInfo()
                }else{
                    document.querySelector('#app').style.overflowY='auto'
                } 
            }
        },
        created(){
            // this.getInfo()
        },
        methods:{
            getInfo(){
                this.Ajax.get('/work/report/detail',{id:this.id}).then(res=>{
                    this.info = res.data.b;
                })
            },
            control(){
                this.loading=true
                this.$emit('isShow')
            },
        },

    }
</script>

<style lang="stylus" scoped>
.default-scrollbar {
  width: 100%;
  height: 100%;
}
.el-scrollbar__wrap.default-scrollbar__wrap {
  overflow-x: hidden;
}
.el-scrollbar__view.default-scrollbar__view {}
.el-scrollbar__view.p20-scrollbar__view {
  padding: 20px;
  box-sizing: border-box;
}

.main>>> .el-scrollbar__view{
    padding-right:30px;
}

.main>>> .el-scrollbar__thumb{
    background-color #24b36b
}

.main>>> .el-scrollbar__wrap{
    overflow-x hidden;
}

.main{
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: auto;
        background-color: rgba(0,0,0,0.2)
        z-index 9
        user-select none
    }

.infor{
        width 760px;
        height  520px;
        position absolute;
        top 0
        left 0
        right 0
        bottom 0
        z-index 99
        margin auto 
        padding-bottom: 80px;

    .info-title{
        margin-right 25px;
    }

    &-content{
        height 475px;
        background-color #fff;
        padding-left 30px;
        
    }


    .close{
        float right;
        margin-top 16px;
        margin-right 16px;
        cursor pointer

        svg{
            display block
            height 14px;
            width 14px;
        }
    }

    &-title{
            height 45px;
            line-height 45px;
            font-size 20px
            border-bottom 1px solid #b6bcc6;
            background-color #dadde3;
            padding-left 30px;
            
            img{
                width:30px;
                height:30px;
                float left
                margin-top 8px;
                margin-right:10px;
            }
    }

    .text_title{
        color #666;
        margin-bottom 10px;
    }

    .comment_list >div{
        display flex;

        p{
            color:#666;
            margin-top 5px;
        }
    }
    .comment_open{
        margin-top 10px;
        line-height 28px;

        svg{
            width :24px;
            height :24px;
        }
    }

    article{
        line-height 30px;
    }
}

.file{
    padding-bottom:20px;

    &-list{

        >div{
            display:flex;
            background-color:#f5f5f5;
            margin-bottom 10px;
            padding:15px;
            cursor pointer
        }

        span{
            color:#999;
        }
    }

    img{
        width:40px;
        height:40px;
        margin-right:15px;
    }

    a{
        display inline-block;
        width:70px;
        height:30px;
        border:1px solid #ccc;
        text-align:center
        line-height:30px;
        border-radius:3px;
        color:#333;
        margin-top: 5px;

        &:hover{
            background-color:#f1f0f0;
        }
    }
}

.border_bottom{
    border-bottom 1px solid #ccc;
    padding 20px 0;
}

.profileImg{
        height 50px;
        width 50px;
        border-radius 50%;
        position relative
        margin-right 20px;
    }

.copy{
                
    &-list{
        overflow hidden
    }

    &-list-item{
        width 80px;
        height 80px;
        text-align center
        float left
        margin-top 15px;
    }

     .profileImg{
        margin 0
        top 0
    }
}

</style>