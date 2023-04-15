<template>
  <a-modal
    title="权限编辑"
    :visible="visible"
    :width="600"
    :confirmLoading="loading"
    centered
    @ok="handleSubmit"
    @cancel="
      () => {
        resetFields();
        $emit('cancel');
      }
    "
  >
    <a-spin :spinning="loading">
      <a-form :label-col="labelCol" :wrapper-col="wrapperCol">
        <a-form-item label="编号" disabled v-bind="validateInfos.id">
          <a-input disabled v-model:value="modelRef.id" />
        </a-form-item>
        <a-form-item label="权限名称" v-bind="validateInfos.name">
          <a-input v-model:value="modelRef.name" />
        </a-form-item>
        <a-form-item label="显示名称" v-bind="validateInfos.label">
          <a-input v-model:value="modelRef.label" />
        </a-form-item>
        <a-form-item label="操作类型">
          <a-select v-model:value="modelRef.actions" mode="tags" style="width: 100%">
            <a-select-option v-for="action in permissionActions" :key="action">
              {{ action }}
            </a-select-option>
          </a-select>
        </a-form-item>
      </a-form>
    </a-spin>
  </a-modal>
</template>

<script lang="ts">
import type { PropType } from 'vue';
import { defineComponent } from 'vue';
import type { Permission } from '@/store/modules/user/typing';


export default defineComponent({
  name: 'PermissionModal',
  props: {
    visible: {
      type: Boolean,
      required: true,
    },
    model: {
      type: Object as PropType<Permission | null>,
      default: () => null,
    },
  },
});
</script>
