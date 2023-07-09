<template>
    <div id="busList">
        <!--------------------面包屑导航----------------------------->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item>首页</el-breadcrumb-item>
            <el-breadcrumb-item>业务列表</el-breadcrumb-item>
            <el-breadcrumb-item>普通业务</el-breadcrumb-item>
        </el-breadcrumb>
        <!-------------------卡片视图区域----------------------------->
        <el-card >
            <el-tabs v-model="activeName" @tab-click="tabClick">
                <el-tab-pane label="业务列表" name="AUD_MAG" v-if="mark === 'AUD_MAG'">
                    <handle-list ref="manageBus" character="AUD_MAG"></handle-list>
                </el-tab-pane>
                <el-tab-pane label="接件业务" name="AUD_REC">
                    <handle-list ref="receiveBus" character="AUD_REC"></handle-list>
                </el-tab-pane>
                <el-tab-pane label="初审业务" name="AUD_FIR" v-if="mark !== 'AUD_REC'">
                    <handle-list ref="firstAudBus" character="AUD_FIR"></handle-list>
                </el-tab-pane>
                <el-tab-pane label="复核业务" name="AUD_SEC" v-if="mark !== 'AUD_REC'">
                    <handle-list ref="secondAudBus" character="AUD_SEC"></handle-list>
                </el-tab-pane>
                <el-tab-pane label="放款业务" name="AUD_REL" v-if="mark !== 'AUD_REC'">
                    <handle-list ref="relBus" character="AUD_REL"></handle-list>
                </el-tab-pane>
                <el-tab-pane label="历史接件" name="AUD_REC_HIS">
                    <handle-history-list ref="receiveBusHis" character="AUD_REC"></handle-history-list>
                </el-tab-pane>
                <el-tab-pane label="历史初审" name="AUD_FIR_HIS" v-if="mark !== 'AUD_REC'">
                    <handle-history-list ref="firstAudBusHis" character="AUD_FIR"></handle-history-list>
                </el-tab-pane>
                <el-tab-pane label="历史复核" name="AUD_SEC_HIS" v-if="mark !== 'AUD_REC'">
                    <handle-history-list ref="secondAudBusHis" character="AUD_SEC"></handle-history-list>
                </el-tab-pane>
                <el-tab-pane label="历史放款" name="AUD_REL_HIS" v-if="mark !== 'AUD_REC'">
                    <handle-history-list ref="relBusHis" character="AUD_REL"></handle-history-list>
                </el-tab-pane>
                <!----------------------我的挂件子部分------------------>
                <el-tab-pane label="待完善业务" name="hang">
                    <!----------------------我的挂件表单-------------->

                    <!-- V3 挂件人员下拉搜索框 -->
                    <el-form  ref="searchForm" v-model="searcHangBus" style="width: 100%" >
                        <el-row style="width: 100%">
                                    <el-col :span="4">
                                        <el-form-item label="审核人员" >
                                            <el-select v-model="searcHangBus.staffInfo" clearable placeholder="请选择" style="width: 70%">
                                                <el-option
                                                        v-for="item in staffNames"
                                                        :key="item.staffName"
                                                        :label="`${item.staffName}@${item.staffYST}`"
                                                        :value="item.staffYST">
                                                </el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="5">
                                    <el-form-item label="管户团队">
                                        <el-select v-model="searcHangBus.busTeam" clearable placeholder="请选择" style="width: 70%">
                                            <el-option
                                                    v-for="item in busteams"
                                                    :key="item"
                                                    :label="item"
                                                    :value="item">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="5">
                                    <el-form-item label="客户名称">
                                        <el-input v-model="searcHangBus.cusName" placeholder="请输入......" style="width: 70%">
                                        </el-input>
                                    </el-form-item>
                                </el-col>
                                <el-col :span="6">
                                <el-form-item label="客户经理" >
                                    <el-autocomplete class='inline-input' 
                                    :popper-append-to-body="false"
                                    popper-class="select-option"
                                    autocomplete="off"  
                                    v-model="searcHangBus.state" 
                                    :fetch-suggestions="querySearchAsync" 
                                    placeholder="姓名/6位一事通ID" 
                                    :trigger-on-focus="false" 
                                    @select="handSelect"
                                    :clearable="true"
                                    @clear="clearSearch"
                                    ref="elautocomplete"
                                    style="width:70%;">
                                    </el-autocomplete>
                                </el-form-item>
                            </el-col>
                            <!-- 添加结束 -->
                            <el-col :span="4">
                                <el-form-item >
                                    <el-button  @click="handlePauditingSearch" type="primary"  icon="el-icon-search" v-preventReClick>查询</el-button>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>

                    <div style="margin:30px 0 0">
                        <el-table
                                v-loading="loading"
                                ref="multipleTable"
                                :data="hangList"
                                tooltip-effect="dark"
                                :border="true"
                                :highlight-current-row="true"
                                @selection-change="handleSelectionChange"
                                max-height="530px"
                                size="small"
                                style="width: 100%"
                        >
                            <!--table表单中的 prop 为controller数据源的列名，label为姓名，scope.row为拿到这一行的数据-->
                            <!--<el-table-column type="selection" width="40"></el-table-column>-->
                            <el-table-column type="selection" width="0"></el-table-column>
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
                            <el-table-column prop="proName" label="审查人员"  align="center"></el-table-column>
                            <el-table-column prop="resDate" label="挂件日期"  align="center"></el-table-column>
                            <el-table-column prop="resStime" label="挂件时间"  align="center"></el-table-column>

                            <el-table-column fixed="right" label="处理" v-if="this.mark === 'AUD_REC'" align="center" width="125%">
                                <!--type为样式，editEmp是一个方法，在后面methods是定义了的-->
                                <template slot-scope="scope">
                                    <el-button
                                            v-show="scope.row.befState == '01' "
                                            @click="receiveUndoBox(scope.row)"
                                            size="small"
                                            type="text"
                                            :disabled="receiveUndoBoxDisable"
                                            v-preventReClick
                                    >欠缺已完善(接件)</el-button>
                                </template>
                            </el-table-column>
                            <el-table-column fixed="right" label="处理" v-if="this.mark !== 'AUD_LED' && this.mark !== 'AUD_REC' " align="center" width="125%">
                                <!--type为样式，editEmp是一个方法，在后面methods是定义了的-->
                                <template slot-scope="scope">
                                    <el-button
                                            v-show="scope.row.befState == '01' "
                                            @click="receiveUndoBox(scope.row)"
                                            size="small"
                                            type="text"
                                            :disabled="receiveUndoBoxDisable"
                                            v-preventReClick
                                    >欠缺已完善(接件)</el-button>
                                    <el-button
                                            v-show="scope.row.befState == '03' "
                                            @click="firstUndoDialog(scope.row)"
                                            size="small"
                                            type="text"
                                            v-preventReClick
                                    >欠缺已完善(初审)</el-button>
                                    <el-button
                                            v-show=" scope.row.befState == '05'  "
                                            @click="secondUndo(scope.row, scope.$index)"
                                            size="small"
                                            type="text"
                                            :disabled="scope.row.disabled === undefined ? false:scope.row.disabled"
                                    >欠缺已完善(复核)</el-button>
                                </template>
                            </el-table-column>
                        </el-table>
                    </div>
                    <!-- 分页区域，layout展示页面上展示哪些功能组件，total总共有多少条数据  -->
                    <div class="block">
                        <el-pagination
                                @size-change="handleSizeChangeHang"
                                @current-change="handleCurrentChangeHang"
                                :current-page.sync="pageIndexHang"
                                :page-sizes="[100, 200, 300, 400]"
                                :page-size.sync="pageSizeHang"
                                layout="total, sizes, prev, pager, next, jumper"
                                :total="pageTotalHang"
                        ></el-pagination>
                    </div>
                </el-tab-pane>
            </el-tabs>
            <!--------------------------------------------  弹窗选择视图---------------------------------->
            <!-------------------接件修改业务视图------------------------>		
            <el-dialog		
                title="接件修改业务信息"		
                :visible.sync="updateReceiveVisible"		
                :close-on-click-modal="false"		
                :before-close="handleClose"		
                width="35%"		
                height="50%"		
                center		
            >		
                <el-form ref="recieveBus" :rules="rules" label-width="80px" :model="recieve" size="small">		
                    <el-row>		
                        <el-col>		
                            <el-form-item label="业务团队" prop="busTeam" style="width: 100%">		
                                <el-input v-model="recieve.busTeam" ></el-input>		
                            </el-form-item>		
                        </el-col>		
                    </el-row>		
                    <el-row>		
                        <el-col>		
                            <el-form-item label="客户名称" prop="cusName" style="width: 100%">		
                                <el-input v-model="recieve.cusName"></el-input>		
                            </el-form-item>		
                        </el-col>		
                    </el-row>		
                    <el-row>		
                        <el-col :span="13">		
                            <el-form-item label="业务品种" prop="busType"  style="width:100%">		
                                <el-select v-model="recieve.busType"   clearable placeholder="请选择" style="width: 60%">		
                                    <el-option		
                                            v-for="item in currentBustypes"		
                                            :key="item.busType"		
                                            :label="item.busPname"		
                                            :value="item.busType">		
                                    </el-option>		
                                </el-select>		
                            </el-form-item>		
                        </el-col>		
                        <el-col :span="11">		
                            <el-form-item label="其他" prop="other" style="width: 100%">		
                                <el-input  v-model="recieve.other"></el-input>		
                            </el-form-item>		
                        </el-col>		
                    </el-row>		
                    <el-row>		
                        <el-col :span="13">		
                            <el-form-item label="币种" prop="currency"  style="width:100%">		
                                <el-select v-model="recieve.currency"  clearable placeholder="请选择"  style="width:60%">		
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
                                <el-input v-model="recieve.amount"></el-input>		
                            </el-form-item>		
                        </el-col>		
                    </el-row>		
                    <el-form-item label="客户经理" prop="busManager" style="width: 100%">		
                        <el-input v-model="recieve.busManager"></el-input>		
                    </el-form-item>		
                    <el-form-item label="业务编号" prop="busNumber" style="width: 100%">		
                        <el-input v-model="recieve.busNumber"></el-input>		
                    </el-form-item>		
                    <el-form-item label="担保方式" prop="warType" style="width: 100%">		
                        <el-input v-model.number="recieve.warType"></el-input>		
                    </el-form-item>		
                    <el-form-item label="质押物" prop="collateral" style="width: 100%">		
                        <el-input v-model="recieve.collateral"></el-input>		
                    </el-form-item>		
                    <el-row>		
                        <el-col :span="13">		
                            <el-form-item label="低风险" prop="lowRisk">		
                                <el-select v-model="recieve.lowRisk">		
                                    <el-option		
                                            v-for="low in lowrisks"		
                                            :key="low.value"		
                                            :label="low.label"		
                                            :value="low.value"		
                                    ></el-option>		
                                </el-select>		
                            </el-form-item>		
                        </el-col>		
                        <el-col :span="11">		
                            <el-form-item label="授信项下" prop="undCredit">		
                                <el-select v-model="recieve.undCredit">		
                                    <el-option		
                                            v-for="und in undcredits"		
                                            :key="und.value "		
                                            :label="und.label "		
                                            :value="und.value ">		
                                    </el-option>		
                                </el-select>		
                            </el-form-item>		
                        </el-col>		
                    </el-row>		
                    <el-row>		
                        <el-col :span="13">		
                            <el-form-item label="绿色信贷" prop="greCredit">		
                                <el-select v-model="recieve.greCredit">		
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
                                <el-select v-model="recieve.extLoan">		
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
                        <el-input v-model="recieve.facSize"></el-input>		
                    </el-form-item>		
                    <el-form-item label="行业类型" prop="entType" style="width: 100%">		
                        <el-input v-model="recieve.entType"></el-input>		
                    </el-form-item>		
                </el-form>		
                <!-- 按钮居中显示 -->		
                <span slot="footer" class="dialog-footer">		
                <el-button type="primary" @click="receiveUndoValid" v-show="this.recieve.audProgess === '5'" v-preventReClick>欠缺已完善</el-button>		
            </span>		
            </el-dialog>
            
            <!--初审解挂弹窗-->
            <el-dialog
                    title="初审解挂选择"
                    :visible.sync="undoBoxChoose"
                    :close-on-click-modal="false"
                    :before-close="handleClose"
                    width="35%"
                    height="59px"
                    center
            >
                <div class="box-choose">
                    <el-form>
                        <el-form-item>
                            <label class="box">是否需要复核</label>
                            <el-radio-group v-model="recheck" class="boxRadiof">
                                <el-radio label="0" :disabled="radioDisable0">否</el-radio>
                                <el-radio label="1" :disabled="radioDisable1">是</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-form>
                </div>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" @click="undoBoxSubmit" :disabled="undoBoxSubmitDisable">提交</el-button>
                </span>
            </el-dialog>
        </el-card>
    </div>
