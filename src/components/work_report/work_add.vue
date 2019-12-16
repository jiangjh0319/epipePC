<template>
    <div class="address" v-if="show" >
            <div class="cont" @click.stop="">
                <div class="address-title">
                    选择联系人

                    <div class="close" @click="close(1)">
                        <svg  class="icon" aria-hidden="false">
                            <use xlink:href="#icon-x"></use>
                        </svg>
                    </div>
                </div>

                <div class="address-main">

                    <div class="address-organization">
                        <el-scrollbar class="default-scrollbar" wrap-class="default-scrollbar__wrap" view-class="default-scrollbar__view" :native="false">
                            <div v-for="item in list" :key="item.id" >
                                <div class="organ_item">
                                    <div class="organ_img" @click="chose(item)">
                                        <svg v-show="item.mark_chose"  class="icon">
                                            <use xlink:href="#icon-chenggong"></use>
                                        </svg>
                                        <svg v-show="!item.mark_chose"  class="icon">
                                            <use xlink:href="#icon-meiyouxuanzhong"></use>
                                        </svg>
                                    </div>
                                    <p :class="item.mark_chose?'active':''" @click="item.open=!item.open">{{item.name}}</p>
                                    
                                    <div class="organ_icon" v-show="item.open">
                                        <svg  class="icon" aria-hidden="false">
                                            <use xlink:href="#icon-sanjiao"></use>
                                        </svg>
                                    </div>
                                </div>
                                <div v-if="item.open">
                                    <div v-for="(dep,ind) in item.subOffice" :key="dep.id" class="department" >
                                        <div class="department_cont">
                                            <div class="organ_img" @click="chose(dep)">
                                                <svg v-show="dep.mark_chose"  class="icon">
                                                    <use xlink:href="#icon-chenggong"></use>
                                                </svg>
                                                <svg v-show="!dep.mark_chose"  class="icon">
                                                    <use xlink:href="#icon-meiyouxuanzhong"></use>
                                                </svg>
                                            </div>
                                            <p :class="dep.mark_chose?'active':''" @click.stop="selectOffices(dep,ind,item)">{{dep.name}}</p>
                                            <div class="organ_icon" v-show="dep.subOffice.length&&dep.open">
                                                <svg  class="icon" aria-hidden="false">
                                                    <use xlink:href="#icon-sanjiao"></use>
                                                </svg>
                                            </div>
                                        </div>
                                        <div v-if="dep.open">
                                            <div v-for="(c,num) in dep.subOffice" :key="c.id" :class="c.mark_chose?'dep_active department':'department'">
                                                <div class="department_cont" style="padding-left:45px;">
                                                    <div class="organ_img" @click="chose(c)">
                                                        <svg v-show="c.mark_chose"  class="icon">
                                                            <use xlink:href="#icon-chenggong"></use>
                                                        </svg>
                                                        <svg v-show="!c.mark_chose"  class="icon">
                                                            <use xlink:href="#icon-meiyouxuanzhong"></use>
                                                        </svg>
                                                    </div>
                                                    <p  @click.stop="selectOffices(c,num,dep,item)">{{c.name}}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                             </div>

                        </el-scrollbar>

                    </div>

                    <div class="address-personnel">
                        <el-scrollbar class="default-scrollbar" wrap-class="default-scrollbar__wrap" view-class="default-scrollbar__view" :native="false">
                            <div v-for="(item,index) in perso_data" class="personnel-item" :key="item.id" @click="pitch_on(item,index)">
                                <div class="selectImg">
                                    <img src="./../../assets/20.png" v-if="item.mark_chose"/>
                                    <img src="./../../assets/19.png" v-else/>
                                </div>
                                <div class="headImg">
                                    <img :src="item.profileImg"/>
                                </div>
                                <p>{{item.name}}</p>
                            </div>
                            <div v-if="!perso_data.length" class="nopersonnel">
                                暂无联系人
                            </div>
                        </el-scrollbar>
                    </div>
                </div>

                <!-- 底部 -->
                <div class="footer">

                 <div class="pitchOn_list" >
                    
                        <div class="choose" ref="choose">
                            <img  src="./../../assets/left.png" class="img_left"/>
                            <img  src="./../../assets/left.png" class="img_right" />
                            <div class="choose_list" ref="choose_list" @mousedown="mouse_down($event,2)" @mouseup="mouse_up">
                                <div v-for="(item,index) in choose_data" class="choose_item" :key="item.userId">
                                    <svg style="width:15px;height:15px;" class="icon" aria-hidden="false" @click="remove(item,index)">
                                        <use xlink:href="#icon-shanchu"></use>
                                    </svg>
                                    <img :src="item.profileImg" draggable="false" class="profileImg" @mouseup="mouse_up">
                                    <p class="omit">{{item.name}}</p>
                                </div>
                            </div>

                            <div class="scroll_line" @mousedown="mouse_down($event,1)"  @mouseup="mouse_up" ref="scroll_line"></div>
                         </div> 
                         <div class="ok_btn">
                             <el-button type="success" @click="confirm" >确定</el-button>
                            
                         </div>
                 </div> 

                    <!-- <div class="footer_btn">
                        <el-button type="success" @click="confirm" v-if="choose_data.length">确定</el-button>
                        <el-button type="info" disabled @click="confirm" v-else>确定</el-button>
                    </div> -->
                </div>
            </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                list:[],
                perso_data:[],
                choose_data:[],

                baseData:null,
                baseData2:null,
                baseData3:null,
                isDown:false,
            }
        },
        props:['show','types','receivers','arr'],
        watch:{
            show:function(){
                if(this.show){
                    document.querySelector('#app').style.overflowY='hidden'
                }else{
                    document.querySelector('#app').style.overflowY='auto'
                } 
            },
            types:function(){
                choose_data = receivers
            },
      
        },
        created(){
            let that = this;
            this.axios.get('work/report/permit/list').then(function (res) {
               let datas = res.data.b;

            datas.push({name:'所有用户',allInFlag:true})
            datas.push({name:'我的',allInFlag:true})

            datas.forEach(element => {
                element.mark_chose = false
                element.open = false
                    if(!element.subOffice) return false
                    element.subOffice.forEach(item=>{
                        item.mark_chose = false
                        item.open = false
                        if(item.subOffice&&item.subOffice.length!=0){

                            item.subOffice.forEach(el=>{
                                    el.mark_chose = false
                                    el.open = false

                                    if(!el.staff) return false

                                    el.staff.forEach(child=>{
                                        child.mark_chose = false
                                    })
                            })

                        }else{
                            if(!item.staff) return false
                            
                            item.staff.forEach(child=>{
                                child.mark_chose = false
                            })
                        }

                    })
            });

               if(that.arr.length){
                   that.list  = that.arr
               }else{
                   that.list = datas
               }

               console.log('获取数据',that.list)
            })

        },
        methods: {
            selectOffices(item,index,data,data2){ //选中部门

                if(item.subOffice.length){
                    item.mark_chose = true
                    return false;
                }
                this.perso_data = item.staff
                
                this.baseData = item
                this.baseData2 = data
                this.baseData3 = data2

               console.log('选中部门数据',this.list)


            },
            reset(){//重置数据
                        for(let j=0;j<this.perso_data.length;j++){
                            this.perso_data[j].mark_chose = false;
                            for(let i=0;i<this.choose_data.length;i++){
                                if(this.choose_data[i].userId==this.perso_data[j].userId){
                                    this.perso_data[j].mark_chose = true;
                                }
                        }

                    }

            },
            pitch_on(item,index){ //选中某人 
                
                item.mark_chose = !item.mark_chose

                if(!item.mark_chose){
                    this.baseData.mark_chose= this.baseData.mark_chose?false:this.baseData.mark_chose;

                    if(this.baseData2.mark_chose){
                        this.baseData2.mark_chose =false
                        this.for(this.baseData2,this.baseData2.mark_chose)
                    }

                    if(this.baseData3&&this.baseData3.mark_chose){
                        this.baseData3.mark_chose =false
                        this.for(this.baseData3,this.baseData3.mark_chose)
                    }
                }

               console.log('选中某人数据',this.list)

            },
            scroll(){

                let choose_width = this.$refs.choose.offsetWidth
                let choose_list_width = (this.choose_data.length*70)
                this.$refs.choose_list.style.width = choose_list_width+'px'

                if(choose_list_width>choose_width){
                   this.$refs.scroll_line.style.width = (choose_width/choose_list_width).toFixed(3)*choose_width +'px'
                }else{
                    this.$refs.scroll_line.style.width = 0+'px'
                }
            },
            remove(item,index){//删除选中人员
                this.translate()
                this.choose_data.splice(index,1)

                this.perso_data.forEach(el=>{
                    if(el.userId==item.userId){
                        el.mark_chose=false;
                    }
                })
                this.scroll()
            },
            for(item,flag){
                
                if(item.subOffice&&item.subOffice.length!=0){
                    let arr = item.subOffice
                    for(let i=0;i<arr.length;i++){
                        arr[i].mark_chose = flag;
                        if(arr[i].subOffice.length!=0||arr[i].staff.length!=0){
                            this.for(arr[i],flag)
                        }
                    }
                }else if(item.staff&&item.staff.length!=0){
                    let arr = item.staff
                    for(let i=0;i<arr.length;i++){
                        arr[i].mark_chose = flag;
                    }
                }

               console.log('循环数据',this.list)

            },
            chose(item){
                    item.mark_chose = !item.mark_chose
                    this.for(item,item.mark_chose);
                   console.log('选中数据',this.list)
            },
            confirm(){//确认按钮
                console.log(this.list)
                this.$emit('choose',this.list)
            },
            mouse_move(e){
                console.log(e)
            },
            mouse_up(){
                this.isDown = false;
                 document.onmousemove = function(){
                     return false;
                 }
            },
            getLateX(el){
                let num = el.style.transform.slice(11,-3)
                return num?num:0
            }
        },

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

