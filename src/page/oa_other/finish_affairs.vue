<template>
    <div class="main">
        <HeadTitle
            title="已办事宜"
            icon='yiban'
        ></HeadTitle>

        <div>
            <ListTemplate :data="datas" :type=2 v-on:accomplish='accomplish'></ListTemplate>
            <InfiniteLoading spinner="bubbles" :on-infinite="onInfinite" ref="infiniteLoading">
                 <span slot="no-more" class="no-more">
                    暂无更多加载
                    </span>
                    <span slot="no-results" class="no-results">
                    暂无结果
                </span>
            </InfiniteLoading>
        </div>
    </div>
</template>

<script>
    import InfiniteLoading from 'vue-infinite-loading';
    import HeadTitle from './../../components/common/headTitle.vue'
    import ListTemplate from './../../components/oa/listTemplate.vue'
    export default {
        data() {
            return {
                datas:[],
                pageNo:1,
            }
        },
         components:{
            HeadTitle,
            ListTemplate,
            InfiniteLoading
        },
        created(){
            document.title = '已办事宜'
            this.getData()
        },
        methods: {
            getData(){
                this.axios.get('/work/complete/list').then(res=>{
                    this.datas = this.dataFor(res.data.b.data);
                })
            },
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
            accomplish(){
                this.getData()
            },
            onInfinite(){
               let that = this;
                //供需
                this.axios.get('/work/complete/list',{
                    params:{
                        pageNo:this.pageNo+1,
                    }
                }).then(function(res){
                        setTimeout(() => {
                                if (res.data.b.data.length == 0) {
                                    that.$refs.infiniteLoading.$emit('$InfiniteLoading:complete');
                                } else if (res.data.b.data) {
                                        let data = [];
                                        for(let i= 0;i<res.data.b.data.length;i++){
                                            let obj = {};
                                            for(let j = 0;j<res.data.b.data[i].extend.length;j++){
                                                obj[res.data.b.data[i].extend[j].key] = res.data.b.data[i].extend[j].value
                                            }
                                            data.push(obj)
                                        }

                                    that.datas = that.datas.concat(data)
                                    that.pageNo++;
                                    that.$refs.infiniteLoading.$emit('$InfiniteLoading:loaded');
                                }
                        }, 200);

                    }).catch(function (error) {
                        console.log(error);
                    });
            },
        },
    }
</script>

<style lang="stylus" scoped>

     .main{
        padding 30px
    }

</style>