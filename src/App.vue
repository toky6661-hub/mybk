<!--主要负责骨架-->
<script setup lang="ts">
import { ref } from 'vue';
import wallpaperVideo from './assets/lemon.mp4';
import defaultWallpaper from './assets/background.jpg';

// 逻辑代码位置

const showAddWebsite = ref(false);

const newName = ref('');
const newUrl = ref('');

const sidebarGroups = ref(JSON.parse(
  localStorage.getItem('sidebarGroups') ||
  JSON.stringify([
  {
    title: "常用网站",
    links:[
      {
        name: "哔哩哔哩",
        url: "https://www.bilibili.com/"
  },

  {
    name: "乐赏游戏空间",
    url: "https://qhgame.ysupan.com/"
    },
  ]
}
])
))

//打开弹窗
const openAddWebsite = () => {
  showAddWebsite.value = true;

  newName.value = '';
  newUrl.value = '';
}

const iconFailed = ref< Record< string, boolean >>({});

const getFavicon = (url: string) => {
  try {
    const domain = new URL(url).hostname;

    return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
  } catch {
    return '';
  }
};

const handleIconError = (url: string) => {
  iconFailed.value[url] = true;
}

//添加网站
const addWebsite = () => {
  const name = newName.value.trim();
  const url = newUrl.value.trim();

  if(!name || !url) {
    return;
  }

  sidebarGroups.value[0].links.push({
    name,
    url
  })

  localStorage.setItem(
  'sidebarGroups',
  JSON.stringify(sidebarGroups.value)
)

  closeAddWebsite();
  
}

//关闭弹窗
const closeAddWebsite = () => {
  showAddWebsite.value = false;
}

//================壁纸系统=================//
//模式：动态/静态
const wallpaperMode = ref< 'video' | 'image' >(
  (localStorage.getItem('wallpaperMode') as 'video' | 'image') || 'video'
);

//当前的静态壁纸
const background = ref(
  localStorage.getItem('background') || defaultWallpaper
);

//控制壁纸面板，比如亮度滑块
const showBackground = ref(false);

const wallpaperBrightness = ref(
  Number(localStorage.getItem('wallpaperBrightness') || '0.45')
);

//修改亮度,0为最亮，1为最暗
const changeWallpaperBrightness = () =>{
  localStorage.setItem(
    'wallpaperBrightness',
    wallpaperBrightness.value.toString()
  );
}

//网络图片地址
const onlineBackground = ref('');

//切换壁纸模式
const setWallpaperMode = (mode: 'video' | 'image') => {
  wallpaperMode.value = mode;

  localStorage.setItem('wallpaperMode', mode);

  showBackground.value = false
};

//上传本地静态壁纸
const changeBackground = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];

  if(!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    background.value = reader.result as string;

    localStorage.setItem(
      'background',
      background.value
    );

    wallpaperMode.value = 'image';

    localStorage.setItem(
      'wallpaperMode',
      'image'
    );
  };

    reader.readAsDataURL(file);
};

//使用网络图片
const setonlineBackground = () => {
  const url = onlineBackground.value.trim();

  if(!url) return;

  background.value = `url("${url}")`;

  localStorage.setItem(
    'background',
    background.value
  );

  wallpaperMode.value = 'image';

  localStorage.setItem(
    'wallpaperMode',
    'image'
  );

  onlineBackground.value = '';
  showBackground.value = false
}


/*const background = ref(localStorage.getItem('background') || 'url("/src/assets/background.jpg")');

const changeBackground = (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if(!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    background.value = reader.result as string;
    localStorage.setItem('background', background.value);
  };

  reader.readAsDataURL(file);

};


const showBackground = ref(false);
const onlineBackground = ref('');

const setonlineBackground = () => {
  const url = onlineBackground.value.trim();
  if(!url) return;

  background.value = `url("${url}")`;
  localStorage.setItem('background', background.value);
  showBackground.value = false;
  onlineBackground.value = '';
}; (！！被废弃的静态壁纸系统  */


