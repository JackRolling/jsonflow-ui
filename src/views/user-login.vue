<template>
  <div>
    <el-form
      ref="loginForm"
      :rules="loginRules"
      :model="loginForm"
      class="login-form"
      status-icon
      label-width="0"
    >
      <el-form-item prop="username">
        <el-input
          v-model="loginForm.username"
          auto-complete="off"
          placeholder="请输入用户名"
          @keyup.enter.native="handleLogin"
        >
          <i slot="prefix" class="el-icon-user-solid"/>
        </el-input>
      </el-form-item>
      <el-form-item prop="password">
        <el-input
          :type="passwordType"
          v-model="loginForm.password"
          auto-complete="off"
          placeholder="请输入密码"
          @keyup.enter.native="handleLogin"
        >
          <i slot="suffix" class="el-icon-view el-input__icon" @click="showPassword"/>
          <i slot="prefix" class="el-icon-key"></i>
        </el-input>
      </el-form-item>

      <el-form-item>
        <el-button
          type="primary" plain
          class="login-submit" round
          @click.native.prevent="handleLogin"
        >登录
        </el-button>
      </el-form-item>
    </el-form>
    <div class="login-copyright">
      Copyright © 2022 {{ info.author }}. All rights reserved.
      <span>JsonFlow {{ info.version }}</span>
      <span style="margin-left: 10px;">
            <el-badge is-dot>
              <el-icon name="bell"/>
            </el-badge>
            <a :href="info.gitee" target="_blank">获取开源版本</a>
          </span>
    </div>
  </div>
</template>

<script>
  import {setStore} from '@/utils/store'
  import {encryption, loginByUsername} from "@/api/admin";
  import {DIC_PROP} from "@/utils/dict-prop";

  export default {
    name: "Userlogin",
    components: {},
    data() {
      return {
        info: {
          version: "1.0.0",
          author: "Jack luolin",
          gitee: "https://gitee.com/jackrolling/json-flow"
        },
        loginForm: {
          username: "admin",
          password: "123456"
        },
        loginRules: {
          username: [
            {required: true, message: "请输入用户名", trigger: "blur"},
            {
              pattern: /^([a-z\u4e00-\u9fa5\d]*?)$/, message: "请输入小写字母", trigger: "blur"
            }
          ],
          password: [
            {required: true, message: "请输入密码", trigger: "blur"},
            {min: 6, message: "密码长度最少为6位", trigger: "blur"},
          ],
        },
        passwordType: "password",
      };
    },
    computed: {},
    methods: {
      showPassword() {
        this.passwordType === "" ? (this.passwordType = "password") : (this.passwordType = "");
      },
      handleLogin() {
        if (DIC_PROP.isNeedService) {
          this.LoginByUsername(this.loginForm).then(() => {
            this.$router.push({path: "/flow-design"});
          });
        } else {
          this.$router.push({path: "/flow-design"});
        }
      },
      // 根据用户名登录
      LoginByUsername(userInfo) {
        let user = encryption({
          data: userInfo,
          key: 'pigxpigxpigxpigx',
          param: ['password']
        })
        return new Promise((resolve, reject) => {
          loginByUsername(user.username, user.password, user.code, user.randomStr).then(response => {
            const data = response.data
            setStore({
              name: 'access_token',
              content: data.access_token,
              type: 'session'
            })
            resolve()
          }).catch(error => {
            reject(error)
          })
        })
      }
    }
  };
</script>

<style lang="less">
  .login-form {
    margin: 300px 680px;
    text-align: center;
    width: 30%;
    input {
      border: 0;
    }
  }
  .login-submit {
    width: 100%;
    height: 45px;
    letter-spacing: 5px;
    text-indent: 5px;
  }

  .login-copyright {
    color: #999;
    width: 100%;
    position: fixed;
    bottom: 30px;
    text-align: center;
  }

  .foot {
    height: 30px!important;
    text-align: center;
    padding: 4px 8px;
    /*自适应底部*/
    position: sticky;
    bottom: 0;
  }
</style>
