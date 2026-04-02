const KEY_LOGIN = "isLoggedIn";
const KEY_TOKEN = "token";
const KEY_ROLE = "userRole";
const KEY_CITY = "city";

export function isLoggedIn(): boolean {
  return uni.getStorageSync(KEY_LOGIN) === "1";
}

export function setMockSession() {
  uni.setStorageSync(KEY_LOGIN, "1");
  uni.setStorageSync(KEY_TOKEN, "mock_token");
  uni.setStorageSync(KEY_ROLE, "normal");
}

export function setCityChangsha() {
  uni.setStorageSync(KEY_CITY, "长沙");
}

export function clearSession() {
  uni.removeStorageSync(KEY_LOGIN);
  uni.removeStorageSync(KEY_TOKEN);
  uni.removeStorageSync(KEY_ROLE);
  uni.removeStorageSync(KEY_CITY);
}