</script>

<template>
  <div class="page"
    :class="{
      'video-mode': wallpaperMode === 'video',
      'image-mode': wallpaperMode === 'image'
    }"  
    :style="{
      '--wallpaper-brightness':wallpaperBrightness,
    }"
  >
    <!--页面负责的内容-->
    <!--左侧隐藏导航栏-->
    <video
      v-if="wallpaperMode === 'video'"
      class="background-video"
      :src="wallpaperVideo"
      autoplay
      muted
      loop
      playsinline
    >
      <source :src="wallpaperVideo" type="video.mp4" />
    </video>

    <!--静态背景层（测试-->
    <div 
      v-if="wallpaperMode === 'image'"
      class="background-image"
      :style="{ backgroundImage: `url(' + background + ')` }"
    >
      <!--测试-->
    </div>

    <div class="sidebar-trigger"></div>
    <div class="sidebar-hint"></div>

      <aside class="sidebar">
        <div class="sidebar-group"
        v-for="group in sidebarGroups"
        :key="group.title"
        >

        <div class="sidebar-title">
          {{ group.title }}
        </div>

        <a  v-for="link in group.links" 
          :key="link.url"
          :href="link.url"
          target="_blank"
          class="sidebar-item"  
          :title="link.name"
        >
          <img 
            v-if="!iconFailed[link.url]"
            :src="getFavicon(link.url)"
            :alt="link.name"
            @error="handleIconError(link.url)"
          />

          <span v-else>
            {{ link.name }}
          </span>
        </a>
        </div>

    <!--添加网站的按钮-->
        <button
          class="add-website-btn"
          @click="openAddWebsite"
        >
        + 添加
        </button>

      </aside>
      <!--添加网站时弹出的面板-->
        <div v-if="showAddWebsite" class="dialog-mask" @click="closeAddWebsite">
          <!--div遮罩-->
        </div>
       
        <dialog
          v-if="showAddWebsite"
          class="add-website-dialog"
          open
        >

          <div class="dialog-header">

            <div>
              <div class="dialog-title">
                添加网站
              </div>

              <div class="dialog-subtitle">
                添加一个新的快捷网站
              </div>
            </div>

            <button
              type="button"
              class="dialog-close"
              @click="closeAddWebsite"
            >
            X            
            </button>

          </div>

        <div class="form-item">

          <label>
            网站名称
          </label>

           <input 
            v-model="newName"
            type="text"
            placeholder="例如：GitHub"
          />

        </div>

        <div class="form-item">

          <label>
            网站地址
          </label>

          <input 
            v-model="newUrl"
            type="url"
            placeholder="例如：https://github.com"
          />

        </div>

          <div class="add-website-actions">
            <button 
              class="confirm-btn"
              @click="addWebsite"
            >
                确定
            </button>

            <button 
              class="cancel-btn"
              @click="showAddWebsite = false"
            >
              取消
            </button>

        </div>

      </dialog>

<div class="search-container">
  <div class="search-box">
    <!--绑定搜索栏-->
  </div>

  <div class="change-bg-panel">

  <button 
    class="change-bg" 
    type="button"
    @click="showBackground = !showBackground"
  >
    更多背景
  </button>
  <div v-if="showBackground" class="bg-mask" @click="showBackground = false">
    <!--更多壁纸的遮罩层-->
  </div>
    <div class="online-bg-input" v-if="showBackground">
      <div class="wallpaper-mode-switch">
        <button type="button" @click="setWallpaperMode('video')">动态壁纸</button>
        <button type="button" @click="setWallpaperMode('image')">静态壁纸</button>
      </div>

      <input
        v-model="onlineBackground"
        type="url"
        placeholder="输入在线图片地址"
      />

      <label class="brightness-control">
        壁纸亮度
        <input
          v-model.number="wallpaperBrightness"
          type="range"
          min="0"
          max="1"
          step="0.01"
          @input="changeWallpaperBrightness"
        />

        <span>
          {{ Math.round((1 - wallpaperBrightness) * 100) }}%
        </span>

      </label>

      <button 
        type="button" 
        @click="setonlineBackground"
      >
        应用网络图片
      </button>
    
    <label class="local-bg-btn">
      浏览本地图片
      <input 
        type="file"
        accept="image/*"
        hidden
        @change="changeBackground"
      />
    </label>

    <button class="cancel-btn" @click="showBackground = false">
      取消
    </button>

    </div>
  </div>

