<template>
    <div id="busList">
        <!--------------------面包屑导航----------------------------->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/ordinary' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>业务列表</el-breadcrumb-item>
            <el-breadcrumb-item>业务管理</el-breadcrumb-item>
            <el-breadcrumb-item>任务调度</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card >
            <!---------------------------基础信息表格--------------------------------->
            <el-table
                :data="tableData"
                border
                style="width: 100%">
                    <el-table-column
                        prop="staffInfo"
                        label="审查人员"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="receivePeriod"
                        label="接件"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="firstAudPeriod"
                        label="初审"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="secondAudPeriod"
                        label="复核"
                        align="center">
                    </el-table-column>
                    <el-table-column
                        prop="releaseAudPeriod"
                        label="放款"
                        align="center">
                    </el-table-column>
                    <el-table-column fixed="right" label="详情" align="center">
                    <template slot-scope="scope">
                        <el-button
                                @click="getDetailBusi(scope.row,1)"
                                size="small"
                                type="text"
                                v-preventReClick
                        >接件详情</el-button>
                        <el-button
                                @click="getDetailBusi(scope.row,3)"
                                size="small"
                                type="text"
                                v-preventReClick
                        >初审详情</el-button>
                        <el-button
                                @click="getDetailBusi(scope.row,5)"
                                size="small"
                                type="text"
                                v-preventReClick
                        >复核详情</el-button>
                        <el-button
                                @click="getDetailBusi(scope.row,8)"
                                size="small"
                                type="text"
                                v-preventReClick
                        >放款详情</el-button>
                    </template>
                </el-table-column>
            </el-table>

            <!----------------------------------------流程视图-------------------------------------------->
            <el-dialog
                    title="业务详情"
                    :visible.sync="detailBusiVisible"
                    :close-on-click-modal="false"
            >
            <el-table
                    ref="multipleTable"
                    :data="detailBusiList"
                    tooltip-effect="dark"
                    :border="true"
                    :highlight-current-row="true"
                    max-height="530px"
                    size="small"
                    style="width: 100%"
            >
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
                <el-table-column prop="other" label="其他品种" align="center"></el-table-column>
            </el-table>
        </el-dialog>
        </el-card>
    </div>
</template>

<script>
    
import { type } from 'os'
    export default {
        
        data() {
        /*获取业务列表数据*/
        return {
            detailBusiVisible: false,
            detailBusiList: [],
            pageTotal: 0,
            tableData: [{
                staffInfo: '李宗辉1',
                receivePeriod: 5,
                firstAudPeriod: 3,
                secondAudPeriod: 2,
                loanPeriod: 1,
            }, {
                staffInfo: '李宗辉2',
                receivePeriod: 5,
                firstAudPeriod: 3,
                secondAudPeriod: 2,
                loanPeriod: 1,
            }]
            // 搜索条件
            // bus:{
            //     resdate:"",
            //     resSdate: "",
            //     resEdate: "",
            //     state: "",
            //     personId: "",
            //     bustatus: "",
            //     searchFlag: false,
            //     },
        }
        },
        
    methods: {

        //获取每个人每种进行中业务的笔数
        async getCountList() {
            const { data: res } = await this.$http.get("/v3/getCountList",{
                        params: {
                            pageIndex: this.pageIndex,
                            pageSize: this.pageSize,
                            flag: this.character//这里不能用this.mark
                        }
                    });
            if (res.code !== 200) {
                return this.$message.error("初始化失败，请联系管理员处理！");
            }
            this.tableData = res.data
            // console.log(res.data)
        },

        //获取业务详情列表
        async getDetailBusi(row, flag) {
                this.detailBusiVisible = true;
                const { data: res } = await this.$http.get("/v3/getDetailBusi",{
                    params: {
                        staffName: row.staffInfo,
                        progressType: flag
                    }
                });
                if (res.code === 200) {
                    // console.log('aaaaaaaaaaaaaaaa:',res.data)
                    this.detailBusiList = res.data;
                } else {
                    this.$message.error("获取业务流程信息失败");
                }
            },
        
        // handSelect(item){
        //     console.log("选中的值"+item.personName)
        //     //绑定输入框的值为选择框的personName属性
        //     this.bus.state = item.value
        //     this.bus.personId = item.personName
        // },

        },
        created: function() {
                // console.log('开始去后台查询数据..........')
                this.getCountList()
            },
        
    }
</script>

<style scoped>
    .el-table {
      /* 表格外边框20px */
      margin-top: 20px;
      margin-bottom: 30px;
      text-align: center;
    }
    .input-with-select.el-input-group__prepend {
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
    body {
      margin: 0;
    }
</style>


