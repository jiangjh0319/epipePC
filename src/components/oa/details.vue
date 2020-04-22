<template>
    <div class="main" @click.prevent="" v-if="show">
        <Opinion
            :show='opinionShow'
            :type="opinionType"
            v-on:isShow='opinion'
            :applyId="applyId"
            :applyType="oaType-1"
            :toPeople='people[0]'
            v-on:reload='reload'
            v-on:accomplish='accomplish'
        ></Opinion>
        <AddressList
            :show="openAdd"
            v-on:choose="choose"
            v-on:close="openAdd=false"
            types="other"
        >
        </AddressList>
        
        <div class="infor" @click.stop="" v-loading="loading">
            <div class="infor-title">
                    {{title}}
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
                                    <p v-if="status=='0'">等待{{info.auditUserName?info.auditUserName:info.auditName}}的{{info | awaits}}</p>
                                    <p  v-else>{{status|stateName}}</p>
                                </div>
                            </div>

                            <div class="infor-text">
                                <DetailsText :type="oaType" :data="info||{}">

                                </DetailsText>

                            </div>
                            <div class="file" v-if="info.accessory&&info.accessory.length">
                                <div style="margin-bottom:15px;">
                                    <span class="info-title">附件</span>
                                    
                                </div>
                                <div class="file-list">
                                    <div v-for="(item,index) in info.accessory" :key="index">
                                        <div>
                                            <img src="./../../assets/wenjian.png" v-if="!item.isImg"/>
                                            <img :src="item.url" v-else/>
                                            </div>
                                        <div style="flex:1">
                                            <p>{{item.fileName}}</p>
                                            <span>{{item.fileSize |fileSize}}</span>
                                        </div>
                                        <div>
                                            <a @click="openFile(item.url,item.fileName)">查看</a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <!-- ========================================================================== -->
                            <div v-if="info.links">
                                <div class="flow_list">
                                    <div class="flow_list_item">
                                        <div >
                                            <div class="user_info">
                                                <img :src="info.profileImg" class="head_img"/>
                                                <div class="user_info_d">
                                                    <span>{{info.username}}</span>
                                                    <span>发起申请</span>
                                                    <span>{{info.applyTime | timeStrSlice}}</span>
                                                </div>
                                            </div>
                                            <div class="user_info_rest arrows" style="height:30px;"></div>

                                        </div>
                                    </div>
                                    <div class="flow_list_item" v-if="info.auditStatus=='3'" style="margin-top:10px">
                                        <div >
                                            <div class="user_info">
                                                <img :src="info.profileImg" class="head_img"/>
                                                <div class="user_info_d">
                                                    <span>{{info.username}}</span>
                                                    <span class="careOf">已撤销</span>
                                                    <span></span>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                    <div v-for="(item,index) in info.links" :key="index" class="flow_item" v-if="index<=endIndex&&info.auditStatus!='3'">
                                        <div v-if="item.flow" >
                                            <div class="user_info">
                                                <img :src="item.profileImg" class="head_img"/>
                                                <div class="user_info_d">
                                                    <span>{{item.name}}</span>
                                                    <span :class="item.status | statusClass">{{item.status | stateName}}</span>
                                                    <span>{{item.auditTime | timeStrSlice}}</span>
                                                </div>
                                            </div>
                                            <div class="user_info_rest arrows">
                                                <p>{{item.reason}}</p>
                                                <div v-if="item.accessory" class="file">
                                                    <div class="accessory file-list">
                                                        <div @click.stop="openFile(file.url,file.fileName)"  style="margin-top:10px;margin-bottom:0" v-for="file in item.accessory" :key="file.url">
                                                            <div>
                                                                <img src="./../../assets/wenjian.png" v-if="!file.isImg"/>
                                                                <img :src="file.url" v-else/>
                                                            </div>
                                                            <div style="flex:1">
                                                                <p>{{file.fileName}}</p>
                                                                <span>{{file.fileSize |fileSize}}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                        <div v-else-if="item.auditers.length"  class="flow_list_item" >
                                            <div class="user_info">
                                                <img src="../../assets/group.png" class="head_img"/>
                                                <div class="approve_state">
                                                    <p>审批人 <span v-if="item.status=='0'">审批中</span></p>
                                                    <span class="approver_type">{{item |info}}</span>
                                                </div>
                                            </div>
                                            <div class="approvers_list arrows">
                                                <div v-for="(child,num) in item.auditers" :key="num" class="approvers_list_item">
                                                    <img class="user_img" :src="child.profileImg"/>
                                                    <span class="omit">{{child.name}}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div v-else>
                                            <div class="user_info">
                                                <img src="../../assets/head.png" class="head_img"/>
                                                <div>
                                                    <p style="font-size:15px;">{{item.approvalUserType==1?item.quartersName:'主管'}}</p>
                                                    <span style="color:#999;font-size:12px;">{{item.approvalUserScope==2?'未找到审批人自动通过':'未找到审批人转交管理员'}}</span>
                                                </div>
                                            </div>
                                            <div class="approvers_list arrows"></div>
                                        </div>
                                    </div>


                                </div>
                            </div>
                            <div class="approve" v-else>
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

                                    <div v-if="info.auditStatus==3">
                                        <div class="approve-list-item">
                                            <div>
                                                <img :src="info.profileImg" class="profileImg"/>
                                            </div>
                                            <span style="margin-left:20px;">{{info.username}}</span>
                                            <span class="careOf">已撤销</span>
                                            <span></span>
                                        </div>
                                        <div class="approve-list-other">
                                        </div>
                                    </div>

                                    <div v-if="info.auditStatus!=3"  v-for="(item,index) in info.auditers" :key="item.userId">
                                        <div class="approve-list-item">
                                            <div>
                                                <img :src="item.profileImg" class="profileImg"/>
                                            </div>
                                            <span style="margin-left:20px;">{{item.name}}</span>
                                            <span :class="item.status | statusClass">{{item.status | auditersState}}</span>
                                            <span>{{item.auditTime}}</span>
                                        </div>
                                        <div class="approve-list-other">
                                            <svg class="icon icon-back" aria-hidden="false" v-if="index!=info.auditers.length-1">
                                                <use xlink:href="#icon-jiantou1"></use>
                                            </svg>
                                            <p>{{item.reason}}</p>
                                            <div v-if="item.accessory" class="file">
                                                <div class="accessory file-list">
                                                    <div @click.stop="openFile(file.url,file.fileName)"  style="margin-top:10px;margin-bottom:0" v-for="file in item.accessory" :key="file.url">
                                                        <div>
                                                            <img src="./../../assets/wenjian.png" v-if="!file.isImg"/>
                                                            <img :src="file.url" v-else/>
                                                        </div>
                                                        <div style="flex:1">
                                                            <p>{{file.fileName}}</p>
                                                            <span>{{file.fileSize |fileSize}}</span>
                                                        </div>
                                                    </div>
                                                </div>
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
            <div class="foot-behavior" v-if="info.auditStatus=='0'">
                <div class="foot-left-btn">
                    <div @click="consent(3)"  v-if="info.myselfApply=='0'&&info.auditStatus!=3">
                        <svg class="icon" aria-hidden="false">
                            <use xlink:href="#icon-pc-icon-tuihui"></use>
                        </svg>
                        <span>退回</span>
                    </div>
                    <div @click="consent(4)"  v-if="info.myselfApply=='0'&&info.auditStatus!=3">
                        <svg class="icon icon-back" style="color:#609df6" aria-hidden="false" >
                            <use xlink:href="#icon-pc-icon-pinglun"></use>
                        </svg>
                        <span>评论</span>
                    </div>
                    <div @click="careOf"  v-if="info.myselfApply=='0'&&info.auditStatus!=3">
                        <svg class="icon" aria-hidden="false">
                            <use xlink:href="#icon-pc-icon-zhuanjiao"></use>
                        </svg>
                        <span>转交</span>
                    </div>
                    <div @click="audit(1)" v-if="myself">
                        <svg class="icon" aria-hidden="false">
                            <use xlink:href="#icon-pc-icon-chexiao"></use>
                        </svg>
                        <span>撤销</span>
                    </div>
                    <div @click="audit(6)" v-if="myself">
                        <svg class="icon" aria-hidden="false">
                            <use xlink:href="#icon-pc-icon-chuiban"></use>
                        </svg>
                        <span>催办</span>
                    </div>
                </div>
                <div class="foot-right-btn" v-if="info.myselfApply=='0'&&info.auditStatus!=3">
                    <el-button class="refuse" @click="consent(2)">拒绝</el-button>
                    <el-button class="consent" @click="consent(1)">同意</el-button>
                </div>
            </div>

        </div>
    </div>