</div>

<div class="nine-dots">
  <i v-for="i in 9" :key="i"></i>
</div>

    <router-view />
  </div>

</template>

<style lang="scss" scoped>
.sidebar-trigger {
  position: fixed;
  top: 0;
  left: 0;
  width: 16px;
  height: 100%;
  z-index: 33;
}

.sidebar-hint {
  position: fixed;
  top: 50%;
  left: 6px;
  transform: translateY(-50%);
  width: 5px;
  height: 64px;
  border-radius: 4px;
  box-shadow: 0 0 12px rgba(157, 180, 255, 0.7);
  background: linear-gradient(180deg, #9db4ff, #6b85e0);
  z-index: 3;
  pointer-events: none;
  transition: opacity 0.3s ease;
  animation: sidebarHinPulse 2s ease-in-out infinite;
}

@keyframes sidebarHinPulse {
  0%, 100% {
    opacity: 0.6;
  }
  50% {
    opacity: 1;
  }
}

.sidebar-trigger:hover ~.sidebar-hint,
.sidebar:hover ~.sidebar-hint{
  opacity: 0;
}

.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  height: auto;
  width: 220px;
  z-index: 20;
  background: rgba(14, 18, 40, 0.6);
  border: 1px solid rgba(255,255,255,0.2);
  backdrop-filter: blur(16px);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0;
  justify-content: flex-start;
  padding: 30px 20px;
  text-align: center;
  overflow: hidden;
}

.sidebar-trigger:hover ~.sidebar,
.sidebar:hover {
 transform: translateX(0);
}

.sidebar-title {
  font-size: 13px;
  width: 100%;
  margin-bottom: 12px;
  line-height: 20px;
  color: rgba(245, 247, 255, 0.6);
  letter-spacing: 1px;
}

.sidebar-empty{
  color: rgba(245, 247, 255, 0.5);
  font-size: 13px;
  text-align: center;
  padding: 20px;
  border: 1px dashed rgba(255,255,255,0.2);
  border-radius: 12px;
}

.sidebar-item {
  display: block;
  padding:  0;
  margin-bottom: 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  text-decoration: none;
  transition: 3s;
  width: 52px;
  height: 52px;
  font-size: 14px;
  letter-spacing: 2px;
  text-align: center;
  justify-content: center;
  align-items: center;
}

.sidebar-item img {
  width: 30px;
  height: 30px;
  border-radius: 8px;
}

.sidebar-item span {
  font-size: 14px;
  font-weight: 600;
  color: white;
  text-align: center;
}

.sidebar-item:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-1px);
}

.sidebar-group {
  width: 100%;
  text-align: center;
  font-size: 14px;
  color: rgba(245, 247, 255, 0.8);
  letter-spacing: 2px;
  flex: 0 0 auto;
  align-items: center;
 }

.sidebar-group > .sidebar-item {
  display: inline-flex;
  margin: 5px;
}

.page {
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  position: relative;

  user-select: none;
  -webkit-user-select: none;

  isolation: isolate;
}

input,
textarea {
  user-select: text;
  -webkit-user-select: text;
}

   /*=====静态壁纸层=====（似乎多做了一层静态，先测试注释掉 */
   /* &::before {
    content: '';
    position: fixed;
    inset: 0;

    background-position: center;
    background-size: cover;
    background-repeat: no-repeat;

    pointer-events: none;
    z-index: -1;
  }
  /*======静态模式(仅显示静态壁纸)======*/
  /*.page.image-mode::before{
    background-image: 
    linear-gradient(
      rgba(0, 0, 0, 0.60),
      rgba(0, 0, 0, 0.60)), 
    v-bind(background);
  }*/

