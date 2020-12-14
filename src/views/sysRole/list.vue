<template>
    <div>
        <div class="pageMain">
                    <el-form :model="searchForm" :inline="true" ref="searchForm" label-position="left" class="demo-form-inline" v-if="searchButton == '1'">
                        <el-form-item label="角色名称">
                            <el-input v-model="searchForm.name" placeholder="请输入角色名称"></el-input>
                        </el-form-item>
                        <el-form-item label="角色代码">
                            <el-input v-model="searchForm.code" placeholder="请输入角色代码"></el-input>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-select v-model="searchForm.status" placeholder="请选择状态">
                                <el-option v-for="(item,index) in status" :key="index" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchSubmit('searchForm')">查询</el-button>
                            <el-button @click="resetForm('searchForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                        <div class="userTable boxMain">
                            <p class="boxTitle">角色列表</p>
                            <template>
                                <div class="tableTopBtn">
                                    <el-button @click="addShow = true" type="primary" class="el-button--mini" v-if="addButton == '1'"><i class="el-icon-plus"></i> 新增角色</el-button>
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
                                            min-width="160"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="name"
                                            label="名称"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="code"
                                            label="角色代码"
                                            min-width="130"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="description"
                                            label="描述"
                                            min-width="120"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            min-width="170"
                                            prop="created"
                                            label="创建时间"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            min-width="170"
                                            prop="lastUpdateTime"
                                            label="最后更新时间"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="status"
                                            label="状态">
                                        <template slot-scope="scope">
                                            <p v-if="scope.row.status == 1" style="color:#409eff;">启用</p>
                                            <p v-else-if="scope.row.status == 0" style="color:#409eff;">禁用</p>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" width="180" label="操作">
                                        <template slot-scope="scope">
                                            <el-button
                                                    size="mini"
                                                    type="primary"
                                                    @click="handleDetails(scope.row.id)">详情</el-button>
                                            <el-button
                                                    size="mini"
                                                    type="primary"
                                                    @click="handlePrivileges(scope.row.id)">权限配置</el-button>
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
    <!--新增角色-->
    <div class="alertEvent addPost" v-show="addShow" >
        <div class="alertMsg" @click="cancelAdd('addShow')"></div>
        <div class="alertMain" style="width: 60%">
            <div class="alertTitle clearfix">
                <p class="float_lf">添加新角色</p>
                <img class="float_rt" src= "../../assets/img/del_icon.png" alt="" @click="cancelAdd('addShow')">
            </div>
            <div class="postForm">
                <el-form :model="formData" :inline="true" :rules="rules" ref="formData" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="名称：" prop="name">
                        <el-input v-model="formData.name" placeholder="请输入角色名称" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="代码：" prop="code">
                        <el-input v-model="formData.code" placeholder="请输入角色代码" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="描述：" prop="description">
                        <el-input v-model="formData.description" placeholder="请输入角色描述" style="width: 300px;" type="textarea" :rows="4"></el-input>
                    </el-form-item>
                    <el-form-item label="状态：" prop="status" style="width:400px">
                        <el-radio v-model="formData.status" label="0">禁用</el-radio>
                        <el-radio v-model="formData.status" label="1">启用</el-radio>
                    </el-form-item>
                    <el-form-item class="postBtn" style="display: block;text-align: center;">
                        <el-button type="primary" @click="handleAdd('formData')">提交</el-button>
                        <el-button @click="cancelAdd('addShow')">取消</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
    <!--角色详情-->
    <div class="alertEvent addPost" v-show="detailsShow" >
        <div class="alertMsg" @click="cancelAdd('detailsShow')"></div>
        <div class="alertMain"> 
            <div class="alertTitle clearfix">
                <p class="float_lf">详情</p>
                <img class="float_rt" src= "../../assets/img/del_icon.png" alt="" @click="cancelAdd('detailsShow')">
            </div>
            <div class="postForm">
                <div class="detailsItem clearfix">
                    <p class="float_lf">ID: </p>
                    <p class="float_lf">{{detailsData.id}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">名 称：</p>
                    <p class="float_lf">{{detailsData.name}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">角色代码：</p>
                    <p class="float_lf">{{detailsData.code}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">描 述：</p>
                    <p class="float_lf">{{detailsData.description}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">状 态：</p>
                    <p class="float_lf" v-if="detailsData.status == 1">启用</p>
                    <p class="float_lf" v-if="detailsData.status == 0">禁用</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">创建时间：</p>
                    <p class="float_lf">{{detailsData.created}}</p>
                </div>
            </div>
        </div>
    </div>
    <!--权限分配管理-->
    <div class="alertEvent addPost" v-show="rolesShow" >
        <div class="alertMsg" @click="cancelAdd('rolesShow')"></div>
        <div class="alertMain" style="width: 60%; height: 80%;">
            <div class="alertTitle clearfix">
                <p class="float_lf">权限分配</p>
                <img class="float_rt" src= "../../assets/img/del_icon.png" alt="" @click="cancelAdd('rolesShow')">
            </div>
            <div class="postForm" style="overflow: auto; height: 630px;box-sizing: border-box;">
                    <el-tree
                        ref="tree"
                        :data="rolesData"
                        show-checkbox
                        node-key="s_id"
                        :default-expanded-keys="checkedData"
                        :default-checked-keys="checkedData"
                        :props="defaultProps">
                    </el-tree>
                <div style="text-align: center; margin: 30px 0;">
                    <el-button type="primary" @click="submitPriviles">提交</el-button>
                    <el-button @click="cancelAdd('rolesShow')">取消</el-button>
                </div>
            </div>

        </div>
    </div>

    </div>
</template>

<script>
export default {
    data() {
        return{
            index:'1',
                dialogConfirm: false,
                addShow:false,
                //搜索
                searchForm:{
                    name:'',
                    code:'',
                    status:''
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
                status:[
                    {
                        id:0,
                        text:'禁用'
                    },{
                        id:1,
                        text:'启用'
                    },
                ],
                formData:{
                    name:'',
                    code:'',
                    description:'',
                    status:'',
                },
                formLabelWidth: '100px',
                detailsShow:false,
                detailsData:{},
                multipleTable:[],
                ids:'',
                delroleId:[],
                roleId:'',
                rolesData:[],
                value: [],
                dialogTitle:'',
                rolesShow:false,
                rolesList:[],
                children:[],
                checkedData:[],
                privilegesIds:[],

                defaultProps: {
                    children: 'child',
                    label: 'name'
                },
                rules:{
                    name: [
                        { required: true, message: '请输入角色名称', trigger: 'blur' }
                    ],
                    code: [
                        { required: true, message: '请输入角色代码', trigger: 'blur' }
                    ],
                    description: [
                        { required: true, message: '请输入角色描述', trigger: 'blur' }
                    ],
                    status: [
                        { required: true, message: '请选择角色状态', trigger: 'change' }
                    ],
                },
                searchButton:'',
                auditButton:'',
                addButton:'',
                delButton:''
        }
    },

    created (){
        //获取列表数据
            var _this = this;
            this.$axios.get(_this.$axios.defaults.basePath+'/roles',{
              params:{            
                current:'1',
                size:_this.pagesData.currentRows,
              }
            }).then(function (res) {
                _this.tableData = res.data.data.records;
                _this.pagesData.total = res.data.data.total;
            })

            this.generateData();
            
            var privilege = JSON.parse(sessionStorage.getItem('authority'));
            privilege.forEach((item, index) => {
                if(item.authority == 'sys_role_update'){
                    this.auditButton = '1'
                }else if(item.authority == 'sys_role_query'){
                    this.searchButton = '1'
                }else if(item.authority == 'sys_role_create'){
                    this.addButton = '1'
                }else if(item.authority == 'sys_role_delete'){
                    this.delButton = '1'
                }else{

                }
            });
    },
    methods: {
        //获取所有权限列表
        generateData() {
        
        },

        //分页--每页条数切换
            handleSizeChange(val) {
                var _this = this;
                _this.pagesData.currentRows = val;
                _this.pagesEvent(_this.pagesData.currentPage,val);
            },
            //第几页
            handleCurrentChange(val) {
                var _this = this;
                _this.pagesData.currentPage = val;
                _this.pagesEvent(val,_this.pagesData.currentRows);
            },
            //分页请求数据方法
            pagesEvent(page,rows){
                var _this = this;
                this.$axios.get(_this.$axios.defaults.basePath+'/roles',{
                    params:{            
                        current:page,
                        size:rows,
                    }
                    }).then(function (res) {
                        console.log(res);
                        _this.tableData = res.data.data.records;
                        _this.pagesData.total = res.data.data.total;
                })

            },

            //搜索操作
            searchSubmit() {
                 var _this = this;
                this.$axios.get(_this.$axios.defaults.basePath+'/roles',{
                    params:{            
                        name:_this.searchForm.name,
                        code:_this.searchForm.code,
                        status:_this.searchForm.status,
                        current:1,
                        size:_this.pagesData.currentRows,
                    }
                    }).then(function (res) {
                        console.log(res);
                        _this.tableData = res.data.data.records;
                        _this.pagesData.total = res.data.data.total;
                })
            },
            //表单重置
            resetForm(formName) {
                this.$refs[formName].model.name ='';
                this.$refs[formName].model.code ='';
                this.$refs[formName].model.status ='';
            },
            handleSelectionChange(val) {
                var _this = this;
                _this.ids = '';
                this.multipleSelection = val;
                this.multipleSelection.forEach(item => {
                    _this.ids += item.id + ',';
                });
                
            },

            handleAdd(formData) {
                var _this = this;
                _this.$refs[formData].validate((valid) => {
                    if (valid) {
                        this.$axios({
                            url:_this.$axios.defaults.basePath+'/roles/insert',
                            method:'POST',
                            headers:{
                                'Content-Type':'application/json'
                            },
                            data:JSON.stringify({
                                name:this.formData.name,
                                code:this.formData.code,
                                description:this.formData.description,
                                status:parseInt(this.formData.status),
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
                        return false;
                    }
                })    
                
            },
            handleDetails(id){
                var _this = this;
                this.$axios.get(_this.$axios.defaults.basePath+'/roles/roleId',{
                  params:{            
                      roleId:id,
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
                this.checkedData = [];
            },

            handleDel() {
                var _this = this;
                _this.ids = _this.ids.substr(0, _this.ids.length - 1); 
                _this.delroleId = _this.ids.split(',');
                //return false;
                if(_this.ids == ''){
                    _this.$message.error('请选择要删除的内容');
                    return false;
                }else{
                    _this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                             var _this = this;
                            _this.$axios({
                                url:_this.$axios.defaults.basePath+'/roles/delete?ids='+_this.delroleId,
                                method:'POST',
                                headers:{
                                    'Content-Type':'application/json'
                                }
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

            handlePrivileges(id) {
                var _this = this;
                console.log(111);
                _this.roleId = id;
                _this.rolesShow = true;
                this.$axios.get(_this.$axios.defaults.basePath+'/role_privileges',{
                  params:{            
                      roleId:id,
                  }
                }).then(function (res) {
                    var data = res.data.data;
                    console.log(data);
                    //获取二级菜单权限并组装成数组
                    var twoPrivileges = new Array();
                    for(var i=0;i<data.length;i++){
                        if(data[i].privileges[0].id){
                            for(var j=0;j<data[i].privileges.length;j++){
                                var json = {
                                    s_id:data[i].privileges[j].id,
                                    name:data[i].privileges[j].description,
                                    text:data[i].privileges[j].name,
                                    menuId:data[i].privileges[j].menuId,
                                    own:data[i].privileges[j].own,
                                };
                                twoPrivileges.push(json);
                            }
                        }
                    }
                    
                    
                           var pid= '';
                           twoPrivileges.forEach(item =>{
                                if(item['own'] == '1'){
                                    pid+=item.s_id+','
                                }
                            });
                        var aa = pid.substr(0, pid.length - 1); 
                        var arr = aa.split(',');
                        var array = arr.map(Number);
                        _this.checkedData = array;
                        console.log(_this.checkedData)
                    //获取本地存储的菜单数据
                    var menus = JSON.parse(sessionStorage.getItem('menus'));
                    // console.log(menus);
                    //遍历菜单数组合并二级菜单权限数组
                    for(var n = 0;n<menus.length;n++){
                        if(menus[n].child.length >0){
                            for(var m=0;m<menus[n].child.length;m++){
                                var arr = new Array();
                                for(var u=0;u<twoPrivileges.length;u++){
                                    //将权限添加到对应菜单
                                    if(menus[n].child[m].id != twoPrivileges[u].menuId){

                                        // menus[n].child[m].disabled = true;
                                    }else{
                                        arr.push(twoPrivileges[u]);
                                        menus[n].child[m].disabled = false;
                                    }
                                    // //获取选中的菜单权限
                                    // if(twoPrivileges[u].own =="1"){
                                    //     _this.checkedData.push(twoPrivileges[u].text);
                                    // }
                                }
                                menus[n].child[m].child = arr;
                            }
                        }else{
                            menus.splice(n,1);
                        }
                    }
                    _this.rolesData = menus;
                })
            },
            submitPriviles() {
                var _this = this;
                var treedata = this.$refs.tree.getCheckedNodes();
                console.log(this.$refs.tree.getCheckedNodes());
                var menueid = '';
                treedata.forEach(item => {
                    if(item['s_id']){
                        menueid+=item.s_id+',';
                    }   
                 });
                var aa = menueid.substr(0, menueid.length - 1); 
                var arr = aa.split(',');
                var array = arr.map(Number);
                this.$axios({
                    url: _this.$axios.defaults.basePath+'/grant_privileges',
                    method:'POST',
                    headers:{
                            'Content-Type':'application/json'
                    },
                    data:JSON.stringify({
                        privilegeIds:array,
                        roleId:_this.roleId,
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
}
</script>

<style lang="scss" scoped>

</style>