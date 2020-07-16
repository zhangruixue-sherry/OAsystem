<template>
<div>
    <div class="pageMain">
        <el-form :model="searchForm" :inline="true" ref="searchForm" label-position="left" class="demo-form-inline" v-if="searchButton == '1'">
                        <el-form-item label="部门">
                            <el-input v-model="searchForm.department" placeholder="请输入部门"></el-input>
                        </el-form-item>
                        <el-form-item label="用户">
                            <el-input v-model="searchForm.username" placeholder="请输入用户名"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchSubmit('searchForm')">查询</el-button>
                            <el-button @click="resetForm('searchForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                        <div class="userTable boxMain">
                            <p class="boxTitle">人员薪资列表</p>
                            <template>
                                <el-table
                                        :data="tableData"
                                        style="width: 100%;">
                                    <el-table-column
                                            prop="department"
                                            label="部门名称"
                                            width="100"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="job"
                                            label="岗位"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="username"
                                            label="姓名"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="baseWage"
                                            label="基本工资"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="meritPay"
                                            label="绩效工资"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="foodAllowance"
                                            label="餐饮补贴"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="phoneAllowance"
                                            label="通讯补贴"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="trafficAllowance"
                                            label="交通补贴"
                                    >
                                    </el-table-column>
                                    
                                    <el-table-column
                                            prop="socialSecurity"
                                            label="社保"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="accumulationFund"
                                            label="公积金"
                                    >
                                    </el-table-column>
                                    
                                    <el-table-column
                                            prop="individualTax"
                                            label="个税"
                                    >
                                    </el-table-column>
                                    <el-table-column align="center" width="160" label="操作">
                                        <template slot-scope="scope">
                                            <el-button size="mini" type="danger" @click="handleEdit(scope.row)" v-if="auditButton == '1'">修改薪资</el-button>
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
    <!--修改薪资-->
    <div class="alertEvent addPost" v-show="addShow" >
        <div class="alertMsg" @click="cancelAdd('addShow')"></div>
        <div class="alertMain" style="width: 60%">
            <div class="alertTitle clearfix">
                <p class="float_lf">修改薪资</p>
                <img class="float_rt" src= "../../assets/img/del_icon.png" alt="" @click="cancelAdd('addShow')">
            </div>
            <div class="postForm">
                <el-form :model="formData" :inline="true" ref="formData" label-width="140px" class="demo-ruleForm">
                    <el-form-item label="部门：" prop="department">
                        <el-input v-model="formData.department" style="width: 300px;" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="岗位：" prop="job">
                        <el-input v-model="formData.job" style="width: 300px;" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名：" prop="username">
                        <el-input v-model="formData.username" style="width: 300px;" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="基本工资：" prop="baseWage">
                        <el-input v-model="formData.baseWage" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="绩效工资：" prop="meritPay">
                        <el-input v-model="formData.meritPay" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="餐饮补贴：" prop="foodAllowance">
                        <el-input v-model="formData.foodAllowance" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="通讯补贴" prop="phoneAllowance">
                        <el-input v-model="formData.phoneAllowance" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="交通补贴：" prop="trafficAllowance">
                        <el-input v-model="formData.trafficAllowance" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="社保：" prop="socialSecurity">
                        <el-input v-model="formData.socialSecurity" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="公积金：" prop="accumulationFund">
                        <el-input v-model="formData.accumulationFund" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="个税：" prop="individualTax">
                        <el-input v-model="formData.individualTax" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item class="postBtn" style="display: block;text-align: center;">
                        <el-button type="primary" @click="handleSubmit()">提交</el-button>
                        <el-button @click="cancelAdd('addShow')">取消</el-button>
                    </el-form-item>
                </el-form>
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
                isCollapse: false,
                addShow: false,
                //搜索
                searchForm:{
                    department: '',
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
                userid:'',
                formLabelWidth: '100px',
                detailsData:[],
                id:'',
                formData:{ 
                },
                searchButton:'',
                auditButton:'',
            }
        },
        created () {
            var _this = this;
            //获取薪资列表
                this.$axios.get(_this.$axios.defaults.basePath+'/salaryUserRelationship/getList',{
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
            
            var privilege = JSON.parse(sessionStorage.getItem('authority'));
            privilege.forEach((item, index) => {
                if(item.authority == 'salary_update'){
                    this.auditButton = '1'
                }else if(item.authority == 'salary_query'){
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
                this.$axios.get(_this.$axios.defaults.basePath+'/salaryUserRelationship/getList',{
                  params:{            
                     department:_this.searchForm.department,     
                     username:_this.searchForm.username,
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
                this.$axios.get(_this.$axios.defaults.basePath+'/salaryUserRelationship/getList',{
                  params:{        
                     department:_this.searchForm.department,     
                     username:_this.searchForm.username,
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
                this.$refs[formName].model.department = '',
                this.$refs[formName].model.username ='';
            },

            //关闭弹框
            cancelAdd(s){
                this.value = [];
                this[s] = false;
            },
            

            handleEdit(row){
                this.addShow = true;
                this.formData = row;
                console.log(this.formData)
            },
            
            //修改薪资提交操作
            handleSubmit() {
                var _this = this;
                this.$axios({
                        url:_this.$axios.defaults.basePath+'/salaryUserRelationship/update',
                        method:'POST',
                        headers:{
                            'Content-Type':'application/json'
                        },
                        data:JSON.stringify(_this.formData)
                    }).then(function (res) {
                        console.log(res);
                        if (res.data.errcode == 0) {
                                _this.$message({
                                    message: res.data.data,
                                    type: 'success'
                                });
                                setTimeout(function () {
                                    window.location.reload();
                                }, 500)
                        }else{
                            _this.$message({
                                message: res.data.errmsg,
                                type: 'error'
                            });
                        }
                    })
            }

        },
    };

</script>
