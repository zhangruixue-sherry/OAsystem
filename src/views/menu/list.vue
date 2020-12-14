<template>
<div>
    <div class="pageMain">
                    <el-form :model="searchForm" :inline="true" ref="searchForm" label-position="left" class="demo-form-inline" v-if="searchButton == '1'">
                        <el-form-item label="菜单名称">
                            <el-input v-model="searchForm.name" placeholder="请输入菜单名称"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchSubmit('searchForm')">查询</el-button>
                            <el-button @click="resetForm('searchForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                        <div class="userTable boxMain">
                            <p class="boxTitle">菜单列表</p>
                            <template>
                                <div class="tableTopBtn">
                                    <el-button @click="handleAdd" type="primary" class="el-button--mini" v-if="addButton == '1'"><i class="el-icon-plus"></i>添加菜单</el-button>
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
                                            label="菜单名称"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="desc"
                                            label="描述"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            width="200"
                                            prop="created"
                                            label="创建时间">
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
<!--新增菜单-->
    <div class="alertEvent addPost" v-show="addShow" >
        <div class="alertMsg" @click="cancelAdd('addShow')"></div>
        <div class="alertMain" style="width: 60%">
            <div class="alertTitle clearfix">
                <p class="float_lf">{{dialogTitle}}</p>
                <img class="float_rt" src= "../../assets/img/del_icon.png" alt="" @click="cancelAdd('addShow')">
            </div>
            <div class="postForm">
                <el-form :model="formData" :inline="true" :rules="rules" ref="formData" label-width="140px" class="demo-ruleForm">
                    <el-form-item label="名称：" prop="name">
                        <el-input v-model="formData.name" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="描述：" prop="desc">
                        <el-input v-model="formData.desc" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="排序：" prop="sort">
                        <el-input v-model="formData.sort" style="width: 300px;" placeholder="只允许输入数字" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
                    </el-form-item>
                    <el-form-item label="URL：" prop="targetUrl">
                        <el-input v-model="formData.targetUrl" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="父级ID：" prop="parentId">
                        <el-input v-model="formData.parentId" style="width: 300px;" placeholder="只允许输入数字" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
                    </el-form-item>
                    <!-- <el-form-item label="父级Key：" prop="parentKey">
                        <el-input v-model="formData.parentKey" style="width: 300px;" placeholder="只允许输入数字" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
                    </el-form-item>
                    <el-form-item label="menuKey：" prop="menuKey">
                        <el-input v-model="formData.menuKey" style="width: 300px;" placeholder="只允许输入数字" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
                    </el-form-item> -->
                    <el-form-item label="类型：" prop="type">
                        <el-input v-model="formData.type" style="width: 300px;" placeholder="只允许输入数字" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
                    </el-form-item>
                    <el-form-item label="状态：" prop="status" style="width: 400px;">
                        <el-radio-group v-model="formData.status">
                            <el-radio :label="0">禁用</el-radio>
                            <el-radio :label="1">启用</el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="一级菜单图标：" prop="icon" style="display: block;" v-if="dialogTitle == '添加菜单'">
                        <el-upload
                                :action=uploadUrl
                                list-type="picture-card"
                                :on-preview="handlePictureCardPreview"
                                :on-success="handleAvatarSuccess"
                                :limit="1"
                                :on-remove="handleRemove">
                            <i class="el-icon-plus"></i>
                        </el-upload>
                    </el-form-item>
                    <el-form-item label="一级菜单图标：" prop="icon" style="display: block;" v-else-if="dialogTitle == '编辑菜单' && formData.type == 1">
                        <el-upload
                                :action=uploadUrl
                                list-type="picture-card"
                                :on-preview="handlePictureCardPreview"
                                :on-success="handleAvatarSuccess"
                                :on-remove="handleRemove"
                                :before-upload="beforeAvatarUpload"
                                :limit="1"
                                :file-list="imgArr">
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
    <!--菜单详情-->
    <div class="alertEvent addPost" v-show="detailsShow" >
        <div class="alertMsg" @click="cancelAdd('detailsShow')"></div>
        <div class="alertMain"> 
            <div class="alertTitle clearfix">
                <p class="float_lf">菜单详情</p>
                <img class="float_rt" src= "../../assets/img/del_icon.png" alt="" @click="cancelAdd('detailsShow')">
            </div>
            <div class="postForm">
                <div class="detailsItem clearfix">
                    <p class="float_lf">ID : </p>
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
                uploadUrl:'http://39.99.175.166:9000/admin/image/AliYunImgUpload',
                //搜索
                searchForm:{
                    name:'',
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
                    name:'',
                    desc:'',
                    sort:'',
                    status:'',
                    targetUrl:'',
                    type:'',
                    icon:'',
                    parentId:''
                },
                formLabelWidth: '100px',
                detailsShow:false,
                detailsData:[],
                multipleSelection:[],
                ids:'',
                id:'',
                //上传回显图片
                imgArr:[
                    {
                        url:'',
                    }
                ],
                rules:{
                    name: [
                        { required: true, message: '请输入菜单名称', trigger: 'blur' }
                    ],
                    desc: [
                        { required: true, message: '请输入菜单描述', trigger: 'blur' }
                    ],
                    type: [
                        { required: true, message: '请输入菜单类型', trigger: 'blur' }
                    ],
                    status: [
                        { required: true, message: '请选择菜单状态', trigger: 'change' }
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
            //获取菜单列表
                this.$axios.get(_this.$axios.defaults.basePath+'/menu',{
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

            var privilege = JSON.parse(sessionStorage.getItem('authority'));
            console.log(privilege)
            privilege.forEach((item, index) => {
                if(item.authority == 'menu_update'){
                    this.auditButton = '1'
                }else if(item.authority == 'menu_query'){
                    this.searchButton = '1'
                }else if(item.authority == 'menu_create'){
                    this.addButton = '1'
                }else if(item.authority == 'menu_delete'){
                    this.delButton = '1'
                }else{

                }
            });
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
                this.$axios.get(_this.$axios.defaults.basePath+'/menu',{
                  params:{            
                     name:_this.searchForm.name,
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
                this.$axios.get(_this.$axios.defaults.basePath+'/menu',{
                  params:{            
                     name:_this.searchForm.name,
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
                this.dialogTitle = '添加菜单';
            },
            handleEdit(row){
                this.addShow = true;
                this.formData = row;
                this.id = row.id;
                this.dialogTitle = '编辑菜单';
                this.imgArr[0].url = row.icon;
            },
            handleSubmit(formData) {
                var _this = this;
                _this.$refs[formData].validate((valid) => {
                if (valid) {
                    if(_this.dialogTitle == '添加菜单'){
                        this.$axios({
                            url:_this.$axios.defaults.basePath+'/menu/add',
                            method:'POST',
                            headers:{
                                'Content-Type':'application/json'
                            },
                            data:JSON.stringify({
                                name:_this.formData.name,
                                desc:_this.formData.desc,
                                icon:_this.formData.icon,
                                sort:_this.formData.sort,
                                targetUrl:_this.formData.targetUrl,
                                status:_this.formData.status,
                                type:_this.formData.type,
                                parentId:_this.formData.parentId,
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
                            url:_this.$axios.defaults.basePath+'/menu/update',
                            method:'POST',
                            headers:{
                                'Content-Type':'application/json'
                            },
                            data:JSON.stringify({
                                id:_this.id,
                                name:_this.formData.name,
                                desc:_this.formData.desc,
                                icon:_this.formData.icon,
                                sort:_this.formData.sort,
                                targetUrl:_this.formData.targetUrl,
                                status:_this.formData.status,
                                type:_this.formData.type,
                                parentId:_this.formData.parentId,
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
                }else{
                    return false;
                }
                })
            },
            handleDetails(id){
               var _this = this;
                this.$axios.get(_this.$axios.defaults.basePath+'/menu/info',{
                  params:{            
                     menuId: id
                  }
                }).then(function (res) {
                    var resData = res.data
                    if(resData.errcode == 0){
                            _this.detailsShow = true;
                            _this.detailsData = resData.data;
                        }
                })
            },
            //上传图片事件
            handleAvatarSuccess(res, file){
                console.log(file);
                this.formData.icon = file.response.data;
            },
            handleRemove(file) {
                console.log(file);
            },
            handlePictureCardPreview(file) {
                //this.dialogImageUrl = file.url;
                console.log(file)
                this.dialogVisible = true;
            },
            beforeAvatarUpload(file) {
                console.log(file);
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
                    _this.$confirm('此操作将永久删除该菜单, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                             var _this = this;
                            _this.$axios({
                                url:_this.$axios.defaults.basePath+'/menu/delete?ids='+_this.roleId,
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