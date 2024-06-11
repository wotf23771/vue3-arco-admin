<template>
  <div>
    <a-spin :loading="loading" style="width: 100%">
      <slot name="empty" class="table-empty" v-if="!dataList || dataList.length === 0">
        <div class="arco-empty">
          <div class="arco-empty-image">
            <IconEmpty/>
          </div>
          <div class="arco-empty-description">暂无数据</div>
        </div>
      </slot>
      <div class="card-table">
        <div v-for="(item, index) in dataList" :key="index" class="card-table-item"
             :style="{width: `calc(${100 / rowNum}% - ${gutter}px)`, margin: `0 ${gutter / 2}px 20px`}">
          <slot name="content" :item="item"></slot>
        </div>
      </div>
    </a-spin>
    <div v-if="pagination" class="arco-table-pagination arco-table-pagination-right">
      <a-pagination
          v-model:current="pagination.current"
          :page-size="pagination.pageSize"
          :total="pagination.total"
          :show-total="pagination.showTotal"
          :show-jumper="pagination.showJumper"
          :show-page-size="pagination.showPageSize"
          :page-size-options="pagination.pageSizeOptions"
          @change="handlePageChange"
          @page-size-change="handlePageSizeChange"
      />
    </div>
  </div>
</template>

<script setup>
import { toRefs } from "vue";

const props = defineProps({
  pagination: {
    type: [Object, Boolean],
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  },
  dataList: {
    type: Array,
    default: []
  },
  rowNum: {
    type: Number,
    default: 4
  },
  gutter: {
    type: Number,
    default: 20
  }
});

const { pagination, dataList, rowNum, gutter } = toRefs(props);
const emit = defineEmits(['page-change', 'page-size-change'])

const handlePageChange = (current) => {
  emit('page-change', current)
}

const handlePageSizeChange = (pageSize) => {
  emit('page-size-change', pageSize)
}
</script>

<style scoped lang="less">
.card-table {
  width: 100%;
  display: flex;
  flex-wrap: wrap;

  .table-empty {
    width: 100%;
  }
}
</style>