<template>
<div>
    <div class="pageMain">
        <el-form :model="searchForm" :inline="true" ref="searchForm" label-position="left" class="demo-form-inline">
                        <el-form-item label="采购部门">
                            <el-input v-model="searchForm.department" placeholder="请输入采购部门"></el-input>
                        </el-form-item>
                        <el-form-item label="采购项目">
                            <el-input v-model="searchForm.projectName" placeholder="请输入采购项目"></el-input>
                        </el-form-item>
                        <el-form-item label="采购人">
                            <el-input v-model="searchForm.username" placeholder="请输入采购人"></el-input>
                        </el-form-item>
                        <el-form-item label="采购方式">
                            <el-select v-model="searchForm.procurementType" placeholder="请选择采购方式">
                                <el-option v-for="(item,index) in procurementType" :key="index" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="采购单状态">
                            <el-select v-model="searchForm.status" placeholder="请选择采购单状态">
                                <el-option v-for="(item,index) in status" :key="index" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchSubmit('searchForm')">查询</el-button>
                            <el-button @click="resetForm('searchForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                        <div class="userTable boxMain">
                            <p class="boxTitle">采购单列表</p>
                            <template>
                                <el-table
                                        :data="tableData"
                                        style="width: 100%;">
                                    <el-table-column
                                            prop="id"
                                            label="采购单id"
                                            width="100"
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
                                            label="采购人"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="procurementNo"
                                            label="采购单号"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="reason"
                                            label="采购原因"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="procurementType"
                                            label="采购方式"
                                    >
                                    <template slot-scope="scope">
                                        <p>{{scope.row.procurementType | procurementType}}</p>
                                    </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="status"
                                            label="付款单状态"
                                    >
                                    <template slot-scope="scope">
                                        <p>{{scope.row.status | status}}</p>
                                    </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="remark"
                                            label="备注"
                                    >
                                    </el-table-column>
                                    <el-table-column align="center" width="80" label="操作">
                                        <template slot-scope="scope">
                                            <el-button
                                                    size="mini"
                                                    type="primary" @click="$router.push({
                                                        path: '/procurement/detail',
                                                        query: {
                                                        id : scope.row.id,
                                                        }
                                                    })">查看明细</el-button>
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
</div>
</template>
<script>
    //vue实例
     export default {
        data () {
            return {
                //搜索
                searchForm:{
                    department: '',
                    procurementType:'',
                    projectName: '',
                    status:'',
                    username:'',
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
                procurementType:[
                    {
                        id:1,
                        text:'办公用品'
                    },{
                        id:2,
                        text:'工程原料'
                    },{
                        id:3,
                        text:'劳保用品'
                    },{
                        id:4,
                        text:'福利'
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
            }
        },
        created () {
            var _this = this;
            //获取付款单列表
                this.$axios.get(_this.$axios.defaults.basePath+'/procurement/getList',{
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
                this.$axios.get(_this.$axios.defaults.basePath+'/procurement/getList',{
                  params:{                 
                     procurementType:parseInt(_this.searchForm.procurementType),
                     department: _this.searchForm.department,
                     username:_this.searchForm.username,
                     projectName:_this.searchForm.projectName,
                     status:parseInt(_this.searchForm.status),
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
                this.$axios.get(_this.$axios.defaults.basePath+'/procurement/getList',{
                  params:{        
                     procurementType:parseInt(_this.searchForm.procurementType),
                     department: _this.searchForm.department,
                     username:_this.searchForm.username,
                     projectName:_this.searchForm.projectName,
                     status:parseInt(_this.searchForm.status),
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
                this.$refs[formName].model.procurementType ='';
                this.$refs[formName].model.department ='';
                this.$refs[formName].model.username ='';
                this.$refs[formName].model.projectName ='';
                this.$refs[formName].model.status ='';
            },
        },
        filters: {
            procurementType(value) {
                if (value === 1) {
                    return '办公用品';
                } else if (value === 2) {
                    return '工程原料';
                } else if (value === 3) {
                    return '劳保用品';
                } else if (value === 4) {
                    return '福利';
                } 
            },

            status(value) {
                if (value === 0) {
                    return '已提交';
                } else if (value === 1) {
                    return '已通过';
                } else if (value === 2) {
                    return '拒绝';
                } 
            }
        }
    };

</script>
