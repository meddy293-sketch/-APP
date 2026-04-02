<script setup lang="ts">
import { computed, ref, nextTick, onMounted } from "vue";

/* ── Types ── */
type Step = "welcome" | "login" | "profile" | "verify" | "main";
type Tab = "map" | "create" | "cards";

/* ── State ── */
const isReadyMain =
  localStorage.getItem("isLoggedIn") === "1" &&
  localStorage.getItem("localVerified") === "1";
const step = ref<Step>(isReadyMain ? "main" : "welcome");
const prevStep = ref<Step>("welcome");
const tab = ref<Tab>("cards");
const phone = ref("");
const code = ref("");
const city = ref(localStorage.getItem("city") || "长沙");
const appIconSrc = "/本地人icon.jpeg";
const iconMissing = ref(false);
const nickname = ref("");
const gender = ref("");
const ageRange = ref("");
const yearsInChangsha = ref("");
const subdistrict = ref("");
const frequentPlaces = ref("");
const q1 = ref("");
const q2 = ref("");
const q3 = ref("");
const transitioning = ref(false);

/* ── Swipe card state ── */
const currentCardIndex = ref(0);
const swipeX = ref(0);
const swipeY = ref(0);
const swiping = ref(false);
const swipeStartX = ref(0);
const swipeStartY = ref(0);
const swipeDecision = ref<"" | "like" | "nope">("");
const cardLeaving = ref<"" | "left" | "right">("");

const mockCards = [
  {
    id: 1,
    shopName: "龙记米粉",
    area: "香蜜湖",
    hook: "老板脸臭，但牛肉粉全深圳前三。汤底是真骨熬的，不是粉剂冲的。",
    recommender: "老王",
    years: 20,
    badge: "深圳老炮",
    tags: ["湖南胃", "粉面专家"],
    distance: "1.2km",
    img: "https://images.unsplash.com/photo-1555126634-323283e090fa?w=600&h=400&fit=crop",
  },
  {
    id: 2,
    shopName: "文和友老长沙龙虾馆",
    area: "海信广场",
    hook: "来长沙不吃这家龙虾等于白来。口味虾必点，麻辣小龙虾是灵魂。",
    recommender: "芙蓉姐",
    years: 15,
    badge: "长沙土著",
    tags: ["夜宵王", "辣不怕"],
    distance: "800m",
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&h=400&fit=crop",
  },
  {
    id: 3,
    shopName: "黑色经典臭豆腐",
    area: "坡子街",
    hook: "游客都排那家，本地人只来这家。外酥里嫩，蒜泥酱是灵魂。",
    recommender: "岳麓山人",
    years: 8,
    badge: "河西老饕",
    tags: ["小吃达人", "街头美食"],
    distance: "2.1km",
    img: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop",
  },
  {
    id: 4,
    shopName: "壹盏灯",
    area: "南门口",
    hook: "深巷里的湘菜馆，没招牌没装修，但辣椒炒肉能让你想起外婆家。",
    recommender: "南门口李哥",
    years: 25,
    badge: "天心区元老",
    tags: ["湘菜控", "深巷猎人"],
    distance: "3.4km",
    img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop",
  },
  {
    id: 5,
    shopName: "茶颜悦色",
    area: "五一广场",
    hook: "幽兰拿铁永远的神。外地奶茶跟这比就是刷锅水，不接受反驳。",
    recommender: "奶茶妹",
    years: 6,
    badge: "芙蓉区通",
    tags: ["奶茶专家", "甜党"],
    distance: "1.8km",
    img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop",
  },
];

const currentCard = computed(() => mockCards[currentCardIndex.value % mockCards.length]);
const nextCard = computed(() => mockCards[(currentCardIndex.value + 1) % mockCards.length]);

/* ── Map POIs (mock) ── */
const mapPois = [
  { name: "老王", years: 20, badge: "深圳老炮", x: 22, y: 30, avatar: "👨‍🍳" },
  { name: "芙蓉姐", years: 15, badge: "长沙土著", x: 62, y: 42, avatar: "👩‍🍳" },
  { name: "岳麓山人", years: 8, badge: "河西老饕", x: 38, y: 65, avatar: "🧑‍🍳" },
  { name: "南门口李哥", years: 25, badge: "天心区元老", x: 72, y: 72, avatar: "👨" },
  { name: "奶茶妹", years: 6, badge: "芙蓉区通", x: 48, y: 25, avatar: "👩" },
];

const selectedPoi = ref<number | null>(null);

/* ── Navigation helpers ── */
function goStep(next: Step) {
  prevStep.value = step.value;
  transitioning.value = true;
  setTimeout(() => {
    step.value = next;
    nextTick(() => {
      transitioning.value = false;
    });
  }, 180);
}

function goLogin() {
  goStep("login");
}

function goBack() {
  if (step.value === "login") goStep("welcome");
  else if (step.value === "profile") goStep("login");
  else if (step.value === "verify") goStep("profile");
}

function submitLogin() {
  if (!phone.value || !code.value) return;
  localStorage.setItem("isLoggedIn", "1");
  localStorage.setItem("token", "mock_token");
  localStorage.setItem("userRole", "normal");
  goStep("profile");
}

function fillTestCredentials() {
  phone.value = "13800138000";
  code.value = "123456";
}

function goVerify() {
  if (!nickname.value || !gender.value || !ageRange.value || !yearsInChangsha.value || !subdistrict.value || !frequentPlaces.value)
    return;
  goStep("verify");
}

function submitVerify() {
  if (!q1.value || !q2.value || !q3.value) return;
  localStorage.setItem("city", "长沙");
  localStorage.setItem("localVerified", "1");
  localStorage.setItem("userRole", "local_verified");
  localStorage.setItem("nickname", nickname.value);
  goStep("main");
  tab.value = "cards";
}

