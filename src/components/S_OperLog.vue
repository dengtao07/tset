<template>
    <div id="busList">
        <!--------------------面包屑导航----------------------------->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/ordinary' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>业务详情</el-breadcrumb-item>
            <el-breadcrumb-item>系统日志</el-breadcrumb-item>
        </el-breadcrumb>
        <!-------------------卡片视图区域----------------------------->
        <el-card >
            <el-form  ref="form" :model="bus" style="width: 100%">
                <!-----------搜索框搜索-------------------->
                <el-row style="width: 100%">
                    <el-col :span="5">
                        <el-form-item label="业务团队" >
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
                        <el-form-item label="业务品种" >
                            <el-select v-model="bus.bustype" clearable placeholder="请选择" style="width:58%">
                                <el-option
                                        v-for="itemtyp in bustypes"
                                        :key="itemtyp.busType"
                                        :label="itemtyp.busPname"
                                        :value="itemtyp.busType">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="业务状态" >
                            <el-select v-model="bus.bustatus" clearable placeholder="请选择" style="width:55%">
                                <el-option
                                        v-for="status in bustatus"
                                        :key="status.value"
                                        :label="status.label"
                                        :value="status.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="7">
                        <el-form-item label="预约日期"  prop="resSdate">
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
                    <!-- 添加结束 -->
                    <el-col :span="4">
                        <el-form-item >
                            <el-button  @click="handleSearch" type="primary"  icon="el-icon-search" v-preventReClick>查询</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <!-- 李宗辉添加 -->
            <el-card >
                <el-tabs v-model="activeName" @tab-click="tabClick">
                    <el-tab-pane label="普通业务" name="AUD_0">
                        <log-list v-bind:message="bus" ref="normalBus" character="AUD_0">普通业务</log-list>
                    </el-tab-pane>
                    <el-tab-pane label="文本业务" name="AUD_1">
                        <log-list v-bind:message="bus" ref="textBus" character="AUD_1">文本业务</log-list>
                    </el-tab-pane>
                </el-tabs>
            </el-card>
        </el-card>
    </div>
</template>

<script>
    import S_OperLogList from "./S_OperLogList"
    export default {
        components: {
            'log-list':S_OperLogList,
        },
        data() {
            return{
                activeName: "AUD_0",
                bus:{
                busteam:"",
                bustype:"",
                resSdate:"",
                resEdate:"",
                lowrisk:"",
                bustatus:"",
                auditype: "",
                audnames:"",
                state:"",
                personId: "",
                searchFlag: false
                },
                bustypes:[],
                bustatus:[{
                    value: "0",
                    label: "未完成"
                },{
                    value: "1",
                    label: "已完成"
                }],
                busteams:["国企及新动能团队","汽车团队","房地产团队","机构业务一团队","机构业务二团队","小企业金融部","公司金融客户一部","公司金融客户二部",
                    "公司金融客户四部","公司金融客户五部","公司金融客户六部","公司金融客户八部","公司金融客户九部","公司金融客户十部","公司金融客户十一部","公司金融客户十二部","公司金融客户十三部",
                    "公司金融客户十四部","江津支行公司金融客户部","璧山支行公司金融客户部","长寿支行公司金融客户部","涪陵支行公司金融客户部","永川支行公司金融客户部"],
                relMap:[
                {
                    value: "AUD_0",
                    label: "normalBus"
                },{
                    value: "AUD_1",
                    label: "textBus"
                }
            ],
            }
        },
        
        methods: {

            tabClick(tab){
            console.log("tab是："+tab.name)
            this.getTypes()
            let tabname = tab.name
            let refname = this.relMap.find(item => item.value == tabname)
            if(!this.bus.searchFlag){
                // console.log('搜索框为空')
                this.$refs[refname.label].getLogList();
                //隔一段时间自动搜索
                this.timer = setInterval(this.$refs[refname.label].search, 180000);
                //当点击别的标签的时候将搜索栏清空
                for (var i in this.$refs[refname.label].bus) {
                    this.$refs[refname.label].bus[i] = "";
                    // console.log('成功执行')
            }
            }else{
                // 搜索框不为空的情况,设标志位，标志位有值，则传值给子组件进行搜索
                console.log('搜索框不为空',this.bus.searchFlag)
                this.$refs[refname.label].search();
                //隔一段时间自动搜索
                this.timer = setInterval(this.$refs[refname.label].search, 180000);
            }   
        },

            handSelect(item){
                // console.log(item)
                //绑定输入框的值为选择框的personName属性
                this.bus.state = item.value
                this.bus.personId = item.personId
            },
            
            //获得业务品种
            async getTypes(){
                console.log("wozaizhixinggetTypesgetTypes")
                if(this.activeName === "AUD_0"){
                    const { data: res } = await this.$http.get("/hello/bustypelist");
                    if (res.code !== 200) {
                        return this.$message.error(res.msg);
                    }
                    this.bustypes=res.data;
                }else {
                    const { data: res } = await this.$http.get("/hello/bustypelistText");
                    if (res.code !== 200) {
                        return this.$message.error(res.msg);
                    }
                    this.bustypes=res.data;
                }
            },

            //点击搜索按钮
            handleSearch(){
                // console.log('点我了')
                //激活标志位
                this.bus.searchFlag = true;
                if(this.activeName === "AUD_0"){
                    console.log("shabi"+this.bus.searchFlag)
                    this.$refs.normalBus.search();
                }else{
                    this.$refs.textBus.search();
                }
                
                // console.log('现在的搜索标志位',this.searchFlag)
            },

        },

        // 监控所有输入框为空的事件
        computed: {
            searchExist: function(){
                let searchEmpty = this.bus.busteam === '' && this.bus.bustype === '' && this.bus.bustatus === ''
                                    && (this.bus.resSdate === '' || this.bus.resSdate === null)
                                    && (this.bus.resEdate === '' || this.bus.resEdate === null)
                return searchEmpty
            }
        },

        watch: {
            searchExist: function(){
                // console.log('我在watch里了')
                // console.log('我在watch里,一开始searchflag是',this.searchFlag)
                this.bus.searchFlag = !this.bus.searchFlag
                if(!this.bus.searchFlag){
                    if(this.activeName === "AUD_0"){
                        console.log("shabi"+this.bus.searchFlag)
                        this.$refs.normalBus.search();
                    }else{
                        this.$refs.textBus.search();
                    } 
                }
                // console.log('我在watch里,到最后searchflag是',this.searchFlag)       
            }
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
            // this.$refs.normalBus.getLogList();
            if(this.timer){
                clearInterval(this.timer);
                this.timer = null;
            }
        },
        beforeDestroy(){
            clearInterval(this.timer);
        }
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


