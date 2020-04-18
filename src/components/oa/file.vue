<template>
    <div>
        <el-form-item class="fileUpload" label="附件">
            <div style="display:flex;">
                <a class="file-btn" v-if="accessory.length<counts">上传附件
                    <input type="file" @change="change">
                </a>
                <span class="el-upload__tip">仅支持图片、文档( .doc/.docx/.ppt/.pptx/.txt/.jpg/.jpeg/.png/</br>.xlsx/.xls/.pdf/.zip/.rar)</span>
            </div>

            <div>
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
                            <el-button @click="lookFile(item.url,item.fileName)">查看</el-button>
                            <el-button @click="removeFile(index)">删除</el-button>
                        </div>
                    </li>
                </ul>
            </div>
        </el-form-item>
    </div>
</template>

<script>
    import * as qiniu from 'qiniu-js';
    export default {
        data() {
            return {
                counts:10,
            }
        },
        created(){
                this.counts=this.num?this.num-0:10;
        },
        props:['accessory','num'],
        methods:{
            change(evfile){
                let that = this;
                let file = evfile.target.files[0] //Blob 对象，上传的文件
                let file_obj = {},size=0;

                that.accessory.forEach(el=>{
                    el.fileSize = el.fileSize - 0
                    size+=el.fileSize
                })


                file_obj.fileName = file.name
                file_obj.fileSize = file.size
                if(size+file.size>500 * 1024 * 1024){
                    this.$message.error('上传的附件大小不能超过500M')
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
            isImg:function(str){
                //判断是否是图片 - strFilter必须是小写列举
                var strFilter=".jpeg|.gif|.jpg|.png|.bmp|.pic|"
                if(str.indexOf(".")>-1){
                    var p = str.lastIndexOf(".");
                    var strPostfix=str.substring(p,str.length) + '|';        
                    strPostfix = strPostfix.toLowerCase();
                    if(strFilter.indexOf(strPostfix)>-1){
                        return true;
                    }
                }        
                return false;   
            },
             removeFile(index){
                this.$emit('remove',index)
            },
            lookFile(url,name){
                this.Msg.openFile(url,name)
            },
            open(url){
                console.log(this.Msg)

                // this.Msg.openFile(url)
            }
        }
    }
</script>

<style lang="stylus" scoped>

 .file-btn{
      position:relative;
      display:inline-block;
      width 100px;
      height:35px;
      text-align:center;
      line-height 35px;
      border-radius 3px;
      background-color:#24b36b;
      color:#fff
      cursor pointer

      input{
          position absolute 
          width 100%;
          height 100%;
          opacity 0;
          top:0
          pointer
          left 0
          right 0
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
    width:650px;
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

/deep/ .el-form-item__content{
    // overflow hidden;
}


   /deep/ .el-upload__tip{
        margin-left 20px;
        font-size 14px;
        display block;
        line-height 20px;
        margin-top:0;
    }

    /deep/ .upload-demo{
        width 650px;
    }

     /deep/ .el-upload-list__item-name{
        height 40px;
        font-size 16px;
        line-height 40px;
    }


</style>