<template>
    <div class="main" v-show="show">
        
        <div class="infor">
                <div class="infor-title">
                                <img  class="profileImg" :src="photo"/>{{info.reportTitle}}
                    <div class="close" @click.stop="control">
                        <svg  class="icon" aria-hidden="false">
                            <use xlink:href="#icon-x"></use>
                        </svg>
                    </div>
                </div>
                <div class="infor-content">
                    <el-scrollbar class="default-scrollbar footer-scrollbar" wrap-class="default-scrollbar__wrap"  view-class="default-scrollbar__view" :native="false">

                    <div class="border_bottom">
                        <p style="margin-bottom:10px;">{{info.type}}报日期 : <span>{{info.reportTime}}</span> </p>
                        <p>提交时间 : <span>{{info.submitTime}}</span> </p>
                    </div>
                    <div class="border_bottom">
                        <p class="text_title">本{{info.type}}工作总结</p>
                        <article v-html="info.workSummary">
                        </article>
                    </div>
                    <div class="border_bottom" v-if="info.nextPlan">
                        <p class="text_title">下{{info.type}}工作计划</p>
                        <article v-html="info.nextPlan">
                        </article>
                    </div>
                    <div class="border_bottom">
                        <p class="text_title">备注</p>
                        <article v-html="info.remarks">
                        </article>
                    </div>
                    <div class="file" v-if="accessory&&accessory.length">
                        <div style="margin-bottom:15px;">
                            <span class="info-title">附件</span>
                            
                        </div>
                        <div class="file-list">
                            <div v-for="(item,index) in accessory" :key="index">
                                <div>
                                    <img src="./../../assets/wenjian.png" v-if="!item.isImg"/>
                                    <img :src="item.url" v-else/>
                                    </div>
                                <div style="flex:1">
                                    <p>{{item.fileName}}</p>
                                    <span>{{item.fileSize |fileSize}}</span>
                                </div>
                                <div>
                                    <a @click="openFile(item.url,item.name)">查看</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="copy border_bottom">
                        <div>
                            <span class="info-title">抄送人</span>
                        </div>
                        <div class="copy-list">
                            <div class="copy-list-item" v-for="item in info.receiverData" :key="item.userId">
                                <img class="profileImg" :src="item.profileImg"/>
                                <p class="omit">{{item.name}}</p>

                            </div>
                        </div>
                    </div>
                    <div class="border_bottom">
                        <p class="text_title">批示</p>
                        <div class="comment_list">
                            <div style="margin-bottom:10px;" v-for="(item,index) in info.comments" :key="index">
                                <img :src="item.userPhoto" class="profileImg">
                                <div>
                                    <span>{{item.userName}} <a style="margin-left:10px;font-size:14px;">{{item.commentDate}}</a></span>
                                    <p>{{item.comment}}</p>
                                </div>
                            </div>
                        </div>
                        <div class="comment_open" @click="commentShow=true">
                            <svg class="icon" aria-hidden="false">
                                <use xlink:href="#icon-pishi"></use>
                            </svg>
                            批示 <span style="color:#999;font-size:14px;margin-left:10px;">请输入你的审批意见</span>
                            </div>
                    </div>
                    </el-scrollbar>

                </div>
        </div>

        <Comment
        :info="info"
        :show="commentShow"
        v-on:control="commentShow=false"
        v-on:comments='comments'
        >
        </Comment>

    </div>
</template>

<script>
    import Comment from './comment.vue'
    export default {
        data() {
            return {
                info:{},
                accessory:[],
                commentShow:false,
            }
        },   
        props:['show','id','photo'],
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
                    this.info.type = this.info.reportTitle.slice(-2,-1)
                    this.accessory = this.accessoryFors(res.data.b)
                })
            },
            control(){
                this.loading=true
                this.$emit('isShow')
            },
            comments(item){
                this.commentShow=false
                // this.info.comments.push(item)
                this.getInfo()
            },
            accessoryFors:function(datas){
                if(!datas||datas.urls==null||datas.urls=='') return []
               let urlArr = datas.urls.split('|')
               let fileSizeArr = datas.fileSizes.split('|')
               let fileNameArr = datas.fileNames.split('|')
               let arrs = [];
                for(let i=0;i<urlArr.length;i++){
                    let bool = this.Util.isImg(urlArr[i])
                    arrs.push({
                        url:urlArr[i],
                        fileSize:fileSizeArr[i],
                        fileName:fileNameArr[i],
                        isImg: bool,
                        status:true,
                    })
                }
                return arrs
            },
            openFile(url,name){
                this.Msg.openFile(url,name)
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
        cursor:pointer;

        svg{
            width :24px;
            height :24px;
            position:relative;
            top:5px;
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