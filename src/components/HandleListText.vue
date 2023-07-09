<!---------------------------------- 接件、初审、复核、放款各个流程组件 -------------------------------------->
<template>
    <div>
        <el-form  ref="searchForm" :model="bus" style="width: 100%">
            <!-----------搜索框搜索-------------------->
            <el-row style="width: 100%">
                <el-col :span="5">
                    <el-form-item label="业务团队"  prop="busteam">
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
                    <el-form-item label="业务品种"  prop="bustype">
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
                <el-col :span="7">
                    <el-form-item label="预约日期"  prop="resSdate">
                        <el-date-picker
                                v-model="bus.subSdate"
                                clearable placeholder="开始日期"
                                value-format="yyyy-MM-dd"
                                style="width:35%;">
                        </el-date-picker>
                        <el-date-picker
                                v-model="bus.subEdate"
                                clearable placeholder="结束日期"
                                value-format="yyyy-MM-dd"
                                style="width:35%;">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :span="4">
                    <el-button  @click="handleSearch" type="primary"  icon="el-icon-search" >查询</el-button>
                    <!-- <el-button  @click="modify" type="warning" icon="el-icon-edit" v-show="character === 'AUD_REC'">修改</el-button> -->
                    <el-button  @click="excel" type="info" icon="el-icon-edit" v-show="mark === 'AUD_MAG'">导出Excel</el-button>
                </el-col>
            </el-row>
        </el-form>
        <!---------------------------基础信息表格--------------------------------->
        <div style="margin:30px 0 0">
            <el-table
                    ref="multipleTable"
                    :data="busList"
                    tooltip-effect="dark"
                    :border="true"
                    :highlight-current-row="true"
                    @selection-change="handleSelectionChange"
                    max-height="530px"
                    size="small"
                    style="width: 100%"
                    :row-class-name="getRowClassName"
                    @row-click="handleSelectRow"
            >
                <!--table表单中的 prop 就是controller数据源的列名，label为姓名，scope.row为拿到这一行的数据-->
                <el-table-column v-if="character === 'AUD_REC'" type="selection" width="40"></el-table-column>
                <el-table-column type="index" width="40" align="center"></el-table-column>
                <el-table-column prop="audProgess" label="业务进度" align="center">
                    <!-----后台数字转换为前台汉字----->
                    <template slot-scope="scope">
                        <el-tag type="danger" v-if="scope.row.isGiveUp == '1'">已退件</el-tag>
                        <el-tag  v-if="scope.row.audState == '02' && scope.row.isGiveUp == '0'">待初审</el-tag>
                        <el-tag  v-if="scope.row.audState == '03' && scope.row.isGiveUp == '0'">初审中</el-tag>
                        <el-tag  v-if="scope.row.audState == '04' && scope.row.isGiveUp == '0'">待复核</el-tag>
                        <el-tag  v-if="scope.row.audState == '05' && scope.row.isGiveUp == '0'">复核中</el-tag>
                        <el-tag type="warning" v-if="scope.row.audState == '06' && scope.row.isGiveUp == '0'">待完善</el-tag>
                        <el-tag type="success" v-if="scope.row.audState == '08' && scope.row.isGiveUp == '0' ">已完成</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="busTeam" label="业务团队"  align="center"></el-table-column>
                <el-table-column prop="cusName" label="客户名称" align="center"></el-table-column>
                <el-table-column prop="busPname" label="业务品种" align="center" ></el-table-column>
                <el-table-column prop="busManager" label="客户经理"  align="center"></el-table-column>
                <el-table-column prop="subDate" label="提交日期"  align="center"></el-table-column>
                <el-table-column prop="subTime" label="提交时间"  align="center" width="108"></el-table-column>
                <!-- <el-table-column prop="audName" label="审核人"  align="center"></el-table-column> -->
                <el-table-column fixed="right" label="处理" v-if="this.mark !== 'AUD_LED'"  align="center" width="100%">
                    <!--type为样式，editEmp是一个方法，在后面methods是定义了的-->
                    <template slot-scope="scope">
                        <el-button
                                v-show="(character === 'AUD_FIR' && scope.row.audState == '02') || (character === 'AUD_DOU' && scope.row.audState == '02')"
                                @click="firstAudText(scope.row, scope.$index)"
                                size="small"
                                type="text"
                                v-preventReClick
                                :disabled="scope.row.disabled === undefined ? false:scope.row.disabled"
                        >初审开始</el-button>
                        <!-- <el-button
                                v-show="(character === 'AUD_FIR' && scope.row.audState == '3') || (character === 'AUD_DOU' && scope.row.audState == '3')"
                                @click="firstBusBack(scope.row)"
                                size="small"
                                type="text"
                                v-preventReClick
                        >初审撤回</el-button> -->
                        <el-button
                                v-show="(character === 'AUD_FIR' && scope.row.audState == '03') || (character === 'AUD_DOU' && scope.row.audState == '03')"
                                @click="firstAudHang(scope.row, scope.$index)"
                                size="small"
                                type="text"
                                v-preventReClick
                                :disabled="scope.row.disabled === undefined ? false:scope.row.disabled"
                        >初审待完善</el-button>
                        <el-button
                                v-show="(character === 'AUD_FIR' && scope.row.audState == '03') || (character === 'AUD_DOU' && scope.row.audState == '03')"
                                @click="firstAudOverText(scope.row, scope.$index)"
                                size="small"
                                type="text"
                                style="color:goldenrod"
                                v-preventReClick
                                :disabled="scope.row.disabled === undefined ? false:scope.row.disabled"
                        >初审结束</el-button>
                        <el-button
                                v-show="(character === 'AUD_SEC' && scope.row.audState == '04') || (character === 'AUD_DOU' && scope.row.audState == '04')"
                                @click="secondAud(scope.row, scope.$index)"
                                size="small"
                                type="text"
                                v-preventReClick
                                :disabled="scope.row.disabled === undefined ? false:scope.row.disabled"
                        >复核开始</el-button>
                        <el-button
                                v-show="(character === 'AUD_SEC' && scope.row.audState == '05') || (character === 'AUD_DOU' && scope.row.audState == '05')"
                                @click="secondHang(scope.row, scope.$index)"
                                size="small"
                                type="text"
                                v-preventReClick
                                :disabled="scope.row.disabled === undefined ? false:scope.row.disabled"
                        >复核待完善</el-button>
                        <el-button
                                v-show="(character === 'AUD_SEC' && scope.row.audState == '05') || (character === 'AUD_DOU' && scope.row.audState == '05')"
                                @click="secondAudEnd(scope.row, scope.$index)"
                                size="small"
                                type="text"
                                v-preventReClick
                                style="color:goldenrod"
                                :disabled="scope.row.disabled === undefined ? false:scope.row.disabled"
                        >复核结束</el-button>
                        <el-button
                                v-show="character === 'AUD_REC' || character === 'AUD_MAG'"
                                @click="delBus(scope.row, scope.$index)"
                                size="small"
                                type="text"
                                :disabled="scope.row.disabled === undefined ? false:scope.row.disabled"
                        >删除</el-button>
                        <el-button
                                @click="progress(scope.row, scope.$index)"
                                size="small"
                                type="text"
                                :disabled="scope.row.disabled === undefined ? false:scope.row.disabled"
                        >详情</el-button>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="处理" v-if="this.mark === 'AUD_LED'"  align="center" width="100%">
                    <!--type为样式，editEmp是一个方法，在后面methods是定义了的-->
                    <template slot-scope="scope">
                        <el-button
                                @click="progress(scope.row, scope.$index)"
                                size="small"
                                type="text"
                                :disabled="scope.row.disabled === undefined ? false:scope.row.disabled"
                        >详情</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <!-- 分页区域。layout展示页面上展示那些功能组件，total总共有多少条数据  -->
        <div class="block">
            <el-pagination
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"
                    :current-page="pageIndex"
                    :page-sizes="[100, 200, 300, 400]"
                    :page-size="pageSize"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="pageTotal"
            ></el-pagination>
        </div>
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
                    <span style="color: orange">{{timeline.proType == 2? '预约：':''}}</span>
                    <span style="color: cadetblue">{{timeline.proType == 3? '初审：':''}}</span>
                    <span style="color: orange">{{timeline.proType == 4? '待复核':''}}</span>
                    <span style="color: darkblue">{{timeline.proType == 5? '复核：':''}}</span>
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
               <!-- <el-row>
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
                        <el-checkbox v-model="excelForm.audState" @change="handleCheckItemChange('audState')" label="业务状态" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.isGiveUp" @change="handleCheckItemChange('isGiveUp')" label="是否退件" border></el-checkbox>
                    </el-col>
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
                        <el-checkbox v-model="excelForm.magYst" @change="handleCheckItemChange('magYst')" label="客户经理一事通" border></el-checkbox>
                    </el-col>
                </el-row>
                <el-row style="margin-top: 20px">
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.busManager" @change="handleCheckItemChange('busManager')" label="客户经理" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.reservePeo" @change="handleCheckItemChange('reservePeo')" label="预约人" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.reserveDate" @change="handleCheckItemChange('reserveDate')" label="预约时间" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.wFirstAudCon" @change="handleCheckItemChange('wFirstAudCon')" label="待初审耗时" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.firstAudPeo" @change="handleCheckItemChange('firstAudPeo')" label="初审人" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.firstAudCon" @change="handleCheckItemChange('firstAudCon')" label="初审耗时" border></el-checkbox>
                    </el-col>
                </el-row>
                <el-row style="margin-top: 20px">
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
    import { getToken, setToken } from '@/util/app'
    export default {
        name: "HandleListText",
        props: ['character','activeName'],
        data() {
            /*获取业务列表数据*/
            return {
                busteams:["国企及新动能团队","汽车团队","房地产团队","机构业务一团队","机构业务二团队","小企业金融部","公司金融客户一部","公司金融客户二部",
                    "公司金融客户四部","公司金融客户五部","公司金融客户六部","公司金融客户八部","公司金融客户九部","公司金融客户十部","公司金融客户十一部","公司金融客户十二部","公司金融客户十三部",
                    "公司金融客户十四部","江津支行公司金融客户部","璧山支行公司金融客户部","长寿支行公司金融客户部","涪陵支行公司金融客户部","永川支行公司金融客户部"],
                bustypes:[],
                currentBusTypes: [],
                busList: [],
                loading:true,
                pageSize: 100,//当前每页显示多少条数据
                pageIndex: 1,//和分页区域的current-page绑定
                pageTotal: 0,
                //历史业务
                pageSizeHistory: 100,
                pageIndexHistory: 1,
                pageTotalHistory: 0,
                updateReceiveVisible: false,
                boxChoose:false,
                undoBoxChoose:false,
                // modifyVisible: false,
                excelVisible: false,
                progressVisible:false,
                multipleSelection: [],
                bus:{
                    busteam:"",
                    bustype:"",
                    subSdate:"",
                    subEdate:"",
                },
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
                    isRemote:"",
                },
                //导出Excel
                excelForm: {
                    excelName: "",
                    reserveSdate: "",
                    reserveEdate: "",
                    audState: true,
                    isGiveUp: true,
                    busTeam: true,
                    cusName: true,
                    busPname: true,
                    magYst: true,
                    busManager: true,
                    reservePeo: true,//预约人
                    reserveDate: true,//预约时间
                    wFirstAudCon: true,//待初审耗时
                    firstAudPeo: true,//初审人
                    firstAudCon: true,//初审耗时
                    firstHangCon: true,//初审挂件耗时
                    wSecondAudCon: true,//待复核耗时
                    secondAudPeo: true,//复核人
                    secondAudCon: true,//复核耗时
                    secondHangCon: true,//复核挂件耗时
                    allTimeComsume: true,//总耗时    
                },
                //导出excel时间规则
                excelRules: {
                    reserveSdate: [{ required: true, message: "起始时间不能为空", trigger: "blur" }],
                    reserveEdate: [{ required: true, message: "结束时间不能为空", trigger: "blur" }]
                },
                checkAll: true,
                //弹窗选择
                reRadio:"3",// 默认选项
                radio:"0", // 默认选项
                recheck:'1',//默认是
                isShow:true,
                boxRow:'',
                undoBoxRow:'',
                //当前行高亮显示
                currentRow: {},
                //-------------------------------流程数据-------------------------------------------
                timeLine:[],
                markk:'',
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
                },
                receiveBusDisable: false,
                firstAudDisable: false,
                firstBusBackDisable: false,
                firstAudOverDisable: false,
                secondAudDisable: false,
                secondBackDisable: false,
                secondAudEndDisable: false,
                releaseDisable: false,
                delBusDisable: false,
                progressDisable: false,
                validFormDisable: false,
                receiveHangDisable: false,
                receiveUndoValidDisable: false,
                boxSubmitDisable: false,
                undoBoxSubmitDisable: false,
                secondHangDisable: false
            }
        },
        methods: {

            //初审开始按钮
            async firstAudText(row,index) {
                row.disabled = true;
                row.audChar=this.mark;
                row.audName=this.userName;
                row.audNow=this.ystId;
                const { data: res } = await this.$http.put(`/busProgress/firstAudText`,row);
                if (res.code === 200) {
                    this.getBusList();
                    this.$message.success(res.msg);
                } else if(res.code===998) {
                    this.$alert(res.msg,'提示',{//当前业务正在被处理
                        confirmButtonText:'确定',
                        callback:action => {
                            this.$message({
                                type:'warning',
                                message:res.msg
                            })
                            this.getBusList();
                        }
                    })
                }else if (res.code === 997){
                    this.$alert(res.msg,'提示',{//该业务已被换位，请重新初审
                        confirmButtonText:'确定',
                        callback:action => {
                            this.$message({
                                type:'warning',
                                message:res.msg
                            });
                            this.getBusList();
                        }
                    })
                }else{
                    this.$message.error("初审失败");
                }
                this.busList[index].disabled = false;
                this.$set(this.busList, index, this.busList[index]);
            },

            //校验审核人是否本人
            ystVerify(row){
                if(row.audNow !== sessionStorage.getItem("ystId")){
                    this.$alert('当前业务正在被处理','提示',{
                        confirmButtonText:'确定',
                        callback:action => {
                            this.$message({
                                type:'warning',
                                message:'当前业务正在被处理'
                            });
                            this.getBusList();
                        }
                    });
                    return false;
                }else {
                    return true;
                }
            },

            //初审结束按钮（文本业务，无需弹框，直接进入下一步复核）
            async firstAudOverText(row,index) {
                row.disabled = true;
                if(!this.ystVerify(row)){
                    return;
                }
                const { data: res } = await this.$http.put(`busProgress/firstaudover`,row);
                    if (res.code === 200) {
                        this.$message.success(res.msg);
                        await this.getBusList();
                        // console.log('后端返回了')
                    } else if(res.code === 202) {
                        this.$message.error(res.msg);
                        await this.getBusList();
                        // console.log('后端返回了')
                    }else {
                        this.$message.error("初审失败");
                        await this.getBusList();
                        // console.log('后端返回了')
                    }
                this.busList[index].disabled = false
                this.$set(this.busList, index, this.busList[index])
            },

            //复核开始
            async secondAud(row,index) {
                row.disabled = true
                row.audChar=this.mark;
                row.audName=this.userName;
                row.audNow=this.ystId;
                const { data: res } = await this.$http.put(`busProgress/secondaud`,row);
                if (res.code === 200) {
                    this.getBusList();
                    this.$message.success(res.msg);
                } else if(res.code===998){
                    this.$alert(res.msg,'提示',{
                        confirmButtonText:'确定',
                        callback:action => {
                            this.$message({
                                type:'warning',
                                message:res.msg
                            });
                            this.getBusList();
                        }
                    })
                }else{
                    this.$message.error("复核失败");
                }
                this.busList[index].disabled = false
                this.$set(this.busList, index, this.busList[index])
            },

            //初审挂件
            async firstAudHang(row,index) {
                row.disabled = true;
                if(!this.ystVerify(row)){
                    return;
                }
                row.audChar=this.mark;
                row.audName=this.userName;
                row.audNow=this.ystId;
                const { data: res } = await this.$http.put(`busProgress/firsthang`,row);
                if (res.code === 200) {
                    this.getBusList();
                    this.$message.success(res.msg);
                } else if(res.code === 202){
                    this.getBusList();
                    this.$message.error(res.msg);
                } else {
                    this.$message.error("初审挂件失败");
                }
                this.busList[index].disabled = false
                this.$set(this.busList, index, this.busList[index])
            },

            //复核挂件(不需修改)
            async secondHang(row,index) {
                row.disabled = true;
                if(!this.ystVerify(row)){
                    return;
                }
                row.audChar=this.mark;
                row.audName=this.userName;
                row.audNow=this.ystId;
                const { data: res } = await this.$http.put(`busProgress/secondhang`,row);
                if (res.code === 200) {
                    this.getBusList();
                    this.$message.success(res.msg);
                } else if(res.code === 202){
                    this.getBusList();
                    this.$message.error(res.msg);
                } else {
                    this.$message.error("复核挂件失败");
                }
                this.busList[index].disabled = false
                this.$set(this.busList, index, this.busList[index])
            },

            //复核结束
            async secondAudEnd(row,index) {
                row.disabled = true;
                if(!this.ystVerify(row)){
                    return;
                }
                const { data: res } = await this.$http.put(`busProgress/secondaudover`,row);
                if (res.code === 200) {
                    this.getBusList();
                    this.$message.success(res.msg);
                } else if(res.code === 202){
                    this.getBusList();
                    this.$message.error(res.msg);
                } else {
                    this.$message.error("复核失败");
                }
                this.busList[index].disabled = false
                this.$set(this.busList, index, this.busList[index])
            },

            //获得业务品种
            async getTextTypes(){
                const { data: res } = await this.$http.get("/hello/bustypelistText");
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

            //导出Excel
            async excel(){
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
                console.log("请求下载之前......")
                // let url = `http://99.170.26.181:8085/toexcel/download/${excelForm.reserveSdate}/${excelForm.reserveEdate}?options=${options.join(',')}&excelname=${excelForm.excelName}&busflag=1&X-Token=${getToken()}`
                let url = `http://cqaarn.bcsoa.cmbchina.cn/api/toexcel/download/${excelForm.reserveSdate}/${excelForm.reserveEdate}?options=${options.join(',')}&excelname=${excelForm.excelName}&busflag=1&X-Token=${getToken()}`
                console.log("openurl之前.........")
                window.open(url);
                console.log("openurl之后.........")
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

            //组合查询，搜索业务
            async searchText() {
                const { data: res } = await this.$http.get(
                    "/basicInfo/findbyindexText0",
                    {
                        params: {
                            pageIndex: this.pageIndex,
                            pageSize: this.pageSize,
                            flag: this.character,
                            busteam: this.bus.busteam,
                            bustype: this.bus.bustype,
                            subSdate: this.bus.subSdate,
                            subEdate: this.bus.subEdate,
                        },
                    }
                );
                if (res.code === 200) {
                    this.busList = res.data.list.map(item => {
                        let busTime = item.resStime+'-'+ item.resEtime;
                        return {...item,busTime}
                    });
                    this.pageTotal = res.data.total;
                }
            },

            //为了重置页码的搜索方法
            handleSearch(){
                // console.log("角色",sessionStorage.getItem("mark"))
                // console.log("角色",this.markk)
                this.pageIndex = 1;
                this.pageSize = 100;
                this.searchText();
            },

            //多选框选中的内容
            handleSelectionChange(val) {
                this.multipleSelection = val;
            },

            //获得不同池子的所有业务信息的函数
            async getBusList() {
                const { data: res } = await this.$http.get("/v3/getTextBusList",{
                    params: {
                        pageIndex: this.pageIndex,
                        pageSize: this.pageSize,
                        flag: this.character//这里不能用this.mark
                    }
                });
                if (res.code !== 200) {
                    return this.$message.error(res.msg);
                }
                // this.busList = res.data.list.map(item => {
                //     let busTime = item.resStime+'-'+ item.resEtime;
                //     return {...item,busTime}
                // });
                this.busList = res.data.list;
                // console.log("结果",this.busList)
                this.loading=false;
                this.pageTotal = res.data.total;
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

            //获得所有挂件业务的函数
            async getHangList() {
                const { data: res } = await this.$http.get("/basicInfo/hangpool",{
                    params: {
                        audNow: sessionStorage.getItem("ystId"),
                        pageIndex: this.pageIndexHang,
                        pageSize: this.pageSizeHang
                    }
                });
                if (res.code !== 200) {
                    return this.$message.error(res.msg);
                }
                this.hangList = res.data.list;
                this.loading=false;
                this.pageTotalHang = res.data.total;
            },

            //弹窗选择
            showToggle(){
                if (this.radio === "1") {
                    this.isShow = false;
                } else {
                    this.isShow = true;
                }
            },

            reShowToggle(){
                console.log(this.reRadio);
            },

            //业务列表，每页显示的条数， 监听 pagesize 改变的事件（下方的每页多少条）
            handleSizeChange(val) {
                this.pageSize = val;
                if(this.bus.busteam === ''&&this.bus.bustype === ''&&this.bus.lowrisk === ''&&this.bus.resdate === ''){
                    this.getBusList();
                }else{
                    this.searchText();
                }
            },

            //业务列表，查询当前页，监听页码值改变的事件
            handleCurrentChange(val) {
                this.pageIndex = val;
                if(this.bus.busteam === ''&&this.bus.bustype === ''&&this.bus.lowrisk === ''&&this.bus.resdate === ''){
                    this.getBusList();
                }else{
                    this.searchText();
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
                this.boxChoose = false;
                this.undoBoxChoose = false;
                // this.modifyVisible = false;
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


            receiveUndoValid() {
                this.receiveUndoValidDisable = true;
                this.$refs.recieveBus.validate(valid => {
                    if (valid) {
                        this.receiveUndo();
                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
                this.receiveUndoValidDisable = false;
            },

            //删除业务信息
            delBus(row,index) {
                row.disabled = true;
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
                                    this.getBusList();
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
                    this.busList[index].disabled = false
                    this.$set(this.busList, index, this.busList[index])
            },

            //---------------------------------流程-------------------------------------------------------
            async progress(row,index) {
                row.disabled = true;
                this.progressVisible = true;
                const { data: res } = await this.$http.get(`busProgress/timeline/${row.busId}`);
                if (res.code === 200) {
                    this.timeLine = res.data;
                } else {
                    this.$message.error("获取业务流程信息失败");
                }
                this.busList[index].disabled = false
                this.$set(this.busList, index, this.busList[index])
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
                if(this.$refs.recieveBus !== undefined){
                    this.$refs.recieveBus.resetFields();
                }
                // if(this.$refs.modifyBus !== undefined){
                //     this.$refs.modifyBus.resetFields();
                //  }
                if(this.$refs.excelRef !== undefined){
                    this.$refs.excelRef.resetFields();
                }
            },
        },

        created: function() {
            this.getBusList();
            var mark = sessionStorage.getItem("mark");
            var userName = sessionStorage.getItem("userName");
            var ystId = sessionStorage.getItem("ystId");
            this.mark = mark;
            this.userName = userName;
            this.ystId = ystId;
            // console.log('在created里')
        },

        mounted:function() {
            this.getTextTypes();
            this.getCurrentTypes();
            // console.log('在mounted里')
        }
    }
</script>

<style>
.el-table th {
    display: table-cell!important;
}
</style>