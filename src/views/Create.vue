<template>
  <h1>Create LeverNFT&HedgeNFT</h1>
  <div class="normal">
    You can lock some BCHs into XHedge and get one LeverNFT and one HedgeNFT. The BCH value held in the LeverNFT will anchor to a fixed amount of USD, while the BCH value held in the HedgeNFT is floating.<br/>
   <table style="margin: auto">
   <tr><td>Fixed USD Value in HedgeNFT</td>
   <td><input v-model="hedgeValue" type="text" placeholder="Please enter a number such as 9.8"></td></tr>
   <tr><td>Initial Collateral Rate</td>
   <td><input v-model="initCollateralRate" type="text" placeholder="Please enter a percentage such as 200%"></td></tr>
   <tr><td>Minimum Collateral Rate</td>
   <td><input v-model="minCollateralRate" type="text" placeholder="Please enter a percentage such as 150%"></td></tr>
   <tr><td>Closeout Penalty</td>
   <td><input v-model="closeoutPenalty" type="text" placeholder="Please enter a percentage such as 12%"></td></tr>
   <tr><td>Mature Time</td>
   <td><input v-model="matureTime" type="datetime-local"></td></tr>
   <tr><td>The Supported Validator</td>
   <td><input v-model="validatorToVote" type="text" placeholder="Please enter an address in HEX format"></td></tr>
   <tr><td>BCH Price Oracle</td>
   <td><input v-model="oracle" type="text" placeholder="Please enter an address in HEX format"></td></tr>
   </table>
   <button @click="submit" style="font-size: 24px; width: 300px">Create!</button>
  </div>
</template>

<style>
input[type="text"]
{
    font-size:20px;
    width:500px;
}
</style>
