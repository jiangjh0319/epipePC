<template>
    <div class="main">
         <HeadTitle
            title="月报"
            icon='yuebao'
        ></HeadTitle>
        <div class="content">
            <el-form ref="form" :rules="rules" :model="form" label-width="140px" v-if="!isDetails">
                <el-form-item class="textareaBox" label="时间" >
                    <div style="font-size:16px;" v-if="isUpdate">{{info.reportTimeStr}}</div>
                    <TimeTab v-else time_type="month" :reportTime='reportTime' :isClick="isUpdate" font_color="#609ef7" v-on:data_time="day_data_time"></TimeTab>
                </el-form-item>
                <el-form-item class="textareaBox" label="本工作总结" prop="summary">
                        <el-input type="textarea" :rows="6" class="textarea" v-model="form.summary" maxlength="1000" placeholder="请输入本月工作总结">
                        </el-input>
                        <span class="textNum">{{summaryCount}}/1000</span>
                </el-form-item>
                <el-form-item class="textareaBox" label="下月工作计划" prop="plan">
                        <el-input type="textarea" :rows="6" class="textarea" v-model="form.plan" maxlength="1000" placeholder="请输入下月工作计划">
                        </el-input>
                        <span class="textNum">{{planCount}}/1000</span>
                </el-form-item>
                <el-form-item class="textareaBox" label="备注" prop="remark">

                        <el-input  :rows="3" class="textarea"  type="textarea" v-model="form.remark" maxlength="40" placeholder="请输入备注">
                        </el-input>
                        <span class="textNum">{{remarkCount}}/40</span>
                </el-form-item>
                <File :accessory="accessory"
                    v-on:remove="removeFile"
                >
                </File>

                <Copy
                    :receivers_data='receivers_data'
                    v-on:selectOpen='selectOpen'
                    v-on:remove='remove'
                    isShow=false
                >
                </Copy>

            </el-form>

            <el-form  v-else :model="form" label-width="140px">
                <el-form-item class="textareaBox" label="时间" >
                    <TimeTab  time_type="month" font_color="#609ef7" :time="reportTime" :isClick="isUpdate" v-on:data_time="day_data_time"></TimeTab>
                </el-form-item>
                <el-form-item class="textareaBox" label="本月工作总结" >
                    <p v-html="form.summary"></p>
                </el-form-item>
                 <el-form-item class="textareaBox" label="下月工作计划" >
                    <p v-html="form.plan"></p>
                </el-form-item>
                <el-form-item class="textareaBox" label="备注" v-if="form.remake">
                    <p v-html="form.remake"></p>
                </el-form-item>
                <el-form-item class="textareaBox" label="附件" v-if="accessory.length">
                    <div>
                        <ul class="file-list" v-if="accessory.length">
                            <li class="file-item" v-for="(item,index) in accessory" :key="index" @click="open(item.src)">
                                <div class="item-content">
                                    <img src="./../../assets/wenjian.png" v-if="!item.isImg"/>
                                    <img v-else :src="item.url"/>
                                    <div class="file-info">
                                        <p class="omit">{{item.fileName}}</p>
                                        <span>{{item.fileSize |fileSize}}</span>
                                    </div>
                                </div>
                                
                                <div>
                                    <el-button @click="lookFile(item.url,item.fileName)">查看</el-button>
                                </div>
                            </li>
                        </ul>
                    </div>
                </el-form-item>
                <el-form-item class="textareaBox" label="抄送人" >
                    <div class="copy-list">
                        <div class="copy-list-item" v-for="item in receivers_data" :key="item.userId">
                            <img class="profileImg" :src="item.profileImg"/>
                            <p class="omit">{{item.name}}</p>
                        </div>
                    </div>
                </el-form-item>

            </el-form>
            
        </div>

        <div class="btn_box">
            <a style="margin-right:20px" v-if="isUpdate" class="btn" @click="goback">返回</a>
            <a class="btn" @click="submit('form')" v-if="!isDetails">提交</a>
        </div>

        <AddressList
            :show="openAdd"
            v-on:close="close"
            v-on:choose="choose"
            :types="peopleType"
            :receivers="receivers_data"
            :isMore="isMore"
        ></AddressList>
    </div>
</template>

