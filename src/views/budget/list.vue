<template>
<div>
    <div class="pageMain">
        <el-form :model="searchForm" :inline="true" ref="searchForm" label-position="left" class="demo-form-inline" v-if="searchButton == '1'">
            <el-form-item label="预算年月">
                <el-date-picker v-model="searchForm.budgetDate" type="month" value-format="yyyy-MM" placeholder="选择月"> </el-date-picker>
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
            <el-form-item label="制单人">
                <el-input v-model="searchForm.username" placeholder="请输入制单人"></el-input>
            </el-form-item>
            <el-form-item label="预算类型">
                <el-select v-model="searchForm.type" placeholder="请选择预算类型">
                    <el-option v-for="(item,index) in type" :key="index" :label="item.text" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="预算单状态">
                <el-select v-model="searchForm.status" placeholder="请选择预算单状态">
                    <el-option v-for="(item,index) in status" :key="index" :label="item.text" :value="item.id"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="searchSubmit('searchForm')">查询</el-button>
                <el-button @click="resetForm('searchForm')">重置</el-button>
            </el-form-item>
        </el-form>
        <div class="userTable boxMain">
                <p class="boxTitle">预算单列表</p>
                <template>
                    <div class="tableTopBtn clearfix" style="padding: 15px;">
                        <el-button size="mini" type="primary" @click="handleAdd" v-if="addButton == '1'"><i class="el-icon-plus"></i>添加</el-button>
                    </div>
                    <el-table
                            :data="tableData"
                            style="width: 100%;box-sizing: border-box;">
                        <!--<el-table-column-->
                                <!--prop="id"-->
                                <!--label="预算单id"-->
                        <!--&gt;-->
                        <!--</el-table-column>-->
                        <el-table-column
                                prop="budgetNo"
                                label="预算单号"
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
                                label="制单人"
                        >
                        </el-table-column>

                        <el-table-column
                                prop="amount"
                                label="预算总费用"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="budgetDate"
                                label="预算时间"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="accomplish"
                                label="完成情况"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="income"
                                label="收入"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="incomeSource"
                                label="收入来源"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="target"
                                label="下月目标"
                        >
                        </el-table-column>
                        <el-table-column
                                prop="type"
                                label="预算类型"
                        >
                        <template slot-scope="scope">
                            <p>{{scope.row.type | type}}</p>
                        </template>
                        </el-table-column>
                        <el-table-column
                                prop="status"
                                label="预算单状态"
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
                        <el-table-column align="center" width="120" label="操作">
                            <template slot-scope="scope">
                                <el-button
                                        size="mini"
                                        type="primary" @click="$router.push({
                                            path: '/budget/detail',
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

    <!--新增/修改考勤规则-->
    <div class="alertEvent addPost" v-show="addShow" >
        <div class="alertMsg" @click="cancelAdd('addShow')"></div>
        <div class="alertMain" style="width: 68%;">
            <div class="alertTitle clearfix">
                <p class="float_lf">{{dialogTitle}}</p>
                <img class="float_rt" src= "../../assets/img/del_icon.png" alt="" @click="cancelAdd('addShow')" />
            </div>
            <div class="postForm" style="max-height: 80vh;overflow-y: auto;">
                <el-form :model="formData" :inline="true" :rules="rule" ref="formData" label-width="120px" class="demo-ruleForm">
                    <p class="formTitle">预算单基本信息</p>
                    <el-form-item label="部门名称：" prop="department">
                        <template>
                            <el-select v-model="formData.department" placeholder="请选择部门" style="width: 200px;" @change="departmentChange">
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
                    <el-form-item label="项目名称：" prop="projectId">
                        <el-select v-model="formData.projectId" placeholder="请选择项目" style="width: 200px;" @change="projectChange">
                            <el-option
                                    v-for="(item,index) in proList"
                                    :key="index"
                                    :label="item.projectName"
                                    :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="制单人：" prop="username">
                        <el-input v-model="formData.username" placeholder="请输入制单人"></el-input>
                    </el-form-item>
                    <el-form-item label="预算类型：" prop="list">
                        <el-select v-model="formData.type" placeholder="请选择预算类型" style="width: 200px;" @change="typeChange(i,itemP.budgetType)">
                            <el-option v-for="(item,index) in parentType" :key="index" :label="item.text" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="预算总费用：" prop="amount">
                        <el-input v-model="formData.amount" placeholder="请输入预算总费用"></el-input>
                    </el-form-item>
                    <el-form-item label="预算时间：" prop="budgetDate" >
                        <el-date-picker
                                v-model="formData.budgetDate"
                                type="month"
                                style="width: 200px;"
                                value-format="yyyy-MM"
                                placeholder="请选择年月">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="完成情况：" prop="accomplish">
                        <el-input v-model="formData.accomplish"></el-input>
                    </el-form-item>
                    <el-form-item label="收入：" prop="income">
                        <el-input v-model="formData.income"></el-input>
                    </el-form-item>
                    <el-form-item label="收入来源：" prop="incomeSource">
                        <el-input v-model="formData.incomeSource"></el-input>
                    </el-form-item>
                    <el-form-item label="下月目标：" prop="target">
                        <el-input v-model="formData.target"></el-input>
                    </el-form-item>
                    <el-form-item label="备注：" prop="remark">
                        <el-input v-model="formData.remark"></el-input>
                    </el-form-item>
                    <div class="clearfix">
                        <p class="formTitle float_lf">添加预算明细</p>
                        <el-button class="float_rt" style="margin-top: 10px;" size="mini" type="primary" @click="addFormList"><i class="el-icon-plus"></i> 添加明细</el-button>
                    </div>
                    <template v-for="(itemP,i) in formData.list">
                        <el-form-item label="预算类型：" prop="list">
                            <el-select v-model="itemP.budgetType" placeholder="请选择预算类型" style="width: 178px;" @change="typeChange(i,itemP.budgetType)">
                                <el-option v-for="(item,index) in type" :key="index" :label="item.text" :value="item.id"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item label="预算费用：" prop="amount">
                            <el-input v-model="itemP.amount"></el-input>
                        </el-form-item>
                        <el-form-item label="预算明细：" prop="budgetDetails">
                            <el-input v-model="itemP.budgetDetails"></el-input>
                        </el-form-item>
                        <el-button class="float_rt" size="mini" type="danger" style="margin-top: 5px" :disabled="formData.list.length == 1" @click="delFormList(i)"><i class="el-icon-delete"></i> 删除</el-button>
                    </template>
                    <el-form-item class="postBtn" style="display: block;text-align: center;margin-top: 40px">
                        <el-button type="primary" @click="handleSubmit('formData')">提交</el-button>
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
                addShow: false,
                dialogTitle:'',
                departmentArr:[],
                childs:[],
                value:'',
                //搜索
                searchForm:{
                    budgetDate:'',
                    department: '',
                    projectName: '',
                    status:'',
                    type:'',
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
                parentType:[
                    {
                        id:0,
                        text:'普通预算'
                    },{
                        id:1,
                        text:'追加预算'
                    }
                ],

                //预算类型
                // 1办公费（办公用品、快递费、软件费、印刷费、证照费）、2水电费、3差旅费、4招待费、5审计费、
                // 6车辆运行费（加油、其他、修车、保养费）、7运输费、8修理费、9劳保费、10检验检测费、11环保费用、
                // 12职工薪酬 （工资、福利费、保险费）、13总经办费用、14租赁费、15电站保险费、16运维费、17交通费、
                // 18广告宣传费、19其他、20利息支出、21手续费
                type:[
                    {
                        id:1,
                        text:'办公费（办公用品、快递费、软件费、印刷费、证照费）'
                    },{
                        id:2,
                        text:'水电费'
                    },{
                        id:3,
                        text:'差旅费'
                    },{
                        id:4,
                        text:'招待费'
                    },{
                        id:5,
                        text:'审计费'
                    },{
                        id:6,
                        text:'车辆运行费（加油、其他、修车、保养费）'
                    },{
                        id:7,
                        text:'运输费'
                    },{
                        id:8,
                        text:'修理费'
                    },{
                        id:9,
                        text:'劳保费'
                    },{
                        id:10,
                        text:'检验检测费'
                    },{
                        id:11,
                        text:'环保费用'
                    },{
                        id:12,
                        text:'职工薪酬 （工资、福利费、保险费）'
                    },{
                        id:13,
                        text:'总经办费用'
                    },{
                        id:14,
                        text:'租赁费'
                    },{
                        id:15,
                        text:'电站保险费'
                    },{
                        id:16,
                        text:'运维费'
                    },{
                        id:17,
                        text:'交通费'
                    },{
                        id:18,
                        text:'广告宣传费'
                    },{
                        id:19,
                        text:'其他'
                    },{
                        id:20,
                        text:'利息支出'
                    },{
                        id:21,
                        text:'手续费'
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
                searchButton:'',
                addButton:'',

                formData:{
                    accomplish:'',
                    amount:'',
                    budgetDate:'',
                    department:'',
                    departmentId:'',
                    income:'',
                    incomeSource:'',
                    projectId:'',
                    projectName:'',
                    remark:'',
                    target:'',
                    type:0,
                    username:'',
                    list: [
                        {
                            amount: '',
                            budgetDetails: "",
                            budgetName: "",
                            budgetType: ''
                        }
                    ],
                },
                rule:{
                    department: [
                        { required: true, message: '请选择部门', trigger: 'change' }
                    ],
                    projectId: [
                        { required: true, message: '请选择项目', trigger: 'change' }
                    ],
                    username: [
                        { required: true, message: '请选择部门', trigger: 'change' }
                    ],
                    amount: [
                        { required: true, message: '请输入金额', trigger: 'blur' }
                    ],
                    budgetDate: [
                        { required: true, message: '请选择预算时间', trigger: 'change' }
                    ],
                    accomplish: [
                        { required: true, message: '请输入完成情况', trigger: 'blur' }
                    ],
                    income: [
                        { required: true, message: '请填写收入', trigger: 'blur' }
                    ],
                    incomeSource: [
                        { required: true, message: '请填写收入来源', trigger: 'blur' }
                    ],
                    target: [
                        { required: true, message: '请输入下月目标', trigger: 'blur' }
                    ],
                    list: [
                        { required: true, message: '请选择预算类型', trigger: 'change' }
                    ],
                },
                proList:[],
                proValue:'',
            }
        },
        created () {
            var _this = this;
            //获取预算单列表
                this.$axios.get(_this.$axios.defaults.basePath+'/budget/getList',{
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
                            _this.$router.push({path:"/login"})
                        },500)
                    }else{
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
                if(item.authority == 'budget_query'){
                    this.searchButton = '1'
                }else if(item.authority == 'budget_add'){
                    this.addButton = '1'
                }
            });  
            _this.getDepartmentArr();  
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
                this.$axios.get(_this.$axios.defaults.basePath+'/budget/getList',{
                  params:{      
                     budgetDate:_this.searchForm.budgetDate,           
                     type:_this.searchForm.type,
                     department: _this.searchForm.department,
                     username:_this.searchForm.username,
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
                this.$axios.get(_this.$axios.defaults.basePath+'/budget/getList',{
                  params:{        
                     budgetDate:_this.searchForm.budgetDate,           
                     type:_this.searchForm.type,
                     department: _this.searchForm.department,
                     username:_this.searchForm.username,
                     projectName:_this.searchForm.projectName,
                     status:_this.searchForm.status,
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
                this.$refs[formName].model.budgetDate ='';
                this.$refs[formName].model.type ='';
                this.$refs[formName].model.department ='';
                this.$refs[formName].model.username ='';
                this.$refs[formName].model.projectName ='';
                this.$refs[formName].model.status ='';
            },

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

            //关闭弹框
            cancelAdd(s){
                this.value = [];
                this[s] = false;
            },

            handleAdd() {
                this.addShow = true;
                this.dialogTitle = '添加预算';
            },
            //选择部门
            departmentChange(val){
                this.formData.department = val;
                var list = this.departmentArr[0].childs;
                // console.log(list);
                var id = '';
                for(var i=0;i<list.length;i++){
                    if(val == list[i].label){
                        id = list[i].value;
                    }
                }
                this.formData.departmentId = id;
                console.log(this.formData);
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
            //选择预算类型
            typeChange(index,val){
                var _this = this;
                var type = this.type;
                var list = this.formData.list;
                var budgetName = '';
                if(val){
                    for(var i=0;i<type.length;i++){
                        if(type[i].id == val){
                            budgetName = type[i].text;
                        }
                    }
                    for(var n=0;n<list.length;n++){
                        if(n == index){
                            list[n].budgetName = budgetName;
                        }
                    }
                    this.formData.list = list;
                    // console.log(this.formData.list)
                }
            },
            //添加预算明细
            addFormList(){
              var newList = {
                  amount: '',
                  budgetDetails: "",
                  budgetName: "",
                  budgetType: ''
              };
              this.formData.list.push(newList);

            },
            //删除预算明细
            delFormList(index){
                this.formData.list.splice(index,1);
            },
            //提交
            handleSubmit() {
                var _this = this;
                console.log({
                    department:_this.formData.department,
                    departmentId:_this.formData.departmentId,
                    accomplish:_this.formData.accomplish,
                    amount:_this.formData.amount,
                    income:_this.formData.income,
                    incomeSource:_this.formData.incomeSource,
                    projectId:_this.formData.projectId,
                    projectName:_this.formData.projectName,
                    remark:_this.formData.remark,
                    target:_this.formData.target,
                    type:_this.formData.type,
                    username:_this.formData.username,
                    budgetDate:_this.formData.budgetDate,
                    list:_this.formData.list
                });
                if(_this.dialogTitle == '添加预算'){
                    this.$axios({
                        url:_this.$axios.defaults.basePath+'/budget/add',
                        method:'POST',
                        headers:{
                            'Content-Type':'application/json'
                        },
                        data:JSON.stringify({
                            department:_this.formData.department,
                            departmentId:_this.formData.departmentId,
                            accomplish:_this.formData.accomplish,
                            amount:_this.formData.amount,
                            income:_this.formData.income,
                            incomeSource:_this.formData.incomeSource,
                            projectId:_this.formData.projectId,
                            projectName:_this.formData.projectName,
                            remark:_this.formData.remark,
                            target:_this.formData.target,
                            type:_this.formData.type,
                            username:_this.formData.username,
                            budgetDate:_this.formData.budgetDate,
                            list:_this.formData.list

                        })
                    }).then(function (res) {
                        console.log(res);
                        if (res.data.errcode == 0) {
                            _this.$message({
                                message: '操作成功',
                                type: 'success'
                            });
                            setTimeout(function () {
                                window.location.reload();
                            }, 500)
                        }else{
                            _this.$message({
                                message: res.data.errmsg,
                                type: 'warning'
                            });
                        }
                    })
                }


            },
        },
        filters: {
            type(value) {
                if (value === 0) {
                    return '普通预算';
                } else if (value === 1) {
                    return '追加预算';
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
