<template>
<div>
    <div class="pageMain">
        <el-form :model="searchForm" :inline="true" ref="searchForm" label-position="left" class="demo-form-inline" v-if="searchButton == '1'">
                        <el-form-item label="采购部门">
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
                        <el-form-item label="采购项目" prop="projectId">
                            <el-select v-model="searchForm.projectName" placeholder="请选择采购项目">
                                <el-option
                                        v-for="(item,index) in proList"
                                        :key="index"
                                        :label="item.projectName"
                                        :value="item.projectName">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="申请人">
                            <el-input v-model="searchForm.username" placeholder="请输入申请人"></el-input>
                        </el-form-item>
                        <el-form-item label="付款方式">
                            <el-select v-model="searchForm.paymentType" placeholder="请选择付款方式">
                                <el-option v-for="(item,index) in paymentType" :key="index" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="付款单状态">
                            <el-select v-model="searchForm.status" placeholder="请选择付款单状态">
                                <el-option v-for="(item,index) in status" :key="index" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchSubmit('searchForm')">查询</el-button>
                            <el-button @click="resetForm('searchForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                        <div class="userTable boxMain">
                            <p class="boxTitle">付款列表</p>
                            <template>
                                <el-table
                                        :data="tableData"
                                        style="width: 100%;">
                                    <el-table-column
                                            prop="id"
                                            label="付款单id"
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
                                            label="申请人"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="paymentNo"
                                            label="付款单号"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="amount"
                                            label="付款金额"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="reason"
                                            label="付款事由"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="paymentDate"
                                            label="支付日期"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="paymentType"
                                            label="付款方式"
                                    >
                                    <template slot-scope="scope">
                                        <p>{{scope.row.paymentType | paymentType}}</p>
                                    </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="status"
                                            label="付款单状态"
                                    >
                                    <template slot-scope="scope">
                                        <p>{{scope.row.status | status}}</p>
                                    </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="remark"
                                            label="备注"
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
                    paymentType:'',
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
                paymentType:[
                    {
                        id:1,
                        text:'转账'
                    },{
                        id:2,
                        text:'支票'
                    },{
                        id:3,
                        text:'汇款'
                    },{
                        id:4,
                        text:'现金'
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
            //获取付款单列表
                this.$axios.get(_this.$axios.defaults.basePath+'/payment/getList',{
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
                if(item.authority == 'payment_query'){
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
                this.$axios.get(_this.$axios.defaults.basePath+'/payment/getList',{
                  params:{                 
                     paymentType:_this.searchForm.paymentType,
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
                this.$axios.get(_this.$axios.defaults.basePath+'/payment/getList',{
                  params:{        
                     paymentType:_this.searchForm.paymentType,
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
                this.$refs[formName].model.paymentType ='';
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
            paymentType(value) {
                if (value === 1) {
                    return '转账';
                } else if (value === 2) {
                    return '支票';
                } else if (value === 3) {
                    return '汇款';
                } else if (value === 4) {
                    return '现金';
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
