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
                        <el-form-item label="创建时间">
                            <el-date-picker v-model="searchForm.created" type="datetime" placeholder="请选择时间" format="yyyy-MM-dd hh:mm:ss" value-format="yyyy-MM-dd HH:mm:ss"> </el-date-picker>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-select v-model="searchForm.status" placeholder="请选择状态" style="width:140px">
                                <el-option v-for="(item,index) in status" :key="index" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="类型">
                            <el-select v-model="searchForm.type" placeholder="请选择类型" style="width:140px">
                                <el-option v-for="(item,index) in type" :key="index" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchSubmit('searchForm')">查询</el-button>
                            <el-button @click="resetForm('searchForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                        <div class="userTable boxMain">
                            <p class="boxTitle">薪资发放记录列表</p>
                            <div class="tableTopBtn clearfix" style="padding: 15px;">
                                <el-button size="mini" type="primary" @click="handlePayment()"><i class="el-icon-plus" v-if="payButton == '1'"></i>发放薪资</el-button>
                            </div>
                            <template>
                                <el-table
                                        :data="tableData"
                                        style="width: 100%;"
                                        ref="multipleTable"
                                        tooltip-effect="dark"
                                        @selection-change="handleSelectionChange"
                                        >
                                    <el-table-column
                                            type="selection"
                                            width="55">
                                    </el-table-column>
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
                                            prop="amount"
                                            label="实发薪资"
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
                                    <el-table-column
                                            prop="penalty"
                                            label="罚款/扣除金额"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="salaryDate"
                                            label="薪资发放日期"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="status"
                                            label="是否确认"
                                    >
                                    <template slot-scope="scope">
                                            <p v-if="scope.row.status == 0" style="color:#67c23a;">未确认</p>
                                            <p v-else-if="scope.row.status == 1" style="color:#f56c6c;">已确认</p>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" width="260" label="操作">
                                        <template slot-scope="scope">
                                            <el-button size="mini" type="danger" @click="handleEdit(scope.row)" v-if="auditButton == '1'">修改发放记录</el-button>
                                            <el-button size="mini" type="primary" @click="exportSub(scope.row)">导出数据</el-button>
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
                <p class="float_lf">修改薪资发放记录</p>
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
                    type:'',
                    status:'',
                    created:'',
                    
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
                multipleSelection:[],
                ids:'',
                formData:{ 
                },
                status:[
                    {
                        id:0,
                        text:'待确认'
                    },{
                        id:1,
                        text:'已确认'
                    },
                ],
                type:[
                    {
                        id:0,
                        text:'未发放'
                    },{
                        id:1,
                        text:'已发放'
                    }
                ],
                searchButton:'',
                auditButton:'',
                payButton:''
            }
        },
        created () {
            var _this = this;
            //获取薪资列表
                this.$axios.get(_this.$axios.defaults.basePath+'/salaryLogs/getList',{
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
                }else if(item.authority == 'salaryRecord_update'){
                    this.searchButton = '1'
                }else if(item.authority == 'salaryRecord_query'){
                    this.payButton = '1'
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
                this.$axios.get(_this.$axios.defaults.basePath+'/salaryLogs/getList',{
                  params:{            
                     department:_this.searchForm.department,     
                     username:_this.searchForm.username,
                     created:_this.searchForm.created,
                     status:_this.searchForm.status,
                     type:_this.searchForm.type,
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
                this.$axios.get(_this.$axios.defaults.basePath+'/salaryLogs/getList',{
                  params:{        
                     department:_this.searchForm.department,     
                     username:_this.searchForm.username,
                     created:_this.searchForm.created,
                     status:_this.searchForm.status,
                     type:_this.searchForm.type,
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
                        url:_this.$axios.defaults.basePath+'/salaryLogs/update',
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
            },

            handleSelectionChange(val) {
                var _this = this;
                _this.ids = '';
                _this.multipleSelection = val;
                _this.multipleSelection.forEach(item => {
                    _this.ids += item.id + ',';
                });
                
            },

            handlePayment() {
               var _this = this;
                _this.ids = _this.ids.substr(0, _this.ids.length - 1); 
                //return false;
                if(_this.ids == ''){
                    _this.$confirm('此操作将发放所有人的薪资, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                            _this.payment(1);
                        }).catch(() => {
                            _this.$message({
                            type: 'info',
                            message: '已取消发放'
                        });          
                    });
                }else{
                    _this.$confirm('此操作将发放已选中薪资, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                            _this.payment(0);
                        }).catch(() => {
                            _this.$message({
                            type: 'info',
                            message: '已取消发放'
                        });          
                    });
                }
            },

            payment(type) {
                 var _this = this;
                 _this.ids = _this.ids.substr(0, _this.ids.length - 1); 
                _this.roleId = _this.ids.split(',');
                _this.$axios({
                    url:_this.$axios.defaults.basePath+'/salaryLogs/salaryPayment',
                    method:'POST',
                    headers:{
                        'Content-Type':'application/json'
                    },
                    data: JSON.stringify({
                        ids: _this.roleId,
                        type: type
                    })
                }).then(function (res) {
                    console.log(res);
                    if(res.errcode == 0){
                     _this.$message({
                        message:'删除成功',
                        type:'success'
                    });
                    setTimeout(function () {
                         window.location.reload();
                        },500);
                    }
                })
            },
            //导出提交
            exportSub(row){
                var _this = this;
                this.$axios({
                    url:_this.$axios.defaults.basePath+'/salaryLogs/exportList',
                    type:'GET',
                    contentType:'application/csv;charset=GBK',
                    data:{
                        department: row.department,
                        username: row.username,
                        created: row.created,
                    },
                    dataType: "text",
                }).then(function (res) {
                    console.log(res)
                        var eleLink = document.createElement('a');
                        eleLink.download = '薪资发放记录.csv';
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
