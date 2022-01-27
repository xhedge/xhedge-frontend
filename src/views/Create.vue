<template>
  <p style="font-size: 8px">&nbsp;</p>
  <h3 class="subtitle is-3">Create LeverNFT&HedgeNFT</h3>
  <div class="normal">
    You can lock some BCHs into XHedge and get one LeverNFT and one HedgeNFT. The BCH value held in the LeverNFT will anchor to a fixed amount of USD, while the BCH value held in the HedgeNFT is floating.<br/>
   <table style="margin: auto">
   <tr><td>Fixed USD Value in HedgeNFT&nbsp;&nbsp;</td>
   <td><input class="userinput" v-model="hedgeValue" type="text" placeholder="Please enter a number such as 9.8"></td></tr>
   <tr><td>Initial Collateral Rate</td>
   <td><input class="userinput" v-model="initCollateralRate" type="text" placeholder="Please enter a percentage such as 200%"></td></tr>
   <tr><td>Minimum Collateral Rate</td>
   <td><input class="userinput" v-model="minCollateralRate" type="text" placeholder="Please enter a percentage such as 150%"></td></tr>
   <tr><td>Closeout Penalty</td>
   <td><input class="userinput" v-model="closeoutPenalty" type="text" placeholder="Please enter a percentage such as 12%"></td></tr>
   <tr><td>Mature Time</td>
   <td><input class="userinput" v-model="matureTime" type="datetime-local"></td></tr>
   <tr><td>The Supported Validator</td>
   <td><input class="userinput" v-model="validatorToVote" type="text" placeholder="Please enter a pubkey in HEX format"></td></tr>
   <tr><td>BCH Price Oracle</td>
   <td><input class="userinput" v-model="oracle" type="text" placeholder="Please enter an address in HEX format"></td></tr>
   </table>
   <p style="text-align: center"><button class="button is-info" @click="submit" style="font-size: 24px; width: 300px">Create!</button></p>
  </div>
</template>

<style>
input[type="text"]
{
    font-size:20px;
    width:500px;
}
</style>

<script>
export default {
  data() {
    return {
      hedgeValue: 1.0,
      initCollateralRate: 0.6,
      minCollateralRate: 0.3,
      closeoutPenalty: 0.05,
      matureTime: 0,
      validatorToVote: "",
      oracle: "0xD8041620b4fBD6B0630e4a9104cD2A6Af68e216A",
    }
  },
  methods: {
    extract() {
       this.addressList = extractAddrList(this.addressList, this.sep20Address)
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
      try {
        var validator32 = ethers.utils.hexZeroPad(this.validatorToVote, 32)
      } catch(e) {
        alert("Invalid Validator Pubkey: ", this.validatorToVote)
	return
      }
      const tenPow18 = ethers.BigNumber.from(10).pow(18)
      var value = (tenPow18.add(initCollateralRate)).mul(hedgeValue).mul(ethers.BigNumber.from(110)) // 10% margin
      var div = ethers.BigNumber.from(100).mul(price)
      value = value.div(div)
      
      const signer = provider.getSigner()
      const xhedgeContract = new ethers.Contract(XHedgeAddress, XHedgeABI, provider).connect(signer)
      await xhedgeContract.createVaultPacked(a, validator32, b, {value: value})
    },
  },
  async mounted() {
    var matureTime = new Date()
    var t = matureTime.getTime() + 7 * 24 * 3600 * 1000
    matureTime.setTime(t)
    matureTime.setMinutes(matureTime.getMinutes() - matureTime.getTimezoneOffset())
    this.matureTime = matureTime.toISOString().slice(0,16)
  }
}
</script>
