<template>
    <div>

        <div>
            <div v-if="oaType==1">
                <div class="details_box">
                     <div >
                        <span>请假类型 :</span>
                        <a > {{item.leaveType}}</a>
                    </div>
                     <div >
                        <span>开始时间 :</span>
                        <a > {{item.beginTime}}</a>
                    </div>
                     <div >
                        <span>结束时间 :</span>
                        <a > {{item.endTime}}</a>
                    </div>
                </div>
            </div>
            <div v-else-if="oaType==2">
                <div class="details_box">
                    <div >
                        <span>主题 :</span>
                        <a > {{item.theme}}</a>
                    </div>
                    <div >
                        <span>请示内容 :</span>
                        <a   v-html="item.content"></a>
                    </div>
                </div>
            </div>
            <div v-else-if="oaType==3">
                <div class="details_box">
                   <div >
                        <span >合同名称 :</span>
                        <a > {{item.contractName}}</a>
                    </div>
                    <div >
                        <span>项目责任人 :</span>
                        <a  >{{item.title}}</a>
                    </div>
                </div>
            </div>
            <div v-else-if="oaType==4">
                <div class="details_box">
                   <div >
                        <span>公出事由 :</span>
                        <a  v-html="item.outsideReason"></a>
                    </div>
                    <div >
                        <span >公出类型 :</span>
                        <a > {{item.outsideType}}</a>
                    </div>
                    <div >
                        <span >公出地点 :</span>
                        <a > {{item.outsideAddress}}</a>
                    </div>
                    <div >
                        <span >开始时间 :</span>
                        <a > {{item.beginTime |slice3}}</a>
                    </div>
                </div>
            </div>
            <div v-else-if="oaType==5">
                <div class="details_box">
                    <div >
                        <span >标题 :</span>
                        <a > {{item.theme}}</a>
                    </div>
                    <div >
                        <span >出差地点 :</span>
                        <a > {{item.outsideAddress}}</a>
                    </div>
                    <div >
                        <span >开始时间 :</span>
                        <a > {{item.beginTime |slice3}}</a>
                    </div>
                    <div >
                        <span >结束时间 :</span>
                        <a > {{item.endTime |slice3}}</a>
                    </div>
                    <div >
                        <span>出差事由 :</span>
                        <a   v-html="item.content"></a>
                    </div>
                </div>
            </div>
            <div v-else-if="oaType==6">
                <div class="details_box">
                   <div >
                        <span >文件名称 :</span>
                        <a > {{item.sealFileName}}</a>
                    </div>
                    <div >
                        <span >文件类别 :</span>
                        <a > {{item.fileCategory}}</a>
                    </div>
                    <div >
                        <span >文件数量 :</span>
                        <a > {{item.fileQuantity }}</a>
                    </div>
                    <div >
                        <span >印章名称 :</span>
                        <a > {{item.sealName}}</a>
                    </div>
                </div>
            </div>
            <div v-else-if="oaType==7">
                <div class="details_box">
                   <div >
                        <span >报销金额 :</span>
                        <a > {{item.reimburseAmount}} 元</a>
                    </div>
                    <div >
                        <span >日期 :</span>
                        <a > {{item.reimburseDate | slice3}}</a>
                    </div>
                    <div >
                        <span >报销类别 :</span>
                        <a > {{item.reimburseType}}</a>
                    </div>
                    <div >
                        <span >费用明细 :</span>
                        <a  > {{item.reimburseDesc }}</a>
                    </div>
                </div>
            </div>
            <div v-else-if="oaType==8">
                <div class="details_box">
                    <div >
                        <span >付款金额 : </span>
                        <a >{{item.payAmount}} 元</a>
                    </div>
                    <div >
                        <span>付款方式 :</span>
                        <a > {{item.payType}}</a>
                    </div>
                    <div >
                        <span >付款日期 :</span>
                        <a >{{item.payDate |slice3 }} </a>
                    </div>
                    <div >
                        <span>收款人全称 :</span>
                        <a >{{item.receiverName}}</a>
                    </div>
                </div>
            </div>
            <div v-else-if="oaType==9">
                <div class="details_box">
                   <div >
                        <span >职务 : </span>
                        <a >{{item.position}} </a>
                    </div>
                    <div >
                        <span>入职日期 :</span>
                        <a > {{item.hireDate |slice3}}</a>
                    </div>
                    <div >
                        <span >合同到期日 :</span>
                        <a >{{item.contractEndDate |slice3 }} </a>
                    </div>
                    <div >
                        <span>最后工作日 :</span>
                        <a >{{item.dimissionDate |slice3 }}</a>
                    </div>
                </div>
            </div>
            <div v-else-if="oaType==10">
                <div class="details_box">
                   <div >
                        <span >借款金额 : </span>
                        <a >{{item.borrowAmount}} 元</a>
                    </div>
                    <div >
                        <span>借款日期 :</span>
                        <a > {{item.useDate |slice3 }}</a>
                    </div>
                    <div >
                        <span >归还日期 :</span>
                        <a >{{item.returnDate |slice3 }} </a>
                    </div>
                    <div >
                        <span>借款事由 :</span>
                        <a  >{{item.content  }}</a>
                    </div>
                </div>
            </div>
            <div v-else-if="oaType==11">
                <div class="details_box">
                   <div >
                        <span >来宾单位 : </span>
                        <a >{{item.visitorCompany}} </a>
                    </div>
                    <div >
                        <span>到访日期 :</span>
                        <a > {{item.visitDate |slice3 }}</a>
                    </div>
                    <div >
                        <span >接待等级 :</span>
                        <a >{{item.receptionLevel}} </a>
                    </div>
                    <div >
                        <span>预算费用 :</span>
                        <a >{{item.totalBudget}} 元</a>
                    </div>
                </div>
            </div>
            <div v-else-if="oaType==12">
                <div class="details_box">
                   <div >
                        <span> 提 &nbsp;交&nbsp;人 :</span><a >{{item.title}} </a>
                    </div>
                    <div >
                        <span>所属部门 :</span>
                        <a >{{item.officeName }}</a>
                    </div>
                    <div >
                        <span >时间 :</span>
                        <a >{{item.absenceDate|slice3 }} </a>
                    </div>
                    <div >
                        <span>原因 :</span>
                        <a  >{{item.absenceReason  }}</a>
                    </div>
                </div>
            </div>
            <div v-else-if="oaType==13">
                <div class="details_box">
                   <div >
                        <span>车辆类型</span><a >{{item.carType}} </a>
                    </div>
                    <div >
                        <span>数量 (辆) :</span>
                        <a >{{item.num }}</a>
                    </div>
                    <div >
                        <span >开始时间 :</span>
                        <a >{{item.beginTime|slice3 }} </a>
                    </div>
                        <div >
                        <span >结束时间 :</span>
                        <a >{{item.endTime|slice3 }} </a>
                    </div>
                    <div >
                        <span>用车事由 :</span>
                        <a  >{{item.content}}</a>
                    </div>
                </div>
            </div>
            <div v-else-if="oaType==14">
                <div class="details_box">
                   <div >
                        <span>招聘岗位 :</span><a >{{item.position}} </a>
                    </div>
                    <div >
                        <span>需求人数 :</span>
                        <a >{{item.num }}</a>
                    </div>
                    <div >
                        <span >到岗日期 :</span>
                        <a >{{item.hireDate|slice3 }} </a>
                    </div>
                    <div >
                        <span>申请理由 :</span>
                        <a  >{{item.content}}</a>
                    </div>
                </div>
            </div>
            <div v-else-if="oaType==15">
                <div class="details_box">
                   <div >
                        <span>项目名称 :</span><a >{{item.projectName}} </a>
                    </div>
                    <div >
                        <span>预估金额 :</span>
                        <a >{{item.projectBudget }}</a>
                    </div>
                    <div >
                        <span >立项时间 :</span>
                        <a >{{item.buildDate|slice3 }} </a>
                    </div>
                    <div >
                        <span>项目周期 :</span>
                        <a  >{{item.projectDate}}</a>
                    </div>
                </div>
            </div>
            <div v-else-if="oaType==16">
                <div class="details_box">
                   <div >
                        <span>职务 :</span><a >{{item.position}} </a>
                    </div>
                    <div >
                        <span>入司时间 :</span>
                        <a >{{item.hireDate|slice3}}</a>
                    </div>
                    <div >
                        <span >试用开始时间 :</span>
                        <a >{{item.beginTime|slice3 }} </a>
                    </div>
                    <div >
                        <span>试用结束时间 :</span>
                        <a  >{{item.endTime|slice3}}</a>
                    </div>
                </div>
            </div>
            <div v-else-if="oaType==17">
                <div class="details_box">
                   <div >
                        <span>就餐人数 :</span><a >{{item.num}} </a>
                    </div>
                    <div >
                        <span>开始时间 :</span>
                        <a >{{item.beginTime|slice3}}</a>
                    </div>
                    <div >
                        <span >结束时间 :</span>
                        <a >{{item.endTime|slice3 }} </a>
                    </div>
                    <div >
                        <span>就餐标准 :</span>
                        <a  >{{item.mealStandard}}</a>
                    </div>
                </div>
            </div>
            <div v-else-if="oaType==18">
                <div class="details_box">
                    <div >
                        <span>文件编号 :</span><a >{{item.documentNo}} </a>
                    </div>
                    <div >
                        <span>主送 :</span>
                        <a >{{item.sendTo}}</a>
                    </div>
                </div>
            </div>
            <div v-else-if="oaType==19">
                <div class="details_box">
                   <div >
                        <span>开始时间 :</span><a >{{item.beginTime |slice3}} </a>
                    </div>
                    <div >
                        <span>结束时间 :</span><a >{{item.endTime |slice3}} </a>
                    </div>
                    <div >
                        <span>时长 :</span>
                        <a >{{item.duration}} 小时</a>
                    </div>
                    <div >
                        <span>加班原因 :</span>
                        <a >{{item.content}} </a>
                    </div>
                </div>
            </div>
            <div v-else-if="oaType==20">
                <div class="details_box">
                   <div >
                        <span>申请人 :</span><a >{{item.title}} </a>
                    </div>
                    <div >
                        <span>调岗人 :</span>
                        <a >{{item.targetName}}</a>
                    </div>
                    <div >
                        <span>调岗前部门/职位 :</span>
                        <a >{{item.exOffAndPosi}}</a>
                    </div>
                    <div >
                        <span>调岗后部门/职位 :</span>
                        <a >{{item.afterOffAndPosi}}</a>
                    </div>
                    <div >
                        <span>调岗日期 :</span>
                        <a >{{item.changeDate |slice3}}</a>
                    </div>
                </div>
            </div>
            <div v-else-if="oaType==21">
                <div class="details_box">
                   <div >
                        <span>申请人 :</span><a >{{item.title}} </a>
                    </div>
                    <div >
                        <span>采购事由 :</span>
                        <a >{{item.applyTheme}}</a>
                    </div>
                    <div  v-if="item.buyType">
                        <span>采购类型 :</span>
                        <a >{{item.buyType}}</a>
                    </div>
                    <div >
                        <span>期望交付日期 :</span>
                        <a >{{item.HopeDeliveryDate |slice39}}</a>
                    </div>
                </div>
            </div>
            <div v-else-if="oaType==22">
                <div class="details_box">
                   <div >
                        <span>申请人:</span><a >{{item.title}} </a>
                    </div>
                    <div >
                        <span>物品用途 :</span>
                        <a >{{item.applyTheme}}</a>
                    </div>
                    <div >
                        <span>物品名称 :</span>
                        <a >{{item.materialName}}</a>
                    </div>
                    <div  v-if="item.num">
                        <span>数量 :</span>
                        <a >{{item.num }}</a>
                    </div>
                </div>
            </div>

        </div>

    </div>
</template>

<script>
    export default {
        data() {
            return {
                
            }
        },
        props:['oaType','item']
    }
</script>

<style lang="stylus" scoped>

    span{
        color:#24b36b;
    }

    .details_box{

        >div{
            margin-bottom:10px;
            display: -webkit-box;
            -webkit-box-orient: vertical;
            -webkit-line-clamp: 2;
            overflow: hidden;

            &:last-child{
                margin-bottom:0px;
            }
        }
    }
</style>