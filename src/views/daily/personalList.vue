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
                <el-form :model="formData" :inline="true" :rules="rule" ref="formData" label-width="140px" class="demo-ruleForm">
                    <!-- <el-form-item label="部门名称：" prop="department">
                        <template>
                        <el-select v-model="formData.department" placeholder="请选择" style="width: 300px;" v-if="editFlay == 1" disabled>
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
                        <el-select v-model="formData.department" placeholder="请选择" style="width: 300px;" v-if="editFlay == 0" @change="departmentChange">
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
                    </el-form-item> -->
                    <el-form-item label="类型：" prop="type">
                        <el-radio-group v-model="formData.type" style="width: 300px;" @change="departmentType(formData.type)">
                            <el-radio :label="1">研发部</el-radio>
                            <el-radio :label="2">其他部门</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <!-- 其他部门 -->
                    <el-form-item label="工作描述：" prop="otherJob" v-if="formData.type == 2">
                        <el-input v-model="formData.otherJob" style="width: 300px;" type="textarea"></el-input>
                    </el-form-item>
                    <template v-else>
                    <el-button style="margin-top:10px" size="mini" type="primary" @click="addFormList"><i class="el-icon-plus"></i> 添加</el-button>
                    <div style="border:1px solid #DCDFE6; padding:20px 0px; margin:10px 30px"  v-for="(itemP,i) in formData.list">
                        <el-form-item label="项目名称：" prop="projectId" v-if="editFlay == 1">
                            <template>
                            <el-select v-model="itemP.projectId" placeholder="请选择项目" style="width: 300px;" @change="projectChange(i,itemP.projectId)">
                                <el-option
                                        v-for="(item,index) in proList"
                                        :key="index"
                                        :label="item.projectName"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                            </template>
                        </el-form-item>
                        <el-form-item label="项目名称：" prop="projectId"  v-if="editFlay == 0">
                            <template>
                            <el-select v-model="itemP.projectId" placeholder="请选择项目" style="width: 300px;" @change="projectChange(i,itemP.projectId)">
                                <el-option
                                        v-for="(item,index) in proList"
                                        :key="index"
                                        :label="item.projectName"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                            </template>
                        </el-form-item>
                        <el-form-item label="工时：" prop="time">
                            <el-input v-model="itemP.time" style="width: 300px;"></el-input>
                        </el-form-item>
                        <el-form-item label="工作描述：" prop="describe">
                            <el-input v-model="itemP.describe" style="width: 300px;" type="textarea"></el-input>
                        </el-form-item>
                        <div style="padding:0px 20px 15px 0px">
                            <el-button class="float_rt" size="mini" type="danger" :disabled="formData.list.length == 1" @click="delFormList(i)"><i class="el-icon-delete"></i> 删除</el-button>
                        </div>
                        
                    </div>
                    </template>
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
                    <p class="float_lf">部门名称：</p>
                    <p class="float_lf">{{detailsData.department}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">用户名称：</p>
                    <p class="float_lf">{{detailsData.username}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">类型：</p>
                    <p class="float_lf">{{detailsData.type | type}}</p>
                </div>
                <div class="detailsItem clearfix" v-if="detailsData.type == 2">
                    <p class="float_lf">工作内容：</p>
                    <p class="float_lf">{{detailsData.otherJob}}</p>
                </div>
                <div style="border:1px solid #DCDFE6; padding:20px 0px; margin:10px 30px" v-for="(itemP,i) in detailsData.list" v-else>
                    <div class="detailsItem clearfix">
                        <p class="float_lf">项目名称：</p>
                        <p class="float_lf">{{itemP.projectName}}</p>
                    </div>
                    <div class="detailsItem clearfix">
                        <p class="float_lf">工作时长：</p>
                        <p class="float_lf">{{itemP.time}}</p>
                    </div>
                    <div class="detailsItem clearfix">
                        <p class="float_lf">日报内容：</p>
                        <p class="float_lf">{{itemP.describe}}</p>
                    </div> 
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">工作日期：</p>
                    <p class="float_lf">{{detailsData.created}}</p>
                </div>
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
                    type:2,
                    // time:'',
                    // projectId:'',
                    // projectName:'',
                    // describe:'',
                    otherJob:'',
                    list:[
                        {
                            describe: '',
                            projectId: "",
                            projectName: "",
                            time: ''
                        }
                    ],
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
                proList:[],

                rule:{
                    // department: [
                    //     { required: true, message: '请选择部门', trigger: 'change' }
                    // ],
                    type: [
                        { required: true, message: '请选择类型', trigger: 'change' }
                    ],
                    // time: [
                    //     { required: true, message: '请选择时间', trigger: 'change' }
                    // ],
                    // otherJob: [
                    //     { required: true, message: '请输入工作内容', trigger: 'blur' }
                    // ],
                    // describe: [
                    //     { required: true, message: '请输入工作内容', trigger: 'blur' }
                    // ],
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

            //选择部门
            departmentChange(val){
                this.formData.department = val.label;
                this.formData.departmentId = val.value;
            },

            //选择项目
            projectChange(index,val){
                var _this = this;
                var proList = this.proList;
                var list = this.formData.list;
                var projectName = '';
                var projectId = val;
                if(val){
                    for(var i=0;i<proList.length;i++){
                        if(proList[i].id == val){
                            projectName = proList[i].projectName;
                        }
                    }
                    for(var n=0;n<list.length;n++){
                        if(n == index){
                            list[n].projectName = projectName;
                            list[n].projectId= projectId;
                        }
                    }
                    this.formData.list = list;
                }
            },

            //部门类型切换
            departmentType(val){
                if(val == 2){
                    console.log(123)
                }
            },

            //添加预算明细
            addFormList(){
              var newList = {
                  describe: '',
                  projectId: "",
                  projectName: "",
                  time: ''
              };
              this.formData.list.push(newList);

            },
            //删除预算明细
            delFormList(index){
                this.formData.list.splice(index,1);
                
                console.log(this.formData.list)
            },

            handleAdd() {
                this.addShow = true;
                this.dialogTitle = '添加日报';
                this.editFlay = '0';
            },
            handleEdit(row){
                var _this = this;
                this.addShow = true;
                this.id = row.id;
                this.value = row.department;
                this.dialogTitle = '编辑日报';
                this.editFlay = '1';
                _this.formData.list = {};
                this.$axios.get(_this.$axios.defaults.basePath+'/daily/getListDetail',{
                  params:{            
                     id: row.id
                  }
                }).then(function (res) {
                    var resData = res.data
                    if(resData.errcode == 0){
                            _this.formData = resData.data;
                        }
                })
            },
            handleSubmit(formData) {
                var _this = this;
                _this.$refs[formData].validate((valid) => {
                if (valid) {
                    if(_this.dialogTitle == '添加日报'){
                        this.$axios({
                            url:_this.$axios.defaults.basePath+'/daily/add',
                            method:'POST',
                            headers:{
                                'Content-Type':'application/json'
                            },
                            data:JSON.stringify({
                                username:_this.username,
                                userId:_this.userid,
                                type:_this.formData.type,
                                otherJob:_this.formData.otherJob,
                                list:_this.formData.list
                            })
                        }).then(function (res) {
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
                    }else{
                        this.$axios({
                            url:_this.$axios.defaults.basePath+'/daily/update',
                            method:'POST',
                            headers:{
                                'Content-Type':'application/json'
                            },
                            data:JSON.stringify({
                                id:_this.id,
                                type:_this.formData.type,
                                otherJob:_this.formData.otherJob,
                                list:_this.formData.list
                            })
                        }).then(function (res) {
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
                }else{
                    return false;
                }
                
                })   
                
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
                this[s] = false;
                this.$refs['formData'].resetFields();
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