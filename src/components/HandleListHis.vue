<!--------------------------------- 各个历史业务组件 ----------------------------------------->
<template>
    <div>
        <el-form  ref="historyForm" :model="bus" style="width: 100%">
            <!---------------历史业务搜索框搜索-------------------------->
            <el-row style="width: 100%">
                <el-col :span="5">
                    <el-form-item label="业务团队" prop="busteam" >
                        <el-select v-model="bus.busteam" clearable placeholder="请选择" style="width:68%">
                            <el-option
                                    v-for="item in busteams"
                                    :key="item"
                                    :label="item"
                                    :value="item">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="业务品种" prop="bustype">
                        <el-select v-model="bus.bustype" clearable placeholder="请选择" style="width:58%">
                            <el-option
                                    v-for="item in bustypes"
                                    :key="item.busType"
                                    :label="item.busPname"
                                    :value="item.busType">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item label="低风险" prop="lowrisk">
                        <el-select v-model="bus.lowrisk" clearable placeholder="请选择" placement="top" style="width:55%">
                            <el-option
                                    v-for="low in lowrisks"
                                    :key="low.value"
                                    :label="low.label"
                                    :value="low.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
                <el-col :span="7">
                    <el-form-item label="处理日期"  prop="resSdate">
                        <el-date-picker
                                v-model="bus.resSdate"
                                clearable placeholder="开始日期"
                                value-format="yyyy-MM-dd"
                                style="width:35%;">
                        </el-date-picker>
                        <el-date-picker
                                v-model="bus.resEdate"
                                clearable placeholder="结束日期"
                                value-format="yyyy-MM-dd"
                                style="width:35%;">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-form-item >
                        <el-button  @click="handleHistorySearch" type="primary"  icon="el-icon-search">查询</el-button>
                        <el-button  @click="modify" type="warning" icon="el-icon-edit" v-show="character == 'AUD_REC'">修改</el-button>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <!----------------------历史业务表单------------------------>
        <div style="margin:30px 0 0">
            <el-table
                    v-loading="loading"
                    ref="multipleTable"
                    :data="historyList"
                    tooltip-effect="dark"
                    :border="true"
                    :highlight-current-row="true"
                    @selection-change="handleSelectionChange"
                    max-height="530px"
                    size="small"
                    style="width: 100%"
            >
                <!--table表单中的 prop 为controller数据源的列名，label为姓名，scope.row为拿到这一行的数据-->
                <el-table-column v-if="character === 'AUD_REC'"  type="selection" width="40"></el-table-column>
                <el-table-column type="index" width="40" align="center"></el-table-column>
                <el-table-column prop="busTeam" label="业务团队"  align="center"></el-table-column>
                <el-table-column prop="cusName" label="客户名称" align="center"></el-table-column>
                <el-table-column prop="facSize" label="企业规模"  align="center"></el-table-column>
                <el-table-column prop="busPname" label="业务品种" align="center"></el-table-column>
                <el-table-column prop="other" label="其他品种" align="center"></el-table-column>
                <el-table-column prop="currency" label="币种"  align="center">
                    <template slot-scope="scope">
                        <span  v-if="scope.row.currency == '10'">{{ scope.row.currency == 10 ?  '人民币': '' }}</span>
                        <span  v-if="scope.row.currency == '17'">{{ scope.row.currency == 17 ?  '韩国元': '' }}</span>
                        <span  v-if="scope.row.currency == '21'">{{ scope.row.currency == 21 ?  '港币': '' }}</span>
                        <span  v-if="scope.row.currency == '24'">{{ scope.row.currency == 24 ?  '新西兰元': '' }}</span>
                        <span  v-if="scope.row.currency == '29'">{{ scope.row.currency == 29 ?  '澳元': '' }}</span>
                        <span  v-if="scope.row.currency == '32'">{{ scope.row.currency == 32 ?  '美元': '' }}</span>
                        <span  v-if="scope.row.currency == '35'">{{ scope.row.currency == 35 ?  '欧元': '' }}</span>
                        <span  v-if="scope.row.currency == '39'">{{ scope.row.currency == 39 ?  '加拿大元': '' }}</span>
                        <span  v-if="scope.row.currency == '43'">{{ scope.row.currency == 43 ?  '英镑': '' }}</span>
                        <span  v-if="scope.row.currency == '65'">{{ scope.row.currency == 65 ?  '日元': '' }}</span>
                        <span  v-if="scope.row.currency == '69'">{{ scope.row.currency == 69 ?  '新加坡元': '' }}</span>
                        <span  v-if="scope.row.currency == '83'">{{ scope.row.currency == 83 ?  '挪威克朗': '' }}</span>
                        <span  v-if="scope.row.currency == '87'">{{ scope.row.currency == 87 ?  '瑞士法郎': '' }}</span>
                        <span  v-if="scope.row.currency == '88'">{{ scope.row.currency == 88 ?  '瑞典克朗': '' }}</span>
                        <span  v-if="scope.row.currency == '97'">{{ scope.row.currency == 97 ?  '外币折美元': '' }}</span>
                        <span  v-if="scope.row.currency == '98'">{{ scope.row.currency == 98 ?  '全折美元': '' }}</span>
                        <span  v-if="scope.row.currency == '99'">{{ scope.row.currency == 99 ?  '全折人民币': '' }}</span> 
                    </template>
                </el-table-column>
                <el-table-column prop="amount" label="金额" align="center" :formatter="amountFormat"></el-table-column>
                <el-table-column prop="warType" label="担保方式"  align="center"></el-table-column>
                <el-table-column prop="collateral" label="质押物"  align="center"></el-table-column>
                <el-table-column prop="busNumber" label="业务编号"  align="center"></el-table-column>
                <el-table-column prop="busManager" label="客户经理"  align="center"></el-table-column>
                <el-table-column prop="proEdate" label="处理日期"  align="center"></el-table-column>
                <el-table-column prop="proEtime" label="处理时间"  align="center"></el-table-column>
                <el-table-column fixed="right" label="详情" v-if="this.mark !== 'AUD_LED'" align="center" width="100%">
                    <template slot-scope="scope">
                        <el-button
                                @click="progress(scope.row)"
                                size="small"
                                type="text"
                        >详情</el-button>
                        <el-button
                                v-if="character === 'AUD_REC'"
                                @click="delBus(scope.row)"
                                size="small"
                                type="text"
                        >删除</el-button>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="详情" v-if="this.mark === 'AUD_LED'" align="center" width="100%">
                    <template slot-scope="scope">
                        <el-button
                                @click="progress(scope.row)"
                                size="small"
                                type="text"
                        >详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页区域，layout展示页面上展示哪些功能组件，total总共有多少条数据  -->
        <div class="block">
            <el-pagination
                    @size-change="handleSizeChangeHistory"
                    @current-change="handleCurrentChangeHistory"
                    :current-page.sync="pageIndexHistory"
                    :page-sizes="[100, 200, 300, 400]"
                    :page-size.sync="pageSizeHistory"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageTotalHistory"
            ></el-pagination>
        </div>
        <!------------------修改业务视图--------------------->
        <el-dialog
                title="修改业务信息"
                :visible.sync="modifyVisible"
                :close-on-click-modal="false"
                :before-close="handleClose"
                class="modifyBusVis"
                width="35%"
                height="20%"
                center
        >
            <el-form ref="modifyBus"  label-width="80px" :model="modifys" size="small">
                <el-row>
                    <el-col>
                        <el-form-item label="业务团队" prop="busTeam" style="width:100%">
                            <el-input v-model="modifys.busTeam" ></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col>
                        <el-form-item label="客户名称" prop="cusName" style="width: 100%">
                            <el-input v-model="modifys.cusName"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="13">
                        <el-form-item label="业务品种" prop="busType" style="width: 100%">
                            <el-select v-model="modifys.busType" clearable placeholder="请选择" style="width: 60%">
                                <el-option
                                        v-for="item in currentBusTypes"
                                        :key="item.busType"
                                        :label="item.busPname"
                                        :value="item.busType">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="其他" prop="other" style="width: 100%">
                            <el-input  v-model="modifys.other"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="13">
                        <el-form-item label="币种" prop="currency" style="width:100%">
                            <el-select v-model="modifys.currency"   clearable placeholder="请选择" style="width: 60%">
                                <el-option
                                        v-for="cur in currencys"
                                        :key="cur.index"
                                        :label="cur.label"
                                        :value="cur.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col  :span="11">
                        <el-form-item label="金额" prop="amount" style="width:100%">
                            <el-input v-model="modifys.amount"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="客户经理" prop="busManager" style="width:100%">
                    <el-input v-model="modifys.busManager"></el-input>
                </el-form-item>
                <el-form-item label="业务编号" prop="busNumber" style="width: 100%">
                    <el-input v-model="modifys.busNumber"></el-input>
                </el-form-item>
                <el-form-item label="担保方式" prop="warType" style="width: 100%">
                    <el-input v-model.number="modifys.warType"></el-input>
                </el-form-item>
                <el-form-item label="质押物" prop="collateral" style="width: 100%">
                    <el-input v-model="modifys.collateral"></el-input>
                </el-form-item>
                <el-row>
                    <el-col :span="13">
                        <el-form-item label="低风险" prop="lowRisk">
                            <el-select v-model=modifys.lowRisk>
                                <el-option
                                        v-for="low in lowrisks"
                                        :key="low.index"
                                        :label="low.label"
                                        :value="low.value"
                                ></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="11">
                        <el-form-item label="授信项下" prop="undCredit" >
                            <el-select v-model="modifys.undCredit" style="height: auto !important;">
                                <el-option
                                        v-for="und in undcredits"
                                        :key="und.value "
                                        :label="und.label "
                                        :value="und.value "
                                        style="height: auto !important;">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="13">
                        <el-form-item label="绿色信贷" prop="greCredit">
                            <el-select v-model="modifys.greCredit">
                                <el-option
                                        v-for="gre in grecredits"
                                        :key="gre.value "
                                        :label="gre.label "
                                        :value="gre.value ">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col >
                    <el-col :span="11">
                        <el-form-item label="外保内贷" prop="extLoan">
                            <el-select v-model="modifys.extLoan">
                                <el-option
                                        v-for="ext in extloans"
                                        :key="ext.value "
                                        :label="ext.label "
                                        :value="ext.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-form-item label="企业规模" prop="facSize" style="width: 100%">
                    <el-input v-model="modifys.facSize"></el-input>
                </el-form-item>
                <el-form-item label="行业类型" prop="entType" style="width: 100%">
                    <el-input v-model="modifys.entType"></el-input>
                </el-form-item>
            </el-form>
            <!-- 按钮居中显示 -->
            <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="modifySubmit" v-preventReClick>提交</el-button>
                </span>
        </el-dialog>
        <!----------------------------------------流程视图-------------------------------------------->
        <el-dialog
                title="业务流程"
                :visible.sync="progressVisible"
                :close-on-click-modal="false"
        >
            <el-timeline>
                <!--将时间进行分割-->
                <el-timeline-item
                        v-for="(timeline, index) in timeLine"
                        :key="index"
                        :timestamp="(timeline.proSdate || '').split(' ')[0]+' '+timeline.proStime +' 至 '+((timeline.proEdate || '').split(' ')[0]===null?'':(timeline.proEdate || '').split(' ')[0])+' '+(timeline.proEtime===null?'':timeline.proEtime)"
                        :before-close="handleClose"
                >
                    <span style="color: yellowgreen">{{timeline.proType == 0? '预约：':''}}</span>
                    <span style="color: cornflowerblue">{{timeline.proType == 1? '接件：':''}}</span>
                    <span style="color: orange">{{timeline.proType == 2? '待初审':''}}</span>
                    <span style="color: cadetblue">{{timeline.proType == 3? '初审：':''}}</span>
                    <span style="color: orange">{{timeline.proType == 4? '待复核':''}}</span>
                    <span style="color: darkblue">{{timeline.proType == 5? '复核：':''}}</span>
                    <span style="color: orange">{{timeline.proType == 6? '待放款':''}}</span>
                    <span style="color: brown">{{timeline.proType == 8? '放款：':''}}</span>
                    <span >{{timeline.proName}}</span><br>
                    <span style="color: crimson">{{timeline.proType == 7? '待完善欠缺':''}}</span>
                </el-timeline-item>
            </el-timeline>
        </el-dialog>
        <!------------------导出Excel视图--------------------->
        <el-dialog
                title="导出Excel"
                :visible.sync="excelVisible"
                :close-on-click-modal="false"
                :before-close="handleClose"
                class="excelVis"
                width="50%"
                height="20%"
                center
        >
            <el-form ref="excelRef" :model="excelForm" :rules="excelRules"  label-width="100px"  size="small">
                <el-row>
                    <el-col :span="3">
                        <span class="demonstration" style="margin-right:20px" >选择时间段</span>
                    </el-col>
                    <el-col :span="6" style="margin-left: 2px">
                        <el-form-item prop="reserveSdate" >
                            <el-date-picker
                                    v-model="excelForm.reserveSdate"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择开始日期"
                                    class="start-date">
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item prop="reserveEdate">
                            <el-date-picker
                                    v-model="excelForm.reserveEdate"
                                    type="date"
                                    value-format="yyyy-MM-dd"
                                    placeholder="选择结束日期"
                                    class="end-date"
                            >
                            </el-date-picker>
                        </el-form-item>
                    </el-col>
                </el-row>
                <!--<el-row>
                    <el-col :span="3">
                        <span class="demonstration"  >Excel 名称</span>
                    </el-col>
                    <el-col :span="21">
                        <el-form-item prop="excelName" style="width: 100%">
                            <el-input v-model="excelForm.excelName"  style="width:65%; " placeholder="请输入名称"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>-->
                <el-row >
                    <el-checkbox v-model="checkAll"  @change="handleCheckAllChange">全选</el-checkbox>
                </el-row>
                <el-row style="margin-top: 20px">
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.busTeam" @change="handleCheckItemChange('busTeam')" label="业务团队" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.cusName" @change="handleCheckItemChange('cusName')" label="客户名称" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.busPname" @change="handleCheckItemChange('busPname')" label="业务品种" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.warType" @change="handleCheckItemChange('warType')" label="主要担保方式" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.collateral" @change="handleCheckItemChange('collateral')" label="质押物" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.currency" @change="handleCheckItemChange('currency')" label="币种" border></el-checkbox>
                    </el-col>
                </el-row>
                <el-row style="margin-top: 20px">
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.amount" @change="handleCheckItemChange('amount')" label="金额" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.busNumber" @change="handleCheckItemChange('busNumber')" label="业务编号" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.lowRisk" @change="handleCheckItemChange('lowRisk')" label="是否低风险" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.undCredit" @change="handleCheckItemChange('undCredit')" label="授信项下" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.greCredit" @change="handleCheckItemChange('greCredit')" label="绿色信贷" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.extLoan" @change="handleCheckItemChange('extLoan')" label="外保内贷" border></el-checkbox>
                    </el-col>
                </el-row>
                <el-row style="margin-top: 20px">
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.magYst" @change="handleCheckItemChange('magYst')" label="客户经理一事通" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.busManager" @change="handleCheckItemChange('busManager')" label="客户经理" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.entType" @change="handleCheckItemChange('entType')" label="行业类型" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.facSize" @change="handleCheckItemChange('facSize')" label="企业规模" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.reservePeo" @change="handleCheckItemChange('reservePeo')" label="预约人" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.reserveDate" @change="handleCheckItemChange('reserveDate')" label="预约时间" border></el-checkbox>
                    </el-col>
                </el-row>
                <el-row style="margin-top: 20px">
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.wReceiveCon" @change="handleCheckItemChange('wReceiveCon')" label="待接件耗时" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.receivePeo" @change="handleCheckItemChange('receivePeo')" label="接件人" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.receiveCon" @change="handleCheckItemChange('receiveCon')" label="接件耗时" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.receiveHangCon" @change="handleCheckItemChange('receiveHangCon')" label="接件挂件耗时" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.wFirstAudCon" @change="handleCheckItemChange('wFirstAudCon')" label="待初审耗时" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.firstAudPeo" @change="handleCheckItemChange('firstAudPeo')" label="初审人" border></el-checkbox>
                    </el-col>
                </el-row>
                <el-row style="margin-top: 20px">
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.firstAudCon" @change="handleCheckItemChange('firstAudCon')" label="初审耗时" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.firstHangCon" @change="handleCheckItemChange('firstHangCon')" label="初审挂件耗时" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.wSecondAudCon" @change="handleCheckItemChange('wSecondAudCon')" label="待复核耗时" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.secondAudPeo" @change="handleCheckItemChange('secondAudPeo')" label="复核人" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.secondAudCon" @change="handleCheckItemChange('secondAudCon')" label="复核耗时" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.secondHangCon" @change="handleCheckItemChange('secondHangCon')" label="复核挂件耗时" border></el-checkbox>
                    </el-col>
                </el-row>
                <el-row style="margin-top: 20px">
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.wReleaseCon" @change="handleCheckItemChange('wReleaseCon')" label="待放款耗时" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.releasePeo" @change="handleCheckItemChange('releasePeo')" label="放款人" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.releaseCon" @change="handleCheckItemChange('releaseCon')" label="待放款耗时" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.allTimeComsume" @change="handleCheckItemChange('allTimeComsume')" label="总耗时" border></el-checkbox>
                    </el-col>
                </el-row>
            </el-form>
            <!-- 按钮居中显示 -->
            <span slot="footer">
                    <div class="excel-button">
                        <el-button type="primary"  @click="validExcel">提交</el-button>
                    </div>
                </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name: "HandleListHis",
        props: ['character'],
        data() {
            /*获取业务列表数据*/
            return {
                busteams:["国企及新动能团队","汽车团队","房地产团队","机构业务一团队","机构业务二团队","小企业金融部","公司金融客户一部","公司金融客户二部",
                    "公司金融客户四部","公司金融客户五部","公司金融客户六部","公司金融客户八部","公司金融客户九部","公司金融客户十部","公司金融客户十一部","公司金融客户十二部","公司金融客户十三部",
                    "公司金融客户十四部","江津支行公司金融客户部","璧山支行公司金融客户部","长寿支行公司金融客户部","涪陵支行公司金融客户部","永川支行公司金融客户部"],
                lowrisks:[
                    {
                    value: "1",
                    label: "是",
                    }, {
                    value: "0",
                    label: "否",
                    }],
                undcredits:[{
                    value: "1",
                    label: "是",
                    }, {
                    value: "0",
                    label: "否",
                    }],
                grecredits:[{
                    value: "1",
                    label: "是",
                    }, {
                    value: "0",
                    label: "否",
                    }],
                extloans:[{
                    value: "1",
                    label: "是",
                    }, {
                    value: "0",
                    label: "否",
                    }],
                //币种
                currencys:[{
                    value: "10",
                    label: "人民币",
                    },{
                    value: "17",
                    label: "韩国元",
                    }, {
                    value: "21",
                    label: "港币",
                    }, {
                    value: "24",
                    label: "新西兰元",
                    }, {
                    value: "29",
                    label: "澳大利亚元",
                    }, {
                    value: "32",
                    label: "美元",
                    }, {
                    value: "35",
                    label: "欧元",
                    }, {
                    value: "39",
                    label: "加拿大元",
                    }, {
                    value: "43",
                    label: "英镑",
                    }, {
                    value: "65",
                    label: "日元",
                    }, {
                    value: "69",
                    label: "新加坡元",
                    }, {
                    value: "83",
                    label: "挪威克朗",
                    }, {
                    value: "87",
                    label: "瑞士法郎",
                    }, {
                    value: "88",
                    label: "瑞典克朗",
                    }, {
                    value: "97",
                    label: "外币折美元",
                    }, {
                    value: "98",
                    label: "全折美元",
                    }, {
                    value: "99",
                    label: "全折人民币",
                    }],
                bustypes:[],
                currentBusTypes: [],
                historyList: [],
                loading:true,
                //历史业务
                pageSizeHistory: 100,
                pageIndexHistory: 1,
                pageTotalHistory: 0,
                //修改视图
                modifyVisible: false,
                //excel视图
                excelVisible: false,
                //流程视图
                progressVisible:false,
                //多选框
                multipleSelection: [],
                bus:{
                    busteam:"",
                    bustype:"",
                    resSdate:"",
                    resEdate:"",
                    lowrisk:"",
                },
                modifys:{
                    busId:"",
                    busTeam:"",
                    cusName:"",
                    busType:"",
                    busPname:"",
                    other:"",
                    currency:"",
                    amount:"",
                    busManager:"",
                    busNumber:"",
                    warType:"",
                    collateral:"",
                    lowRisk:"",
                    undCredit:"",
                    greCredit:"",
                    extLoan:"",
                    facSize:"",
                    entType:"",
                },
                //导出Excel
                excelForm: {
                    excelName: "",
                    reserveSdate: "",
                    reserveEdate: "",
                    busTeam: true,
                    cusName: true,
                    busPname: true,
                    warType: true,
                    collateral: true,
                    currency: true,
                    amount: true,
                    busNumber: true,
                    lowRisk: true,
                    undCredit: true,
                    greCredit: true,
                    extLoan: true,
                    magYst: true,
                    busManager: true,
                    entType: true,
                    facSize: true,
                    reservePeo: true,//预约人
                    reserveDate: true,//预约时间
                    wReceiveCon: true,//待接件耗时
                    receivePeo: true,//接件人
                    receiveCon:true,//接件耗时
                    receiveHangCon: true,//接件挂件耗时
                    wFirstAudCon: true,//待初审耗时
                    firstAudPeo: true,//初审人
                    firstAudCon: true,//初审耗时
                    firstHangCon: true,//初审挂件耗时
                    wSecondAudCon: true,//待复核耗时
                    secondAudPeo: true,//复核人
                    secondAudCon: true,//复核耗时
                    secondHangCon: true,//复核挂件耗时
                    wReleaseCon: true, //待放款耗时
                    releasePeo: true,//放款人
                    releaseCon: true,//放款耗时
                    allTimeComsume: true//总耗时
                },
                //导出excel时间规则
                excelRules: {
                    reserveSdate: [{ required: true, message: "起始时间不能为空", trigger: "blur" }],
                    reserveEdate: [{ required: true, message: "结束时间不能为空", trigger: "blur" }]
                },
                //全选
                checkAll: true,
                //当前行高亮显示
                currentRow: {},
                //-------------------------------流程数据-------------------------------------------
                timeLine:[],
                mark:'',
                ystId:'',
                userName:'',
                //限定
                rules: {
                    busTeam: [{ required: true, message: "请输入业务团队", trigger: "blur" }],
                    cusName: [{ required: true, message: "请输入客户姓名", trigger: "blur" }],
                    busType: [{ required: true, message: "请输入业务品种", trigger: "blur" }],
                    busPname: [{ required: true, message: "请输入业务品种", trigger: "blur" }],
                    currency: [{ required: true, message: "请输入币种", trigger: "blur" }],
                    amount: [{ required: true, message: "请输入金额", trigger: "blur" }],
                    busManager: [{ required: true, message: "请输入客户经理", trigger: "blur" }],
                    busNumber: [{ required: true, message: "请输入业务编号", trigger: "blur" }],
                    warType: [{ required: true, message: "请输入担保方式", trigger: "blur" }],
                    collateral: [{ required: true, message: "请输入质押物", trigger: "blur" }],
                    lowRisk: [{ required: true, message: "请输入低风险", trigger: "blur" }],
                    undCredit: [{ required: true, message: "请输入授信项下", trigger: "blur" }],
                    greCredit: [{ required: true, message: "请输入绿色信贷", trigger: "blur" }],
                    extLoan: [{ required: true, message: "请输入外包内贷", trigger: "blur" }],
                    facSize: [{ required: true, message: "请输入企业规模", trigger: "blur" }],
                    entType: [{ required: true, message: "请输入行业类型", trigger: "blur" }]
                }
            }
        },
        methods: {

            amountFormat(row,column){
                return row.amount.toLocaleString()
            },
            
            //将值通过双向绑定来点击修改按钮，修改业务信息
            async updateBus() {
                const { data: res } = await this.$http.put("/basicInfo/updatebusinfo",this.modifys);
                if (res.code === 200) {
                    this.$message.success(res.msg);
                    this.modifyVisible = false;
                    this.getHistoryList();
                }
            },

            //获得业务品种
            async getTypes(){
                const { data: res } = await this.$http.get("/hello/bustypelist");
                if (res.code !== 200) {
                    return this.$message.error(res.msg);
                }
                this.bustypes=res.data;
            },
            
            //获得启用的业务品种
            async getCurrentTypes(){
                const { data: res } = await this.$http.get("/hello/currentBusTypes");
                if (res.code !== 200) {
                    return this.$message.error(res.msg);
                }
                this.currentBusTypes=res.data;
            },

            //选择复选框，修改按钮进行修改
            async modify() {
                if (this.multipleSelection.length === 0) {
                    return this.$message.warning("请勾选要修改的数据");
                }else if(this.multipleSelection.length > 1) {
                    return this.$message.warning("请对一条数据进行修改");
                }
                this.modifyVisible = true;
                var arr = [];
                arr.push(this.multipleSelection[0].busId);
                const id = arr;
                const { data: res } = await this.$http.get(`basicInfo/selectbyid/${id}`);
                if (res.code === 200) {
                    Object.assign(this.modifys,res.data);
                    this.modifys.lowRisk = "1";
                    this.modifys.greCredit = "1";
                    this.modifys.undCredit = "1";
                    this.modifys.extLoan = "1";
                } else {
                    this.$message.error("业务信息修改失败");
                }
            },

            //导出Excel
            excel(){
                this.excelVisible = true;
            },

            validExcel(){
                this.$refs.excelRef.validate(valid => {
                    if (valid) {
                        if (this.excelForm.reserveSdate <= this.excelForm.reserveEdate){
                            this.toExcel();
                            return true;
                        }
                        this.$message.error("起始时间须小于结束时间");
                        return false;
                    }
                    this.$message.error('请填写正确的信息');
                });
            },

            async toExcel(){
                let options = [];
                const excelForm = this.excelForm;
                for (let key of Object.keys(excelForm)) {
                    if (key === 'endTime' || key === 'startTime') {
                        continue;
                    }
                    if (!excelForm[key]) {
                        continue;
                    }
                    options.push(key);
                }
                let url = `/toexcel/download/${excelForm.reserveSdate}/${excelForm.reserveEdate}?options=${options.join(',')}&excelname=${excelForm.excelName}`
                const response = await this.$http.get(url,{
                    responseType: 'blob',
                });
                const blob = new Blob([response.data]);
                //console.log('respose', response.headers['content-disposition']);
                const A = document.createElement('A');//创建标签
                const uri = window.URL.createObjectURL(blob);//创建链接
                const contentDisposition = response.headers['content-disposition'];
                const  filename = contentDisposition.split('=')[1];
                A.download = filename;//下载文件名字
                A.href = uri;
                A.click();
                window.URL.revokeObjectURL(uri);//关闭
                this.excelVisible = false;
                this.resetForm();
            },

            //全选
            handleCheckAllChange(){
                for(let item of Object.keys(this.excelForm)){
                    if (typeof this.excelForm[item] !== "boolean") {
                        continue;
                    }
                    this.excelForm[item] = this.checkAll;
                }
            },

            handleCheckItemChange(name){
                if (!this.excelForm[name]) {
                    this.checkAll = false;
                    return void 0;
                }
                let checkAll = true;
                for (let item of Object.keys(this.excelForm)) {
                    if (typeof this.excelForm[item] !== "boolean") {
                        continue;
                    }
                    if (!this.excelForm[item]) {
                        checkAll = false;
                        break;
                    }
                }
                this.checkAll = checkAll;
            },

            //多选框选中的内容
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            //获得所有历史业务的函数
            async getHistoryList() {
                const { data: res } = await this.$http.get("/basicInfo/submithistory",{
                    params: {
                        pageIndex: this.pageIndexHistory,
                        pageSize: this.pageSizeHistory,
                        flag: this.character,
                        audNow: sessionStorage.getItem("ystId")
                    }
                });
                if (res.code !== 200) {
                    return this.$message.error(res.msg);
                }
                this.historyList = res.data.list;
                this.loading=false;
                this.pageTotalHistory = res.data.total;
            },

            //为了搜索时重置页码
            handleHistorySearch(){
                this.pageIndexHistory =  1;
                this.pageSizeHistory = 100;
                this.historySearch();
            },

            //搜索历史业务的函数
            async historySearch() {
                const { data: res } = await this.$http.get(
                    "/basicInfo/querysubmithistory",
                    {
                        params: {
                            flag: this.character,
                            audNow: sessionStorage.getItem("ystId"),
                            pageIndex: this.pageIndexHistory,
                            pageSize: this.pageSizeHistory,
                            busteam: this.bus.busteam,
                            bustype: this.bus.bustype,
                            resSdate: this.bus.resSdate,
                            resEdate: this.bus.resEdate,
                            lowrisk: this.bus.lowrisk
                        },
                    }
                );
                if (res.code === 200) {
                    this.historyList = res.data.list;
                    this.pageTotalHistory = res.data.total;
                }
            },

            //历史业务，每页显示的条数
            handleSizeChangeHistory(val) {
                this.pageSizeHistory = val;
                if(this.bus.busteam === ''&&this.bus.bustype === ''&&this.bus.lowrisk === ''&&this.bus.resdate === ''){
                    this.getHistoryList();
                }else{
                    this.historySearch();
                }
            },

            //历史业务，查询当前页，监听页码值改变的事件
            handleCurrentChangeHistory(val) {
                this.pageIndexHistory = val;
                if(this.bus.busteam === ''&&this.bus.bustype === ''&&this.bus.lowrisk === ''&&this.bus.resdate === ''){
                    this.getHistoryList();
                }else{
                    this.historySearch();
                }
            },

            //关闭视图
            handleClose() {
                this.modifyVisible = false;
                this.excelVisible = false;
                this.progressVisible = false;
                this.resetForm();
            },

            //表单验证
            validForm() {
                this.$refs.recieveBus.validate(valid => {
                    if (valid) {
                        this.updateEmp();
                        this.getHistoryList();
                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
            },

            modifySubmit() {
                this.$refs.modifyBus.validate(valid => {
                    if (valid) {
                        this.updateBus();
                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
            },

            //删除业务信息
            delBus(row) {
                this.$confirm("此操作将删除该业务的信息, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this.$http.delete(`basicInfo/deletebus/${row.busId}`)
                            .then(successResponse => {
                                if (successResponse.data.code === 200) {
                                    this.$message.success(successResponse.data.msg);
                                    this.getHistoryList();
                                }
                                if (successResponse.data.code === 400) {
                                    this.$message.error(successResponse.data.message);
                                }
                            }).catch(failResponse => {
                            console.log("删除失败");
                        });
                    })
                    .catch(() => {
                        this.$message({
                            type: "info",
                            message: "已取消操作"
                        });
                    });
            },

            //---------------------------------流程-------------------------------------------------------
            async progress(row) {
                this.progressVisible = true;
                const { data: res } = await this.$http.get(`busProgress/timeline/${row.busId}`);
                if (res.code === 200) {
                    this.timeLine = res.data;
                } else {
                    this.$message.error("获取业务流程信息失败");
                }
            },

            //点击的行进行高亮显示
            getRowClassName({ row }) {
                return row.busId === this.currentRow.busId ? 'current-row' : '';
            },

            handleSelectRow(row, event, cloumn) {
                this.currentRow = row;
            },

            //重置表单数据
            resetForm() {
                if(this.$refs.modifyBus !== undefined){
                    this.$refs.modifyBus.resetFields();
                }
                if(this.$refs.excelRef !== undefined){
                    this.$refs.excelRef.resetFields();
                }
            },

        },

        created: function() {
            var mark = sessionStorage.getItem("mark");
            var userName = sessionStorage.getItem("userName");
            var ystId = sessionStorage.getItem("ystId");
            this.mark = mark;
            this.userName = userName;
            this.ystId = ystId;
        },

        mounted:function(){
            this.getTypes();
            this.getCurrentTypes();
        }
    }
</script>

<style>
.el-table th {
    display: table-cell!important;
}
</style>