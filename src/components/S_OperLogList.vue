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
                <!-- <el-table-column v-if="character === 'AUD_REC'" type="selection" width="40"></el-table-column> -->
                <el-table-column type="index" width="40" align="center"></el-table-column>
                <el-table-column prop="operType" label="操作类型"  align="center"></el-table-column>
                <el-table-column prop="operTime" label="操作时间"  align="center"></el-table-column>
                <el-table-column prop="operName" label="操作人员"  align="center"></el-table-column>
                <el-table-column prop="preStatus" label="操作前状态"  align="center">
                    <!-----后台数字转换为前台汉字----->
                    <!-- <template slot-scope="scope">
                        <el-tag type="warning" v-if="scope.row.preStatus == '0'">{{ scope.row.preStatus == 0 ?  '待接件': '' }}</el-tag>
                        <el-tag type="warning" v-if="scope.row.preStatus == '1'">{{ scope.row.preStatus == 1 ?  '接件中': '' }}</el-tag>
                        <el-tag type="warning" v-if="scope.row.preStatus == '2'">{{ scope.row.preStatus == 2 ?  '待初审': '' }}</el-tag>
                        <el-tag type="warning" v-if="scope.row.preStatus == '3'">{{ scope.row.preStatus == 3 ?  '初审中': '' }}</el-tag>
                        <el-tag type="warning" v-if="scope.row.preStatus == '4'">{{ scope.row.preStatus == 4 ?  '待复核': '' }}</el-tag>
                        <el-tag type="warning" v-if="scope.row.preStatus == '5'">{{ scope.row.preStatus == 5 ?  '复核中': '' }}</el-tag>
                        <el-tag type="warning" v-if="scope.row.preStatus == '6'">{{ scope.row.preStatus == 6 ?  '待完善': '' }}</el-tag>
                        <el-tag type="warning" v-if="scope.row.preStatus == '7'">{{ scope.row.preStatus == 7 ?  '待放款': '' }}</el-tag>
                        <el-tag type="warning" v-if="scope.row.preStatus == '8'">{{ scope.row.preStatus == 8 ?  '已完成': '' }}</el-tag>
                        <el-tag type="warning" v-if="scope.row.preStatus == '9'">{{ scope.row.preStatus == 9 ?  '已失效': '' }}</el-tag>
                    </template> -->
                    <template slot-scope="scope">
                        <el-tag type="warning" v-if="scope.row.preStatus == '00'">待接件</el-tag>
                        <el-tag type="warning" v-if="scope.row.preStatus == '01'">接件中</el-tag>
                        <el-tag type="warning" v-if="scope.row.preStatus == '02'">待初审</el-tag>
                        <el-tag type="warning" v-if="scope.row.preStatus == '03'">初审中</el-tag>
                        <el-tag type="warning" v-if="scope.row.preStatus == '04'">待复核</el-tag>
                        <el-tag type="warning" v-if="scope.row.preStatus == '05'">复核中</el-tag>
                        <el-tag type="warning" v-if="scope.row.preStatus == '06'">待完善</el-tag>
                        <el-tag type="warning" v-if="scope.row.preStatus == '07'">待放款</el-tag>
                        <el-tag type="warning" v-if="scope.row.preStatus == '08'">已完成</el-tag>
                        <el-tag type="warning" v-if="scope.row.preStatus == '09'">已失效</el-tag>
                    </template>
                    <!-- <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.isGiveUp == '1'">已退件</el-tag>
                        <el-tag type="success"  v-if="scope.row.audState == '0' && scope.row.isGiveUp == '0'">待接件</el-tag>
                        <el-tag type="success"  v-if="scope.row.audState == '1' && scope.row.isGiveUp == '0'">接件中</el-tag>
                        <el-tag type="success" v-if="scope.row.audState == '2' && scope.row.isGiveUp == '0'">待初审</el-tag>
                        <el-tag type="success" v-if="scope.row.audState == '3' && scope.row.isGiveUp == '0'">初审中</el-tag>
                        <el-tag type="success" v-if="scope.row.audState == '4' && scope.row.isGiveUp == '0'">待复核</el-tag>
                        <el-tag type="success" v-if="scope.row.audState == '5' && scope.row.isGiveUp == '0'">复核中</el-tag>
                        <el-tag type="success" v-if="scope.row.audState == '6' && scope.row.isGiveUp == '0'">待完善</el-tag>
                        <el-tag type="success" v-if="scope.row.audState == '7' && scope.row.isGiveUp == '0' ">待放款</el-tag>
                        <el-tag type="success" v-if="scope.row.audState == '8' && scope.row.isGiveUp == '0' ">已完成</el-tag>
                        <el-tag type="success" v-if="scope.row.audState == '9' && scope.row.isGiveUp == '0' ">已失效</el-tag>
                    </template> -->
                </el-table-column>
                <el-table-column prop="aftStatus" label="操作后状态"  align="center">
                    <!-----后台数字转换为前台汉字----->
                    <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.isGiveUp == '1'">已退件</el-tag>
                        <el-tag type="success" v-if="scope.row.aftStatus == '00' && scope.row.isGiveUp == '0'">待接件</el-tag>
                        <el-tag type="success" v-if="scope.row.aftStatus == '01' && scope.row.isGiveUp == '0'">接件中</el-tag>
                        <el-tag type="success" v-if="scope.row.aftStatus == '02' && scope.row.isGiveUp == '0'">待初审</el-tag>
                        <el-tag type="success" v-if="scope.row.aftStatus == '03' && scope.row.isGiveUp == '0'">初审中</el-tag>
                        <el-tag type="success" v-if="scope.row.aftStatus == '04' && scope.row.isGiveUp == '0'">待复核</el-tag>
                        <el-tag type="success" v-if="scope.row.aftStatus == '05' && scope.row.isGiveUp == '0'">复核中</el-tag>
                        <el-tag type="success" v-if="scope.row.aftStatus == '06' && scope.row.isGiveUp == '0'">待完善</el-tag>
                        <el-tag type="success" v-if="scope.row.aftStatus == '07' && scope.row.isGiveUp == '0'">待放款</el-tag>
                        <el-tag type="success" v-if="scope.row.aftStatus == '08' && scope.row.isGiveUp == '0'">已完成</el-tag>
                        <el-tag type="success" v-if="scope.row.aftStatus == '09' && scope.row.isGiveUp == '0'">已失效</el-tag>
                    </template>
                    <!-- <template slot-scope="scope">
                        <el-tag type="success" v-if="scope.row.isGiveUp == '1'">已退件</el-tag>
                        <el-tag type="success"  v-if="scope.row.audState == '0' && scope.row.isGiveUp == '0'">待接件</el-tag>
                        <el-tag type="success"  v-if="scope.row.audState == '1' && scope.row.isGiveUp == '0'">接件中</el-tag>
                        <el-tag type="success" v-if="scope.row.audState == '2' && scope.row.isGiveUp == '0'">待初审</el-tag>
                        <el-tag type="success" v-if="scope.row.audState == '3' && scope.row.isGiveUp == '0'">初审中</el-tag>
                        <el-tag type="success" v-if="scope.row.audState == '4' && scope.row.isGiveUp == '0'">待复核</el-tag>
                        <el-tag type="success" v-if="scope.row.audState == '5' && scope.row.isGiveUp == '0'">复核中</el-tag>
                        <el-tag type="success" v-if="scope.row.audState == '6' && scope.row.isGiveUp == '0'">待完善</el-tag>
                        <el-tag type="success" v-if="scope.row.audState == '7' && scope.row.isGiveUp == '0' ">待放款</el-tag>
                        <el-tag type="success" v-if="scope.row.audState == '8' && scope.row.isGiveUp == '0' ">已完成</el-tag>
                        <el-tag type="success" v-if="scope.row.audState == '9' && scope.row.isGiveUp == '0' ">已失效</el-tag>
                    </template> -->
                </el-table-column>
                <el-table-column prop="busTeam" label="业务团队"  align="center"></el-table-column>
                <el-table-column prop="cusName" label="客户名称" align="center"></el-table-column>
                <el-table-column prop="busPname" label="业务品种" align="center" ></el-table-column>
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
                <el-table-column prop="busNumber" label="业务编号"  align="center"></el-table-column>
                <el-table-column fixed="right" label="业务详情" align="center" width="100%">
                    <!--type为样式，editEmp是一个方法，在后面methods是定义了的-->
                    <template slot-scope="scope">
                        <el-button
                                @click="progress(scope.row)"
                                size="small"
                                type="text"
                                :disabled="progressDisable"
                                v-preventReClick
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
        name: "BusinessList",
        props: ['character','activeName','message'],
        data() {
            /*获取业务列表数据*/
            return { 
                bustypes:[],
                busList: [],
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

            amountFormat(row,column){
                if(row.amount !== null){
                    return row.amount.toLocaleString()
                } 
            },
            
            //组合查询，搜索业务
            async search() {
                // console.log('执行到子组件的search了')
                console.log('执行到我了，现在的活动窗口：',this.character)
                const { data: res } = await this.$http.get(
                    "/v2/searchLogList",
                    {
                        params: {
                            pageIndex: this.pageIndex,
                            pageSize: this.pageSize,
                            flag: this.character,
                            busteam: this.message.busteam,
                            bustype: this.message.bustype,
                            resSdate: this.message.resSdate,
                            resEdate: this.message.resEdate,
                            bustatus: this.message.bustatus   
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

            async getLogList() {
                // console.log("我在执行getLogList()函数开始。。。。。。")
                //文本业务尚在开发中
                // if(this.character === 'AUD_0'){
                    console.log('执行到我了，现在的活动窗口：',this.character)
                    //普通业务
                    const { data: res } = await this.$http.get("/v2/getLoglist",{
                        params: {
                            pageIndex: this.pageIndex,
                            pageSize: this.pageSize,
                            flag: this.character
                        }
                    });
                    if (res.code !== 200) {
                        // console.log('后台返回的日志列表',this.busList) 
                        return this.$message.error(res.msg);
                    }
                    // console.log('后台返回的日志列表',res.data)
                    this.busList = res.data.list;  
                    this.loading=false;
                    //总共有多少页
                    this.pageTotal = res.data.total;
                // } else {
                //     console.log('执行到我了，现在的活动窗口：',this.character)
                //     // return this.$message.error("文本业务正在开发中......");
                // }
                // console.log("我在执行getLogList()函数结束。。。。。。")
            },

            //业务列表，每页显示的条数， 监听 pagesize 改变的事件（下方的每页多少条）
            handleSizeChange(val) {
                // console.log('我在执行handleSizeChange函数，参数是：', val)
                this.pageSize = val;
                if(this.message.busteam === '' && this.message.bustype === ''&&this.message.bustatus === '' && (this.message.resSdate === '' || this.message.resSdate === null) && (this.message.resEdate === '' || this.message.resEdate === null)){
                    this.getLogList();
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
                if(this.message.busteam === '' && this.message.bustype === ''&&this.message.bustatus === '' && (this.message.resSdate === '' || this.message.resSdate === null) && (this.message.resEdate === '' || this.message.resEdate === null)){
                    // console.log('我走的是通路1')
                    this.getLogList();
                    
                }else{
                    // console.log('我走的是通路2')
                    this.search();
                    
                }
            },

            //点击业务“详情”按钮
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
                this.getLogList();
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

</style>