function devResetAll() {
  localStorage.removeItem("isLoggedIn");
  localStorage.removeItem("token");
  localStorage.removeItem("userRole");
  localStorage.removeItem("city");
  localStorage.removeItem("localVerified");
  localStorage.removeItem("nickname");
  phone.value = "";
  code.value = "";
  nickname.value = "";
  gender.value = "";
  ageRange.value = "";
  yearsInChangsha.value = "";
  subdistrict.value = "";
  frequentPlaces.value = "";
  q1.value = "";
  q2.value = "";
  q3.value = "";
  step.value = "welcome";
  tab.value = "cards";
}

/* ── Swipe logic ── */
function onTouchStart(e: TouchEvent) {
  swiping.value = true;
  swipeStartX.value = e.touches[0].clientX;
  swipeStartY.value = e.touches[0].clientY;
  swipeX.value = 0;
  swipeY.value = 0;
  swipeDecision.value = "";
}
function onTouchMove(e: TouchEvent) {
  if (!swiping.value) return;
  swipeX.value = e.touches[0].clientX - swipeStartX.value;
  swipeY.value = (e.touches[0].clientY - swipeStartY.value) * 0.3;
  if (swipeX.value > 50) swipeDecision.value = "like";
  else if (swipeX.value < -50) swipeDecision.value = "nope";
  else swipeDecision.value = "";
}
function onTouchEnd() {
  swiping.value = false;
  if (Math.abs(swipeX.value) > 100) {
    cardLeaving.value = swipeX.value > 0 ? "right" : "left";
    setTimeout(() => {
      currentCardIndex.value++;
      cardLeaving.value = "";
      swipeX.value = 0;
      swipeY.value = 0;
      swipeDecision.value = "";
    }, 280);
  } else {
    swipeX.value = 0;
    swipeY.value = 0;
    swipeDecision.value = "";
  }
}
/* Mouse fallback */
function onMouseDown(e: MouseEvent) {
  swiping.value = true;
  swipeStartX.value = e.clientX;
  swipeStartY.value = e.clientY;
  swipeX.value = 0;
  swipeY.value = 0;
  swipeDecision.value = "";
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);
}
function onMouseMove(e: MouseEvent) {
  if (!swiping.value) return;
  swipeX.value = e.clientX - swipeStartX.value;
  swipeY.value = (e.clientY - swipeStartY.value) * 0.3;
  if (swipeX.value > 50) swipeDecision.value = "like";
  else if (swipeX.value < -50) swipeDecision.value = "nope";
  else swipeDecision.value = "";
}
function onMouseUp() {
  document.removeEventListener("mousemove", onMouseMove);
  document.removeEventListener("mouseup", onMouseUp);
  onTouchEnd();
}

function btnSwipe(dir: "left" | "right") {
  swipeX.value = dir === "right" ? 160 : -160;
  swipeDecision.value = dir === "right" ? "like" : "nope";
  cardLeaving.value = dir === "right" ? "right" : "left";
  setTimeout(() => {
    currentCardIndex.value++;
    cardLeaving.value = "";
    swipeX.value = 0;
    swipeY.value = 0;
    swipeDecision.value = "";
  }, 320);
}

const cardStyle = computed(() => {
  if (cardLeaving.value === "right") return { transform: "translateX(120%) rotate(18deg)", opacity: "0", transition: "all .28s ease-out" };
  if (cardLeaving.value === "left") return { transform: "translateX(-120%) rotate(-18deg)", opacity: "0", transition: "all .28s ease-out" };
  if (swipeX.value === 0 && swipeY.value === 0) return { transform: "none", transition: "transform .22s ease, opacity .22s ease" };
  const rotate = swipeX.value * 0.06;
  return {
    transform: `translate(${swipeX.value}px, ${swipeY.value}px) rotate(${rotate}deg)`,
    transition: swiping.value ? "none" : "transform .22s ease, opacity .22s ease",
  };
});

/* profile completeness */
const profileReady = computed(() =>
  !!(nickname.value && gender.value && ageRange.value && yearsInChangsha.value && subdistrict.value && frequentPlaces.value)
);
const quizReady = computed(() => !!(q1.value && q2.value && q3.value));
const loginReady = computed(() => !!(phone.value && code.value));
</script>

