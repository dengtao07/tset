<template>
    <div id="busList">
        <!--------------------面包屑导航----------------------------->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/ordinary' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>业务详情</el-breadcrumb-item>
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
                    <el-col :span="7">
                        <el-form-item label="提交日期"  prop="resSdate">
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
                    <!-- 李宗辉添加 -->
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
                    <el-col :span="5">

                    </el-col>
                    <el-col :span="4">
                        <el-form-item label="人员类型" >
                            <el-select v-model="bus.auditype" clearable placeholder="请选择" style="width:55%">
                                <el-option
                                        v-for="typ in auditypes"
                                        :key="typ.value"
                                        :label="typ.label"
                                        :value="typ.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="人员姓名" >
                            <el-autocomplete class='inline-input' 
                            :popper-append-to-body="false"
                            popper-class="select-option"
                            autocomplete="off"  
                            v-model="bus.state" 
                            :fetch-suggestions="querySearchAsync" 
                            placeholder="姓名/6位一事通ID" 
                            :trigger-on-focus="false" 
                            @select="handSelect"
                            :clearable="true"
                            @clear="clearSearch"
                            ref="elautocomplete"
                            style="width:80%;">
                            </el-autocomplete>
                        </el-form-item>
                    </el-col>
                    <!-- 添加结束 -->
                    <el-col :span="4">
                        <el-form-item >
                            <el-button  @click="handlePauditingSearch" type="primary"  icon="el-icon-search" v-preventReClick>查询</el-button>
                            <el-button  @click="excel" type="info" icon="el-icon-edit" v-preventReClick>导出Excel</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <!-- 李宗辉添加 -->
            <detail-list-text v-bind:message="bus" ref="allBus" character="AUD_8"></detail-list-text>
        </el-card>

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
            <el-form ref="excelRef" :model="excelForm"  label-width="100px"  size="small">
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
    import DetailListText from "./DetailListText"
    import { getToken, setToken } from '@/util/app'
    export default {
        components: {
            'detail-list-text':DetailListText,
        },

        data() {
            return{
                activeName: "AUD_8",
                excelVisible: false,
                searchFlag: false,
                auditypes:[{
                    value: "0",
                    label: "客户经理",
                },{
                    value: "1",
                    label: "初审人",
                },{
                    value: "2",
                    label: "复核人",
                }
                ],
                bus:{
                busteam:"",
                bustype:"",
                subSdate:"",
                subEdate:"",
                bustatus:"",
                auditype: "",
                audnames:"",
                state:"",
                personId: "",
                mark: "",
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
                checkAll: true,
                doneBusIds: [],
                processBusIds: [],
            }
        },
        
        methods: {

            //获取建议输入列表
            async querySearchAsync(queryString, cb){
                // console.log('获取输入值：',this.bus.state)
                const { data: res} = await this.$http.get("/v2/searchPerson",{
                    params: {
                        state: this.bus.state,
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
                this.bus.state = item.value
                this.bus.personId = item.personId
            },

            clearSearch(){
                // console.log('我要关闭了')
                this.bus.personId = ""
            },
            
            //获得业务品种
            async getTextTypes(){
                const { data: res } = await this.$http.get("/hello/bustypelistText");
                if (res.code !== 200) {
                    return this.$message.error(res.msg);
                }
                this.bustypes=res.data;
            },

            //为了搜索时重置页码数据
            handlePauditingSearch(){
                // console.log('点我了')
                //激活标志位
                this.searchFlag = true;
                this.$refs.allBus.search();
                // console.log('现在的搜索标志位',this.searchFlag)
                // this.bus.auditype = "";
                // this.bus.personId = "";
            },

            //每页显示的条数， 监听 pagesize 改变的事件（下方的每页多少条）
            handleSizeChange(val) {
                this.pageSize = val;
                if(this.bus.busteam === ''&&this.bus.bustype === ''&&this.bus.lowrisk === ''&&this.bus.resdate === ''){
                    this.getBusList();
                }else{
                    this.pauditingSearch();
                }
            },

            //查询当前页，监听页码值改变的事件
            handleCurrentChange(val) {
                this.pageIndex = val;
                if(this.bus.busteam === ''&&this.bus.bustype === ''&&this.bus.lowrisk === ''&&this.bus.resdate === ''){
                    this.getBusList();
                }else{
                    this.pauditingSearch();
                }
            },

            //导出Excel
            async excel(){
                this.excelVisible = true;
            },
            
            validExcel(){ 
                this.toExcel();
            },

            async toExcel(){
                let options = [];
                const excelForm = this.excelForm;
                // console.log('swgugduagudgh'+excelForm)
                for (let key of Object.keys(excelForm)) {
                    if (key === 'endTime' || key === 'startTime') {
                        continue;
                    }
                    if (!excelForm[key]) {
                        continue;
                    }
                    options.push(key);
                    // console.log('swgugduagudgh'+options)
                }
                console.log("请求下载之前......")
                // console.log("拿到的页面数据是：", this.$refs.allBus.doneBusIds)
                this.doneBusIds = this.$refs.allBus.doneBusIds
                this.processBusIds = this.$refs.allBus.processBusIds
                // let url = `http://99.170.26.181:8085/toexcel/downloadV2?doneBusIds=${this.doneBusIds}&processBusIds=${this.processBusIds}&options=${options.join(',')}&excelname=${excelForm.excelName}&busflag=1&X-Token=${getToken()}`
                let url = `http://cqaarn.bcsoa.cmbchina.cn/api/toexcel/downloadV2?doneBusIds=${this.doneBusIds}&processBusIds=${this.processBusIds}&options=${options.join(',')}&excelname=${excelForm.excelName}&busflag=1&X-Token=${getToken()}`
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
            //关闭视图
            handleClose() {
                this.excelVisible = false;
                if(this.$refs.excelRef !== undefined){
                    this.$refs.excelRef.resetFields();
                }
            },

        },
        

        //监控所有输入框为空的事件
        computed: {
            searchExist: function(){
                let searchEmpty = this.bus.busteam === '' && this.bus.bustype === '' 
                                    && this.bus.lowrisk === '' && (this.bus.resSdate === '' || this.bus.resSdate === null)
                                    && (this.bus.resEdate === '' || this.bus.resEdate === null) && this.bus.bustatus === '' && this.bus.auditype === '' 
                                    && this.bus.state === ''
                return searchEmpty
            }
        },

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
        
        
        created: function() {
            var mark = sessionStorage.getItem("mark");
            var userName = sessionStorage.getItem("userName");
            var ystId = sessionStorage.getItem("ystId");
            this.bus.mark = mark;
            this.userName = userName;
            this.ystId = ystId;
        },

        mounted:function(){
            this.getTextTypes();
            this.$refs.allBus.getBusList();
            if(this.timer){
                clearInterval(this.timer);
                this.timer = null;
            }
            // if(this.activeName === "AUD_REC") {
            //     this.timer = setInterval(this.$refs.receiveBus.search, 180000);
            // }
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


