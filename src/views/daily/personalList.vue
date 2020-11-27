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
                            <p class="boxTitle">个人日报列表</p>
                            <template>
                                <div class="tableTopBtn">
                                    <el-button @click="handleAdd" type="primary" class="el-button--mini" v-if="addButton == '1'"><i class="el-icon-plus"></i>添加日报</el-button>
                                </div>
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
<!--新增日报-->
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
                        <template>
                        <el-select v-model="value" placeholder="请选择" style="width: 300px;" v-if="editFlay == 1" disabled>
                            <el-option-group
                            v-for="group in departmentArr"
                            :key="group.value"
                            :label="group.label">
                            <el-option
                                v-for="item in group.childs"
                                :key="item.value"
                                :label="item.label"
                                :value="item">
                            </el-option>
                            </el-option-group>
                        </el-select>
                        </template>
                        <template>
                        <el-select v-model="value" placeholder="请选择" style="width: 300px;" v-if="editFlay == 0">
                            <el-option-group
                            v-for="group in departmentArr"
                            :key="group.value"
                            :label="group.label">
                            <el-option
                                v-for="item in group.childs"
                                :key="item.value"
                                :label="item.label"
                                :value="item">
                            </el-option>
                            </el-option-group>
                        </el-select>
                        </template>
                    </el-form-item>
                    <el-form-item label="类型：" prop="type">
                        <el-radio-group v-model="formData.type" style="width: 300px;">
                            <el-radio :label="1">研发部</el-radio>
                            <el-radio :label="2">其他部门</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="项目ID：" prop="projectId">
                        <el-input v-model="formData.projectId" style="width: 300px;" v-if="editFlay == 1" disabled></el-input>
                        <el-input v-model="formData.projectId" style="width: 300px;" v-if="editFlay == 0"></el-input>
                    </el-form-item>
                    <el-form-item label="项目名称：" prop="projectName">
                        <el-input v-model="formData.projectName" style="width: 300px;" v-if="editFlay == 1" disabled></el-input>
                        <el-input v-model="formData.projectName" style="width: 300px;" v-if="editFlay == 0"></el-input>
                    </el-form-item>
                    <el-form-item label="工时：" prop="time">
                        <el-input v-model="formData.time" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="工作描述：" prop="describe">
                        <el-input v-model="formData.describe" style="width: 300px;" type="textarea"></el-input>
                    </el-form-item>
                    <el-form-item label="其他工作：" prop="otherJob">
                        <el-input v-model="formData.otherJob" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item class="postBtn" style="display: block;text-align: center;">
                        <el-button type="primary" @click="handleSubmit('formData')">提交</el-button>
                        <el-button @click="cancelAdd('addShow')">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
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
                dialogConfirm: false,
                addShow:false,
                dialogTitle:'',
                editFlay:'',
                //搜索
                searchForm:{
                    day:'',
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
                    type:'',
                    time:'',
                    projectId:'',
                    projectName:'',
                    describe:'',
                    otherJob:'',
                },
                formLabelWidth: '100px',
                detailsShow:false,
                detailsData:[],
                multipleSelection:[],
                ids:'',
                id:'',
                departmentArr:[],
                value:'',
                username:'',
                userid:'',

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
                this.$axios.get(_this.$axios.defaults.basePath+'/daily/getList',{
                  params:{           
                     current:1,
                     size:_this.pagesData.currentRows,
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
                            window.location.href = 'login.html';
                        },500)
                    }else{
                        localStorage.setItem('nowUrl','');
                        _this.tableData = resData.data.records;
                        _this.pagesData.total = resData.data.total;
                    }
                })
                _this.getDepartmentArr();

                var privilege = JSON.parse(sessionStorage.getItem('authority'));
                console.log(privilege)
                privilege.forEach((item, index) => {
                    if(item.authority == 'daily_update'){
                        this.auditButton = '1'
                    }else if(item.authority == 'daily_query'){
                        this.searchButton = '1'
                    }else if(item.authority == 'daily_add'){
                        this.addButton = '1'
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
                this.$axios.get(_this.$axios.defaults.basePath+'/daily/getList',{
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
                this.$axios.get(_this.$axios.defaults.basePath+'/daily/getList',{
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
                this.dialogTitle = '添加日报';
                this.editFlay = '0';
            },
            handleEdit(row){
                this.addShow = true;
                this.formData = row;
                this.id = row.id;
                this.value = row.department;
                this.dialogTitle = '编辑日报';
                this.editFlay = '1';
            },
            handleSubmit() {
                var _this = this;
                if(_this.dialogTitle == '添加日报'){
                    this.$axios({
                        url:_this.$axios.defaults.basePath+'/daily/add',
                        method:'POST',
                        headers:{
                            'Content-Type':'application/json'
                        },
                        data:JSON.stringify({
                            department:_this.value.label,
                            departmentId:_this.value.value,
                            username:_this.username,
                            userId:_this.userid,
                            projectId:_this.formData.projectId,
                            projectName:_this.formData.projectName,
                            time:_this.formData.time,
                            type:_this.formData.type,
                            describe:_this.formData.describe,
                            otherJob:_this.formData.otherJob,
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
                        url:_this.$axios.defaults.basePath+'/daily/update',
                        method:'POST',
                        headers:{
                            'Content-Type':'application/json'
                        },
                        data:JSON.stringify({
                            id:_this.id,
                            time:_this.formData.time,
                            type:_this.formData.type,
                            describe:_this.formData.describe,
                            otherJob:_this.formData.otherJob,
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