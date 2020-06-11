<template>
    <div>
    <div class="pageMain">
        <el-form :inline="true" :model="searchForm" class="demo-form-inline">
        <el-form-item label="人员姓名">
            <el-input v-model="searchForm.name"></el-input>
        </el-form-item>
        <el-form-item label="手机号码">
            <el-input v-model="searchForm.mobile"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="searchSubmit">搜索</el-button>
        </el-form-item>
        </el-form>
        <div class="boxMain">
            <p class="boxTitle">人员管理列表</p>
            <div class="tableTopBtn clearfix" style="padding: 15px;">
                <el-button size="mini" type="danger" @click="handleDel()">删除</el-button>
            </div>
            <template>
                <el-table
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%;"
                    @selection-change="handleSelectionChange"
                >
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                    prop="gsName"
                    label="公司名称"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="bmName"
                    label="部门"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="username"
                    label="用户名">
                </el-table-column>
                <el-table-column
                    prop="roleName"
                    label="角色">
                </el-table-column>
                <el-table-column
                    prop="mobile"
                    label="手机号">
                </el-table-column>
                <el-table-column
                    prop="status"
                    label="状态">
                    <template slot-scope="scope">
                        <p v-if="scope.row.status == 1" style="color:#409eff;">启用</p>
                        <p v-else-if="scope.row.status == 0" style="color:#F56C6C;">禁用</p>
                    </template>
                </el-table-column>
                <el-table-column align="center" width="240" label="操作">
                    <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="handleDetails(scope.row.id)">详情</el-button>
                   <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                   <el-button size="mini" type="primary" @click="handleRoles(scope.row)">角色管理</el-button>
                    </template>
                </el-table-column>
                </el-table>
            </template>

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
        </div>
    </div>
    <!--新增员工-->
    <div class="alertEvent addPost" v-show="addShow" >
        <div class="alertMsg" @click="cancelAdd('addShow')"></div>
        <div class="alertMain" style="width: 60%">
            <div class="alertTitle clearfix">
                <p class="float_lf">{{dialogTitle}}</p>
                <img class="float_rt" src= "../../assets/img/del_icon.png" alt="" @click="cancelAdd('addShow')">
            </div>
            <div class="postForm">
                <el-form :model="formData" :inline="true" ref="formData" label-width="140px" class="demo-ruleForm">
                    <el-form-item label="用户名：" prop="username">
                        <el-input v-model="formData.username" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="密码：" prop="password">
                        <el-input v-model="formData.password" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="部门：" prop="orgId">
                        <el-input v-model="formData.orgId" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号：" prop="mobile">
                        <el-input v-model="formData.mobile" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="岗位：" prop="job">
                        <el-input v-model="formData.job" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名：" prop="fullname">
                        <el-input v-model="formData.fullname" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱：" prop="email">
                        <el-input v-model="formData.email" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="状态：" prop="status">
                        <el-radio v-model="formData.status" label="0">禁用</el-radio>
                        <el-radio v-model="formData.status" label="1">启用</el-radio>
                    </el-form-item>
                    <el-form-item label="用户头像：" prop="icon" style="display: block;">
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
    <!--员工详情-->
    <div class="alertEvent addPost" v-show="detailsShow" >
        <div class="alertMsg" @click="cancelAdd('detailsShow')"></div>
        <div class="alertMain"> 
            <div class="alertTitle clearfix">
                <p class="float_lf">员工详情</p>
                <img class="float_rt" src= "../../assets/img/del_icon.png" alt="" @click="cancelAdd('detailsShow')">
            </div>
            <div class="postForm">
                <div class="detailsItem clearfix">
                    <p class="float_lf">姓名 : </p>
                    <p class="float_lf">{{detailsData.fullname}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">用户名：</p>
                    <p class="float_lf">{{detailsData.username}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">角色：</p>
                    <p class="float_lf">{{detailsData.job}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">手机号：</p>
                    <p class="float_lf">{{detailsData.mobile}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">创建时间：</p>
                    <p class="float_lf">{{detailsData.created}}</p>
                </div>
            </div>
        </div>
    </div>
    <!--角色分配管理-->
    <div class="alertEvent addPost" v-show="rolesShow" >
        <div class="alertMsg" @click="cancelAdd('rolesShow')"></div>
        <div class="alertMain" style="width: 60%">
            <div class="alertTitle clearfix">
                <p class="float_lf">{{dialogTitle}}</p>
                <img class="float_rt" src= "../../assets/img/del_icon.png" alt="" @click="cancelAdd('rolesShow')">
            </div>
            <div class="postForm">
                <el-form :model="formData" :inline="true" ref="formData" label-width="100px" class="demo-ruleForm">
                    <el-form-item label="选择角色：" prop="roles">
                        <el-transfer v-model="value" :data="rolesData" :titles="titles" @change="handleChange"></el-transfer>
                    </el-form-item>
                    <el-form-item class="postBtn" style="display: block;text-align: center;">
                        <el-button type="primary" @click="submitRole()">提交</el-button>
                        <el-button @click="cancelAdd('rolesShow')">取消</el-button>
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
        isCollapse: false,
        dialogConfirm: false,
        addShow:false,
        rolesShow:false,
        dialogTitle:'',
        uploadUrl:this.$axios.defaults.basePath+'/image/AliYunImgUpload',
        formInline: {
          user: '',
          mobile: ''
        },
        tableData: [],
        //分页数据
        pagesData:{
          total:0,
          currentPage:1,
          currentRows:10,
          rows:[10, 20, 30, 40],
        },
        //搜索
        searchForm:{
          name:'',
          mobile: ''
        },
        id: '',
        formData:{
            username:'',
            password:'',
            orgId:'',
            mobile: '',
            job: '',
            fullname: '',
            email: '',
            status:'',
                },
        formLabelWidth: '100px',
        detailsShow:false,
        detailsData:[],
        multipleSelection:[],
        ids:'',
        roleId:[],
        rolesData:[],
        value: [],
        titles:['所有角色','已选角色'],
        userId:'',
       //上传回显图片
        imgArr:[
            {
                url:'',
            }
        ],
      }
    },
    created(){
        //获取列表数据
        var _this = this;
        this.$axios.get(_this.$axios.defaults.basePath+'/users/getList',{
            params:{            
                current:'1',
                size:_this.pagesData.currentRows,
            }
        }).then(function (res) {
            console.log(res)
            _this.tableData = res.data.data.records;
             _this.pagesData.total = res.data.data.total;
        })

        this.generateData();
    },
    methods: {
        //获取多有角色列表
        generateData() {
                var _this = this;
                _this.$axios(_this.$axios.defaults.basePath+'/roles/all').then(function (res) {
                    
                    var resData = res.data;
                        for (let i = 0; i < resData.data.length; i++) {
                            _this.rolesData.push({
                                key: resData.data[i].id,
                                label: resData.data[i].name,
                            });
                        }
                })
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
                this.$axios.get(_this.$axios.defaults.basePath+'/users/getList',{
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
                this.$axios.get(_this.$axios.defaults.basePath+'/users/getList',{
                  params:{            
                     fullname:_this.searchForm.name,
                     mobile:_this.searchForm.mobile,
                     current:1,
                     size:_this.pagesData.currentRows,
                  }
                }).then(function (res) {
                    _this.tableData = res.data.data.records;
                    _this.pagesData.total = res.data.data.total;
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
            handleDel() {
                var _this = this;
                _this.ids = _this.ids.substr(0, _this.ids.length - 1); 
                _this.roleId = _this.ids.split(',');
                //return false;
                if(_this.ids == ''){
                    _this.$message.error('请选择要删除的内容');
                    return false;
                }else{
                    _this.$confirm('此操作将永久删除该员工, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                             var _this = this;
                                _this.$axios({
                                url:_this.$axios.defaults.basePath+'/users/delete?ids='+_this.roleId,
                                method:'POST',
                                headers:{
                                    'Content-Type':'application/json'
                                },
                            }).then(function (res) {
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
            handleEdit(row){
                this.addShow = true;
                this.formData = row;
                this.id = row.id;
                this.dialogTitle = '编辑员工信息';
                this.imgArr[0].url = row.icon;
            },
            handleSubmit() {
                var _this = this;
                
                    this.$axios({
                        url: _this.$axios.defaults.basePath+'/users/update',
                        method:'POST',
                        headers:{
                            'Content-Type':'application/json'
                        },
                        data: JSON.stringify({
                            id:_this.id,
                            username:_this.formData.username,
                            password:_this.formData.password,
                            icon:_this.formData.icon,
                            orgId:_this.formData.orgId,
                            status:parseInt(_this.formData.status),
                            mobile:_this.formData.mobile,
                            job:_this.formData.job,
                            fullname:_this.formData.fullname,
                            email:_this.formData.email        
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
                
                
            },
            handleDetails(id){
               var _this = this;
                this.$axios.get(_this.$axios.defaults.basePath+'/users/userId',{
                  params:{            
                     userId:id,
                  }
                }).then(function (res) {
                  console.log(res)
                    if(res.data.errcode == 0){
                            _this.detailsShow = true;
                            _this.detailsData = res.data.data;
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
            //获取员工角色列表
            handleRoles(row) {
                this.rolesShow = true;
                 var _this = this;
                 _this.userId = row.id;
                 _this.$axios.get(_this.$axios.defaults.basePath+'/user_roles',{
                  params:{     
                     userId:row.id,
                  }
                }).then(function (res) {
                    var resData = res.data;
                    console.log(resData)
                    for (let i = 0; i < resData.length; i++) {
                        if(i != undefined){
                                _this.value.push(resData[i].roleId,);
                            }
                        }
                    console.log(_this.value)
                })
            },
            handleChange() {
                
                    
            }, 
            //修改员工角色
            submitRole() {
                var _this = this;
                this.$axios({
                        url: _this.$axios.defaults.basePath+'/grant_roles',
                        method:'POST',
                        headers:{
                            'Content-Type':'application/json'
                        },
                        data: JSON.stringify({
                            userId:_this.userId,
                            roleIds:_this.value,
                        }),
                }).then(function (res) {
                            if (res.data.errcode == 0) {
                                _this.value = [];
                                _this.$message({
                                    message: res.data.errmsg,
                                    type: 'success'
                                });
                                setTimeout(function () {
                                    window.location.reload();
                                }, 500)
                            }
                })        
            },
  }
  }  
</script>
<style lang="scss" scoped>

</style>