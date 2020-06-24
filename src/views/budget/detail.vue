<template>
<div>
    <div class="pageMain">
                        <div class="userTable boxMain">
                            <p class="boxTitle">预算单列表详情</p>
                            <template>
                                <el-table
                                        :data="tableData"
                                        style="width: 100%;">
                                    <el-table-column
                                            prop="id"
                                            label="Id"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="budgetId"
                                            label="预算单id"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="amount"
                                            label="预算费用"
                                    >
                                    </el-table-column>
                                    
                                    <el-table-column
                                            prop="budgetDetails"
                                            label="预算明细"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="budgetType"
                                            label="预算类型"
                                    >
                                    <template slot-scope="scope">
                                        <p>{{scope.row.budgetType | budgetType}}</p>
                                    </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="created"
                                            label="创建时间"
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
                this.$axios.get(_this.$axios.defaults.basePath+'/budget/getDetails',{
                  params:{   
                     budgetId:this.$route.query.id,
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
                this.$axios.get(_this.$axios.defaults.basePath+'/budget/getDetails',{
                  params:{   
                     budgetId:this.$route.query.id,               
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
        filters: {
            budgetType(value) {
                if (value === 1) {
                    return '办公费（办公用品、快递费、软件费、印刷费、证照费）';
                } else if (value === 2) {
                    return '水电费';
                } else if (value === 3) {
                    return '差旅费';
                } else if (value === 4) {
                    return '招待费';
                } else if (value === 5) {
                    return '审计费';
                } else if (value === 6) {
                    return '车辆运行费（加油、其他、修车、保养费）';
                } else if (value === 7) {
                    return '运输费';
                } else if (value === 8) {
                    return '修理费';
                } else if (value === 9) {
                    return '劳保费';
                } else if (value === 10) {
                    return '检测费';
                } else if (value === 11) {
                    return '环保费';
                } else if (value === 12) {
                    return '职工薪酬 （工资、福利费、保险费）';
                } else if (value === 13) {
                    return '总经办费用';
                } else if (value === 14) {
                    return '租赁费';
                } else if (value === 15) {
                    return '电站保险费';
                } else if (value === 16) {
                    return '运维费';
                } else if (value === 17) {
                    return '交通费';
                } else if (value === 18) {
                    return '广告宣传费';
                } else if (value === 19) {
                    return '其他';
                } else if (value === 20) {
                    return '利息支出';
                } else if (value === 21) {
                    return '手续费';
                } 
            },
        }
    };

</script>
