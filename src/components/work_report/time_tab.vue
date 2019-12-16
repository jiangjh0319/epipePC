<style scoped lang="stylus">
  .top_ul {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items center
    width 250px;
  }

  .top_ul > li:first-child:active {
    opacity 0.3
  }

  .top_ul > li:last-child:active {
    opacity 0.3
  }

  .top_ul li {
    height: 40px;
    line-height 40px;
    display flex
    justify-content: center;
    align-items center
    text-align: center;
    cursor pointer;
  }

  .top_ul .day_li {
    // flex:1;
    color: #333;
    font-size: 16px;
    cursor:default;
  }

  li svg {
    width: 16px;
    height: 16px
  }

  ul li:last-child svg {
    transform: rotate(180deg)
  }
</style>
<template>
  <section>
    <ul class="top_ul">
      <li  @click="goleft">
        <svg :style="{color: font_color}" class="icon" aria-hidden="false">
          <use xlink:href="#icon-zuoyoujiantou"></use>
        </svg>
      </li>
      <li v-if="time_type!='month'"  class="day_li" v-html="year_time">

      <li v-if="time_type=='day'" class="day_li" v-html="day_top_time">
      <li v-if="time_type=='week'" class="day_li">
        {{start_time}} — {{end_time}}
      </li>
      <li v-if="time_type=='month'" class="day_li">
        {{day_month_time}}
      </li>
      <li  @click="goright">
        <svg :style="{color: font_color}" class="icon" aria-hidden="false">
          <use xlink:href="#icon-zuoyoujiantou"></use>
        </svg>
      </li>
    </ul>
  </section>