/*  .background-video,
    .background-image {
      position: fixed;
      inset: 0;

      width: 100%;
      height: 100%;

      object-fit: cover;

      z-index: -2;
      pointer-events: none;
}（重复*/

.background-video {
  position: fixed;
  inset: 0;

  object-fit: cover;
  width: 100%;
  height: 100%;

  z-index: 0;
  pointer-events: none;
}

/*====动态壁纸亮度====*/
.page.video-mode::after {
  content: '';
  position: fixed;
  inset: 0;

  background: rgba(0 0 0 / var(--wallpaper-brightness));

  pointer-events: none;
  z-index: -1;
}

.background-image {
  position: fixed;
  inset: 0;

  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;

  background-image: 
  linear-gradient(
    rgba(0, 0, 0, 0.45),
    rgba(0, 0, 0, 0.2)),
    v-bind(background);

  z-index: 0;
}

.main {
  display: flex;
  justify-content: center;
  align-items: center;
  flex: 1;
  min-height: 100vh;
  flex-direction: column;
  gap: 20px;
  color: #f5f7ff;

  transform: translateY(-120px);
}

/*添加网站弹窗*/ 
.modal-mask {
  position: fixed;
  inset: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  background: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(6px);
}

/*弹窗本体*/
.add-website-modal {
  width: 380px;
  padding: 28px;
  box-sizing: border-box;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 18px;
  background: rgba(18, 23, 45, 0.92);
  backdrop-filter: blur(20px);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.45);
  color: white;
}

.add-website-btn {
  width: 160px;
  height: 40px;
  margin-top: 12px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.15);
  color: white;
  font-size: 14px;
  letter-spacing: 2px;
  cursor: pointer;
  transition: 0.2s ease;
}

.add-website-btn:hover {
  border-color: rgba(255, 255, 255, 0.25);
  transform: translateY(-1px);
}

/*标题*/
.modal-title {
  font-size: 22px;
  font-weight: 600;
  text-align: center;
  letter-spacing: 2px;
}

/*副标题*/
.modal-subtitle {
  font-size: 8px;
  margin-bottom: 26px;
  font-size: 13px;
  text-align: center;
  color: rgba(245, 247, 255, 0.5);
}

/*表单*/
.form-item {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 18px;
}

.form-item label {
  font-size: 13px;
  color: rgba(245, 247, 255, 0.7);
}

.form-item input {
  width: 100%;
  box-sizing: border-box;
  padding: 11px 13px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  border-radius: 25px;
  outline: white;
  font-size: 14px;
  transition: 0.2s;
}

.form-item input:focus {
  border-color: rgba(157, 180, 255, 0.7);
  background: rgba(255,255,255, 0.12);
  box-shadow: 0 0 0 3px rgba(157, 180, 255, 0.08);
}

.form-item input::placeholder {
  color: rgba(255,255,255,0.35);
}

/*底部按钮*/
.modal-actions {
  display: flex;
  justify-content: flex-start;
  gap:10px;
  margin-top: 26px;
}

.modal-actions button {
  padding: 20px 30px;
  border-radius: 25px;
  cursor: pointer;
  font-size: 14px;
  transition: 0.2s;
}

/*取消*/
.cancel-btn {
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.7);
}

.cancel-btn:hover {
  background: rgab(255, 255, 255, 0.12);
  color: white;
}

/*添加*/
.confirm-btn {
   border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.7);
}

.confirm-btn:hover {
  background: rgba(255, 255, 255, 0.12);
  color: white;
}

.add-website-dialog {
  width: 420px;
  max-width: calc(100vw - 40px);
  box-sizing: border-box;
  padding: 28px;
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 20px;
  background: rgba(14, 18, 40, 0.94);
  backdrop-filter: blur(20px);
  color: white;
  box-shadow: 0 25px 70px rgba(0, 0, 0, 0.5);
  position: fixed;
  z-index: 9999;
}

