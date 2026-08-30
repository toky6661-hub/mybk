<!--本组件主要负责浏览器搜素-->
<!--跟时钟组件结合-->
<script setup lang="ts">
// 逻辑代码位置
import  Clock  from '../components/Clock.vue';
import { ref } from 'vue';

//当前选择的搜索引擎，只能是 'baidu'、'google' 或 'bing'
const currentEngine = ref<'baidu' | 'google' | 'bing'>('baidu');

//搜素框里的内容
const searchQuery = ref('');

//每个搜索引擎的搜索 URL
const searchUrls = {
  baidu: 'https://www.baidu.com/s?wd=',
  google: 'https://www.google.com/search?q=',
  bing: 'https://www.bing.com/search?q=',
};

function handleSearch() {
    const trimmed = searchQuery.value.trim();
    if (!trimmed) {
        // 如果搜索内容为空，则不进行搜索
        return;
    }

  //根据当前选择的搜索引擎和输入的内容，构建完整的搜索 URL
  const url = searchUrls[currentEngine.value] + encodeURIComponent(searchQuery.value);
  //跳转到搜索结果页面
  window.location.href = url;
}

</script>

<template>
    <div class="main">

        <div class="clock">
            <Clock />
        </div>
    
    <div class="enimg">
        <!--<img src="../assets/baidu.jpg" alt="百度" />
        <img src="../assets/google.jpg" alt="谷歌" />
        <img class="baidulogo" src="../assets/bing.jpg" alt="必应" />(测试用，每日推荐)-->
    </div>
    
    <div class="engine">
        <div class="engine-pills">
    <button 
        type="button"
        :class="{
          'active': currentEngine === 'baidu',
        }"
        @click="currentEngine = 'baidu'"
    >
    百度
    </button>

    <button 
        type="button"
        :class="{
          'active': currentEngine === 'google',
        }"
        @click="currentEngine = 'google'"
    >
    谷歌
    </button>

    <button 
        type="button"
        :class="{
          'active': currentEngine === 'bing',
        }"
        @click="currentEngine = 'bing'"
    >
    必应
    </button>
</div>

    <!--搜素表单，阻止提交刷新，改为自己处理跳转-->
    <form class="search-form" @submit.prevent="handleSearch">
      <input 
      id="search-query"
      name = "search-query"
      type="text" 
      autocomplete="off" 
      v-model="searchQuery" 
      placeholder="请输入搜索内容" 
      />

      <button type="submit">搜索</button>
    </form>
  </div>

</div>
</template>

<!--加样式-->
<style lang="scss" scoped>

    .enimg{
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    }

    .enimg img{
        width: 200px;
        height: 100px;
        border-radius: 25px;
    }

    .main {
    display:flex;
    justify-content:center;
    align-items:center;
    flex-direction:column;
    gap:30px;
    }

    .engine {
        display:flex;
        flex-direction:column;
        align-items:center;
        gap:15px;
    }
    
    .engine-pills {
        display: flex;
        flex-direction: row;
        align-items: center;
        gap: 10px;
    }

    .engine img {
        width: 200px;
        height: 100px;
        border-radius: 16px;
    }


    .engine button {
            all: unset;
            cursor: pointer;
            padding: 6px 20px;
            font-size: 15px;
            color: rgba(245, 247, 255, 0.62);
            border-radius: 999px;
            transition: all 0.25s ease-in-out;
            flex-direction: row;
            align-items: center;
            gap: 15px;

            &.active {
                background: #96b4ff;
                color: #10142b;
                font-weight: 600;
        }
    }

.search-form {
    width: min(560px, 90vw);
    display: flex;
    gap: 10px;
    padding: 14px 20px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.28);
    border-radius: 20px;
    backdrop-filter: blur(10px);

    input{
        all: unset;
        flex: 1;
        font-size: 16px;
        color: #f5f7ff;

    &::placeholder {
        color: rgba(245, 247, 255, 0.62);
        }
}

.search-form button {
    all: unset;
    cursor: pointer;
    padding: 6px 20px;
    font-size: 10px;
    color: rgba(245, 247, 255, 0.15);
    border-radius: 999px;
    transition: all 0.25s ease-in-out;
    }
}
</style>