<template>
<div>
    <div class="pageMain">
        <el-form :model="searchForm" :inline="true" ref="searchForm" label-position="left" class="demo-form-inline"  v-if="searchButton == '1'">
                        <el-form-item label="合同类型">
                            <el-select v-model="searchForm.contractType" placeholder="请选择类型">
                                <el-option v-for="(item,index) in contractType" :key="index" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="合同名">
                            <el-input v-model="searchForm.name" placeholder="请输入合同名"></el-input>
                        </el-form-item>
                        <el-form-item label="项目：" prop="projectId">
                            <el-select v-model="searchForm.projectId" placeholder="请选择项目" @change="projectChange">
                                <el-option
                                        v-for="(item,index) in proList"
                                        :key="index"
                                        :label="item.projectName"
                                        :value="item.id">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="签署单位">
                            <el-input v-model="searchForm.sign" placeholder="请输入签署单位"></el-input>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="searchSubmit('searchForm')">查询</el-button>
                            <el-button @click="resetForm('searchForm')">重置</el-button>
                        </el-form-item>
                    </el-form>
                        <div class="userTable boxMain">
                            <p class="boxTitle">合同列表</p>
                            <div class="tableTopBtn clearfix" style="padding: 15px;">
                                <el-button size="mini" type="primary" @click="handleAdd" v-if="addButton == '1'"><i class="el-icon-plus"></i>添加</el-button>
                            </div>
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
                                            prop="contractName"
                                            label="合同名称"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="contractType"
                                            label="类型"
                                    >
                                    <template slot-scope="scope">
                                        <p>{{scope.row.contractType | contractType}}</p>
                                    </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="projectName"
                                            label="项目名称"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="amount"
                                            label="金额"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="address"
                                            label="对方地址"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="owner"
                                            label="甲方"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="ownerName"
                                            label="甲方负责人"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="power"
                                            label="乙方"
                                    >
                                    </el-table-column>
                                    
                                    <el-table-column
                                            prop="powerName"
                                            label="乙方负责人"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="effectiveDate"
                                            label="生效时间"
                                    >
                                    </el-table-column>
                                    
                                    <el-table-column
                                            prop="endDate"
                                            label="截止日期"
                                    >
                                    </el-table-column>
                                    <el-table-column align="center" width="160" label="操作">
                                        <template slot-scope="scope">
                                            <el-button size="mini" type="primary" @click="handleDetail(scope.row)">详情</el-button>
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
    <!--修改合同内容-->
    <div class="alertEvent addPost" v-show="addShow" >
        <div class="alertMsg" @click="cancelAdd('addShow')"></div>
        <div class="alertMain" style="width: 60%">
            <div class="alertTitle clearfix">
                <p class="float_lf">添加合同</p>
                <img class="float_rt" src= "../../assets/img/del_icon.png" alt="" @click="cancelAdd('addShow')">
            </div>
            <div class="postForm">
                <el-form :model="formData" :inline="true" :rules="rules" ref="formData" label-width="140px" class="demo-ruleForm">
                    <el-form-item label="项目名称：" prop="projectId">
                        <el-select v-model="formData.projectId" placeholder="请选择项目" style="width: 300px;" @change="projectChange">
                            <el-option
                                    v-for="(item,index) in proList"
                                    :key="index"
                                    :label="item.projectName"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="合同名称：" prop="contractName">
                        <el-input v-model="formData.contractName" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="合同类型：" prop="contractType">
                        <el-select v-model="formData.contractType" placeholder="请选择类型" style="width: 300px;">
                                <el-option v-for="(item,index) in contractType" :key="index" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                    </el-form-item>
                    <el-form-item label="合同金额：" prop="amount">
                        <el-input v-model="formData.amount" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="对方地址：" prop="address">
                        <el-input v-model="formData.address" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="生效时间：" prop="effectiveDate">
                        <el-date-picker v-model="formData.effectiveDate" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" style="width: 300px;"> </el-date-picker>
                    </el-form-item>
                    <el-form-item label="截止日期：" prop="endDate">
                        <el-date-picker v-model="formData.endDate" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" style="width: 300px;"> </el-date-picker>
                    </el-form-item>
                    <el-form-item label="甲方名称：" prop="owner">
                        <el-input v-model="formData.owner" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="甲方负责人：" prop="ownerName">
                        <el-input v-model="formData.ownerName" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="乙方名称：" prop="power">
                        <el-input v-model="formData.power" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="乙方负责人：" prop="powerName">
                        <el-input v-model="formData.powerName" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="签署单位：" prop="sign">
                        <el-input v-model="formData.sign" style="width: 300px;"></el-input>
                    </el-form-item>
                    <el-form-item label="签署日期：" prop="signDate">
                        <el-date-picker v-model="formData.signDate" type="datetime" placeholder="选择日期时间" value-format="yyyy-MM-dd HH:mm:ss" style="width: 300px;"> </el-date-picker>
                    </el-form-item>
                    <el-form-item label="备注：" prop="remark">
                        <el-input v-model="formData.remark" style="width: 300px;" type="textarea"></el-input>
                    </el-form-item>
                    <el-form-item label="附件：" prop="contractFile">
                        <el-upload
                                :action="uploadUrl"
                                multiple
                                :on-preview="handlePreview"
                                :on-success="handleAvatarSuccess"
                                :on-remove="handleRemove">
                            <el-button size="small" type="primary">点击上传</el-button>
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
    <!--合同详情-->
    <div class="alertEvent addPost" v-show="detailsShow" >
        <div class="alertMsg" @click="cancelAdd('detailsShow')"></div>
        <div class="alertMain"> 
            <div class="alertTitle clearfix">
                <p class="float_lf">合同详情</p>
                <img class="float_rt" src= "../../assets/img/del_icon.png" alt="" @click="cancelAdd('detailsShow')">
            </div>
            <div class="postForm">
                <div class="detailsItem clearfix">
                    <p class="float_lf">合同ID : </p>
                    <p class="float_lf">{{detailsData.id}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">合同名称：</p>
                    <p class="float_lf">{{detailsData.contractName}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">合同类型：</p>
                    <p class="float_lf">{{detailsData.contractType}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">合同金额：</p>
                    <p class="float_lf">{{detailsData.amount}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">项目ID：</p>
                    <p class="float_lf">{{detailsData.projectId}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">项目名称：</p>
                    <p class="float_lf">{{detailsData.projectName}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">创建时间：</p>
                    <p class="float_lf">{{detailsData.created}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">生效时间：</p>
                    <p class="float_lf">{{detailsData.effectiveDate}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">截止日期：</p>
                    <p class="float_lf">{{detailsData.endDate}}</p>
                </div>

                <div class="detailsItem clearfix">
                    <p class="float_lf">甲方名称：</p>
                    <p class="float_lf">{{detailsData.owner}}</p>
                </div>

                <div class="detailsItem clearfix">
                    <p class="float_lf">甲方负责人：</p>
                    <p class="float_lf">{{detailsData.ownerName}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">乙方名称：</p>
                    <p class="float_lf">{{detailsData.power}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">乙方负责人：</p>
                    <p class="float_lf">{{detailsData.powerName}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">签署单位：</p>
                    <p class="float_lf">{{detailsData.sign}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">签署日期：</p>
                    <p class="float_lf">{{detailsData.signDate}}</p>
                </div>
                <div class="detailsItem clearfix">
                    <p class="float_lf">备注：</p>
                    <p class="float_lf">{{detailsData.remark}}</p>
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
                addShow: false,
                detailsShow: false,
                uploadUrl:'http://39.99.175.166:9000/admin/image/AliYunImgUpload',
                //搜索
                searchForm:{
                    contractType: '',
                    name:'',
                    projectId: '',
                    sign:'',
                    
                },
                contractType:[
                    {
                        id:1,
                        text:'工程'
                    },{
                        id:2,
                        text:'运维'
                    },{
                        id:3,
                        text:'三方'
                    },{
                        id:4,
                        text:'技术外包'
                    }
                ],
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
                formData:{ 
                    contractFile:'',
                    projectId:'',
                    contractName:'',
                    contractType:'',
                    amount:'',
                    address:'',
                    effectiveDate:'',
                    endDate:'',
                    owner:'',
                    ownerName:'',
                    power:'',
                    powerName:'',
                    sign:'',
                    signDate:'',
                },
                fileList:[
                    {
                        url:'',
                    }
                ],
                proList:[],
                rules:{
                    projectId: [
                        { required: true, message: '请选择项目', trigger: 'change' }
                    ],
                    contractName: [
                        { required: true, message: '请填写合同名称', trigger: 'blur' }
                    ],
                    contractType: [
                        { required: true, message: '请选择合同类型', trigger: 'change' }
                    ],
                    amount: [
                        { required: true, message: '请输入合同金额', trigger: 'blur' }
                    ],
                    address: [
                        { required: true, message: '请填写对方地址', trigger: 'blur' }
                    ],
                    effectiveDate: [
                        { required: true, message: '请选择生效时间', trigger: 'change' }
                    ],
                    endDate: [
                        { required: true, message: '请选择截止时间', trigger: 'change' }
                    ],
                    owner: [
                        { required: true, message: '请填写甲方名称', trigger: 'blur' }
                    ],
                    ownerName: [
                        { required: true, message: '请填写甲方负责人', trigger: 'blur' }
                    ],
                    power: [
                        { required: true, message: '请填写乙方名称', trigger: 'blur' }
                    ],
                    powerName: [
                        { required: true, message: '请填写乙方负责人', trigger: 'blur' }
                    ],
                    sign: [
                        { required: true, message: '请填写签署单位名称', trigger: 'blur' }
                    ],
                    signDate: [
                        { required: true, message: '请选择签署时间', trigger: 'change' }
                    ],
                },

                searchButton:'',
                addButton:'',
            }
        },
        created () {
            var _this = this;
            //获取薪资列表
                this.$axios.get(_this.$axios.defaults.basePath+'/contract/getList',{
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

                var privilege = JSON.parse(sessionStorage.getItem('authority'));
                privilege.forEach((item, index) => {
                if(item.authority == 'contract_query'){
                    this.searchButton = '1'
                }else if(item.authority == 'contract_add'){
                    this.addButton = '1'
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
                this.$axios.get(_this.$axios.defaults.basePath+'/contract/getList',{
                  params:{            
                     contractType:_this.searchForm.contractType,     
                     name:_this.searchForm.name,
                     projectId: _this.searchForm.projectId,
                     sign: _this.searchForm.sign,
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
                console.log(fileList)
                var _this = this;
                this.$axios.get(_this.$axios.defaults.basePath+'/contract/getList',{
                  params:{        
                     contractType:_this.searchForm.contractType,     
                     name:_this.searchForm.name,
                     projectId: _this.searchForm.projectId,
                     sign: _this.searchForm.sign,
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
                this.$refs[formName].model.contractType = '',
                this.$refs[formName].model.name ='';
                this.$refs[formName].model.projectId ='';
                this.$refs[formName].model.sign ='';
            },

            //关闭弹框
            cancelAdd(s){
                this.value = [];
                this[s] = false;
            },
            
            handleAdd() {
                this.addShow = true;
            },
            
            //提交操作
            handleSubmit(formData) {
                var _this = this;
                _this.$refs[formData].validate((valid) => {
                    if (valid) {
                        _this.formData.amount = parseInt(_this.formData.amount);
                        _this.formData.contractType = parseInt(_this.formData.contractType);
                        _this.formData.projectId = parseInt(_this.formData.projectId);
                        this.$axios({
                                url:_this.$axios.defaults.basePath+'/contract/add',
                                method:'POST',
                                headers:{
                                    'Content-Type':'application/json'
                                },
                                data:JSON.stringify(_this.formData)
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
                    }else{
                        return false;
                    }
                })
            },

            handleDetail(row) {
                var _this = this;
                this.$axios.get(_this.$axios.defaults.basePath+'/contract/getListDetail',{
                  params:{            
                     id: row.id
                  }
                }).then(function (res) {
                    var resData = res.data
                    if(resData.errcode == 0){
                            _this.detailsShow = true;
                            _this.detailsData = resData.data;
                        }
                })
            },

            handleRemove(file, fileList) {
                console.log(file, fileList);
                this.formData.contractFile = '';
                fileList.forEach((item) => {
                    this.formData.contractFile += item.response.data+','
                })
                //this.formData.contractFile = newArr;
                console.log(this.formData.contractFile)
            },
            handlePreview(file) {
                console.log(file);
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            },
            beforeRemove(file, fileList) {
                        return this.$confirm(`确定移除 ${ file.name }？`);
            },
            handleAvatarSuccess(res, file,fileList){
                console.log(fileList);
                var newArr = new Array();
                fileList.forEach((item) => {
                    this.formData.contractFile += item.response.data+','
                })
                //this.formData.contractFile = newArr;
                console.log(this.formData.contractFile)
            },

            //选择项目
            projectChange(val){
                console.log(val);
                var _this = this;
                var list = this.proList;
                if(val){
                    for(var i=0;i<list.length;i++){
                        if(list[i].id == val){
                            _this.formData.projectName = list[i].projectName;
                        }
                    }
                }
            },
        },
        filters: {
            contractType(value) {
                if (value === 1) {
                    return '工程';
                } else if (value === 2) {
                    return '运维';
                } else if (value === 3) {
                    return '三方';
                } else if (value === 4) {
                    return '技术外包';
                } 
            },
        }
    };

</script>
<style lang="scss" scoped>
.postForm{
            padding: 20px;
            max-height: 800px;
            overflow-y: scroll;
        }
</style>
