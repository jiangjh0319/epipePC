<template>
    <div>
        <div class="nav">
            <div>
                标题
            </div>
            <div style="width:260px;">
                摘要
            </div>
            <div >
                发起时间
            </div>
            <div >
                完成时间
            </div>
            <div >
                状态
            </div>
        </div>
        <div v-for="(item,index) in data" :key="index" class="content">
            <div class="list-item">
                <div class="item" @click.stop="lookOver(item)">
                    <!-- 用户信息 -->
                    <div class="user_infor">
                        <img :src="item.profileImg" class="profileImg"/>
                        <p>{{item.title}}的{{oa[item.typecode]}}申请</p>
                    </div>
                    <!-- 摘要 -->
                    <div class="text_details">
                        <TextTemplate :oaType="item.typecode" :item="item"></TextTemplate>

                    </div>
                    <!-- 发起时间 -->
                    <div class="beginTime">
                        <span>{{item.applyTime.slice(0,-3)}}</span>
                    </div>
                    <!--完成时间  -->
                    <div class="endTime">
                        <span v-if="type!=1">{{item.completeTime.slice(0,-3)}}</span>
                    </div>
                    <!-- 审批状态 -->
                    <div class="status">
                        
                        <div v-if="type==1" style="color:#ff7a7a">
                            <span>等待你的审批</span>
                        </div>
                     
                        <div v-else-if="type==3||type==2" style="color:#ff7a7a">
                            <span>{{item.fianlStatus | status}}</span>
                        </div>
                        <div v-else-if="type==4" style="color:#24b36b">
                            <span>已同意</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div>
            <Details
            :show='showDetails'
            :data = 'choose'
            :applyId = "choose.applyId"
            :oaType="choose.typecode"
            v-on:isShow = "showDetails=false"
            v-on:accomplish = 'accomplish'
            >
            </Details>
        </div>
    </div>
</template>

<script>
    import TextTemplate from './textTemplate.vue'
    import Details from './details.vue'
    export default {
        data() {
            return {
                showDetails:false,
                choose:{},
                typecode:0,
                oa:['','请假','请示函','合同', '公出', '出差' ,'用印' ,'报销','付款','离职',
                '借款','接待','补卡', '用车', '人员需求','项目立项', '转正', '就餐',
                '行文呈批','加班','员工调岗','采购','物品领用']
            }
        },
        components:{
            TextTemplate,
            Details
        },
        filters:{
            status:function(value){
                switch (value){
                case '0':
                    return "等待审批";
                    break;
                case '1':
                    return "已同意";
                    break;
                case '2':
                    return "已拒绝";
                    break;
                case '3':
                    return "已撤销";
                    break;
                case '4':
                    return "已退回";
                    break;
                case '5':
                    return "已评论";
                    break;
                }
            }
        },
        props:['data','type'],
        methods: {
            lookOver(item){
                this.showDetails = true
                this.choose = item
            },
            accomplish(){
                this.$emit('accomplish')
            }
        },
    }
</script>

<style lang="stylus" scoped>

    .nav{
        text-align center;
        display flex
        font-size 16px;
        colo #333;
        height 56px;
        line-height 56px;

        >div{
            width 190px;
        }
    }

    .item{
        display flex;
        border 1px solid #ccc;
        margin-bottom 10px;
        border-radius 4px;
        padding 24px 0;
        width 1020px;
        align-items:center;
        cursor pointer
        font-size 14px;
        
        &:hover{
            background-color #f5f5f5
        }
    }

    .user_infor,.beginTime,.endTime,.status{
        width 190px;
        text-align center
    }

    .user_infor p{
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }

    .text_details{
        width 260px;
    }

    .beginTime,.endTime{
        color #666;
    }

    .profileImg{
        height 50px;
        width 50px;
        border-radius 50%;
    }


</style>