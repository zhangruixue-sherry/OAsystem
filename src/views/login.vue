<template>
    <div class="login_app">
        <div class="login">
            <div class="login_top">
                <p style="color:#fff;font-size: 26px;margin-bottom: 20px;">OA后台管理系统</p>
                <!--<img src="../../assets/img/logo.png" alt="">-->
            </div>
            <div class="login_form">
                <el-form :model="loginForm" ref="loginForm" status-icon label-width="40px" class="demo-ruleForm" autocomplete="on">
                    <el-form-item prop="userName">
                        <el-input type="text" v-model="loginForm.userName" autocomplete="on"></el-input>
                    </el-form-item>
                    <el-form-item prop="password">
                        <el-input type="password" v-model="loginForm.password" autocomplete="on"></el-input>
                    </el-form-item>
                    <el-form-item class="submitBtn">
                        <el-button size="medium" type="primary" v-on:keyup.enter.native="console.log(123)" @click="submitForm()">登录</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
    import { mapMutations } from 'vuex'
    export default {
        name: "login",
        data(){
          return{
              loginForm:{
                  userName:'',
                  password:''
              },
              loginRules: {
                  userName: [
                      { required: true, message: '请输入账户名称', trigger: 'blur' }
                  ],
                  password: [
                      { required: true, message: '请输入账户密码', trigger: 'blur' }
                  ]
              },
              power:[],
          }
        },
        
        // created(){
        //     var _this = this;
        //      _this.$axios({
        //                 url:_this.$axios.defaults.basePath+'/privileges/all',
        //                 method:'GET',
        //                 headers:{
        //                     'Content-Type':'application/json'
        //                 },
        //             }).then(function (res){
        //                 console.log(res.data.data)
        //                 _this.power = res.data.data;
                        
        //             })
        //     console.log(_this.power)
        // },
        mounted(){
            //监听键盘抬起事件
            window.addEventListener('keyup',this.handleEnter);
        },
        methods:{
            ...mapMutations(['changeLogin']),
            submitForm(){
                var _this = this;
                if(this.loginForm.userName == ''){
                    this.$message({
                        message:'请输入账户名称',
                        type:'warning'
                    });
                }else if(this.loginForm.password == ''){
                    this.$message({
                        message:'请输入账户密码',
                        type:'warning'
                    });
                }else{
                    var newAxios = _this.$axios.create();
                    newAxios.post(_this.$axios.defaults.basePath+'/login',
                        {
                            username:_this.loginForm.userName,
                            password:_this.$md5(_this.loginForm.password)
                        }
                    ).then((res)=>{
                        console.log(res.data);
                        if(res.data.errcode == 0){
                            _this.changeLogin({ Authorization: res.data.data.token });
                            _this.$message({
                                message:'登录成功！',
                                type:'success'
                            });
                            //获取用户信息
                            _this.$axios.get(_this.$axios.defaults.basePath+'/getInfo',{

                            }).then((res)=>{
                                console.log(res);
                                var menus = res.data.data.menus;
                                //一级数组
                                var parArr = new Array();
                                //二级数组
                                var childArr = new Array();
                                for(var i=0;i<menus.length;i++){
                                    if(!menus[i].parentId){
                                        menus[i].child = new Array();
                                        parArr.push(menus[i]);
                                    }else{
                                        childArr.push(menus[i]);
                                    }
                                }
                                //菜单重组
                                for(var n=0;n<parArr.length;n++){
                                    for(var j=0;j<childArr.length;j++){
                                        if(childArr[j].parentId == parArr[n].id){
                                            parArr[n].child.push(childArr[j]);
                                        }
                                    }
                                }
                                
                                sessionStorage.setItem("authority",JSON.stringify(res.data.data.authorities));
                                sessionStorage.setItem('menus',JSON.stringify(parArr));
                                sessionStorage.setItem('username',res.data.data.username);
                                sessionStorage.setItem('userid',res.data.data.id);
                                setTimeout(function () {
                                    _this.$router.push({path:"/member/list"})
                                },500);
                            });

                        }
                    });
                }
            },
            //键盘事件 按回车登录
            handleEnter(event){
                const e = event || window.event || arguments.callee.caller.arguments[0];
                if(!e) return;
                const {keyCode} = e;
                if(keyCode == 13){
                    this.submitForm();
                }
            },
        },
    }
</script>


<style lang="css">
    .login_app{
        position: relative;
        height:100vh;
        /*background-color: #061448;*/
        background: url('../assets/img/login_bg.png') center no-repeat;
        background-size: 100% 100%;
    }
    .login_top img{
        width: 330px;
        display: block;
        margin: 0 auto 20px auto;
    }
    .login{
        width: 610px;
        text-align: center;
        position: absolute;
        top:41%;
        left:50%;
        z-index: 100;
        transform: translate(-50%,-50%);
        -moz-transform: translate(-50%,-50%);
        -webkit-transform: translate(-50%,-50%);
    }
    .login .login_form{
        width: 610px;
        height: 350px;
        text-align: center;
        background: url("../assets/img/boxBg.png") no-repeat;
        background-size: 100% 100%;
        position: relative;
    }
    .login .login_form form{
        width: 50%;
        position: absolute;
        bottom: 10px;
        left:0;
        right: 0;
        margin: 0 auto;
    }
    .login .login_form form input{
        background-color: transparent;
    }
    .login .login_form form .el-form-item:first-child {
        margin-bottom: 35px;
        background: url("../assets/img/nameBox.png") no-repeat;
        background-size: 100% 100%;
    }
    .login .login_form form .el-form-item:first-child+.el-form-item{
        margin-bottom: 35px;
        background: url("../assets/img/pwdBox.png") no-repeat;
        background-size: 100% 100%;
    }
    #app .login .login_form form input.el-input__inner{
        color:#fff;
        padding: 0 10px;
        background-color: transparent !important;
        border:0 !important;
    }
    .login .el-form-item__content{
        margin-left: 40px !important;
    }
    .el-message{
        min-width: 200px !important;
    }
    .login .submitBtn .el-form-item__content{
        margin-left: 0 !important;
    }
    .login .submitBtn .el-form-item__content button{
        width: 100%;
    }
</style>