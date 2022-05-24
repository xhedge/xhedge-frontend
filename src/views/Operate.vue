<template>
  <p style="font-size: 8px">&nbsp;</p>
  <h4 class="subtitle is-3">Operate My NFT</h4>
  <div class="normal">
   <p style="text-align: center">The operated NFT: <input class="userinput" v-model="tokenId" type="number" placeholder="Please enter the ID of you LeverNFT or HedgeNFT"></p>
   <br/>
   <br/>
   <p>Change the BCH amount: <input class="userinput" v-model="bchAmount" type="number" placeholder="Please enter a number"><button class="button is-info" @click="changeAmount">Change</button><br>
   The LeverNFT's owner can change the BCH amount stored inside a vault, as long as the collateral rate does not drop below its minimum value.
   </p>
   <hr/>
   <button class="button is-info" @click="liquidate">Liquidate</button><br>
   The LeverNFT's owner and the HedgeNFT's owner both can liquidate the vault after mature time.
   <hr/>
   <button class="button is-info" @click="closeout">Closeout</button><br>
   Before mature time, if the price drops and the collateral rate is less than its minimum value, the HedgeNFT's owner can closeout the vault.
   <hr/>
   <button class="button is-info" @click="burn">Burn the NFT pair</button><br>
   If you owns both the LeverNFT and the HedgeNFT, you can burn them and take back the BCH in the value.
   <hr/>
   <button class="button is-info" @click="vote">Vote</button><br>
   Anyone can make this vault to vote for its supported validator with its accumulated coin-days. After voting, the accumulated coin-days will be reset to zero.
   <hr/>
   <p>The new validator to support: <input class="userinput" v-model="newVal" type="text" placeholder="Please enter an address in HEX format">
   <button class="button is-info" @click="changeVal">Change</button></p>
   <hr/>
   <p>Transfer it to a new owner: <input class="userinput" v-model="newOwner" type="text" placeholder="Please enter an address in HEX format">
   <button class="button is-info" @click="transfer">Transfer</button></p>
   <hr/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      tokenId: "",
      bchAmount: "",
      newVal: "",
      newOwner: "",
    }
  },
  methods: {
    async changeAmount() {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(XHedgeAddress, XHedgeABI, provider).connect(signer)
      const sn = this.tokenId >> 1
      const vault = await contract.loadVault(sn)
      var value = ethers.BigNumber.from(0)
      const newAmount = ethers.utils.parseUnits(this.bchAmount.toString())
      if(vault.amount.lt(newAmount)) {
        value = newAmount.sub(vault.amount)
      }
      try {
        await contract.changeAmount(sn, newAmount, {value: value})
      } catch(e) {
        alert(e.data.message)
      }
    },
    async liquidate() {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(XHedgeAddress, XHedgeABI, provider).connect(signer)
      try {
        await contract.liquidate(this.tokenId)
      } catch(e) {
        alert(e.data.message)
      }
    },
    async closeout() {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(XHedgeAddress, XHedgeABI, provider).connect(signer)
      try {
        await contract.closeout(this.tokenId)
      } catch(e) {
        alert(e.data.message)
      }
    },
    async burn() {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(XHedgeAddress, XHedgeABI, provider).connect(signer)
      try {
        await contract.burn(this.tokenId>>1)
      } catch(e) {
        alert(e.data.message)
      }
    },
    async vote() {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(XHedgeAddress, XHedgeABI, provider).connect(signer)
      try {
        await contract.vote(this.tokenId>>1)
      } catch(e) {
        alert(e.data.message)
      }
    },
    async changeVal() {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(XHedgeAddress, XHedgeABI, provider).connect(signer)
      try {
        await contract.changeValidatorToVote(this.tokenId, this.newVal)
      } catch(e) {
        alert(e.data.message)
      }
    },
    async transfer() {
      var newOwner
      try {
        newOwner = ethers.utils.getAddress(this.newOwner)
      } catch(e) {
        alert("Invalid Address: "+this.newOwner)
	return
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(XHedgeAddress, XHedgeABI, provider).connect(signer)
      const from = await signer.getAddress()
      try {
        await contract.transferFrom(from, newOwner, this.tokenId)
      } catch(e) {
        alert(e.data.message)
      }
    },
  },
  mounted() {
  }
}
</script>
