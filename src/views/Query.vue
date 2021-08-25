<template>
  <h1>Query LeverNFT or HedgeNFT</h1>
  <div class="normal">
   <table style="margin: auto">
   <tr><td><input v-model="tokenId" type="text" placeholder="Please enter the NFT's ID in Hex format"></td>
   <td><button @click="query" style="font-size: 24px">Query</button></td></tr>
   </table>
  </div>
</template>