<template>
  <main class="screen">
    <div class="phone-shell">
      <!-- ===== Status bar ===== -->
      <div class="ios-status-bar">
        <span class="status-time">9:41</span>
        <div class="status-icons">
          <svg width="16" height="11" viewBox="0 0 16 11"><path d="M8 2.6a6.6 6.6 0 0 1 4.7 1.9.6.6 0 0 0 .8-.8A7.8 7.8 0 0 0 8 1.2a7.8 7.8 0 0 0-5.5 2.5.6.6 0 0 0 .8.8A6.6 6.6 0 0 1 8 2.6zm0 2.8c1.3 0 2.5.5 3.4 1.3a.6.6 0 0 0 .8-.8A5.4 5.4 0 0 0 8 4.2a5.4 5.4 0 0 0-4.2 1.7.6.6 0 0 0 .8.8A4.2 4.2 0 0 1 8 5.4zm0 2.8c.8 0 1.5.3 2 .8a.6.6 0 0 0 .9-.8A3.4 3.4 0 0 0 8 7a3.4 3.4 0 0 0-2.9 1.2.6.6 0 0 0 .8.8c.6-.5 1.3-.8 2.1-.8zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" fill="currentColor"/></svg>
          <svg width="15" height="11" viewBox="0 0 15 11"><rect x="0" y="3" width="2" height="8" rx="0.5" fill="currentColor" opacity=".4"/><rect x="3.5" y="2" width="2" height="9" rx="0.5" fill="currentColor" opacity=".6"/><rect x="7" y="1" width="2" height="10" rx="0.5" fill="currentColor" opacity=".8"/><rect x="10.5" y="0" width="2" height="11" rx="0.5" fill="currentColor"/></svg>
          <svg width="25" height="12" viewBox="0 0 25 12"><rect x="0" y="1" width="21" height="10" rx="2" stroke="currentColor" stroke-width="1" fill="none"/><rect x="22" y="3.5" width="2" height="5" rx="1" fill="currentColor" opacity=".4"/><rect x="1.5" y="2.5" width="14" height="7" rx="1" fill="currentColor"/></svg>
        </div>
      </div>

      <!-- ===== Page transition wrapper ===== -->
      <div :class="['page-content', { 'page-exit': transitioning }]">

        <!-- WELCOME -->
        <section v-if="step === 'welcome'" class="page welcome-page">
          <div class="welcome-spacer"></div>
          <div class="welcome-icon-wrap anim-item anim-1">
            <img v-if="!iconMissing" :src="appIconSrc" class="app-icon-hero" alt="本地人" @error="iconMissing = true" />
            <div v-else class="app-icon-hero app-icon-fallback">本</div>
          </div>
          <h1 class="welcome-title anim-item anim-2">
            <span>不知道吃什么？</span>
            <span>先问本地人！</span>
          </h1>
          <p class="welcome-sub anim-item anim-3">基于本地人身份的真实种草社区</p>
          <div class="welcome-spacer"></div>
          <button class="btn-hero anim-item anim-4" @click="goLogin">开始体验</button>
          <p class="welcome-hint anim-item anim-5">登录即表示同意《用户协议》与《隐私政策》</p>
        </section>

        <!-- LOGIN -->
        <section v-else-if="step === 'login'" class="page form-page">
          <div class="ios-nav">
            <button class="nav-back" @click="goBack">
              <svg width="10" height="18" viewBox="0 0 10 18"><path d="M9 1L1 9l8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
            </button>
            <span class="nav-title">登录</span>
            <span class="nav-spacer"></span>
          </div>
          <div class="form-body">
            <h2 class="form-headline">欢迎回来</h2>
            <p class="form-sub">输入手机号，成为本地人</p>

            <div class="ios-field-group">
              <div class="ios-field">
                <span class="ios-field-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="5" y="2" width="14" height="20" rx="3"/><line x1="12" y1="18" x2="12" y2="18.01" stroke-width="2"/></svg>
                </span>
                <input v-model="phone" type="tel" maxlength="11" placeholder="手机号" class="ios-field-input" />
              </div>
              <div class="ios-field-divider"></div>
              <div class="ios-field">
                <span class="ios-field-icon">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0110 0v4"/></svg>
                </span>
                <input v-model="code" type="text" maxlength="6" placeholder="验证码" class="ios-field-input" />
                <button class="sms-btn">获取验证码</button>
              </div>
            </div>

            <button :class="['btn-primary', { disabled: !loginReady }]" @click="submitLogin">登录</button>
            <button class="btn-ghost" @click="fillTestCredentials">使用测试账号</button>
          </div>
        </section>

        <!-- PROFILE -->
        <section v-else-if="step === 'profile'" class="page form-page">
          <div class="ios-nav">
            <button class="nav-back" @click="goBack">
              <svg width="10" height="18" viewBox="0 0 10 18"><path d="M9 1L1 9l8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
            </button>
            <span class="nav-title">本地人建档</span>
            <span class="nav-spacer"></span>
          </div>
          <div class="form-body">
            <div class="profile-header">
              <div class="step-pills">
                <span class="step-pill active">1 建档</span>
                <span class="step-pill">2 验证</span>
              </div>
              <h2 class="form-headline">你好呀，长沙人！</h2>
              <p class="form-sub">完善你的本地人档案</p>
            </div>

            <div class="ios-field-group">
              <div class="ios-field">
                <label class="ios-field-label">昵称</label>
                <input v-model="nickname" type="text" maxlength="16" placeholder="例如：河西夜宵王" class="ios-field-input" />
              </div>
              <div class="ios-field-divider"></div>
              <div class="ios-field">
                <label class="ios-field-label">性别</label>
                <select v-model="gender" class="ios-field-select">
                  <option disabled value="">请选择</option>
                  <option>女</option>
                  <option>男</option>
                  <option>不方便透露</option>
                </select>
              </div>
              <div class="ios-field-divider"></div>
              <div class="ios-field">
                <label class="ios-field-label">年龄段</label>
                <select v-model="ageRange" class="ios-field-select">
                  <option disabled value="">请选择</option>
                  <option>18-22</option>
                  <option>23-27</option>
                  <option>28-32</option>
                  <option>33-40</option>
                  <option>40+</option>
                </select>
              </div>
            </div>

            <div class="ios-field-group">
              <div class="ios-field">
                <label class="ios-field-label">在长沙</label>
                <select v-model="yearsInChangsha" class="ios-field-select">
                  <option disabled value="">选年限</option>
                  <option>1-2年</option>
                  <option>3-5年</option>
                  <option>6-10年</option>
                  <option>10年以上</option>
                  <option>没离开过！</option>
                </select>
              </div>
              <div class="ios-field-divider"></div>
              <div class="ios-field">
                <label class="ios-field-label">所在区</label>
                <select v-model="subdistrict" class="ios-field-select">
                  <option disabled value="">请选择</option>
                  <option>天心区</option>
                  <option>芙蓉区</option>
                  <option>开福区</option>
                  <option>岳麓区</option>
                  <option>雨花区</option>
                  <option>望城区</option>
                  <option>长沙县</option>
                </select>
              </div>
              <div class="ios-field-divider"></div>
              <div class="ios-field">
                <label class="ios-field-label">常去</label>
                <input v-model="frequentPlaces" type="text" maxlength="50" placeholder="解放西、南门口…" class="ios-field-input" />
              </div>
            </div>

            <button :class="['btn-primary', { disabled: !profileReady }]" @click="goVerify">下一步</button>
          </div>
        </section>

        <!-- VERIFY -->
        <section v-else-if="step === 'verify'" class="page form-page">
          <div class="ios-nav">
            <button class="nav-back" @click="goBack">
              <svg width="10" height="18" viewBox="0 0 10 18"><path d="M9 1L1 9l8 8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none"/></svg>
            </button>
            <span class="nav-title">本地人验证</span>
            <span class="nav-spacer"></span>
          </div>
          <div class="form-body">
            <div class="profile-header">
              <div class="step-pills">
                <span class="step-pill done">1 建档</span>
                <span class="step-pill active">2 验证</span>
              </div>
              <h2 class="form-headline">证明你是长沙人</h2>
              <p class="form-sub">回答 3 道冷知识，通过即可获得本地人身份</p>
            </div>

            <div class="quiz-card" v-for="(quiz, qi) in [
              { q: '长沙最有代表性的江是？', opts: ['湘江','赣江','乌江'], model: q1 },
              { q: '长沙最常见的城市味道标签是？', opts: ['辣','清淡','偏甜'], model: q2 },
              { q: '长沙夜生活代表区域更接近？', opts: ['解放西路','黄浦江','三里屯'], model: q3 },
            ]" :key="qi">
              <p class="quiz-q">{{ qi + 1 }}. {{ quiz.q }}</p>
              <div class="quiz-opts">
                <label v-for="opt in quiz.opts" :key="opt"
                  :class="['quiz-opt', { selected: (qi === 0 ? q1 : qi === 1 ? q2 : q3) === opt }]"
                >
                  <input
                    type="radio"
                    :name="'q'+qi"
                    :value="opt"
                    class="quiz-radio-hidden"
                    @change="qi === 0 ? q1 = opt : qi === 1 ? q2 = opt : q3 = opt"
                  />
                  <span class="quiz-check">
                    <svg v-if="(qi === 0 ? q1 : qi === 1 ? q2 : q3) === opt" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>
                  </span>
                  {{ opt }}
                </label>
              </div>
            </div>

            <button :class="['btn-primary', { disabled: !quizReady }]" @click="submitVerify">验证完成，进入本地人</button>
          </div>
        </section>

        <!-- ===== MAIN APP ===== -->
        <section v-else class="page main-page">
          <!-- Tab: Cards (Tinder) -->
          <div v-if="tab === 'cards'" class="cards-tab">
            <div class="cards-header">
              <h2 class="cards-title">发现好吃的</h2>
              <p class="cards-sub">左滑跳过 · 右滑收藏</p>
            </div>

            <div class="swipe-area">
              <!-- Next card (behind) -->
              <div class="swipe-card swipe-card-behind">
                <div class="card-img" :style="{ backgroundImage: `url(${nextCard.img})` }"></div>
              </div>

              <!-- Current card -->
              <div
                class="swipe-card swipe-card-front"
                :style="cardStyle"
                @touchstart.prevent="onTouchStart"
                @touchmove.prevent="onTouchMove"
                @touchend="onTouchEnd"
                @mousedown.prevent="onMouseDown"
              >
                <!-- Decision overlay -->
                <div :class="['card-stamp stamp-like', { show: swipeDecision === 'like' }]">可以可以</div>
                <div :class="['card-stamp stamp-nope', { show: swipeDecision === 'nope' }]">不了不了</div>

                <div class="card-img" :style="{ backgroundImage: `url(${currentCard.img})` }">
                  <div class="card-img-overlay"></div>
                  <div class="card-img-content">
                    <div class="card-shop-name">{{ currentCard.shopName }}</div>
                    <div class="card-area">{{ currentCard.area }} · {{ currentCard.distance }}</div>
                  </div>
                </div>
                <div class="card-body">
                  <div class="card-recommender">
                    <div class="card-avatar-ring">
                      <div class="card-avatar-placeholder">{{ currentCard.recommender[0] }}</div>
                    </div>
                    <div class="card-rec-info">
                      <span class="card-rec-name">{{ currentCard.recommender }}</span>
                      <span class="card-rec-badge">{{ currentCard.years }}年{{ city }}人 · {{ currentCard.badge }}</span>
                    </div>
                  </div>
                  <p class="card-hook">"{{ currentCard.hook }}"</p>
                  <div class="card-tags">
                    <span v-for="t in currentCard.tags" :key="t" class="card-tag">{{ t }}</span>
                  </div>
                </div>
              </div>
            </div>

            <div class="swipe-actions">
              <button class="swipe-btn swipe-btn-nope" @click="btnSwipe('left')">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
              <button class="swipe-btn swipe-btn-like" @click="btnSwipe('right')">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><path d="M20.8 4.6a5.5 5.5 0 00-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 00-7.8 7.8l1 1.1L12 21.3l7.8-7.8 1-1.1a5.5 5.5 0 000-7.8z"/></svg>
              </button>
            </div>
          </div>

          <!-- Tab: Map -->
          <div v-else-if="tab === 'map'" class="map-tab">
            <div class="map-top-bar">
              <button class="map-city-btn">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
                {{ city }}
              </button>
              <div class="map-search-pill">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.7" y2="16.7"/></svg>
                搜索本地人或店铺
              </div>
            </div>
            <div class="map-view">
              <div class="map-bg">
                <div class="map-grid"></div>
                <!-- Waterways -->
                <svg class="map-river" viewBox="0 0 400 500" preserveAspectRatio="none">
                  <path d="M120,0 C140,80 80,160 130,250 C180,340 90,420 140,500" stroke="rgba(96,165,250,0.35)" stroke-width="28" fill="none"/>
                </svg>
                <!-- Roads -->
                <div class="road road-h1"></div>
                <div class="road road-h2"></div>
                <div class="road road-v1"></div>
                <div class="road road-v2"></div>
                <!-- POIs as avatar bubbles -->
                <div
                  v-for="(poi, pi) in mapPois" :key="pi"
                  :class="['map-poi', { 'map-poi-active': selectedPoi === pi }]"
                  :style="{ left: poi.x + '%', top: poi.y + '%' }"
                  @click="selectedPoi = selectedPoi === pi ? null : pi"
                >
                  <div class="map-poi-avatar">{{ poi.avatar }}</div>
                  <div class="map-poi-pulse"></div>
                </div>
              </div>
              <!-- Selected POI card -->
              <transition name="slide-up">
                <div v-if="selectedPoi !== null" class="map-poi-card">
                  <div class="map-poi-card-avatar">{{ mapPois[selectedPoi].avatar }}</div>
                  <div class="map-poi-card-info">
                    <div class="map-poi-card-name">{{ mapPois[selectedPoi].name }}</div>
                    <div class="map-poi-card-meta">{{ mapPois[selectedPoi].years }}年本地人 · {{ mapPois[selectedPoi].badge }}</div>
                  </div>
                  <button class="map-poi-card-btn">查看推荐</button>
                </div>
              </transition>
              <!-- Location chip -->
              <div class="map-location-chip">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><circle cx="12" cy="12" r="3"/><path d="M12 2v3m0 14v3M2 12h3m14 0h3"/></svg>
                {{ city }} · 中心区域
              </div>
            </div>
          </div>

          <!-- Tab: Create -->
          <div v-else-if="tab === 'create'" class="create-tab">
            <h2 class="create-title">发布推荐</h2>
            <div class="create-placeholder">
              <div class="create-icon-wrap">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c7c7cc" stroke-width="1.5" stroke-linecap="round"><rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8.5" cy="8.5" r="1.5"/><path d="M21 15l-5-5L5 21"/></svg>
              </div>
              <p class="create-hint">拍一张你最爱的本地小店</p>
              <p class="create-hint-sub">用一句话种草，让外地人找到宝藏</p>
              <button class="btn-primary" style="margin-top:20px;max-width:220px">拍照 / 从相册选择</button>
            </div>
            <button class="dev-reset-btn" @click="devResetAll">开发调试：重置所有数据</button>
          </div>

          <!-- iOS-style Tab Bar -->
          <nav class="tabbar">
            <button :class="['tab-btn', { active: tab === 'map' }]" @click="tab = 'map'">
              <svg width="22" height="22" viewBox="0 0 24 24" :fill="tab === 'map' ? '#E8453C' : 'none'" :stroke="tab === 'map' ? '#E8453C' : '#8E8E93'" stroke-width="1.8" stroke-linecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3" :stroke="tab === 'map' ? '#fff' : '#8E8E93'"/></svg>
              <span>地图</span>
            </button>
            <button :class="['tab-btn tab-btn-center', { active: tab === 'create' }]" @click="tab = 'create'">
              <div class="tab-plus-ring">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.5" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              </div>
            </button>
            <button :class="['tab-btn', { active: tab === 'cards' }]" @click="tab = 'cards'">
              <svg width="22" height="22" viewBox="0 0 24 24" :fill="tab === 'cards' ? '#E8453C' : 'none'" :stroke="tab === 'cards' ? '#E8453C' : '#8E8E93'" stroke-width="1.8" stroke-linecap="round"><rect x="2" y="3" width="20" height="14" rx="3"/><path d="M8 21h8M12 17v4"/></svg>
              <span>发现</span>
            </button>
          </nav>
        </section>

      </div>
    </div>
  </main>
