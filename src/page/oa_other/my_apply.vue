<template>
    <div class="main">
        <HeadTitle
            title="我的申请"
            icon='qingjia'
        ></HeadTitle>

        <div>
            <ListTemplate :data="datas" :type=3></ListTemplate>
        </div>
    </div>
</template>

<script>
    import HeadTitle from './../../components/common/headTitle.vue'
    import ListTemplate from './../../components/oa/listTemplate.vue'
    export default {
        data() {
            return {
                datas:[],
            }
        },
         components:{
            HeadTitle,
            ListTemplate
        },
        created(){
            let that = this;
            this.axios.get('/work/my/apply/list').then(function(res){
                        that.datas = that.dataFor(res.data.b.data);
                 })
        },
        methods: {
            dataFor(arr){
                let data = [],res=[];
                for(let i= 0;i<arr.length;i++){
                    let obj = {};
                    for(let j = 0;j<arr[i].extend.length;j++){
                        obj[arr[i].extend[j].key] = arr[i].extend[j].value
                    }
                    data.push(obj)
                }
                return data;
            },
        },
    }
</script>

<style lang="stylus" scoped>

     .main{
        padding 30px
    }

</style>