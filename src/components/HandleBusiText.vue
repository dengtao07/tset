<template>

  <div id="busList">

    <!--------------------面包屑导航----------------------------->

    <el-breadcrumb separator-class="el-icon-arrow-right">

      <el-breadcrumb-item>首页</el-breadcrumb-item>

      <el-breadcrumb-item>业务列表</el-breadcrumb-item>

      <el-breadcrumb-item>文本业务</el-breadcrumb-item>

    </el-breadcrumb>

    <!-------------------卡片视图区域----------------------------->

    <el-card>

      <el-tabs v-model="activeName" @tab-click="tabClick">

        <el-tab-pane label="业务列表" name="AUD_MAG" v-if="mark === 'AUD_MAG'">

          <handle-list-text
            ref="manageBus"
            character="AUD_MAG"
          ></handle-list-text>

        </el-tab-pane>

        <el-tab-pane label="初审业务" name="AUD_FIR">

          <handle-list-text
            ref="firstAudBus"
            character="AUD_FIR"
          ></handle-list-text>

        </el-tab-pane>

        <el-tab-pane label="复核业务" name="AUD_SEC" v-if="mark !== 'AUD_REC'">

          <handle-list-text
            ref="secondAudBus"
            character="AUD_SEC"
          ></handle-list-text>

        </el-tab-pane>

        <el-tab-pane label="历史初审" name="AUD_FIR_HIS">

          <handle-list-history-text
            ref="firstAudBusHis"
            character="AUD_FIR"
          ></handle-list-history-text>

        </el-tab-pane>

        <el-tab-pane
          label="历史复核"
          name="AUD_SEC_HIS"
          v-if="mark !== 'AUD_REC'"
        >

          <handle-list-history-text
            ref="secondAudBusHis"
            character="AUD_SEC"
          ></handle-list-history-text>

        </el-tab-pane>

        <!----------------------我的挂件子部分------------------>

        <el-tab-pane label="待完善业务" name="hang">

          <!----------------------我的挂件表单-------------->

          <!-- V3 挂件人员下拉搜索框 -->

          <el-form ref="searchForm" v-model="searcHangBus" style="width: 100%">

            <el-row style="width: 100%">

              <el-col :span="4">

                <el-form-item label="审核人员">

                  <el-select
                    v-model="searcHangBus.staffInfo"
                    clearable
                    placeholder="请选择"
                    style="width: 70%"
                  >

                    <el-option
                      v-for="item in staffNames"
                      :key="item.staffName"
                      :label="`${item.staffName}@${item.staffYST}`"
                      :value="item.staffYST"
                    >

                    </el-option>

                  </el-select>

                </el-form-item>

              </el-col>

              <el-col :span="5">

                <el-form-item label="管户团队">

                  <el-select
                    v-model="searcHangBus.busTeam"
                    clearable
                    placeholder="请选择"
                    style="width: 70%"
                  >

                    <el-option
                      v-for="item in busteams"
                      :key="item"
                      :label="item"
                      :value="item"
                    >

                    </el-option>

                  </el-select>

                </el-form-item>

              </el-col>

              <el-col :span="5">

                <el-form-item label="客户名称">

                  <el-input
                    v-model="searcHangBus.cusName"
                    placeholder="请输入......"
                    style="width: 70%"
                  >

                  </el-input>

                </el-form-item>

              </el-col>

              <el-col :span="6">

                <el-form-item label="客户经理">

                  <el-autocomplete
                    class="inline-input"
                    :popper-append-to-body="false"
                    popper-class="select-option"
                    autocomplete="off"
                    v-model="searcHangBus.state"
                    :fetch-suggestions="querySearchAsync"
                    placeholder="姓名/6位一事通ID"
                    :trigger-on-focus="false"
                    @select="handSelect"
                    :clearable="true"
                    @clear="clearSearch"
                    ref="elautocomplete"
                    style="width:70%;"
                  >

                  </el-autocomplete>

                </el-form-item>

              </el-col>

              <!-- 添加结束 -->

              <el-col :span="4">

                <el-form-item>

                  <el-button
                    @click="handlePauditingSearch"
                    type="primary"
                    icon="el-icon-search"
                    v-preventReClick
                  >
                    查询
                  </el-button>

                </el-form-item>

              </el-col>

            </el-row>

          </el-form>

          <div style="margin:30px 0 0">

            <el-table
              v-loading="loading"
              ref="multipleTable"
              :data="hangList"
              tooltip-effect="dark"
              :border="true"
              :highlight-current-row="true"
              @selection-change="handleSelectionChange"
              max-height="530px"
              size="small"
              style="width: 100%"
            >

              <!--table表单中的 prop 为controller数据源的列名，label为姓名，scope.row为拿到这一行的数据-->

              <!--<el-table-column type="selection" width="40"></el-table-column>-->

              <el-table-column type="selection" width="0"></el-table-column>

              <el-table-column
                type="index"
                width="40"
                align="center"
              ></el-table-column>

              <el-table-column
                prop="busTeam"
                label="业务团队"
                align="center"
              ></el-table-column>

              <el-table-column
                prop="cusName"
                label="客户名称"
                align="center"
              ></el-table-column>

              <el-table-column
                prop="busPname"
                label="业务品种"
                align="center"
              ></el-table-column>

              <el-table-column
                prop="busManager"
                label="客户经理"
                align="center"
              ></el-table-column>

              <el-table-column
                prop="subDate"
                label="提交日期"
                align="center"
              ></el-table-column>

              <el-table-column
                prop="subTime"
                label="提交时间"
                align="center"
              ></el-table-column>

              <el-table-column
                prop="proName"
                label="审查人员"
                align="center"
              ></el-table-column>

              <el-table-column
                prop="resDate"
                label="挂件日期"
                align="center"
              ></el-table-column>

              <el-table-column
                prop="resStime"
                label="挂件时间"
                align="center"
              ></el-table-column>

              <el-table-column
                fixed="right"
                label="处理"
                v-if="this.mark !== 'AUD_LED'"
                align="center"
                width="125%"
              >

                <!--type为样式，editEmp是一个方法，在后面methods是定义了的-->

                <template slot-scope="scope">

                  <el-button
                    v-show="scope.row.befState == '03'"
                    @click="firstUndo(scope.row, scope.$index)"
                    size="small"
                    type="text"
                    v-preventReClick
                    :disabled="
                      scope.row.disabled === undefined
                        ? false
                        : scope.row.disabled
                    "
                  >
                    欠缺已完善(初审)
                  </el-button>

                  <el-button
                    v-show="scope.row.befState == '05'"
                    @click="secondUndo(scope.row, scope.$index)"
                    size="small"
                    type="text"
                    v-preventReClick
                    :disabled="
                      scope.row.disabled === undefined
                        ? false
                        : scope.row.disabled
                    "
                  >
                    欠缺已完善(复核)
                  </el-button>

                </template>

              </el-table-column>

            </el-table>

          </div>

          <!-- 分页区域，layout展示页面上展示哪些功能组件，total总共有多少条数据  -->

          <div class="block">

            <el-pagination
              @size-change="handleSizeChangeHang"
              @current-change="handleCurrentChangeHang"
              :current-page.sync="pageIndexHang"
              :page-sizes="[100, 200, 300, 400]"
              :page-size.sync="pageSizeHang"
              layout="total, sizes, prev, pager, next, jumper"
              :total="pageTotalHang"
            ></el-pagination>

          </div>

        </el-tab-pane>

      </el-tabs>

    </el-card>

  </div>

