<template>
    <div class="main">

        <div class="type_chose">
            <p class="chose_title">分类筛选</p>
            <div class="type_chose_option" v-if="!jurisdiction">
                <span>对象 : </span>
                <div class="option_list">
                    <span :class="journal==item.num?'active':''" @click="screenOut(0,item.num)" v-for="(item,index) in journal_check" :key="index">{{item.text}}</span>
                </div>
            </div>

            <div class="type_chose_option">
                <span>类型 : </span>
                <div class="option_list">
                    <span :class="type==item.num?'active':''" @click="screenOut(1,item.num)" v-for="(item,index) in type_check" :key="index">{{item.text}}</span>
                </div>
            </div>

            <div class="type_chose_option">
                <span>时间 : </span>
                <div class="option_list">
                    <span :class="time==item.num?'active':''" @click="screenOut(2,item.num)" v-for="(item,index) in time_check" :key="index">{{item.text}}</span>
                </div>
            </div>
            <div class="type_chose_option" v-if="jurisdiction">
                <span>用户 : </span>
                <div class="option_list">
                    <span @click="openAdd=true">{{select_title}}</span>
                </div>
            </div>
        </div>
        <div>
            <el-table
                :data="tableData"
                style="width: 100%"
                :header-cell-style="{background:'#f5f5f5',color:'#333'}"
                >
                    <el-table-column
                        prop="reportTitle"
                        label="标题"
                        align='center'
                        >
                        <template slot-scope="scope" >
                        <div style="text-align:center;">
                            <img class="headImg" :src='scope.row.photo'/>
                            <p v-html="scope.row.reportTitle"></p>
                        </div>
                    </template>

                    </el-table-column>
                    <el-table-column
                        prop="reportTime"
                        label="日期"
                        align='center'
                      >
                    </el-table-column>
                    <el-table-column
                        align='center'
                        prop="workSummary"
                        label="内容">
                    <template slot-scope="scope" >
                        <div class="workSummary">
                            <span>工作总结:</span>
                            <p v-html="scope.row.workSummary"></p>
                        </div>
                    </template>
                    </el-table-column>
                    <el-table-column
                        align='center'
                        prop="createTime"
                        label="提交时间">
                    </el-table-column>
                    <el-table-column
                        align='center'
                        label="操作">

                    <template slot-scope="scope" >
                        <div class="operation">
                            <span @click="seeDetails(scope.row.id,scope.row.photo)">查看</span>
                            <span v-if="scope.row.reportTitle.indexOf('我的')<0" @click="comments(scope.row)">批示</span>
                            <span v-else  @click="modificationDetails(scope.row)">修改</span>
                        </div>
                    </template>
                    </el-table-column>
                </el-table>
                <div class="page">
                    <el-pagination
                        :page-size="10"
                        :current-page.sync="pageNo"
                        @current-change="handleCurrentChange"
                        layout="total, prev, pager, next"
                        :total="dataTotal">
                    </el-pagination>
                </div>
        </div>

        <workReportDetails
            :photo='photo'
            :show='dialog'
            :id='detailsId'
            v-on:isShow='dialog=false'
        ></workReportDetails>

        <Comment
        :info="info"
        :show="commentShow"
        v-on:control="commentShow=false"
        >
        </Comment>

        <updateWork
            :show='modification'
            :id='detailsId'
            v-on:isShow='modification=false'
        ></updateWork>

        <workAdd
            v-if="jurisdiction"
            :show="openAdd"
            v-on:close="close"
            v-on:choose="choose"
            :types="'other'"
            :arr='addArr'
            :receivers="receivers_data"
        ></workAdd>

    </div>
</template>

