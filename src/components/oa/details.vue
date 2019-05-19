<template>
    <div class="main" @click.prevent="control" v-if="show">
        
        <div class="infor" @click.stop="">
            <div class="infor-title">
                    选择联系人
                <div class="close" @click.stop="control">
                    <svg  class="icon" aria-hidden="false">
                        <use xlink:href="#icon-x"></use>
                    </svg>
                </div>
            </div>

            <div class="infor-content">
                    <el-scrollbar class="default-scrollbar footer-scrollbar" wrap-class="default-scrollbar__wrap"  view-class="default-scrollbar__view" :native="false">
                        <div style="padding:0 30px;" class="infor-box">
                            <div class="user-info">
                                <img class="profileImg" :src="info.profileImg"/>
                                <div>
                                    {{info.username}}
                                    <p v-if="info.auditStatus=='0'">等待{{info.auditUserName?info.auditUserName:info.auditName}}的审批</p>
                                    <p v-else>{{info.auditStatus|stateName}}</p>
                                </div>
                            </div>

                            <div class="infor-text">
                                <DetailsText :type="oaType" :data="info||{}">

                                </DetailsText>

                            </div>

                            <div class="approve">
                                <div style="margin-bottom:15px;">
                                    <span class="info-title">审批人</span>
                                    <a>已添加 {{info.auditers?info.auditers.length:0}} 人</a>
                                </div>

                                <div class="approve-list">
                                    <div>
                                        <div class="approve-list-item">
                                            <div>
                                                <img :src="info.profileImg" class="profileImg"/>
                                            </div>
                                            <span style="margin-left:20px;">{{info.username}}</span>
                                            <span>发起申请</span>
                                            <span>{{info.applyTime}}</span>
                                        </div>
                                        <div class="approve-list-other">
                                            <svg class="icon icon-back" aria-hidden="false">
                                                <use xlink:href="#icon-jiantou1"></use>
                                            </svg>
                                        </div>
                                    </div>
                                    <div  v-for="(item,index) in info.auditers" :key="item.userId">
                                        <div class="approve-list-item">
                                            <div>
                                                <img :src="item.profileImg" class="profileImg"/>
                                            </div>
                                            <span style="margin-left:20px;">{{item.name}}</span>
                                            <span :class="item.status | statusClass">{{item.status | stateName}}</span>
                                            <span>{{item.auditTime}}</span>
                                        </div>
                                        <div class="approve-list-other">
                                            <svg class="icon icon-back" aria-hidden="false" v-if="index!=info.auditers.length-1">
                                                <use xlink:href="#icon-jiantou1"></use>
                                            </svg>
                                            <p>{{item.reason}}</p>
                                            <div v-if="item.accessory">
                                                <ul class="accessory">
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div>
                                        
                                    </div>

                                </div>
                            </div>

                            <div class="copy">
                                <div>
                                    <span class="info-title">抄送人</span>
                                    <a>已添加 {{info.receivers?info.receivers.length:0}} 人</a>
                                </div>
                                <div class="copy-list">
                                    <div class="copy-list-item" v-for="item in info.receivers" :key="item.userId">
                                        <img class="profileImg" :src="item.profileImg"/>
                                        <p class="omit">{{item.name}}</p>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </el-scrollbar>
            </div>

        </div>
    </div>
</template>

