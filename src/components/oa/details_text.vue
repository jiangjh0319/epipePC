<template>
    <div>
            <div v-if="oaType==1">
                <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{dataObj.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span >部门</span>
                    <p>{{dataObj.officeName}}</p>
                </div>
                <div class="infor-box">
                    <span>请假类型</span>
                    <p>{{dataObj.leaveType}}</p>
                </div>
                <div class="infor-box">
                    <span>开始时间</span>
                    <p>{{dataObj.beginTime|timeStrSlice}}</p>
                </div>
                <div class="infor-box">
                    <span>结束时间</span>
                    <p>{{dataObj.endTime |timeStrSlice}}</p>
                </div>
                <div class="infor-box">
                    <span >时&emsp;&emsp;长</span>
                    <p>{{dataObj.leaveDuration|dayNum}} 天</p>
                </div>
                <div class="infor-box">
                    <span>请假事由</span>
                    <p v-html="dataObj.reason"> 
                    </p>
                </div>
            </div>
            <div v-else-if="oaType==2">
                <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{dataObj.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span >部&emsp;&emsp;门</span>
                    <p>{{dataObj.officeName}}</p>
                </div>
                <div class="infor-box">
                    <span>主&emsp;&emsp;题</span>
                    <p>{{dataObj.theme}}</p>
                </div>
          
                <div class="infor-box">
                    <span>请示内容</span>
                    <p v-html="dataObj.content"></p>
                </div>
            </div>
            <div v-else-if="oaType==3">
                <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{dataObj.contractNoAuto}}</p>
                </div>
                <div class="infor-box">
                    <span >合同编号</span>
                    <p>{{dataObj.contractNoInput}}</p>
                </div>
                <div class="infor-box">
                    <span>合同名称</span>
                    <p>{{dataObj.contractName}}</p>
                </div>
                <div class="infor-box">
                    <span>送审单位</span>
                    <p>{{dataObj.applyCompanyName}}</p>
                </div>
                <div class="infor-box">
                    <span>项目责任人</span>
                    <p>{{dataObj.username}}</p>
                </div>
                <div class="infor-box">
                    <span>使用单位</span>
                    <p>{{dataObj.receiveCompanyName}}</p>
                </div>
                <div class="infor-box">
                    <span>使用单位责任人</span>
                    <p>{{dataObj.receiveName}}</p>
                </div>
                 <div class="infor-box">
                    <span>合同标的</span>
                    <p>{{dataObj.contractObj}}</p>
                </div>
                <div class="infor-box">
                    <span class="contractDescTitle">合同要点说明</span>
                    <p style="margin-top:0.1rem;" v-html="dataObj.contractDesc"></p>
                </div>
            </div>
            <div v-else-if="oaType==4">
                <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{dataObj.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span >公出事由</span>
                    <p>{{dataObj.outsideReason}}</p>
                </div>
                <div class="infor-box">
                    <span>公出类型</span>
                    <p>{{dataObj.outsideType}}</p>
                </div>
                <div class="infor-box">
                    <span>开始时间</span>
                    <p>{{dataObj.beginTime}}</p>
                </div>
                <div class="infor-box">
                    <span>结束时间</span>
                    <p>{{dataObj.endTime}}</p>
                </div>
                <div class="infor-box">
                    <span>公出地点</span>
                    <p @click="goAddress()">
                        <svg class="icon icon-back" aria-hidden="false" style="color:#0fc37c">
                            <use xlink:href="#icon-location1"></use>
                        </svg>
                        {{dataObj.outsideAddress}}</p>
                </div>
                <div class="infor-box" v-if="dataObj.peerNames">
                    <span>同行人员</span>
                    <p>{{dataObj.peerNames|nameFor}}</p>
                </div>
                 <div class="infor-box">
                    <span class="contractDescTitle">附加内容</span>
                    <p style="margin-top:0.1rem;" v-html="dataObj.applyContent"></p>
                </div>
            </div>
            <div v-else-if="oaType==5">
                 <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{dataObj.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span>标&emsp;&emsp;题</span>
                    <p>{{dataObj.tripTitle}}</p>
                </div>
                <div class="infor-box">
                    <span>公出地点</span>
                    <p @click="goAddress(index)"> 
                        <svg class="icon icon-back" aria-hidden="false" style="color:#609df6">
                            <use xlink:href="#icon-location1"></use>
                        </svg>
                        {{item.destination}}</p>
                </div>
                <div class="infor-box">
                    <span>开始时间</span>
                    <p>{{item.beginTime}}</p>
                </div>
                <div class="infor-box">
                    <span>结束时间</span>
                    <p>{{item.endTime}}</p>
                </div>
                <div class="infor-box">
                    <span>出差天数</span>
                    <p>{{item.tripDuration}} 天</p>
                </div>
                <div class="infor-box" v-if="item.peerNames&&item.peerNames!='undefined'">
                    <span>同行人员</span>
                    <p>{{item.peerNames|nameFor}}</p>
                </div>
                <div class="infor-box">
                    <span class="contractDescTitle">出差事由</span>
                    <p style="margin-top:0.1rem;" v-html="dataObj.tripReason?dataObj.tripReason:''"></p>
                </div>
            </div>
            <div v-else-if="oaType==6">
               <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{dataObj.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span>标&emsp;&emsp;题</span>
                    <p>{{dataObj.stampApplyTitle}}</p>
                </div>
                <div class="infor-box">
                    <span >用印部门</span>
                    <p>{{dataObj.officeName}}</p>
                </div>
                <div class="infor-box">
                    <span>用印承办人</span>
                    <p>{{dataObj.username}}</p>
                </div>
                <div class="infor-box">
                    <span>文件名称</span>
                    <p class="line1">{{dataObj.fileName}}</p>
                </div>
                <div class="infor-box">
                    <span>文件类别</span>
                    <p>{{dataObj.fileCategory}}</p>
                </div>
                <div class="infor-box">
                    <span >文件数量</span>
                    <p>{{dataObj.fileQuqntity}} </p>
                </div>
                <div class="infor-box">
                    <span >印章名称</span>
                    <p>{{dataObj.sealName}}</p>
                </div>
            </div>
            <div v-else-if="oaType==7">
               <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{dataObj.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span>标&emsp;&emsp;题</span>
                    <p>{{dataObj.reimburseApplyTitle}}</p>
                </div>
                <div class="infor-box">
                    <span >报 &nbsp;销 &nbsp;人 </span>
                    <p>{{dataObj.username}}</p>
                </div>
                <div class="infor-box">
                    <span>所属部门</span>
                    <p>{{dataObj.officeName}}</p>
                </div>
                <div class="infor-box">
                    <span>报销金额</span>
                    <p>{{item.reimburseAmount}} 元</p>
                </div>
                <div class="infor-box">
                    <span>日&emsp;&emsp;期</span>
                    <p>{{item.reimburseDate | timelice}}</p>
                </div>
                <div class="infor-box">
                    <span>报销类别</span>
                    <p>{{item.reimburseType}}</p>
                </div>
                <div class="infor-box">
                    <span>报销明细</span>
                    <p>{{item.reimburseDesc}} </p>
                </div>
                <div class="infor-box">
                    <span>总报销金额 </span>
                    <p>{{dataObj.totalAmount}} 元</p>
                </div>
            </div>
            <div v-else-if="oaType==8">
               <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{dataObj.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span>标&emsp;&emsp;题</span>
                    <p>{{dataObj.payTitle}}</p>
                </div>
                <div class="infor-box">
                    <span style="letter-spacing:0.05rem">申请人</span>
                    <p>{{dataObj.username}}</p>
                </div>
                <div class="infor-box">
                    <span>所属部门</span>
                    <p>{{dataObj.officeName}}</p>
                </div>
                <div class="infor-box">
                    <span>付款金额 </span>
                    <p>{{dataObj.payAmount}} 元</p>
                </div>
                 <div class="infor-box">
                    <span>付款方式 </span>
                    <p>{{dataObj.payType}} </p>
                </div>
                 <div class="infor-box">
                    <span>付款日期 </span>
                    <p>{{dataObj.payDate}} </p>
                </div>
                 <div class="infor-box">
                    <span>收款人全称 </span>
                    <p>{{dataObj.receiverName}} </p>
                </div>
                 <div class="infor-box">
                    <span>银行账户 </span>
                    <p>{{dataObj.bankAcount}} </p>
                </div>
                 <div class="infor-box">
                    <span style="letter-spacing:0.05rem">开户行 </span>
                    <p>{{dataObj.bankName}} </p>
                </div>
                <div class="infor-box">
                    <span>付款事由 </span>
                    <p>{{dataObj.payReason}} </p>
                </div>
            </div>
            <div v-else-if="oaType==9">
                <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{dataObj.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span>标&emsp;&emsp;题</span>
                    <p>{{dataObj.dimissionTitle}}</p>
                </div>
                <div class="infor-box">
                    <span style="letter-spacing:0.05rem">申请人 </span>
                    <p>{{dataObj.username}}</p>
                </div>
                <div class="infor-box">
                    <span>所属部门 </span>
                    <p>{{dataObj.officeName}}</p>
                </div>
                <div class="infor-box">
                    <span>员工编号 </span>
                    <p>{{dataObj.employeeNo}} </p>
                </div>
                 <div class="infor-box">
                    <span>职&emsp;&emsp;务 </span>
                    <p>{{dataObj.position}} </p>
                </div>
                 <div class="infor-box">
                    <span>职务类别 </span>
                    <p>{{dataObj.positionType}} </p>
                </div>
                 <div class="infor-box">
                    <span>学&emsp;&emsp;历 </span>
                    <p>{{dataObj.education}} </p>
                </div>
                 <div class="infor-box">
                    <span>入职日期 </span>
                    <p>{{dataObj.hireDate | timeSlice}} </p>
                </div>
                 <div class="infor-box">
                    <span>合同到期日 </span>
                    <p>{{dataObj.contractEndDate | timeSlice}} </p>
                </div>
                  <div class="infor-box">
                    <span>离职类别 </span>
                    <p>{{dataObj.dimissionType}} </p>
                </div>
                  <div class="infor-box">
                    <span>最后工作日 </span>
                    <p>{{dataObj.dimissionDate |timeSlice}} </p>
                </div>
                <div class="infor-box">
                    <span>离职原因 </span>
                    <p>{{dataObj.dimissionDesc}} </p>
                </div>
            </div>
            <div v-else-if="oaType==10">
                 <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{dataObj.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span>标&emsp;&emsp;题</span>
                    <p>{{dataObj.borrowTitle}}</p>
                </div>
                <div class="infor-box">
                    <span style="letter-spacing:0.05rem">申请人</span>
                    <p>{{dataObj.username}}</p>
                </div>
                <div class="infor-box">
                    <span>所属部门</span>
                    <p>{{dataObj.officeName}}</p>
                </div>
                 <div class="infor-box">
                    <span>借款金额 </span>
                    <p>{{dataObj.borrowAmount}} 元</p>
                </div>
                 <div class="infor-box">
                    <span>使用日期 </span>
                    <p>{{dataObj.useDate |timeSlice}} </p>
                </div>
                 <div class="infor-box">
                    <span>归回日期 </span>
                    <p>{{dataObj.returnDate |timeSlice}} </p>
                </div>
                 <div class="infor-box">
                    <span style="letter-spacing:0.05rem">收款人 </span>
                    <p>{{dataObj.borrowerName}} </p>
                </div>
                 <div class="infor-box">
                    <span>银行账户 </span>
                    <p>{{dataObj.borrowerAccount}} </p>
                </div>
                 <div class="infor-box">
                    <span style="letter-spacing:0.05rem">开户行 </span>
                    <p>{{dataObj.borrowerBank}} </p>
                </div>
                <div class="infor-box">
                    <span>借款事由 </span>
                    <p>{{dataObj.borrowReason}} </p>
                </div>
            </div>
            <div v-else-if="oaType==11">
                 <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{dataObj.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span>标&emsp;&emsp;题</span>
                    <p>{{dataObj.receptionTitle}}</p>
                </div>
                 <div class="infor-box">
                    <span style="letter-spacing:0.05rem">申请人</span>
                    <p>{{dataObj.username}}</p>
                </div>
                <div class="infor-box">
                    <span>所属部门</span>
                    <p>{{dataObj.officeName}}</p>
                </div>
                <div class="infor-box">
                    <span>来宾单位 </span>
                    <p>{{dataObj.visitorCompany}} </p>
                </div>
                 <div class="infor-box">
                    <span>随行人员 </span>
                    <p>{{dataObj.visitors }} </p>
                </div>
                 <div class="infor-box">
                    <span>到访时间 </span>
                    <p>{{dataObj.visitDate }} </p>
                </div>
                 <div class="infor-box">
                    <span>交通工具 </span>
                    <p>{{dataObj.visitTrafficWay}} </p>
                </div>
                 <div class="infor-box">
                    <span>接待等级</span>
                    <p>{{dataObj.receptionLevel}} </p>
                </div>
                <div class="infor-box">
                    <span>来访目的 </span>
                    <p>{{dataObj.visitGoal}} </p>
                </div>
                
            </div>
            <div v-else-if="oaType==12">
                <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{dataObj.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span>标&emsp;&emsp;题</span>
                    <p>{{dataObj.absenceTitle}}</p>
                </div>
                <div class="infor-box">
                    <span style="letter-spacing:0.02rem;width:0.6;">申 请 人</span>
                    <p>{{dataObj.username}}</p>
                </div>
                <div class="infor-box">
                    <span>所属部门</span>
                    <p>{{dataObj.officeName}}</p>
                </div>
                <div class="infor-box">
                    <span>时&emsp;&emsp;间 </span>
                    <p>{{item.absenceDate}} </p>
                </div>
                 <div class="infor-box">
                    <span>原&emsp;&emsp;因 </span>
                    <p>{{item.absenceReason }} </p>
                </div>
            </div>
            <div v-else-if="oaType==13">
                <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{dataObj.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span>标题</span>
                    <p>{{dataObj.carTitle}}</p>
                </div>
                <div class="infor-box">
                    <span>用车人</span>
                    <p>{{dataObj.username}}</p>
                </div>
                <div class="infor-box">
                    <span>使用部门</span>
                    <p>{{dataObj.officeName}}</p>
                </div>
                <div class="infor-box">
                    <span>车辆类型</span>
                    <p>{{dataObj.carType}}</p>
                </div>
                <div class="infor-box">
                    <span>数量（辆）</span>
                    <p>{{dataObj.carNum}}</p>
                </div>
                <div class="infor-box">
                    <span>用车时间</span>
                    <p>{{dataObj.beginTime}}</p>
                </div>
                <div class="infor-box">
                    <span>返回时间</span>
                    <p>{{dataObj.endTime}}</p>
                </div>
                <div class="infor-box" v-if="dataObj.peerNames">
                    <span>随行人员</span>
                    <p>{{dataObj.peerNames|nameFor}}</p>
                </div>
                <div class="infor-box">
                    <span>用车事由</span>
                    <p>{{dataObj.carReason}}</p>
                </div>
            </div>
            <div v-else-if="oaType==14">
                <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{dataObj.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span>标&emsp;&emsp;题</span>
                    <p>{{dataObj.employeeTitle}}</p>
                </div>
                <div class="infor-box">
                    <span style="letter-spacing:0.05rem">申请人</span>
                    <p>{{dataObj.username}}</p>
                </div>
                <div class="infor-box">
                    <span>所属部门</span>
                    <p>{{dataObj.officeName}}</p>
                </div>
                <div class="infor-box">
                    <span>招聘岗位 </span>
                    <p>{{dataObj.position}}</p>
                </div>
                <div class="infor-box">
                    <span>需求人数 </span>
                    <p>{{dataObj.num}}</p>
                </div>
                <div class="infor-box">
                    <span>到岗日期 </span>
                    <p>{{dataObj.arrivalDate.slice(0,-8)}}</p>
                </div>
                <div class="infor-box">
                    <span>申请理由 </span>
                    <p>{{dataObj.employeeReason}}</p>
                </div>
                <div class="infor-box">
                    <span>性&emsp;&emsp;别 </span>
                    <p>{{dataObj.sex}}</p>
                </div>
                 <div class="infor-box">
                    <span>婚&emsp;&emsp;姻 </span>
                    <p>{{dataObj.marriage}}</p>
                </div>
                 <div class="infor-box">
                    <span>年&emsp;&emsp;龄 </span>
                    <p>{{dataObj.age}}</p>
                </div>
                 <div class="infor-box">
                    <span>学&emsp;&emsp;历 </span>
                    <p>{{dataObj.education}}</p>
                </div>
                <div class="infor-box">
                    <span>专&emsp;&emsp;业 </span>
                    <p>{{dataObj.major}}</p>
                </div>
                <div v-if="dataObj.qualifications" class="infor-box">
                    <span>资格证书 </span>
                    <p>{{dataObj.qualifications}}</p>
                </div>
                <div v-if="dataObj.computerLevel" class="infor-box" >
                    <span style="letter-spacing:0.05rem">计算机 </span>
                    <p>{{dataObj.computerLevel}}</p>
                </div>
                <div v-if="dataObj.foreignLevel" class="infor-box">
                    <span>外语水平 </span>
                    <p>{{dataObj.foreignLevel}}</p>
                </div>
                <div class="infor-box">
                    <span>经验技能 </span>
                    <p>{{dataObj.skill}}</p>
                </div>
                <div v-if="dataObj.writings" class="infor-box">
                    <span>公文写作 </span>
                    <p>{{dataObj.writings}}</p>
                </div>
                <div class="infor-box">
                    <span>必要条件 </span>
                    <p>{{dataObj.condition}}</p>
                </div>
                <div v-if="dataObj.priority" class="infor-box">
                    <span>优先录用 </span>
                    <p>{{dataObj.priority}}</p>
                </div>
                <div v-if="dataObj.other" class="infor-box">
                    <span>其他要求 </span>
                    <p>{{dataObj.other}}</p>
                </div>
                <div class="infor-box">
                    <span>工作职责 </span>
                    <p>{{dataObj.responsibility}}</p>
                </div>
            </div>
            <div v-else-if="oaType==15">
                <div class="infor-box">
                    <span>审批编号&emsp;</span>
                    <p>{{dataObj.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span>标&emsp;&emsp;题 &emsp;</span>
                    <p>{{dataObj.projectTitle}}</p>
                </div>
                <div class="infor-box">
                    <span style="letter-spacing:0.04rem">申请人&emsp;</span>
                    <p>{{dataObj.username}}</p>
                </div>
                <div class="infor-box">
                    <span>所属部门&emsp;</span>
                    <p>{{dataObj.officeName}}</p>
                </div>
                <div class="infor-box">
                    <span>项目编号&emsp; </span>
                    <p>{{dataObj.projectNo}}</p>
                </div>
                 <div class="infor-box">
                    <span>申请时间&emsp; </span>
                    <p>{{dataObj.applyTime}} </p>
                </div>
                 <div class="infor-box">
                    <span>项目名称&emsp; </span>
                    <p>{{dataObj.projectName}} </p>
                </div>
                 <div class="infor-box">
                    <span>预估金额&emsp; </span>
                    <p>{{dataObj.projectBudget}} 元</p>
                </div>
                 <div class="infor-box">
                    <span>立项时间&emsp; </span>
                    <p>{{dataObj.buildDate}} </p>
                </div>
                 <div class="infor-box">
                    <span >单位联系人 </span>
                    <p>{{dataObj.connectionName}} </p>
                </div>
                <div class="infor-box">
                    <span>项目背景&emsp; </span>
                    <p>{{dataObj.projectBackground}} </p>
                </div>
                <div class="infor-box">
                    <span>需求概述&emsp; </span>
                    <p>{{dataObj.description}} </p>
                </div>
            </div>
            <div v-else-if="oaType==16">
                <div class="infor-box">
                    <span>审批编号 &emsp;&emsp;</span>
                    <p>{{dataObj.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span>标&emsp; &emsp;题 &emsp;&emsp;</span>
                    <p>{{dataObj.regularTitle}}</p>
                </div>
                <div class="infor-box">
                    <span >申请人 &emsp;&emsp;&emsp;</span>
                    <p>{{dataObj.username}}</p>
                </div>
                <div class="infor-box">
                    <span>所属部门 &emsp;&emsp;</span>
                    <p>{{dataObj.officeName}}</p>
                </div>
                <div class="infor-box">
                    <span>职&emsp; &emsp;务 &emsp;&emsp; </span>
                    <p>{{dataObj.position}} </p>
                </div>
                 <div class="infor-box">
                    <span>年&emsp; &emsp;龄 &emsp;&emsp; </span>
                    <p>{{dataObj.age}} </p>
                </div>
                 <div class="infor-box">
                    <span>性&emsp; &emsp;别 &emsp;&emsp; </span>
                    <p>{{dataObj.sex}} </p>
                </div>
                 <div class="infor-box">
                    <span>籍&emsp; &emsp;贯 &emsp;&emsp; </span>
                    <p>{{dataObj.birthPlace}} </p>
                </div>
                 <div class="infor-box">
                    <span>出生日期 &emsp;&emsp; </span>
                    <p>{{dataObj.birthday.slice(0,-8)}} </p>
                </div>
                 <div class="infor-box">
                    <span >学&emsp; &emsp;历 &emsp;&emsp; </span>
                    <p>{{dataObj.education}} </p>
                </div>
                <div class="infor-box">
                    <span>专&emsp; &emsp;业 &emsp;&emsp; </span>
                    <p>{{dataObj.major}} </p>
                </div>
                <div class="infor-box">
                    <span>毕业时间 &emsp;&emsp; </span>
                    <p>{{dataObj.graduationDate.slice(0,-8)}} </p>
                </div>
                <div class="infor-box">
                    <span>入司时间 &emsp;&emsp; </span>
                    <p>{{dataObj.hireDate.slice(0,-8)}} </p>
                </div>
                <div class="infor-box">
                    <span>试用开始时间 </span>
                    <p>{{dataObj.beginTime.slice(0,-8)}} </p>
                </div>
                <div class="infor-box">
                    <span>试用结束时间 </span>
                    <p>{{dataObj.endTime.slice(0,-8)}} </p>
                </div>
            </div>
            <div v-else-if="oaType==17">
                <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{dataObj.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span>标&emsp;&emsp;题 </span>
                    <p>{{dataObj.mealTitle}}</p>
                </div>
                <div class="infor-box">
                    <span style="letter-spacing:0.04rem">申请人</span>
                    <p>{{dataObj.username}}</p>
                </div>
                <div class="infor-box">
                    <span>所属部门</span>
                    <p>{{dataObj.officeName}}</p>
                </div>
                <div class="infor-box">
                    <span>就餐类型 </span>
                    <p>{{dataObj.mealType}}</p>
                </div>
                <div class="infor-box">
                    <span>就餐人数 </span>
                    <p>{{dataObj.mealNums}}</p>
                </div>
                 <div class="infor-box">
                    <span>开始时间 </span>
                    <p>{{dataObj.beginTime}} </p>
                </div>
                 <div class="infor-box">
                    <span>结束时间 </span>
                    <p>{{dataObj.endTime}} </p>
                </div>
                 <div class="infor-box" v-if="dataObj.mealStandard">
                    <span>就餐标准 </span>
                    <p>{{dataObj.mealStandard}} </p>
                </div>
                 <div class="infor-box" v-if="dataObj.mealPersons">
                    <span>人员名单 </span>
                    <p>{{dataObj.mealPersons}} </p>
                </div>
                 <div class="infor-box" v-if="dataObj.mealRemarks">
                    <span >备&emsp;&emsp;注 </span>
                    <p>{{dataObj.mealRemarks}} </p>
                </div>
            </div>
            <div v-else-if="oaType==18">
                <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{dataObj.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span>标&emsp;&emsp;题 </span>
                    <p>{{dataObj.documentTitle}}</p>
                </div>
                <div class="infor-box">
                    <span style="letter-spacing:0.04rem">申请人</span>
                    <p>{{dataObj.username}}</p>
                </div>
                <div class="infor-box">
                    <span>所属部门</span>
                    <p>{{dataObj.officeName}}</p>
                </div>
                <div class="infor-box">
                    <span>文件编号 </span>
                    <p>{{dataObj.documentNo}}</p>
                </div>
                 <div class="infor-box">
                    <span>主&emsp;&emsp;送 </span>
                    <p>{{dataObj.sendTo}} </p>
                </div>
                 <div class="infor-box" v-if="dataObj.copyTo">
                    <span>抄&emsp;&emsp;送 </span>
                    <p>{{dataObj.copyTo}} </p>
                </div>
                 <div class="infor-box" v-if="dataObj.documentReason">
                    <span >事&emsp;&emsp;由 </span>
                    <p>{{dataObj.documentReason}} </p>
                </div>
            </div>
            <div v-else-if="oaType==19">
                <div class="infor-box">
                    <span>审批编号&emsp;&emsp;</span>
                    <p>{{dataObj.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span style="letter-spacing:0.04rem">申请人&emsp;&emsp;</span>
                    <p>{{dataObj.username}}</p>
                </div>
                <div class="infor-box">
                    <span>所属部门&emsp;&emsp;</span>
                    <p>{{dataObj.officeName}}</p>
                </div>
                <div class="infor-box">
                    <span>开始时间&emsp;&emsp; </span>
                    <p>{{dataObj.beginTime |timeSlice}} </p>
                </div>
                 <div class="infor-box">
                    <span>结束时间&emsp;&emsp; </span>
                    <p>{{dataObj.endTime |timeSlice}} </p>
                </div>
                 <div class="infor-box" >
                    <span>时&emsp;&emsp;长&emsp;&emsp; </span>
                    <p>{{dataObj.duration}} 小时</p>
                </div>
                 <div class="infor-box" >
                    <span>是否法定假日 </span>
                    <p>{{dataObj.legalHoliday?"是":"否"}} </p>
                </div>
                 <div class="infor-box" >
                    <span >加班核算方式 </span>
                    <p>{{dataObj.accountType}} </p>
                </div>
                 <div class="infor-box" >
                    <span >备&emsp;&emsp;注&emsp;&emsp; </span>
                    <p>{{dataObj.reason}} </p>
                </div>
            </div>
            <div v-else-if="oaType==20">
                <div class="infor-box">
                    <span>审批编号&emsp; </span>
                    <p>{{dataObj.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span >申请人&emsp;&emsp;</span>
                    <p>{{dataObj.username}}</p>
                </div>
                <div class="infor-box">
                    <span>所属部门&emsp;</span>
                    <p>{{dataObj.officeName}}</p>
                </div>
                 <div class="infor-box">
                    <span>姓&emsp;&emsp;名&emsp; </span>
                    <p>{{dataObj.name}} </p>
                </div>
                 <div class="infor-box" v-if="dataObj.no&&dataObj.no!='null'">
                    <span>工&emsp;&emsp;号&emsp; </span>
                    <p>{{dataObj.no}} </p>
                </div>
                 <div class="infor-box" >
                    <span>所属部门&emsp; </span>
                    <p>{{dataObj.exOfficeName}}</p>
                </div>
                 <div class="infor-box" v-if="dataObj.exPosition!=''">
                    <span>职位名称&emsp; </span>
                    <p>{{dataObj.exPosition}} </p>
                </div>
                 <div class="infor-box" >
                    <span >入职日期&emsp; </span>
                    <p>{{dataObj.hireDate|timeSlice}} </p>
                </div>
                 <div class="infor-box" >
                    <span >调岗原因&emsp; </span>
                    <p>{{dataObj.reason}} </p>
                </div>
                <div class="infor-box" >
                    <span>调岗后部门 </span>
                    <p>{{dataObj.afterOfficeName}}</p>
                </div>
                 <div class="infor-box" >
                    <span>调岗后职位 </span>
                    <p>{{dataObj.afterPosition}} </p>
                </div>
                 <div class="infor-box" >
                    <span >调岗日期&emsp; </span>
                    <p>{{dataObj.changeDate |timeSlice}} </p>
                </div>
            </div>
            <div v-else-if="oaType==21">
                <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{dataObj.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span >申请人&emsp; </span>
                    <p>{{dataObj.username}}</p>
                </div>
                <div class="infor-box">
                    <span>所属部门</span>
                    <p>{{dataObj.officeName}}</p>
                </div>
                <div class="infor-box">
                        <span>申请事由</span>
                        <p>{{dataObj.userBuyApplyTheme}}</p>
                </div>
                    <div class="infor-box" v-if="dataObj.buyType">
                    <span>采购类型</span>
                    <p>{{dataObj.buyType}}</p>
                </div>
                <div class="infor-box">
                    <span>交付日期</span>
                    <p>{{dataObj.hopeDeliveryDate | timeSlice9}}</p>
                </div>
                <div class="infor-box">
                    <span>名&emsp;称&emsp; </span>
                    <p>{{item.name}}</p>
                </div>
                    <div class="infor-box">
                    <span>规&emsp;格&emsp; </span>
                    <p>{{item.specifications}}</p>
                </div>
                <div class="infor-box">
                    <span>数&emsp;量&emsp; </span>
                    <p>{{item.number}}</p>
                </div>
                <div class="infor-box">
                    <span>单&emsp;位&emsp; </span>
                    <p>{{item.unit}}</p>
                </div>
                <div class="infor-box">
                    <span>价&emsp;格&emsp; </span>
                    <p>{{item.price}}</p>
                </div>
                <div class="infor-box">
                    <span>总价格&emsp; </span>
                    <p>{{total}} 元</p>
                </div>
                <div class="infor-box" v-if="dataObj.payType">
                    <span>支付方式 </span>
                    <p>{{dataObj.payType}} </p>
                </div>
                <div class="infor-box" v-if="dataObj.userBuyApplyRemarks">
                    <span>备&emsp;&emsp;注 </span>
                    <p>{{dataObj.userBuyApplyRemarks}} </p>
                </div>
            </div>
            <div v-else-if="oaType==22">
                <div class="infor-box">
                    <span>审批编号 </span>
                    <p>{{dataObj.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span >申请人&emsp; </span>
                    <p>{{dataObj.username}}</p>
                </div>
                <div class="infor-box">
                    <span>所属部门 </span>
                    <p>{{dataObj.officeName}}</p>
                </div>
                 <div class="infor-box">
                        <span>物品用途 </span>
                        <p>{{dataObj.materialReceiveTheme}}</p>
                </div>
                <div class="styles infor" >
                    <div class="infor-box">
                        <span>物品名称 </span>
                        <p>{{item.materialName}}</p>
                    </div>
                    <div class="infor-box" v-if="item.num">
                        <span>数&emsp;&emsp;量 </span>
                        <p>{{item.num}}</p>
                    </div>
                </div>
                <div class="infor-box">
                    <span>备&emsp;&emsp;注 </span>
                    <p>{{dataObj.materialReceiveRemarks}} </p>
                </div>
            </div>

    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="stylus" scoped>

</style>