<template>
     <!---------------------------基础信息表格--------------------------------->
        <div style="margin:30px 0 0">
            <el-table
                    ref="multipleTable"
                    :data="busList"
                    tooltip-effect="dark"
                    :border="true"
                    :highlight-current-row="true"
                    max-height="530px"
                    size="small"
                    style="width: 100%"
            >
            <!-- :row-class-name="getRowClassName"
                    @row-click="handleSelectRow"
                    @selection-change="handleSelectionChange" -->
                <!--table表单中的 prop 就是controller数据源的列名，label为姓名，scope.row为拿到这一行的数据-->
                <!-- <el-table-column v-if="character === 'AUD_REC'" type="selection" width="40"></el-table-column> -->
                <el-table-column type="index" width="40" align="center"></el-table-column>
                <el-table-column prop="audProgess" label="业务进度" align="center">
                    <!-----后台数字转换为前台汉字----->
                    <template slot-scope="scope">
                        <el-tag type="danger" v-if="scope.row.isGiveUp == '1'">已退件</el-tag>
                        <el-tag type="info"  v-if="scope.row.audState == '00' && scope.row.isGiveUp == '0'">待接件</el-tag>
                        <el-tag type="info" v-if="scope.row.audState == '01' && scope.row.isGiveUp == '0'">接件中</el-tag>
                        <el-tag  v-if="scope.row.audState == '02' && scope.row.isGiveUp == '0'">待初审</el-tag>
                        <el-tag  v-if="scope.row.audState == '03' && scope.row.isGiveUp == '0'">初审中</el-tag>
                        <el-tag  v-if="scope.row.audState == '04' && scope.row.isGiveUp == '0'">待复核</el-tag>
                        <el-tag  v-if="scope.row.audState == '05' && scope.row.isGiveUp == '0'">复核中</el-tag>
                        <el-tag type="warning" v-if="scope.row.audState == '06' && scope.row.isGiveUp == '0'">待完善</el-tag>
                        <el-tag  v-if="scope.row.audState == '07' && scope.row.isGiveUp == '0' ">待放款</el-tag>
                        <el-tag  v-if="scope.row.audState == '10' && scope.row.isGiveUp == '0' ">放款中</el-tag>
                        <el-tag type="success" v-if="scope.row.audState == '08' && scope.row.isGiveUp == '0' ">已完成</el-tag>
                        <el-tag type="danger" v-if="scope.row.audState == '09' && scope.row.isGiveUp == '0' ">已失效</el-tag>
                    </template>
                </el-table-column>
                <el-table-column prop="busTeam" label="业务团队"  align="center"></el-table-column>
                <el-table-column prop="cusName" label="客户名称" align="center"></el-table-column>
                <el-table-column prop="busPname" label="业务品种" align="center" ></el-table-column>
                <el-table-column prop="busManager" label="客户经理"  align="center"></el-table-column>
                <el-table-column prop="subDate" label="提交日期"  align="center"></el-table-column>
                <el-table-column prop="subTime" label="提交时间"  align="center" width="108"></el-table-column>
                <el-table-column fixed="right" label="处理" align="center" width="100%">
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
        </div>
        
        
</template>

