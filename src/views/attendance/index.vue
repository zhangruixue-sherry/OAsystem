<template>
    <div class="pageMain">
                    <el-form :model="searchForm" :inline="true" ref="searchForm" label-position="left" class="demo-form-inline">
                        <el-form-item label="员工姓名">
                            <el-input v-model="searchForm.name" placeholder="请输入员工姓名"></el-input>
                        </el-form-item>
                        <el-form-item label="考勤年月">
                            <el-date-picker v-model="searchForm.attendanceDate" type="month" placeholder="选择月"> </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchSubmit('searchForm')">查询</el-button>
                            <el-button @click="resetForm('searchForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                        <div class="userTable boxMain">
                            <p class="boxTitle">考勤数据列表</p>
                            <template>
                                <el-table
                                            ref="multipleTable"
                                            :data="tableData"
                                            tooltip-effect="dark"
                                            style="width: 100%;"
                                            @selection-change="handleSelectionChange">
                                    <el-table-column
                                            type="selection"
                                            width="55">
                                    </el-table-column>
                                    <el-table-column
                                            prop="username"
                                            label="出勤人员"
                                            width="100"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="attendanceTime"
                                            label="出勤次数"
                                            width="100"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="absenteeism"
                                            label="缺卡次数"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="dayOff"
                                            label="调休时长"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="earlyTime"
                                            label="早退次数"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="lateTime"
                                            label="迟到次数"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="leaveTime"
                                            label="请假次数"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="outworkTime"
                                            label="外勤次数"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="reissueTime"
                                            label="补卡次数"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="overtime"
                                            label="加班时长"
                                    >
                                    </el-table-column>
                                    <el-table-column align="center" width="200" label="操作">
                                        <template slot-scope="scope">
                                            <el-button
                                                    size="mini"
                                                    type="primary" @click="$router.push({
                                                        path: '/attendance/detail',
                                                        query: {
                                                        id: scope.row.id
                                                        }
                                                    })">详情</el-button>
                                            <el-button size="mini" type="danger" @click="exportSub(scope.row.username)">导出考勤数据</el-button>
                                        </template>
                                    </el-table-column>
                                </el-table>
                                <div class="block" style="padding: 10px 15px">
                                    <el-pagination
                                            @size-change="handleSizeChange"
                                            @current-change="handleCurrentChange"
                                            :current-page="pagesData.currentPage"
                                            :page-sizes="pagesData.rows"
                                            :page-size="100"
                                            layout="total, sizes, prev, pager, next, jumper"
                                            :total="pagesData.total">
                                    </el-pagination>
                                </div>
                            </template>
                        </div>

</div>  
</template>
<script>
    //vue实例
     export default {
        data () {
            return {
                isCollapse: false,
                dialogTitle:'',
                //搜索
                searchForm:{
                    name: '',
                    attendanceDate:'',
                    
                },
                tableData:[],
                tabWidth:200,
                //分页数据
                pagesData:{
                    total:0,
                    currentPage:1,
                    currentRows:10,
                    rows:[10, 20, 30, 40],
                },
                userid:'',
                formLabelWidth: '100px',
                detailsData:[],
                multipleSelection:[],
                ids:'',
                id:'',
            }
        },
        created () {
            var _this = this;
            //获取考勤列表
                this.$axios.get(_this.$axios.defaults.basePath+'/attendance/getList',{
                  params:{     
                     current:1,
                     size:_this.pagesData.currentRows,
                  }
                }).then(function (res) {
                    var resData = res.data;
                    console.log(res)
                    if(resData.errcode == 41001 || resData.errcode == 403){
                        _this.$message({
                            message:'请重新登录！',
                            type:'warning'
                        });
                        setTimeout(function () {
                            window.location.href = 'login.html';
                        },500)
                    }else{
                        localStorage.setItem('nowUrl','');
                        _this.tableData = resData.data.records;
                        _this.pagesData.total = resData.data.total;
                    }
                })
        },
        methods: {
            //分页--每页条数切换
            handleSizeChange(val) {
                var _this = this;
                _this.pagesData.currentRows = val;
                this.pagesEvent(_this.pagesData.currentPage,val);
            },
            //第几页
            handleCurrentChange(val) {
                var _this = this;
                _this.pagesData.currentPage = val;
                this.pagesEvent(val,_this.pagesData.currentRows);
            },
            //分页请求数据方法
            pagesEvent(page,rows){
                var _this = this;
                this.$axios.get(_this.$axios.defaults.basePath+'/attendance/getList',{
                  params:{            
                     name: _this.searchForm.name, 
                     attendanceDate:_this.searchForm.attendanceDate,
                     current:page,
                     size:rows,
                  }
                }).then(function (res) {
                    var resData = res.data;
                        console.log(resData);
                        _this.tableData = resData.data.records;
                        _this.pagesData.total = resData.data.total;
                })
            },
            //搜索操作
            searchSubmit() {
                var _this = this;
                this.$axios.get(_this.$axios.defaults.basePath+'/attendance/getList',{
                  params:{        
                     name:_this.searchForm.name,     
                     attendanceDate:_this.searchForm.attendanceDate,
                     current:1,
                     size:_this.pagesData.currentRows,
                  }
                }).then(function (res) {
                    var resData = res.data;
                        console.log(resData);
                        _this.tableData = resData.data.records;
                        _this.pagesData.total = resData.data.total;
                })
            },
            //表单重置
            resetForm(formName) {
                this.$refs[formName].model.name = '',
                this.$refs[formName].model.attendanceDate ='';
            },

            handleSelectionChange(val) {
                var _this = this;
                _this.ids = '';
                _this.multipleSelection = val;
                _this.multipleSelection.forEach(item => {
                    _this.ids += item.id + ',';
                });
                
            },

            handleDetail() {
                console.log('123456')
            },
            //导出提交
            exportSub(row){
                console.log(row)
                var _this = this;
                this.$axios({
                    url:_this.$axios.defaults.basePath+'/attendance/exportList',
                    type:'GET',
                    contentType:'application/csv;charset=GBK',
                    data:{
                        name: row,
                    },
                    dataType: "text",
                }).then(function (res) {
                    console.log(res)
                        var eleLink = document.createElement('a');
                        eleLink.download = row +'考勤.csv';
                        eleLink.style.display = 'none';
                        
                        var BOM = "\uFEFF";
                        var blob = new Blob([BOM + res.data]);
                        eleLink.href = URL.createObjectURL(blob);
                        console.info(blob);
                        // 触发点击
                        document.body.appendChild(eleLink);
                        eleLink.click();
                        _this.exportShow = false;
                        _this.$message({
                            message:'导出成功',
                            type:'success'
                        });

                        // 然后移除
                        document.body.removeChild(eleLink);
                    })
            }    

        },
    };

</script>
