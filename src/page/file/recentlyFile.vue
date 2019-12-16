<template>
    <div>
        <div>
            <FileUploadDiv
            v-on:refresh="refresh"
            title="最近文件"
            ></FileUploadDiv>
        </div>
        <div v-loading="loading"
            element-loading-background="rgba(255, 255, 255, 1)"
        >

        <div class="no_file" v-if="show">
            <img src="../../assets/no_file.png"/>
            <p>无最近文件</p>
        </div>
        <div v-else>

            <div class="operating_button">
                <a @click="upload_file">下载</a>
                <a @click="del_file">删除</a>
            </div>
            <div class="list">
                <div class="list_title">
                    <span>名称</span>
                    <span>更新时间 <img src="../../assets/left-arrow.png"/></span>
                    <span>大小</span>
                </div>
                <div class="list_item">
                    <div class="list_item_file_list" v-for="(item,index) in list" :key="index">
                        <p class="file_list_date">{{item.uploadTime|timeFormat}}</p>
                        <div class="file_list_info" v-for="el in item.dataList" :key="el.id">
                            <div>
                                <div>
                                    <el-checkbox @change="chose(el)" size="medium" v-model="el.flag"></el-checkbox>
                                </div>
                                <div class="file_img">
                                    <img v-if="el.fileType=='0'" :src="el.fileUrls"/>
                                    <img v-else src="../../assets/wenjian.png"/>
                                </div>
                                <div class="file_name">
                                    <div class="div_name" v-if="!el.isredact">
                                        {{el.fileNames}}
                                    </div>
                                    <div class="input_name" v-else>
                                        <el-input  v-model="el.oldName" placeholder="请输入文件名"></el-input>{{el.postfix}}
                                    </div>
                                </div>
                                <div>
                                    <div class="file_bianji"  v-if="!el.isredact">
                                        <img @click="name_redact(el)"  src="../../assets/bianji.png"/>
                                    </div>
                                    <div v-else>
                                        <img @click="confirm_rechristen(el)" src="../../assets/dui.png"/>
                                        <img @click="cancel_rechristen(el)" src="../../assets/del.png"/>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {{el.uploadTime.slice(0,-3)}}
                            </div>
                            <div>
                                {{el.fileSizes|fileSize}}
                            </div>
                        </div>
                    </div>

                    <InfiniteLoading spinner="bubbles" :on-infinite="onInfinite" ref="infiniteLoading">
                        <span slot="no-more" class="no-more">
                            暂无更多加载
                            </span>
                            <span slot="no-results" class="no-results">
                            暂无结果
                        </span>
                    </InfiniteLoading>

                </div>
            </div>
            <div></div>
        </div>

    </div>
        <el-dialog
            title="删除文件"
            :visible.sync="dialogVisible"
            width="70%"
            >
            <span>删除 <a style="color:#24b36b">{{delText}}</a> 文件吗？</span>
            <span slot="footer" class="dialog-footer">
                <el-button @click="cancel_del">取 消</el-button>
                <el-button type="primary" @click="confirm_del">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import InfiniteLoading from 'vue-infinite-loading';
    import FileUploadDiv from './../../components/file/fileUpload.vue'

    export default {
        data() {
            return {
                show:true,
                a:true,
                list:[],
                dialogVisible:false,
                delId:'',
                delText:'',
                pageNo:1,
                loading:true,

            }
        },
        created(){
            this.getList()
        },
         filters:{
            fileSize:function(value){
              value = value-0
                if(value<5500){
                    value = value/1024
                    return value.toFixed(2)+'KB';
                }
                value = value/1024/1024
                return value.toFixed(2)+'MB';
            },
            timeFormat : function(value) {
                let arr = ['一','二','三','四','五','六','日']
                let odate = value
                let otime = new Date(odate);
                let time = new Date() - new Date(odate);
                time = parseInt( time/(24*60*60*1000))

                if(!time){
                    return '今天'
                }else if(time == 1){
                    return '昨天'
                }else if(1<time<=7){
                    return  '星期'+arr[otime.getDay()]
                }else{ 
                    return value
                }
            },
        },
        components:{
            FileUploadDiv,
            InfiniteLoading
        },
        methods: {
            
            getList(){
                this.Ajax.get('/file/threeList',{
                }).then(res=>{
                    let arr = res.data.b.data;
                    arr.forEach(item=>{
                        item.dataList.forEach(el=>{
                            el.flag = false
                            el.isredact = false
                            el.oldName =  el.fileNames.substr(0,el.fileNames.lastIndexOf('.'))
                            el.postfix = el.fileNames.substr(el.fileNames.lastIndexOf("."))
                        })
                    })
                    if(arr.length>0){
                        this.show = false;
                    }
                    this.list = arr;

                    setTimeout(()=>{
                        this.loading = false;
                    },500)
                })
            },
            refresh(){
                this.getList();
            },
            onInfinite(){
                 this.Ajax.get('/file/threeList',{
                        pageNo:this.pageNo+1,
                }).then((res)=>{
                    let that = this;
                        setTimeout(() => {
                                if (res.data.b.data.length == 0) {
                                    console.log()
                                    that.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                                } else if (res.data.b.data) {
                                    let arr = res.data.b.data;
                                    arr.forEach(item=>{
                                        item.dataList.forEach(el=>{
                                            el.flag = false
                                            el.isredact = false
                                            el.oldName =  el.fileNames.substr(0,el.fileNames.lastIndexOf('.'))
                                            el.postfix = el.fileNames.substr(el.fileNames.lastIndexOf("."))
                                        })
                                    })

                                    that.list = that.list.concat(arr)
                                    that.pageNo++;
                                    that.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
                                }
                        }, 200);

                    }).catch(function (error) {
                        console.log(error);
                    });
            },
            chose(item){
                if(!item.flag){
                    item.isredact = false;
                }
            },
            del_file(){
                let strId='',strName=''
                this.list.forEach(item=>{
                    item.dataList.forEach(el=>{
                        if(el.flag){ 
                            strId+=el.id+'|'
                            strName+=el.fileNames+','
                        }
                    })
                })
                this.delId = strId
                this.delText = strName.slice(0,-1)
                if(strId==''){
                     this.$message({
                                message:'请选择你要删除的文件',
                                type: 'error',
                        })
                }else{
                    this.dialogVisible = true;
                }
            },
            cancel_del(){
                this.init();
                this.dialogVisible =false;
            },
            init(){ //初始化
                this.list.forEach(item=>{
                    item.dataList.forEach(el=>{
                        el.flag = false;
                    })
                })
            },
            confirm_del(){ //确定删除
                this.Ajax.get('/file/delete?id='+this.delId).then(res=>{
                    if(res.data.h.code==200){
                        this.dialogVisible =false;
                        this.$message({
                                message: '删除成功!',
                                type: 'success',
                        })
                        this.pageNo=1;
                        this.getList();
                    }else{
                        this.$message({
                                message:res.data.h.msg,
                                type: 'error',
                        })
                    }
                })
            },
            upload_file(){
                let strId='',els='',flag=false;
                this.list.forEach(item=>{
                    item.dataList.forEach(el=>{

                        if(el.flag){ 
                            strId+=el.id+'|'
                            if(!flag){
                                els=el
                                flag = true;
                            }
                        }
                    })
                })

                if(strId.slice(0,-1).indexOf('|')>0){
                    this.$message({
                                message:'请单个下载文件',
                                type: 'error',
                        })
                }else if(strId==''){
                    this.$message({
                                message:'请选择要下载的文件',
                                type: 'error',
                        })
                }else{
                    this.Msg.openFile(els.fileUrls,els.fileNames)
                }

            },
            name_redact(item){//重命名
            if(item.oldName==''){
                this.$message({
                                message:'新文件名不能为空',
                                type: 'error',
                        })

                        return false;
            }
                this.list.forEach(item=>{
                    item.dataList.forEach(el=>{
                        el.isredact = false;
                        el.flag = false;
                    })
                })
                item.flag =  true;
                item.isredact = true;
            },
            confirm_rechristen(item){//确定重命名
                this.Ajax.postForm('/file/rename',{
                    id:item.id,
                    newFileName:item.oldName+item.postfix,
                }).then(res=>{
                    if(res.data.h.code==200){
                        item.flag = false;
                        item.isredact = false;
                        item.fileNames = item.oldName+item.postfix
                        this.$message({
                                message: '重命名成功!',
                                type: 'success',
                        })
                    }else{
                        this.$message({
                                message:res.data.h.msg,
                                type: 'error',
                        })
                    }
                })

            },
            cancel_rechristen(item){//取消重命名
                item.oldName = item.fileNames.substr(0,item.fileNames.lastIndexOf('.'))
                item.isredact = false;
                item.flag = false;
            },
        },
    }
