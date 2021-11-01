<template>
  <p style="font-size: 8px">&nbsp;</p>
  <h3 class="subtitle is-3">Operate My NFT</h3>
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
      const newAmount = ethers.utils.parseUnits(this.bchAmount)
      var value = ethers.BigNumber.from(0)
      const vault = await contract.loadVault(value.sn)
      if(vault.amount.lt(newAmount)) {
        value = newAmount.sub(vault.amount)
      }
      await contract.changeAmount(sn, newAmount, {value: value})
    },
    async liquidate() {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(XHedgeAddress, XHedgeABI, provider).connect(signer)
      await contract.liquidate(this.tokenId)
    },
    async closeout() {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(XHedgeAddress, XHedgeABI, provider).connect(signer)
      await contract.closeout(this.tokenId)
    },
    async burn() {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(XHedgeAddress, XHedgeABI, provider).connect(signer)
      await contract.burn(this.tokenId>>1)
    },
    async vote() {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(XHedgeAddress, XHedgeABI, provider).connect(signer)
      await contract.vote(this.tokenId>>1)
    },
    async changeVal() {
      var newVal
      try {
        newVal = ethers.utils.getAddress(this.newVal)
      } catch(e) {
        alert("Invalid Address: "+this.newVal)
	return
      }
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(XHedgeAddress, XHedgeABI, provider).connect(signer)
      await contract.changeValidatorToVote(this.tokenId, newVal)
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
      await contract.transferFrom(from, newOwner, this.tokenId)
    },
    async submit() {
      const initCollateralRate = ethers.utils.parseUnits(this.initCollateralRate.toString())
      const minCollateralRate = ethers.utils.parseUnits(this.minCollateralRate.toString())
      const closeoutPenalty = ethers.utils.parseUnits(this.closeoutPenalty.toString())
      console.log(this.matureTime)
      console.log((new Date(this.matureTime)))
      const matureTimestamp = Math.floor((new Date(this.matureTime)).getTime() / 1000)
      const twoPow64 = ethers.BigNumber.from(2).pow(64)
      var a = initCollateralRate
      a = a.mul(twoPow64).add(minCollateralRate)
      a = a.mul(twoPow64).add(closeoutPenalty)
      a = a.mul(twoPow64).add(matureTimestamp)
      const twoPow160 = ethers.BigNumber.from(2).pow(160)
      const hedgeValue = ethers.utils.parseUnits(this.hedgeValue.toString())
      var b = hedgeValue.mul(twoPow160)
      var oracleAddr
      try {
        oracleAddr = ethers.utils.getAddress(this.oracle)
        b = b.add(ethers.BigNumber.from(oracleAddr))
      } catch(e) {
        alert("Invalid Address: ", this.oracle)
	return
      }
      var price
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const oracleContract = new ethers.Contract(oracleAddr, PriceOracleABI, provider)
      try {
        price = ethers.BigNumber.from(await oracleContract.getPrice())
      } catch(e) {
        alert("Invalid Price Oracle: ", this.oracle)
	return
      }
      var validatorAddr32
      try {
        const validatorAddr = ethers.utils.getAddress(this.validatorToVote)
        validatorAddr32 = ethers.utils.hexZeroPad(validatorAddr, 32)
      } catch(e) {
        alert("Invalid Address: ", this.validatorToVote)
	return
      }
      const tenPow18 = ethers.BigNumber.from(10).pow(18)
      var value = (tenPow18.add(initCollateralRate)).mul(hedgeValue).mul(ethers.BigNumber.from(110)) // 10% margin
      var div = ethers.BigNumber.from(100).mul(price)
      value = value.div(div)
      
      const signer = provider.getSigner()
      const xhedgeContract = new ethers.Contract(XHedgeAddress, XHedgeABI, provider).connect(signer)
      await xhedgeContract.createVaultPacked(a, validatorAddr32, b, {value: value})
    },
  },
  mounted() {
  }
}
</script>