</template>

<script>
    import DetailsText from './details_text.vue'
    import AddressList from './../common/addressList.vue'
    import Opinion from './opinion.vue'


    export default {
        data() {
            return {
                info:{},
                status:'0',
                opinionType:'1',
                loading:true,
                people:[],
                title:'',
                endIndex:99999,
                opinionShow:false,
                openAdd:false,
                myself:false,
                peopleType:false,//打开通讯录类型
                oa:['','请假','请示函','合同', '公出', '出差' ,'用印' ,'报销','付款','离职',
                '借款','接待','补卡', '用车', '人员需求','项目立项', '转正', '就餐',
                '行文呈批','加班','员工调岗','采购','物品领用','权限异动'],
                ajax:['',{url:'leave/apply',name:'leaveId'},{url:'letter',name:'letterId'},{url:'contract',name:'contractId'}, {url:'/outsign/task/infos',name:'outsideId'},
                {url:'trip',name:'tripId'}, {url:'stamp',name:'stampId'} ,{url:'reimburse',name:'reimburseId'},{url:'pay',name:'payApplyId'},{url:'dimission',name:'dimissionApplyId'},
                {url:'borrow',name:'borrowApplyId'},{url:'reception',name:'receptionApplyId'},{url:'absence',name:'absenceApplyId'}, {url:'car',name:'carApplyId'}, 
                {url:'employee',name:'employeeApplyId'}, {url:'project',name:'projectApplyId'}, {url:'regular',name:'regularApplyId'}, {url:'meal',name:'mealApplyId'},
                {url:'document',name:'documentApplyId'},{url:'overtime',name:'overTimeApplyId'},{url:'changeposition',name:'positionApplyId'},{url:'buy',name:'userBuyApplyId'},
                {url:'material',name:'materialReceiveApplyId'},{url:'move/erpprimove/info',name:'erpprimoveApplyId'}]
            }
        },
        props:['show','data','oaType','applyId','typeName',],
        methods: {
            control(){
                this.loading=true
                this.$emit('isShow')
            },
            careOf(){
                this.openAdd=true;
            },
            choose(arr){
                console.log(arr)
                this.people= arr;
                this.openAdd = false;
                this.consent(5)
            },
            reload(){
                this.getDetails()
                this.opinionShow = false;
            },
            audit(type){
                let that = this;
                this.axios.post('/work/audit'+this.Service.queryString({
                    applyId:this.applyId,
                    type:type,
                    applyType:this.oaType,
                })).then(function(res){
                    if(res.data.h.code==200){
                        let message = type==1?'撤销成功!':'催办成功!'
                        that.$message({
                            message,
                            type: 'success'
                            });
                        if(type==1){
                            that.getDetails()
                        }
                    }else{
                        that.$message({
                            message:res.data.h.msg,
                            type: 'error'
                        })
                    }
                })
            },
            getDetails(){
                let that = this;
                let url = '/work/'+this.ajax[this.oaType].url+'/info'
                if(this.oaType==4||this.oaType==23){
                    url = this.ajax[this.oaType].url
                }
                 this.axios.get(url+'?'+this.ajax[this.oaType].name+'='+this.applyId+'&pushId=0').then((res)=>{
                     if(res.data.h.code!=200){
                         that.$emit('isShow')
                         that.$message.error(res.data.h.msg);
                     }
                    that.loading = false;
                     if(res.data.b.data){
                        that.info = res.data.b.data[0];
                     }else{
                         that.info = res.data.b;
                     }


                    that.title = that.info.username+'的'+that.oa[that.oaType]+'申请'
                    that.info.accessory = that.accessoryFors(that.info.accessory)

                    if(that.info.auditUserId.indexOf(that.info.userId)>-1){
                        that.myself=true;
                        if(that.info.auditStatus==0&&that.info.myselfApply!='00'){
                            that.info.myselfApply="0"
                        }
                    }

                    if(that.info.myselfApply=='ziji'){
                        console.log(22)
                        that.myself=true;
                    }
                    
                    that.status = that.info.auditStatus;

                    if(that.info.links){
                        let arr = that.info.links,newArr=[];
                        arr.forEach(item=>{
                            for(let i =0;i<item.auditers.length;i++){
                                if(item.auditers[i].accessory!=null){
                                        item.auditers[i].accessory = that.accessoryFors(item.auditers[i].accessory)
                                }
                            }
                        })

                        for(let i=0;i<arr.length;i++){
                            let ar = JSON.parse(JSON.stringify(arr[i]))
                            ar.auditers = [];
                            let data = arr[i].auditers;

                            if(arr[i].admins&&arr[i].admins.length){
                                let flow = arr[i]
                                flow.auditers = arr[i].admins;
                                flow.admins = [];
                                flow.linkType = 4;
                                arr.splice(i,0,flow)
                            }


                            data.forEach(item=>{
                                if(item.status!=='00'&&item.status!='0'){
                                    item.flow = true;
                                    newArr.push(item)
                                }else{
                                    item.hide = true;
                                    ar.auditers.push(item)
                                }

                                if(item.status=='0'){

                                    ar.status = '0'
                                }
                            })

                            if(ar.auditers.length==1&&ar.auditers[0].status=='0'){
                                ar.auditers[0].flow = true
                                newArr.push(ar.auditers[0])
                            }else if(ar.auditers.length>0){
                                newArr.push(ar)
                            }


                            if(!ar.auditers.length&&(ar.approvalUserType==1||ar.approvalUserType==2)&&ar.approvalUserScope==2){
                                newArr.push(ar)
                            }
                            
                        }
                        that.info.links = newArr;
                    }else{
                        for(let i =0;i<that.info.auditers.length;i++){   
                            if(that.info.auditers[i].accessory!=null){
                                that.info.auditers[i].accessory = that.accessoryFors(that.info.auditers[i].accessory)
                            }
                        }
                    }

                 })
            },
            accessoryFors:function(datas){
                if(!datas||datas.url==null) return false
               let urlArr = datas.url.split('|')
               let fileSizeArr = datas.fileSize.split('|')
               let fileNameArr = datas.fileName.split('|')
               let arrs = [];
                for(let i=0;i<urlArr.length;i++){
                    let bool = this.isImg(urlArr[i])
                    arrs.push({
                        url:urlArr[i],
                        fileSize:fileSizeArr[i],
                        fileName:fileNameArr[i],
                        isImg: bool,
                    })
                }
                return arrs
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
            openFile(url,name){
                this.Msg.openFile(url,name)
            },
            opinion(){
                this.opinionShow = false;
            },
            consent(type){//同意啊
                this.opinionType = type
                this.opinionShow = true
            },
            accomplish(){
                this.$emit('accomplish')
            }
        },
        components:{
            DetailsText,
            Opinion,
            AddressList
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
                    return "已撤销";
                    break;
                case '4':
                    return "已退回";
                    break;
                case '5':
                    return "已评论";
                    break;
                }
            },
            awaits:function(data){
                let str = '';
                if(data.linkType==4){
                    str='或签'
                }else if(data.linkType=3){
                    str='会签'
                }
                return  str+='审批';
            }, 
            auditersState: function(value){
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
                case '5':
                    return "已评论";
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
                case '5':
                    return "consent";
                    break;
                }
            },
            info(item){
                if(item.auditers.length<2){
                    return item.auditers.length+'人审批'
                }if(item.linkType==2){
                    return item.auditers.length+'人依次审批'
                }else if(item.linkType==4){
                    return item.auditers.length+'人或签'
                }else if(item.linkType==3){
                    return item.auditers.length+'人会签'
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
            },
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
        height  520px;
        position absolute;
        top 0
        left 0
        right 0
        bottom 0
        z-index 99
        margin auto 
        padding-bottom: 80px;
        

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
            height 475px;
            background-color #fff;


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

    .file{
        padding-bottom:20px;

        &-list{

            >div{
                display:flex;
                background-color:#f5f5f5;
                margin-bottom 10px;
                padding:15px;
                cursor pointer
            }

            span{
                color:#999;
            }
        }

        img{
            width:40px;
            height:40px;
            margin-right:15px;
        }

        a{
            display inline-block;
            width:70px;
            height:30px;
            border:1px solid #ccc;
            text-align:center
            line-height:30px;
            border-radius:3px;
            color:#333;
            margin-top: 5px;

            &:hover{
                background-color:#f1f0f0;
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

//审批动作
.foot-behavior{
    display:flex;
    height:80px;
    width:100%;
    background-color:#f5f5f5;
    position absolute
    bottom:0;
    left:0;
    border-top:1px solid #b6bcc6;
}

.foot-right-btn{
    width:240px;
    height:100%;
    line-height: 80px;

    >>>.el-button{
        width:100px;
        padding:9px 20px;
        font-size 16px;
        border-color:#24b36b;
    }

    >>>.el-button+.el-button {
        margin-left: 15px;
    }

    .refuse{
        border-color:#24b36b;
        color:#24b36b;
    }

    .consent{
        background-color:#24b36b;
        color:#fff;
    }
}

.foot-left-btn{
    flex:1;
    display:flex;
    justify-content:center;

    svg{
        display:block;
        width:28px;
        height:28px;
        margin:0 auto;
        color:#f80;
    }

    span{
        font-size 14px;
        color:#999;
    }

    >div{
        
        width:70px;
        text-align:center;
        align-self: center;
        cursor:pointer;
    }
}


.approvers_list{
    position relative
    display flex;
    padding-left 55px;
    flex-wrap wrap;
    margin-top:10px;

    &_item{
        width 50px;
        text-align center;
        font-size 12px;
        color:#999;
        margin-right:25px;
        margin-bottom:10px;
    }
}

.flow_item:last-child .arrows{
        min-height:0;

        &:after,&:before{
            display none;
        }
    }


.user_info{
    display flex;

    .head_img{
        width:50px;
        height:50px;
        border-radius:50%;
        margin-right 10px;
    }

    &_rest{
        color:#666;
        margin-top:10px;
        padding-left 45px;

        >p{
            font-size 14px;
            margin-bottom 10px;
        }

        
    }


    &_d{
        flex 1;
        display:block;
        line-height 50px;
        font-size 14px;


        span:first-child{
            float:left;
            font-size 15px;
            color #333;
            width:70px;
            overflow: hidden;
            text-overflow:ellipsis;
            white-space: nowrap;
        }

        span:last-child{
            color #666;
            margin-left:15px;
        }
    }

    .approve_state{

        >p{
            font-size 15px;

            span{
                color #f80;
            }
        }

        span{
            font-size 12px;
        }

        .approver_type{
            color:#999;
        }
    }
}

.arrows{
    position relative;
    min-height:20px;


        &:after{
            position absolute
            content ''
            top:0;
            left 24px;
            height 100%;
            width:2px;
            background-color #02D6B2
        }

        &:before{
                position: absolute;
                content: '';
                width: 6px;
                height: 6px;
                border: 2px solid #02d6b2;
                border-top: none;
                border-left: none;
                bottom: -1px;
                left: 21px;
                transform: rotate(45deg);
        }
    }

.user_img{
        display block;
        width:37px;
        height:37px;
        border-radius:50%;
        margin 0 auto;
    }

    .flow_item{
        margin-top:10px;
    }

</style> 