</template>

<script>
import HandleListHisText from "./HandleListHisText";
import HandleListText from "./HandleListText";

export default {
  components: {
    "handle-list-history-text": HandleListHisText,
    "handle-list-text": HandleListText,
  },
  data() {
    /*获取业务列表数据*/
    return {
      bustypes: [],
      activeName: "AUD_MAG",
      loading: true,
      currentRow: {},
      //用户信息
      mark: "",
      ystId: "",
      userName: "",
      searcHangBus: {
        staffInfo: "",
        busTeam: "",
        cusName: "",
        state: "",
        personId: "",
      },
      staffInfo: "",
      staffNames: [],
      busteams: [
        "国企及新动能团队",
        "汽车团队",
        "房地产团队",
        "机构业务一团队",
        "机构业务二团队",
        "小企业金融部",
        "公司金融客户一部",
        "公司金融客户二部",
        "公司金融客户四部",
        "公司金融客户五部",
        "公司金融客户六部",
        "公司金融客户八部",
        "公司金融客户九部",
        "公司金融客户十部",
        "公司金融客户十一部",
        "公司金融客户十二部",
        "公司金融客户十三部",
        "公司金融客户十四部",
        "江津支行公司金融客户部",
        "璧山支行公司金融客户部",
        "长寿支行公司金融客户部",
        "涪陵支行公司金融客户部",
        "永川支行公司金融客户部",
      ],
      hangList: [],
      //挂件业务
      pageSizeHang: 100,
      pageIndexHang: 1,
      pageTotalHang: 0,
      secondUndoDisable: false,
      firstUndoDisable: false,
    };
  },

  created: function() {
    // this.getStaffNames();
    // var mark = sessionStorage.getItem("mark");
    // var userName = sessionStorage.getItem("userName");
    // var ystId = sessionStorage.getItem("ystId");
    // this.mark = mark;
    // this.userName = userName;
    // this.ystId = ystId;
    // //当是管理角色是刚进来呈现的是业务列表
    // if(mark === 'AUD_MAG'){
    //     this.activeName = "AUD_MAG";
    // }else{
    //     this.activeName = "AUD_FIR";
    // }
  },

  methods: {
    //点击标签卡片
    tabClick(tab) {
      if (this.timer) {
        clearInterval(this.timer);
        this.timer = null;
      }
      //点击我的挂件标签
      if (tab.name === "hang") {
        this.getHangList();
      }
      //点击初审标签
      if (tab.name === "AUD_FIR") {
        this.$refs.firstAudBus.pageIndex = 1;
        this.$refs.firstAudBus.pageSize = 100;
        this.$refs.firstAudBus.getBusList();
        this.timer = setInterval(this.$refs.firstAudBus.search, 180000);
        //当点击别的标签的时候将搜索栏清空
        for (var i in this.$refs.firstAudBus.bus) {
          this.$refs.firstAudBus.bus[i] = "";
        }
      }
      //点击复核标签
      if (tab.name === "AUD_SEC") {
        this.$refs.secondAudBus.pageIndex = 1;
        this.$refs.secondAudBus.pageSize = 100;
        this.$refs.secondAudBus.getBusList();
        this.timer = setInterval(this.$refs.secondAudBus.search, 180000);
        //当点击别的标签的时候将搜索栏清空
        for (var i in this.$refs.secondAudBus.bus) {
          this.$refs.secondAudBus.bus[i] = "";
        }
      }
      //点击初审历史标签
      if (tab.name === "AUD_FIR_HIS") {
        this.$refs.firstAudBusHis.pageIndexHistory = 1;
        this.$refs.firstAudBusHis.pageSizeHistory = 100;
        this.$refs.firstAudBusHis.getHistoryList();
        this.timer = setInterval(
          this.$refs.firstAudBusHis.historySearch,
          180000
        );
        //当点击别的标签的时候将搜索栏清空
        for (var i in this.$refs.firstAudBusHis.bus) {
          this.$refs.firstAudBusHis.bus[i] = "";
        }
      }
      //点击复核历史标签
      if (tab.name === "AUD_SEC_HIS") {
        this.$refs.secondAudBusHis.pageIndexHistory = 1;
        this.$refs.secondAudBusHis.pageSizeHistory = 100;
        this.$refs.secondAudBusHis.getHistoryList();
        this.timer = setInterval(
          this.$refs.secondAudBusHis.historySearch,
          180000
        );
        //当点击别的标签的时候将搜索栏清空
        for (var i in this.$refs.secondAudBusHis.bus) {
          this.$refs.secondAudBusHis.bus[i] = "";
        }
      }
      //点击业务列表标签
      if (tab.name === "AUD_MAG") {
        this.$refs.manageBus.pageIndexHistory = 1;
        this.$refs.manageBus.pageSizeHistory = 100;
        this.$refs.manageBus.getBusList();
        this.timer = setInterval(this.$refs.manageBus.historySearch, 180000);
        //当点击别的标签的时候将搜索栏清空
        for (var i in this.$refs.manageBus.bus) {
          this.$refs.manageBus.bus[i] = "";
        }
      }
    },

    // //获得文本业务品种
    // async getTypes(){
    //     const { data: res } = await this.$http.get("/hello/bustypelistText");
    //     if (res.code !== 200) {
    //         return this.$message.error(res.msg);
    //     }
    //     this.bustypes=res.data;
    // },

    //获得启用的业务品种
    // async getCurrentTypes(){
    //     const { data: res } = await this.$http.get("/hello/currentBusTypes");
    //     if (res.code !== 200) {
    //         return this.$message.error(res.msg);
    //     }
    //     this.currentBustypes=res.data;
    // },

    //我的挂件，每页显示的条数
    handleSizeChangeHang(val) {
      this.pageSizeHang = val;
      this.getHangList();
    },

    //我的挂件，查询当前页，监听页码值改变的事件
    handleCurrentChangeHang(val) {
      this.pageIndexHang = val;
      this.getHangList();
    },

    //关闭视图
    handleClose() {
      this.updateReceiveVisible = false;
      this.undoBoxChoose = false;
      this.resetForm();
    },

    //点击的行进行高亮显示
    getRowClassName({ row }) {
      return row.busId === this.currentRow.busId ? "current-row" : "";
    },

    handleSelectRow(row, event, cloumn) {
      this.currentRow = row;
    },

    //多选框选中的内容
    handleSelectionChange(val) {
      this.multipleSelection = val;
    },

    //重置表单数据
    resetForm() {
      if (this.$refs.recieveBus !== undefined) {
        this.$refs.recieveBus.resetFields();
      }
    },

    //初审解挂(与普通业务初审解挂需要复核一致)
    async firstUndo(row, index) {
      row.disabled = true;
      row.audChar = this.mark;
      row.audName = this.userName;
      row.audNow = this.ystId;
      const { data: res } = await this.$http.put(
        `busProgress/firstundoreaud`,
        row
      );
      if (res.code === 200) {
        this.getHangList();
        this.$message.success(res.msg);
      } else {
        this.$message.error("初审解挂失败");
      }
      this.hangList[index].disabled = false;
      this.$set(this.hangList, index, this.hangList[index]);
    },

    //复核解挂
    async secondUndo(row) {
      row.disabled = true;
      row.audChar = this.mark;
      row.audName = this.userName;
      row.audNow = this.ystId;
      const { data: res } = await this.$http.put(`busProgress/secondundo`, row);
      if (res.code === 200) {
        this.getHangList();
        this.$message.success(res.msg);
      } else {
        this.$message.error("复核解挂失败");
      }
      this.hangList[index].disabled = false;
      this.$set(this.hangList, index, this.hangList[index]);
    },

    //获取文本业务的挂件列表
    async getHangList() {
      const { data: res } = await this.$http.get("/basicInfo/hangpoolText", {
        params: {
          pageIndex: this.pageIndexHang,
          pageSize: this.pageSizeHang,
          flag: this.mark,
        },
        headers: {
          audNow: sessionStorage.getItem("ystId"),
        },
      });
      if (res.code !== 200) {
        return this.$message.error(res.msg);
      }
      this.hangList = res.data.list;
      this.loading = false;
      this.pageTotalHang = res.data.total;
    },

    //获取待完善界面的审核人员列表（需修改）
    async getStaffNames() {
      const { data: res } = await this.$http.get("/v3/getStaffNamesText");
      if (res.code !== 200) {
        return this.$message.error(res.msg);
      }
      this.staffNames = res.data;
    },

    //获取建议输入列表(不需修改)
    async querySearchAsync(queryString, cb) {
      // console.log('获取输入值：',this.searcHangBus.state)
      const { data: res } = await this.$http.get("/v2/searchPerson", {
        params: {
          state: this.searcHangBus.state,
          token: sessionStorage.getItem("token"),
        },
      });
      if (res.code === 200) {
        // console.log('返回结果：',res.data)
        this.personlist = res.data;
        // console.log('aaaaaaaaaaaaaaaaa',this.personlist);
        var results = this.personlist.map((item) => {
          // console.log('bbb',item.chsName)
          return {
            value: item.chsName + "@" + item.userId + "@" + item.orgName,
            personId: item.userId,
          };
        });
        // console.log('cccccccccc',results)

        cb(results);
        this.$refs.elautocomplete.handleFocus();
      } else {
        console.log("返回失败");
      }
    },

    //获取建议输入列表(不需修改)
    handSelect(item) {
      // console.log(item)
      //绑定输入框的值为选择框的personName属性
      this.searcHangBus.state = item.value;
      this.searcHangBus.personId = item.personId;
    },

    //获取建议输入列表(不需修改)
    clearSearch() {
      // console.log('我要关闭了')
      this.searcHangBus.personId = "";
    },

    //查询某人的挂件业务（需修改）
    async handlePauditingSearch() {
      const { data: res } = await this.$http.get("/v3/getStaffBusiText", {
        params: {
          staffYST: this.searcHangBus.staffInfo,
          busTeam: this.searcHangBus.busTeam,
          cusName: this.searcHangBus.cusName,
          busManager: this.searcHangBus.personId,
          pageIndex: this.pageIndexHang,
          pageSize: this.pageSizeHang,
        },
      });
      if (res.code !== 200) {
        return this.$message.error(res.msg);
      }
      this.hangList = res.data.list;
      this.loading = false;
      this.pageTotalHang = res.data.total;
    },
  },

  mounted: function() {
    if (this.timer) {
      clearInterval(this.timer);
      this.timer = null;
    }
    if (this.activeName === "AUD_REC") {
      this.timer = setInterval(this.$refs.receiveBus.search, 180000);
    }
    /*else if (this.activeName  === "AUD_FIR"){
                this.timer = setInterval(this.$refs.firstAudBus.search, 1000);
            }else if (this.activeName  === "AUD_SEC"){
                this.timer = setInterval(this.$refs.secondAudBus.search, 1000);
            }else if (this.activeName  === "AUD_REL"){
                this.timer = setInterval(this.$refs.relBus.search, 1000);
            }else if (this.activeName  === "AUD_REC_HIS"){
                this.timer = setInterval(this.$refs.receiveBusHis.historySearch, 1000);
            }else if (this.activeName  === "AUD_FIR_HIS"){
                this.timer = setInterval(this.$refs.firstAudBusHis.historySearch, 1000);
            }else if (this.activeName  === "AUD_SEC_HIS"){
                this.timer = setInterval(this.$refs.secondAudBusHis.historySearch, 1000);
            }else if (this.activeName  === "AUD_REL_HIS"){
                this.timer = setInterval(this.$refs.relBusHis.historySearch, 1000);
            }else if (this.activeName  === "AUD_MAG"){
                this.timer = setInterval(this.$refs.manageBus.historySearch, 1000);
            }*/
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
};
</script>

<style>
.el-table {
  /* 表格外边框20px */
  margin-top: 20px;
  margin-bottom: 30px;
  text-align: center;
}
.el-input-group__prepend {
  background-color: #fff;
}
.el-select {
  width: 100px;
}
.tittle {
  text-align: center;
}
.dialog {
  text-align: center;
}
.box {
  font-size: 15px;
  display: inline-block;
  width: 30%;
}
.block {
  display: inline-block;
  overflow: auto;
}
.check-boxes {
  margin-top: 23px;
  display: inline-block;
}
.el-checkbox.is-bordered.is-checked {
  border-color: #409eff;
  width: 135px;
}
.excel-button {
  text-align: right;
  margin-top: 45px;
}
.el-checkbox.is-bordered {
  padding: 9px 20px 9px 10px;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  box-sizing: border-box;
  line-height: normal;
  height: 40px;
  width: 110px;
}
body {
  margin: 0;
}
.box-choose {
  height: 179px;
}
.el-form-item {
  margin: 0;
}
</style>

