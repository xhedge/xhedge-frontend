<template>
  <h1>Operate My NFT</h1>
  <div class="normal">
   <p>The operated NFT: <input v-model="tokenId" type="text" placeholder="Please enter an address in HEX format"></p>
   <hr/>
   <p>Change Its Collateral: <input v-model="tokenId" type="text" placeholder="Please enter a number"></p>
   <p><button @click="incrCollateral" style="font-size: 24px">Increase</button>
   <button @click="decrCollateral" style="font-size: 24px">Decrease</button></p>
   <hr/>
   <button @click="liquidate" style="font-size: 24px">Liquidate</button>
   <hr/>
   <button @click="burn" style="font-size: 24px">Burn the NFT pair</button>
   <hr/>
   <button @click="vote" style="font-size: 24px">Vote</button>
   <hr/>
   <p>The New Validator to Support: <input v-model="newVal" type="text" placeholder="Please enter an address in HEX format">
   <button @click="changeVal" style="font-size: 24px">Change</button></p>
   <hr/>
   <p>Its New Owner: <input v-model="newOwner" type="text" placeholder="Please enter an address in HEX format">
   <button @click="newOwner" style="font-size: 24px">Transfer</button></p>
   <hr/>
  </div>
</template>
