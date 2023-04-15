<template>
  <div class="main">
    <a-form id="formLogin" layout="vertical" class="user-layout-login">
      <a-form-item>
        <a-button
          size="large"
          type="primary"
          html-type="submit"
          class="login-button"
          :loading="loginBtn"
          @click="handleMetaMaskLogin"
        >
          Login with MetaMask
        </a-button>
      </a-form-item>

    </a-form>
  </div>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from 'vue';
import { notification } from 'ant-design-vue';
import { useForm } from 'ant-design-vue/es/form';
import type { AxiosError } from 'axios';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { LOGIN } from '@/store/modules/user/actions';
import { ethers } from 'ethers';
import request from '@/utils/request';

export default defineComponent({
  name: 'Login',
  setup() {
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const state = reactive({
      customActiveKey: 'tab1',
      loginBtn: false,
      // login type: 0 email, 1 username, 2 telephone
      loginType: 0,
      isLoginError: false,
      requiredTwoStepCaptcha: false,
      stepCaptchaVisible: false,

      time: 60,
      smsSendBtn: false,
    });

    const handleUsernameOrEmail = (_rule: any, value: any) => {
      return new Promise(resolve => {
        const regex = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+((\.[a-zA-Z0-9_-]{2,3}){1,2})$/;
        if (regex.test(value)) {
          state.loginType = 0;
        } else {
          state.loginType = 1;
        }
        resolve(state.loginType);
      });
    };
    const modelRef = reactive({
      rememberMe: true,
      username: '',
      password: '',
      mobile: '',
      captcha: '',
    });
    const rulesRef = reactive({
      rememberMe: undefined,
      username: [
        { required: true, message: '请输入帐户名或邮箱地址', type: 'string' },
        { validator: handleUsernameOrEmail, trigger: 'change' },
      ],
      password: [
        { required: true, message: '请输入密码', type: 'string', trigger: ['blur', 'change'] },
      ],
      mobile: [
        {
          required: true,
          // pattern: /^1[34578]\d{9}$/,
          message: '请输入正确的手机号',
          trigger: ['blur', 'change'],
        },
      ],
      captcha: [{ required: true, message: '请输入验证码' }],
    });
    const { validateInfos, validate, resetFields } = useForm(modelRef, rulesRef);

    const handleTabClick = (key: string) => {
      state.customActiveKey = key;
      resetFields();
    };

    const requestFailed = (err: AxiosError) => {
      console.log('requestFailed', err?.response?.data?.errorMessage);
      state.isLoginError = true;
      // notification.error({
      //   message: '错误',
      //   description: ((err.response || {}).data || {}).errorMessage || '请求出现错误，请稍后再试',
      //   duration: 4,
      // });
    };

    const loginSuccess = () => {
      router.push(decodeURIComponent((route.query?.redirect as string) || '') || '/');
      // 延迟 1 秒显示欢迎信息
      // setTimeout(() => {
      //   notification.success({
      //     message: '欢迎',
      //     description: '欢迎回来',
      //   });
      // }, 1000);
      state.isLoginError = false;
    };

    const handleMetaMaskLogin = async () => {
      const { ethereum } = window as any;
      ethereum.request({ method: 'eth_requestAccounts' })
        .then(async () => {
          const provider = new ethers.providers.Web3Provider(ethereum);
          // let provider = new ethers.providers.WebSocketProvider(
          //   'wss://rinkeby.infura.io/ws/v3/c534ef8f240747dcb3df378605c8094d',
          // );
          const signer = provider.getSigner();
          const publicKey = await signer.getAddress();
          //const hash = await ethers.utils.keccak256(ethAddress);
          //const sig = await signer.signMessage(ethers.utils.arrayify(hash));
          //const publicKey = ethers.utils.recoverPublicKey(hash, sig);
          const res: any = await request.post('http://localhost:3000/api/login/nonce', {
            publicKey,
          });
          const nonce = res.data.nonce as string;
          console.log('nonce', nonce);
          const signature = await signer.signMessage(nonce);
          store
            .dispatch(`user/${LOGIN}`, {
              publicKey,
              signature,
            })
            .then(() => {
              loginSuccess();
            })
            .catch(err => {
              requestFailed(err);
            });
          // router.push(decodeURIComponent((route.query?.redirect as string) || '') || '/');
          // state.isLoginError = false;
        })
        .catch(error => {
          notification.error({
            message: 'Error',
            description: 'You need to install and unlock MetaMask to login',
            duration: 4.5,
          });
          console.log('error', error);
        });
    };

    const handleSubmit = (e: Event) => {
      e.preventDefault();
      const validateNames =
        state.customActiveKey === 'tab1' ? ['username', 'password'] : ['mobile', 'captcha'];
      state.loginBtn = true;
      validate(validateNames)
        .then(values => {
          console.log('values', values);
          store
            .dispatch(`user/${LOGIN}`, {
              ...values,
              type: state.customActiveKey === 'tab1',
            })
            .then(() => {
              loginSuccess();
            })
            .catch(err => {
              requestFailed(err);
            })
            .finally(() => {
              state.loginBtn = false;
            });
        })
        .catch((/*err*/) => {
          // 屏蔽错误处理
          // requestFailed(err);
          state.loginBtn = false;
        });
    };
    // this.loginBtn = false;
    // this.stepCaptchaVisible = false;

    return {
      ...toRefs(state),
      modelRef,
      validateInfos,

      handleTabClick,
      handleSubmit,
      handleMetaMaskLogin,
    };
  },
  components: {
  },
});
</script>

<style lang="less" scoped>
.user-layout-login {
  label {
    font-size: 14px;
  }

  .getCaptcha {
    display: block;
    width: 100%;
    height: 40px;
  }

  .forge-password {
    font-size: 14px;
  }

  button.login-button {
    width: 100%;
    height: 40px;
    padding: 0 15px;
    font-size: 16px;
  }

  .user-login-other {
    margin-top: 24px;
    line-height: 22px;
    text-align: left;

    .item-icon {
      margin-left: 16px;
      color: @disabled-color;
      font-size: 24px;
      vertical-align: middle;
      cursor: pointer;
      transition: color 0.3s;

      &:hover {
        color: @primary-color;
      }
    }

    .register {
      float: right;
    }
  }
  .prefixIcon {
    color: @primary-color;
    font-size: @font-size-base;
  }
}
</style>
