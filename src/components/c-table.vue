<template>
  <el-table :data="tableData.data" style="width: 100%" border>
    <el-table-column
      :prop="column.prop"
      :label="column.label"
      :width="column.width"
      v-for="(column, index) in columns"
      :key="column.prop"
    >
      <template #default="{ row, $index }">
        <slot
          :name="column.prop"
          :row="row"
          :index="$index"
          v-if="column.slot"
        ></slot>
        <span v-else> {{ row[column.prop] }}</span>
      </template>
    </el-table-column>
  </el-table>
  <el-pagination
    v-if="hasPage"
    style="margin-top: 20px;"
    v-model:current-page="tableData.currentPage"
    v-model:page-size="tableData.pageSize"
    :page-sizes="[10, 20, 30, 50, 100]"
    background
    layout="total, sizes, prev, pager, next, jumper"
    :total="tableData.total"
    @size-change="handleSizeChange"
    @current-change="handleCurrentChange"
  />
</template>

<script setup lang="ts" name="base-table">
const { tableData, columns, hasPage } = withDefaults(
  defineProps<{
    tableData: any;
    columns: any[];
    hasPage?: boolean;
  }>(),
  {
    hasPage: true,
  }
);

const emit = defineEmits<{
  (event: 'sizeChange', pageSize: number): void;
  (event: 'currentChange', page: number): void;
}>();
function handleSizeChange(pageSize: number) {
  emit('sizeChange', pageSize);
}
function handleCurrentChange(page: number) {
  emit('currentChange', page);
}
</script>

<style lang="scss" scoped></style>