/*浏览器原生 dialog 的背景遮罩
.add-website-dialog::backdrop {
  background-color: rgba(0, 0, 0, 0.55);
  backdrop-filter: blur(4px);
}(  ！！已失效，暂时用div替代   */

/*标题*/
.dialog-header {
  position: relative;
  margin-bottom: 26px;
}

.dialog-title {
  text-align: center;
  font-size: 21px;
  font-weight: 600;
  letter-spacing: 2px;
}

.dialog-subtitle {
  margin-top: 7px;
  text-align: center;
  font-size: 13px;
  color: rgba(245, 247, 255, 0.5);
}

/*关闭*/
.dialog-close {
  position: absolute;
  top: -8px;
  right: -8px;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  border-color: rgba(255,255,255,0.55);
  font-size: 23px;
  cursor: pointer;
}

.dialog-close:hover {
  background: rgba(255,255,255,0.1);
  color: white;
}

/*div的遮罩层*/
.dialog-mask {
  position: fixed;
  inset: 0;
  z-index: 9998;
  background: rgba(0, 0, 0, 0.45);
  backdrop-filter: blur(4px);
}

/*按钮 */
.add-website-actions {
  display: flex;
  justify-content: center;
  gap: 12px;
  margin-top: 24px;
}

.add-website-actions button {
  width: 150px;
  height: 50px;
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  cursor: pointer;
  font-size: 24px;
  transition: 0.2s;
  letter-spacing: 1px;
}

.add-website-actions button:hover {
  background: rgba(255, 255, 255, 0.22);
  transform: translateY(-1px);
}

.change-bg {
  /*position: fixed;
  top:50%;
  left: calc(50% + 220px);
  transform: translateY(-50%);（！！屏幕中心定位 ！！*/

  padding: 10px 18px;
  border-radius: 999px;
  background-color: rgba(255, 255, 255, 0.15);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: white;
  cursor: pointer;
  backdrop-filter: blur(12px);
  transition: 0.2s;
  z-index: 1002;
}

.change-bg:hover {
  background: rgba(255, 255, 255, 0.22);
  transform: translateY(-5%) translateY(-1px);
}

.search-container {
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  gap:12px;
  z-index: 1000;
  pointer-events: auto;
}

.nine-dots {
  position: fixed;
  top: 20px;
  left: 20px;
  width: 30px;
  height: 30px;
  display: grid;
  grid-template-columns: repeat(3, 6px);
  grid-template-rows: repeat(3, 6px);
  gap: 6px;
  z-index: 100;
}

.nine-dots i {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background-color: white;
}

 .change-bg-panel {
  position: relative;
  z-index: 1001;
  pointer-events: auto;
}

.online-bg-input {
  position: absolute;
  top: calc(100% + 10px);
  right: 0;

  width: 260px;
  padding: 15px;

  border-radius: 14px;
  background-color: rgba(20, 24, 45, 0.92);
  backdrop-filter: blur(16px);

  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);

  z-index: 1003;
}

.online-bg-input input[type='url'] {
  width: 100%;
  box-sizing: border-box;
  padding: 10px 12px;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0.15);
  background: rgba(245, 247, 255, 0.08);
  color: white;
  outline: none;
  margin-bottom: 10px;
}

.online-bg-input input[type='url']:focus {
  border-color: rgab(157, 180, 255, 0.7);
}

.online-bg-input input[type='url']::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.online-bg-input button,
.local-bg-btn {
  display: block;
  width: 100%;
  box-sizing: border-box;
  padding: 9px;
  margin-top: 8px;
  border: 1px solid rgba(245, 247, 255, 0.15);
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  text-align: center;
  cursor: pointer;
  transition: 0.2s;
}

.online-bg-input button:hover,
.local-bg-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.online-bg-input .cancel-btn {
  margin-top: 10px;
}

//更多壁纸的遮罩层
.bg-mask {
  position: fixed;
  inset: 0;
  z-index: 1002;
}
</style>