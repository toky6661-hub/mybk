// src/api.js
//把所有跟后端接口打交道的代码集中放在这里
//好处：不用再组件里到处写axios.get（‘/api/posts/’ + id） 这种字符串拼接
//若是以后接口路径改变，也只需改这一个文件，不用满项目找

import axios from "axios";//axios是比浏览器的原生fetch更好用的http请求库，封装了很多功能，返回的结果是一个promise对象

//创建一个定制的axios实例，方便以后统一配置，取消部分代码的全局
const request = axios.create({
  baseURL: "http://localhost:3000", //接口的基础路径
  timeout: 5000, //请求超时时间
});

//获取文章列表：对应后端接口：GET /api/posts/
export const getPosts = () => {
  return request.get("/posts/");//返回一个promise对象，组件里用await拿结果
};

//创建文章：对应后端接口：POST /api/posts/
export const createPost = (postData) => {
    //postData的预期是{{title: 'xxx', content: 'xxx'}}，组件里传入一个对象
    //axios.post的第二个参数就是请求体数据，axios会自动把对象转成json字符串
  return request.post("/posts/", postData);
};

//删除文章：对应后端接口：DELETE /api/posts/:id
export const deletePost = (id) => {
  return request.delete(`/posts/${id}/`);
};