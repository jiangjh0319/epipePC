<template>
    <section v-show="show">

        <div class="infor" @click.stop="" >
            <div class="infor-title">
                  {{info.reportTitle}}
                <div class="close" @click.stop.prevent="control">
                    <svg  class="icon" aria-hidden="false">
                        <use xlink:href="#icon-x"></use>
                    </svg>
                </div>
            </div>

            <div class="infor-content">
                        <div style="margin-top:15px;">
                            <p style="margin-bottom:5px;">{{info.type}}报日期 : <span>{{info.reportTime}}</span> </p>
                            <p>提交时间 : <span>{{info.submitTime}}</span> </p>
                        </div>
                        <div class="opinion-explain">
                            <textarea v-model="desc" maxlength="100" placeholder="请输入审批意见"></textarea>
                            <span>{{textNum}}/100</span>
                        </div>

                        <div>
                            <a class="btn"  @click="ajax">确认</a>
                        </div>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        data() {
            return {
                textNum:0,
                radio:'5',
                desc:'',
            }
        },
        watch:{
            desc:function(value ){
                this.textNum = value.length
            },
            
        },
        props:['show','info',],
        methods: {
            control(){
                this.$emit('control')
            },
            removeFile(index){
                this.accessory.splice(index,1)
            },
            ajax(){

                this.Ajax.post('/work/report/comment',{
                    reportId:this.info.id,
                    comment:this.desc,
                }).then(res=>{
                    
                    this.$message({
                        message:'评论成功',
                        type: 'success'
                    });

                    this.$emit('comments',{
                        comment:this.desc,
                    })
                    this.desc = ''
                })
               
            },
            seeFile(url){
                this.Msg.openFile(url)
            },
          
            
        },
    }
</script>

<style lang="stylus" scoped>
.default-scrollbar {
  width: 100%;
  height: 100%;
}

section >>>.default-scrollbar__view{
    padding 0 30px;
}

    section{
        position: fixed;
        width:100%;
        height:100%;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: auto;
        background-color: rgba(0,0,0,0.2)
        z-index 100
        user-select none
    }

     .infor{
        width 500px;
        height  310px;
        position absolute;
        top 0
        left 0
        right 0
        bottom 0
        z-index 99
        margin auto 
        background-color #fff;

        &-content{
            padding:0 30px;
        }
        

        &-title{
            height 45px;
            line-height 45px;
            font-size 20px
            border-bottom 1px solid #b6bcc6;
            background-color #dadde3;
            padding-left:30px;
        }

        &-box{

            >div{
                margin-bottom 20px;
                border-bottom 1px solid #ccc;
                
                &:last-child{
                    border-bottom none;
                }
            }
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

        .opinion{

            &-explain{
                height 110px;
                position relative
                margin-top 15px;

                textarea{
                    box-sizing border-box;
                    width 100%;
                    height 120px;
                    resize none;
                    border 1px solid #d5d5d5
                    background-color #f5f5f5
                    outline none;
                    padding 10px;
                    padding-bottom:30px;
                    letter-spacing 1px;
                }

                span{
                    position absolute
                    bottom 0px;
                    right 10px;
                    color:#999;
                }
            }
        }
     }

     .btn{
         display block
         margin 0 auto ;
         width 160px;
         height:36px;
         line-height 36px;
         text-align center
         color:#fff
         border-radius 4px;
         background-color #24b36b
         cursor pointer;
         margin-top 25px;
     }



</style>