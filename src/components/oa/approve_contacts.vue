<template>
    <div>
        <el-form-item  label="审批人">
                    <span style="color:#24b36b;cursor: pointer;" @click="dialogVisible=true">审批指引</span>
                    <div class="approver-list">
                        <div class="approver-li" v-for="(item,index) in approvers_data" :key="index">
                            <div class="ap_item user-info">
                                <svg style="width:15px;height:15px;" class="icon" aria-hidden="false" @click="remove(0,index)">
                                    <use xlink:href="#icon-shanchu"></use>
                                </svg>
                                <img :src="item.profileImg"/>
                                <p class="omit">{{item.name}}</p>
                            </div>
                            <div class="arrows">
                                <svg style="width:15px;height:15px" class="icon" aria-hidden="false">
                                    <use xlink:href="#icon-jiantou1"></use>
                                </svg>
                            </div>
                        </div>

                        <div class="approver-li">
                            <div class="approver-add"  @click="selectOpen('app')">
                                <svg style="width:50px;height:50px;" class="icon" aria-hidden="false">
                                    <use xlink:href="#icon-tianjiarenyuan"></use>
                                </svg>
                                <div>添加</div>
                            </div>
                        </div>
                    </div>

                    <el-dialog
                    title="请参考以下流程添加审批人"
                    :visible.sync="dialogVisible"
                    width="400px"
                    >
                    <div class="guide_content">
                        <div style="margin-bottom:0.2rem;overflow:hidden">
                            <div class="guide_item" v-for="(item,index) in guideData[guideType]" :key="index">
                            <svg  class="icon" aria-hidden="false">
                                <use xlink:href="#icon-shenpiliuchengtouxiang"></use>
                            </svg>
                            <p>{{item}}</p>
                            <span v-if="index==guideData[1].length-1&item=='人事行政部门'">(抄送)</span>
                            <div class="guide_arrows">
                                <svg style="font-size: 0.12rem" class="icon" aria-hidden="false" v-if="index!=guideData[1].length-1">
                                    <use xlink:href="#icon-jiantou1"></use>
                                </svg>
                            </div>
                            </div>
                        </div>
                    </div>
                    <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="dialogVisible = false">知道了</el-button>
                    </span>
                    </el-dialog>

                </el-form-item>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dialogVisible:false,
                guideData:[
                ['发起人','部门负责人','人事行政部门','总经理','人事行政部门'],// 
                ['发起人','部门负责人','财务管理中心','总经理','人事行政部门'],
                ['发起人','部门负责人','财务管理中心','法务部','总经理','董事办'],
                ['发起人','相关领导1','相关领导2','相关领导3','公司领导','董事办'],
                ['发起人','部门负责人','总经理','人事行政部门'],
                ['发起人','部门负责人','财务管理中心','法务部','用印管理部门','总经理','董事办'],
                ['发起人','部门负责人','综合管理中心','财务管理中心','总经理','董事办'],//离职
                ['发起人','部门负责人','总经理','综合管理中心','董事办'], //接待
                ['发起人','部门负责人','综合管理中心','总经理','人事行政部门'], //补卡
                ['发起人','部门负责人','综合管理中心','总经理','董事办'],//用人 转正
                ['发起人','部门负责人','财务管理中心','总经理','董事办'],//付款 借款
                ['发起人','部门负责人','综合管理中心'],//用车
                ['发起人','部门负责人','研发中心负责人','总经理','董事办'],//项目立项
                ]
            }
        },
        props:['approvers_data','guideType'],
        methods:{
            remove(type,index){
                this.$emit('remove',type,index)
            },
            selectOpen(type){
                this.$emit('selectOpen',type)
            }
        }
    }
</script>

<style lang="stylus"  scoped>
    .approver-list{
        box-sizing border-box
        width 650px;
        padding 15px
        padding-top:0;
        background-color #f5f5f5
        overflow hidden
        border-radius 4px;
    }

    .approver-li{
        display flex;
        position relative;
        float left
        line-height 20px;
        width 75px;
        height 100%
        text-align center
        margin-right 10px;
        margin-top:15px;

        img{
            display inline-block
            width 50px
            height 50px
            border-radius 50%; 
        }
    }

    .arrows{
        position:absolute;
        right:-10px;
        width 16px;
        margin-left 10px

        svg{
            margin-top:20px;
        }
    }

  .user-info{
      position relative;
      width:100%;
      text-align:center;

      svg{
          position absolute 
          right 10px
          top -2px
          cursor pointer
          background-color:#fff;
          border-radius 50%;
      }
  }

  .approver-add{
    cursor pointer
    margin:0;
    width:100%;
    text-align:center;
  }


  .guide_content{
          background-color #fff;
          z-index 10
          padding-bottom 15px;

    }

    .guide_item{
      position relative;
      width 25%;
      text-align center;
      line-height:normal;

      svg{
          width 40px;
          height:40px;
      }

      span{
        font-size 14px;
        color #999;
      }

    }

    .guide_arrows{
          position absolute;
          right 0px;
          top 15px;
    }

    .guide_arrows svg{
        width:15px;
        height:15px;
    }

    .guide_item:nth-child(1),.guide_item:nth-child(2),.guide_item:nth-child(3),.guide_item:nth-child(4) {
        float left;
        padding-bottom 35px;
    }

    .guide_item:nth-child(4) .guide_arrows{
        transform rotate(90deg)
        position absolute;
        width 20px;
        height 12px;
        bottom -50px;
        left 0;
        right 0;
        margin auto ;
    }


    .guide_item:nth-child(5),.guide_item:nth-child(6),.guide_item:nth-child(7),.guide_item:nth-child(8){
        float right;

        .guide_arrows{
          position absolute;
          left 95px;
          top 10px;
          transform rotate(180deg)
        }
    }
</style>