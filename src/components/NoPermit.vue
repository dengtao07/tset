<template>
    <div class="error-page">
        <div class="error-code">啊哦~ 你无权访问此系统！</div>
    </div>
</template>

<script>
    export default {
        methods: {
        }
    }
</script>

<style scoped lang="less">
    .error-page{
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 100%;
        height: 100%;
        background: #f3f3f3;
        box-sizing: border-box;
    }
    .error-code{
        line-height: 1;
        font-size: 50px;
        font-weight: bolder;
        color: #2d8cf0;
        animation: myfirst 1s infinite;
    }
    .error-code span{
        color: #00a854;
    }
    .error-handle{
        margin-top: 30px;
        padding-bottom:490px;
    }
    .error-btn{
        margin-left: 100px;
    }
    @keyframes myfirst {
        0% {
            letter-spacing: 8px;
            transform: translate(0px, 0px);
        }
        50% {
            letter-spacing: 10px;
            transform: translate(0px, -5px);
        }
        100% {
            letter-spacing: 8px;
            transform: translate(0px, 0px);
        }
    }
</style>