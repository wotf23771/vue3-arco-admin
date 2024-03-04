<template>
    <div class="container">

        <a-tabs :model="tab">
            <a-tab-pane key="1" title="加签记录">
              <signlog />
            </a-tab-pane>
            <a-tab-pane key="2" title="改派记录">
              <reassignlog />
            </a-tab-pane>
           
        </a-tabs>

      
    </div>
  </template>
  
  <script setup>
  
  import signlog from "./signlog.vue"
  import reassignlog from "./reassignlog.vue"

  
  </script>
  
  <style scoped lang="less">
  .container {
    padding: 20px;
  }
  .arco-pagination {
    justify-content: flex-end;
  }
  </style>
  