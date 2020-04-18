<template>
    <div>
        <el-page-header @back="goBack" content="菜谱"></el-page-header>
        <img src="../../assets/menu_1.png"/><img src="../../assets/menu_2.png"/><img src="../../assets/menu_3.png"/>
    </div>
</template>

<script>
    export default {
        data() {
            return {
            }
        },
        methods:{
        goBack() {
                console.log('go back');
                history.back();
            }
        }
    }
</script>

<style lang="stylus" scoped>

div{
    padding-top 0.22rem;
}
/deep/ .el-page-header {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    line-height: 24px;
    padding: 10px;
    background-color: #C32B3E;
    color:#fff;
}
img{
    width 100%;
    display block;
}

</style>