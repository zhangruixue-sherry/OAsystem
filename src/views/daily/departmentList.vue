<template>
<div>
    <div class="pageMain">
                    <el-form :model="searchForm" :inline="true" ref="searchForm" label-position="left" class="demo-form-inline" v-if="searchButton == '1'">
                        <el-form-item label="日期">
                            <el-date-picker v-model="searchForm.day" type="date" placeholder="选择日期" value-format="yyyy-MM-dd"> </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchSubmit('searchForm')">查询</el-button>
                            <el-button @click="resetForm('searchForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                        <div class="userTable boxMain">
                            <p class="boxTitle">部门成员日报列表</p>
                            <template>
                                <el-table
                                            ref="multipleTable"
                                            :data="tableData"
                                            tooltip-effect="dark"
                                            style="width: 100%;">
                                    <el-table-column
                                            prop="userId"
                                            label="用户ID"
                                            width="100"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="username"
                                            label="用户名"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="department"
                                            label="部门"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="projectName"
                                            label="项目"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="time"
                                            label="工时"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="describe"
                                            label="描述"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="otherJob"
                                            label="其他工作"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="type"
                                            label="类型"
                                    >
                                    <template slot-scope="scope">
                                        <p v-if="scope.row.type == 1">研发部</p>
                                        <p v-else>其他部门</p>
                                    </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="created"
                                            label="日期"
                                    >
                                    </el-table-column>
                                    <el-table-column align="center" width="260" label="操作">
                                        <template slot-scope="scope">
                                            <el-button
                                                    size="mini"
                                                    type="primary"
                                                    @click="handleDetails(scope.row.id)">详情</el-button>
                                            <el-button
                                                    size="mini"
                                                    type="primary"
                                                    @click="handleEdit(scope.row)" v-if="auditButton == '1'">编辑</el-button>
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

<!--日报详情-->
    <div class="alertEvent addPost" v-show="detailsShow" >
        <div class="alertMsg" @click="cancelAdd('detailsShow')"></div>
        <div class="alertMain"> 
            <div class="alertTitle clearfix">
                <p class="float_lf">日报详情</p>
                <img class="float_rt" src= "../../assets/img/del_icon.png" alt="" @click="cancelAdd('detailsShow')">
            </div>
            <div class="postForm">
                <div class="detailsItem clearfix">
                    <p class="float_lf">ID : </p>  
                    <p class="float_lf">{{detailsData.id}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">部门名称：</p>
                    <p class="float_lf">{{detailsData.department}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">项目名称：</p>
                    <p class="float_lf">{{detailsData.projectName}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">用户名称：</p>
                    <p class="float_lf">{{detailsData.username}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">类型：</p>
                    <p class="float_lf">{{detailsData.type | type}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">日报内容：</p>
                    <p class="float_lf">{{detailsData.describe}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">其他工作：</p>
                    <p class="float_lf">{{detailsData.otherJob}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">日期：</p>
                    <p class="float_lf">{{detailsData.created}}</p>
                </div>
            </div>
        </div>
    </div> 

</div>    
</template>
<script>
    //vue实例
     export default {
        data () {
            return {
                detailsShow:false,
                //搜索
                searchForm:{
                    day:'',
                },
                tableData:[],
                detailsData:[],
                tabWidth:200,
                //分页数据
                pagesData:{
                    total:0,
                    currentPage:1,
                    currentRows:10,
                    rows:[10, 20, 30, 40],
                },
                searchButton:'',
                auditButton:'',
                addButton:'',
            }
        },
        created () {
            this.username = sessionStorage.getItem('username');
            this.userid = sessionStorage.getItem('userid');
            var _this = this;
            //获取文档列表
                this.$axios.get(_this.$axios.defaults.basePath+'/daily/getOrgList',{
                  params:{           
                     current:1,
                     size:_this.pagesData.currentRows,
                  }
                }).then(function (res) {
                    var resData = res.data;
                    if(resData.errcode == 41001 || resData.errcode == 403){
                        _this.$message({
                            message:'请重新登录！',
                            type:'warning'
                        })
                        setTimeout(function () {
                            window.location.href = 'login.html';
                        },500)
                    }else{
                        localStorage.setItem('nowUrl','');
                        _this.tableData = resData.data.records;
                        _this.pagesData.total = resData.data.total;
                    }
                })

                var privilege = JSON.parse(sessionStorage.getItem('authority'));
                console.log(privilege)
                privilege.forEach((item, index) => {
                    if(item.authority == 'daily_query'){
                        this.searchButton = '1'
                    }else{

                    }
                });
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
                this.$axios.get(_this.$axios.defaults.basePath+'/daily/getOrgList',{
                  params:{  
                     day:_this.searchForm.day,           
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
                this.$axios.get(_this.$axios.defaults.basePath+'/daily/getOrgList',{
                  params:{            
                     day:_this.searchForm.day,
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
                this.$refs[formName].model.day ='';
            },

            handleDetails(id){
               var _this = this;
                this.$axios.get(_this.$axios.defaults.basePath+'/daily/getListDetail',{
                  params:{            
                     id: id
                  }
                }).then(function (res) {
                    var resData = res.data
                    if(resData.errcode == 0){
                            _this.detailsShow = true;
                            _this.detailsData = resData.data;
                        }
                })
            },
            //关闭弹框
            cancelAdd(s){
                this.value = [];
                this[s] = false;
            },

        },

        filters: {
            type(value) {
                if (value === 1) {
                    return '研发部';
                } else if (value === 2) {
                    return '其他部门';
                }
            }
        }
    };
    

</script>