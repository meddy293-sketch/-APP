<script setup lang="ts">
import { setCityChangsha } from "../../lib/session";

function enterApp() {
  setCityChangsha();
  uni.switchTab({ url: "/pages/map/index" });
}
</script>

<template>
  <view class="screen">
    <view class="card">
      <text class="title" style="font-size: 24px">选择城市</text>
      <text class="subtitle">当前开放城市</text>

      <view
        style="
          margin-top: 16px;
          border: 1px solid #111827;
          border-radius: 12px;
          background: #ffffff;
          padding: 14px;
        "
      >
        <text style="font-size: 18px; font-weight: 600">长沙</text>
      </view>

      <text class="subtitle" style="display: block">更多城市开放中</text>
      <button class="btn-primary" @tap="enterApp">进入本地人</button>
    </view>
  </view>
</template>
