<!--一个独立的时钟组件-->
<!--前置<Clock />-->

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';

const timeText = ref('--:--:--');
const dateText = ref('');
const proverbText = ref('');

let timer: ReturnType<typeof setInterval> | undefined;

function updateTime() {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  timeText.value = `${hours}:${minutes}:${seconds}`;

  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  dateText.value = `${year}-${month}-${day}`;

  const weekDays = ['星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六'];
  const weekDay = weekDays[now.getDay()];
  dateText.value += ` ${weekDay}`;
}

function getProverb() {
  const Proverbs = [
    '烟花易冷意难明',
    '人生若只如初见',
    '岁月不居，时节如流',
    '海内存知己，天涯若比邻',
    '长风破浪会有时，直挂云帆济沧海',
  ];

  const randomIndex = Math.floor(Math.random() * Proverbs.length);
  return Proverbs[randomIndex];

}

async function getNetWorkProverbs() {
  try {
    const response = await fetch('https://v1.hitokoto.cn/');
    const data = await response.json();
    proverbText.value = data.hitokoto || '暂无名言';
  }
  catch(error) {
    console.error('Fetch proverb failed', error);
    proverbText.value = '暂无名言';
  }
}

onMounted(async() => {
  updateTime();
  proverbText.value = getProverb();
  await getNetWorkProverbs();

  timer = setInterval(updateTime, 1000);
});

onUnmounted(() => {
  if (timer) {
    clearInterval(timer);
  }
});
</script>

<template>

  <div class="main">
    <div class="clock">
      <div class="clock__time">{{ timeText }}</div>
      <div class="clock__date">{{ dateText }}</div>

      <span class="clock-pro__proverbs">{{ proverbText }}</span>
      <span class="clock-box__text">欢迎</span>
    </div>
  </div>
</template>

<style lang="scss" scoped>

.main {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  flex-direction: column;
}

.clock {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-family: 'Arial', sans-serif;
  color: #f5f8f8;

  &__time {
    font-size: 5rem;
    font-weight: bold;
  }

  &__date {
    font-size: 3rem;
    margin-top: 0.5rem;
  }
}

.clock-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;

  &__text {
    font-size: 3.5rem;
    color: #f5f5f5;
    margin-bottom: 0.5rem;
  }
}

.clock-pro {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 1rem;

  &__proverbs {
    font-size: 2.5rem;
  }
}

.date {
  font-size: 20rem;
  color: #dbdce3;
  margin-top: 0.5rem;
}

</style>