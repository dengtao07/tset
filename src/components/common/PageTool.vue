<template>
<div>
      <!-- 分页区域 -->
      <el-pagination
        @size-change="onPageSizeChange"
        @current-change=" onPageChange"
        :current-page="pageIndex"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      ></el-pagination>
       </div>
</template>

<script>
export default {
   props: ['total', 'pageIndex', 'pageSize'],
    methods:{
     onPageSizeChange: function(pageSize){
      
       this.$emit('pageSizeChange',pageSize)
     },
     onPageChange:function(pageIndex){
       this.$emit('pageIndexChange', pageIndex)
        console.log(pageIndex)
     }
    }
}
</script>

<style scoped>

</style>>
