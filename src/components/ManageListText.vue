<!---------------------------------- 只包含删除、详情操作的表格 -------------------------------------->
<template>
    <div>
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
                <el-table-column fixed="right" label="处理" v-if="this.mark === 'AUD_MAG'" align="center" width="100%">
                    <!--type为样式，editEmp是一个方法，在后面methods是定义了的-->
                    <template slot-scope="scope">
                        <el-button
                                @click="delBus(scope.row, scope.$index)"
                                size="small"
                                type="text"
                                v-preventReClick
                                :disabled="scope.row.disabled === undefined ? false:scope.row.disabled"
                        >删除</el-button>
                        <el-button
                                @click="progress(scope.row, scope.$index)"
                                size="small"
                                type="text"
                                v-preventReClick
                                :disabled="scope.row.disabled === undefined ? false:scope.row.disabled"
                        >详情</el-button>
                        <el-button
                                @click="giveUpBus(scope.row, scope.$index)"
                                size="small"
                                type="text"
                                v-show="character !== 'AUD_6' && character !== 'AUD_7' && character !== 'AUD_5' && character !== 'AUD_0'"
                                v-preventReClick
                                :disabled="scope.row.disabled === undefined ? false:scope.row.disabled"
                        >退件</el-button>
                        <el-button
                                @click="goBackBus(scope.row, scope.$index)"
                                size="small"
                                type="text"
                                v-show="character == 'AUD_2'||character == 'AUD_3'||character == 'AUD_4'||character == 'AUD_5'"
                                v-preventReClick
                                :disabled="scope.row.disabled === undefined ? false:scope.row.disabled"
                        >退回</el-button>
                    </template>
                </el-table-column>
                <el-table-column fixed="right" label="处理" v-if="this.mark !== 'AUD_MAG'"  align="center" width="100%">
                    <!--type为样式，editEmp是一个方法，在后面methods是定义了的-->
                    <template slot-scope="scope">
                        <el-button
                                @click="progress(scope.row, scope.$index)"
                                size="small"
                                type="text"
                                v-preventReClick
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
        <!----------------------------------------点击“详情”按钮的弹出框视图-------------------------------------------->
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
    </div>
</template>