</template>

<style scoped>
/* ══════════════════════════════════
   iOS DESIGN SYSTEM
   ══════════════════════════════════ */
:root {
  --ios-blue: #007AFF;
  --ios-red: #E8453C;
  --ios-bg: #F2F2F7;
  --ios-card: #FFFFFF;
  --ios-sep: rgba(60,60,67,0.12);
  --ios-label: #8E8E93;
  --ios-text: #1C1C1E;
  --ios-text2: #3C3C43;
  --ios-radius: 13px;
  --font: -apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "PingFang SC", "Helvetica Neue", sans-serif;
}

* { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }

.screen {
  min-height: 100vh;
  display: flex; align-items: center; justify-content: center;
  padding: 12px;
  background: #1a1a2e;
  font-family: var(--font);
  color: var(--ios-text);
  -webkit-font-smoothing: antialiased;
}

.phone-shell {
  width: 100%; max-width: 393px;
  height: min(852px, 96vh);
  border-radius: 44px;
  background: var(--ios-bg);
  box-shadow: 0 0 0 3px #2a2a3e, 0 24px 80px rgba(0,0,0,0.45);
  overflow: hidden;
  position: relative;
  display: flex; flex-direction: column;
}

/* ── iOS Status Bar ── */
.ios-status-bar {
  flex-shrink: 0;
  height: 54px;
  padding: 14px 28px 0;
  display: flex; align-items: center; justify-content: space-between;
  font-size: 15px; font-weight: 600;
  color: var(--ios-text);
  letter-spacing: 0.02em;
}
.status-icons { display: flex; gap: 5px; align-items: center; }

