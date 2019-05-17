<template>
    <div>
         <div class="title">
           <svg style="width: 24px;height:24px" class="icon" aria-hidden="false">
                <use :href="'#icon-'+icon"></use>
            </svg>
            
            {{title}}
        </div>
    </div>
</template>

<script>
    export default {
        data() {
            return {
            }
        },
        props:['title','icon']
    }
</script>

<style lang="stylus" scoped>
    .title{
        font-size 20px
        border-bottom 1px solid #cccccc
        color #24b36b
        line-height 44px

        svg{
            margin-right 6px;
            position relative
            top 4px
        }
    }
</style>