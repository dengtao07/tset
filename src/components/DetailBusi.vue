<template>
    <div id="busList">
        <!--------------------面包屑导航----------------------------->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/ordinary' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>业务详情</el-breadcrumb-item>
            <el-breadcrumb-item>普通业务</el-breadcrumb-item>
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
                        <el-form-item label="低风险" >
                            <el-select v-model="bus.lowrisk" clearable placeholder="请选择" style="width:55%">
                                <el-option
                                        v-for="low in lowrisks"
                                        :key="low.value"
                                        :label="low.label"
                                        :value="low.value">
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
            <detail-list v-bind:message="bus" ref="allBus" character="AUD_8"></detail-list>
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
                        <el-checkbox v-model="excelForm.isRemote" @change="handleCheckItemChange('isRemote')" label="是否远程" border></el-checkbox>
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
                </el-row>
                <el-row style="margin-top: 20px">
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.warType" @change="handleCheckItemChange('warType')" label="主要担保方式" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.collateral" @change="handleCheckItemChange('collateral')" label="质押物" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.currency" @change="handleCheckItemChange('currency')" label="币种" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.amount" @change="handleCheckItemChange('amount')" label="金额" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.busNumber" @change="handleCheckItemChange('busNumber')" label="业务编号" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.lowRisk" @change="handleCheckItemChange('lowRisk')" label="是否低风险" border></el-checkbox>
                    </el-col>
                </el-row>
                <el-row style="margin-top: 20px">
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.undCredit" @change="handleCheckItemChange('undCredit')" label="授信项下" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.greCredit" @change="handleCheckItemChange('greCredit')" label="绿色信贷" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.extLoan" @change="handleCheckItemChange('extLoan')" label="外保内贷" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.magYst" @change="handleCheckItemChange('magYst')" label="客户经理一事通" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.busManager" @change="handleCheckItemChange('busManager')" label="客户经理" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.entType" @change="handleCheckItemChange('entType')" label="行业类型" border></el-checkbox>
                    </el-col>
                </el-row>
                <el-row style="margin-top: 20px">
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.facSize" @change="handleCheckItemChange('facSize')" label="企业规模" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.reservePeo" @change="handleCheckItemChange('reservePeo')" label="预约人" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.reserveDate" @change="handleCheckItemChange('reserveDate')" label="预约时间" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.wReceiveCon" @change="handleCheckItemChange('wReceiveCon')" label="待接件耗时" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.receivePeo" @change="handleCheckItemChange('receivePeo')" label="接件人" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.receiveCon" @change="handleCheckItemChange('receiveCon')" label="接件耗时" border></el-checkbox>
                    </el-col>
                </el-row>
                <el-row style="margin-top: 20px">
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.receiveHangCon" @change="handleCheckItemChange('receiveHangCon')" label="接件挂件耗时" border></el-checkbox>
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
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.firstHangCon" @change="handleCheckItemChange('firstHangCon')" label="初审挂件耗时" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.wSecondAudCon" @change="handleCheckItemChange('wSecondAudCon')" label="待复核耗时" border></el-checkbox>
                    </el-col>
                </el-row>
                <el-row style="margin-top: 20px">
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
                        <el-checkbox v-model="excelForm.wReleaseCon" @change="handleCheckItemChange('wReleaseCon')" label="待放款耗时" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.releasePeo" @change="handleCheckItemChange('releasePeo')" label="放款人" border></el-checkbox>
                    </el-col>
                    <el-col :span="4">
                        <el-checkbox v-model="excelForm.releaseCon" @change="handleCheckItemChange('releaseCon')" label="待放款耗时" border></el-checkbox>
                    </el-col>
                </el-row>
                <el-row style="margin-top: 20px">
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
    import DetailList from "./DetailList"
    import { getToken, setToken } from '@/util/app'
    export default {
        components: {
            'detail-list':DetailList,
        },

        data() {
            return{
                activeName: "AUD_8",
                excelVisible: false,
                searchFlag: false,
                lowrisks:[
                    {
                    value: "1",
                    label: "是",
                }, {
                    value: "0",
                    label: "否",
                }],
                auditypes:[{
                    value: "0",
                    label: "客户经理",
                },{
                    value: "1",
                    label: "接件人",
                },{
                    value: "2",
                    label: "初审人",
                },{
                    value: "3",
                    label: "复核人",
                }
                ],
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
                    isRemote:true,
                    busTeam: true,
                    cusName: true,
                    busPname: true,
                    warType: true,
                    collateral: true,
                    currency: true,
                    amount: true,
                    busNumber: true,
                    lowRisk: true,
                    undCredit: true,
                    greCredit: true,
                    extLoan: true,
                    magYst: true,
                    busManager: true,
                    entType: true,
                    facSize: true,
                    reservePeo: true,//预约人
                    reserveDate: true,//预约时间
                    wReceiveCon: true,//待接件耗时
                    receivePeo: true,//接件人
                    receiveCon:true,//接件耗时
                    receiveHangCon: true,//接件挂件耗时
                    wFirstAudCon: true,//待初审耗时
                    firstAudPeo: true,//初审人
                    firstAudCon: true,//初审耗时
                    firstHangCon: true,//初审挂件耗时
                    wSecondAudCon: true,//待复核耗时
                    secondAudPeo: true,//复核人
                    secondAudCon: true,//复核耗时
                    secondHangCon: true,//复核挂件耗时
                    wReleaseCon: true, //待放款耗时
                    releasePeo: true,//放款人
                    releaseCon: true,//放款耗时
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
                        console.log('bbb',item.chsName)
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
            async getTypes(){
                const { data: res } = await this.$http.get("/hello/bustypelist");
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
                // console.log("拿到的页面数据是：", this.$refs.allBus.doneBusIds)
                this.doneBusIds = this.$refs.allBus.doneBusIds
                this.processBusIds = this.$refs.allBus.processBusIds
                // let url = `http://99.170.26.181:8085/toexcel/downloadV2?doneBusIds=${this.doneBusIds}&processBusIds=${this.processBusIds}&options=${options.join(',')}&excelname=${excelForm.excelName}&busflag=0&X-Token=${getToken()}`
                let url = `http://cqaarn.bcsoa.cmbchina.cn/api/toexcel/downloadV2?doneBusIds=${this.doneBusIds}&processBusIds=${this.processBusIds}&options=${options.join(',')}&excelname=${excelForm.excelName}&busflag=0&X-Token=${getToken()}`
                console.log("openurl之前.........")
                window.open(url);
                console.log("openurl之后.........")
                // const response = await this.$http.get(url,{
                //     responseType: 'blob',
                // });
                // console.log("执行一大段之前......")
                // const blob = new Blob([response.data]);
                // //console.log('respose', response.headers['content-disposition']);
                // const A = document.createElement('A');//创建标签
                // const uri = window.URL.createObjectURL(blob);//创建链接
                // const contentDisposition = response.headers['content-disposition'];
                // const  filename = contentDisposition.split('=')[1];
                // A.download = filename;//下载文件名字
                // A.href = uri;
                // A.click();
                // window.URL.revokeObjectURL(uri);//关闭
                // this.excelVisible = false;
                // this.resetForm();
                // console.log("执行一大段之后......")
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
            this.getTypes();
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


