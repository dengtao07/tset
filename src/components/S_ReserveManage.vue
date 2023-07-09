<template>
    <div id="reserveList">
        <!--面包屑导航-->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/ordinary' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>预约管理</el-breadcrumb-item>
        </el-breadcrumb>
        <!-------------------卡片视图区域 ------------------>
        <el-card>
            <!-- <el-row :gutter="20" v-if="this.mark !== 'AUD_LED'">
                <el-col :span="2" :offset="30">
                    <el-button size="medium" type="primary" style="width: 120px"  plain @click="addReserveVisible = true">添加</el-button>
                </el-col>
            </el-row> -->
            <!--列表区域，:data 为当前表格指定数据源，数据源中每一个对象被渲染为一行，border为边框线，v-loading="loading"-->
            <div>
                <el-table
                        v-loading="loading"
                        ref="multipleTable"
                        :data="reserveList"
                        tooltip-effect="dark"
                        :border="true"
                        :highlight-current-row="true"
                        max-height="530px"
                        size="small"
                        :default-sort="{prop: 'resId', order: 'descending'}"
                        style="width: 100%"
                >
                    <!--table表单中的 prop 就是controller数据源的列名，label为姓名，scope.row为拿到这一行的数据-->
                    <el-table-column type="index" width="70px" align="center"></el-table-column>
                    <el-table-column prop="resStime" label="开始时间" align="center"></el-table-column>
                    <el-table-column prop="resEtime" label="结束时间" align="center"></el-table-column>
                    <el-table-column prop="npeople" label="预约人数" align="center"></el-table-column>
                    <el-table-column label="操作" align="center" v-if="this.mark !== 'AUD_LED'">
                        <!--type为样式，editReserve是一个方法，在后面methods是定义了的-->
                        <template slot-scope="scope">
                            <el-button
                                    @click="editReserve(scope.row)"
                                    size="small"
                                    type="primary"
                                    v-preventReClick
                            >编辑</el-button>
                            <!-- <el-button
                                    @click="delReserve(scope.row)"
                                    size="small"
                                    type="danger"
                                    icon="el-icon-delete"
                            >删除</el-button> -->
                        </template>
                    </el-table-column>
                    <el-table-column fixed="right" label="是否启用" align="center">
                            <template slot-scope="scope">
                                <el-switch
                                    active-value="1"
                                    inactive-value="0"
                                    inactive-color="0"
                                    v-model="scope.row.onStatus" 
                                    @change="changeOnStatus(scope.row)">
                                </el-switch>
                            </template>
                        </el-table-column>
                </el-table>
            </div>
            <!-- 分页区域，layout展示页面上展示那些功能组件，total总共有多少条数据  -->
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
        </el-card>
        <!-----------------------预约时间添加视图-------------------->
        <!-- <el-dialog
                title="预约设置添加"
                :visible.sync="addReserveVisible"
                :close-on-click-modal="false"
                :before-close="handleClose"
                width="30%"
                center
        >
            <el-form ref="reserveRef" :rules="timerules" label-width="80px" :model="reserve" size="small">
                    <el-form-item label="起始时间" prop="resStime">
                        <el-time-select
                                placeholder="起始时间"
                                v-model="reserve.resStime"
                                :picker-options="{
                                start: '08:30',
                                step: '00:15',
                                end: '17:30'
                         }">
                        </el-time-select>
                    </el-form-item>
                    <el-form-item label="结束时间" prop="resEtime">
                        <el-time-select
                            placeholder="结束时间"
                            v-model="reserve.resEtime"
                            :picker-options="{
                            start: '08:30',
                            step: '00:15',
                            end: '17:30',
                            }">
                        </el-time-select>
                    </el-form-item>
                    <el-form-item label="预约人数" prop="npeople">
                        <el-input v-model="reserve.npeople"></el-input>
                    </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="resetForm" v-preventReClick>重置</el-button>
                <el-button type="primary" @click="addReserve" v-preventReClick>提交</el-button>
            </span>
        </el-dialog> -->
        <!-- 修改预约信息的视图按钮 -->
        <el-dialog
                title="修改预约时间信息"
                :visible.sync="updateReserveVisible"
                :close-on-click-modal="false"
                :before-close="handleClose"
                width="30%"
                center
        >
            <el-form ref="reserveRef" :rules="timerules" label-width="80px" :model="reserve" size="small">
                <el-form-item label="起始时间" prop="resStime">
                    <el-time-select
                            placeholder="起始时间"
                            v-model="reserve.resStime"
                            :picker-options="{
                            start: '08:30',
                            step: '00:15',
                            end: '17:30'
                         }">
                    </el-time-select>
                </el-form-item>
                <el-form-item label="结束时间" prop="resEtime">
                    <el-time-select
                            placeholder="结束时间"
                            v-model="reserve.resEtime"
                            :picker-options="{
                            start: '08:30',
                            step: '00:15',
                            end: '17:30',
                            }">
                    </el-time-select>
                </el-form-item>
                <el-form-item label="预约人数" prop="npeople">
                    <el-input v-model="reserve.npeople"></el-input>
                </el-form-item>
            </el-form>
            <!-- 按钮居中显示 -->
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="validForm" v-preventReClick>提交</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            //获取时间列表数据
            return {
                mark: '',
                userName: '',
                ystId: '',
                reserveList: [],
                loading:true,
                pageSize: 100,//当前每页显示多少条数据
                pageIndex: 1,//和分页区域的current-page绑定
                pageTotal: 0,
                addReserveVisible: false,//控制添加预约时间对话框的显示和隐藏
                // 预约信息的表单，reserve添加用户的表单数据
                updateReserveVisible: false,
                reserve: {
                    resId:"",
                    resStime:"",
                    resEtime: "",
                    npeople:"",
                    onStatus: ""
                },
                timerules: {
                    resStime: [{ required: true, message: "起始时间不能为空", trigger: "blur" }],
                    resEtime: [{ required: true, message: "结束时间不能为空", trigger: "blur" }]
                }
            };
        },
        methods: {
            //获得预约信息的函数
            async getReserveList() {
                const { data: res } = await this.$http.get("reserveinfo/resinfo",{
                    params: {
                        pageIndex: this.pageIndex,
                        pageSize: this.pageSize
                    }
                });
                if (res.code !== 200) {
                    return this.$message.error(res.msg);
                }
                // console.log('get到的数据',res.data.list)
                this.reserveList = res.data.list;
                this.loading=false;
                this.pageTotal = res.data.total;
            },
            //预约信息详情，this.$message.就是一个弹窗
            async editReserve(row) {
                this.updateReserveVisible = true;
                const { data: res } = await this.$http.get(`reserveinfo/selectone/${row.resId}`);
                if (res.code === 200) {
                    this.reserve = res.data;
                } else {
                    this.$message.error("检索信息失败");
                }
            },
            //每页显示的条数， 监听 pagesize 改变的事件（下方的每页多少条）
            handleSizeChange(val) {
                this.pageSize = val;
                this.getReserveList()
            },
            //查询当前页，监听页码值改变的事件
            handleCurrentChange(val) {
                this.pageIndex = val;
                this.getReserveList();
            },
            //关闭视图
            handleClose() {
                this.addReserveVisible = false;
                this.updateReserveVisible = false;
                this.resetForm();
            },
            //表单验证
            validForm() {
                this.$refs.reserveRef.validate(valid => {
                    if (valid) {
                        if (this.reserve.resStime < this.reserve.resEtime){
                            this.updateReserve();
                            return true;
                        }else{
                            this.$message.success("起始时间须小于结束时间");
                            return false;
                        }
                    }
                    this.$message.error('请填写正确的信息');
                });
            },
            //重置表单数据
            resetForm() {
                this.$refs.reserveRef.resetFields();
            },
            //修改预约信息
            async updateReserve() {
                const { data: res } = await this.$http.put("/reserveinfo/uresinfo", this.reserve);
                if (res.code === 200) {
                    this.$message.success(res.msg);
                    this.updateReserveVisible = false;
                    this.getReserveList();
                    //数据重置为空
                    for (var i in this.reserve) {
                        this.reserve[i] = "";
                    }
                }
            },
            //删除预约信息
            delReserve(row) {
                this.$confirm("此操作将删除该预约时间的信息, 是否继续?", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning"
                })
                    .then(() => {
                        this.$http
                            .delete(`/reserveinfo/deleteres/${row.resId}`)
                            .then(successResponse => {
                                if (successResponse.data.code === 200) {
                                    this.$message.success(successResponse.data.msg);
                                    this.getReserveList();
                                }
                                if (successResponse.data.code === 400) {
                                    this.$message.error(successResponse.data.message);
                                }
                            })
                            .catch(failResponse => {
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
            async changeOnStatus(row){
                // console.log('搞笑元素构成',row)
                const { data: res } = await this.$http.post("reserveinfo/changeStatus", row);
                // const { data: res } = await this.$http.get(`hello/changeTypeStatus/${row.busType}`);
                        if (res.code === 200) {
                            this.$message.success(res.msg);
                        }
            },
           
            },
        created: function() {
            this.getReserveList();
            var mark = sessionStorage.getItem("mark");
            var userName = sessionStorage.getItem("userName");
            var ystId = sessionStorage.getItem("ystId");
            this.mark = mark;
            this.userName = userName;
            this.ystId = ystId;
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
    .input-with-select .el-input-group__prepend {
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
