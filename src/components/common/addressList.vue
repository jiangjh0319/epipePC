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

                                <addressTemplate
                                v-if="item.open"
                                :list="item.offices"
                                v-on:select_dep="select_depart"
                                >
                                </addressTemplate>
                                <!-- <div v-if="item.open">
                                    <div v-for="(dep,ind) in item.offices" :key="dep.id" :class="dep.open?'dep_active department':'department'" @click.stop="selectOffices(dep,ind)">
                                       <p >{{dep.name}}</p>
                                        <div class="organ_icon" v-show="dep.open">
                                            <svg  class="icon" aria-hidden="false">
                                                <use xlink:href="#icon-sanjiao"></use>
                                            </svg>
                                        </div>
                                    </div>
                                </div> -->
                             </div>

                        </el-scrollbar>

                    </div>


                    <div class="address-personnel">
                        <el-scrollbar class="default-scrollbar" wrap-class="default-scrollbar__wrap" view-class="default-scrollbar__view" :native="false">
                            <div class="search">
                                <el-input v-model="userName" placeholder="搜索联系人"></el-input>
                                <el-button type="primary" @click="search" plain>搜索</el-button>
                            </div>

                            <div v-for="(item,index) in perso_data" class="personnel-item" :key="index" @click="pitch_on(item,index)">
                                <div class="selectI1mg">
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
                             <el-button type="success" @click="confirm" v-if="choose_data.length">确定</el-button>
                             <el-button type="info" disabled  v-else>确定</el-button>
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

      import addressTemplate  from '../../components/common/address_template.vue'

    export default {
        data() {
            return {
                list:[],
                perso_data:[],
                choose_data:[],
                isDown:false,
                userName:'',
            }
        },
        components:{
            addressTemplate,
        },
        props:['show','types','receivers','approvers','other','showGroup','personnels','isMore'],
        watch:{
            show:function(){
                if(this.show){
                    document.querySelector('#app').style.overflowY='hidden'
                }else{
                    document.querySelector('#app').style.overflowY='auto'
                } 
            },
            types:function(){
                if(this.types.indexOf('app')==0){
                    this.choose_data = JSON.parse(JSON.stringify(this.approvers))
                    
                }else if(this.types.indexOf('rec')==0){
                    this.choose_data = JSON.parse(JSON.stringify(this.receivers)) 
                }else if(this.types.indexOf('per')==0) {
                    this.choose_data = JSON.parse(JSON.stringify(this.personnels))
                }else if(this.types.indexOf('other')==0){
                    this.choose_data = JSON.parse(JSON.stringify(this.approvers))
                }

                this.perso_data= [];
                this.getData()

                this.reset()
                setTimeout(res=>{
                    this.scroll()
                },100)
            }
        },
        created(){
            this.getData();
            console.log(11)
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

                this.reset();

            },
            dataInit(data){
                data.forEach(item => {
                    item.open = false;
                    if(item.subOffice.length){
                        this.dataInit(item.subOffice)
                    }

                    if(item.staff.length){
                        let arr = item.staff
                        arr.forEach(el=>{
                            el.mark_chose = false
                        })
                    }
                })
            },
            chose_people(data,id,val){
                for(let i=0;i<data.length;i++){
                    if(data[i].subOffice.length){
                        this.chose_people(data[i].subOffice,id,val)
                    }
                    if(data[i].staff.length){
                        let arr = data[i].staff
                        for(let j=0;j<arr.length;j++){
                            if(arr[j].userId==id){
                                arr[j].mark_chose = val;
                                return
                            }
                        }
                    }
                }
            },
            select_depart(item,index){
                // console.log('iiiooooo',item)
                let that = this;
                this.perso_data = [];
                if(item.second===2){
                    console.log(1111)
                    item.open = true

                    // this.perso_data = item.staff;
                    if(item.length>0){
                        item.forEach(val =>{
                            
                            val.open = true
                            // console.log(val,'llllllddddd')
                            if(val.subOffice.length>0){
                                val.subOffice.forEach(v=>{
                                    // console.log(v,'88888pppp')
                                    if(v.subOffice.length>0){
                                        v.open = true;
                                    }else{
                                          console.log(v.staff,'sta')
                                          this.perso_data = this.perso_data.concat(v.staff)
                                    }
                                })
                            }
                        })
                    }
                    // item.subOffice.forEach(val=>{
                    //     val.open = true
                    //     // console.log(val.subOffice,'ppppp')
                    //     val.subOffice.forEach(v=>{
                    //         if(v.subOffice.length==0){
                    //             that.perso_data = v.staff;
                    //         }
                    //     })
                    //     // this.perso_data = val.staff;
                    // })
                    // setTimeout(() => {
                    //     item.open = false;
                    // }, 3500);
                }else{
                    console.log(2222)
                    console.log(item,'222222')
                    item.open=!item.open
                     this.list.forEach(el=>{ 
                        this.perso_data = item.staff
                        this.getStaff(item)
                        // that.setFalse(el) 
                    })
                }
             
             
               
                
            },
            setFalse(data){
                let that = this;
                data.open = false;
            },
            setTrue(data){
                data.open = false;
                if(data.subOffice.length){
                    data.subOffice.forEach(item=>{
                    this.setFalse(item)
                    })
                }
            },
            getStaff(item){
                if(item.staff.length){
                    this.perso_data = this.perso_data.concat(item.staff)
                }

                if(item.subOffice.length){
                    for (let index = 0; index < item.subOffice.length; index++) {
                            this.getStaff(item.subOffice[index])
                    }
                }
            },
            getData(){
                let that = this;
                this.axios.get('/organ/addressbook',{
                    params:{
                        showGroup : !this.showGroup,
                    }

                }).then( (res)=>{
                let datas = res.data.b.data
                    console.log(datas,'数据')
                    datas.forEach(item=>{
                        item.open = false;
                        that.dataInit(item.offices, that.choose_data)

                        that.choose_data.forEach(el=>{
                             that.chose_people(item.offices,el.userId,true)
                        })
                    })

                that.list = datas
                })
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
            search(){
                this.axios.get('/work/report/select/receiver',{
                    params:{
                        name : this.userName,
                    }
                }).then(res=>{
                    let arr = res.data.b.data;

                    this.perso_data = arr;

                    arr.forEach(el=>{
                          
                        this.choose_data.forEach(item=>{
                            if(el.userId==item.userId){
                                el.mark_chose = true;
                            }  
                        })
                    })

                })
            },
            pitch_on(item,index){ //选中某人 
                
                item.mark_chose = !item.mark_chose
                this.perso_data[index].mark_chose = item.mark_chose
                
                if(item.mark_chose){
                    this.choose_data.push(item)
                }else{
                    for(let i=0;i<this.choose_data.length;i++){
                        if(this.choose_data[i].userId==item.userId){
                            this.choose_data.splice(i,1)
                            this.translate()
                        }
                    }
                }

                if(!this.isMore){
                    this.$emit('choose',this.choose_data)
                    // return                    
                }

                this.scroll()

            },
            scroll(){
                let choose_width = this.$refs.choose.offsetWidth
                console.log(choose_width)
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
            close(type){
                this.choose_data = [];
                this.perso_data = [];
                this.userName = '';
                this.reset()
                this.$emit('close')
            },
            confirm(){//确认按钮
                this.$emit('choose',this.choose_data)
                this.choose_data=[]
            },
            translate(){
                let choose_width = this.$refs.choose.offsetWidth //盒子长度
                let scroll_line_width = this.$refs.scroll_line.offsetWidth //滚动条长度
                
                if(scroll_line_width==0) return false;
                let choose_list_width = this.$refs.choose_list.offsetWidth //列表长度
                let line_max = choose_width - scroll_line_width //滚动条可移动最大距离
                let list_max = choose_list_width - choose_width //列表可移动最大距离
                let prop = (list_max/line_max).toFixed(3) //移动比例
                let line_late = (this.getLateX(this.$refs.scroll_line)-0) //滚动条已经存在的 位移距离
                let list_late = -(this.getLateX(this.$refs.choose_list)-0) //列表已经存在的 位移距离

                let nums = list_late-70<0?0:list_late-70;

                let num = line_late - (70/prop);
                num= num <0?0:num;
                // console.log(prop)
                // console.log((70*prop)-70)
                this.$refs.choose_list.style.transform="translateX(-"+nums+"px)";
                this.$refs.scroll_line.style.transform="translateX("+num+"px)";


            },
            mouse_down(e,type){
                this.isDown = true;
                let beginX = e.pageX
                let endX = 0,that = this;

                let choose_width = this.$refs.choose.offsetWidth //盒子长度
                let scroll_line_width = this.$refs.scroll_line.offsetWidth //滚动条长度
                let choose_list_width = this.$refs.choose_list.offsetWidth //列表长度

                let line_max = choose_width - scroll_line_width //滚动条可移动最大距离
                let list_max = choose_list_width - choose_width //列表可移动最大距离
                let prop = (list_max/line_max).toFixed(3) //移动比例
                let line_late = (this.getLateX(this.$refs.scroll_line)-0) //滚动条已经存在的 位移距离

                let list_late = -(this.getLateX(this.$refs.choose_list)-0) //列表已经存在的 位移距离


                document.onmousemove = function(ev){
                    endX = ev.pageX
                    var distance,line

                    if(endX-beginX>0){
                        //往左滑
                        if(type==2){
                            // console.log('鼠标按下向左')
                             distance = line_late - Math.abs(endX-beginX)
                             line=distance<0?0:distance
                            
                            // that.$refs.choose_list.style.transform="translateX(-"+line*prop+"px)";
                            // that.$refs.scroll_line.style.transform="translateX("+line+"px)";
                        }else{
                             distance = Math.abs(endX-beginX)+line_late
                             line = distance>line_max?line_max:distance;
                            // that.$refs.choose_list.style.transform="translateX(-"+line*prop+"px)";
                            // that.$refs.scroll_line.style.transform="translateX("+line+"px)";
                        }
                         that.$refs.choose_list.style.transform="translateX(-"+line*prop+"px)";
                            that.$refs.scroll_line.style.transform="translateX("+line+"px)";
                        // that.$refs.choose_list.style.transform="translateX(-"+line*prop+"px)";
                        // that.$refs.scroll_line.style.transform="translateX("+line+"px)";
                    }else{
                     

                        if(type==2){
                             distance = Math.abs(endX-beginX)+line_late
                             line = distance>line_max?line_max:distance;
                        }else{
                             distance = line_late - Math.abs(endX-beginX)
                             line=distance<0?0:distance
                            // that.$refs.choose_list.style.transform="translateX("+line*prop+"px)";
                            // that.$refs.scroll_line.style.transform="translateX("+line+"px)";
                        }
                        // let line = line_max-distance<0?0:distance
                        that.$refs.choose_list.style.transform="translateX(-"+line*prop+"px)";
                        that.$refs.scroll_line.style.transform="translateX("+line+"px)";
                    }
                }
                
                document.onmouseup = function(){
                        document.onmousemove = function(ev){
                            return false;
                        }

                        return false;
                }
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


/deep/.el-input{
    width:auto;
    margin-right:15px;
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

            .el-button--primary.is-plain:focus{
                background #ecf5ff;
                color:#409EFF;
            }

            .headImg{
                margin 0 15px;

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

            
            .department:first-child{
                border-top 1px solid #fff
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

    .search{
        padding:10px;
        border-bottom:1px solid #e6e6e6;
    }

</style>