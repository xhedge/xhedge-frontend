<template>
  <div id="nav" style="font-size: 25px">
    <router-link tag="li" to="/">Home</router-link><span style="color: #EEEEEE"> | </span>
    <router-link tag="li" to="/create">Create</router-link><span style="color: #EEEEEE"> | </span>
    <router-link tag="li" to="/mytokens">Tokens</router-link><span style="color: #EEEEEE"> | </span>
    <router-link tag="li" to="/operate">Operate</router-link><span style="color: #EEEEEE"> | </span>
    <router-link tag="li" to="/validators">Validators</router-link><span style="color: #EEEEEE"> | </span>
    <router-link tag="li" to="/oracle">Oracle</router-link>
  </div>
  <router-view v-slot="{ Component }">
  <keep-alive>
    <component :is="Component" />
  </keep-alive>
  </router-view>
</template>
<style>
</style>  
