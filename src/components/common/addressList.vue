<template>
    <div class="address" v-if="show" @click.stop="close(1)">
            <div class="cont" @click.stop="">
                <div class="address-title">
                    选择联系人

                    <div class="close">
                        <svg  class="icon" aria-hidden="false">
                            <use xlink:href="#icon-x"></use>
                        </svg>
                    </div>
                </div>

                <div class="address-main">

                    <div class="address-organization">
                        <el-scrollbar class="default-scrollbar" wrap-class="default-scrollbar__wrap" view-class="default-scrollbar__view" :native="false">
                            <div v-for="item in list" :key="item.id" @click="item.open=!item.open">
                                <div class="organ_item">
                                    <div class="organ_img">
                                        <img src="./../../assets/10-2.png" v-if="!item.open"/>
                                        <img src="./../../assets/10.png" v-else/>
                                    </div>
                                    <p :class="item.open?'active':''">{{item.name}}</p>
                                    
                                    <div class="organ_icon" v-if="item.open">
                                        <svg  class="icon" aria-hidden="false">
                                            <use xlink:href="#icon-sanjiao"></use>
                                        </svg>
                                    </div>
                                </div>
                                <div v-if="item.open">
                                    <div v-for="(dep,ind) in item.offices" :key="dep.id" :class="dep.open?'dep_active department':'department'" @click.stop="selectOffices(dep,ind)">
                                       <p >{{dep.name}}</p>
                                        <div class="organ_icon" v-show="dep.open">
                                            <svg  class="icon" aria-hidden="false">
                                                <use xlink:href="#icon-sanjiao"></use>
                                            </svg>
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
                        </el-scrollbar>
                    </div>
                </div>

                <!-- 底部 -->
                <div class="footer">
                    <div class="pitchOn_list">
                        <el-scrollbar class="default-scrollbar footer-scrollbar" wrap-class="default-scrollbar__wrap"  view-class="default-scrollbar__view" :native="false">
                            <div class="choose">
                                <div v-for="(item,index) in choose_data" class="choose_item" :key="item.userId">
                                    <svg style="width:15px;height:15px;" class="icon" aria-hidden="false" @click="remove(item,index)">
                                        <use xlink:href="#icon-shanchu"></use>
                                    </svg>
                                    <img :src="item.profileImg" class="profileImg">
                                    <p>{{item.name}}</p>
                                </div>
                            </div>
                        </el-scrollbar>
                    </div>
                    <div class="footer_btn">
                        <el-button type="success" @click="confirm">确定</el-button>
                    </div>
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
            }
        },
        props:['show','types','receivers','approvers'],
        watch:{
            show:function(){
                if(this.show){
                    document.querySelector('#app').style.overflowY='hidden'
                }else{
                    document.querySelector('#app').style.overflowY='auto'
                } 
            },
            types:function(){
                console.log(this.types)
                if(this.types=='0'){
                    this.choose_data =  this.approvers
                }else{
                    this.choose_data =  this.receivers
                } 
            }
        },
        created(){
            let that = this;
            this.axios.get('/organ/addressbook',{
                params:{
                showGroup : true,
                }

            }).then(function (res) {
               let datas = res.data.b.data

                for (let i = 0; i < datas.length; i++) {
                    datas[i].open = false;
                    for (let j = 0; j < datas[i].offices.length; j++) {
                        datas[i].offices[j].open = false;

                        for (let a = 0; a < datas[i].offices[j].staff.length; a++) {
                            
                          datas[i].offices[j].staff[a].mark_chose = false

                          for (let b = 0; b <that.choose_data.length; b++) {
                              if (that.choose_data[b].userId == datas[i].offices[j].staff[a].userId) {
                                    datas[i].offices[j].staff[a].mark_chose = true
                                }
                          }
                      }
                    }
                }

               that.list = datas
            })
        },
        methods: {
            selectOffices(item,index){ //选中部门

                this.list.forEach(element => {
                    element.offices.forEach(el=>{
                        el.open = false;
                    })
                });

                item.open = true;
                this.perso_data = item.staff
            },
            pitch_on(item,index){
                item.mark_chose = !item.mark_chose
                this.perso_data[index].mark_chose = item.mark_chose
                
                if(item.mark_chose){
                    this.choose_data.push(item)
                }else{
                    for(let i=0;i<this.pitch_on.length;i++){
                        if(this.pitch_on.userId==item.userId){
                            this.pitch_on.splice(i,1)
                        }
                    }
                }
            },
            remove(item,index){//删除选中人员
                this.choose_data.splice(index,1)

                this.perso_data.forEach(el=>{
                    if(el.userId==item.userId){
                        el.mark_chose=false;
                    }
                })
            },
            close(){
                this.$emit('close')
            },
            confirm(){//确认按钮
                this.$emit('choose',this.choose_data)
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
                padding-left 60px;
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
                padding-left 30px;
                cursor pointer
            }

            .active{
                color #24b36b;
            }

            .department{
                display flex;
                line-height 40px;
                padding-left  80px;
                border-bottom 1px solid #fff
                border-top 1px solid #fff
                

                &:hover{
                    cursor pointer
                    background-color #f5f5f5
                }

                .organ_icon{
                    transform rotate(-90deg)
                }
            }

            .dep_active{
                color #24b36b;
                background-color #f5f5f5
                border-bottom 1px solid #ccc
                border-top 1px solid #ccc
            }

            .organ_img{
                margin-right 20px;

                img{
                    margin-top 20px;
                }
            }

            .organ_icon{
                margin-left 12px;
            }
        }
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
            height 95px;
            margin 0 30px;

            &:after{
                content ''
                position absolute
                bottom 2px;
                height 1px;
                width:100%;
                background-color:#ccc;

            }
        }
    }

    .profileImg{
        height 42px;
        width 42px;
        border-radius 50%;
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

    .footer-scrollbar >>>.is-horizontal{
        background-color #ccc;
        height 1px;
    }
</style>