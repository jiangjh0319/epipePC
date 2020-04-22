<template>
    <div>
        <el-form-item  label="审批人">
                    <span style="color:#24b36b;cursor: pointer;" @click="dialogVisible=true">审批指引</span>
                    <div class="approver-list">
                         <div class="app_list_item" v-for="(item,index) in approver_list" :key="index">
                            <i></i>
                            <div class="approver_info">
                                <div class="approver_info_type">
                                    <p>{{item.approvalUserType==1?item.quartersName:'审批人'}}</p>
                                    <span>{{item | info}}</span>
                                </div>
                                <div class="people_list">
                                    <div class="people_list_item" v-if="item.isSelect">
                                        <div class="select_text" >
                                            <el-button @click="go_select(item.approvealList,item.quartersName,index,item.index)">选择人员</el-button>
                                        </div>
                                    </div>
                                    <div   v-for="(child,num) in item.auditers" @click="go_check(item,index)" :key="child.id" class="people_list_item">
                                        <div class="people_list_user">
                                            <svg  class="icon" aria-hidden="false" v-if="item.approvalUserType==3" @click="del(index,num)">
                                                <use xlink:href="#icon-shanchu"></use>
                                            </svg>
                                            <img v-if="child.profileImg" :src="child.profileImg"/>
                                            <img v-else src="../../assets/head.png"/>
                                            <span class="omit" v-if="child.name">{{child.name}}</span>
                                            <span class="omit" v-else>主管为空</span>
                                            
                                        </div>
                                        <img v-if="item.linkType==2" src="../../assets/lefts.png"/>
                                        <img v-else-if="item.linkType==3" src="../../assets/add.png"/>
                                        <img v-else-if="item.linkType==4" src="../../assets/xie.png"/>
                                    </div>
                                    <div class="no_people" v-if="item.approvalUserType!=3&&!item.auditers.length&&!item.isSelect">
                                        <p v-if="item.approvalUserType==1">
                                            {{item.quartersName}}
                                        </p>
                                        <p v-else>
                                            主管
                                        </p>
                                        <span v-if="item.approvalUserScope==2">未找到审批人将自动通过</span>
                                        <span v-else>未找到审批人将转交管理员</span>
                                    </div>
                                    <div v-if="item.approvalUserType==3&&((item.auditers.length<9&&item.remarks==1)||(item.auditers.length<1&&item.remarks==0))" @click="add_people(index)">
                                    <!-- <div v-if="item.approvalUserType==3&&item.auditers.length<9" @click="add_people(index)"> -->
                                        <div class="approver_info_people_item">
                                            <img src="../../assets/add_people.png"/>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <el-dialog
                    title="请参考以下流程添加审批人"
                    :visible.sync="dialogVisible"
                    width="400px"
                    >
                    <div class="guide_content">
                        <div style="margin-bottom:2px;overflow:hidden">
                            <div class="guide_item" v-for="(item,index) in guideData[hintType]" :key="index">
                            <svg  class="icon" aria-hidden="false">
                                <use xlink:href="#icon-shenpiliuchengtouxiang"></use>
                            </svg>
                            <p>{{item}}</p>
                            <span v-if="index==guideData[1].length-1&item=='人事行政部门'">(抄送)</span>
                            <div class="guide_arrows">
                                <svg style="font-size: 12px" class="icon" aria-hidden="false" v-if="index!=guideData[1].length-1">
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

                    <el-dialog
                    :title="select_title"
                    :visible.sync="selectDialog"
                    width="400px"
                    >
                    <div class="list_content">
                        <div v-for="(li,index) in select_data" :key="li.id" @click="affirm_select(li,index)">
                                <img :src="li.profileImg"/>
                                <span>{{li.name}}</span>
                        </div>
                    </div>
                    <!-- <span slot="footer" class="dialog-footer">
                        <el-button type="primary" @click="selectDialog = false">知道了</el-button>
                    </span> -->
                    </el-dialog>

                </el-form-item>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                dialogVisible:false,
                selectDialog:false,
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
                ],
                select_title:'',
                select_data:[],
                select_index:-1,
            }
        },
        props:['approver_list','hintType'],
        methods:{
            pxove(type,index){
                this.$emit('pxove',type,index)
            },
            selectOpen(type){
                this.$emit('selectOpen',type)
            },
             del(index,num){
                this.$emit('del_poeple',index,num)

            },
            add_people(index){
                this.$emit('address',index)
            },
            go_select(a,b,c){
                this.select_title = b;
                this.select_data = a;
                this.select_index = c;
                this.selectDialog = true;
            },
            go_check(item,index){
                if(item.isSelect==false){
                    this.go_select(item.approvealList,item.quartersName,index,item.index)
                }
            },
            affirm_select(item,index){
                console.log(index)
                this.selectDialog = false;
                this.approver_list[this.select_index].auditers[0] = item;
                this.approver_list[this.select_index].index = index;
                this.approver_list[this.select_index].isSelect = false;
            }
        },
        filters:{
            info:function(info){

                let str = info.auditers.length
                if(info.approvalUserType==1){
                    str+='个'+info.quartersName
                }else{
                    str+='人'
                }
                str+=info.linkType==2?'依次审批':info.linkType==3?'会签':'或签'

                return str
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
        overflow hidden
        border-radius 4px;
        line-height initial;
    }

   .app_list{

    &_item{
        min-height 48px;
        height auto;
        position relative;
        padding-left 20px;

        >i{
            position absolute;
            left 0;
            top 0;
            bottom 0;
            margin auto;
            width 10px;
            height 10px;
            background-color #DCDEE0;
            border-radius 50%;
        }

        >div{
            min-height 80px;
            border-bottom:1px solid #ccc;
            padding-top 10px;
        }

        &:after,&:before{
            position absolute;
            content '';
            height 50%;
            width 2px;
            background-color #DCDEE0;
            left 4px;
        }

        &:after{
            top:0;
        }

        &:before{
            bottom:0;
        }

        &:first-child:after,&:last-child:before{
            display none;
        }
    }
}

.approver_info{
    display flex;


    &_type{
        flex 1;
        padding-top:10px;

        p{
            font-size 16px;
            color #333;
            font-weight 600;
            margin-bottom 5px;
        }

        span{
            color:#999;
            font-size 14px;
        }
    }

    .people_list{
        flex 3;
        display flex;
        justify-content:flex-end;
        flex-wrap:wrap;

        &_item{
            display flex;
            margin-right:10px;
            margin-bottom 10px;

            >img{
                align-self: baseline;
                margin-top 20px;
                margin-left 10px
            }

            &:last-child{
                margin-right 0;

                >img{
                    display none;
                }
            }

            &:nth-child(4),&:nth-child(8),&:nth-child(12),&:nth-child(16),&:nth-child(20){
                margin-right 0;
            }

        }


        &_user{
            position relative
            font-size 14px;
            color:#666;
            width 60px;
            text-align center;

            img{
                display block;
                width:50px;
                height:50px;
                border-radius:50%;
                margin 0 auto;
                margin-bottom 2px;
            }

            .icon{
                position absolute;
                width 15px;
                height :15px;
                top -2px;
                right:2px;
            }
        }
    }
}

.no_people{
    text-align right;
    padding-right:1px;

    span{
        font-size 12px;
        color:#999
    }
}

.approver_info_people_item{
    width:52px;
    text-align center;
    margin-top: 8px;

    img{
        width:50px;
        height:50px;
    }
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

    .omit{
        display block;
        width 60px;
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }

    .select_text{
        line-height 70px;
        cursor pointer;
        font-size:18px;
    }

    .list_content{

        padding-bottom:20px;

        >div{
            display flex;
            padding:10px;
            border-bottom:1px solid #ebebeb;

            &:hover{
                background-color:#f6f6f6;
                cursor pointer;
            }

            &:last-child{
                border:none;
            }
        }

        img{
                width:50px;
                height:50px;
                border-radius:50%;
                margin-right:15px;
            }
        span{
            flex:1;
            font-size:16px;
        }


    }
</style>