<script>
    export default {
        name: "BusinessListLi",
        props: ['character','activeName','message'],
        data() {
            /*获取业务列表数据*/
            return {
                aaa: '',
                busList: [],
                doneBusIds: [],
                processBusIds: [],
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
                //-------------------------------流程数据-------------------------------------------
                timeLine:[],
                ystId:'',
                userName:'',
                //11.19修改
                delBusDisable: false,
                progressDisable: false,
            }
        },
        methods: {
     
            async getBusList() {
                this.doneBusIds.splice(0, this.doneBusIds.length);
                this.processBusIds.splice(0, this.processBusIds.length);
                // console.log("list1", this.doneBusIds)
                // console.log("list2", this.processBusIds)
                //获得不同池子的所有业务信息的函数
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
                    this.busList = res.data.list.map(item => {
                        // let busTime = item.resStime+'-'+ item.resEtime;
                        if(item.audState == "08" || item.isGiveUp == "1"){
                            this.doneBusIds.push(item.busId)
                        }else{
                            this.processBusIds.push(item.busId)
                        }
                        return {...item}
                    });
                    // console.log("全部：", this.busList)
                    // console.log("list1", this.doneBusIds)
                    // console.log("list2", this.processBusIds)
                    // console.log("alllist", res.data.total)
                    this.loading=false;
                    this.pageTotal = res.data.total;
                    // console.log("我在执行getBusList函数结束。。。。。。")
                },

            //组合查询，搜索业务
            async search() {
                this.doneBusIds.splice(0, this.doneBusIds.length);
                this.processBusIds.splice(0, this.processBusIds.length);                   
                //限制人员类型和人员姓名不能单独存在
                if((this.message.auditype == ""  && this.message.personId != "") || (this.message.auditype != ""  && this.message.personId == "")){
                    this.$message.error("人员类型和人员姓名两个搜索条件请同时输入！！！")
                    this.busList = null
                    return null
                }
                const { data: res } = await this.$http.get(
                    "/v2/searchPauditingText",
                    {
                        params: {
                            pageIndex: this.pageIndex,
                            pageSize: this.pageSize,
                            flag: this.character,
                            busTeam: this.message.busteam,
                            busType: this.message.bustype,
                            subSdate: this.message.subSdate,
                            subEdate: this.message.subEdate,
                            buStatus: this.message.bustatus,
                            audiType: this.message.auditype,
                            personId: this.message.personId,
                        },
                    }
                );
                if (res.code === 200) {
                    this.busList = res.data.list.map(item => {
                        if(item.audState == "08" || item.isGiveUp == "1"){
                            this.doneBusIds.push(item.busId)
                        }else{
                            this.processBusIds.push(item.busId)
                        }
                        return {...item}
                    });
                    // console.log('doneBusIds:'+this.doneBusIds)
                    // console.log('processBusIds:'+this.processBusIds)
                    this.pageTotal = res.data.total;
                }
                // this.message.personId = "";
                // this.message.auditype = "";
                // this.getBusList();
            },
            
            //为了重置页码的搜索方法
            handleSearch(){
                    this.pageIndex = 1;
                    this.pageSize = 100;
                    this.search();
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
            

            //监控搜索栏为空的函数
            loadOnCondition(){
                // console.log('我在执行loadOnCondition函数')
                if(this.message.busteam === '' && this.message.bustype === '' 
                                    && (this.message.subSdate === '' || this.message.subSdate === null)
                                    && (this.message.subEdate === '' || this.message.subEdate === null) && this.message.bustatus === '' && this.message.auditype === '' 
                                    && this.message.state === ''){
                    // console.log('我走的是通路1')
                    this.getBusList();  
                }else{
                    // console.log('我走的是通路2')
                    this.search();
                    
                }
            },

            //业务列表，每页显示的条数， 监听 pagesize 改变的事件（下方的每页多少条）
            handleSizeChange(val) {
                this.pageSize = val;
                this.loadOnCondition();
            },

            //业务列表，查询当前页，监听页码值改变的事件
            handleCurrentChange(val) {
                this.pageIndex = val;
                this.loadOnCondition();
            },
            //关闭视图
            handleClose() {
                this.updateReceiveVisible = false;
                this.boxChoose = false;
                this.undoBoxChoose = false;
                this.modifyVisible = false;
                this.excelVisible = false;
                this.progressVisible = false;
                this.resetForm();
            },
            //详情按钮
            async progress(row) {
                this.progressVisible = true;
                const { data: res } = await this.$http.get(`busProgress/timeline/${row.busId}`);
                if (res.code === 200) {
                    this.timeLine = res.data;
                } else {
                    this.$message.error("获取业务流程信息失败");
                }
            },
            
            created: function() {
                this.getBusList();
                // console.log('我在执行create')
            },
            mounted:function() {
                this.getTypes();
                
            }
        }
    }
</script>

<style>
.el-table th {
    display: table-cell!important;
}
</style>