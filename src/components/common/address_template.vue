<template>
    <div style="padding-left:20px;">
        <div v-for="(dep,ind) in list"  :key="dep.id">
            <div :class="dep.open?'dep_active department':'department'" @click.stop="selectOffices(dep,ind)">
                <p >{{dep.name}}</p>
                <div :class="dep.open?'':'organ_icon'" v-show="dep.open&&dep.staff.length||dep.subOffice.length">
                    <svg  class="icon" aria-hidden="false">
                        <use xlink:href="#icon-sanjiao"></use>
                    </svg>
                </div>
            </div>
            <div v-if="dep.subOffice.length">
                <addressTemplate
                v-show="dep.open"
                :list="dep.subOffice"
                v-on:select_dep="select_depart"
                >
                </addressTemplate>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name:'addressTemplate',
        data() {
            return {
            }
        },
        props:['list'],
        methods:{
            selectOffices(item){
                this.$emit('select_dep',item)
            },
            select_depart(item){
                this.$emit('select_dep',item)
            }
        }
    }
</script>

<style lang="stylus" scoped>

.department{
    display flex;
    line-height 40px;
    padding-left  100px;
    border-bottom 1px solid #eee
    border-top 1px solid #fff
    margin-left: -20px;

    &:hover{
        cursor pointer
        background-color #f5f5f5
    }

    p{
        margin-right 15px;
    }

    .organ_icon{
        transform rotate(-90deg)
    }
}

</style>