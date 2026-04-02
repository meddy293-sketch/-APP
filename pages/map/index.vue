<script setup lang="ts">
const changshaCenter = "长沙中心点（占位）：28.2282, 112.9388";
</script>

<template>
  <view class="screen">
    <view class="card">
      <text class="title" style="font-size: 22px">长沙地图</text>
      <text class="subtitle">外地人第一次打开，先停留在这里。</text>

      <view
        style="
          margin-top: 16px;
          border-radius: 14px;
          background: #e5f0ff;
          height: 340px;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          padding: 12px;
          box-sizing: border-box;
        "
      >
        <text style="color: #1d4ed8">{{ changshaCenter }}</text>
      </view>
    </view>
  </view>
</template>
