<template>
<div>
    <div class="pageMain">
                        <div class="userTable boxMain">
                            <p class="boxTitle">审批流程列表</p>
                            <div class="tableTopBtn clearfix" style="padding: 15px;">
                                <el-button size="mini" type="primary" @click="handleAdd" v-if="addButton == '1'"><i class="el-icon-plus"></i>添加</el-button>
                            </div>
                            <template>
                                <el-table
                                        :data="tableData"
                                        style="width: 100%;">
                                    <el-table-column
                                            prop="id"
                                            label="审批单编号"
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
                                            prop="jobNames"
                                            label="部门人员名称"
                                    >
                                    </el-table-column>
                                    <el-table-column
                                            prop="approvePerson"
                                            label="审批人员"
                                            align="center"
                                    >
                                    
                                    <template slot-scope="scope">
                                        <el-steps  :active="1" finish-status="finish" align-center>
                                            <el-step :title="item.username" :description="item.job" v-for="(item,index) in scope.row.approvePerson" :key="index"></el-step>
                                        </el-steps>
                                    </template>
                                    </el-table-column>
                                    <el-table-column
                                            prop="copyPerson"
                                            label="抄送人员"
                                            align="center"
                                    >
                                    <template slot-scope="scope">
                                        <el-steps  :active="10" finish-status="finish" align-center>
                                            <el-step v-for="(item,index) in scope.row.copyPerson" :key="index" :title="item.username" :description="item.jib"></el-step>
                                        </el-steps>
                                    </template>
                                    </el-table-column>
                                    <el-table-column align="center" width="160" label="操作">
                                        <template slot-scope="scope">
                                            <el-button size="mini" type="primary" @click="handleEdit(scope.row)" v-if="auditButton == '1'">编辑</el-button>
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
    <!--新增审批流程-->
    <div class="alertEvent addPost" v-show="addShow" >
        <div class="alertMsg" @click="cancelAdd('addShow')"></div>
        <div class="alertMain" style="width: 60%">
            <div class="alertTitle clearfix">
                <p class="float_lf">{{dialogTitle}}</p>
                <img class="float_rt" src= "../../assets/img/del_icon.png" alt="" @click="cancelAdd('addShow')">
            </div>
            <div class="postForm">
                <el-form :model="formData" :inline="true" :rules="rules" ref="formData" label-width="140px" class="demo-ruleForm">
                    <el-form-item label="审批类型：" prop="approveType">
                        <el-select v-model="formData.approveType" placeholder="请选择类型" style="width: 300px;">
                            <el-option v-for="(item,index) in type" :key="index" :label="item.text" :value="item.id"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="部门/岗位：" prop="orgId">
                        <template>
                                <el-cascader
                                    v-model="formData.orgId"
                                    :options="departmentArr"
                                    :show-all-levels="false"
                                    ref="departmentArr"
                                    style="width: 300px;"
                                    :props="{ checkStrictly: true }"
                                    clearable
                                    @change="handleChange"></el-cascader>
                            </template>
                    </el-form-item>
                    <el-form-item label="审批人：" prop="approveList">
                        <template>
                            <div v-for="(item,index) in approveList" :key="index">
                                <span v-if="index>= 1" style="float:left"> ->{{item.username}}</span>
                                <span v-else style="float:left">{{item.username}}</span>
                            </div>
                            <span v-if="approveList.length>0" style="margin-left:20px" @click="detail('approve')"><i class="el-icon-circle-close"></i></span>
                            <el-cascader
                            :options="memberArr"
                            :props="{checkStrictly: true }"
                            clearable
                            style="width: 300px;"
                            ref="memberArr"
                            @change = "jobNamesResult()"
                            >
                        </el-cascader>
                        </template>
                        
                    </el-form-item>
                    <el-form-item label="抄送人：" prop="copyList">
                        <template>
                            <div v-for="(item,index) in copyList" :key="index">
                                <span v-if="index>= 1" style="float:left"> ->{{item.username}}</span>
                                <span v-else style="float:left">{{item.username}}</span>
                            </div>
                            <span v-if="copyList.length>0" style="margin-left:20px" @click="detail('copy')"><i class="el-icon-circle-close"></i></span>
                            <el-cascader
                                :options="memberArr1"
                                :props="{ checkStrictly: true }"
                                clearable
                                style="width: 300px;"
                                ref="memberArr1"
                                @change = "copyResult">
                            </el-cascader>
                        </template>
                    </el-form-item>
                    <el-form-item class="postBtn" style="display: block;text-align: center;">
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
                tableData:[],
                tabWidth:200,
                //分页数据
                pagesData:{
                    total:0,
                    currentPage:1,
                    currentRows:10,
                    rows:[10, 20, 30, 40],
                },
                addShow: false,
                dialogTitle: false,
                formData:{
                    approveType:'',
                    jobIds:'',
                    jobNames:'',
                    orgId:'',
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
                    },{
                        id:11,
                        text:'立项申请'
                    },{
                        id:12,
                        text:'合同申请'
                    },{
                        id:13,
                        text:'公文申请'
                    }
                ], 
                departmentArr:[],
                children:[],
                value:'',  
                centerDialogVisible: false,
                memberArr:[],
                memberArr1:[],     
                approveList:[],
                approvearr:{},
                copyList:[],
                copyarr:{},   
                rules:{
                    approveType: [
                        { required: true, message: '请选择审批类型', trigger: 'change' }
                    ],
                    orgId: [
                        { required: true, message: '请选择部门', trigger: 'change' }
                    ],
                    approveList: [
                        { required: true, message: '请添加审批人', trigger: 'change' }
                    ],
                    copyList: [
                        { required: true, message: '请选择抄送人', trigger: 'change' }
                    ],
                },
                searchButton:'',
                auditButton:'',
                addButton:''
            }
        },
        created () {
            var _this = this;
            //获取审批单列表
                this.$axios.get(_this.$axios.defaults.basePath+'/approve/list',{
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
                            item.approvePerson = JSON.parse(item.approvePerson);
                            item.copyPerson = JSON.parse(item.copyPerson);
                        })
                        _this.tableData = resData.data.records;
                        _this.pagesData.total = resData.data.total;
                    }
                })

            var privilege = JSON.parse(sessionStorage.getItem('authority'));
            privilege.forEach((item, index) => {
                if(item.authority == 'approve_update'){
                    this.auditButton = '1'
                }else if(item.authority == 'approve_query'){
                    this.searchButton = '1'
                }else if(item.authority == 'approve_add'){
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
                this.$axios.get(_this.$axios.defaults.basePath+'/approve/list',{
                  params:{                
                     current:page,
                     size:rows,
                  }
                }).then(function (res) {
                    var resData = res.data;
                        resData.data.records.forEach((item)=>{
                            item.approvePerson = JSON.parse(item.approvePerson);
                            item.copyPerson = JSON.parse(item.copyPerson);
                        })
                        _this.tableData = resData.data.records;
                        _this.pagesData.total = resData.data.total;
                })
            },

            //获取所有部门下的人员
            getMember() {
                var _this = this;
                    _this.$axios({
                        url:_this.$axios.defaults.basePath+'/sysOrg/getOrgSelectListHasUser',
                        method:'POST',
                        headers:{
                            'Content-Type':'application/json'
                        },
                    }).then(function (res){

                        var resData = res.data;
                        console.log(resData)
                        _this.memberArr = [];
                        _this.memberArr1 = [];
                        if(resData.data != ''){
                            resData.data.forEach((item) => {
                            
                            _this.children = [];
                            var aa = item['childs'];
                                aa.forEach((val) => {
                                    _this.childs = [];
                                    var bb1 = val['childs'];
                                        bb1.forEach((v) => {
                                            var powers = [];
                                            var cc = v['users'];
                                            cc.forEach((i) =>{
                                                    powers.push({
                                                        value:i['userId'],
                                                        label:i['username'],
                                                    })
                                                })

                                            _this.childs.push({
                                                value:v['id'],
                                                label:v['name'],
                                                children:powers
                                            });

                                        });
                                    var bb = val['users'];
                                        bb.forEach((v) => {
                                            _this.childs.push({
                                                value:v['userId'],
                                                label:v['username'],
                                            });

                                        });
                                    
                                    _this.children.push({
                                        value:val['id'],
                                        label:val['name'],
                                        children:_this.childs,
                                    });
                                });
                                _this.memberArr1.push({
                                        value: item['id'],
                                        label: item['name'],
                                        children:_this.children
                                }); 
                                 _this.memberArr.push({
                                        value: item['id'],
                                        label: item['name'],
                                        children:_this.children
                                });    
                                    
                            });
                        }
                        console.log(_this.memberArr1)
                    })
            },

            //获取所有部门
            selectTrigger() {
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
                            
                            _this.children = [];
                            var aa = item['childs'];
                                aa.forEach((val) => {
                                    _this.childs = [];
                                    var bb = val['childs'];
                                        bb.forEach((v) => {
                                            _this.childs.push({
                                                value:v['id'],
                                                label: v['name'],
                                            });

                                        });
                                    _this.children.push({
                                        value:val['id'],
                                        label: val['name'],
                                        children:_this.childs
                                    });

                                });
                                _this.departmentArr.push({
                                        value: item['id'],
                                        label: item['name'],
                                        children:_this.children
                                    });
                            });
                        }
                        console.log(_this.departmentArr)
                        _this.level2 = true;
                    })
            },
            handleChange() {
                var inputVal = this.$refs['departmentArr'].getCheckedNodes();
                console.log(this.$refs['departmentArr'].getCheckedNodes())
                this.formData.orgId = inputVal[0].value,
                this.formData.orgName = inputVal[0].label,
                this.getOrgUserList(inputVal[0].value)
            },
            getOrgUserList(id) {
                console.log(id)
                var _this = this;
                _this.$axios({
                        url:_this.$axios.defaults.basePath+'/sysOrg/getOrgUserList?id='+id,
                        method:'GET',
                        headers:{
                            'Content-Type':'application/json'
                        },
                    }).then(function (res){
                        var resData = res.data;
                        _this.formData.jobIds = '';
                        _this.formData.jobNames = '';
                        if(resData != ''){
                            resData.forEach((item) => {
                                 _this.formData.jobIds += item.userId + ',';
                                 _this.formData.jobNames += item.username + ',';
                            });
                        }
                        console.log(_this.formData)
                        
                    })
            },
            handleAdd() {
                this.selectTrigger();
                this.getMember();
                this.addShow = true;
                this.approveList = [];
                this.copyList = [];
                this.dialogTitle = '添加审批流程';
            },
            handleEdit(row){
                this.selectTrigger();
                this.getMember();
                this.addShow = true;
                this.formData = row;
                this.approveList = row.approvePerson;
                this.copyList = row.copyPerson;
                this.id = row.id;
                this.dialogTitle = '编辑审批流程';
            },
            handleSubmit(formData) {
                var _this = this;
                _this.$refs[formData].validate((valid) => {
                    if (valid) {
                        if(_this.dialogTitle == '添加审批流程'){
                            this.$axios({
                                url:_this.$axios.defaults.basePath+'/approve/add',
                                method:'POST',
                                headers:{
                                    'Content-Type':'application/json'
                                },
                                data:JSON.stringify({
                                    approveType:parseInt(_this.formData.approveType),
                                    jobIds:_this.formData.jobIds,
                                    jobNames:_this.formData.jobNames,
                                    approveList:_this.approveList,
                                    copyList:_this.copyList,
                                    orgId:_this.formData.orgId,
                                    orgName:_this.formData.orgName,
                                })
                            }).then(function (res) {
                                console.log(res);
                                if (res.data.errcode == 0) {
                                        _this.$message({
                                            message: res.data.data,
                                            type: 'success'
                                        });
                                        setTimeout(function () {
                                            _this.$refs['formData'].resetFields();
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
                            this.$axios({
                                url:_this.$axios.defaults.basePath+'/approve/update',
                                method:'POST',
                                headers:{
                                    'Content-Type':'application/json'
                                },
                                data:JSON.stringify({
                                    id:_this.id,
                                    approveType:parseInt(_this.formData.approveType),
                                    jobIds:_this.formData.jobIds,
                                    jobNames:_this.formData.jobNames,
                                    approveList:_this.approveList,
                                    copyList:_this.copyList,
                                    orgId:_this.formData.orgId,
                                    orgName:_this.formData.orgName,
                                })
                            }).then(function (res) {
                                console.log(res);
                                if (res.data.errcode == 0) {
                                        _this.$message({
                                            message: res.data.data,
                                            type: 'success'
                                        });
                                        setTimeout(function () {
                                            _this.$refs['formData'].resetFields();
                                            window.location.reload();
                                        }, 500)
                                    }else{
                                        _this.$message({
                                            message: res.data.errmsg,
                                            type: 'error'
                                        });
                                    }
                            })
                        
                        }
                    }else{
                        return false;
                    }
                })
                
            },
            //关闭弹框
            cancelAdd(s){
                this[s] = false;
                this.$refs['formData'].resetFields();
            },
            //选择审批人员
            jobNamesResult() {
                var _this = this;
                var dataArr = [];
                var inputVal1 = this.$refs['memberArr'].getCheckedNodes();
                console.log(inputVal1);
                inputVal1.forEach((item,key) => {
                    dataArr[key] = item.data
                });
               // _this.approveList = [];
                dataArr.forEach(item=>{
                    _this.approveList.push({
                        userId:item.value,
                        username:item.label,
                        job:item.job,
                        level:'',
                    })
                })
                _this.approveList.forEach((item,key)=>{
                    item.level=key+1
                })
            },

            //选择抄送人员
            copyResult() {
                var _this = this;
                var dataArr1 = [];
                var inputVal1 = this.$refs['memberArr1'].getCheckedNodes();
                inputVal1.forEach((item,key) => {
                    dataArr1[key] = item.data
                });
                dataArr1.forEach(item=>{
                    _this.copyList.push({
                        userId:item.value,
                        username:item.label,
                    })
                })
            },

            detail(val) {
                if(val =='approve'){
                    this.approveList = [];
                }else{
                    this.copyList = []; 
                }
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
                    return '预算申请';
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
                } else if (value === 11) {
                    return '立项申请';
                } else if (value === 12) {
                    return '合同申请';
                } else if (value === 13) {
                    return '公文申请';
                } 
            }
        },
     }

</script>
