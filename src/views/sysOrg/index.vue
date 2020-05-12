<template>
    <div class="pageMain">
        <el-form :inline="true" :model="formInline" class="demo-form-inline">
        <el-form-item label="机构名称">
            <el-input v-model="formInline.user"></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="onSubmit">查询</el-button>
        </el-form-item>
        </el-form>
        <div class="boxMain">
            <p class="boxTitle">机构列表</p>
            <div class="tableTopBtn clearfix" style="padding: 15px;">
                <el-button size="small" type="primary">添加</el-button>
            </div>
            <template>
                <el-table
                :data="tableData"
                style="width: 100%">
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
                    prop="address"
                    label="地址">
                </el-table-column>
                <el-table-column align="center" width="210" label="操作">
                    <template>
                    <el-button size="mini" type="primary" >详情</el-button>
                    <el-button size="mini" type="primary" >编辑</el-button>
                    <el-button size="mini" type="primary" >删除</el-button>
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
</template>
<script>
  export default {
    data() {
      return {
        formInline: {
          user: '',
          region: ''
        },
        tableData: [],
        //分页数据
                pagesData:{
                    total:'',
                    currentPage:1,
                    currentRows:10,
                    rows:[10, 20, 30, 40],
                },
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!');
      },
      handleSizeChange(val) {
        console.log(`每页 ${val} 条`);
      },
      handleCurrentChange(val) {
        console.log(`当前页: ${val}`);
      },
      
    },
    created(){
            var _this = this;
            this.$axios.get(_this.$axios.defaults.basePath+'/sysOrg/selectPage',{
              params:{            
                current:'1',
                size:'10'
              }
            }).then(function (res) {
                console.log(res.data.data.records);
                _this.tableData = res.data.data.records;
                _this.pagesData.total = res.data.data.total;
            })
        },
        
  }
</script>
<style lang="scss" scoped>

</style>