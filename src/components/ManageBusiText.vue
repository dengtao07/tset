<template>
    <div id="busList">
        <!--------------------面包屑导航----------------------------->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/ordinary' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>业务列表</el-breadcrumb-item>
            <el-breadcrumb-item>业务管理</el-breadcrumb-item>
            <el-breadcrumb-item>按业务查询</el-breadcrumb-item>
            <el-breadcrumb-item>文本业务</el-breadcrumb-item>
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
                        <el-form-item label="业务品种">
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
                        <el-form-item label="预约日期">
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
                        <el-form-item >
                            <el-button  @click="handleAuditingSearch" type="primary"  icon="el-icon-search" v-preventReClick>查询</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <!---------------------------基础信息表格--------------------------------->
            <el-tabs v-model="activeName" @tab-click="tabClick">
                <el-tab-pane label="业务列表" name="AUD_0">
                    <manage-list-text v-bind:message="bus" ref="allBus" character="AUD_0"></manage-list-text>
                </el-tab-pane>
                <el-tab-pane label="预约业务" name="AUD_1">
                    <manage-list-text v-bind:message="bus" ref="reserveBus" character="AUD_1"></manage-list-text>
                </el-tab-pane>
                <el-tab-pane label="在审业务" name="AUD_3">
                    <manage-list-text v-bind:message="bus" ref="audingBus" character="AUD_3"></manage-list-text>
                </el-tab-pane>
                <el-tab-pane label="待完善业务" name="AUD_4">
                    <manage-list-text v-bind:message="bus" ref="waitBus" character="AUD_4"></manage-list-text>
                </el-tab-pane>
                <el-tab-pane label="已完成业务" name="AUD_5">
                    <manage-list-text v-bind:message="bus" ref="doneBus" character="AUD_5"></manage-list-text>
                </el-tab-pane>
                <el-tab-pane label="已退件业务" name="AUD_6">
                    <manage-list-text v-bind:message="bus" ref="giveupBus" character="AUD_6"></manage-list-text>
                </el-tab-pane>
                <!----------------------我的挂件子部分------------------>
            </el-tabs>
        </el-card>
    </div>
</template>

<script>
    import ManageListText from "./ManageListText"
    export default {
    components: { 
        'manage-list-text':ManageListText,
    },
        data() {
        /*获取业务列表数据*/
        return {
            busteams:["国企及新动能团队","汽车团队","房地产团队","机构业务一团队","机构业务二团队","小企业金融部","公司金融客户一部","公司金融客户二部",
                "公司金融客户四部","公司金融客户五部","公司金融客户六部","公司金融客户八部","公司金融客户九部","公司金融客户十部","公司金融客户十一部","公司金融客户十二部","公司金融客户十三部",
                "公司金融客户十四部","江津支行公司金融客户部","璧山支行公司金融客户部","长寿支行公司金融客户部","涪陵支行公司金融客户部","永川支行公司金融客户部"],
            bustypes:[],
            busList: [],
            bus:{
                busteam:"",
                bustype:"",
                subSdate: "",
                subEdate: ""
                },
            relMap:[
                {
                    value: "AUD_0",
                    label: "allBus"
                },{
                    value: "AUD_1",
                    label: "reserveBus"
                },{
                    value: "AUD_3",
                    label: "audingBus"
                },{
                    value: "AUD_4",
                    label: "waitBus"
                },{
                    value: "AUD_5",
                    label: "doneBus"
                },{
                    value: "AUD_6",
                    label: "giveupBus"
                }
            ],
            // 多选框
            // multipleSelection: [],
            //活动的栏位，页面加载的时候初始赋值
            activeName: "AUD_0",
            searchFlag: false,
            }
        },
        
    methods: {
       
        //点击每个栏位时的设置,通过getBusList()和search()函数去后端查询
        //初始加载的时候，若不点击栏位，则不进来
        tabClick(tab){
            let tabname = tab.name
            // console.log('现在的栏位')
            let refname = this.relMap.find(item => item.value == tabname)
            if(!this.searchFlag){
                // console.log('搜索框为空')
                this.$refs[refname.label].getBusList();
                //隔一段时间自动搜索
                this.timer = setInterval(this.$refs[refname.label].search, 180000);
                //当点击别的标签的时候将搜索栏清空 
                for (var i in this.$refs[refname.label].bus) {
                    this.$refs[refname.label].bus[i] = "";
                    // console.log('成功执行')
            }
            }else{
                // 搜索框不为空的情况,设标志位，标志位有值，则传值给子组件进行搜索
                // console.log('搜索框不为空',this.searchFlag)
                this.$refs[refname.label].search();
                //隔一段时间自动搜索
                this.timer = setInterval(this.$refs[refname.label].search, 180000);
            }   
        },

        //获得业务品种
        async getTextTypes(){
            const { data: res } = await this.$http.get("/hello/bustypelistText");
            if (res.code !== 200) {
              return this.$message.error(res.msg);
            }
            this.bustypes = res.data;
        },

        //点击搜索按钮
        handleAuditingSearch(tab){
            // console.log('点我了')
            // console.log('现在的预约开始时间',this.bus.resSdate)
            //激活标志位
            this.searchFlag = true;
            this.activeName = "AUD_0";
            //初始只搜索allbus，因为再点击别的栏位的时候，会自动调用tabClick()函数
            this.$refs.allBus.search();
            // console.log('现在的搜索标志位',this.searchFlag)
        },
            
        },

        //绑定属性，动态监控所有输入框是否为空
        computed: {
            searchExist: function(){
                let searchEmpty = this.bus.busteam === '' && this.bus.bustype === '' && this.bus.lowrisk === '' && (this.bus.resSdate === '' || this.bus.resSdate === null) && (this.bus.resEdate === '' || this.bus.resEdate === null)
                return searchEmpty
            }
        },

        //绑定属性，动态监控所有输入框是否为空
        watch: {
            searchExist: function(){
                // console.log('我在watch里了')
                // console.log('我在watch里,一开始searchflag是',this.searchFlag)
                this.searchFlag = !this.searchFlag
                if(!this.searchFlag){
                    this.$refs.allBus.getBusList();
                }
                // console.log('我在watch里,到最后searchflag是',this.searchFlag)       
            }
        },

        // created: function() {
        //     // this.getBusList();
        // },

        mounted:function(){
            this.getTextTypes();
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