.address>>> .el-scrollbar__thumb{
    background-color #24b36b
}

.address>>> .el-scrollbar__wrap{
    overflow-x hidden;
}
.address>>> .is-vertical{
    // background-color: rgba(144,147,153,.3);
}

 .address>>> .el-button--success{
    background-color: #24b36b;
    width 120px;

    &:hover{
        background-color: #2fbd76;
    }
  }

  .address>>> .el-button--info{
    width 120px;
  }

    .address{
        position: fixed;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
        overflow: auto;
        background-color: rgba(0,0,0,0.2)
        z-index 9999
        user-select none


        &-title{
            text-align center;
            height 45px;
            line-height 45px;
            font-size 20px
            border-bottom 1px solid #b6bcc6;
            background-color #dadde3;
        }

        &-main{
            background-color #fff
            height 450px;
            overflow auto 
            display flex
            border-bottom 1px solid #ccc;
        }

        &-personnel{
            width 350px;
            border-left 1px solid #ccc;
            box-shadow 3px 0px 5px 0px rgba(0,0,0,0.1) inset

            .personnel-item{
                display flex
                height 60px
                line-height 60px;
                border-bottom 1px solid #ccc
                padding-left 30px;
                font-size 14px;
                cursor pointer
            }

            .headImg{
                margin-right 10px;

                img{
                    height 42px;
                    width 42px;
                    border-radius 50%;
                    margin-top: 10px;
                }
            }

            .selectImg{
                margin-right 15px;

                img{
                    margin-top 25px;
                    cursor pointer
                }
            }
        }

        &-organization{
            width 100%;
            height 100%;
            flex: 1;

            .organ_item{
                display flex
                height 60px;
                line-height 60px;
                border-bottom 1px solid #ccc
                padding-left 15px;
                cursor pointer
            }

            .active{
                color #24b36b;
            }

            
            .department_cont:first-child{
                border-top 1px solid #fff
            }

            .department_cont{
                display flex;
                line-height 40px;
                padding-left 30px;
                border-bottom 1px solid #fff
                border-top 1px solid #fff

                &:hover{
                    cursor pointer
                    background-color #f5f5f5
                }
            }

            .dep_active{
                color #24b36b;
            }

            .organ_img{

                svg{
                    width:16px;
                    height:16px;
                    margin-right:15px;
                }
            }

            .organ_icon{
                margin-left 12px;
            }
        }
    }

    .nopersonnel{
        color:#999;
        text-align:center;
        margin-top:150px;
    }
    

    .cont{
        width 765px;
        max-height 640px;
        position absolute;
        top 0
        left 0
        right 0
        bottom 0
        margin auto 
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

    .footer{
        background-color #dadde3;

        &_btn{
            text-align center
            height 80px;

            button{
                margin-top: 20px;
            }
        }

        .pitchOn_list{
            position relative
            height 100px;
            margin 0 30px;
            display:flex;
            justify-content:space-between;


            button{
                margin-top:27px;
            }
        }
    }

    .profileImg{
        height 42px;
        width 42px;
        border-radius 50%;
        user-select none;
        -webkit-user-select none;
    }

    .choose{
        flex 1;
        margin-right:20px;
        overflow hidden
        position relative;

        .scroll_line{
            width:0px;
            height:3px;
            background-color:#24b36b;
            cursor pointer;

            &:active{
                cursor pointer;
            }
        }

        .img_left,.img_right{
            position:absolute;
            top:0;
            z-index:1;
            height:100%;
        }

        .img_left{
            left:-20px;
        }
        .img_right{
            right:-20px;
            transform: rotate(180deg);
        }
    }

    .choose_list{
        overflow hidden
        margin-bottom:5px;

        &:active{
                cursor pointer;
        }
    }

    .choose_item{
        width 70px
        height 70px
        float left
        text-align center
        position relative
        margin-top 15px;


        svg{
          position absolute 
          right 5px
          top -2px
          cursor pointer
      }
    }

    // .footer-scrollbar >>>.is-horizontal{
    //     background-color #ccc;
    //     height 1px;
    // }

    .footer-scrollbar>>>.default-scrollbar__view{
        width 20000px;
    }

    // .footer-scrollbar>>>.el-scrollbar__bar.is-horizontal>div{
    //     height:3px;
    // }

</style>