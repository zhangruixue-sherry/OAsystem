<template>
<div>
    <div class="pageMain">
        <el-form :model="searchForm" :inline="true" ref="searchForm" label-position="left" class="demo-form-inline">
                        <el-form-item label="标题">
                            <el-input v-model="searchForm.name" placeholder="请输入部门"></el-input>
                        </el-form-item>
                        <el-form-item label="状态">
                            <el-select v-model="searchForm.status" placeholder="请选择状态">
                                <el-option v-for="(item,index) in status" :key="index" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="类型">
                            <el-select v-model="searchForm.type" placeholder="请选择公告类型">
                                <el-option v-for="(item,index) in type" :key="index" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchSubmit('searchForm')">查询</el-button>
                            <el-button @click="resetForm('searchForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                        <div class="userTable boxMain">
                            <p class="boxTitle">公告列表</p>
                            <div class="tableTopBtn clearfix" style="padding: 15px;">
                                <el-button size="mini" type="primary" @click="handleAdd"><i class="el-icon-plus"></i>添加</el-button>
                            </div>
                            <template>
                                <el-table
                                        :data="tableData"
                                        style="width: 100%;">
                                    <el-table-column
                                            prop="id"
                                            label="ID"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="title"
                                            label="标题"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="content"
                                            label="内容"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                        prop="status"
                                        width="80"
                                        label="状态">
                                        <template slot-scope="scope">
                                            <p v-if="scope.row.status == 1" style="color:#67c23a;">已发布</p>
                                            <p v-else-if="scope.row.status == -1" style="color:#f56c6c;">已撤回</p>
                                            <p v-else style="color:#409eff;">待发布</p>
                                        </template>
                                    </el-table-column>
                                    <el-table-column
                                        prop="type"
                                        width="80"
                                        label="类型">
                                        <template slot-scope="scope">
                                            <p v-if="scope.row.type == 1" style="color:#67c23a;">通知</p>
                                            <p v-else-if="scope.row.type == 2" style="color:#f56c6c;">通报</p>
                                        </template>
                                    </el-table-column>
                                    <el-table-column align="center" width="230" label="操作">
                                        <template slot-scope="scope">
                                            <el-button size="mini" type="primary" @click="handleDetails(scope.row.id)">详情</el-button>
                                            <el-button size="mini" type="primary" @click="handleEdit(scope.row)">编辑</el-button>
                                            <el-button size="mini" type="danger" v-if="scope.row.status == 1" @click="handleDelete(scope.row.id)">撤回</el-button>
                                            <el-button size="mini" type="danger" v-if="scope.row.status == 0" @click="handlePublish(scope.row.id)">发布</el-button>
                                            <el-button size="mini" type="danger" v-if="scope.row.status == -1" disabled>已撤回</el-button>
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
    <!--添加/编辑公告-->
    <div class="alertEvent addPost" v-show="addShow" >
        <div class="alertMsg" @click="cancelAdd('addShow')"></div>
        <div class="alertMain" style="width: 60%">
            <div class="alertTitle clearfix">
                <p class="float_lf">{{dialogTitle}}</p>
                <img class="float_rt" src= "../../assets/img/del_icon.png" alt="" @click="cancelAdd('addShow')">
            </div>
            <div class="postForm">
                <el-form :model="formData" :inline="true" ref="formData" label-width="140px" class="demo-ruleForm">
                    <el-form-item label="标题：" prop="title">
                        <el-input v-model="formData.title" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="内容：" prop="content">
                        <el-input v-model="formData.content" style="width: 300px;" type="textarea"></el-input>
                    </el-form-item>
                    <el-form-item label="类型：" prop="type">
                        <el-radio v-model="formData.status" label="1">通知</el-radio>
                        <el-radio v-model="formData.status" label="2">通报</el-radio>
                    </el-form-item>
                    <el-form-item label="公告图片：" prop="img" style="display: block;" v-if="dialogTitle == '添加公告'">
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
                    <el-form-item label="公告图片：" prop="img" style="display: block;" v-else-if="dialogTitle == '编辑公告'">
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
    <!--公告详情-->
    <div class="alertEvent addPost" v-show="detailsShow" >
        <div class="alertMsg" @click="cancelAdd('detailsShow')"></div>
        <div class="alertMain"> 
            <div class="alertTitle clearfix">
                <p class="float_lf">公告详情</p>
                <img class="float_rt" src= "../../assets/img/del_icon.png" alt="" @click="cancelAdd('detailsShow')">
            </div>
            <div class="postForm">
                <div class="detailsItem clearfix">
                    <p class="float_lf">ID : </p>
                    <p class="float_lf">{{detailsData.id}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">标题：</p>
                    <p class="float_lf">{{detailsData.title}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">内容：</p>
                    <p class="float_lf">{{detailsData.content}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">公告类型：</p>
                    <p class="float_lf" v-if="detailsData.type == 1">通知</p>
                    <p class="float_lf" v-if="detailsData.type == 2">通报</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">图片：</p>
                    <img width="200px" :src="detailsData.img"/>
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
                isCollapse: false,
                addShow:false,
                detailsShow:false,
                dialogTitle:'',
                uploadUrl:'http://39.99.175.166:9000/admin/image/AliYunImgUpload',
                //搜索
                searchForm:{
                    name: '',
                    status:'',
                    type:'',
                    
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
                formLabelWidth: '100px',
                detailsData:[],
                id:'',
                formData:{ 
                    title:'',
                    content:'',
                    type:'',
                    img:'',
                },
                status:[
                    {
                        id:0,
                        text:'待发布'
                    },{
                        id:1,
                        text:'已发布'
                    },{
                        id:-1,
                        text:'撤回'
                    },
                ],
                type:[
                    {
                        id:1,
                        text:'通知'
                    },{
                        id:2,
                        text:'通报'
                    }
                ],
                //上传回显图片
                imgArr:[
                    {
                        url:'',
                    }
                ],
            }
        },
        created () {
            var _this = this;
            //获取薪资列表
                this.$axios.get(_this.$axios.defaults.basePath+'/notice',{
                  params:{   
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
                this.$axios.get(_this.$axios.defaults.basePath+'/notice',{
                  params:{            
                     name:_this.searchForm.name,     
                     status:_this.searchForm.status,
                     type:_this.searchForm.type,
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
                this.$axios.get(_this.$axios.defaults.basePath+'/notice',{
                  params:{        
                     name:_this.searchForm.name,     
                     status:_this.searchForm.status,
                     type:_this.searchForm.type,
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
                this.$refs[formName].model.name = ''
                this.$refs[formName].model.status = ''
                this.$refs[formName].model.type = ''
            },
            handleAdd() {
                this.addShow = true;
                this.dialogTitle = '添加公告';
            },
            handleEdit(row){
                this.addShow = true;
                this.formData = row;
                this.id = row.id;
                this.dialogTitle = '编辑公告';
                this.imgArr[0].url = row.img;
            },
            handleSubmit() {
                var _this = this;
                if(_this.dialogTitle == '添加公告'){
                    this.$axios({
                        url:_this.$axios.defaults.basePath+'/notice/add',
                        method:'POST',
                        headers:{
                            'Content-Type':'application/json'
                        },
                        data:JSON.stringify({
                            title:_this.formData.title,
                            content:_this.formData.content,
                            type:_this.formData.type,
                            img:_this.formData.img,
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
                        url:_this.$axios.defaults.basePath+'/notice/update',
                        method:'POST',
                        headers:{
                            'Content-Type':'application/json'
                        },
                        data:JSON.stringify({
                            id:_this.id,
                            title:_this.formData.title,
                            content:_this.formData.content,
                            type:_this.formData.type,
                            img:_this.formData.img,
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
                this.$axios.get(_this.$axios.defaults.basePath+'/notice/info',{
                  params:{            
                     noticeId: id
                  }
                }).then(function (res) {
                    var resData = res.data
                    console.log(res)
                    if(resData.errcode == 0){
                            _this.detailsShow = true;
                            _this.detailsData = resData.data;
                        }
                })
            },

            //撤回公告操作方法
            handleDelete(id) {
                var _this = this;
                _this.$confirm('是否确定撤回此公告?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                            this.$axios({
                            url:_this.$axios.defaults.basePath+'/notice/delete?ids='+id,
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
                            message: '已取消撤回'
                        });          
                    });
            },

            //发布公告操作方法
            handlePublish(id) {
                var _this = this;
                _this.$confirm('是否确定发布此公告?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                            this.$axios({
                            url:_this.$axios.defaults.basePath+'/notice/publish?id='+id,
                            method:'POST',
                            headers:{
                                'Content-Type':'application/json'
                            },
                        }).then(function (res) {
                                console.log(res);
                                    if(res.errcode == 0){
                                        _this.$message({
                                            message:'发布成功',
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
                            message: '已取消发布'
                        });          
                    });
            },

            //上传图片事件
            handleAvatarSuccess(res, file){
                console.log(file);
                this.formData.img = file.response.data;
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

        },
    };

</script>
