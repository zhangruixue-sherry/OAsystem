<template>
    <div id="app">
        <el-header height="70px" v-if="$route.meta.keepAlive">
            <div class="company">河北金乌科技OA管理系统</div>
            <div class="float_rt" style="margin-right: 20px;"><el-button size="mini" @click="getOut">退出</el-button></div>
            <div class="user-info">您好：{{username}}</div>

        </el-header>
        <el-container v-if="$route.meta.keepAlive" style="min-height: 100vh;">
            <el-aside :width="asideWh+'px'">
                <el-row class="tac">
                    <el-col :span="24">
                        <el-menu
                                :default-active="$route.path"
                                class="el-menu-vertical-demo"
                                @open="handleOpen"
                                @close="handleClose"
                                background-color="#1b3757"
                                text-color="#fff"
                                :collapse="isCollapse"
                                :unique-opened="true"
                                :collapse-transition="true"
                                active-text-color="#fff">
                            <el-submenu v-for="(item,index) in menus.menusData" :key="index" :index="index+''">
                                <template slot="title">
                                    <img style="width: 16px;height: 16px;margin-right: 5px;" :src="item.icon" alt="">
                                    <span>{{item.name}}</span>
                                </template>
                                <el-menu-item-group v-for="(child,i) in item.child" :key="i">
                                    <el-menu-item :index="child.targetUrl"  @click="$router.push({ path: child.targetUrl, })">{{child.name}}</el-menu-item>
                                </el-menu-item-group>
                            </el-submenu>
                            </el-menu>
                    </el-col>
                </el-row>
            </el-aside>
            <el-main>
                <div class="crumb clearfix">
                    <p class="asideBtn" @click="openAside()">
                        <span><i class="el-icon-s-fold" style="color:#333;"></i></span>
                    </p>
                </div>
                <keep-alive>
                    <router-view v-if="$route.meta.keepAlive"></router-view>
                </keep-alive>
            </el-main>
        </el-container>
        <router-view v-else-if="!$route.meta.keepAlive"></router-view>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                asideWh:200,
                isCollapse: false,
                tabWidth: 200,
                test1: 1,
                intelval: null,
                defaultNav: "workbench",
                userHead: "https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png",
                breadcrumbArr:["工作台"],
                //菜单数组
                menus:{
                    menusData:[],
                },
                username:'',
            };
        },
        created(){
            var mList = JSON.parse(sessionStorage.getItem('menus'));
            this.username = sessionStorage.getItem('username');
            this.menus.menusData = mList;
        },
        mounted(){
            this.defaultNav = this.$route.path.slice(1);
        },
        methods: {
            handleOpen(key, keyPath) {
                console.log(key, keyPath);
            },
            handleClose(key, keyPath) {
                console.log(key, keyPath);
            },
            isClossTabFun(){
                clearInterval(this.intelval);
                if(!this.isCollapse){
                    this.intelval = setInterval(()=>{
                        if(this.tabWidth<= 64)
                            clearInterval(this.intelval);
                        this.tabWidth -= 3;
                    }, 1);
                }else{
                    this.tabWidth = 200;
                }
                this.isCollapse = !this.isCollapse;
                console.log(this.isCollapse)
            },
            openAside(){
                if(this.isCollapse == false){
                    this.isCollapse = true;
                    this.asideWh = 64;
                }else{
                    this.isCollapse = false;
                    this.asideWh = 200;
                }
            },
            getOut(){
                var _this = this;
                localStorage.setItem("Authorization",'');
                this.$message({
                    message:'请重新登录',
                    type:'warning'
                });
                setTimeout(function () {
                    _this.$router.push({ path: '/login', })
                },500)
            },
        },
        //监听路由变化
        watch: {
            '$route' (to) { //监听路由是否变化
                console.log(to.matched[0].name)
                this.defaultNav = to.matched[0].name;
                var mList = JSON.parse(sessionStorage.getItem('menus'));
                this.menus.menusData = mList;
                this.username = sessionStorage.getItem('username');
            },
        },

    }
</script>

<style lang="scss">
    $header-height:60px;
    $background-color: #1b3757;
    $color: #FFF;
    .el-menu-item-group__title{
        display: none;
    }
    .workbenchMenu,
    .el-submenu__title{
        background-color: #1b3757!important;
        color: $color!important;
    }

    .el-menu-item.is-active{
        background-color: #0070d8!important;
        color: $color!important;
    }

    .main{
        height: 100vh;
        min-width: 800px;
        // min-height: 600px;
        overflow: hidden;

        aside{
            height: 100%;
            background-color: $background-color;
            color: $color;

            .isClossTab{
                width: 100%;
                height: $header-height;
                cursor: pointer;
                font-size: 25px;
                text-align: center;
                line-height: $header-height;
                font-weight: bold;
                border-right: 1px solid #807c7c;
                box-sizing: border-box;
            }
            .menu {
                width: 100%;
                border-right:0;


            }

        }


        .main-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            text-align: right;
            background-color: #fff;
            color: #333;
            border-bottom: 1px solid #e5e5e5;

            .leftTitle{
                display: flex;
                align-items: center;

                .isClossTab{
                    height: $header-height;
                    cursor: pointer;
                    font-size: 25px;
                    text-align: center;
                    line-height: $header-height;
                    font-weight: bold;
                    box-sizing: border-box;
                    margin-right: 20px;
                }
            }

            .rightMenu{
                display: flex;
                align-items: center;

                .el-badge__content.is-fixed{
                    right: 25px;
                }

                .userHead,
                .userName,
                .messageCenter,
                .help,
                .managementMenu{
                    margin: 0 10px;
                    /*visibility: in*/
                }
            }

            .el-dropdown{
                cursor: pointer;
                float: right;
            }
            .el-dropdown-link{

                img{
                    $imgMargin: (($header-height - 50)/2);
                    display:inline-block;
                    width:50px;
                    height: 50px;
                    border-radius: 25px;
                    background-color: #FFF;
                    margin-top: $imgMargin;
                }
            }
        }

        .el-main{
            padding: 0;

            > *{
                // min-width: 1200px;
            }
        }

        .crumbs {
            margin-bottom: 20px;
        }

        .main-footer{
            text-align: center;
            background-color: $background-color;
            color: $color;
            line-height: 50px;
        }

    }

</style>
