import request from '@/utils/request';
export interface LoginParams {
  publicKey: string;
  signature: string;
}

export interface LoginResp {
  data: {
    jwt: string;
  };
  // currentAuthority: string;
}

export interface UserInfo {
  id: string | number;
  avatar: string;
  name: string;
}

export async function postAccountLogin(params: LoginParams) {
  return request.post<LoginParams, LoginResp>('http://localhost:3000/api/login/verify', params);
}

export async function getCurrentUser() {
  return request.get<any, UserInfo>('/user/current');
}

export async function postLogout() {
  return request.post<any, any>('/logout');
}

