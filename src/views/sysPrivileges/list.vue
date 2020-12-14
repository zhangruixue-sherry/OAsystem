<template>
    <div>
        <div class="pageMain">
                        <div class="userTable boxMain">
                            <p class="boxTitle">权限列表</p>
                            <template>
                                <div class="tableTopBtn">
                                    <el-button @click="handleAdd" type="primary" class="el-button--mini" v-if="addButton == '1'"><i class="el-icon-plus"></i>添加新权限</el-button>
                                    <el-button size="mini" type="danger" @click="handleDel()" v-if="delButton == '1'">删除</el-button>
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
                                            label="名称"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="description"
                                            label="描述"
                                            width="200"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            width="200"
                                            prop="created"
                                            label="创建时间">
                                    </el-table-column>
                                    <el-table-column align="center" width="160" label="操作">
                                        <template slot-scope="scope">
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
                                    :current-page="pagesData.current"
                                    :page-sizes="pagesData.rows"
                                    :page-size="10"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="pagesData.total">
                                    </el-pagination>
                                </div>
                            </template>
                </div>
        </div>
        <!--新增权限-->
        <div class="alertEvent addPost" v-show="addShow" >
            <div class="alertMsg" @click="cancelAdd('addShow')"></div>
            <div class="alertMain" style="width: 60%">
                <div class="alertTitle clearfix">
                    <p class="float_lf">{{dialogTitle}}</p>
                    <img class="float_rt" src= "../../assets/img/del_icon.png" alt="" @click="cancelAdd('addShow')">
                </div>
                <div class="postForm">
                    <el-form :model="formData" ref="addData" :inline="true" :rules="rules" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="名称：" prop="name">
                            <el-input v-model="formData.name" placeholder="请输入角色名称" style="width: 300px;"></el-input>
                        </el-form-item>
                        <el-form-item label="menuid：" prop="menuId">
                            <el-input v-model="formData.menuId" style="width: 300px;"  placeholder="请输入menuId（只允许输入数字）" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
                        </el-form-item>
                        <el-form-item label="描述：" prop="description">
                            <el-input v-model="formData.description" placeholder="请输入角色描述" style="width: 500px;" type="textarea" :rows="4"></el-input>
                        </el-form-item>
                        <el-form-item class="postBtn" style="display: block;text-align: center;">
                            <el-button type="primary" @click="handleSubmit('addData')">提交</el-button>
                            <el-button @click="cancelAdd('addShow')">取消</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    
    data() {
        return {
                index:'1',
                isCollapse: false,
                addShow:false,
                tableData:[],
                privileges:[],
                checkList:[],
                tabWidth:200,
                dialogTitle:'',
                //分页数据
                pagesData:{
                    total:0,
                    currentPage:1,
                    currentRows:10,
                    rows:[10, 20, 30, 40],
                },
                formData:{
                    name:'',
                    menuId:'',
                    description:'',
                },
                multipleTable:[],
                ids:'',
                id:'',
                rules:{
                    name: [
                        { required: true, message: '请输入权限名称', trigger: 'blur' }
                    ],
                    menuId: [
                        { required: true, message: '请输入菜单ID', trigger: 'blur' }
                    ],
                    description: [
                        { required: true, message: '请输入权限描述', trigger: 'blur' }
                    ],
                },
                searchButton:'',
                auditButton:'',
                addButton:'',
                delButton:''
            }
    },

    created () {
        //获取列表数据
            var _this = this;
            this.$axios.get(_this.$axios.defaults.basePath+'/privileges',{
              params:{            
                current:1,
                size:_this.pagesData.currentRows,
              }
            }).then(function (res) {
                
                _this.tableData = res.data.data.records;
                 _this.pagesData.total = res.data.data.total;
            })

            var privilege = JSON.parse(sessionStorage.getItem('authority'));
            privilege.forEach((item, index) => {
                if(item.authority == 'sys_privilege_update'){
                    this.auditButton = '1'
                }else if(item.authority == 'sys_privilege_query'){
                    this.searchButton = '1'
                }else if(item.authority == 'sys_privilege_create'){
                    this.addButton = '1'
                }else if(item.authority == 'sys_privilege_delete'){
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
                this.$axios.get(_this.$axios.defaults.basePath+'/privileges',{
                params:{            
                    current:page,
                    size:rows,
                }
                }).then(function (res) {
                    _this.tableData = res.data.data.records;
                    _this.pagesData.total = res.data.data.total;
                })
            },
            handleAdd() {
                this.addShow = true;
                this.dialogTitle = '添加新权限';
            },
            
            handleSelectionChange(val) {
                var _this = this;
                _this.ids = '';
                _this.multipleSelection = val;
                _this.multipleSelection.forEach(item => {
                    _this.ids += item.id + ',';
                });
                
            },

            handleDel() {
                var _this = this;
                this.ids = this.ids.substr(0, this.ids.length - 1); 
                this.roleId = this.ids.split(',');
                if(_this.ids == ''){
                    _this.$message.error('请选择要删除的内容');
                    return false;
                }else{
                    _this.$confirm('此操作将永久删除该权限, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                             var _this = this;
                            _this.$axios({
                                url:_this.$axios.defaults.basePath+'/privileges/delete?ids='+_this.roleId,
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

            handleEdit(value) {
                this.addShow = true;
                this.dialogTitle = '编辑权限';
                this.formData = value;
                this.id = value.id;
            },

            handleSubmit(formData) {
                var _this = this;
                _this.$refs[formData].validate((valid) => {
                    if (valid) {
                        if(_this.dialogTitle == '添加新权限') {
                            this.$axios({
                                url:_this.$axios.defaults.basePath+'/privileges/add',
                                method:'POST',
                                headers:{
                                    'Content-Type':'application/json'
                                },
                                data:JSON.stringify({
                                    name:_this.formData.name,
                                    menuId:parseInt(_this.formData.menuId),
                                    description:_this.formData.description,
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
                                url:_this.$axios.defaults.basePath+'/privileges/update',
                                method:'POST',
                                headers:{
                                    'Content-Type':'application/json'
                                },
                                data:JSON.stringify({
                                    id:_this.id,
                                    name:_this.formData.name,
                                    menuId:parseInt(_this.formData.menuId),
                                    description:_this.formData.description,
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

            //关闭弹框
            cancelAdd(s){
                this[s] = false;
            },


            cancelDialog() {
                this.detailsShow = false;
            },
    }
}
</script>