<script setup lang="ts">
import { onShow } from "@dcloudio/uni-app";
import { isLoggedIn } from "../../lib/session";

onShow(() => {
  if (isLoggedIn()) {
    uni.switchTab({ url: "/pages/map/index" });
  }
});

function goLogin() {
  uni.navigateTo({ url: "/pages/login/index" });
}
</script>

<template>
  <view class="screen">
    <view style="margin-top: 64px" class="card">
      <text class="title">不知道吃什么？先问本地人！</text>
      <button class="btn-primary" @tap="goLogin">手机号登录</button>
    </view>
  </view>
</template>
