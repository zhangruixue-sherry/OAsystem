<template>
<div>
    <div class="pageMain">
        <el-form :model="searchForm" :inline="true" ref="searchForm" label-position="left" class="demo-form-inline">
                        <el-form-item label="用户名">
                            <el-input v-model="searchForm.userName" placeholder="请输入用户名"></el-input>
                        </el-form-item>
                        <el-form-item label="开始时间">
                            <el-date-picker
                            v-model="searchForm.startTime"
                            type="datetime"
                            value-format="yyyy-MM-dd hh:mm:ss"
                            placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item label="结束时间">
                            <el-date-picker
                            v-model="searchForm.endTime"
                            type="datetime"
                            value-format="yyyy-MM-dd hh:mm:ss"
                            placeholder="选择日期时间">
                            </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchSubmit('searchForm')">查询</el-button>
                            <el-button @click="resetForm('searchForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                        <div class="userTable boxMain">
                            <p class="boxTitle">系统日志列表</p>
                            <template>
                                <el-table
                                            ref="multipleTable"
                                            :data="tableData"
                                            tooltip-effect="dark"
                                            style="width: 100%;">
                                    <el-table-column
                                            prop="id"
                                            label="ID"
                                            min-width="180"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="username"
                                            label="用户名"
                                            min-width="100"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="userId"
                                            label="用户ID"
                                            min-width="180"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="ip"
                                            label="IP"
                                            min-width="180"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="group"
                                            label="操作"
                                            min-width="180"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            min-width="170"
                                            prop="created"
                                            label="创建时间">
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
</div>
</template>
<script>
    //vue实例
     export default {
        data () {
            return {
                //搜索
                searchForm:{
                    startTime: '',
                    endTime:'',
                    username:'',
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
            }
        },
        created () {
            var _this = this;
            //获取系统日志列表
                this.$axios.get(_this.$axios.defaults.basePath+'/sysUserLog',{
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
                this.$axios.get(_this.$axios.defaults.basePath+'/sysUserLog',{
                  params:{                 
                     startTime: _this.searchForm.startTime,
                     username:_this.searchForm.username,
                     endTime:_this.searchForm.endTime,
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
                this.$axios.get(_this.$axios.defaults.basePath+'/sysUserLog',{
                  params:{        
                     startTime: _this.searchForm.startTime,
                     username:_this.searchForm.username,
                     endTime:_this.searchForm.endTime,
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
                this.$refs[formName].model.startTime ='';
                this.$refs[formName].model.endTime ='';
                this.$refs[formName].model.username ='';
            },
        },
    };

</script>
