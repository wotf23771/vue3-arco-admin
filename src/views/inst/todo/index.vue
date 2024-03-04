<template>
    <div class="container">

        <a-tabs :model="tab">
            <a-tab-pane key="1" title="待办">
               <todo />
            </a-tab-pane>
            <a-tab-pane key="2" title="待阅">
              <toread />
            </a-tab-pane>
            <a-tab-pane key="3" title="已办">
                <havedo />
            </a-tab-pane>
            <a-tab-pane key="4" title="已阅">
                <haveread />
            </a-tab-pane>
            <a-tab-pane key="5" title="关注">
                <attention />
            </a-tab-pane>
        </a-tabs>

      
    </div>
  </template>
  
  <script setup>
  
  import todo from "./todo.vue"
  import toread from "./toread.vue"
  import havedo from "./havedo.vue"
  import haveread from "./haveread.vue"
  import attention from "./attention.vue"
  
  </script>
  
  <style scoped lang="less">
  .container {
    padding: 20px;
  }
  .arco-pagination {
    justify-content: flex-end;
  }
  </style>
  