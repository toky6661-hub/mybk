<!--这是一个导航栏的组件-->
<script>
import { url } from 'inspector';
import { onMounted } from 'vue';

/*主要用于导入外部配置和定义*/
const newName = ref("")
const newUrl = ref("")

function addWebsite (){

    if(!newName.value || !newUrl.value){
        return;
    }

    sidebarGroups.value[0].links.push({
        name:newName.value,
        url:newName.value

    })

    newName.value= ""
    newUrl.value= ""

    localStorage.setItem(
        "sidebar",
        JSON.stringify(sidebarGroups.value)
    )
}

onMounted(() => {
    const save = localStorage.getItem("sidebar")

    if(save){
        sidebarGroups.value = 
        JSON.parse(save)
    }
})

</script>

<template>
<!--主要用于表单的内容-->
    <div class="add-box">
        <input 
            v-model="newName"
            placeholder="网站名称"
        />

        <input 
            v-model="newUrl"
            placeholder="网站地址"
        />

        <button @click="addWebsite">
            添加
        </button>
    </div>
</template>

<style>
    /*划分改变格式，用于添加触发器*/
    .sidebar-group{
        display: flex;
        flex-wrap:wrap ;
        align-content: flex-start;
        gap: 12px;
    }

    .sidebar-item{
        width: 160px;
        height: 200px;
    }
</style>