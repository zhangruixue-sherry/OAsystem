<template>
<div>
    <div class="pageMain">
                        <div class="userTable boxMain">
                            <p class="boxTitle"><el-button size="mini"  type="primary" icon="el-icon-arrow-left" @click="$router.push({ path: '/procurement/list', })">返回列表</el-button></p>
                            <template>
                                <el-table
                                        :data="tableData"
                                        style="width: 100%;">
                                    <el-table-column
                                            prop="id"
                                            label="采购单详情id"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="procurementId"
                                            label="采购单id"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="name"
                                            label="名称"
                                    >
                                    </el-table-column>
                                    
                                    <el-table-column
                                            prop="num"
                                            label="数量"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="unit"
                                            label="单位"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="size"
                                            label="规格"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="created"
                                            label="时间"
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
                tableData:[],
                tabWidth:200,
                //分页数据
                pagesData:{
                    total:0,
                    currentPage:1,
                    currentRows:10,
                    rows:[10, 20, 30, 40],
                },
            }
        },
        created () {
            var _this = this;
            //获取付款单列表
                this.$axios.get(_this.$axios.defaults.basePath+'/procurement/getDetails',{
                  params:{   
                     procurementId:this.$route.query.id,
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
                this.$axios.get(_this.$axios.defaults.basePath+'/procurement/getDetails',{
                  params:{   
                     procurementId:this.$route.query.id,               
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
        },
    };

</script>
