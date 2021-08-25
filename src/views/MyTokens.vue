<template>
  <h1>List tokens</h1>
  <div class="normal">
   <p><input v-model="addr" type="text" placeholder="Please enter an address in HEX format"><p/>
   <p><button @click="list" style="font-size: 24px">List tokens owned by above address</button><p/>
   <p><button @click="listmine" style="font-size: 24px">List tokens owned by myself</button><p/>
  </div>
</template>
