<template>
<div>
    <div class="pageMain">
                    <el-form :model="searchForm" :inline="true" ref="searchForm" label-position="left" class="demo-form-inline">
                        <el-form-item label="部门ID">
                            <el-input v-model="searchForm.departmentId" placeholder="请输入部门ID"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchSubmit('searchForm')">查询</el-button>
                            <el-button @click="resetForm('searchForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                        <div class="userTable boxMain">
                            <p class="boxTitle">考勤规则列表</p>
                            <template>
                                <div class="tableTopBtn">
                                    <el-button @click="handleAdd" type="primary" class="el-button--mini"><i class="el-icon-plus"></i>添加考勤规则</el-button>
                                    <el-button size="mini" type="danger" @click="handleDel(id)">删除</el-button>
                                </div>
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
                                            prop="department"
                                            label="部门"
                                            width="100"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="clockIn"
                                            label="上班时间"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="clockOut"
                                            label="下班时间"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="clockInType"
                                            label="打卡类型"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="clockWay"
                                            label="打卡方式"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="attendance"
                                            label="描述"
                                    >
                                    </el-table-column>
                                    <el-table-column align="center" width="100" label="操作">
                                        <template slot-scope="scope">
                                            <el-button
                                                    size="mini"
                                                    type="primary"
                                                    @click="handleEdit(scope.row)">编辑</el-button>
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
<!--新增/修改考勤规则-->
    <div class="alertEvent addPost" v-show="addShow" >
        <div class="alertMsg" @click="cancelAdd('addShow')"></div>
        <div class="alertMain" style="width: 60%">
            <div class="alertTitle clearfix">
                <p class="float_lf">{{dialogTitle}}</p>
                <img class="float_rt" src= "../../assets/img/del_icon.png" alt="" @click="cancelAdd('addShow')">
            </div>
            <div class="postForm">
                <el-form :model="formData" :inline="true" ref="formData" label-width="140px" class="demo-ruleForm">
                    <el-form-item label="部门名称：" prop="department">
                        <el-input v-model="formData.department" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="部门ID：" prop="departmentId">
                        <el-input v-model="formData.departmentId" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="上下班打卡时间：">
                        <template>
                        <el-time-select
                            placeholder="上班打卡时间"
                            v-model="formData.clockIn"
                            format="HH:mm:ss"
                            value-format="HH:mm:ss"
                            :picker-options="{
                            start: '08:30',
                            step: '00:15',
                            end: '20:30'
                            }">
                        </el-time-select>
                        <el-time-select
                            placeholder="下班打卡时间"
                            v-model="formData.clockOut"
                            format="HH:mm:ss"
                            value-format="HH:mm:ss"
                            :picker-options="{
                            start: '08:30',
                            step: '00:15',
                            end: '20:30',
                            minTime: formData.clockIn
                            }">
                        </el-time-select>
                        </template>

                    </el-form-item>
                    <el-form-item label="打卡方式：" prop="clockWay">
                        <template>
                        <el-radio v-model="formData.clockWay" label="1">范围</el-radio>
                        <el-radio v-model="formData.clockWay" label="2">MAC地址</el-radio>
                        </template>
                    </el-form-item>
                    <el-form-item label="打卡类型：" prop="clockInType">
                        <template>
                        <el-radio v-model="formData.clockInType" label="1">范围打卡</el-radio>
                        <el-radio v-model="formData.clockInType" label="2">WiFi打卡</el-radio>
                        </template>
                    </el-form-item>
                    <el-form-item label="考勤规则描述：" prop="attendance">
                        <el-input v-model="formData.attendance" style="width: 300px;" type="textarea"></el-input>
                    </el-form-item>
                    <el-form-item class="postBtn" style="display: block;text-align: center;">
                        <el-button type="primary" @click="handleSubmit('formData')">提交</el-button>
                        <el-button @click="cancelAdd('addShow')">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div> 