</script>

<style lang="stylus" scoped>
.no_file{
    text-align center;
    padding-top:15%;
    height:600px;

    p{
        font-size 24px;
        color #666;
    }
}

.operating_button{
    text-align right;
    padding 20px 0;
    padding-right 40px;


    >a{
        display inline-block
        width:96px;
        height:44px;
        line-height 44px;
        border:2px solid rgba(213,213,213,1);
        border-radius:4px;
        text-align center;
        font-size 18px;
        margin-left 10px;

        &:hover{
            border-color #33AA70;
            color #24B36B;
            cursor pointer;
        }
    }
}

.list{

    &_title{
        display flex;
        line-height 40px;
        font-size 18px;
        color #999;
        border-top 1px solid #D5D5D5;
        border-bottom 1px solid #D5D5D5;
        padding 0 40px;


        img{
            position relative
            top 3px;
        }

        span:first-child{
            text-indent 150px;
            flex 3;
        }

        span:nth-child(2){
            flex 1
        }

        span:last-child{
            flex 0.5
        }
    }


    &_item{
        padding 0 40px;


        &_file_list{


            .file_list_date{
                font-size 22px;
                margin-top 20px;
            }

            .file_list_info{
                line-height 75px;
                display flex;
                border-bottom 1px solid #ebebeb;

                >div:first-child{
                    flex 3;
                    display flex;   
                    text-align center;
                    font-size 16px;

                }

                >div:nth-child(2){
                    font-size 14px;
                    color #666;
                    flex 1
                }

                >div:last-child{
                    font-size 14px;
                    color #666;
                    flex 0.5
                }

                .file_name{
                    margin-right 10px;

                    .div_name{
                        max-width:320px;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }

                    .input_name{
                        padding-right:30px;
                    }

                }

                .file_img{
                    margin 0 20px;

                    img{
                        width:44px;
                        height:44px;
                        position relative
                        top:16px;
                    }
                }
                .file_bianji{
                    display none;
                    cursor pointer;

                    >img{
                        position relative
                        top 8px;
                    }
                }

                &:hover{
                    background-color:#fdfdfd;

                    .file_bianji{
                        display block;
                    }
                }
            }
        }
    }
}

/deep/ .el-checkbox__input .el-checkbox__inner{
    width 24px;
    height 24px;
    border-width 2px;

    &::after{
        height 12px;
        left 7px;
        width 4px;
        border-width:2px;
    }

    &:hover{
        border-color: #24B36B;
    }
}

/deep/ .el-checkbox__input.is-checked .el-checkbox__inner{
    background-color: #24B36B;
    border-color: #24B36B;
}

.no-results,.no-more{
    line-height 80px;
    font-size 18px;
    color:#666;
}

</style>