<script>
    import DetailsText from './details_text.vue'

    export default {
        data() {
            return {
                info:{},
                ajax:['',{url:'leave/apply',name:'leaveId'},{url:'letter',name:'letterId'},{url:'contract',name:'contractId'}, {url:'/outsign/task/infos',name:'outsideId'},
                {url:'trip',name:'tripId'}, {url:'stamp',name:'stampId'} ,{url:'reimburse',name:'reimburseId'},{url:'pay',name:'payApplyId'},{url:'dimission',name:'dimissionApplyId'},
                {url:'borrow',name:'borrowApplyId'},{url:'reception',name:'receptionApplyId'},{url:'absence',name:'absenceApplyId'}, {url:'car',name:'carApplyId'}, 
                {url:'employee',name:'employeeApplyId'}, {url:'project',name:'projectApplyId'}, {url:'regular',name:'regularApplyId'}, {url:'meal',name:'mealApplyId'},
                {url:'document',name:'documentApplyId'},{url:'overtime',name:'overTimeApplyId'},{url:'changeposition',name:'positionApplyId'},{url:'buy',name:'userBuyApplyId'},
                {url:'material',name:'materialReceiveApplyId'}]
            }
        },
        props:['show','data','oaType'],
        methods: {
            control(){
                this.$emit('isShow')
            },
            getDetails(){
                let that = this;
                let url = '/work/'+this.ajax[this.oaType].url+'/info'
                if(this.oaType==4){
                    url = this.ajax[this.oaType].url
                }
                 this.axios.get(url+'?'+this.ajax[this.oaType].name+'='+this.data.applyId+'&pushId=0').then(function(res){
                     console.log(res.data.b.data)
                     if(res.data.b.data){
                        that.info = res.data.b.data[0];
                     }else{
                         that.info = res.data.b;
                     }

                 })
            }
        },
        components:{
            DetailsText,
        },
      
        created(){
            
        },
        filters:{
            stateName: function(value){
                switch (value){
                case '0':
                    return "审批中";
                    break;
                case '1':
                    return "已同意";
                    break;
                case '2':
                    return "已拒绝";
                    break;
                case '3':
                    return "已转交";
                    break;
                case '4':
                    return "已退回";
                    break;
                }
            },
            statusClass:function(value){
                switch (value){
                case '0':
                    return "refause";
                    break;
                case '1':
                    return "consent";
                    break;
                case '2':
                    return "refause";
                    break;
                case '3':
                    return "careOf";
                    break;
                case '4':
                    return "careOf";
                    break;
                }
            },
        },
        watch:{
            show:function(){
                 if(this.show){
                    document.querySelector('#app').style.overflowY='hidden'
                    this.getDetails()
                }else{
                    document.querySelector('#app').style.overflowY='auto'
                } 
            }
        }
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
        height  700px;
        position absolute;
        top 0
        left 0
        right 0
        bottom 0
        z-index 99
        margin auto 
        background-color #fff;
        

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

        &-content{
            height 655px;

            .user-info{
                display flex;
                height 90px;

                >div{
                    padding-top 18px;
                }

                p{
                    color #ff7a7a
                    margin-top 5px;
                }
            }

            .infor-text{
                padding-bottom:20px;
            }

            .approve,.copy{

                .profileImg{
                        margin 0
                        top 0
                    }
            }

            .approve{
                padding-bottom 15px;

                &-list-item{
                    display flex;
                    align-items:center;

                    span:nth-child(2){
                        width 80px;
                        overflow: hidden;
                        text-overflow:ellipsis;
                        white-space: nowrap;

                    }

                    span:nth-child(3){
                        display inline-block
                        width 120px;
                    }
                }

                &-list-other{
                    position relative;
                    padding-left 72px;
                    min-height:20px;
                    line-height 20px;
                    margin 10px 0;
                    word-wrap:break-word;

                    svg{
                        position:absolute;
                        width:15px;
                        height:15px;
                        top:0;
                        left:20px;
                        bottom:0;
                        margin:auto !important;
                        transform rotate(90deg)
                    }
                }
            }

            .copy{
                
                &-list{
                    overflow hidden
                    margin-left 65px;
                }

                &-list-item{
                    width 80px;
                    height 80px;
                    text-align center
                    float left
                    margin-top 15px;

                }
            }

            .info-title{
                margin-right 25px;
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
    }

    .profileImg{
        height 50px;
        width 50px;
        border-radius 50%;
        position relative
        top 20px;
        margin-right 20px;
    }


// 状态颜色

.refause{
    color:#fd545c;
}

.consent{
    color:#0fc37c;
}

.careOf{
    color:#f80;
}
</style>