/* ── Page transitions ── */
.page-content {
  flex: 1; display: flex; flex-direction: column;
  overflow: hidden;
  transition: opacity .18s ease, transform .18s ease;
}
.page-content.page-exit {
  opacity: 0; transform: translateY(6px) scale(0.98);
}
.page { flex: 1; display: flex; flex-direction: column; overflow-y: auto; overflow-x: hidden; }

/* ═══ WELCOME ═══ */
.welcome-page {
  align-items: center; justify-content: center;
  text-align: center;
  padding: 40px 32px 36px;
  background: linear-gradient(180deg, #FFF5F5 0%, var(--ios-bg) 50%);
}
.welcome-spacer { flex: 1; }
.welcome-icon-wrap { margin-bottom: 28px; }
.app-icon-hero {
  width: 120px; height: 120px;
  border-radius: 28px;
  object-fit: cover;
  box-shadow: 0 16px 48px rgba(232,69,60,0.25), 0 4px 12px rgba(0,0,0,0.08);
}
.app-icon-fallback {
  display: flex; align-items: center; justify-content: center;
  width: 120px; height: 120px; border-radius: 28px;
  background: var(--ios-red); color: #fff; font-size: 52px; font-weight: 700;
}
.welcome-title {
  margin: 0; font-size: 30px; font-weight: 750; line-height: 1.22;
  letter-spacing: -0.03em; color: var(--ios-text);
}
.welcome-title span { display: block; }
.welcome-sub {
  margin: 12px 0 0; font-size: 15px; color: var(--ios-label); font-weight: 400;
}
.welcome-hint {
  margin: 16px 0 0; font-size: 11px; color: #AEAEB2; font-weight: 400;
}

.btn-hero {
  width: 100%; max-width: 300px;
  padding: 16px 24px;
  border: none; border-radius: 14px;
  background: var(--ios-red);
  color: #fff; font-size: 17px; font-weight: 600;
  letter-spacing: -0.01em;
  cursor: pointer;
  box-shadow: 0 6px 20px rgba(232,69,60,0.35);
  transition: transform .12s ease, box-shadow .12s ease;
}
.btn-hero:active { transform: scale(0.97); box-shadow: 0 3px 10px rgba(232,69,60,0.25); }

/* ── Staggered entry ── */
.anim-item { opacity: 0; animation: slideIn .5s cubic-bezier(.25,.46,.45,.94) forwards; }
.anim-1 { animation-delay: .05s; }
.anim-2 { animation-delay: .15s; }
.anim-3 { animation-delay: .25s; }
.anim-4 { animation-delay: .35s; }
.anim-5 { animation-delay: .45s; }
@keyframes slideIn {
  from { opacity: 0; transform: translateY(16px); }
  to { opacity: 1; transform: translateY(0); }
}

/* ═══ FORM PAGES (Login / Profile / Verify) ═══ */
.form-page { background: var(--ios-bg); }

.ios-nav {
  flex-shrink: 0;
  display: flex; align-items: center;
  height: 44px; padding: 0 16px;
}
.nav-back {
  width: 36px; height: 36px;
  display: flex; align-items: center; justify-content: center;
  border: none; background: none; color: var(--ios-red); cursor: pointer;
  padding: 0; margin-left: -6px;
}
.nav-title {
  flex: 1; text-align: center;
  font-size: 17px; font-weight: 600; letter-spacing: -0.01em;
}
.nav-spacer { width: 36px; }

.form-body {
  flex: 1; padding: 4px 20px 32px;
  overflow-y: auto;
}
.form-headline {
  margin: 0; font-size: 28px; font-weight: 740; letter-spacing: -0.025em;
}
.form-sub {
  margin: 6px 0 20px; font-size: 15px; color: var(--ios-label);
}

/* ── iOS Grouped Fields ── */
.ios-field-group {
  background: var(--ios-card);
  border-radius: var(--ios-radius);
  margin-bottom: 20px;
  overflow: hidden;
}
.ios-field {
  display: flex; align-items: center;
  min-height: 46px; padding: 0 16px;
}
.ios-field-divider {
  height: 1px; margin-left: 16px;
  background: var(--ios-sep);
}
.ios-field-icon {
  flex-shrink: 0; width: 30px;
  display: flex; align-items: center; justify-content: center;
  color: var(--ios-label);
}
.ios-field-label {
  flex-shrink: 0; width: 60px;
  font-size: 15px; font-weight: 400; color: var(--ios-text);
}
.ios-field-input {
  flex: 1; border: none; background: none; outline: none;
  font-size: 15px; color: var(--ios-text);
  font-family: var(--font);
  height: 46px; padding: 0 4px;
}
.ios-field-input::placeholder { color: #C7C7CC; }
.ios-field-select {
  flex: 1; border: none; background: none; outline: none;
  font-size: 15px; color: var(--ios-text);
  font-family: var(--font);
  height: 46px; padding: 0;
  appearance: none; -webkit-appearance: none;
}
.sms-btn {
  flex-shrink: 0;
  border: none; background: none;
  color: var(--ios-red); font-size: 14px; font-weight: 500;
  cursor: pointer; padding: 4px 0;
  font-family: var(--font);
}

.btn-primary {
  width: 100%; padding: 15px 16px;
  border: none; border-radius: 13px;
  background: var(--ios-red); color: #fff;
  font-size: 17px; font-weight: 600;
  cursor: pointer;
  font-family: var(--font);
  transition: opacity .12s ease, transform .12s ease;
}
.btn-primary:active { transform: scale(0.98); }
.btn-primary.disabled { opacity: 0.35; pointer-events: none; }

.btn-ghost {
  width: 100%; padding: 14px 16px; margin-top: 10px;
  border: none; border-radius: 13px;
  background: transparent; color: var(--ios-red);
  font-size: 15px; font-weight: 500;
  cursor: pointer; font-family: var(--font);
}

/* ── Step pills ── */
.step-pills { display: flex; gap: 8px; margin-bottom: 16px; }
.step-pill {
  padding: 5px 12px; border-radius: 99px;
  font-size: 12px; font-weight: 600;
  background: rgba(142,142,147,0.12); color: var(--ios-label);
}
.step-pill.active { background: rgba(232,69,60,0.12); color: var(--ios-red); }
.step-pill.done { background: rgba(52,199,89,0.12); color: #34C759; }

.profile-header { margin-bottom: 6px; }

/* ── Quiz ── */
.quiz-card {
  background: var(--ios-card); border-radius: var(--ios-radius);
  padding: 16px; margin-bottom: 12px;
}
.quiz-q { margin: 0 0 12px; font-size: 15px; font-weight: 600; line-height: 1.4; }
.quiz-opts { display: flex; flex-direction: column; gap: 8px; }
.quiz-opt {
  display: flex; align-items: center; gap: 10px;
  padding: 11px 14px; border-radius: 10px;
  background: var(--ios-bg);
  font-size: 15px; cursor: pointer;
  transition: background .15s ease, transform .1s ease;
}
.quiz-opt:active { transform: scale(0.98); }
.quiz-opt.selected { background: rgba(232,69,60,0.1); font-weight: 500; }
.quiz-radio-hidden { position: absolute; opacity: 0; pointer-events: none; }
.quiz-check {
  width: 22px; height: 22px; border-radius: 50%;
  border: 2px solid #D1D1D6;
  display: flex; align-items: center; justify-content: center;
  flex-shrink: 0;
  transition: all .15s ease;
}
.quiz-opt.selected .quiz-check {
  border-color: var(--ios-red); background: var(--ios-red);
}

/* ═══ MAIN PAGE ═══ */
.main-page {
  position: relative;
  padding-bottom: 0;
}

/* ── CARDS TAB (Tinder) ── */
.cards-tab {
  flex: 1; display: flex; flex-direction: column;
  padding: 0 0 90px;
}
.cards-header {
  padding: 6px 22px 10px; flex-shrink: 0;
}
.cards-title {
  margin: 0; font-size: 28px; font-weight: 740; letter-spacing: -0.025em;
}
.cards-sub {
  margin: 4px 0 0; font-size: 13px; color: var(--ios-label);
}

.swipe-area {
  flex: 1; position: relative;
  display: flex; align-items: center; justify-content: center;
  padding: 0 18px;
  min-height: 0;
}

.swipe-card {
  position: absolute;
  width: calc(100% - 36px);
  max-height: calc(100% - 8px);
  border-radius: 20px;
  background: var(--ios-card);
  box-shadow: 0 8px 32px rgba(0,0,0,0.10);
  overflow: hidden;
  display: flex; flex-direction: column;
  user-select: none;
  -webkit-user-select: none;
}
.swipe-card-behind {
  transform: scale(0.94) translateY(8px);
  opacity: 0.6;
}
.swipe-card-front {
  z-index: 2; cursor: grab;
}
.swipe-card-front:active { cursor: grabbing; }

.card-stamp {
  position: absolute; top: 24px; z-index: 10;
  padding: 8px 18px; border-radius: 8px;
  font-size: 22px; font-weight: 800;
  letter-spacing: 0.05em;
  opacity: 0; transition: opacity .12s ease;
  transform: rotate(-12deg);
  pointer-events: none;
}
.stamp-like { left: 20px; border: 3px solid #34C759; color: #34C759; }
.stamp-nope { right: 20px; border: 3px solid var(--ios-red); color: var(--ios-red); transform: rotate(12deg); }
.card-stamp.show { opacity: 1; }

.card-img {
  width: 100%; height: 200px;
  background-size: cover; background-position: center;
  position: relative; flex-shrink: 0;
}
.card-img-overlay {
  position: absolute; inset: 0;
  background: linear-gradient(0deg, rgba(0,0,0,0.55) 0%, transparent 50%);
}
.card-img-content {
  position: absolute; bottom: 14px; left: 16px; right: 16px;
  color: #fff; z-index: 1;
}
.card-shop-name { font-size: 22px; font-weight: 720; letter-spacing: -0.02em; text-shadow: 0 1px 4px rgba(0,0,0,0.3); }
.card-area { font-size: 13px; opacity: 0.85; margin-top: 2px; }

.card-body { padding: 14px 16px 18px; flex: 1; min-height: 0; }
.card-recommender {
  display: flex; align-items: center; gap: 10px;
  margin-bottom: 12px;
}
.card-avatar-ring {
  width: 40px; height: 40px; border-radius: 50%;
  background: linear-gradient(135deg, #FF6B6B, #E8453C);
  padding: 2px; flex-shrink: 0;
}
.card-avatar-placeholder {
  width: 100%; height: 100%; border-radius: 50%;
  background: #fff;
  display: flex; align-items: center; justify-content: center;
  font-size: 16px; font-weight: 700; color: var(--ios-red);
}
.card-rec-info { display: flex; flex-direction: column; }
.card-rec-name { font-size: 15px; font-weight: 600; }
.card-rec-badge { font-size: 12px; color: var(--ios-label); margin-top: 1px; }

.card-hook {
  margin: 0 0 12px;
  font-size: 15px; line-height: 1.5; color: var(--ios-text2);
  font-style: italic;
}
.card-tags { display: flex; gap: 6px; flex-wrap: wrap; }
.card-tag {
  padding: 4px 10px; border-radius: 99px;
  background: rgba(232,69,60,0.08); color: var(--ios-red);
  font-size: 12px; font-weight: 500;
}

.swipe-actions {
  flex-shrink: 0;
  display: flex; justify-content: center; gap: 40px;
  padding: 10px 0 6px;
}
.swipe-btn {
  width: 58px; height: 58px; border-radius: 50%;
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: transform .12s ease, box-shadow .12s ease;
}
.swipe-btn:active { transform: scale(0.9); }
.swipe-btn-nope {
  background: #fff; color: var(--ios-red);
  box-shadow: 0 4px 16px rgba(232,69,60,0.15);
}
.swipe-btn-like {
  background: var(--ios-red); color: #fff;
  box-shadow: 0 4px 16px rgba(232,69,60,0.3);
}

/* ═══ MAP TAB ═══ */
.map-tab {
  flex: 1; display: flex; flex-direction: column;
  padding-bottom: 78px;
}
.map-top-bar {
  flex-shrink: 0;
  display: flex; align-items: center; gap: 10px;
  padding: 6px 16px 10px;
}
.map-city-btn {
  flex-shrink: 0;
  display: flex; align-items: center; gap: 4px;
  border: none; background: var(--ios-card);
  padding: 8px 12px; border-radius: 10px;
  font-size: 14px; font-weight: 600; color: var(--ios-text);
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
  font-family: var(--font); cursor: pointer;
}
.map-search-pill {
  flex: 1;
  display: flex; align-items: center; gap: 6px;
  background: var(--ios-card);
  padding: 9px 12px; border-radius: 10px;
  font-size: 14px; color: #C7C7CC;
  box-shadow: 0 1px 4px rgba(0,0,0,0.06);
}
.map-view {
  flex: 1; position: relative;
  margin: 0 12px; border-radius: 18px;
  overflow: hidden;
}
.map-bg {
  width: 100%; height: 100%;
  background: linear-gradient(170deg, #E8F4FD 0%, #E0F7ED 40%, #F5F3E8 100%);
  position: relative;
}
.map-grid {
  position: absolute; inset: 0;
  background-image:
    linear-gradient(to right, rgba(0,0,0,0.04) 1px, transparent 1px),
    linear-gradient(to bottom, rgba(0,0,0,0.04) 1px, transparent 1px);
  background-size: 36px 36px;
}
.map-river {
  position: absolute; inset: 0;
  width: 100%; height: 100%;
}
.road {
  position: absolute;
  background: rgba(0,0,0,0.08);
  border-radius: 99px;
}
.road-h1 { width: 92%; height: 6px; left: -4%; top: 38%; transform: rotate(5deg); }
.road-h2 { width: 80%; height: 5px; left: 14%; top: 62%; transform: rotate(-8deg); }
.road-v1 { width: 5px; height: 70%; left: 45%; top: 10%; transform: rotate(4deg); }
.road-v2 { width: 4px; height: 55%; left: 70%; top: 25%; transform: rotate(-6deg); }

.map-poi {
  position: absolute;
  transform: translate(-50%, -50%);
  cursor: pointer;
  z-index: 2;
  transition: transform .2s ease;
}
.map-poi:active, .map-poi-active { transform: translate(-50%, -50%) scale(1.15); z-index: 3; }
.map-poi-avatar {
  width: 44px; height: 44px; border-radius: 50%;
  background: var(--ios-card);
  display: flex; align-items: center; justify-content: center;
  font-size: 22px;
  box-shadow: 0 3px 12px rgba(0,0,0,0.15);
  border: 3px solid var(--ios-card);
  position: relative; z-index: 1;
}
.map-poi-active .map-poi-avatar { border-color: var(--ios-red); }
.map-poi-pulse {
  position: absolute; inset: -6px;
  border-radius: 50%;
  border: 2px solid rgba(232,69,60,0.3);
  animation: pulse 2s ease-out infinite;
  opacity: 0;
}
.map-poi-active .map-poi-pulse { opacity: 1; }
@keyframes pulse {
  0% { transform: scale(0.8); opacity: 0.8; }
  100% { transform: scale(1.4); opacity: 0; }
}

.map-poi-card {
  position: absolute; bottom: 16px; left: 12px; right: 12px;
  background: rgba(255,255,255,0.92);
  backdrop-filter: blur(20px); -webkit-backdrop-filter: blur(20px);
  border-radius: 16px;
  padding: 14px 16px;
  display: flex; align-items: center; gap: 12px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.12);
  z-index: 10;
}
.map-poi-card-avatar {
  width: 44px; height: 44px; border-radius: 50%;
  background: var(--ios-bg);
  display: flex; align-items: center; justify-content: center;
  font-size: 22px; flex-shrink: 0;
}
.map-poi-card-info { flex: 1; min-width: 0; }
.map-poi-card-name { font-size: 16px; font-weight: 620; }
.map-poi-card-meta { font-size: 12px; color: var(--ios-label); margin-top: 2px; }
.map-poi-card-btn {
  flex-shrink: 0;
  padding: 8px 14px; border-radius: 99px;
  border: none; background: var(--ios-red); color: #fff;
  font-size: 13px; font-weight: 600; cursor: pointer;
  font-family: var(--font);
}

.map-location-chip {
  position: absolute; top: 14px; left: 14px;
  display: flex; align-items: center; gap: 5px;
  padding: 7px 12px; border-radius: 10px;
  background: rgba(255,255,255,0.88);
  backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
  font-size: 12px; font-weight: 600; color: var(--ios-text);
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
  z-index: 5;
}

.slide-up-enter-active { transition: all .25s cubic-bezier(.25,.46,.45,.94); }
.slide-up-leave-active { transition: all .2s ease; }
.slide-up-enter-from { transform: translateY(100%); opacity: 0; }
.slide-up-leave-to { transform: translateY(100%); opacity: 0; }

/* ═══ CREATE TAB ═══ */
.create-tab {
  flex: 1; display: flex; flex-direction: column;
  padding: 6px 20px 90px;
}
.create-title {
  margin: 0 0 16px; font-size: 28px; font-weight: 740; letter-spacing: -0.025em;
}
.create-placeholder {
  flex: 1;
  display: flex; flex-direction: column;
  align-items: center; justify-content: center;
  background: var(--ios-card);
  border-radius: 18px;
  border: 2px dashed #D1D1D6;
  padding: 32px;
  text-align: center;
}
.create-icon-wrap { margin-bottom: 16px; }
.create-hint { margin: 0; font-size: 17px; font-weight: 600; color: var(--ios-text); }
.create-hint-sub { margin: 6px 0 0; font-size: 14px; color: var(--ios-label); }

.dev-reset-btn {
  margin-top: 16px; flex-shrink: 0;
  width: 100%; padding: 12px;
  border: 1px dashed #FF9500; border-radius: 12px;
  background: rgba(255,149,0,0.06);
  color: #FF9500; font-size: 13px; font-weight: 600;
  cursor: pointer; font-family: var(--font);
}

/* ═══ TAB BAR ═══ */
.tabbar {
  position: absolute; bottom: 0; left: 0; right: 0;
  height: 78px;
  display: flex; align-items: flex-start; justify-content: space-around;
  padding-top: 8px;
  background: rgba(255,255,255,0.82);
  backdrop-filter: saturate(180%) blur(20px);
  -webkit-backdrop-filter: saturate(180%) blur(20px);
  border-top: 0.5px solid var(--ios-sep);
  z-index: 50;
}
.tab-btn {
  display: flex; flex-direction: column; align-items: center; gap: 2px;
  border: none; background: none; padding: 4px 18px;
  color: #8E8E93; font-size: 10px; font-weight: 500;
  cursor: pointer; font-family: var(--font);
  transition: color .15s ease;
}
.tab-btn.active { color: var(--ios-red); }
.tab-btn.active span { font-weight: 600; }
.tab-btn-center { padding: 0; margin-top: -4px; }
.tab-plus-ring {
  width: 46px; height: 46px; border-radius: 50%;
  background: var(--ios-red);
  display: flex; align-items: center; justify-content: center;
  box-shadow: 0 4px 14px rgba(232,69,60,0.35);
  transition: transform .12s ease;
}
.tab-btn-center:active .tab-plus-ring { transform: scale(0.92); }
</style>