<script>
    import workReportDetails from '../../components/work_report/work_report_details.vue'
    import updateWork from '../../components/work_report/update_work.vue'
    import workAdd from '../../components/work_report/work_add.vue'
    import Comment from '../../components/work_report/comment.vue'

    export default {
        data() {
            return {
                tableData:[],
                dataTotal:0,
                journal_check: [{text: "全部", num: 0},{text: "我接收的", num: 1}, {text: "我的", num: 2},], 
                type_check: [ {text: "全部", num: 0},{text: "日报", num: 1}, {text: "周报", num: 2}, {text: "月报", num: 3}],
                time_check: [{text: "全部", num: 0},{text: "一个月", num: 1}, {text: "三个月", num: 2}, {text: "半年", num: 3},],
                pageNo:1,
                type:0,
                time:0,
                journal:0,

                info:{},
                dialog:false,
                modification:false,
                commentShow:false,
                detailsId:'',

                openAdd:false,
                receivers_data:[],
                select_title:'全部用户',
                 type_data_arr:[{flag:'5'}],

                jurisdiction:false,
                addArr:[],
                photo:'',
            }
        },
        components:{
            workReportDetails,
            Comment,
            updateWork,
            workAdd
        },
        created(){

            this.axios.get('work/report/permit/if').then(res=>{
             this.jurisdiction = res.data.b;
                if(this.jurisdiction){
                 this.getLists()
                }else{
                 this.getList()
                }
            })

        },
        mounted(){
            
        },
        methods : {
            getList(type){
                this.Ajax.get('work/report/list',{
                    reportType:this.type,
                    receiveType: this.journal,
                    reportTime: this.time,
                    pageSize: 10,
                    pageNo: this.pageNo,
                }).then(res=>{
                    let arr = res.data.b.data

                    arr.forEach(item=>{
                        item.type = item.reportTitle.slice(-2,-1)
                    })
                    this.tableData = arr;

                    this.dataTotal = res.data.b.dataTotal
                })
            },
            getLists(type){
                this.Ajax.post('work/report/list1',{
                    pageSize: 10,
                    pageNo: this.pageNo,
                    reportReq:JSON.stringify({
                        reportType: this.type,
                        permitParams: this.type_data_arr,
                        reportTime: this.time,
                    }),
                }).then(res=>{
                    let arr = res.data.b.data

                    arr.forEach(item=>{
                        item.type = item.reportTitle.slice(-2,-1)
                    })
                    this.tableData = arr;

                    this.dataTotal = res.data.b.dataTotal
                })
            },
            screenOut(type,value){
                
                if(type==1){
                    this.type = value
                }else if(type==2){
                    this.time = value
                }else{
                    this.journal = value
                }

                this.pageNo = 1;
                // this.getList()
                if(this.jurisdiction){
                 this.getLists()
                }else{
                 this.getList()
                }

            },
            seeDetails(id,photo){
                this.detailsId = id;
                this.photo = photo;
                this.dialog= true;
            },
            modificationDetails(item){

                if(item.type=='日'){
                    this.$router.push({path:'/daynews',query:{reportTime:item.reportTime,id:item.id}})
                }else if(item.type=='周'){
                    this.$router.push({path:'/weeknews',query:{reportTime:item.reportTime,id:item.id}})
                }else if(item.type=='月'){
                    this.$router.push({path:'/monthnews',query:{reportTime:item.reportTime,id:item.id}})
                }
                // this.detailsId = id;
                // this.modification = true;
            },
            handleCurrentChange(value){
                this.pageNo = value
                if(this.jurisdiction){
                 this.getLists()
                }else{
                 this.getList()
                }
                // this.getList()
            },
            comments(obj){
                this.info =  obj
                this.commentShow = true;
            },
            choose(data){
                this.openAdd = false;
                this.addArr = arr;
                let companyIds = '',departIds = '',userIds="",arr=[]

                if(!data.length) return false

                if(data[data.length-1].mark_chose){
                    this.select_title = '我的'
                    arr[5]=''
                }
                
                if(data[data.length-2].mark_chose){
                    this.select_title = '所有用户'
                    arr[4] = ''

                }else{
                    for(let i=0;i<data.length;i++){
                        let item = data[i] 

                        if(item.mark_chose){
                            arr[item.type]=arr[item.type]?arr[item.type]:''
                            console.log(arr[item.type])
                            arr[item.type]+=item.id+'|'
                            continue;
                        }


                        if(!item.subOffice) continue;

                        for(let j=0;j<item.subOffice.length;j++){
                        let el = data[i].subOffice[j]
                            if(el.mark_chose){
                            arr[el.type]=arr[el.type]?arr[el.type]:''
                            arr[el.type]+=el.id+'|'
                            // departIds+=el.id+'|'
                            continue;
                            }

                            if(el.subOffice){
                                for(let s=0;s<el.subOffice.length;s++){

                                    if(el.subOffice[s].mark_chose){
                                        arr[el.subOffice[s].type]=arr[el.subOffice[s].type]?arr[el.subOffice[s].type]:''
                                        arr[el.subOffice[s].type]+=el.subOffice[s].id+'|'
                                    }

                                    if(!el.subOffice[s].staff) continue;
                                    for(let k=0;k<el.subOffice[s].staff.length;k++){
                                        let c = el.subOffice[s].staff[k]
                                        if(c.mark_chose){
                                            arr[3]=arr[3]?arr[3]:''
                                            arr[3]+=c.userId+'|'
                                            continue;
                                        } 
                                    }
                                }
                            }

                            if(!el.staff) continue;
                            
                            for(let k=0;k<el.staff.length;k++){
                                let c = el.staff[k]
                                if(c.mark_chose){
                                    arr[3]=arr[3]?arr[3]:''
                                    arr[3]+=c.userId+'|'
                                continue;
                                } 
                            }
                        }
                    }
                    this.select_title = '指定用户'
                }

                let dataArr = []

                console.log(arr)

                arr.forEach((item,index)=>{
                    if(item!=undefined){
                        dataArr.push({flag:index,ids:item})
                    }
                })
                this.type_data_arr = dataArr;

                this.getLists()
            }
        }
    }
</script>

<style lang="stylus" scoped>

.main{
    padding 30px;
}

.chose_title{
    font-size 14px;
    color:#666;
    margin-bottom:10px;
}
.type_chose{

    &_option{
        display flex;

        .option_list{
            margin-bottom 20px;

            span{
                display inline-block;
                color #666;
                width 80px;
                cursor pointer;
            }

            span:nth-child(2){
                width:100px;
            }

            .active{
                color:#0fc37c;
            }
        }


        >span{
            color #333;
            margin-right 20px;
        }
    }

}

.workSummary{
    text-align left;

    span{
        font-size 16px;
        color #333;
    }

    p{
        height:50px;
        width:190px;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 2;
        /* autoprefixer: off */
        -webkit-box-orient: vertical;
        /* autoprefixer: on */

        overflow: hidden;
    }
}

.operation{
    color #0fc37c;

    span{
        cursor pointer;
        margin 0 10px;
    }
}

/deep/ .el-table__row{
    height 120px;
}


.page{
    text-align right;
    margin-top 15px;
}

/deep/ .el-pager li,/deep/ .el-pagination button{
    border 1px solid #dedede;
    margin 0 5px;
    padding 0;
    height 30px;
    border-radius:4px;
}
/deep/ .el-pager .active{
    border-color:#2c82ea;
}


.headImg{
    width:50px;
    height:50px;
    border-radius:50%;
}

</style>