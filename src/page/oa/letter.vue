<template>
    <section>
        <HeadTitle
            title="请示函"
            icon='qingshihan'
        ></HeadTitle>
        <div style="padding-top:30px;">
            <el-form ref="form" :rules="rules" :model="form" label-width="100px">
                <el-form-item label="主题" > 
                    <el-input v-model="form.them" placeholder="请输入主题"></el-input>
                </el-form-item>

                <el-form-item class="textareaBox" label="请假事由" >
                        <el-input  type="textarea" v-model="form.desc" maxlength="150" placeholder="请输入请假事由">
                        </el-input>
                        <span class="textNum">{{wordCount}}/1000</span>
                </el-form-item>

                <File :accessory="accessory"
                    v-on:remove="removeFile"
                >
                </File>

            </el-form>

        </div>
    </section>
</template>

<script>
    import File from './../../components/oa/file.vue'
    import HeadTitle from './../../components/common/headTitle.vue'
    export default {
        data() {
            return {
                wordCount:0,
                accessory:[],
                form:{
                    them:'1',
                    desc:''
                },
                rules:{

                }
            }
        },
        components:{
            HeadTitle,
            File
        },
        methods:{
            removeFile(index){
                
            }
        }
    }
</script>

<style lang="stylus" scoped>
 @import "./../../style/oa.styl"

section {
    padding 30px;
}

</style>