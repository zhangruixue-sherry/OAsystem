<template>
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
                <el-button size="small" type="primary" @click="addShow = true">添加</el-button>
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
                <el-table-column align="center" width="210" label="操作">
                    <template slot-scope="scope">
                    <el-button size="mini" type="primary" @click="handleDetails(scope.row.name,scope.row.id)">详情</el-button>
                    <el-button size="mini" type="primary" >编辑</el-button>
                    <el-button size="mini" type="danger" >删除</el-button>
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
                    <p class="float_lf">添加新机构</p>
                    <img class="float_rt" src= "../../assets/img/del_icon.png" alt="" @click="cancelAdd('addShow')">
                </div>
                <div class="postForm">
                    <el-form :model="formData" :inline="true" :rules="roleRules" ref="formData" label-width="100px" class="demo-ruleForm">
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
                            <el-button type="primary" @click="handleAdd('formData')">提交</el-button>
                            <el-button @click="cancelAdd('addShow')">取消</el-button>
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
        //搜索
        searchForm:{
          name:''
        },
        searchButton:'',

        detailsShow:false,
        detailsTitle:'',
        detailsData:{},
        companyData: [],
        defaultProps: {
          children: 'children',
          label: 'label'
        },

        
        addShow:false,
        formData:{

        },
        dynamicValidateForm: {
          domains: [{
            value: ''
          }],
          email: ''
        }
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
                    res.data[0].childs.forEach((item, index) => {
                    
                    _this.children = [];
                    var aa = item['childs'];
                    aa.forEach((val, key) => {
                       
                        var powers = [];
                            var bb = val['childs'];
                            bb.forEach((v,k) =>{
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
            handleAdd(){

            },


            handleNodeClick(data) {
              console.log(data);
            },
            cancelAdd(s){
              this[s] = false;
            }
      
    },
    created(){
            //获取列表数据
            var _this = this;
            this.$axios.get(_this.$axios.defaults.basePath+'/sysOrg/selectPage',{
              params:{            
                current:'1',
                size:'10'
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