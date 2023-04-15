<template>
  <page-container :showBreadcrumb="true">
    <div>
      <a-row :gutter="16">
        <a-col :span="16" :offset="4">
          <a-image :src="context.dataSource.image" width="100%" />
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <br>
          <a-descriptions
            :contentStyle="{ backgroundColor: '#fff' }"
            size="big"
            bordered>
            <a-descriptions-item label="Media Name">
              {{ context.dataSource.name }}
            </a-descriptions-item>
            <!-- <a-descriptions-item label="Copyright Owner">
              {{ context.dataSource.copyrightOwner }}
            </a-descriptions-item> -->
            <!-- <a-descriptions-item label="Date">
              {{ context.dataSource.date }}
            </a-descriptions-item> -->
            <a-descriptions-item label="Preview">
              <a :href="context.dataSource.dml?.urlToMedia" target="_blank">Link</a>
            </a-descriptions-item>
          </a-descriptions>
          <br>
          <a-table
            :loading="licenses.loading"
            :dataSource="licenses.dataSource"
            :pagination="false"
          >
            <a-table-column key="name" title="License" data-index="name" />
            <a-table-column key="price" title="Price (ETH)" data-index="price" />
            <a-table-column key="description" title="Description" data-index="description" />
          </a-table>
        </a-col>
      </a-row>
      <a-row :gutter="16">
        <a-col :span="24">
          <br>
          <a-card title="Apply for license">
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
                name="license"
                label="License"
                has-feedback
                :rules="[{ required: true, message: 'Please select the license' }]"
              >
                <a-select v-model:value="formState.license" placeholder="Please select a license">
                  <template v-for="(row, i) in licenses.dataSource">
                    <a-select-option :value="i">{{ row.name }} ({{ row.price }})</a-select-option>
                  </template>
                </a-select>
              </a-form-item>
              <a-form-item
                has-feedback
                label="Name of Applicant"
                name="applicant"
                :rules="[{ required: true, message: 'Please enter the name of applicant' }]"
              >
                <a-input v-model:value="formState.applicant" />
              </a-form-item>
              <a-form-item
                has-feedback
                label="Usage"
                name="usage"
                :rules="[{ required: true, message: 'Please enter the usage' }]"
              >
                <a-textarea v-model:value="formState.usage" />
              </a-form-item>
              <a-form-item
                has-feedback
                label="Date of Use"
                name="date"
                :rules="[{ required: true, message: 'Please enter the date of use' }]"
              >
                <a-range-picker v-model:value="formState.date" value-format="YYYY-MM-DD" />
              </a-form-item>
              <a-form-item :wrapper-col="{ span: 14, offset: 4 }">
                <a-button type="primary" html-type="submit">Submit</a-button>
              </a-form-item>
            </a-form>
          </a-card>
        </a-col>
      </a-row>
    </div>
  </page-container>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
// import { FormInstance } from 'ant-design-vue';
import { useRoute, useRouter } from 'vue-router';
import request from '@/utils/request';
import { notification } from 'ant-design-vue';
import { useFetchData } from '@/utils/hooks/useFetchData';
import { ethers } from 'ethers';

interface FormState {
  license: string;
  applicant: string;
  usage: string;
  date: string;
}

async function getData(id: string): Promise<any> {
  return request.get('/media/info', {
    params: {
      id,
    },
  });
}

export default defineComponent({
  setup() {
    const route = useRoute();
    const router = useRouter();
    // const formRef = ref<FormInstance>();
    const formState = reactive<FormState>({
      license: '',
      applicant: '',
      usage: '',
      date: '',
    });
    const layout = {
      labelCol: { span: 4 },
      wrapperCol: { span: 14 },
    };
    const handleFinish = (values: FormState) => {
      console.log(values, formState);
      const { ethereum } = window as any;
      ethereum.request({ method: 'eth_requestAccounts' })
        .then(async () => {
          const provider = new ethers.providers.Web3Provider(ethereum);
          const signer = provider.getSigner();
          const applicantAddress = await signer.getAddress();
          const msg = values.applicant+values.usage+values.date+values.license+applicantAddress+'0';
          const applicationSignature = await signer.signMessage(msg);
          request.post('/raf/create', {
            doc: {
              mediaId: route.params.id,
              license: values.license,
              licenseName: licenses.dataSource[values.license].name,
              applicant: values.applicant,
              usage: values.usage,
              applicationSignature: applicationSignature,
              dateOfUse: values.date[0] + ' - ' + values.date[1],
            },
          }).then(() => {
            notification.success({
              message: 'Application Submitted',
              description: 'You can check the application status on "My Application" page.',
              duration: 4.5,
            });
            router.push('/my-application');
          });
        })
        .catch(error => {
          notification.error({
            message: 'Error',
            description: 'You need to install and unlock MetaMask to sign',
            duration: 4.5,
          });
          console.log('error', error);
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
    const { reload, context } = useFetchData(() => {
      return getData(route.params.id as string).then(res => {
        return {
          data: res.data.info,
          total: 100,
        };
      });
    });
    const { context: licenses } = useFetchData(() => {
      return getData(route.params.id as string).then(res => {
        return {
          data: res.data.info.dml.license,
          total: 100,
        };
      });
    });
    return {
      context,
      licenses,
      reload,
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
