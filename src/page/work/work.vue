<template>
    <div class="main">
        <!-- {{token}} -->
        <div class="menu-item">
             <p class="item-title"> <i></i> <span>常用应用</span> </p>
             <div>
                
                <el-badge :value="msgCount=='0'?'':msgCount" class="item">
                    <div class="item" @click="openUrl('unfinishaffairs')">
                        <svg style="width: 24px;height:24px" class="icon" aria-hidden="false">
                            <use xlink:href="#icon-daibanshiyi"></use>
                        </svg>
                            待办事宜
                    </div>
                 </el-badge>

                 <div class="item"  @click="openUrl('finishaffairs')">
                    <svg style="width: 24px;height:24px" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-yibanshiyi"></use>
                    </svg>
                        已办事宜
                 </div>

                 <div class="item" @click="openUrl('myCopy')">
                    <svg style="width: 24px;height:24px" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-chaosong"></use>
                    </svg>
                        我的抄送
                 </div>

                 <div class="item"  @click="openUrl('myApply')">
                    <svg style="width: 24px;height:24px" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-wodeshenqing-mian"></use>
                    </svg>
                        我的申请
                 </div>
                 <div class="item"  @click="openUrl('daynews')">
                    <svg style="width: 24px;height:24px" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-ribao"></use>
                    </svg>
                        日报
                 </div>
                 <div class="item"  @click="openUrl('weeknews')">
                    <svg style="width: 24px;height:24px" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-zhoubao"></use>
                    </svg>
                        周报
                 </div>
                 <div class="item"  @click="openUrl('monthnews')">
                    <svg style="width: 24px;height:24px" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-yuebao"></use>
                    </svg>
                        月报
                 </div>
                  <div class="item"  @click="openUrl('workReport')">
                    <svg style="width: 24px;height:24px" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-gongzuohuibao"></use>
                    </svg>
                        工作汇报
                 </div>
             </div>
        </div>

        <div class="menu-item">
             <p class="item-title"> <i></i> <span>智能考勤</span> </p>
             <div>
                <div class="item"  @click="none()">
                    <svg style="width: 24px;height:24px" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-kaoqin"></use>
                    </svg>
                        考勤打卡
                </div>
                <div class="item"  @click="openUrl('leave')">
                    <svg style="width: 24px;height:24px" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-qingjia"></use>
                    </svg>
                        请&emsp;&emsp;假
                </div>
                <div class="item"  @click="none()">
                    <svg style="width: 24px;height:24px" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-waiqin"></use>
                    </svg>
                        公出签到
                </div>
                <div class="item"  @click="openUrl('beAwayApply')">
                    <svg style="width: 24px;height:24px" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-gongchu"></use>
                    </svg>
                        公出申请
                </div>
                <div class="item"   @click="openUrl('trip')">
                    <svg style="width: 24px;height:24px" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-chucha"></use>
                    </svg>
                        出&emsp;&emsp;差
                </div>
                <div class="item"   @click="none()">
                    <svg style="width: 24px;height:24px" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-buqiashenqing"></use>
                    </svg>
                        补卡申请
                </div>
             </div>
        </div>
        <!-- {{token}} -->

         <div class="menu-item">
             <p class="item-title"> <i></i> <span>行政审批</span> </p>
             <div>

                <div class="item" @click="openUrl('letter')" >
                    <svg style="width: 24px;height:24px"   class="icon" aria-hidden="false">
                        <use xlink:href="#icon-qingshihan"></use>
                    </svg>
                        请示函&emsp;
                 </div>

                 <div class="item" @click="none()">
                    <svg style="width: 24px;height:24px" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-yongyin"></use>
                    </svg>
                        用&emsp;&emsp;印
                 </div>

                 <div class="item" @click="openUrl('contract')">
                    <svg style="width: 24px;height:24px"   class="icon" aria-hidden="false">
                        <use xlink:href="#icon-hetongshenpi"></use>
                    </svg>
                        合&emsp;&emsp;同
                 </div>

                 <div class="item"  @click="none()">
                    <svg style="width: 24px;height:24px" class="icon"  aria-hidden="false">
                        <use xlink:href="#icon-lizhi"></use>
                    </svg>
                        离&emsp;&emsp;职
                 </div>

                 <div class="item"  @click="none()">
                    <svg style="width: 24px;height:24px" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-jiedaishenqing"></use>
                    </svg>
                        公务接待
                 </div>

                 <div class="item"  @click="none()">
                    <svg style="width: 24px;height:24px" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-zhaopin"></use>
                    </svg>
                        人员需求
                 </div>

                 <div class="item"  @click="none()">
                    <svg style="width: 24px;height:24px" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-yongche"></use>
                    </svg>
                        用&emsp;&emsp;车
                 </div>

                 <div class="item"  @click="none()">
                    <svg style="width: 24px;height:24px" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-lizhi"></use>
                    </svg>
                        通讯录&emsp;
                 </div>

                 <div class="item"  @click="none()">
                    <svg style="width: 24px;height:24px" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-lixiang"></use>
                    </svg>
                        项目立项
                 </div>

                 <div class="item"  @click="none()">
                    <svg style="width: 24px;height:24px" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-qingshihan"></use>
                    </svg>
                        员工转正
                 </div>

                 <div class="item"  @click="none()">
                    <svg style="width: 24px;height:24px" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-xingwen"></use>
                    </svg>
                        行文呈批
                 </div>

                 <div class="item"  @click="none()">
                    <svg style="width: 24px;height:24px" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-jiucan"></use>
                    </svg>
                        就&emsp;&emsp;餐
                 </div>

                 <div class="item"  @click="none()">
                    <svg style="width: 24px;height:24px" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-jiaban"></use>
                    </svg>
                        加&emsp;&emsp;班
                 </div>

                 <div class="item"  @click="none()">
                    <svg style="width: 24px;height:24px" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-diaogang"></use>
                    </svg>
                        调&emsp;&emsp;岗
                 </div>
                  <div class="item"  @click="none()">
                    <svg style="width: 24px;height:24px" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-caigou"></use>
                    </svg>
                        采&emsp;&emsp;购
                 </div>

                 <div class="item"  @click="none()">
                    <svg style="width: 24px;height:24px" class="icon" aria-hidden="false">
                        <use xlink:href="#icon-lingyong"></use>
                    </svg>
                        物品领用
                 </div>

             </div>
        </div>
        <ul class="bg-bubbles">