<script>
    import TimeTab  from '../../components/work_report/time_tab.vue'  //头部时间切换
    import HeadTitle from './../../components/common/headTitle.vue'
    import File from './../../components/oa/file.vue'
    import Copy from './../../components/oa/copy_contacts.vue'
    import AddressList from './../../components/common/addressList.vue'


    export default {
        data() {
            return {
                summaryCount:0,
                remarkCount:0,
                accessory:[],
                openAdd:false,
                peopleType:'',
                receivers_data:[],
                reportTime:'',
                reportTimeStr:'',
                isUpdate:false,
                info:{},
                flag:true,
                isMore:true,
                id:'',
                isDetails:false,

                form:{
                    summary : '',
                    plan : '',
                    remark : ''
                },
                rules:{
                    summary:[
                        { required: true, message: '请输入本月工作总结', trigger: 'blur' },
                        { required: true, message: '请输入本月工作总结', trigger: 'change' },
                    ],
                    plan:[
                        { required: true, message: '请输入下月工作计划', trigger: 'blur' },
                        { required: true, message: '请输入下月工作计划', trigger: 'change' },
                    ],

                }
            }
        },
        components:{
            HeadTitle,
            File,
            Copy,
            AddressList,
            TimeTab
        },
        watch:{
            'form.remark':function(value){
                this.remarkCount = value.length
            },
            'form.summary':function(value){
                this.summaryCount = value.length
            },
            'form.plan':function(value){
                this.planCount = value.length
            },
            
        },
        created(){
            if(this.$route.query.id){
                this.isUpdate = true;
                this.id = this.$route.query.id;
                this.getDetails();
            }else{
             this.reportTime = new Date()
            }
        },
        methods:{
            submit(formName){
                this.$refs[formName].validate((valid) => {
                if (valid) {
                    this.save()
                } else {
                    return false;
                }
                });
            },
            lookFile(url,name){
                this.Msg.openFile(url,name)
            },
            goback(){
                history.back()
            },
            accessoryFors:function(datas){
                if(!datas||datas.urls==null||datas.urls=='') return []
               let urlArr = datas.urls.split('|')
               let fileSizeArr = datas.fileSizes.split('|')
               let fileNameArr = datas.fileNames.split('|')
               let arrs = [];
                for(let i=0;i<urlArr.length;i++){
                    let bool = this.Util.isImg(urlArr[i])
                    arrs.push({
                        url:urlArr[i],
                        fileSize:fileSizeArr[i],
                        fileName:fileNameArr[i],
                        isImg: bool,
                        status:true,
                    })
                }
                return arrs
            },
            save(){
                if(!this.receivers_data.length){
                    this.$message.error('请选择抄送人');
                    return;
                }

                let that = this;
                let  receiverIds = that.Util.getIds(that.receivers_data,'userId')
                let  fileObj = that.Util.fileFo(that.accessory)

                let params = {
                    workSummary : that.form.summary.replace(/\n/g, '<br/>'),
                    nextPlan: that.form.plan.replace(/\n/g, '<br/>'),
                    remarks : that.form.remark.replace(/\n/g, '<br/>'),
                    reportType : 3,
                    id : that.id?that.id:'',
                    reportTimeStr : that.reportTimeStr,
                    reportTime : that.reportTime,
                    receiveUserIds : receiverIds,//id串
                    isDraft : 0,
                    urls : fileObj.urlStr,
                    fileSizes : fileObj.fileSizeStr,
                    fileNames : fileObj.fileNameStr
                }

                this.Ajax.postForm('/work/report/add',params).then(res=>{
                    if(res.data.h.code==200){
                        this.$router.push({path:'/workReport'})
                    }
                })
            },
            getInfo(){
                this.Ajax.get('/work/report/query',{
                    reportType: 3,
                    reportTime: this.reportTime
                }).then(res=>{
                    if(res.data.b&&res.data.b.receiverData.length){
                        this.info = res.data.b;
                        this.form.summary = this.info.workSummary
                        this.form.remark = this.info.remarks
                        this.form.plan = this.info.nextPlan
                        this.receivers_data = this.info.receiverData
                        this.accessory = this.accessoryFors(this.info)
                        this.isDetails=true;
                    }else{
                        this.form.summary =  this.form.remark = this.form.plan = ''
                        if(res.data.b.workSummary){
                            this.form.summary = res.data.b.workSummary.replace(/<br\/>/g,'\n') 
                        }
                        this.receivers_data = []
                        this.accessory =[]
                        this.isDetails=false;

                    }
                })
            },
            getDetails(){
                this.Ajax.get('/work/report/detail',{
                        id:this.$route.query.id,
                    
                }).then(res=>{
                        this.info = res.data.b;
                        this.reportTimeStr = this.info.reportTimeStr = this.info.reportTime
                        this.info.reportTime = this.reportTime = this.info.reportDate.substr(0,10)
                        this.form.summary = this.info.workSummary.replace(/<br\/>/g,'\n') 
                        this.form.remark = this.info.remarks.replace(/<br\/>/g,'\n') 
                        this.form.plan = this.info.nextPlan.replace(/<br\/>/g,'\n')
                        this.receivers_data = this.info.receiverData
                        this.accessory = this.accessoryFors(this.info)
                        this.flag = true
                })
            },
            day_data_time: function (data, text) { //子组件接收时间数据
                this.reportTime = data
                this.reportTimeStr = text
                if(!this.flag) return false;

                this.getInfo()
            },
            removeFile(index){
                this.accessory.splice(index,1)
            },
            selectOpen(type){
                this.peopleType = 'res'+(Math.random()+'').slice(2,10)
                this.openAdd = true
            },
            remove(type,index){
                this.receivers_data.splice(index,1)
            },
            close(){
                this.openAdd=false
            },
            choose(arr){
                this.openAdd=false
                this.receivers_data = JSON.parse(JSON.stringify(arr))
            }
        }
    
    }
</script>

<style lang="stylus" scoped>
 @import "./../../style/workReport.styl"

</style>