</template>
<script>
  import Util  from '../../js/Util.js'
  function WeekFormat(date, type, time_type) { //封装一个方法点击左右 改变头部那个时间的显示
    let now = new Date(date);
    let num = now.getDay()
    if (time_type == "day") {  //日报的情况
      let obj = {0: "天", 1: "一", 2: "二", 3: "三", 4: "四", 5: "五", 6: "六"}
      let lw = (now.getMonth() + 1) + "月" + now.getDate() + "日 星期" + obj[num]
      return lw
    } else if (time_type == "week") {   //周报的情况
      if (num == 0) {
        num = 7
      }
      if (type == "add") {
        let lw = new Date(now.getTime() + 1000 * 60 * 60 * 24 * (7 - num));
        return lw
      } else if (type == "reduce") {
        let lw = new Date(now.getTime() - 1000 * 60 * 60 * 24 * (num - 1));
        return lw
      }
    } else if (time_type == "month") {  //月报的情况

    }

  }
  export default {
    data () {
      return {
        day_top_time: '', //头部日报的时间
        day_top_time_all: '', //头部时间不显示 可以转化的格式
        start_time: "", //每周的开始时间
        end_time: "", //每周的结束时间
        day_month_time: "",
        year_time:'',
      }
    },
    props: [
      'time_type', "font_color",'reportTime', 'time','isClick'
    ],
    methods: {
      goleft(){ //向左点击
        let that = this;
        if(this.isClick){
          return false;
        }

        if (this.time_type == "day") {
          let one_month_time = new Date(that.Util.GetPreMonth(that.Util.getNewTime(new Date()))).getTime()
          console.log(one_month_time)
          let mydate = that.day_top_time_all
          let one_month_time_two = new Date(mydate.getTime() - 24 * 60 * 60 * 1000)
          if (one_month_time_two <= one_month_time) {
            this.$alert("最多允许查看一个月以内记录")
          } else {
            that.day_top_time_all = new Date(mydate.getTime() - 24 * 60 * 60 * 1000)
            that.day_top_time = WeekFormat(that.day_top_time_all, 0, "day")
            that.$emit('data_time', that.Util.getNewTime(that.day_top_time_all), that.day_top_time);
          }
        } else if (this.time_type == "week") {
          console.log(that.Util.GetPreMonth(that.Util.getNewTime(new Date())))
          let one_month_time = new Date(that.Util.GetPreMonth(that.Util.getNewTime(new Date()))).getTime()
          let mydate = that.day_top_time_all
          let one_month_time_two = new Date(new Date(mydate.getTime() - 24 * 60 * 60 * 1000 * 7))
          if (one_month_time_two.getTime() <= one_month_time) {
            this.$alert("最多允许查看一个月以内记录")
          } else {
            that.day_top_time_all = new Date(mydate.getTime() - 24 * 60 * 60 * 1000 * 7)
            console.log(WeekFormat(that.day_top_time_all, "reduce", this.time_type))
            let start_time_forparam = that.Util.getNewTime(WeekFormat(that.day_top_time_all, "reduce", this.time_type))
            console.log(start_time_forparam)
            this.start_time = that.Util.getNewTime(WeekFormat(that.day_top_time_all, "reduce", this.time_type), "月日")
            this.end_time = that.Util.getNewTime(WeekFormat(that.day_top_time_all, "add", this.time_type), "月日")
            console.log(that.Util.getNewTime(start_time_forparam))
            console.log("1")
            that.$emit('data_time', start_time_forparam, this.start_time + " — " + this.end_time);
          }
        } else if (this.time_type == "month") {
          let one_month_time = new Date().getTime()
          let mydate = that.day_top_time_all
          let one_month_time_two = new Date(new Date(new Date(mydate).getTime() + 24 * 60 * 60 * 1000 * 365))
          if (one_month_time >= one_month_time_two.getTime()) {
            this.$alert("最多允许查看一年以内记录")
          } else {
            that.day_top_time_all = that.Util.GetPreMonth(that.Util.getNewTime(new Date(mydate)))
            that.day_month_time = that.Util.getNewTime(new Date(that.day_top_time_all), "年月")
            that.$emit('data_time', that.Util.getNewTime(that.day_top_time_all, "当月第一天"), that.day_month_time);
          }
        }
      },
      goright(){ //向右点击
        if(this.isClick){
          return false;
        }
        let that = this;
        if (this.time_type == "day") {
          let one_month_time = new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 7).getTime()
          let mydate = that.day_top_time_all
          let one_month_time_two = new Date(mydate.getTime() + 24 * 60 * 60 * 1000).getTime()
          if (one_month_time <= one_month_time_two) {
            this.$alert("最多允许查看一周后记录")
          } else {
            that.day_top_time_all = new Date(mydate.getTime() + 24 * 60 * 60 * 1000)
            that.day_top_time = WeekFormat(that.day_top_time_all, 0, "day")
            that.$emit('data_time', that.Util.getNewTime(that.day_top_time_all), that.day_top_time);
          }
        } else if (this.time_type == "week") {
          let one_month_time = new Date(new Date().getTime() + 24 * 60 * 60 * 1000 * 7).getTime()
          let mydate = that.day_top_time_all
          let one_month_time_two = new Date(mydate.getTime() + 24 * 60 * 60 * 1000).getTime()
          if (one_month_time <= one_month_time_two) {
            this.$alert("最多允许查看一周后记录")
          } else {
            let one_month_time = new Date(that.Util.GetPreMonth(that.Util.getNewTime(new Date()))).getTime()
            let mydate = that.day_top_time_all
            that.day_top_time_all = new Date(mydate.getTime() + 24 * 60 * 60 * 1000 * 7)
            let start_time_forparam = that.Util.getNewTime(WeekFormat(that.day_top_time_all, "reduce", this.time_type))
            this.start_time = that.Util.getNewTime(WeekFormat(that.day_top_time_all, "reduce", this.time_type), "月日")
            this.end_time = that.Util.getNewTime(WeekFormat(that.day_top_time_all, "add", this.time_type), "月日")
            that.$emit('data_time', start_time_forparam, this.start_time + " — " + this.end_time);
          }
        } else if (this.time_type == "month") {
          let one_month_time = new Date().getTime()
          let mydate = that.day_top_time_all
          let one_month_time_two = new Date(new Date(new Date(mydate).getTime() - 24 * 60 * 60 * 1000 * 365))
          if (one_month_time < one_month_time_two.getTime()) {
            this.$alert("最多允许查看一年以内记录")
          } else {
            let mydate = that.day_top_time_all
            that.day_top_time_all = Util.GetNextMonth(that.Util.getNewTime(new Date(mydate)))
            that.day_month_time = that.Util.getNewTime(new Date(that.day_top_time_all), "年月")
            that.$emit('data_time', that.Util.getNewTime(that.day_top_time_all, "当月第一天"), that.day_month_time);
          }
        }
      }
    },
    mounted(){
      let that = this;
      let date = null

        if(this.time){
          date = new Date(this.time)
        }else{
          date = new Date()
        }

      if (that.time_type == "day") {
        that.day_top_time = WeekFormat(date, 0, "day")
        that.day_top_time_all = date
        that.year_time = that.day_top_time_all.getFullYear()+'年'
        that.$emit('data_time', that.Util.getNewTime(that.day_top_time_all), that.day_top_time);
      } else if (this.time_type == "week") {
        let start_time_forparam = that.Util.getNewTime(WeekFormat(new Date(this.reportTime), "reduce", this.time_type))
        this.start_time = that.Util.getNewTime(WeekFormat(new Date(this.reportTime), "reduce", this.time_type), "月日")
        this.end_time = that.Util.getNewTime(WeekFormat(new Date(this.reportTime), "add", this.time_type), "月日")
        that.day_top_time_all = new Date(this.reportTime)
        that.year_time = that.day_top_time_all.getFullYear()+'年'
        this.end_time = that.Util.getNewTime(WeekFormat(that.day_top_time_all, "add", this.time_type), "月日")
        that.$emit('data_time', start_time_forparam, this.start_time + " — " + this.end_time);
      } else if (this.time_type == "month") {
        that.day_month_time = that.Util.getNewTime(new Date(), "年月")
        that.day_top_time_all = new Date()
        that.year_time = that.day_top_time_all.getFullYear()+'年'
        that.$emit('data_time', that.Util.getNewTime(that.day_top_time_all, "当月第一天"), that.day_month_time);
      }
    }
  }
</script>
