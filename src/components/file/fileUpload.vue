<template>
    <div>
        <div>
            <div class="btn_div">
                <span>{{title}}</span>

                <div class="btn upload">
                    <img src="../../assets/shangchuan.png"/> 上传
                    <input @change="change" type="file">
                </div>
                <!-- <div class="btn refresh" @click="refresh">
                    <img src="../../assets/tongbu.png"/> 同步
                </div> -->
            </div>
        </div>

         <el-dialog
            title="上传文件"
            :visible.sync="dialogVisible"
            width="70%"
            :before-close="handleClose"
            >

            <div class="file_info">
                <div class="file_info_name">
                    <img v-if="fileInfo.fileType=='0'"  :src="fileInfo.fileUrls" >
                    <img v-else  src="../../assets/wenjian.png" >
                    <span style="margin-left:10px;">{{fileInfo.fileNames}}</span>
                </div>
                <span>{{fileInfo.fileSizes |fileSize}}</span>
                <span>我的文件</span>
                <div class="percentage">
                    <span>{{fileInfo.percentage}}%</span>
                    <img v-if="fileInfo.percentage!=100" @click="cancel_upload" src="../../assets/shanchu.png"/>
                </div>
            </div>
            <div style="text-align:center;" v-if="showBtn">
                <el-button type="success" @click="finish">完成</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import * as qiniu from 'qiniu-js';
    export default {
        data() {
            return {
                fileInfo:{
                },
                dialogVisible:false,
                fileState:true,
                fileUploadObj:null,
                showBtn:false
                
            }
        },
        props:['title'],
        filters:{
            fileSize:function(value){
              value = value-0
                if(value<5500){
                    value = value/1024
                    return value.toFixed(2)+'KB';
                }
                value = value/1024/1024
                return value.toFixed(2)+'MB';
            }
        },
        methods:{
            isImg:function(str){
                //判断是否是图片 - strFilter必须是小写列举
                var strFilter=".jpeg|.gif|.jpg|.png|.bmp|.pic|"
                if(str.indexOf(".")>-1){
                    var p = str.lastIndexOf(".");
                    var strPostfix=str.substring(p,str.length) + '|';        
                    strPostfix = strPostfix.toLowerCase();
                    if(strFilter.indexOf(strPostfix)>-1){
                        return 0;
                    }
                }        
                return 2;   
            },
            refresh(){
                this.$emit('refresh')
            },
            finish(){
                this.dialogVisible = false;
            },
            uploadFile(params){
                this.Ajax.postForm('file/upload',params).then(res=>{
                    if(res.data.h.code==200){
                            this.$emit('refresh')
                    }
                })
            },
            handleClose(){
                this.fileState = false;
                this.fileUploadObj.unsubscribe()
                this.dialogVisible = false;
            },
            cancel_upload(){
                this.fileState = false;
                this.fileUploadObj.unsubscribe()
                this.dialogVisible = false;
            },
             change(evfile){
                let that = this;
                this.showBtn = false;
                let file = evfile.target.files[0] //Blob 对象，上传的文件
                let file_obj = {},size=0;


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

                file_obj.isImg = this.isImg(file.name)
                file_obj.status = false

                this.fileInfo = {
                    fileNames:file_obj.fileName,
                    fileSizes:file_obj.fileSize,
                    fileType:file_obj.isImg,
                    percentage:0,
                    fileUrls:'',
                    fileSource:1,
                }
  
                this.axios.get('/public/upload/token?suffix='+file.name.substring(file.name.lastIndexOf('.') + 1)).then(res=>{
                    
                    evfile.target.value = ''
                    this.fileState = true;
    
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

                    this.dialogVisible = true;
                     var observable = qiniu.upload(file, key, uptoken, putExtra, config);

                     let subscription= this.fileUploadObj =  observable.subscribe({
                        next: (result) => {
                        // 主要用来展示进度
                            that.fileInfo.percentage = parseInt(result.total.percent)
                            if(!this.fileState){
                               subscription.unsubscribe()
                            }
                            // if(parseInt(result.total.percent)>50){

                            // }

                        },
                        error: (errResult) => {
                        // 失败报错信息
                            // that.accessory[index].status = false 
                            // that.accessory.splice(index,1)
                            this.$message.error('文件上传失败');
                        },
                        complete: (result) => {
                        // 接收成功后返回的信息
                            this.fileInfo.fileUrls = 'https://qiniu.epipe.cn/'+result.key
                            this.uploadFile(this.fileInfo)
                            this.showBtn = true;
                        }
                        })

                })
        }   }
    }
</script>

<style lang="stylus" scoped>

    .btn_div{
        display flex;
        padding-left 40px;
        height 64px;
        line-height 64px;
        border-bottom 1px solid #d5d5d5

        span{
            font-size 18px;
            color #333;
            margin-right 30px;
        }
    }

    .btn{
        width  88px;
        height 36px;
        text-align center
        align-self: center;
        line-height 36px;
        color #fff;
        border-radius:4px;
        margin 0 10px;
        cursor pointer;

        img{
            position relative
            top 4px;
        }
    }

    .upload{
        position relative
        background-color #85B7FF;

        input{
            position absolute;
            width 100%;
            height 100%;
            top:0;
            left:0;
            opacity 0;
        }
    }

    .refresh{
        background-color #2ED380;
    }

    .file_info{
        display flex;
        height 70px;
        line-height 70px;
        margin 20px 0;

        >span,>div{
            flex 1;
            text-align center;
        }

        &_name{
            display flex;
            flex 4 !important;
            text-align left;

            img{
                width:44px;
                height:44px;
                align-self: center;
            }
        }
    }

    .percentage img{
            float: right;
            margin-top: 30%;
            cursor pointer
    }

/deep/ .el-dialog__body{
    padding 0 20px;
    padding-bottom 20px
}

/deep/ .el-dialog__header{
    border-bottom:1px solid #d5d5d5;
}
</style>