<template>
<div>
    <div class="pageMain">
        <el-form :model="searchForm" :inline="true" ref="searchForm" label-position="left" class="demo-form-inline">
        <el-form-item label="机构名称">
            <el-input v-model="searchForm.name"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="searchSubmit('searchForm')">查询</el-button>
            <el-button @click="resetForm('searchForm')">重置</el-button>
        </el-form-item>
        </el-form>
        <div class="boxMain">
            <p class="boxTitle">机构列表</p>
            <div class="tableTopBtn clearfix" style="padding: 15px;">
                <el-button size="mini" type="primary" @click="handleAdd">添加</el-button>
                <el-button size="mini" type="danger" @click="handleDel">删除</el-button>
            </div>
            <template>
                <el-table
                :data="tableData"
                style="width: 100%"
                ref="multipleTable"
                tooltip-effect="dark"
                @selection-change="handleSelectionChange"
                >
                <el-table-column
                    type="selection"
                    width="55">
                </el-table-column>
                <el-table-column
                    prop="name"
                    label="机构名称"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="desc"
                    label="机构描述"
                    width="180">
                </el-table-column>
                <el-table-column
                    prop="code"
                    label="编码">
                </el-table-column>
                <el-table-column
                    prop="type"
                    label="类型">
                </el-table-column>
                <el-table-column
                    prop="mobile"
                    label="电话">
                </el-table-column>
                <el-table-column
                    prop="address"
                    label="地址">
                </el-table-column>
                <el-table-column align="center" width="240" label="操作">
                    <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="handleDetails(scope.row.name,scope.row.id)">详情</el-button>
                    <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                    <el-button size="mini" type="primary" @click="handleUser(scope.row)">添加人员</el-button>
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

        <!--机构详情-->
        <div class="alertEvent addPost" v-show="detailsShow" >
            <div class="alertMsg" @click="cancelAdd('detailsShow')"></div>
            <div class="alertMain">
                <div class="alertTitle clearfix">
                    <p class="float_lf">{{detailsTitle}}详情</p>
                    <img class="float_rt" src= "../../assets/img/del_icon.png" alt="" @click="cancelAdd('detailsShow')">
                </div>
                <div class="postForm">
                    <div class="detailsItem clearfix">
                        <p class="float_lf">名称：</p>
                        <p class="float_lf">{{detailsData.name}}</p>
                    </div>
                    <div class="detailsItem clearfix">
                        <p class="float_lf">描述：</p>
                        <p class="float_lf">{{detailsData.desc}}</p>
                    </div>
                    <div class="detailsItem clearfix">
                        <p class="float_lf">编码：</p>
                        <p class="float_lf">{{detailsData.code}}</p>
                    </div>
                    <div class="detailsItem clearfix">
                        <p class="float_lf">类型：</p>
                        <p class="float_lf">{{detailsData.type}}</p>
                    </div>
                    <div class="detailsItem clearfix">
                        <p class="float_lf">电话：</p>
                        <p class="float_lf">{{detailsData.mobile}}</p>
                    </div>
                    <div class="detailsItem clearfix">
                        <p class="float_lf">地址：</p>
                        <p class="float_lf">{{detailsData.address}}</p>
                    </div>
                    <div class="detailsItem clearfix">
                        <div style="width:95px;float:left;text-align:right">公司及部门：</div>
                        <div style="float:left;padding-bottom:30px">
                          <el-tree :data="companyData" :props="defaultProps" @node-click="handleNodeClick" accordion></el-tree>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!--新增机构-->
        <div class="alertEvent addPost" v-show="addShow" >
            <div class="alertMsg" @click="cancelAdd('addShow')"></div>
            <div class="alertMain" style="width: 60%">
                <div class="alertTitle clearfix">
                    <p class="float_lf">{{dialogTitle}}</p>
                    <img class="float_rt" src= "../../assets/img/del_icon.png" alt="" @click="cancelAdd('addShow')">
                </div>
                <div class="postForm">
                    <el-form :model="formData" :inline="true" ref="formData" label-width="100px" class="demo-ruleForm">
                        <el-form-item label="名称：" prop="name">
                            <el-input v-model="formData.name" placeholder="请输入机构名称" style="width: 300px;"></el-input>
                            <el-button @click="addDomain">添加公司</el-button>
                        </el-form-item>

                        <el-form-item
                          v-for="(domain, index) in dynamicValidateForm.domains"
                          :label="'公司' + index"
                          :key="domain.key"
                          :prop="'domains.' + index + '.value'"
                        >
                          <el-input v-model="domain.value"></el-input><el-button @click.prevent="removeDomain(domain)">删除</el-button>
                        </el-form-item>

                        <el-form-item label="代码：" prop="code">
                            <el-input v-model="formData.code" placeholder="请输入机构代码" style="width: 300px;"></el-input>
                        </el-form-item>
                        <el-form-item label="电话：" prop="mobile">
                            <el-input v-model="formData.mobile" placeholder="请输入机构电话" style="width: 300px;"></el-input>
                        </el-form-item>
                        <el-form-item label="地址：" prop="address">
                            <el-input v-model="formData.address" placeholder="请输入机构地址" style="width: 300px;"></el-input>
                        </el-form-item>
                        <el-form-item label="描述：" prop="desc">
                            <el-input v-model="formData.desc" placeholder="请输入机构描述" style="width: 300px;" type="textarea" :rows="4"></el-input>
                        </el-form-item>
                        <el-form-item label="类型：" prop="type">
                            <el-input v-model="formData.type" placeholder="请输入机构地址" style="width: 300px;"></el-input>
                        </el-form-item>
                        <el-form-item class="postBtn" style="display: block;text-align: center;">
                            <el-button type="primary" @click="handleSubmit()">提交</el-button>
                            <el-button @click="cancelAdd('addShow')">取消</el-button>
                        </el-form-item>
                    </el-form>
                </div>
            </div>
        </div>

        <!--新增员工-->
    <div class="alertEvent addPost" v-show="userAddShow" >
        <div class="alertMsg" @click="cancelAdd('userAddShow')"></div>
        <div class="alertMain" style="width: 60%">
            <div class="alertTitle clearfix">
                <p class="float_lf">{{dialogTitle}}</p>
                <img class="float_rt" src= "../../assets/img/del_icon.png" alt="" @click="cancelAdd('userAddShow')">
            </div>
            <div class="postForm">
                <el-form :model="formuserData" :inline="true" ref="formuserData" label-width="140px" class="demo-ruleForm">
                    <el-form-item label="用户名：" prop="username">
                        <el-input v-model="formuserData.username" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="密码：" prop="password">
                        <el-input v-model="formuserData.password" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="部门：" prop="orgId">
                        <el-input v-model="formuserData.orgId" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="手机号：" prop="mobile">
                        <el-input v-model="formuserData.mobile" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="岗位：" prop="job">
                        <el-input v-model="formuserData.job" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="姓名：" prop="fullname">
                        <el-input v-model="formuserData.fullname" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="邮箱：" prop="email">
                        <el-input v-model="formuserData.email" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="状态：" prop="status">
                        <el-radio v-model="formuserData.status" label="0">禁用</el-radio>
                        <el-radio v-model="formuserData.status" label="1">启用</el-radio>
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
                        <el-button type="primary" @click="addUserSubmit('formuserData')">提交</el-button>
                        <el-button @click="cancelAdd('userAddShow')">取消</el-button>
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
        uploadUrl:this.$axios.defaults.basePath+'/image/AliYunImgUpload',  
        formInline: {
          user: '',
          region: ''
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
          name:''
        },
        searchButton:'',
        multipleSelection:[],
        ids:'',
        detailsShow:false,
        userAddShow:false,
        detailsTitle:'',
        detailsData:{},
        companyData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        dialogTitle: '',            
        addShow:false,
        formData:{
            name:'',
            address:'',
            desc:'',
            lvlCd:'',
            mobile:'',
            modifyBy:'',
            parentId:'',
            parentKey:'',
            status:'',
            type:'',

        },
        formuserData:{
            username:'',
            password:'',
            orgId:'',
            mobile: '',
            job: '',
            fullname: '',
            email: '',
            status:'1',
        },
        dynamicValidateForm: {
          domains: [{
            value: ''
          }],
          email: ''
        },
        imgArr:[
            {
                url:'',
            }
        ],
      }
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
                this.$axios.get(_this.$axios.defaults.basePath+'/sysOrg/selectPage',{
                  params:{            
                    current:page,
                    size:rows,
                  }
                }).then(function (res) {
                    console.log(res);
                    _this.tableData = res.data.records;
                    _this.pagesData.total = res.data.total;
                })
            },

            //搜索操作
            searchSubmit() {
              var _this = this;
                this.$axios.get(_this.$axios.defaults.basePath+'/sysOrg/selectPage',{
                  params:{            
                     name:_this.searchForm.name,
                     current:1,
                     size:_this.pagesData.currentRows,
                  }
                }).then(function (res) {
                    console.log(res);
                    _this.tableData = res.data.records;
                    _this.pagesData.total = res.data.total;
                })
            },
            //表单重置
            resetForm(formName) {
                this.$refs[formName].model.name ='';
            },

            //详情
            handleDetails(name,id){
              this.companyData = [];
              this.detailsTitle = name;
              var _this = this;
                this.$axios.get(_this.$axios.defaults.basePath+'/sysOrg/info',{
                  params:{            
                     orgId: id
                  }
                }).then(function (res) {
                    _this.detailsData = res.data[0];
                    //获取树结构数据
                    console.log( _this.detailsData)
                    if(res.data[0].childs != ''){
                        res.data[0].childs.forEach((item) => {
                        
                        _this.children = [];
                        var aa = item['childs'];
                            aa.forEach((val) => {
                            
                                var powers = [];
                                    var bb = val['childs'];
                                    bb.forEach((v) =>{
                                        powers.push({
                                            id:v['id'],
                                            label:v['name'],
                                        })
                                        
                                    });
                                
                                _this.children.push({
                                    id:val['id'],
                                    label: val['name'],
                                    children:powers,
                                });
                            });
                            _this.companyData.push({
                                    id: item['id'],
                                    label: item['name'],
                                    children:_this.children
                                });
                        
                            _this.detailsShow = true;
                        });
                    } 
                    console.log(res.data);
                })
            },

            //添加公司
            addDomain() {
              this.dynamicValidateForm.domains.push({
                value: '',
                key: Date.now()
              });
            },
            removeDomain(item) {
              var index = this.dynamicValidateForm.domains.indexOf(item)
              if (index !== -1) {
                this.dynamicValidateForm.domains.splice(index, 1)
              }
            },
            //添加
            handleAdd() {
                this.addShow = true;
                this.dialogTitle = '添加机构';
            },
            //编辑
            handleEdit(row){
                this.addShow = true;
                this.formData = row;
                this.id = row.id;
                this.dialogTitle = '编辑机构';
                this.imgArr[0].url = row.icon;
            },
            handleSubmit() {
                var _this = this;
                if(_this.dialogTitle == '添加机构'){
                    console.log(_this.dynamicValidateForm.domains)
                    this.$axios({
                        url:_this.$axios.defaults.basePath+'/sysOrg/add',
                        method:'POST',
                        headers:{
                            'Content-Type':'application/json'
                        },
                        data:JSON.stringify({
                            name:_this.formData.name,
                            desc:_this.formData.desc,
                            address:_this.formData.address,
                            mobile:_this.formData.mobile,
                            type:_this.formData.type,
                            parentId:_this.formData.parentId,
                            lvlCd:_this.formData.lvlCd,
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
                        url:_this.$axios.defaults.basePath+'/sysOrg/update',
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
                
                
            },


            handleNodeClick(data) {
              console.log(data);
            },
            cancelAdd(s){
              this[s] = false;
            },


            handleSelectionChange(val) {
                var _this = this;
                _this.ids = '';
                _this.multipleSelection = val;
                _this.multipleSelection.forEach(item => {
                    _this.ids += item.id + ',';
                });
                
            },

            //删除机构操作
            handleDel() {
                var _this = this;
                _this.ids = _this.ids.substr(0, _this.ids.length - 1); 
                _this.roleId = _this.ids.split(',');
                //return false;
                if(_this.ids == ''){
                    _this.$message.error('请选择要删除的内容');
                    return false;
                }else{
                    _this.$confirm('此操作将永久删除该机构, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                             var _this = this;
                            _this.$axios({
                                url:_this.$axios.defaults.basePath+'/sysOrg/delete?ids='+_this.roleId,
                                method:'POST',
                                headers:{
                                    'Content-Type':'application/json'
                                },
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
                        }).catch(() => {
                            _this.$message({
                            type: 'info',
                            message: '已取消删除'
                        });          
                    });
                }
            },

            //上传图片事件
            handleAvatarSuccess(res, file){
                console.log(file);
                this.formuserData.icon = file.response.data;
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

            handleUser() {
                this.userAddShow = true;
            },

            addUserSubmit() {
                var _this = this;
                
                    this.$axios({
                        url: _this.$axios.defaults.basePath+'/users/add',
                        method:'POST',
                        headers:{
                            'Content-Type':'application/json'
                        },
                        data: JSON.stringify({
                            username:_this.formuserData.username,
                            password:_this.formuserData.password,
                            icon:_this.formuserData.icon,
                            orgId:_this.formuserData.orgId,
                            status:parseInt(_this.formuserData.status),
                            mobile:_this.formuserData.mobile,
                            job:_this.formuserData.job,
                            fullname:_this.formuserData.fullname,
                            email:_this.formuserData.email        
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


      
    },
    created(){

            //获取列表数据
            var _this = this;
            this.$axios.get(_this.$axios.defaults.basePath+'/sysOrg/selectPage',{
              params:{            
                current:1,
                size:_this.pagesData.currentRows,
              }
            }).then(function (res) {
                console.log(res);
                _this.tableData = res.data.records;
                _this.pagesData.total = res.data.total;
            })
    },
        
  }
</script>
<style lang="scss" scoped>

</style>