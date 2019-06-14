<template>
    <div>
            <div v-if="type==1">
                <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{data.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span >部&emsp;&emsp;门</span>
                    <p>{{data.officeName}}</p>
                </div>
                <div class="infor-box">
                    <span>请假类型</span>
                    <p>{{data.leaveType}}</p>
                </div>
                <div class="infor-box">
                    <span>开始时间</span>
                    <p>{{data.beginTime|slice3}}</p>
                </div>
                <div class="infor-box">
                    <span>结束时间</span>
                    <p>{{data.endTime |slice3}}</p>
                </div>
                <div class="infor-box">
                    <span >时&emsp;&emsp;长</span>
                    <p>{{data.leaveDuration|dayNum}} 天</p>
                </div>
                <div class="infor-box">
                    <span>请假事由</span>
                    <p v-html="data.reason"> 
                    </p>
                </div>
            </div>
            <div v-else-if="type==2">
                <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{data.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span >部&emsp;&emsp;门</span>
                    <p>{{data.officeName}}</p>
                </div>
                <div class="infor-box">
                    <span>主&emsp;&emsp;题</span>
                    <p>{{data.theme}}</p>
                </div>
          
                <div class="infor-box">
                    <span>请示内容</span>
                    <p v-html="data.content"></p>
                </div>
            </div>
            <div v-else-if="type==3" class="width120">
                
                <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{data.contractNoAuto}}</p>
                </div>
                <div class="infor-box">
                    <span >合同编号</span>
                    <p>{{data.contractNoInput}}</p>
                </div>
                <div class="infor-box">
                    <span>合同名称</span>
                    <p>{{data.contractName}}</p>
                </div>
                <div class="infor-box">
                    <span>送审单位</span>
                    <p>{{data.applyCompanyName}}</p>
                </div>
                <div class="infor-box">
                    <span>项目责任人</span>
                    <p>{{data.username}}</p>
                </div>
                <div class="infor-box">
                    <span>使用单位</span>
                    <p>{{data.receiveCompanyName}}</p>
                </div>
                <div class="infor-box">
                    <span>使用单位责任人</span>
                    <p>{{data.receiveName}}</p>
                </div>
                 <div class="infor-box">
                    <span>合同标的</span>
                    <p>{{data.contractObj}}</p>
                </div>
                <div class="infor-box">
                    <span class="contractDescTitle">合同要点说明</span>
                    <p style="margin-top:0.1rem;" v-html="data.contractDesc"></p>
                </div>
            </div>
            <div v-else-if="type==4">
                <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{data.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span >公出事由</span>
                    <p>{{data.outsideReason}}</p>
                </div>
                <div class="infor-box">
                    <span>公出类型</span>
                    <p>{{data.outsideType}}</p>
                </div>
                <div class="infor-box">
                    <span>开始时间</span>
                    <p>{{data.beginTime|slice3}}</p>
                </div>
                <div class="infor-box">
                    <span>结束时间</span>
                    <p>{{data.endTime |slice3}}</p>
                </div>
                <div class="infor-box">
                    <span>公出地点</span>
                    <p >
                        <svg class="icon icon-back" aria-hidden="false" style="color:#0fc37c">
                            <use xlink:href="#icon-location1"></use>
                        </svg>
                        {{data.outsideAddress}}</p>
                </div>
                <div class="infor-box" v-if="data.peerNames">
                    <span>同行人员</span>
                    <p>{{data.peerNames}}</p>
                </div>
                 <div class="infor-box">
                    <span class="contractDescTitle">附加内容</span>
                    <p style="margin-top:0.1rem;" v-html="data.applyContent"></p>
                </div>
            </div>

            <div v-else-if="type==5">
                 <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{data.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span>标&emsp;&emsp;题</span>
                    <p>{{data.tripTitle}}</p>
                </div>
                <div v-for="(item,index) in data.tripList" :key="index">
                    <div class="desc" v-if="data.tripList.length!=1">
                        行程明细{{index+1}}
                    </div>
                    <div class="infor-box">
                        <span>公出地点</span>
                        <p> 
                            {{item.destination}}
                        </p>
                    </div>
                    <div class="infor-box">
                        <span>开始时间</span>
                        <p>{{item.beginTime|slice3}}</p>
                    </div>
                    <div class="infor-box">
                        <span>结束时间</span>
                        <p>{{item.endTime|slice3}}</p>
                    </div>
                    <div class="infor-box">
                        <span>出差天数</span>
                        <p>{{item.tripDuration}} 天</p>
                    </div>
                    
                    <div class="infor-box" v-if="data.peerNames&&data.peerNames!='undefined'">
                        <span>同行人员</span>
                        <p>{{item.peerNames|nameFor}}</p>
                    </div>
                </div>
                <div class="infor-box">
                    <span class="contractDescTitle">出差事由</span>
                    <p style="margin-top:0.1rem;" v-html="data.tripReason?data.tripReason:''"></p>
                </div>
            </div>
            <div v-else-if="type==6">
               <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{data.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span>标题</span>
                    <p>{{data.stampApplyTitle}}</p>
                </div>
                <div class="infor-box">
                    <span >用印部门</span>
                    <p>{{data.officeName}}</p>
                </div>
                <div class="infor-box">
                    <span>用印承办人</span>
                    <p>{{data.username}}</p>
                </div>
                <div class="infor-box">
                    <span>文件名称</span>
                    <p class="line1">{{data.fileName}}</p>
                </div>
                <div class="infor-box">
                    <span>文件类别</span>
                    <p>{{data.fileCategory}}</p>
                </div>
                <div class="infor-box">
                    <span >文件数量</span>
                    <p>{{data.fileQuqntity}} </p>
                </div>
                <div class="infor-box">
                    <span >印章名称</span>
                    <p>{{data.sealName}}</p>
                </div>
            </div>
            <div v-else-if="type==7">
               <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{data.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span>标&emsp;&emsp;题</span>
                    <p>{{data.reimburseApplyTitle}}</p>
                </div>
                <div class="infor-box">
                    <span >报 &nbsp;销 &nbsp;人 </span>
                    <p>{{data.username}}</p>
                </div>
                <div class="infor-box">
                    <span>所属部门</span>
                    <p>{{data.officeName}}</p>
                </div>
                <div v-for="(item,index) in data.list" :key="index">
                    <div class="desc" v-if="data.list.length!=1">
                        报销明细{{index+1}}
                    </div>
                    <div class="infor-box">
                        <span>报销金额</span>
                        <p>{{item.reimburseAmount}} 元</p>
                    </div>
                    <div class="infor-box">
                        <span>日&emsp;&emsp;期</span>
                        <p>{{item.reimburseDate | substr10}}</p>
                    </div>
                    <div class="infor-box">
                        <span>报销类别</span>
                        <p>{{item.reimburseType}}</p>
                    </div>
                    <div class="infor-box">
                        <span>报销明细</span>
                        <p>{{item.reimburseDesc}} </p>
                    </div>
                </div>
                <div class="infor-box">
                    <span>总报销金额 </span>
                    <p>{{data.totalAmount}} 元</p>
                </div>
            </div>
            <div v-else-if="type==8">
               <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{data.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span>标&emsp;&emsp;题</span>
                    <p>{{data.payTitle}}</p>
                </div>
                <div class="infor-box">
                    <span style="letter-spacing:0.05rem">申请人</span>
                    <p>{{data.username}}</p>
                </div>
                <div class="infor-box">
                    <span>所属部门</span>
                    <p>{{data.officeName}}</p>
                </div>
                <div class="infor-box">
                    <span>付款金额 </span>
                    <p>{{data.payAmount}} 元</p>
                </div>
                 <div class="infor-box">
                    <span>付款方式 </span>
                    <p>{{data.payType}} </p>
                </div>
                 <div class="infor-box">
                    <span>付款日期 </span>
                    <p>{{data.payDate}} </p>
                </div>
                 <div class="infor-box">
                    <span>收款人全称 </span>
                    <p>{{data.receiverName}} </p>
                </div>
                 <div class="infor-box">
                    <span>银行账户 </span>
                    <p>{{data.bankAcount}} </p>
                </div>
                 <div class="infor-box">
                    <span style="letter-spacing:0.05rem">开户行 </span>
                    <p>{{data.bankName}} </p>
                </div>
                <div class="infor-box">
                    <span>付款事由 </span>
                    <p>{{data.payReason}} </p>
                </div>
            </div>
            <div v-else-if="type==9">
                <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{data.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span>标&emsp;&emsp;题</span>
                    <p>{{data.dimissionTitle}}</p>
                </div>
                <div class="infor-box">
                    <span style="letter-spacing:0.05rem">申请人 </span>
                    <p>{{data.username}}</p>
                </div>
                <div class="infor-box">
                    <span>所属部门 </span>
                    <p>{{data.officeName}}</p>
                </div>
                <div class="infor-box">
                    <span>员工编号 </span>
                    <p>{{data.employeeNo}} </p>
                </div>
                 <div class="infor-box">
                    <span>职&emsp;&emsp;务 </span>
                    <p>{{data.position}} </p>
                </div>
                 <div class="infor-box">
                    <span>职务类别 </span>
                    <p>{{data.positionType}} </p>
                </div>
                 <div class="infor-box">
                    <span>学&emsp;&emsp;历 </span>
                    <p>{{data.education}} </p>
                </div>
                 <div class="infor-box">
                    <span>入职日期 </span>
                    <p>{{data.hireDate | substr10}} </p>
                </div>
                 <div class="infor-box">
                    <span>合同到期日 </span>
                    <p>{{data.contractEndDate | substr10}} </p>
                </div>
                  <div class="infor-box">
                    <span>离职类别 </span>
                    <p>{{data.dimissionType}} </p>
                </div>
                  <div class="infor-box">
                    <span>最后工作日 </span>
                    <p>{{data.dimissionDate |substr10}} </p>
                </div>
                <div class="infor-box">
                    <span>离职原因 </span>
                    <p>{{data.dimissionDesc}} </p>
                </div>
            </div>
            <div v-else-if="type==10">
                 <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{data.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span>标&emsp;&emsp;题</span>
                    <p>{{data.borrowTitle}}</p>
                </div>
                <div class="infor-box">
                    <span style="letter-spacing:0.05rem">申请人</span>
                    <p>{{data.username}}</p>
                </div>
                <div class="infor-box">
                    <span>所属部门</span>
                    <p>{{data.officeName}}</p>
                </div>
                 <div class="infor-box">
                    <span>借款金额 </span>
                    <p>{{data.borrowAmount}} 元</p>
                </div>
                 <div class="infor-box">
                    <span>使用日期 </span>
                    <p>{{data.useDate |slice3}} </p>
                </div>
                 <div class="infor-box">
                    <span>归回日期 </span>
                    <p>{{data.returnDate |slice3}} </p>
                </div>
                 <div class="infor-box">
                    <span style="letter-spacing:0.05rem">收款人 </span>
                    <p>{{data.borrowerName}} </p>
                </div>
                 <div class="infor-box">
                    <span>银行账户 </span>
                    <p>{{data.borrowerAccount}} </p>
                </div>
                 <div class="infor-box">
                    <span style="letter-spacing:0.05rem">开户行 </span>
                    <p>{{data.borrowerBank}} </p>
                </div>
                <div class="infor-box">
                    <span>借款事由 </span>
                    <p>{{data.borrowReason}} </p>
                </div>
            </div>
            <div v-else-if="type==11">
                 <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{data.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span>标&emsp;&emsp;题</span>
                    <p>{{data.receptionTitle}}</p>
                </div>
                 <div class="infor-box">
                    <span style="letter-spacing:0.05rem">申请人</span>
                    <p>{{data.username}}</p>
                </div>
                <div class="infor-box">
                    <span>所属部门</span>
                    <p>{{data.officeName}}</p>
                </div>
                <div class="infor-box">
                    <span>来宾单位 </span>
                    <p>{{data.visitorCompany}} </p>
                </div>
                 <div class="infor-box">
                    <span>随行人员 </span>
                    <p>{{data.visitors }} </p>
                </div>
                 <div class="infor-box">
                    <span>到访时间 </span>
                    <p>{{data.visitDate|substr10}} </p>
                </div>
                 <div class="infor-box">
                    <span>交通工具 </span>
                    <p>{{data.visitTrafficWay}} </p>
                </div>
                 <div class="infor-box">
                    <span>接待等级</span>
                    <p>{{data.receptionLevel}} </p>
                </div>
                <div class="infor-box">
                    <span>来访目的 </span>
                    <p>{{data.visitGoal}} </p>
                </div>
                
            </div>
            <div v-else-if="type==12">
                <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{data.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span>标&emsp;&emsp;题</span>
                    <p>{{data.absenceTitle}}</p>
                </div>
                <div class="infor-box">
                    <span style="letter-spacing:0.02rem;width:0.6;">申 请 人</span>
                    <p>{{data.username}}</p>
                </div>
                <div class="infor-box">
                    <span>所属部门</span>
                    <p>{{data.officeName}}</p>
                </div>
                <div v-for="(item,index) in data.absenceList" :key="index">
                    <div class="desc" v-if="data.absenceList.length!=1">
                        补卡明细{{index+1}}
                    </div>
                    <div class="infor-box">
                        <span>时&emsp;&emsp;间 </span>
                        <p>{{item.absenceDate|slice3}} </p>
                    </div>
                    <div class="infor-box">
                        <span>原&emsp;&emsp;因 </span>
                        <p>{{item.absenceReason }} </p>
                    </div>
                </div>
            </div>
            <div v-else-if="type==13">
                <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{data.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span>标题</span>
                    <p>{{data.carTitle}}</p>
                </div>
                <div class="infor-box">
                    <span>用车人</span>
                    <p>{{data.username}}</p>
                </div>
                <div class="infor-box">
                    <span>使用部门</span>
                    <p>{{data.officeName}}</p>
                </div>
                <div class="infor-box">
                    <span>车辆类型</span>
                    <p>{{data.carType}}</p>
                </div>
                <div class="infor-box">
                    <span>数量（辆）</span>
                    <p>{{data.carNum}}</p>
                </div>
                <div class="infor-box">
                    <span>用车时间</span>
                    <p>{{data.beginTime|substr10}}</p>
                </div>
                <div class="infor-box">
                    <span>返回时间</span>
                    <p>{{data.endTime|substr10}}</p>
                </div>
                <div class="infor-box" v-if="data.peerNames">
                    <span>随行人员</span>
                    <p>{{data.peerNames|nameFor}}</p>
                </div>
                <div class="infor-box">
                    <span>用车事由</span>
                    <p>{{data.carReason}}</p>
                </div>
            </div>
            <div v-else-if="type==14">
                <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{data.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span>标题</span>
                    <p>{{data.employeeTitle}}</p>
                </div>
                <div class="infor-box">
                    <span style="letter-spacing:0.05rem">申请人</span>
                    <p>{{data.username}}</p>
                </div>
                <div class="infor-box">
                    <span>所属部门</span>
                    <p>{{data.officeName}}</p>
                </div>
                <div class="infor-box">
                    <span>招聘岗位 </span>
                    <p>{{data.position}}</p>
                </div>
                <div class="infor-box">
                    <span>需求人数 </span>
                    <p>{{data.num}}</p>
                </div>
                <div class="infor-box">
                    <span>到岗日期 </span>
                    <p>{{data.arrivalDate|substr10}}</p>
                </div>
                <div class="infor-box">
                    <span>申请理由 </span>
                    <p>{{data.employeeReason}}</p>
                </div>
                <div class="infor-box">
                    <span>性别 </span>
                    <p>{{data.sex}}</p>
                </div>
                 <div class="infor-box">
                    <span>婚姻 </span>
                    <p>{{data.marriage}}</p>
                </div>
                 <div class="infor-box">
                    <span>年龄 </span>
                    <p>{{data.age}}</p>
                </div>
                 <div class="infor-box">
                    <span>学历 </span>
                    <p>{{data.education}}</p>
                </div>
                <div class="infor-box">
                    <span>专业 </span>
                    <p>{{data.major}}</p>
                </div>
                <div v-if="data.qualifications" class="infor-box">
                    <span>资格证书 </span>
                    <p>{{data.qualifications}}</p>
                </div>
                <div v-if="data.computerLevel" class="infor-box" >
                    <span >计算机 </span>
                    <p>{{data.computerLevel}}</p>
                </div>
                <div v-if="data.foreignLevel" class="infor-box">
                    <span>外语水平 </span>
                    <p>{{data.foreignLevel}}</p>
                </div>
                <div class="infor-box">
                    <span>经验技能 </span>
                    <p>{{data.skill}}</p>
                </div>
                <div v-if="data.writings" class="infor-box">
                    <span>公文写作 </span>
                    <p>{{data.writings}}</p>
                </div>
                <div class="infor-box">
                    <span>必要条件 </span>
                    <p>{{data.condition}}</p>
                </div>
                <div v-if="data.priority" class="infor-box">
                    <span>优先录用 </span>
                    <p>{{data.priority}}</p>
                </div>
                <div v-if="data.other" class="infor-box">
                    <span>其他要求 </span>
                    <p>{{data.other}}</p>
                </div>
                <div class="infor-box">
                    <span>工作职责 </span>
                    <p>{{data.responsibility}}</p>
                </div>
            </div>
            <div v-else-if="type==15">
                <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{data.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span>标题</span>
                    <p>{{data.projectTitle}}</p>
                </div>
                <div class="infor-box">
                    <span style="letter-spacing:0.04rem">申请人</span>
                    <p>{{data.username}}</p>
                </div>
                <div class="infor-box">
                    <span>所属部</span>
                    <p>{{data.officeName}}</p>
                </div>
                <div class="infor-box">
                    <span>项目编号 </span>
                    <p>{{data.projectNo}}</p>
                </div>
                 <div class="infor-box">
                    <span>申请时间 </span>
                    <p>{{data.applyTime|substr10}} </p>
                </div>
                 <div class="infor-box">
                    <span>项目名称</span>
                    <p>{{data.projectName}} </p>
                </div>
                 <div class="infor-box">
                    <span>预估金额</span>
                    <p>{{data.projectBudget}} 元</p>
                </div>
                 <div class="infor-box">
                    <span>立项时间</span>
                    <p>{{data.buildDate|substr10}} </p>
                </div>
                 <div class="infor-box">
                    <span >单位联系人 </span>
                    <p>{{data.connectionName}} </p>
                </div>
                <div class="infor-box">
                    <span>项目背景 </span>
                    <p>{{data.projectBackground}} </p>
                </div>
                <div class="infor-box">
                    <span>需求概述</span>
                    <p>{{data.description}} </p>
                </div>
            </div>
            <div v-else-if="type==16" class="width120">
                <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{data.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span>标题</span>
                    <p>{{data.regularTitle}}</p>
                </div>
                <div class="infor-box">
                    <span >申请人</span>
                    <p>{{data.username}}</p>
                </div>
                <div class="infor-box">
                    <span>所属部门</span>
                    <p>{{data.officeName}}</p>
                </div>
                <div class="infor-box">
                    <span>职务 </span>
                    <p>{{data.position}} </p>
                </div>
                 <div class="infor-box">
                    <span>年龄 </span>
                    <p>{{data.age}} </p>
                </div>
                 <div class="infor-box">
                    <span>性别 </span>
                    <p>{{data.sex}} </p>
                </div>
                 <div class="infor-box">
                    <span>籍贯 </span>
                    <p>{{data.birthPlace}} </p>
                </div>
                 <div class="infor-box">
                    <span>出生日期 </span>
                    <p>{{data.birthday.slice(0,-8)}} </p>
                </div>
                 <div class="infor-box">
                    <span >学历 </span>
                    <p>{{data.education}} </p>
                </div>
                <div class="infor-box">
                    <span>专业 </span>
                    <p>{{data.major}} </p>
                </div>
                <div class="infor-box">
                    <span>毕业时间 </span>
                    <p>{{data.graduationDate.slice(0,-8)}} </p>
                </div>
                <div class="infor-box">
                    <span>入司时间 </span>
                    <p>{{data.hireDate.slice(0,-8)}} </p>
                </div>
                <div class="infor-box">
                    <span>试用开始时间 </span>
                    <p>{{data.beginTime.slice(0,-8)}} </p>
                </div>
                <div class="infor-box">
                    <span>试用结束时间 </span>
                    <p>{{data.endTime.slice(0,-8)}} </p>
                </div>
            </div>
            <div v-else-if="type==17">
                <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{data.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span>标&emsp;&emsp;题 </span>
                    <p>{{data.mealTitle}}</p>
                </div>
                <div class="infor-box">
                    <span>申请人</span>
                    <p>{{data.username}}</p>
                </div>
                <div class="infor-box">
                    <span>所属部门</span>
                    <p>{{data.officeName}}</p>
                </div>
                <div class="infor-box">
                    <span>就餐类型 </span>
                    <p>{{data.mealType}}</p>
                </div>
                <div class="infor-box">
                    <span>就餐人数 </span>
                    <p>{{data.mealNums}}</p>
                </div>
                 <div class="infor-box">
                    <span>开始时间 </span>
                    <p>{{data.beginTime|slice3}} </p>
                </div>
                 <div class="infor-box">
                    <span>结束时间 </span>
                    <p>{{data.endTime|slice3}} </p>
                </div>
                 <div class="infor-box" v-if="data.mealStandard">
                    <span>就餐标准 </span>
                    <p>{{data.mealStandard}} </p>
                </div>
                 <div class="infor-box" v-if="data.mealPersons">
                    <span>人员名单 </span>
                    <p>{{data.mealPersons}} </p>
                </div>
                 <div class="infor-box" v-if="data.mealRemarks">
                    <span >备注 </span>
                    <p>{{data.mealRemarks}} </p>
                </div>
            </div>
            <div v-else-if="type==18">
                <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{data.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span>标题 </span>
                    <p>{{data.documentTitle}}</p>
                </div>
                <div class="infor-box">
                    <span style="letter-spacing:0.04rem">申请人</span>
                    <p>{{data.username}}</p>
                </div>
                <div class="infor-box">
                    <span>所属部门</span>
                    <p>{{data.officeName}}</p>
                </div>
                <div class="infor-box">
                    <span>文件编号 </span>
                    <p>{{data.documentNo}}</p>
                </div>
                 <div class="infor-box">
                    <span>主送 </span>
                    <p>{{data.sendTo}} </p>
                </div>
                 <div class="infor-box" v-if="data.copyTo">
                    <span>抄送 </span>
                    <p>{{data.copyTo}} </p>
                </div>
                 <div class="infor-box" v-if="data.documentReason">
                    <span >事由 </span>
                    <p>{{data.documentReason}} </p>
                </div>
            </div>
            <div v-else-if="type==19" class="width120">
                <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{data.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span >申请人</span>
                    <p>{{data.username}}</p>
                </div>
                <div class="infor-box">
                    <span>所属部门</span>
                    <p>{{data.officeName}}</p>
                </div>
                <div class="infor-box">
                    <span>开始时间 </span>
                    <p>{{data.beginTime |slice3}} </p>
                </div>
                 <div class="infor-box">
                    <span>结束时间 </span>
                    <p>{{data.endTime |slice3}} </p>
                </div>
                 <div class="infor-box" >
                    <span>时长 </span>
                    <p>{{data.duration}} 小时</p>
                </div>
                 <div class="infor-box" >
                    <span>是否法定假日 </span>
                    <p>{{data.legalHoliday?"是":"否"}} </p>
                </div>
                 <div class="infor-box" >
                    <span >加班核算方式 </span>
                    <p>{{data.accountType}} </p>
                </div>
                 <div class="infor-box" >
                    <span >备注 </span>
                    <p>{{data.reason}} </p>
                </div>
            </div>
            <div v-else-if="type==20">
                <div class="infor-box">
                    <span>审批编号 </span>
                    <p>{{data.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span >申请人</span>
                    <p>{{data.username}}</p>
                </div>
                <div class="infor-box">
                    <span>所属部门</span>
                    <p>{{data.officeName}}</p>
                </div>
                 <div class="infor-box">
                    <span>姓名 </span>
                    <p>{{data.name}} </p>
                </div>
                 <div class="infor-box" v-if="data.no&&data.no!='null'">
                    <span>工号 </span>
                    <p>{{data.no}} </p>
                </div>
                 <div class="infor-box" >
                    <span>所属部门 </span>
                    <p>{{data.exOfficeName}}</p>
                </div>
                 <div class="infor-box" v-if="data.exPosition!=''">
                    <span>职位名称 </span>
                    <p>{{data.exPosition}} </p>
                </div>
                 <div class="infor-box" >
                    <span >入职日期 </span>
                    <p>{{data.hireDate|substr10}} </p>
                </div>
                 <div class="infor-box" >
                    <span >调岗原因 </span>
                    <p>{{data.reason}} </p>
                </div>
                <div class="infor-box" >
                    <span>调岗后部门 </span>
                    <p>{{data.afterOfficeName}}</p>
                </div>
                 <div class="infor-box" >
                    <span>调岗后职位 </span>
                    <p>{{data.afterPosition}} </p>
                </div>
                 <div class="infor-box" >
                    <span >调岗日期 </span>
                    <p>{{data.changeDate |substr10}} </p>
                </div>
            </div>
            <div v-else-if="type==21">
                <div class="infor-box">
                    <span>审批编号</span>
                    <p>{{data.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span >申请人 </span>
                    <p>{{data.username}}</p>
                </div>
                <div class="infor-box">
                    <span>所属部门</span>
                    <p>{{data.officeName}}</p>
                </div>
                <div class="infor-box">
                        <span>申请事由</span>
                        <p>{{data.userBuyApplyTheme}}</p>
                </div>
                    <div class="infor-box" v-if="data.buyType">
                    <span>采购类型</span>
                    <p>{{data.buyType}}</p>
                </div>
                <div class="infor-box">
                    <span>交付日期</span>
                    <p>{{data.hopeDeliveryDate | substr10}}</p>
                </div>
                <div v-for="(item,index) in data.list" :key="index">
                    <div class="desc">
                        采购明细 {{index+1}}
                    </div>
                    <div class="infor-box">
                        <span>名称 </span>
                        <p>{{item.name}}</p>
                    </div>
                        <div class="infor-box">
                        <span>规格 </span>
                        <p>{{item.specifications}}</p>
                    </div>
                    <div class="infor-box">
                        <span>数量 </span>
                        <p>{{item.number}}</p>
                    </div>
                    <div class="infor-box">
                        <span>单位 </span>
                        <p>{{item.unit}}</p>
                    </div>
                    <div class="infor-box">
                        <span>价格 </span>
                        <p>{{item.price}}</p>
                    </div>
                </div>
                <div class="infor-box">
                    <span>总价格 </span>
                    <p>{{data.total}} 元</p>
                </div>
                <div class="infor-box" v-if="data.payType">
                    <span>支付方式 </span>
                    <p>{{data.payType}} </p>
                </div>
                <div class="infor-box" v-if="data.userBuyApplyRemarks">
                    <span>备注 </span>
                    <p>{{data.userBuyApplyRemarks}} </p>
                </div>
            </div>
            <div v-else-if="type==22">
                <div class="infor-box">
                    <span>审批编号 </span>
                    <p>{{data.applyNo}}</p>
                </div>
                <div class="infor-box">
                    <span >申请人&emsp; </span>
                    <p>{{data.username}}</p>
                </div>
                <div class="infor-box">
                    <span>所属部门 </span>
                    <p>{{data.officeName}}</p>
                </div>
                 <div class="infor-box">
                        <span>物品用途 </span>
                        <p>{{data.materialReceiveTheme}}</p>
                </div>
                <div v-for="(item,index) in data.list" :key="index">
                    <div class="desc">
                        物品明细 {{index+1}}
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
                </div>
                <div class="infor-box" v-if="data.materialReceiveRemarks">
                    <span>备&emsp;&emsp;注 </span>
                    <p>{{data.materialReceiveRemarks}} </p>
                </div>
            </div>

    </div>
</template>

<script>
    export default {
        data(){
            return{
              
                item:{},
            }
        },
        props:['type','data'],
        filters:{
             dayNum : function(value){
                    if(!value) return;
                  return  value.indexOf('.5')>-1?Number(value).toFixed(1):parseInt(value)
            },
        }
    }
</script>

<style lang="stylus" scoped>
    .infor-box{
        display flex
        margin-bottom:5px;

        span{
            width 80px;
            color:#999;
            text-align:right;
            margin-right:25px;
        }

        p{
            flex 1;
        }
    }

    .width120 span{
        width:120px;
    }

    .desc{
        margin-bottom:5px;
        margin-top:15px;
        text-indent: 15px;
        color:#24b36b;
        font-weight bold
    }
</style>