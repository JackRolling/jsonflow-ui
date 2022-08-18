import request from '@/router/axios'
import {setStore} from '@/utils/store'
import qs from 'qs'
import * as CryptoJS from "crypto-js";

export const loginByUsername = (username, password, code, randomStr) => {
  let grant_type = 'password'
  let dataObj = qs.stringify({'username': username, 'password': password})
  let basicAuth = 'Basic ' + window.btoa('test:test')

  setStore({
    name: 'basicAuth',
    content: basicAuth,
    type: 'session'
  })

  return request({
    url: '/auth/oauth/token',
    headers: {
      isToken: false,
      'TENANT-ID': '1',
      'Authorization': basicAuth
    },
    method: 'post',
    params: {randomStr, code, grant_type},
    data: dataObj
  })
}

/**
 *加密处理
 */
export const encryption = params => {
  let { data, type, param, key } = params;
  const result = JSON.parse(JSON.stringify(data));
  if (type === "Base64") {
    param.forEach(ele => {
      result[ele] = btoa(result[ele]);
    });
  } else {
    param.forEach(ele => {
      var data = result[ele];
      key = CryptoJS.enc.Latin1.parse(key);
      var iv = key;
      // 加密
      var encrypted = CryptoJS.AES.encrypt(data, key, {
        iv: iv,
        mode: CryptoJS.mode.CFB,
        padding: CryptoJS.pad.NoPadding
      });
      result[ele] = encrypted.toString();
    });
  }
  return result;
};
