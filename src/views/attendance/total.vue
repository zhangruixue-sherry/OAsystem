<template>
    <div class="pageMain">
                    <el-form :model="searchForm" :inline="true" ref="searchForm" label-position="left" class="demo-form-inline">
                        <el-form-item label="员工姓名">
                            <el-input v-model="searchForm.username" placeholder="请输入员工姓名"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchSubmit('searchForm')">查询</el-button>
                            <el-button @click="resetForm('searchForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                        <div class="userTable boxMain">
                            <p class="boxTitle">总考勤列表</p>
                            <template>
                                <el-table
                                            :data="tableData"
                                            style="width: 100%;">
                                    <el-table-column
                                            prop="username"
                                            label="出勤人员"
                                            width="100"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="attendanceTotalTime"
                                            label="出勤次数"
                                            width="100"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="absenteeismTotal"
                                            label="缺卡次数"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="dayOffTotal"
                                            label="调休时长"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="earlyTotalTime"
                                            label="早退次数"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="lateTotalTime"
                                            label="迟到次数"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="leaveTotalTime"
                                            label="请假次数"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="outworkTotalTime"
                                            label="外勤次数"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="reissueTotalTime"
                                            label="补卡次数"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="overtimeTotal"
                                            label="加班时长"
                                    >
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
                    username: '',
                    
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
                ids:'',
                id:'',
            }
        },
        created () {
            var _this = this;
            //获取考勤列表
                this.$axios.get(_this.$axios.defaults.basePath+'/attendance/getStatisticList',{
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
                        localStorage.setItem('nowUrl','sysMenu.html');
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
                this.$axios.get(_this.$axios.defaults.basePath+'/attendance/getStatisticList',{
                  params:{            
                     username: _this.searchForm.username, 
                     current:page,
                     size:rows,
                  }
                }).then(function (res) {
                    var resData = res.data;
                        _this.tableData = resData.data.records;
                        _this.pagesData.total = resData.data.total;
                })
            },
            //搜索操作
            searchSubmit() {
                var _this = this;
                this.$axios.get(_this.$axios.defaults.basePath+'/attendance/getStatisticList',{
                  params:{        
                     username:_this.searchForm.username,     
                     current:1,
                     size:_this.pagesData.currentRows,
                  }
                }).then(function (res) {
                    var resData = res.data;
                        _this.tableData = resData.data.records;
                        _this.pagesData.total = resData.data.total;
                })
            },
            //表单重置
            resetForm(formName) {
                this.$refs[formName].model.username = ''
            }

        },
    };

</script>
