<template>
    <div>
        <div class="title">
           <img src="./../../assets/06.png" />  工作通知
        </div>

        <div class="notice-list" style="padding-top:80px">
            <div class="notice-item" v-for="(item,index) in data" :key="index"
             v-if="item.messageType!='meetingnotice'&&item.messageType!='outsidesignnotice'&&item.messageType!='schedulenotice'">
                <div class="time">
                    <span>{{item.sendDate|timeFormat}}</span>
                </div>
                <div class="notice-content">
                    <div class="notice-left">
                        <img src="./../../assets/07.png"/>
                    </div>
                    <div class="notice-info" @click="show_details(item.list.applyId,item.type,item)">
                        <div class="notice-info-type">
                            <a v-if="item.messageType!='system'">审批</a> <span>{{item.message}}</span>
                        </div>
                        <div class="notice-info-title">
                            {{item.list.title}}
                        </div>
                        <div>
                            <div v-if="item.list.rebackReason" class="reback">
                                <span>退回理由 : </span>
                                <a>{{item.list.rebackReason}}</a>
                            </div>

                            <NoticeTemplate
                            :oaType="item.type"
                             :item="item.list"
                            >

                            </NoticeTemplate>
                        </div>
                        <div class="notice-status">
                            {{item.list.auditStatus}}
                        </div>
                        <div class="notice-info-detail" v-if="item.messageType!='system'">
                            查看详情

                            <svg class="icon icon-back" aria-hidden="false" >
                                <use xlink:href="#icon-right"></use>
                            </svg>
                        </div>
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

        <div>
            <Details
            :show='showDetails'
            :applyId = "applyId"
            :oaType="oaType"
            v-on:isShow = "showDetails=false"
            >
            </Details>
        </div>
    </div>
</template>

<script>
    import InfiniteLoading from 'vue-infinite-loading';
    import Details from './../../components/oa/details.vue'
    import NoticeTemplate from './../../components/oa/notice_template.vue'

    export default {
        data() {
            return {
                data:[],
                showDetails:false,
                applyId:null,
                oaType:0,
                pageNo:1,
            }
        },
        components:{
            Details,
            NoticeTemplate,
            InfiniteLoading
        },
        filters:{
            timeFormat : function(value) {
                let arr = ['一','二','三','四','五','六','日']
                let odate = value.split(" ")[0];
                let otime = new Date(odate);
                let time = new Date() - new Date(odate);
                time = parseInt( time/(24*60*60*1000))

                if(!time){
                    return value.slice(-8,-3)
                }else if(time == 1){
                    return '昨天 '+ value.slice(-8,-3)
                }else if(1<time<=7){
                    return  '星期'+arr[otime.getDay()]
                }else{ 
                    return value.slice(0,10)
                }
            },
        },
        created(){
            let that = this;
            // alert(this.Service.getCookie('auth_token'))
            this.axios.get('/company/message/list?pageNo=1&pageSize=10&state=1').then(res=>{
                that.data = that.dataFo(res.data.b.data)
            })
        },
        methods:{
            show_details(id,type,item){
                if(item.messageType=='system'){
                    return false;
                }
                this.applyId = id;
                this.oaType = type - 0 +1
                this.showDetails = true;
            },
            dataFo(data){
                let arr = []
                for(let i=0;i<data.length;i++){
                    let value = {},list={};
                    value = data[i]

                    for(let j=0;j<data[i].extend.length;j++){
                        list[data[i].extend[j].key] = data[i].extend[j].value
                    }
                    value.list = list;
                    arr.push(value)
                }
                return arr;
            },
            onInfinite(){
               let that = this;
                //供需
                this.axios.get('/company/message/list',{
                    params:{
                        pageNo:this.pageNo+1,
                        state:1,
                        pageSize:10,
                    }
                }).then(function(res){
                        setTimeout(() => {
                                if (res.data.b.data.length == 0) {
                                    that.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                                } else if (res.data.b.data) {
                                    let data = that.dataFo(res.data.b.data)
                                    that.data = that.data.concat(data)
                                    that.pageNo++;
                                    that.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
                                }
                        }, 200);

                    }).catch(function (error) {
                        console.log(error);
                    });
            },
        }
    }
</script>

<style lang="stylus" scoped>

    .title{
        position fixed;
        top:0;
        width:100%;
        height 55px;
        line-height 55px;
        border-bottom:1px solid #ccc;
        padding-left 30px;
        font-size 20px;
        background-color #fff;

        img{
            width:34px;
            height:34px;
            position relative
            top:10px;
        }
    }

    .notice-list{
        padding-top:30px;
        background-color #f5f5f5;
    }

    .notice-item{
        margin-bottom 20px;

        .time{
            text-align center
            margin-bottom 20px;
        }
    }

    .notice-content{
        display flex;
    }
    
    .notice-left{
        padding-left 30px;
        margin-right 10px;
    }


    .notice-info{
        border 1px solid #ccc;
        background-color #fff;
        width 570px;
        padding 15px 20px;
        padding-bottom 0;
        border-radius 6px;
        cursor pointer;

        &-type{
            margin-bottom 10px;

            span{
                color #f80;
            }
        }

        &-detail{
            border-top 1px solid #ccc;
            height 40px;
            line-height 40px;
            color #666
            margin 15px -20px 0;
            padding 0 12px 0 20px;

            &:hover{
                background-color #f5f5f5;
            }

            svg{
                float right;
                width 15px;
                height:15px;
                margin-top 12px;
            }
        }

        .notice-status{
            color #ff7a7a
            margin-top 10px;
        }

        &-title{
            margin-bottom 10px;
        }

        .reback{
            font-size 14px;
            margin-bottom 10px;

            span{
                color:#999;
            }

            a{
                color:#666;
            }
        }
    }

    .time>span{
        display inline-block
        text-align center;
        width 80px;
        height 28px;
        line-height 28px;
        background-color #ebebeb
        color #999;
        border-radius 4px;
    }

    .no-results{
        display:block;
        color:#999;
        margin-top 20px;
        margin-bottom 40px;
    }
</style>