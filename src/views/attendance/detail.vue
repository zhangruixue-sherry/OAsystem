<template>
    <div class="pageMain">
                    <el-form :model="searchForm" :inline="true" ref="searchForm" label-position="left" class="demo-form-inline">
                        <el-form-item label="考勤日期">
                            <el-date-picker v-model="searchForm.attendanceDate" type="month" placeholder="选择月"> </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchSubmit('searchForm')">查询</el-button>
                            <el-button @click="resetForm('searchForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                        <div class="userTable boxMain">
                            <p class="boxTitle"><el-button size="mini"  type="primary" icon="el-icon-arrow-left" @click="$router.push({ path: '/attendance/list', })">返回列表</el-button></p>
                            <template>
                                <el-table
                                            :data="tableData"
                                            style="width: 100%;">
                                    <el-table-column
                                            prop="attendanceDate"
                                            label="考勤日期"
                                            width="140"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="clockIn"
                                            label="上班打卡时间"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="clockInAddress"
                                            label="上班打卡地址"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="clockOut"
                                            label="下班打卡时间"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="clockOutAddress"
                                            label="下班打卡地址"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="status"
                                            label="考勤状态"
                                    >
                                    <template slot-scope="scope">
                                        <p>{{scope.row.status | status}}</p>
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
                this.$axios.get(_this.$axios.defaults.basePath+'/attendance/getListDetail',{
                  params:{ 
                     id:this.$route.query.id,     
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
                this.$axios.get(_this.$axios.defaults.basePath+'/attendance/getListDetail',{
                  params:{
                     id:this.$route.query.id,             
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
                this.$axios.get(_this.$axios.defaults.basePath+'/attendance/getListDetail',{
                  params:{  
                     id:this.$route.query.id,        
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
                this.$refs[formName].model.attendanceDate ='';
            },

        },
        filters: {
            status(value) {
                if (value === 0) {
                    return '正常';
                } else if (value === 1) {
                    return '异常';
                } 
            }
        }
    };

</script>
