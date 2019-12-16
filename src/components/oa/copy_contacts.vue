<template>
    <div>
         <el-form-item  label="抄送人">
                    <span v-if="isShow!='false'">审批通过后抄送相关人</span>
                    <div class="approver-list">
                        <div class="approver-li" v-for="(item,index) in receivers_data" :key="index">
                            <div class="user-info">
                                <svg style="width:15px;height:15px;" class="icon" aria-hidden="false" @click="remove(1,index)">
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
                            <div class="approver-add"  @click="selectOpen('rec')">
                                <svg style="width:50px;height:50px;" class="icon" aria-hidden="false">
                                    <use xlink:href="#icon-tianjiarenyuan"></use>
                                </svg>
                                <div>添加</div>
                            </div>
                        </div>
                    </div>
                </el-form-item>
    </div>
</template>

<script>
    export default {
        data() {
            return {
            }
        },
        props:['receivers_data','isShow'],
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

<style lang="stylus" scoped>

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

</style>