<template>
<div>
    <div class="pageMain">
                    <el-form :model="searchForm" :inline="true" ref="searchForm" label-position="left" class="demo-form-inline" v-if="searchButton == '1'">
                        <el-form-item label="绩效部门">
                            <template>
                        <el-select v-model="searchForm.departmentId" placeholder="请选择部门">
                            <el-option-group
                            v-for="group in departmentArr"
                            :key="group.value"
                            :label="group.label">
                            <el-option
                                v-for="item in group.childs"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                            </el-option-group>
                        </el-select>
                        </template>
                        </el-form-item>
                        <el-form-item label="绩效年月">
                            <el-date-picker v-model="searchForm.performanceDate" type="month" placeholder="选择月" format="yyyy-MM" value-format="yyyy-MM"> </el-date-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchSubmit('searchForm')">查询</el-button>
                            <el-button @click="resetForm('searchForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                        <div class="userTable boxMain">
                            <p class="boxTitle">绩效管理列表</p>
                            <template>
                                <div class="tableTopBtn">
                                    <el-button @click="handleAdd" type="primary" class="el-button--mini" v-if="addButton == '1'"><i class="el-icon-plus"></i>添加绩效</el-button>
                                    <el-button size="mini" type="success" @click="exportSub()">导出数据</el-button>
                                </div>
                                <el-table
                                            :data="tableData"
                                            style="width: 100%;">
                                    <el-table-column
                                            prop="id"
                                            label="绩效ID"
                                            width="150"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="department"
                                            label="部门名称"
                                            width="100"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="departmentId"
                                            label="部门ID"
                                            width="100"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="performanceDate"
                                            label="绩效年月"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="remark"
                                            label="备注"
                                    >
                                    </el-table-column>
                                    <el-table-column align="center" width="240" label="操作">
                                        <template slot-scope="scope">
                                            <el-button
                                                    size="mini"
                                                    type="primary" @click="$router.push({
                                                        path: '/performance/detail',
                                                        query: {
                                                        departmentId : scope.row.departmentId,
                                                        performanceDate : scope.row.performanceDate,
                                                        }
                                                    })">详情</el-button>
                                            <el-button size="mini" type="danger" @click="handleDelete(scope.row.id)" v-if="delButton == '1'">删除</el-button>
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
<!--新增绩效-->
    <div class="alertEvent addPost" v-show="addShow" >
        <div class="alertMsg" @click="cancelAdd('addShow')"></div>
        <div class="alertMain" style="width: 60%">
            <div class="alertTitle clearfix">
                <p class="float_lf">添加绩效</p>
                <img class="float_rt" src= "../../assets/img/del_icon.png" alt="" @click="cancelAdd('addShow')">
            </div>
            <div class="postForm">
                <el-form :model="formData" :inline="true" ref="formData" label-width="140px" class="demo-ruleForm">
                    <el-form-item label="部门：">
                        <template>
                        <el-select v-model="value" placeholder="请选择" style="width:300px">
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
                    <el-form-item label="时间：">
                        <el-date-picker v-model="formData.performanceDate" type="month" placeholder="选择月" format="yyyy-MM" value-format="yyyy-MM" style="width: 300px;"> </el-date-picker>
                    </el-form-item>
                    <el-form-item class="postBtn" style="margin-left:95px">
                        <el-button type="primary" @click="addUser()">点击按钮添加人员进行绩效评分</el-button>
                    </el-form-item>
                    <div v-if="formData.userArr !== ''" style="width:400px">
                        <div class="userArr" v-for="(item,index) in formData.userArr" :key="index">
                        <el-form-item>
                            <template>
                                <div class="userInfo">
                                    <div>岗位：{{item.job}}</div>
                                    <div>姓名：{{item.fullname}}</div>
                                    <div>电话：{{item.phone}}</div>
                                </div>
                            </template>
                        </el-form-item>
                        <el-form-item label="评分：">
                            <el-input v-model="item.point" style="width:300px" placeholder="只允许输入数字，最多两位小数" onkeyup="this.value=this.value.replace(/[^\d.]/g,'');"></el-input>
                        </el-form-item>
                        <el-form-item label="备注：">
                            <el-input v-model="item.remark" type="textarea" style="width:300px"></el-input>
                        </el-form-item>
                        </div>    
                    </div>        
                    <el-form-item class="postBtn" style="display: block;text-align: center;">
                        <el-button type="primary" @click="handleSubmit()">提交</el-button>
                        <el-button @click="cancelAdd('addShow')">取消</el-button>
                    </el-form-item>
                </el-form>
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
                //搜索
                searchForm:{
                    departmentId: '',
                    performanceDate:'',
                    
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
                formLabelWidth: '100px',
                detailsData:[],
                id:'',
                addShow: false,
                formData:{
                    department:'',
                    departmentId:'',
                    userArr:[{
                        point:'',
                        remark:'',
                        userId:'',
                    }]
                },
                departmentArr:[],
                childs:[],
                value:'',
                userList:[],
                searchButton:'',
                auditButton:'',
                addButton:'',
                delButton:''

            }
        },
        created () {
            var _this = this;
            //获取绩效列表
                this.$axios.get(_this.$axios.defaults.basePath+'/performance/getList',{
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

            _this.getDepartmentArr();

            var privilege = JSON.parse(sessionStorage.getItem('authority'));
            privilege.forEach((item, index) => {
                if(item.authority == 'performance_update'){
                    this.auditButton = '1'
                }else if(item.authority == 'performance_query'){
                    this.searchButton = '1'
                }else if(item.authority == 'performance_add'){
                    this.addButton = '1'
                }else if(item.authority == 'performance_delete'){
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
                this.$axios.get(_this.$axios.defaults.basePath+'/performance/getList',{
                  params:{            
                     departmentId:_this.searchForm.departmentId,     
                     performanceDate:_this.searchForm.performanceDate,
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
                this.$axios.get(_this.$axios.defaults.basePath+'/performance/getList',{
                  params:{        
                     departmentId:_this.searchForm.departmentId,     
                     performanceDate:_this.searchForm.performanceDate,
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
                this.$refs[formName].model.departmentId = '',
                this.$refs[formName].model.performanceDate ='';
            },

            //关闭弹框
            cancelAdd(s){
                this.value = [];
                this[s] = false;
            },
            //点击添加绩效获取部门数据
            handleAdd() {
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
                this.addShow = true;
            },
            addUser() {
                console.log(this.value)
                var _this = this;
                _this.formData.department = this.value.label
                _this.formData.departmentId = this.value.value
                _this.$axios({
                    url:_this.$axios.defaults.basePath+'/sysOrg/getOrgUserList?id='+_this.formData.departmentId,
                    method:'GET',
                    headers:{
                        'Content-Type':'application/json'
                    },
                }).then(function (res) {
                    _this.formData.userArr = res.data
                 console.log(_this.userArr)
                   
                })
            },

            FloatEvent(val){
                console.log(val)
            },
            
            handleSubmit() {
                var _this = this
                if(_this.formData.userArr !== ''){
                    _this.userList = [];
                    _this.formData.userArr.forEach((item) => {
                        _this.userList.push({
                            job:item['job'],
                            point: item['point'],
                            remark: item['remark'],
                            userId: item['userId'],
                            username: item['username'],
                        });
                    })
                }
                this.$axios({
                        url:_this.$axios.defaults.basePath+'/performance/add',
                        method:'POST',
                        headers:{
                            'Content-Type':'application/json'
                        },
                        data:JSON.stringify({
                            department:_this.formData.department,
                            departmentId:_this.formData.departmentId,
                            performanceDate:_this.formData.performanceDate,
                            userList:_this.userList,
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
                        }else{
                            _this.$message({
                                message: res.data.errmsg,
                                type: 'error'
                            });
                        }
                    })
            },

            handleEdit(row){
                this.addShow = true;
                this.formData = row;
                this.id = row.id;
            },

            handleDelete(id) {
                var _this = this;
                if(id == ''){
                    _this.$message.error('请选择要删除的内容');
                    return false;
                }else{
                    _this.$confirm('此操作将永久删除该绩效数据, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                             var _this = this;
                                _this.$axios({
                                url:_this.$axios.defaults.basePath+'/performance/delete?ids='+id,
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

            //导出提交
            exportSub(){
                var _this = this;
                  _this.$axios.get(_this.$axios.defaults.basePath+'/performance/exportList',{
                  params:{        
                     departmentId:_this.searchForm.departmentId,     
                     performanceDate:_this.searchForm.performanceDate,
                  }        
                }).then(function (res) {
                    console.log(res)
                        var eleLink = document.createElement('a');
                        eleLink.download = '部门绩效.csv';
                        eleLink.style.display = 'none';
                        
                        var BOM = "\uFEFF";
                        var blob = new Blob([BOM + res.data]);
                        eleLink.href = URL.createObjectURL(blob);
                        console.info(blob);
                        // 触发点击
                        document.body.appendChild(eleLink);
                        eleLink.click();
                        _this.exportShow = false;
                        _this.$message({
                            message:'导出成功',
                            type:'success'
                        });

                        // 然后移除
                        document.body.removeChild(eleLink);
                    })
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

<style lang="scss" scoped>
.userInfo{
    margin-left: 50px;
}
.userInfo div{
    float: left;
    width: 150px;
    text-align: center;
    border-right: 1px solid #dddddd;
}
.userInfo div:last-child{
    border: 0px;
}
.userArr{
    border: 1px solid #dddddd;
    margin-left: 95px;
    width: 520px;
    margin-bottom: 30px;
}
.postForm{
            padding: 20px;
            max-height: 800px;
            overflow-y: scroll;
        }
</style>
