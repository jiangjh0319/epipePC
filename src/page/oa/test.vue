<template>
    <div>
      <el-tree
        :data="list"
        :props="defaultProps"
        accordion
        @node-click="handleNodeClick">
        </el-tree>
    </div>
</template>
<script>
  export default {
    data() {
      return {
        data: [{
          label: '一级 1',
          children: [{
            label: '二级 1-1',
            children: [{
              label: '三级 1-1-1'
            }]
          }]
        }, {
          label: '一级 2',
          children: [{
            label: '二级 2-1',
            children: [{
              label: '三级 2-1-1'
            }]
          }, {
            label: '二级 2-2',
            children: [{
              label: '三级 2-2-1'
            }]
          }]
        }, {
          label: '一级 3',
          children: [{
            label: '二级 3-1',
            children: [{
              label: '三级 3-1-1'
            }]
          }, {
            label: '二级 3-2',
            children: [{
              label: '三级 3-2-1'
            }]
          }]
        }],
        defaultProps: {
          children: 'offices',
          label: 'name'
        },
        list:[]
      };
    },
    methods: {
      handleNodeClick(data) {
        console.log(data);
        if(data.subOffice){
            if(data.subOffice.length>0){
                console.log(22222)
                data.subOffice.forEach(ui=>{
                    this.$set(ui,'offices',ui.subOffice)
                    return ui
                })
            }else{
                console.log(6666777)
               
                    this.$set(data,'offices',data.staff)
                    return data
            
            }
        }
      },
    getData(){
            let that = this;
            this.axios.get('/organ/addressbook',{
                params:{
                    showGroup : true,
                }

            }).then( (res)=>{
            let datas = res.data.b.data
                // console.log(datas,'数据')
                datas.forEach(item=>{
                    // console.log(item,'item')
                    item.offices.forEach(val=>{
                        console.log(val,'val')
                        if(val.subOffice.length>0){
                            // console.log(6666)
                            this.$set(val,'offices',val.subOffice)
                            return val
                        }else{
                            this.$set(val,'offices',val.staff)
                            return val
                        }
                    })
                })

            that.list = datas
            })
        },
    },
    created(){
        this.getData()
    }
  };
</script>
<style lang="stylus" scoped>

</style>