<template>
<div>
    <div class="pageMain">
        <el-form :model="searchForm" :inline="true" ref="searchForm" label-position="left" class="demo-form-inline" v-if="searchButton == '1'">
                        <el-form-item label="部门名称">
                        <template>
                        <el-select v-model="searchForm.department" placeholder="请选择部门">
                            <el-option-group
                            v-for="group in departmentArr"
                            :key="group.value"
                            :label="group.label">
                            <el-option
                                v-for="item in group.childs"
                                :key="item.value"
                                :label="item.label"
                                :value="item.label">
                            </el-option>
                            </el-option-group>
                        </el-select>
                        </template>
                        </el-form-item>
                        <el-form-item label="项目名称：" prop="projectName">
                            <el-select v-model="searchForm.projectName" placeholder="请选择项目">
                                <el-option
                                        v-for="(item,index) in proList"
                                        :key="index"
                                        :label="item.projectName"
                                        :value="item.projectName">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="制单人">
                            <el-input v-model="searchForm.username" placeholder="请输入制单人"></el-input>
                        </el-form-item>
                        <el-form-item label="报销方式">
                            <el-select v-model="searchForm.expenseType" placeholder="请选择报销方式">
                                <el-option v-for="(item,index) in expenseType" :key="index" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="报销单状态">
                            <el-select v-model="searchForm.status" placeholder="请选择报销单状态">
                                <el-option v-for="(item,index) in status" :key="index" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchSubmit('searchForm')">查询</el-button>
                            <el-button @click="resetForm('searchForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                        <div class="userTable boxMain">
                            <p class="boxTitle">报销单列表</p>
                            <template>
                                <el-table
                                        :data="tableData"
                                        style="width: 100%;">
                                    <el-table-column
                                            prop="id"
                                            label="ID"
                                            width="100"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="department"
                                            label="部门名称"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="projectName"
                                            label="项目名称"
                                    >
                                    </el-table-column>
                                    
                                    <el-table-column
                                            prop="username"
                                            label="制单人"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="expenseNo"
                                            label="报销单号"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="account"
                                            label="收款账户"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="expenseType"
                                            label="报销方式"
                                    >
                                    <template slot-scope="scope">
                                        <p>{{scope.row.expenseType | expenseType}}</p>
                                    </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="status"
                                            label="报销单状态"
                                    >
                                    <template slot-scope="scope">
                                        <p>{{scope.row.status | status}}</p>
                                    </template>
                                    </el-table-column>
                                    <el-table-column align="center" width="80" label="操作">
                                        <template slot-scope="scope">
                                            <el-button
                                                    size="mini"
                                                    type="primary" @click="$router.push({
                                                        path: '/expense/detail',
                                                        query: {
                                                        id : scope.row.id,
                                                        }
                                                    })">查看明细</el-button>
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
</div>
</template>
<script>
    //vue实例
     export default {
        data () {
            return {
                //搜索
                searchForm:{
                    department: '',
                    expenseType:'',
                    projectName: '',
                    status:'',
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
                expenseType:[
                    {
                        id:1,
                        text:'现金'
                    },{
                        id:2,
                        text:'转账'
                    },{
                        id:3,
                        text:'充账'
                    },{
                        id:4,
                        text:'其他'
                    }
                ],
                status:[
                    {
                        id:0,
                        text:'已提交'
                    },{
                        id:1,
                        text:'通过'
                    },{
                        id:2,
                        text:'拒绝'    
                    }
                ],

                departmentArr:[],
                proList:[],
                searchButton:'',
            }
        },
        created () {
            var _this = this;
            //获取报销单列表
                this.$axios.get(_this.$axios.defaults.basePath+'/expense/getList',{
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

            
            _this.getDepartmentArr();

            //获取项目列表
                this.$axios.get(_this.$axios.defaults.basePath+'/sysProject',{
                    params:{
                        current:1,
                        size:1000,
                    }
                }).then(function (res) {
                    var resData = res.data;
                    console.log(resData)
                    if(resData.errcode == 41001 || resData.errcode == 403){
                        _this.$message({
                            message:'请重新登录！',
                            type:'warning'
                        })
                        setTimeout(function () {
                            _this.$router.push({path:"/login"})
                        },500)
                    }else{
                        _this.proList = resData.data.records;
                    }
                })
            var privilege = JSON.parse(sessionStorage.getItem('authority'));
            privilege.forEach((item, index) => {
                if(item.authority == 'expense_query'){
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
                this.$axios.get(_this.$axios.defaults.basePath+'/expense/getList',{
                  params:{                 
                     expenseType:_this.searchForm.expenseType,
                     department: _this.searchForm.department,
                     username:_this.searchForm.username,
                     projectName:_this.searchForm.projectName,
                     status:_this.searchForm.status,
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
                this.$axios.get(_this.$axios.defaults.basePath+'/expense/getList',{
                  params:{        
                     expenseType:_this.searchForm.expenseType,
                     department: _this.searchForm.department,
                     username:_this.searchForm.username,
                     projectName:_this.searchForm.projectName,
                     status:_this.searchForm.status,
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
                this.$refs[formName].model.expenseType ='';
                this.$refs[formName].model.department ='';
                this.$refs[formName].model.username ='';
                this.$refs[formName].model.projectName ='';
                this.$refs[formName].model.status ='';
            },

            //获取部门数据
            getDepartmentArr(){
                var _this = this;
                _this.$axios({
                    url:_this.$axios.defaults.basePath+'/sysOrg/getOrgSelectList',
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                }).then(function (res){
                    var resData = res.data;
                    
                    _this.departmentArr = [];
                    console.log(resData)
                      if(resData.data != ''){
                        resData.data.forEach((item) => {
                        
                        _this.childs = [];
                        var aa = item['childs'];
                            aa.forEach((val) => {
                                _this.childs.push({
                                    value:val['id'],
                                    label: val['name'],
                                });
                            });
                            _this.departmentArr.push({
                                    value: item['id'],
                                    label: item['name'],
                                    childs:_this.childs
                                });
                        });
                    }

                    console.log(_this.departmentArr)
                })
            },
        },
        filters: {
            expenseType(value) {
                if (value === 1) {
                    return '现金';
                } else if (value === 2) {
                    return '转账';
                } else if (value === 3) {
                    return '充账';
                } else if (value === 4) {
                    return '其他';
                } 
            },

            status(value) {
                if (value === 0) {
                    return '已提交';
                } else if (value === 1) {
                    return '已通过';
                } else if (value === 2) {
                    return '拒绝';
                } 
            }
        }
    };

</script>