<!--考勤规则详情-->
    <div class="alertEvent addPost" v-show="detailsShow" >
        <div class="alertMsg" @click="cancelAdd('detailsShow')"></div>
        <div class="alertMain"> 
            <div class="alertTitle clearfix">
                <p class="float_lf">考勤规则详情</p>
                <img class="float_rt" src= "../../assets/img/del_icon.png" alt="" @click="cancelAdd('detailsShow')">
            </div>
            <div class="postForm">
                <div class="detailsItem clearfix">
                    <p class="float_lf">部门 : </p>
                    <p class="float_lf">{{detailsData.id}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">菜单名称：</p>
                    <p class="float_lf">{{detailsData.name}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">描述：</p>
                    <p class="float_lf">{{detailsData.desc}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">排序：</p>
                    <p class="float_lf">{{detailsData.sort}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">菜单级别：</p>
                    <p class="float_lf" v-if="detailsData.type == 1">一级</p>
                    <p class="float_lf" v-if="detailsData.type == 2">二级</p>
                    <p class="float_lf" v-if="detailsData.type == 3">三级</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">创建时间：</p>
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
                index:'1',
                isCollapse: false,
                dialogConfirm: false,
                addShow:false,
                dialogTitle:'',
                //搜索
                searchForm:{
                    departmentId:'',
                    
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
                formData:{
                    department:'',
                    departmentId:'',
                    clockWay:'',
                    clockInType:'',
                    attendance:'',
                    clockOut:'',
                    clockIn:''
                },
                formLabelWidth: '100px',
                detailsShow:false,
                detailsData:[],
                multipleSelection:[],
                ids:'',
                id:'',
            }
        },
        created () {
            var _this = this;
            //获取考勤规则列表
                this.$axios.get(_this.$axios.defaults.basePath+'/attendanceWay/getList',{
                  params:{            
                     departmentId:_this.searchForm.departmentId,
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
            //侧边栏伸缩
            openAside () {
                if(this.isCollapse){
                    this.isCollapse = false;
                    this.tabWidth = 200
                }else{
                    this.isCollapse = true;
                    this.tabWidth = 64
                }
            },
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
                this.$axios.get(_this.$axios.defaults.basePath+'/attendanceWay/getList',{
                  params:{            
                     departmentId:_this.searchForm.departmentId,
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
                this.$axios.get(_this.$axios.defaults.basePath+'/attendanceWay/getList',{
                  params:{            
                     departmentId:_this.searchForm.departmentId,
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
                this.$refs[formName].model.departmentId ='';
            },
            handleSelectionChange(val) {
                var _this = this;
                _this.ids = '';
                _this.multipleSelection = val;
                _this.multipleSelection.forEach(item => {
                    _this.ids += item.id + ',';
                });
                
            },
            handleAdd() {
                this.addShow = true;
                this.dialogTitle = '添加考勤规则';
            },
            handleEdit(row){
                this.addShow = true;
                this.formData = row;
                this.id = row.id;
                this.dialogTitle = '编辑考勤规则';
            },
            handleSubmit() {
                var _this = this;
                if(_this.dialogTitle == '添加考勤规则'){
                    this.$axios({
                        url:_this.$axios.defaults.basePath+'/attendanceWay/add',
                        method:'POST',
                        headers:{
                            'Content-Type':'application/json'
                        },
                        data:JSON.stringify({
                            department:_this.formData.department,
                            departmentId:parseInt(_this.formData.departmentId),
                            clockWay:_this.formData.clockWay,
                            clockInType: parseInt(_this.formData.clockInType),
                            attendance:_this.formData.attendance,
                            clockOut:_this.formData.clockOut,
                            clockIn:_this.formData.clockIn,
                        })
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
                            }
                    })
                }else{
                    this.$axios({
                        url:_this.$axios.defaults.basePath+'/attendanceWay/update',
                        method:'POST',
                        headers:{
                            'Content-Type':'application/json'
                        },
                        data:JSON.stringify({
                            id:parseInt(_this.id),
                            department:_this.formData.department,
                            departmentId:parseInt(_this.formData.departmentId),
                            clockWay:_this.formData.clockWay,
                            clockInType:parseInt(_this.formData.clockInType),
                            attendance:_this.formData.attendance,
                            clockOut:_this.formData.clockOut,
                            clockIn:_this.formData.clockIn,
                        })
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
                            }
                    })
                
                }
                
                
            },
            //关闭弹框
            cancelAdd(s){
                this.value = [];
                this[s] = false;
            },

            handleDel() {
                var _this = this;
                _this.ids = _this.ids.substr(0, _this.ids.length - 1); 
                _this.roleId = _this.ids.split(',');
                //return false;
                if(_this.ids == ''){
                    _this.$message.error('请选择要删除的内容');
                    return false;
                }else{
                    _this.$confirm('此操作将永久删除该规则, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                             var _this = this;
                            _this.$axios({
                                url:_this.$axios.defaults.basePath+'/attendanceWay/delete?ids='+_this.roleId,
                                method:'POST',
                                headers:{
                                    'Content-Type':'application/json'
                                },
                            }).then(function (res) {
                                console.log(res);
                                if(res.data.errcode == 0){
                                    _this.$message({
                                        message:'删除成功',
                                        type:'success'
                                    });
                                    setTimeout(function () {
                                        window.location.reload();
                                    },500);
                                }
                            })
                        }).catch(() => {
                            _this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });          
                    });
                }
            },

        },
    };

</script>

<style lang="scss" scoped>
.el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 220px;
    margin-right: 30px;
}
</style>