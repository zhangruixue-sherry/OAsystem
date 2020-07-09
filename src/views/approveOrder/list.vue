<template>
<div>
    <div class="pageMain">
        <el-form :model="searchForm" :inline="true" ref="searchForm" label-position="left" class="demo-form-inline">
                        <el-form-item label="审批类型">
                            <el-select v-model="searchForm.type" placeholder="请选择类型">
                                <el-option v-for="(item,index) in type" :key="index" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="审批状态">
                            <el-select v-model="searchForm.status" placeholder="请选择类型">
                                <el-option v-for="(item,index) in status" :key="index" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchSubmit('searchForm')">查询</el-button>
                            <el-button @click="resetForm('searchForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                        <div class="userTable boxMain">
                            <p class="boxTitle">审批单列表</p>
                            <template>
                                <el-table
                                        :data="tableData"
                                        style="width: 100%;">
                                    <el-table-column
                                            prop="id"
                                            label="审批单编号"
                                            width="100"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="approveType"
                                            label="审批单类型"
                                    >
                                    <template slot-scope="scope">
                                        <p>{{scope.row.approveType | approveType}}</p>
                                    </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="approveDetails"
                                            label="审批流程"
                                    >
                                    <template slot-scope="scope">
                                        <el-steps  :active="1" finish-status="finish" align-center>
                                            <el-step :title="item.username" :description="item.job" v-for="(item,index) in scope.row.approveDetails" :key="index"></el-step>
                                        </el-steps>
                                    </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="approvePresent"
                                            label="当前审批"
                                    >
                                    <template slot-scope="scope">
                                        <p>{{scope.row.approvePresent.job}}</p>
                                    </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="copyPerson"
                                            label="抄送"
                                    >
                                    <template slot-scope="scope">
                                        <el-steps  :active="1" finish-status="finish" align-center>
                                            <el-step :title="item.username" :description="item.job" v-for="(item,index) in scope.row.copyPerson" :key="index"></el-step>
                                        </el-steps>
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
                    type: '',
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
                type:[
                    {
                        id:1,
                        text:'付款申请'
                    },{
                        id:2,
                        text:'报销申请'
                    },{
                        id:3,
                        text:'用章申请'
                    },{
                        id:4,
                        text:'借款申请'
                    },{
                        id:5,
                        text:'预算审批'
                    },{
                        id:6,
                        text:'采购申请'
                    },{
                        id:7,
                        text:'加班申请'
                    },{
                        id:8,
                        text:'请假申请'
                    },{
                        id:9,
                        text:'补卡申请'
                    },{
                        id:10,
                        text:'外勤申请'
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
            //获取审批单列表
                this.$axios.get(_this.$axios.defaults.basePath+'/approveOrder/getList',{
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
                        resData.data.records.forEach((item)=>{
                            item.approveDetails = JSON.parse(item.approveDetails);
                            item.copyPerson = JSON.parse(item.copyPerson);
                        })
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
                this.$axios.get(_this.$axios.defaults.basePath+'/approveOrder/getList',{
                  params:{                
                     type:_this.searchForm.type,
                     status:_this.searchForm.status,
                     current:page,
                     size:rows,
                  }
                }).then(function (res) {
                    var resData = res.data;
                        console.log(resData);
                        resData.data.records.forEach((item)=>{
                            item.approveDetails = JSON.parse(item.approveDetails);
                            item.approvePresent = JSON.parse(item.approvePresent);
                            item.copyPerson = JSON.parse(item.copyPerson);
                        })
                        _this.tableData = resData.data.records;
                        _this.pagesData.total = resData.data.total;
                })
            },
            //搜索操作
            searchSubmit() {
                var _this = this;
                this.$axios.get(_this.$axios.defaults.basePath+'/approveOrder/getList',{
                  params:{        
                     type:_this.searchForm.type,
                     status:_this.searchForm.status,
                     current:1,
                     size:_this.pagesData.currentRows,
                  }
                }).then(function (res) {
                    var resData = res.data;
                        console.log(resData);
                        resData.data.records.forEach((item)=>{
                            item.approveDetails = JSON.parse(item.approveDetails);
                            item.approvePresent = JSON.parse(item.approvePresent);
                            item.copyPerson = JSON.parse(item.copyPerson);
                        })
                        _this.tableData = resData.data.records;
                        _this.pagesData.total = resData.data.total;
                })
            },

            //表单重置
            resetForm(formName) {
                this.$refs[formName].model.type = '',
                this.$refs[formName].model.status ='';
            },
        },
        filters: {
            approveType(value) {
                if (value === 1) {
                    return '付款申请';
                } else if (value === 2) {
                    return '报销申请';
                } else if (value === 3) {
                    return '用章申请';
                } else if (value === 4) {
                    return '借款申请';
                } else if (value === 5) {
                    return '预算审批';
                } else if (value === 6) {
                    return '采购申请';
                } else if (value === 7) {
                    return '加班申请';
                } else if (value === 8) {
                    return '请假申请';
                } else if (value === 9) {
                    return '补卡申请';
                } else if (value === 10) {
                    return '外勤申请';
                } 
            },
        }
    };

</script>