<script>
    export default {
        name: "ManageListText",
        props: ['character','activeName','message'],
        data() {
            /*获取业务列表数据*/
            return { 
                bustypes:[],
                busList: [],
                historyList: [],
                hangList: [],
                loading:true,
                pageSize: 100,//当前每页显示多少条数据
                pageIndex: 1,//和分页区域的current-page绑定
                pageTotal: 0,
                updateReceiveVisible: false,
                boxChoose:false,
                undoBoxChoose:false,
                modifyVisible: false,
                excelVisible: false,
                progressVisible:false,
                multipleSelection: [],
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
                timeLine:[],
                mark:'',
                ystId:'',
                userName:'',
                delBusDisable: false,
                progressDisable: false,
                giveUpBusDisable: false,
                goBackBusDisable: false

            }
        },
        methods: {
            //组合查询，搜索业务
            async search() {
                // console.log('执行到子组件的search了')
                // console.log('人员类型为：',this.message.auditype)
                // console.log('人员为：',this.message.state)
                const { data: res } = await this.$http.get(
                    "/basicInfo/findbyindexText",
                    {
                        params: {
                            pageIndex: this.pageIndex,
                            pageSize: this.pageSize,
                            flag: this.character,
                            busteam: this.message.busteam,
                            bustype: this.message.bustype,
                            subSdate: this.message.subSdate,
                            subEdate: this.message.subEdate,
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

            async getBusList() {
            //获得不同池子的所有业务信息的函数
                // console.log("我在执行getBusList函数开始qqqqqqqqq。。。。。。")
                const { data: res } = await this.$http.get("/basicInfo/basicinfolistText",{
                    params: {
                        pageIndex: this.pageIndex,
                        pageSize: this.pageSize,
                        flag: this.character//这里不能用this.mark
                    }
                });
                if (res.code !== 200) {
                    return this.$message.error(res.msg);
                }
                // console.log(res.data.list)
                this.busList = res.data.list.map(item => {
                    let busTime = item.resStime+'-'+ item.resEtime;
                    return {...item,busTime}
                });
                this.loading=false;
                //总共有多少页
                this.pageTotal = res.data.total;
                // console.log("我在执行getBusList函数结束。。。............。。。")
            },

            //业务列表，每页显示的条数， 监听 pagesize 改变的事件（下方的每页多少条）
            handleSizeChange(val) {
                // console.log('我在执行handleSizeChange函数，参数是：', val)
                this.pageSize = val;
                if(this.message.busteam === ''&&this.message.bustype === ''&&this.message.lowrisk === '' && (this.message.resSdate === '' || this.message.resSdate === null) && (this.message.resEdate === '' || this.message.resEdate === null)){
                    this.getBusList();
                }else{
                    this.search();
                }
            },

            //业务列表，查询当前页，监听页码值改变的事件
            handleCurrentChange(val) {
                // console.log('我在执行handleCurrentChange函数，参数是：', val)
                this.pageIndex = val;
                this.loadOnCondition();
            },

            loadOnCondition(){
                // console.log('我在执行loadOnCondition函数')
                if(this.message.busteam === ''&&this.message.bustype === ''&&this.message.lowrisk === '' && (this.message.resSdate === '' || this.message.resSdate === null) && (this.message.resEdate === '' || this.message.resEdate === null)){
                    // console.log('我走的是通路1')
                    this.getBusList();
                    
                }else{
                    // console.log('我走的是通路2')
                    this.search();
                    
                }
            },
            
            //删除业务信息
            delBus(row,index) {
                row.disabled = true;
                this.$confirm("此操作将删除该业务的信息, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                }).then(() => {
                        this.$http.delete(`basicInfo/deletebus/${row.busId}`)
                            .then(successResponse => {
                                // console.log(successResponse.data.msg)
                                if (successResponse.data.code === 200) {
                                    this.$message.success(successResponse.data.msg);
                                    this.loadOnCondition();
                                }
                                if (successResponse.data.code === 400) {
                                    this.$message.error(successResponse.data.message);
                                }
                            }).catch(failResponse => {
                                // console.log(failResponse)
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

            //点击业务“详情”按钮
            async progress(row,index) {
                row.disabled = true;
                this.progressVisible = true;
                const { data: res } = await this.$http.get(`busProgress/timeline/${row.busId}`);
                if (res.code === 200) {
                    this.timeLine = res.data;
                    this.loadOnCondition();
                } else {
                    this.$message.error("获取业务流程信息失败");
                }
                this.busList[index].disabled = false
                this.$set(this.busList, index, this.busList[index])
            },

            //点击“退件”按钮
            async giveUpBus(row,index) {
                row.disabled = true;
                const { data: res } = await this.$http.get("v2/giveUpBus",{
                    params: {
                        busId: row.busId,
                        state: row.audState,
                        isText: row.isText
                    }
                });
                if (res.code === 200) {
                    let flag = res.data;
                    // console.log("返回的数据为：" + res.data)
                    if(flag){
                        this.$message.success("退件成功");
                        await this.loadOnCondition();
                        this.busList[index].disabled = false
                        this.$set(this.busList, index, this.busList[index])
                    }else{
                        this.$message.error("页面已过时，请刷新页面后重试！");
                        await this.loadOnCondition();
                        this.busList[index].disabled = false
                        this.$set(this.busList, index, this.busList[index])
                    }
                } else {
                    this.$message.error("获取业务流程信息失败");
                    await this.loadOnCondition();
                    this.busList[index].disabled = false
                    this.$set(this.busList, index, this.busList[index])
                }
                // console.log('已执行退件操作................')
            },

            //点击“退件”按钮
            async goBackBus(row,index) {
                row.disabled = true;
                // console.log("获得到的row")
                // console.log(row)
                const { data: res } = await this.$http.put('v2/goBackTextBus',row);
                if (res.code === 200) {
                    let flag = res.data;
                    // console.log("返回的数据为：" + res.data)
                    if(flag){
                        this.$message.success("退回成功");
                        await this.loadOnCondition();
                        this.busList[index].disabled = false
                        this.$set(this.busList, index, this.busList[index])
                    }else{
                        this.$message.error("页面已过时，请刷新页面后重试！");
                        await this.loadOnCondition();
                        this.busList[index].disabled = false
                        this.$set(this.busList, index, this.busList[index])
                    }
                } else {
                    this.$message.error("后端返回失败");
                    await this.loadOnCondition();
                    this.busList[index].disabled = false
                    this.$set(this.busList, index, this.busList[index])
                }
                // console.log('已执行退回操作................')
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

            // 关闭视图
            handleClose() {
                this.updateReceiveVisible = false;
                this.boxChoose = false;
                this.undoBoxChoose = false;
                this.modifyVisible = false;
                this.excelVisible = false;
                this.progressVisible = false;
                this.resetForm();
            },

            //重置表单数据
            resetForm() {
                if(this.$refs.recieveBus !== undefined){
                    this.$refs.recieveBus.resetFields();
                }
                if(this.$refs.modifyBus !== undefined){
                    this.$refs.modifyBus.resetFields();
                }
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
            },
            mounted:function() {
                // this.getTypes();
            }
    }
</script>

<style>
.el-table th {
    display: table-cell!important;
}
</style>