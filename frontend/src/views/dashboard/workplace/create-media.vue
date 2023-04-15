<template>
  <page-container :showBreadcrumb="true">
    <a-card title="Register Your Media">
    <a-form
        ref="formRef"
        name="custom-validation"
        :model="formState"
        v-bind="layout"
        @finish="handleFinish"
        @validate="handleValidate"
        @finishFailed="handleFinishFailed"
    >
        <a-form-item
        has-feedback
        label="NFT Address"
        name="nftAddress"
        :rules="[{ required: true, message: 'Please enter the NFT address' }]"
        >
        <a-input v-model:value="formState.nftAddress" />
        </a-form-item>
        <a-form-item
        has-feedback
        label="NFT Token ID"
        name="nftTokenId"
        :rules="[{ required: true, message: 'Please enter the NFT token id' }]"
        >
        <a-input v-model:value="formState.nftTokenId" />
        </a-form-item>
        <!--
        <a-form-item
        has-feedback
        label="OSC Address"
        name="oscAddress"
        :rules="[{ required: true, message: 'Please enter the OSC address' }]"
        >
        <a-input v-model:value="formState.oscAddress" />
        </a-form-item>

      -->
        <a-form-item :wrapper-col="{ span: 14, offset: 4 }">

        <a-button type="primary" html-type="submit">Submit</a-button>
        </a-form-item>
    </a-form>
    </a-card>
  </page-container>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
// import { FormInstance } from 'ant-design-vue';
import { useRoute, useRouter } from 'vue-router';
import request from '@/utils/request';
import { notification } from 'ant-design-vue';

interface FormState {
  nftAddress: string;
  nftTokenId: string;
  oscAddress: string;
}

export default defineComponent({
  setup() {
    const route = useRoute();
    console.log(route);
    const router = useRouter();
    // const formRef = ref<FormInstance>();
    const formState = reactive<FormState>({
      nftAddress: '',
      nftTokenId: '',
      oscAddress: '',
    });
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
    };
    const handleFinish = (values: FormState) => {
      console.log(values, formState);
      request.post('/media/createMedia', {
        nftAddress: values.nftAddress,
        nftTokenId: values.nftTokenId,
        oscAddress: values.oscAddress,
      }).then(() => {
        notification.success({
          message: 'Media Created',
          duration: 4.5,
        });
        router.push('/');
      });
    };
    const handleFinishFailed = errors => {
      console.log(errors);
    };
    const resetForm = () => {
      // formRef.value.resetFields();
    };
    const handleValidate = (...args) => {
      console.log(args);
    };
    return {
      formState,
      // formRef,
      layout,
      handleFinishFailed,
      handleFinish,
      resetForm,
      handleValidate,
    };
  },
});
</script>
