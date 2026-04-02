<script setup lang="ts">
import { ref } from "vue";
import { setMockSession } from "../../lib/session";

const phone = ref("");
const code = ref("");
const loading = ref(false);

function submitLogin() {
  if (!phone.value || !code.value) {
    uni.showToast({ title: "请先输入手机号和验证码", icon: "none" });
    return;
  }
  loading.value = true;
  setTimeout(() => {
    setMockSession();
    loading.value = false;
    uni.redirectTo({ url: "/pages/city/index" });
  }, 300);
}
</script>

<template>
  <view class="screen">
    <view class="card">
      <text class="title" style="font-size: 24px">手机号验证码登录</text>
      <text class="subtitle">当前为占位版本，后续接入真实短信服务。</text>

      <text class="field-label">手机号</text>
      <input class="field-input" type="number" maxlength="11" v-model="phone" placeholder="请输入手机号" />

      <text class="field-label">验证码</text>
      <input class="field-input" type="number" maxlength="6" v-model="code" placeholder="请输入验证码" />

      <button class="btn-primary" @tap="submitLogin" :loading="loading">登录</button>
    </view>
  </view>
</template>
