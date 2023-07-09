<template>
    <div id="busTypeList">
        <!-----------------------面包屑导航------------------->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/ordinary' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>系统管理</el-breadcrumb-item>
            <el-breadcrumb-item>业务品种</el-breadcrumb-item>
        </el-breadcrumb>
        <!----------------------卡片视图区域------------------>
        <el-card>
            <el-row :gutter="20" v-if="this.mark !== 'AUD_LED'">
                <!-- 添加业务品种的按钮 -->
                <el-col :span="2" :offset="30">
                    <el-button size="medium" type="primary" style="width: 120px"  plain @click="addBusTypeVisible = true" v-preventReClick>添加</el-button>
                </el-col>
            </el-row>
            <!--列表区域，:data 为当前表格指定数据源，数据源中每一个对象被渲染为一行，border为边框线，v-loading="loading"-->
            <div>
                <el-table
                        v-loading="loading"
                        ref="multipleTable"
                        :data="busTypeList"
                        tooltip-effect="dark"
                        :border="true"
                        :highlight-current-row="true"
                        max-height="530px"
                        size="small"
                        :default-sort="{prop: 'busType', order: 'descending'}"
                        style="width: 100%"
                >
                    <!--table表单中的 prop 为 controller 数据源列名，label 为姓名，scope.row 拿到此行数据-->
                    <el-table-column type="index" width="70px" align="center"></el-table-column>
                    <el-table-column prop="busPname" label="业务品种" width="888px" align="center"></el-table-column>
                    <el-table-column label="操作" align="center" v-if="this.mark !== 'AUD_LED'">
                        <!--type为样式，editBusType是一个方法，在后面methods定义-->
                        <template slot-scope="scope">
                            <el-button
                                    @click="editBusType(scope.row)"
                                    size="small"
                                    type="primary"
                                    icon="el-icon-edit"
                                    circle
                                    v-preventReClick
                            ></el-button>
                            <!-- <el-button
                                    @click="delBusType(scope.row)"
                                    size="small"
                                    type="danger"
                                    icon="el-icon-delete"
                                    circle
                            ></el-button> -->
                        </template>
                    </el-table-column>
                    <el-table-column label="是否启用" align="center">
                        <template slot-scope="scope">
                            <el-switch
                                active-value="1"
                                inactive-value="0"
                                v-model="scope.row.onStatus" 
                                @change="changeOnStatus(scope.row)"
                                v-preventReClick>
                            </el-switch>
                        </template>
                    </el-table-column>
                    
                </el-table>
            </div>
            <!-- 分页区域，layout展示页面展示那些功能组件，total总共有多少条数据  -->
            <div class="block">
                <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page="pageIndex"
                        :page-sizes="[30, 60, 90, 120]"
                        :page-size="pageSize"
                        layout="total, sizes, prev, pager, next, jumper"
                        :total="pageTotal"
                ></el-pagination>
            </div>
        </el-card>
        <!-- 新增业务品种信息的视图，添加用户的dialog对话框，visible.sync属性绑定，用来控制对话框的显示和隐藏，需要将其
        绑定到一个布尔值上面，还未定义，所以要在data()中进行绑定，before-close在关闭对话框前触发的事件-->
        <el-dialog
                title="新增业务品种信息"
                :visible.sync="addBusTypeVisible"
                :close-on-click-modal="false"
                :before-close="handleClose"
                width="30%"
                center
        >
            <!--model为表单数据，rules为验证规则，ref是给el-from起了一个引用名称，v-model双向绑定-->
            <el-form ref="busTypeRef" :rules="rules" label-width="80px" :model="busType" size="small">
                <el-form-item label="业务大类" prop="isText">
                    <el-select v-model="busType.isText" clearable placeholder="请选择" style="width: 100%">
                                <el-option
                                        v-for="item in busCategory"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="业务品种" prop="busPname">
                    <el-input v-model="busType.busPname"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域，按钮居中显示 -->
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="resetForm" v-preventReClick>重置</el-button>
                <el-button type="primary" @click="addBusType" v-preventReClick>提交</el-button>
            </span>
        </el-dialog>
        <!-- -----------修改业务品种信息的视图 ----------->
        <el-dialog
                title="修改业务品种信息"
                :visible.sync="updateBusTypeVisible"
                :close-on-click-modal="false"
                :before-close="handleClose"
                width="30%"
                center
        >
            <el-form ref="busTypeRef" :rules="rules" label-width="80px" :model="busType" size="small">
                <el-form-item label="业务大类" prop="isText">
                    <el-select v-model="busType.isText" clearable placeholder="请选择" style="width: 100%">
                                <el-option
                                        v-for="item in busCategory"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="业务品种" prop="busPname">
                    <el-input v-model="busType.busPname"></el-input>
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
            //获取业务品种数据
            return {
                busCategory:[{
                    value: "0",
                    label: "普通业务"
                },{
                    value: "1",
                    label: "文本业务"
                }],
                mark: '',
                userName: '',
                ystId: '',
                busTypeList: [],
                loading:true,
                pageSize: 30,//当前每页显示多少条数据
                pageIndex: 1,//和分页区域的current-page绑定
                pageTotal: 0,
                addBusTypeVisible: false,//控制添加业务品种对话框的显示和隐藏
                updateBusTypeVisible: false,
                busType: {
                    busType:"",
                    busPname: "",
                    onStatus: "",
                    isText: "",
                },
                rules: {
                    busPname: [{ required: true, message: "业务品种不能为空", trigger: "blur" }],
                    isText: [{ required: true, message: "业务大类不能为空", trigger: "blur" }]
                }
            };
        },
        methods: {
            //获得业务品种信息的函数
            async getBusTypeList() {
                const { data: res } = await this.$http.get("hello/bustype",{
                    params: {
                        pageIndex: this.pageIndex,
                        pageSize: this.pageSize
                    }
                });
                if (res.code !== 200) {
                    return this.$message.error(res.msg);
                }
                this.busTypeList = res.data.list;
                this.loading=false;
                this.pageTotal = res.data.total;
            },
            //业务品种信息详情，this.$message 是一个弹窗
            async editBusType(row) {
                this.updateBusTypeVisible = true;
                const { data: res } = await this.$http.get(`hello/selectOne/${row.busType}`);
                if (res.code === 200) {
                    this.busType = res.data;
                } else {
                    this.$message.error("获取业务品种信息失败");
                }
            },
            //每页显示的条数， 监听 pagesize 改变的事件（下方的每页多少条）
            handleSizeChange(val) {
                this.pageSize = val;
                this.getBusTypeList()
            },
            //查询当前页，监听页码值改变的事件
            handleCurrentChange(val) {
                this.pageIndex = val;
                this.getBusTypeList();
            },
            //关闭视图
            handleClose() {
                this.addBusTypeVisible = false;
                this.updateBusTypeVisible = false;
                this.resetForm();
            },
            //表单验证
            validForm() {
                this.$refs.busTypeRef.validate(valid => {
                    if (valid) {
                        this.updateBusType();
                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
            },
            //重置表单数据
            resetForm() {
                this.$refs.busTypeRef.resetFields();
            },
            //修改业务品种信息
            async updateBusType() {
                const { data: res } = await this.$http.put("/hello/ubustype", this.busType);
                if (res.code === 200) {
                    this.$message.success(res.msg);
                    this.updateBusTypeVisible = false;
                    this.getBusTypeList();
                    this.resetForm();
                }
            },
            //删除业务品种
            // delBusType(row) {
            //     this.$confirm("此操作将删除该业务品种的信息, 是否继续?", "提示", {
            //         confirmButtonText: "确定",
            //         cancelButtonText: "取消",
            //         type: "warning"
            //     })
            //         .then(() => {
            //             this.$http
            //                 .delete(`/hello/deletetype/${row.busType}`)
            //                 .then(successResponse => {
            //                     if (successResponse.data.code === 200) {
            //                         this.$message.success(successResponse.data.msg);
            //                         this.getBusTypeList();
            //                     }
            //                     if (successResponse.data.code === 400) {
            //                         this.$message.error(successResponse.data.message);
            //                     }
            //                 })
            //                 .catch(failResponse => {
            //                     console.log("删除失败");
            //                 });
            //         })
            //         .catch(() => {
            //             this.$message({
            //                 type: "info",
            //                 message: "已取消操作"
            //             });
            //         });
            //     },
            async changeOnStatus(row){
                // console.log('搞笑元素构成',row)
                const { data: res } = await this.$http.post("hello/changeTypeStatus", row);
                // const { data: res } = await this.$http.get(`hello/changeTypeStatus/${row.busType}`);
                        if (res.code === 200) {
                            this.$message.success(res.msg);
                        }
            },
            //点击确定，添加业务品种的函数，进行预校验
            addBusType() {
                this.$refs.busTypeRef.validate(async valid => {
                    if (valid) {
                        //发起添加用户的网络请求，因为上面已有busType对象，所以可直接写this.busType
                        const { data: res } = await this.$http.post("hello/inserttype", this.busType);
                        if (res.code === 200) {
                            this.$message.success(res.msg);
                            //隐藏添加业务品种的对话框
                            this.addBusTypeVisible = false;
                            this.getBusTypeList();
                            //重新获取业务品种列表数据
                            this.resetForm();
                        }
                    } else {
                        console.log("error submit!!");
                        return false;
                    }
                });
            }},
        created: function() {
            this.getBusTypeList();
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