</ul>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                msgCount:0,
                copyCount:0,
                token:'',
            }
        },
        created(){
            let that = this;
            this.getCount()

            window['signUpdate'] =() =>{
                that.getCount();
            }
            this.token = this.Util.getCookie('auth_token')
            
        },
        methods:{
            getCount(){
                let that = this;
                this.axios.get('/work/wait/list').then(function(res){
                    if(res.data.b.data.length){
                        that.msgCount = res.data.b.data[0].count 
                    }else{
                        that.msgCount = 0
                    }
                 }).catch(function(error){
                 })

                //  this.axios.get('/work/copy/list').then(function(res){
                //     that.copyCount = res.data.b.data[0].count 
                //  })

            },
            openUrl(url){
                window.open(this.Service.baseUrl+url, "_blank");
            },
            none(){
                this.$message({
                message:'该功能尚未开发~',
                type: 'warning'
                });
            }        
        }
    }
</script>

<style lang="stylus" scoped>

    .main >>>.el-badge__content.is-fixed{
        right 15px;
    }

    .main{
        padding 15px;
        background-color #f5f5f5;
        height 100%;
        box-sizing border-box
    }

    .menu-item{
        padding 15px;
        padding-bottom 25px;
        background-color #fff;
        overflow hidden
        margin-bottom 15px
    }

    .item-title{
            overflow hidden
            margin-bottom 20px;

            i{
                float left
                width 4px;
                height 20px;
                background-color #24b36b;
                margin-top 3px;
                margin-right 6px;
            }

            span{
                float left
                font-size 20px;
                color #333
            }
        }

    .item{
        height 45px;
        width 140px;
        line-height 45px;
        font-size 16px
        text-align center
        float left
        margin-right 15px;
        cursor pointer

        svg{
            position: relative;
            top: 5px;
            margin-right 2px
            font-size 24px
        }

        &:hover{
            box-shadow:0px 4px 8px 1px rgba(0,0,0,0.1)
            border-radius 4px
        }
    }


</style>