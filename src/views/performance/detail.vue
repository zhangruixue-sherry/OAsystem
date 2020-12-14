<template>
<div>
    <div class="pageMain">
                        <div class="userTable boxMain">
                            <p class="boxTitle">部门人员绩效列表</p>
                            <div class="tableTopBtn clearfix" style="padding: 15px;">
                                <el-button size="mini"  type="primary" icon="el-icon-arrow-left" @click="$router.push({ path: '/performance/list', })">返回列表</el-button>
                            </div>
                            <template>
                                <el-table
                                            :data="tableData"
                                            style="width: 100%;">
                                    <el-table-column
                                            prop="id"
                                            label="绩效ID"
                                            width="150"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="department"
                                            label="部门名称"
                                            width="100"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="departmentId"
                                            label="部门ID"
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
                                            label="考核人员"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="userId"
                                            label="用户ID"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="point"
                                            label="得分"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="remark"
                                            label="备注"
                                    >
                                    </el-table-column>
                                    <el-table-column align="center" width="160" label="操作">
                                        <template slot-scope="scope">
                                            <el-button size="mini" type="danger" @click="handleEdit(scope.row)">修改绩效</el-button>
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
    <!--修改绩效-->
    <div class="alertEvent addPost" v-show="addShow" >
        <div class="alertMsg" @click="cancelAdd('addShow')"></div>
        <div class="alertMain" style="width: 60%">
            <div class="alertTitle clearfix">
                <p class="float_lf">修改绩效</p>
                <img class="float_rt" src= "../../assets/img/del_icon.png" alt="" @click="cancelAdd('addShow')">
            </div>
            <div class="postForm">
                <el-form :model="formData" :inline="true" ref="formData" label-width="140px" class="demo-ruleForm">
                    <el-form-item label="部门：" prop="department">
                        <el-input v-model="formData.department" style="width: 300px;" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="部门ID：" prop="departmentId">
                        <el-input v-model="formData.departmentId" style="width: 300px;" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="岗位：" prop="job">
                        <el-input v-model="formData.job" style="width: 300px;" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="绩效年月：" prop="performanceDate">
                        <el-input v-model="formData.performanceDate" style="width: 300px;" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="用户ID" prop="userId">
                        <el-input v-model="formData.userId" style="width: 300px;" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="用户名：" prop="username">
                        <el-input v-model="formData.username" style="width: 300px;" :disabled="true"></el-input>
                    </el-form-item>
                    <el-form-item label="评分：" prop="point">
                        <el-input v-model="formData.point" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="备注：" prop="remark">
                        <el-input v-model="formData.remark" style="width: 300px;" type="textarea"></el-input>
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
                departmentId: '',
                performanceDate:'',
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
                    id:'',
                    department: '',
                    departmentId: '',
                    job: '',
                    performanceDate:'',
                    userId: '',
                    username: '',
                    point:'',
                    remark:'',
                }
            }
        },
        created () {
            var _this = this;
                _this.departmentId = this.$route.query.departmentId;
                _this.performanceDate = this.$route.query.performanceDate;
            //获取考勤列表
                this.$axios.get(_this.$axios.defaults.basePath+'/performance/getDetail',{
                  params:{
                     departmentId:_this.departmentId,     
                     performanceDate:_this.performanceDate,      
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
                this.$axios.get(_this.$axios.defaults.basePath+'/performance/getDetail',{
                  params:{            
                     departmentId:_this.departmentId,     
                     performanceDate:_this.performanceDate,
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
                this.$axios.get(_this.$axios.defaults.basePath+'/performance/getDetail',{
                  params:{        
                     departmentId:_this.departmentId,     
                     performanceDate:_this.performanceDate,
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
            //关闭弹框
            cancelAdd(s){
                this.value = [];
                this[s] = false;
            },
            

            handleEdit(row){
                var _this = this;
                this.addShow = true;
                this.formData = row;
                this.formData.performanceDate = _this.performanceDate;
                console.log(this.formData)
            },
            
            handleSubmit() {
                var _this = this;
                this.$axios({
                        url:_this.$axios.defaults.basePath+'/performance/update',
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
