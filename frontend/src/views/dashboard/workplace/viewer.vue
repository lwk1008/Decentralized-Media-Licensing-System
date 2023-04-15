<template>
  <div id="userLayout" :class="['user-layout-wrapper']">
    <div class="container">
      <div class="top">
        <div class="header">
          <a href="/">
            <!-- <img src="" class="logo" alt="logo" /> -->
            <span class="title">Royalty Application Form</span>
          </a>
        </div>
        <div class="desc">{{ context.dataSource.hash }}</div>
      </div>

      <div>
        <a-row :gutter="16">
          <a-col :span="16" :offset="4">
            <a-row :gutter="16">
              <a-col :span="24">
                <br />
                <a-descriptions :contentStyle="{ backgroundColor: '#fff' }" size="big" bordered>
                  <a-descriptions-item :span="3" label="Media ID">
                    {{ context.dataSource.mediaId }}
                  </a-descriptions-item>
                  <!-- <a-descriptions-item :span="3" label="Media Name">
                            {{ context.dataSource.mediaName }}
                            </a-descriptions-item> -->
                  <a-descriptions-item :span="3" label="License">
                    {{
                      context.dataSource.licenseName
                        ? context.dataSource.licenseName
                        : context.dataSource.license
                    }}
                  </a-descriptions-item>
                  <a-descriptions-item :span="3" label="Date of Use">
                    {{ context.dataSource.dateOfUse }}
                  </a-descriptions-item>
                  <a-descriptions-item :span="3" label="RAF Hash">
                    {{ context.dataSource.hash }}
                  </a-descriptions-item>
                  <a-descriptions-item :span="3" label="Applicant Address">
                    {{ context.dataSource.applicantAddress }}
                  </a-descriptions-item>
                  <a-descriptions-item :span="3" label="Approver Address">
                    {{ context.dataSource.approverAddress }}
                  </a-descriptions-item>
                  <a-descriptions-item :span="3" label="Application Signature">
                    {{ context.dataSource.applicationSignature }}
                  </a-descriptions-item>

                  <a-descriptions-item :span="3" label="Application Status">
                    <a-tag v-if="context.dataSource.status === 0" color="blue">Pending</a-tag>
                    <a-tag v-else-if="context.dataSource.status === 1" color="green">
                      Approved
                    </a-tag>
                    <a-tag v-else-if="context.dataSource.status === 2" color="red">Decline</a-tag>
                  </a-descriptions-item>
                  <a-descriptions-item :span="3" label="Approver Signature">
                    <span v-if="context.dataSource.status === 1">
                      {{ context.dataSource.approverSignature }}
                    </span>
                  </a-descriptions-item>
                </a-descriptions>
              </a-col>
            </a-row>
          </a-col>
        </a-row>
      </div>

      <div class="footer">
        <!-- <div class="links">
                <a href="_self">帮助</a>
                <a href="_self">隐私</a>
                <a href="_self">条款</a>
            </div> -->
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue';
// import { FormInstance } from 'ant-design-vue';
import { useRoute, useRouter } from 'vue-router';
import request from '@/utils/request';
import { notification } from 'ant-design-vue';
import { useFetchData } from '@/utils/hooks/useFetchData';

interface FormState {
  license: string;
  applicant: string;
  usage: string;
  date: string;
}

async function getData(id: string): Promise<any> {
  return request.get('/raf/rafbyhash', {
    params: {
      hash: id,
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
      request
        .post('/raf/create', {
          doc: {
            mediaId: route.params.id,
            license: values.license,
            applicant: values.applicant,
            usage: values.usage,
            dateOfUse: values.date[0] + ' - ' + values.date[1],
          },
        })
        .then(() => {
          notification.success({
            message: 'Application Submitted',
            description: 'You can check the application status on "My Application" page.',
            duration: 4.5,
          });
          router.push('/my-application');
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
          data: res.data.doc,
          total: 100,
        };
      });
    });

    return {
      context,
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

<style lang="less" scoped>
#userLayout.user-layout-wrapper {
  height: 100%;

  &.mobile {
    .container {
      .main {
        width: 98%;
        max-width: 368px;
      }
    }
  }

  .container {
    position: relative;
    width: 100%;
    min-height: 100%;
    padding: 110px 0 144px;
    background-image: url(~@/assets/background.svg);
    background-repeat: no-repeat;
    background-position: center 110px;
    background-size: 100%;

    a {
      text-decoration: none;
    }

    .top {
      text-align: center;

      .header {
        height: 44px;
        line-height: 44px;

        .badge {
          position: absolute;
          display: inline-block;
          margin-top: -10px;
          margin-left: -12px;
          line-height: 1;
          vertical-align: middle;
          opacity: 0.8;
        }

        .logo {
          height: 44px;
          margin-right: 16px;
          vertical-align: top;
          border-style: none;
        }

        .title {
          position: relative;
          top: 2px;
          color: @text-color;
          font-weight: 600;
          font-size: 33px;
          font-family: Avenir, 'Helvetica Neue', Arial, Helvetica, sans-serif;
        }
      }
      .desc {
        margin-top: 12px;
        margin-bottom: 40px;
        color: @text-color-secondary;
        font-size: 14px;
      }
    }

    .main {
      width: 368px;
      min-width: 260px;
      margin: 0 auto;
    }

    .footer {
      position: absolute;
      bottom: 0;
      width: 100%;
      margin: 48px 0 24px;
      padding: 0 16px;
      text-align: center;

      .links {
        margin-bottom: 8px;
        font-size: 14px;
        a {
          color: @text-color-secondary;
          transition: all 0.3s;
          &:not(:last-child) {
            margin-right: 40px;
          }
        }
      }
      .copyright {
        color: @text-color-secondary;
        font-size: 14px;
      }
    }
  }
}
</style>
