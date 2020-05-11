<template>
    <div>scdsada</div>
</template>
<script>
    export default{
        data(){
            return{

            }
        },
        created(){
            var _this = this;
            this.$axios.get(_this.$axios.defaults.basePath+'/getInfo').then(function (res) {
                console.log(res.data);
            })
        },
        mounted(){

        },
    }
</script>
