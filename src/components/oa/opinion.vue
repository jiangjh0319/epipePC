<template>
    <section v-show="show">

        <div class="infor" @click.stop="" >
            <div class="infor-title">
                    {{title[type-1]}}
                <div class="close" @click.stop.prevent="control">
                    <svg  class="icon" aria-hidden="false">
                        <use xlink:href="#icon-x"></use>
                    </svg>
                </div>
            </div>

            <div class="infor-content">
                    <el-scrollbar class="default-scrollbar footer-scrollbar" wrap-class="default-scrollbar__wrap"  view-class="default-scrollbar__view" :native="false">
                        <div style="margin-top:30px" v-if="type==3">
                            <el-radio v-model="radio" label="5">返回至上一审批人</el-radio>
                            <el-radio v-model="radio" label="8">返回至申请人</el-radio>
                        </div>

                        <div :class="type==3?'opinion-explain':'marginTop50 opinion-explain'">
                            <textarea v-model="desc" maxlength="500" :placeholder="placeholder[type-1]"></textarea>
                            <span>{{textNum}}/500</span>
                        </div>

                        <div class="file">
                            <p>附件</p>
                            <p class="file_btn">添加附件
                                <input type="file" @change="change">
                            </p>
                            <p>仅支持图片、文档( .doc/.docx/.ppt/.pptx/.txt/.jpg/.jpeg/.png/.xlsx/.xls/.pdf/.zip/.r</br>ar)</p>
                            <div class="">
                                <ul class="file-list" v-if="accessory.length">
                                    <li class="file-item" v-for="(item,index) in accessory" :key="index" @click="open(item.src)">
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
                                            <el-button @click="seeFile(item.url,item.fileName)">查看</el-button>
                                            <el-button @click="removeFile(index)">删除</el-button>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div>
                            <a class="btn" v-if="type==1" @click="ajax">确认同意</a>
                            <a class="btn" v-else-if="type==2" @click="ajax">确认拒绝</a>
                            <a class="btn" v-else-if="type==3"  @click="ajax">确认退回</a>
                            <a class="btn" v-else-if="type==4" @click="ajax">确认评论</a>
                            <a class="btn" v-else-if="type==5" @click="ajax">确认转交</a>
                        </div>
                    </el-scrollbar>
            </div>
        </div>
    </section>
</template>

<script>
    import * as qiniu from 'qiniu-js';
    export default {
        data() {
            return {
                title:['同意','拒绝','退回','评论','转交'],
                textNum:0,
                radio:'5',
                desc:'',
                placeholder:['请输入审批意见','请输入拒绝理由','请输入退回原因','请输入评论内容','请输入审批意见'],
                accessory:[],
                oaType:['',2,3,5,10,4]
            }
        },
        watch:{
            desc:function(value ){
                this.textNum = value.length
            },
            
        },
        props:['type','show','applyType','applyId','toPeople'],
        methods: {
            control(){
                this.$emit('isShow')
            },
            removeFile(index){
                this.accessory.splice(index,1)
            },
            ajax(){
                let that = this;
                let fileObj = that.Util.fileFo(that.accessory)
                
                let params = {
                        applyType:this.applyType,
                        type:this.oaType[this.type],
                        applyId:this.applyId,
                        reason:this.desc,
                        url:fileObj.urlStr,
                        fileSize:fileObj.fileSizeStr,
                        fileName:fileObj.fileNameStr,
                    }
                if(this.type==3) params.type=this.radio

                if(this.type==5){
                    params.auditerIds = this.toPeople.userId
                    params.auditCompanyIds = this.toPeople.companyId
                }

                that.axios({
                        method:"post",
                        url:"/work/audit",
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
                }).then((res)=>{ 
                        if(res.data.h.code==200){
                        that.$emit('accomplish')
                        that.$message({
                            message:'操作成功!',
                            type: 'success',
                        });
                            that.$emit('reload')
                        }else{
                            that.$message({
                                message:res.data.h.msg,
                                type: 'error'
                            })
                        }
                    })
            },
            seeFile(url,name){
                this.Msg.openFile(url,name)
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
                file_obj.isImg = this.Util.isImg(file.name)
                file_obj.status = false
                file_obj.percentage = 0
                let index = that.accessory.length

                that.accessory[index]=file_obj
                this.$set(this.accessory,index,file_obj)


                this.axios.get('/public/upload/token?suffix='+file.name.substring(file.name.lastIndexOf('.') + 1)).then(res=>{
                    evfile.target.value = ''

                    
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
        width 600px;
        height  490px;
        position absolute;
        top 0
        left 0
        right 0
        bottom 0
        z-index 99
        margin auto 
        background-color #fff;

        &-content{
            height 445px;
        }
        

        &-title{
            text-align center;
            height 45px;
            line-height 45px;
            font-size 20px
            border-bottom 1px solid #b6bcc6;
            background-color #dadde3;
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
                height 160px;
                position relative
                margin-top 30px;

                textarea{
                    box-sizing border-box;
                    width 100%;
                    height 160px;
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
                    bottom 10px;
                    right 10px;
                    color:#999;
                }
            }
        }
     }

     .btn{
         display block
         margin 25px auto 0;
         width 160px;
         height:36px;
         line-height 36px;
         text-align center
         color:#fff
         border-radius 4px;
         background-color #24b36b
         cursor pointer;
        margin-bottom:30px;
     }

    .file{
        color:#999;
        font-size 14px;
        white-space:nowrap;
        margin-top 20px;

        .file_btn{
            color #24b36b;
            width 60px;
            position relative
            margin 5px 0;
            text-decoration underline

            input{
                opacity 0
                width 100%;
                position absolute
                cursor pointer
                top 0
                left 0
            }
        }
    }

.file-item{
    display flex;
    justify-content:space-between; 
    background-color #f5f5f5;
    padding 15px;
    line-height 20px;
    margin 10px 0;

    span{
        color:#999;
    }

    img{
        width:40px;
        height:40px;
        margin-right:15px;
    }

    .item-content{
        display:flex;
        align-items:center;
    }
}

.file-info{
    max-width: 370px;
}

.file-list{
    border-top:1px solid #ccc;
    border-bottom:1px solid #ccc;
    margin-top:10px;
    width:100%;
}

.progress{
    width:165px;
    margin-left 30px;

    >>>.el-progress-bar__inner{
        background-color:#24b36b;
        border-radius 0%;
    }

    >>>.el-progress-bar__outer{
        background-color:#dedede;
        border-radius 0%;
    }
    
}

.infor .marginTop50{
    margin-top:50px
}

</style>