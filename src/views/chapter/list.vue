<template>
<div>
    <div class="pageMain">
        <el-form :model="searchForm" :inline="true" ref="searchForm" label-position="left" class="demo-form-inline" v-if="searchButton == '1'">
                        <el-form-item label="用章日期">
                            <el-date-picker v-model="searchForm.chapterDate" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd"> </el-date-picker>
                        </el-form-item>
                        <el-form-item label="合同类型">
                            <el-select v-model="searchForm.chapterType" placeholder="请选择类型">
                                <el-option v-for="(item,index) in chapterType" :key="index" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="部门名称">
                            <template>
                        <el-select v-model="searchForm.department" placeholder="请选择部门">
                            <el-option-group
                            v-for="group in departmentArr"
                            :key="group.value"
                            :label="group.label">
                            <el-option
                                v-for="item in group.childs"
                                :key="item.value"
                                :label="item.label"
                                :value="item.label">
                            </el-option>
                            </el-option-group>
                        </el-select>
                        </template>
                        </el-form-item>
                        <el-form-item label="文件类型">
                            <el-select v-model="searchForm.fileType" placeholder="请选择文件类型">
                                <el-option v-for="(item,index) in fileType" :key="index" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="用章文件名称">
                            <el-input v-model="searchForm.name" placeholder="请输入文件名"></el-input>
                        </el-form-item>
                        <el-form-item label="项目名称：" prop="projectName">
                            <el-select v-model="searchForm.projectName" placeholder="请选择项目">
                                <el-option
                                        v-for="(item,index) in proList"
                                        :key="index"
                                        :label="item.projectName"
                                        :value="item.projectName">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="用章申请状态">
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
                            <p class="boxTitle">用章申请列表</p>
                            <template>
                                <el-table
                                        :data="tableData"
                                        style="width: 100%;">
                                    <el-table-column
                                            prop="id"
                                            label="合同id"
                                            width="100"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="name"
                                            label="用章文件名"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="num"
                                            label="文件个数"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="fileType"
                                            label="文件类型"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="chapterNo"
                                            label="用章编号"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="chapterType"
                                            label="用章类型"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="chapterDate"
                                            label="用章日期"
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
                                    
                                    <el-table-column
                                            prop="username"
                                            label="经办人"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="status"
                                            label="用章状态"
                                    >
                                    </el-table-column>
                                    
                                    <el-table-column
                                            prop="remark"
                                            label="备注"
                                    >
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
</div>
</template>
<script>
    //vue实例
     export default {
        data () {
            return {
                //搜索
                searchForm:{
                    chapterDate: '',
                    chapterType:'',
                    department: '',
                    fileType:'',
                    name:'',
                    projectName:'',
                    status:'',
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
                chapterType:[
                    {
                        id:1,
                        text:'公章'
                    },{
                        id:2,
                        text:'合同章'
                    },{
                        id:3,
                        text:'营业执照'
                    },{
                        id:4,
                        text:'财务章'
                    },{
                        id:5,
                        text:'法人章'
                    },{
                        id:6,
                        text:'其他'
                    }
                ],

                fileType:[
                    {
                        id:1,
                        text:'公告类'
                    },{
                        id:2,
                        text:'规章制度类'
                    },{
                        id:3,
                        text:'合同类'
                    },{
                        id:4,
                        text:'其他'
                    }
                ],

                status:[
                    {
                        id:0,
                        text:'已提交'
                    },{
                        id:1,
                        text:'通过'
                    },{
                        id:2,
                        text:'拒绝'    
                    }
                ],
                departmentArr:[],
                proList:[],
                searchButton:'',
            }
        },
        created () {
            var _this = this;
            //获取用章申请列表
                this.$axios.get(_this.$axios.defaults.basePath+'/chapter/getList',{
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
            privilege.forEach((item, index) => {
                if(item.authority == 'chapter_query'){
                    this.searchButton = '1'
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
                this.$axios.get(_this.$axios.defaults.basePath+'/chapter/getList',{
                  params:{            
                     chapterDate:_this.searchForm.chapterDate,     
                     chapterType:_this.searchForm.chapterType,
                     department: _this.searchForm.department,
                     fileType: _this.searchForm.fileType,
                     name:_this.searchForm.name,
                     projectName:_this.searchForm.projectName,
                     status:_this.searchForm.status,
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
                this.$axios.get(_this.$axios.defaults.basePath+'/chapter/getList',{
                  params:{        
                     chapterDate:_this.searchForm.chapterDate,     
                     chapterType:_this.searchForm.chapterType,
                     department: _this.searchForm.department,
                     fileType: _this.searchForm.fileType,
                     name:_this.searchForm.name,
                     projectName:_this.searchForm.projectName,
                     status:_this.searchForm.statu,
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
                this.$refs[formName].model.chapterDate = '',
                this.$refs[formName].model.chapterType ='';
                this.$refs[formName].model.department ='';
                this.$refs[formName].model.fileType ='';
                this.$refs[formName].model.name ='';
                this.$refs[formName].model.projectName ='';
                this.$refs[formName].model.status ='';
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
    };

</script>
