<template>
<div>
    <div class="pageMain">
                    <el-form :model="searchForm" :inline="true" ref="searchForm" label-position="left" class="demo-form-inline" v-if="searchButton == '1'">
                        <el-form-item label="部门名称：" prop="department">
                        <template>
                            <el-select v-model="value" placeholder="请选择">
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
                        <el-form-item label="项目名称：" prop="projectId">
                            <el-select v-model="searchForm.projectName" placeholder="请选择项目">
                                <el-option
                                        v-for="(item,index) in proList"
                                        :key="index"
                                        :label="item.projectName"
                                        :value="item.projectName">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="文档名称">
                            <el-input v-model="searchForm.name" placeholder="请输入文档名称"></el-input>
                        </el-form-item>
                        <el-form-item label="上传用户">
                            <el-input v-model="searchForm.username" placeholder="请输入上传用户"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchSubmit('searchForm')">查询</el-button>
                            <el-button @click="resetForm('searchForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                        <div class="userTable boxMain">
                            <p class="boxTitle">文档列表</p>
                            <template>
                                <div class="tableTopBtn">
                                    <el-button @click="handleAdd" type="primary" class="el-button--mini" v-if="addButton == '1'"><i class="el-icon-plus"></i>添加文档</el-button>
                                    <el-button size="mini" type="danger" @click="handleDel(id)" v-if="delButton == '1'">删除</el-button>
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
                                            prop="id"
                                            label="ID"
                                            width="100"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="name"
                                            label="文档名称"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="document"
                                            label="文档地址"
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
<!--新增文档-->
    <div class="alertEvent addPost" v-show="addShow" >
        <div class="alertMsg" @click="cancelAdd('addShow')"></div>
        <div class="alertMain" style="width: 60%">
            <div class="alertTitle clearfix">
                <p class="float_lf">{{dialogTitle}}</p>
                <img class="float_rt" src= "../../assets/img/del_icon.png" alt="" @click="cancelAdd('addShow')">
            </div>
            <div class="postForm">
                <el-form :model="formData" :inline="true" :rules="rules" ref="formData"  label-width="140px" class="demo-ruleForm">
                    <el-form-item label="部门名称：" prop="department">
                        <template>
                        <el-select v-model="formData.department" placeholder="请选择" style="width: 300px;" @change="departmentChange">
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
                    <el-form-item label="项目名称：" prop="projectId">
                        <el-select v-model="formData.projectId" placeholder="请选择项目" style="width: 300px;" @change="projectChange">
                            <el-option
                                    v-for="(item,index) in proList"
                                    :key="index"
                                    :label="item.projectName"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="文档名称：" prop="name">
                        <el-input v-model="formData.name" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="上传文件：" prop="document">
                        <p>{{formData.document}}</p>
                        <el-upload
                                :action=uploadUrl
                                list-type="picture-card"
                                :on-preview="handlePictureCardPreview"
                                :on-success="handleAvatarSuccess"
                                :on-remove="handleRemove">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item class="postBtn" style="display: block;text-align: center;">
                        <el-button type="primary" @click="handleSubmit('formData')">提交</el-button>
                        <el-button @click="cancelAdd('addShow')">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
    <!--文档详情-->
    <div class="alertEvent addPost" v-show="detailsShow" >
        <div class="alertMsg" @click="cancelAdd('detailsShow')"></div>
        <div class="alertMain"> 
            <div class="alertTitle clearfix">
                <p class="float_lf">文档详情</p>
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
                    <p class="float_lf">部门ID：</p>
                    <p class="float_lf">{{detailsData.departmentId}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">文档名称：</p>
                    <p class="float_lf">{{detailsData.name}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">文档地址：</p>
                    <p class="float_lf">{{detailsData.document}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">项目ID：</p>
                    <p class="float_lf">{{detailsData.projectId}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">项目名称：</p>
                    <p class="float_lf">{{detailsData.projectName}}</p>
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
                uploadUrl:'http://39.99.175.166:9000/admin/image/AliYunImgUpload',
                dialogConfirm: false,
                addShow:false,
                dialogTitle:'',
                //搜索
                searchForm:{
                    department:'',
                    name:'',
                    projectName:'',
                    username: '',
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
                    document:'',
                    name:'',
                    projectId:'',
                    projectName:'',
                },
                formLabelWidth: '100px',
                detailsShow:false,
                detailsData:[],
                multipleSelection:[],
                ids:'',
                id:'',
                departmentArr:[],
                value:'',
                proList:[],
                rules:{
                    department: [
                        { required: true, message: '请选择部门', trigger: 'change' }
                    ],
                    projectId: [
                        { required: true, message: '请选择项目', trigger: 'change' }
                    ],
                    name: [
                        { required: true, message: '请输入文档名称', trigger: 'blur' }
                    ],
                    document: [
                        { required: true, message: '请上传文档', trigger: 'blur' }
                    ],
                },

                searchButton:'',
                auditButton:'',
                addButton:'',
                delButton:''
            }
        },
        created () {
            var _this = this;
            //获取文档列表
                this.$axios.get(_this.$axios.defaults.basePath+'/documents',{
                  params:{            
                     name:_this.searchForm.name,
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
                    if(item.authority == 'documents_update'){
                        this.auditButton = '1'
                    }else if(item.authority == 'documents_query'){
                        this.searchButton = '1'
                    }else if(item.authority == 'documents_create'){
                        this.addButton = '1'
                    }else if(item.authority == 'documents_delete'){
                        this.delButton = '1'
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
                this.$axios.get(_this.$axios.defaults.basePath+'/documents',{
                  params:{  
                     department:_this.value.label,           
                     name:_this.searchForm.name,
                     projectName:_this.searchForm.projectName,
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
                this.$axios.get(_this.$axios.defaults.basePath+'/documents',{
                  params:{            
                     department:_this.value.label,           
                     name:_this.searchForm.name,
                     projectName:_this.searchForm.projectName,
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
                this.$refs[formName].model.name ='';
                this.$refs[formName].model.department ='';
                this.$refs[formName].model.projectName ='';
                this.$refs[formName].model.username ='';
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
                this.dialogTitle = '添加文档';
            },
            handleEdit(row){
                this.addShow = true;
                this.formData = row;
                this.id = row.id;
                this.value = row.department;
                this.dialogTitle = '编辑文档';
            },
            handleSubmit(formData) {
                var _this = this;
                 _this.$refs[formData].validate((valid) => {
                     console.log(valid)
                    if (valid) {
                        if(_this.dialogTitle == '添加文档'){
                        this.$axios({
                            url:_this.$axios.defaults.basePath+'/documents/add',
                            method:'POST',
                            headers:{
                                'Content-Type':'application/json'
                            },
                            data:JSON.stringify({
                                department:_this.value.label,
                                departmentId:_this.value.value,
                                document:_this.formData.document,
                                name:_this.formData.name,
                                projectId:_this.formData.projectId,
                                projectName:_this.formData.projectName,
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
                            url:_this.$axios.defaults.basePath+'/documents/update',
                            method:'POST',
                            headers:{
                                'Content-Type':'application/json'
                            },
                            data:JSON.stringify({
                                id:_this.id,
                                department:_this.value.label,
                                departmentId:_this.value.value,
                                document:_this.formData.document,
                                name:_this.formData.name,
                                projectId:_this.formData.projectId,
                                projectName:_this.formData.projectName,
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

                    }
                 })
                
                
            },
            handleDetails(id){
               var _this = this;
                this.$axios.get(_this.$axios.defaults.basePath+'/documents/info',{
                  params:{            
                     documentId: id
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
                this.$refs['formData'].resetFields();
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
                    _this.$confirm('此操作将永久删除该文档, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                             var _this = this;
                            _this.$axios({
                                url:_this.$axios.defaults.basePath+'/documents/delete?ids='+_this.roleId,
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

            //选择部门
            departmentChange(val){
                this.formData.department = val.label;
                this.formData.departmentId = val.value;
                console.log(this.formData);
            },

            //选择项目
            projectChange(val){
                console.log(val);
                var _this = this;
                var list = this.proList;
                if(val){
                    for(var i=0;i<list.length;i++){
                        if(list[i].id == val){
                            _this.formData.projectName = list[i].projectName;
                        }
                    }
                }
                console.log(_this.formData.projectName)
            },

            //上传图片事件
            handleAvatarSuccess(res, file){
                console.log(file);
                this.formData.document = file.response.data;
                console.log(this.formData.document)
            },
            handleRemove(file) {
                console.log(file);
            },
            handlePictureCardPreview(file) {
                // this.dialogImageUrl = file.url;
                this.dialogVisible = true;
            },

        },
    };

</script>