</template>

<script>
    import HandleList from "./HandleList";
    import HandleListHis from "./HandleListHis"

    export default {
        components: {
            'handle-list': HandleList,
            'handle-history-list': HandleListHis
        },
        data() {
            /*获取业务列表数据*/
            return {
                busteams:["国企及新动能团队","汽车团队","房地产团队","机构业务一团队","机构业务二团队","小企业金融部","公司金融客户一部","公司金融客户二部",
                    "公司金融客户四部","公司金融客户五部","公司金融客户六部","公司金融客户八部","公司金融客户九部","公司金融客户十部","公司金融客户十一部","公司金融客户十二部","公司金融客户十三部",
                    "公司金融客户十四部","江津支行公司金融客户部","璧山支行公司金融客户部","长寿支行公司金融客户部","涪陵支行公司金融客户部","永川支行公司金融客户部"],
                staffInfo: '',
                staffNames: [],
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
                currentBustypes:[],
                activeName: "AUD_REC",
                hangList: [],
                loading:true,
                //挂件业务
                pageSizeHang: 100,
                pageIndexHang: 1,
                pageTotalHang: 0,
                //欠缺已完善（接件）视图
                updateReceiveVisible: false,
                //初审解挂选择
                undoBoxChoose:false,
                //欠缺已完善（接件）数据绑定
                recieve:{
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
                    lowRisk:"1",
                    undCredit:"1",
                    greCredit:"1",
                    extLoan:"1",
                    facSize:"",
                    entType:"",
                },
                //弹窗选择（是否复核）
                recheck:'1',//默认是
                //isShow:true,
                undoBoxRow:'',
                //当前行高亮显示
                currentRow: {},
                //用户信息
                mark:'',
                ystId:'',
                userName:'',
                //挂件搜索表单
                searcHangBus:{
                   staffInfo:"",
                   busTeam:"",
                   cusName:"",
                   state:"",
                   personId: "",
                },
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
                    },
                receiveUndoBoxDisable: false,
                secondUndoDisable: false,
                receiveUndoValidDisable: false,
                undoBoxSubmitDisable: false,
                radioDisable0: false,
                radioDisable1: false
                }
            },

        created: function() {
            this.getStaffNames();
            this.getCurrentTypes();
            var mark = sessionStorage.getItem("mark");
            var userName = sessionStorage.getItem("userName");
            var ystId = sessionStorage.getItem("ystId");
            this.mark = mark;
            this.userName = userName;
            this.ystId = ystId;
            //当是管理角色是刚进来呈现的是业务列表
            if(mark === 'AUD_MAG'){
                this.activeName = "AUD_MAG";
            }
        },
        
        methods: {

            amountFormat(row,column){
                return row.amount.toLocaleString()
            },

            //接件解挂，将信息查询出来，将表单中进行填值
            // async receiveUndoBox(row) {
            //     this.receiveUndoBoxDisable = true;
            //     this.resetForm();
            //     this.getHangList();
            //     const { data: res } = await this.$http.get(`basicInfo/selectbyid/${row.busId}`);
            //     if (res.code === 200) {
            //         this.updateReceiveVisible = true;
            //         Object.assign(this.recieve,res.data);
            //         this.recieve.lowRisk = "1";
            //         this.recieve.greCredit = "1";
            //         this.recieve.undCredit = "1";
            //         this.recieve.extLoan = "1";
            //         this.$message.success("解挂");
            //     } else {
            //         this.$message.error("解挂失败");
            //     }
            //     this.receiveUndoBoxDisable = false;
            // },
            //接件解挂，将信息查询出来，将表单中进行填值
            async receiveUndoBox(row) {
                this.receiveUndoBoxDisable = true;
                this.resetForm();
                this.getHangList();
                // console.log('正在接件解挂......')
                const { data: res } = await this.$http.get(`basicInfo/selectbyid/${row.busId}`);
                if (res.code === 200) {
                    this.updateReceiveVisible = true;
                    // console.log('下面咋'+this.updateReceiveVisible)
                    Object.assign(this.recieve,res.data);
                    this.recieve.lowRisk = "1";
                    this.recieve.greCredit = "1";
                    this.recieve.undCredit = "1";
                    this.recieve.extLoan = "1";
                    this.$message.success("解挂");
                    // console.log('接件解挂成功......')
                } else {
                    this.$message.error("解挂失败");
                }
                this.receiveUndoBoxDisable = false;
            },

            //点击标签卡片
            tabClick(tab) {
                if(this.timer){
                    clearInterval(this.timer);
                    this.timer = null;
                }
                //点击我的挂件标签
                if (tab.name === "hang") {
                    this.getHangList();
                }
                //点击接件标签
                if (tab.name === "AUD_REC") {
                    this.$refs.receiveBus.pageIndex = 1;
                    this.$refs.receiveBus.pageSize = 100;
                    this.$refs.receiveBus.getBusList();
                    this.timer = setInterval(this.$refs.receiveBus.search, 180000);
                    //当点击别的标签的时候将搜索栏清空
                    for (var i in this.$refs.receiveBus.bus) {
                        this.$refs.receiveBus.bus[i] = "";
                        this.$refs.receiveBus.multipleSelection = [];
                    }}
                //点击初审标签
                if (tab.name === "AUD_FIR") {
                    this.$refs.firstAudBus.pageIndex = 1;
                    this.$refs.firstAudBus.pageSize = 100;
                    this.$refs.firstAudBus.getBusList();
                    this.timer = setInterval(this.$refs.firstAudBus.search, 180000);
                    //当点击别的标签的时候将搜索栏清空
                    for (var i in this.$refs.firstAudBus.bus) {
                        this.$refs.firstAudBus.bus[i] = "";

                    }}
                //点击复核标签
                if (tab.name === "AUD_SEC") {
                    this.$refs.secondAudBus.pageIndex = 1;
                    this.$refs.secondAudBus.pageSize = 100;
                    this.$refs.secondAudBus.getBusList();
                    this.timer = setInterval(this.$refs.secondAudBus.search, 180000);
                    //当点击别的标签的时候将搜索栏清空
                    for (var i in this.$refs.secondAudBus.bus) {
                        this.$refs.secondAudBus.bus[i] = "";
                    }}
                //点击放款标签
                if (tab.name === "AUD_REL") {
                    this.$refs.relBus.pageIndex = 1;
                    this.$refs.relBus.pageSize = 100;
                    this.$refs.relBus.getBusList();
                    this.timer = setInterval(this.$refs.relBus.search, 180000);
                    //当点击别的标签的时候将搜索栏清空
                    for (var i in this.$refs.relBus.bus) {
                        this.$refs.relBus.bus[i] = "";
                    }}
                //点击接件历史标签
                if (tab.name === "AUD_REC_HIS") {
                    this.$refs.receiveBusHis.pageIndexHistory = 1;
                    this.$refs.receiveBusHis.pageSizeHistory = 100;
                    this.$refs.receiveBusHis.getHistoryList();
                    this.timer = setInterval(this.$refs.receiveBusHis.historySearch, 180000);
                    //当点击别的标签的时候将搜索栏清空
                    for (var i in this.$refs.receiveBusHis.bus) {
                        this.$refs.receiveBusHis.bus[i] = "";
                        this.$refs.receiveBusHis.multipleSelection = [];
                    }}
                //点击初审历史标签
                if (tab.name === "AUD_FIR_HIS") {
                    this.$refs.firstAudBusHis.pageIndexHistory = 1;
                    this.$refs.firstAudBusHis.pageSizeHistory = 100;
                    this.$refs.firstAudBusHis.getHistoryList();
                    this.timer = setInterval(this.$refs.firstAudBusHis.historySearch, 180000);
                    //当点击别的标签的时候将搜索栏清空
                    for (var i in this.$refs.firstAudBusHis.bus) {
                        this.$refs.firstAudBusHis.bus[i] = "";
                    }}
                //点击复核历史标签
                if (tab.name === "AUD_SEC_HIS") {
                    this.$refs.secondAudBusHis.pageIndexHistory = 1;
                    this.$refs.secondAudBusHis.pageSizeHistory = 100;
                    this.$refs.secondAudBusHis.getHistoryList();
                    this.timer = setInterval(this.$refs.secondAudBusHis.historySearch, 180000);
                    //当点击别的标签的时候将搜索栏清空
                    for (var i in this.$refs.secondAudBusHis.bus) {
                        this.$refs.secondAudBusHis.bus[i] = "";
                    }}
                //点击放款历史标签
                if (tab.name === "AUD_REL_HIS") {
                    this.$refs.relBusHis.pageIndexHistory = 1;
                    this.$refs.relBusHis.pageSizeHistory = 100;
                    this.$refs.relBusHis.getHistoryList();
                    this.timer = setInterval(this.$refs.relBusHis.historySearch, 180000);
                    //当点击别的标签的时候将搜索栏清空
                    for (var i in this.$refs.relBusHis.bus) {
                        this.$refs.relBusHis.bus[i] = "";
                    }}
                //点击业务列表标签
                if (tab.name === "AUD_MAG") {
                    this.$refs.manageBus.pageIndexHistory = 1;
                    this.$refs.manageBus.pageSizeHistory = 100;
                    this.$refs.manageBus.getHistoryList();
                    this.timer = setInterval(this.$refs.manageBus.historySearch, 180000);
                    //当点击别的标签的时候将搜索栏清空
                    for (var i in this.$refs.manageBus.bus) {
                        this.$refs.manageBus.bus[i] = "";
                    }}
            },
        
            //接件解挂提交
            async receiveUndo() {
                //關閉接件彈框
                this.updateReceiveVisible = false;
                //關閉彈窗后立刻將“待完善欠缺（接件）”按鈕禁用，後端處理完再放開
                this.receiveUndoBoxDisable = true;
                const { data: res } = await this.$http.put(`busProgress/receiveundo`,this.recieve);
                if (res.code === 200) {
                    this.recieve = res.data;
                    this.recieve.lowRisk = "1";
                    this.recieve.greCredit = "1";
                    this.recieve.undCredit = "1";
                    this.recieve.extLoan = "1";
                    this.getHangList();
                    this.$message.success("接件解挂成功");
                    //彈窗消失
                    this.receiveUndoValidDisable = false;
                    this.receiveUndoBoxDisable = false;
                } else if(res.code === 996){
                    this.$alert(res.msg,'提示',{//请勿重复解挂
                            confirmButtonText:'确定',
                            callback:action => {
                                this.$message({
                                    type:'warning',
                                    message:res.msg
                                });
                            }
                        }
                    )
                    //彈窗消失
                    this.receiveUndoValidDisable = false;
                    this.receiveUndoBoxDisable = false;
                }else{
                    this.$message.error("接件解挂失败");
                    //彈窗消失
                    this.receiveUndoValidDisable = false;
                    this.receiveUndoBoxDisable = false;
                }
            },

            //初审解挂按钮，弹出dialog
            async firstUndoDialog(row) {
                this.undoBoxChoose = true;
                this.undoBoxRow = row;
            },

            async undoBoxSubmit(){
                // console.log('undoBoxSubmit开始')
                this.undoBoxSubmitDisable = true;
                if (this.recheck==="0"){
                    //console.log("不需要复核");
                    this.radioDisable0 = true;
                    this.radioDisable1 = true;
                    const { data: res } =  await this.$http.put(`busProgress/firstundo`,this.undoBoxRow);
                    this.radioDisable0 = false;
                    this.radioDisable1 = false;
                    this.undoBoxChoose = false;
                    if (res.code === 200) {
                        this.getHangList();
                        this.$message.success(res.msg);
                        this.undoBoxSubmitDisable = false;
                    } else {
                        this.$message.error(res.msg);
                        this.undoBoxSubmitDisable = false;
                    }
                }
                if (this.recheck==="1"){
                    //console.log("需要复核");
                    this.radioDisable0 = true;
                    this.radioDisable1 = true;
                    const { data: res } =  await this.$http.put(`busProgress/firstundoreaud`,this.undoBoxRow);
                    this.radioDisable0 = false;
                    this.radioDisable1 = false;
                    this.undoBoxChoose = false;
                    if (res.code === 200) {
                        this.getHangList();
                        this.$message.success(res.msg);
                        this.undoBoxSubmitDisable = false;
                    } else {
                        this.$message.error(res.msg);
                        this.undoBoxSubmitDisable = false;
                    }
            }
            // console.log('undoBoxSubmit结束')
            },

            //初审解挂，不需复核
            async firstUndo(row) {
                const { data: res } = await this.$http.put(`busProgress/firstundo`,row);
                if (res.code === 200) {
                    this.getHangList();
                    this.$message.success(res.msg);
                } else {
                    this.$message.error("初审解挂失败");
                }
            },

            //复核解挂
            async secondUndo(row,index) {
                row.disabled = true
                // console.log('我在执行secondUndo函数开头......',row.busId)
                row.audChar=this.mark;
                row.audName=this.userName;
                row.audNow=this.ystId;
                const { data: res } = await this.$http.put(`busProgress/secondundo`,row);
                if (res.code === 200) {
                    await this.getHangList();
                    this.$message.success(res.msg);
                    // console.log('我在执行secondUndo函数末尾......')
                } else {
                    this.$message.error("复核解挂失败");
                    // console.log('我在执行secondUndo函数末尾......')
                }
                this.hangList[index].disabled = false
                this.$set(this.hangList, index, this.hangList[index])
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
                this.currentBustypes=res.data;
            },

            //获得所有挂件业务的函数
            async getHangList() {
                // console.log('我在执行getHangList开始')
                const { data: res } = await this.$http.get("/basicInfo/hangpool",{
                    params: {
                        pageIndex: this.pageIndexHang,
                        pageSize: this.pageSizeHang,
                        flag: this.mark
                    },
                    headers:{
                        audNow: sessionStorage.getItem("ystId")
                    }
                });
                if (res.code !== 200) {
                    return this.$message.error(res.msg);
                }
                // console.log('业务详情：',res.data)
                this.hangList = res.data.list;
                // console.log('我在执行getHangList末尾')
                this.loading=false;
                this.pageTotalHang = res.data.total;
            },

            //我的挂件，每页显示的条数
            handleSizeChangeHang(val) {
                this.pageSizeHang = val;
                this.getHangList();
            },

            //我的挂件，查询当前页，监听页码值改变的事件
            handleCurrentChangeHang(val) {
                this.pageIndexHang = val;
                this.getHangList();
            },

            //关闭视图
            handleClose() {
                this.updateReceiveVisible = false;
                this.undoBoxChoose = false;
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

            receiveUndoValid() {
                this.$refs.recieveBus.validate(valid => {
                    if (valid) {
                        this.receiveUndo();
                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
            },

            //点击的行进行高亮显示
            getRowClassName({ row }) {
                return row.busId === this.currentRow.busId ? 'current-row' : '';
            },

            handleSelectRow(row, event, cloumn) {
                this.currentRow = row;
            },

            //多选框选中的内容
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            //重置表单数据
            resetForm() {
                if(this.$refs.recieveBus !== undefined){
                    this.$refs.recieveBus.resetFields();
                }
            },

            //获取待完善界面的审核人员列表
            async getStaffNames(){
                // console.log('我在执行getStaffNames函数()')
                const { data: res } = await this.$http.get("/v3/getStaffNames");
                if (res.code !== 200) {
                    return this.$message.error(res.msg);
                }
                this.staffNames=res.data;
                // console.log('getStaffNames执行结果：'+res.code)
                // console.log('getStaffNames执行结果：'+res.data)
                // console.log('getStaffNames执行结果：'+res.data.list)
            },

            //获取建议输入列表
            async querySearchAsync(queryString, cb){
                // console.log('获取输入值：',this.searcHangBus.state)
                const { data: res} = await this.$http.get("/v2/searchPerson",{
                    params: {
                        state: this.searcHangBus.state,
                        token: sessionStorage.getItem('token')
                    }
                });
                if(res.code === 200) { 
                    // console.log('返回结果：',res.data)
                    this.personlist = res.data;
                    // console.log('aaaaaaaaaaaaaaaaa',this.personlist);
                    var results = this.personlist.map(item => {
                        // console.log('bbb',item.chsName)
                        return {value : item.chsName + '@' +item.userId + '@' + item.orgName, personId: item.userId}
                    })
                    // console.log('cccccccccc',results)
                    
                    cb(results)
                    this.$refs.elautocomplete.handleFocus()
                } else {
                    console.log('返回失败')
                }
            },

            handSelect(item){
                // console.log(item)
                //绑定输入框的值为选择框的personName属性
                this.searcHangBus.state = item.value
                this.searcHangBus.personId = item.personId
            },

            clearSearch(){
                // console.log('我要关闭了')
                this.searcHangBus.personId = ""
            },

            //查询某人的挂件业务
            async handlePauditingSearch(){
                const { data: res } = await this.$http.get("/v3/getStaffBusi",{
                    params: {
                        staffYST: this.searcHangBus.staffInfo,
                        busTeam: this.searcHangBus.busTeam,
                        cusName: this.searcHangBus.cusName,
                        busManager: this.searcHangBus.personId,
                        pageIndex: this.pageIndexHang,
                        pageSize: this.pageSizeHang
                    },
                });
                if (res.code !== 200) {
                    return this.$message.error(res.msg);
                }
                this.hangList = res.data.list;
                this.loading=false;
                this.pageTotalHang = res.data.total;
            },
        },

        

        mounted:function(){
            if(this.timer){
                clearInterval(this.timer);
                this.timer = null;
            }
            if(this.activeName === "AUD_REC") {
                this.timer = setInterval(this.$refs.receiveBus.search, 180000);
            }
            /*else if (this.activeName  === "AUD_FIR"){
                this.timer = setInterval(this.$refs.firstAudBus.search, 1000);
            }else if (this.activeName  === "AUD_SEC"){
                this.timer = setInterval(this.$refs.secondAudBus.search, 1000);
            }else if (this.activeName  === "AUD_REL"){
                this.timer = setInterval(this.$refs.relBus.search, 1000);
            }else if (this.activeName  === "AUD_REC_HIS"){
                this.timer = setInterval(this.$refs.receiveBusHis.historySearch, 1000);
            }else if (this.activeName  === "AUD_FIR_HIS"){
                this.timer = setInterval(this.$refs.firstAudBusHis.historySearch, 1000);
            }else if (this.activeName  === "AUD_SEC_HIS"){
                this.timer = setInterval(this.$refs.secondAudBusHis.historySearch, 1000);
            }else if (this.activeName  === "AUD_REL_HIS"){
                this.timer = setInterval(this.$refs.relBusHis.historySearch, 1000);
            }else if (this.activeName  === "AUD_MAG"){
                this.timer = setInterval(this.$refs.manageBus.historySearch, 1000);
            }*/
        },
        beforeDestroy(){
            clearInterval(this.timer);
        }
    }
</script>
<style>
    .el-table {
        /* 表格外边框20px */
        margin-top: 20px;
        margin-bottom: 30px;
        text-align: center;
    }
    .el-input-group__prepend {
        background-color: #fff;
    }
    .el-select {
        width: 100px;
    }
    .tittle {
        text-align: center;
    }
    .dialog{
        text-align: center;
    }
    .box{
        font-size: 15px;
        display: inline-block;
        width: 30%;
    }
    .block{
        display: inline-block;
        overflow:auto
    }
    .check-boxes{
        margin-top: 23px;
        display: inline-block;
    }
    .el-checkbox.is-bordered.is-checked{
        border-color: #409EFF;
        width: 135px;
    }
    .excel-button{
        text-align: right;
        margin-top: 45px;
    }
    .el-checkbox.is-bordered {
        padding: 9px 20px 9px 10px;
        border-radius: 4px;
        border: 1px solid #DCDFE6;
        box-sizing: border-box;
        line-height: normal;
        height: 40px;
        width:110px;
    }
    body {
        margin: 0;
    }
    .box-choose {
        height: 179px;
    }
    .el-form-item {
        margin: 0;
    }
</style>

