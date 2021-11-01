<template>
  <p style="font-size: 8px">&nbsp;</p>
  <h3 class="subtitle is-3">List tokens</h3>
  <div class="normal">
   <p style="text-align: center">
   <button class="button is-info" @click="list" :disabled="isListing">List tokens owned by:</button>&nbsp;
   <input class="userinput" v-model="addr" type="text" placeholder="Please enter an address in HEX format"></p>
   <p style="text-align: center"><button class="button is-info" @click="listMine" :disabled="isListing">List tokens owned by myself</button></p>
    <hr/>
    <template v-for="(token, idx) in tokenList" :keys="token.sn">
    <table style="border: 1px solid black; border-color: lightgrey">
    <tr><td>NFT</td><td>{{token.nftInfo}}</td></tr>
    <tr><td>Initial Collateral Rate</td><td>{{token.initCollateralRate}}</td></tr>
    <tr><td>Minimum Collateral Rate</td><td>{{token.minCollateralRate}}</td></tr>
    <tr><td>Mature Time</td><td>{{token.matureTime}}</td></tr>
    <tr><td>Closeout Penalty</td><td>{{token.closeoutPenalty}}</td></tr>
    <tr><td>Validator To Vote</td><td>{{token.validatorToVote}}</td></tr>
    <tr><td>Last VoteTime</td><td>{{token.lastVoteTime}}</td></tr>
    <tr><td>Price Oracle</td><td>{{token.oracle}}</td></tr>
    <tr><td>Hedge Value (in Stable Coin)&nbsp;&nbsp;</td><td>{{token.hedgeValue}}</td></tr>
    <tr><td>BCH Amount</td><td>{{token.amount}}</td></tr>
    </table>
    <p style="font-size: 8px">&nbsp;</p>
    </template>
  </div>
</template>

<script>
function timestamp2string(timestamp) {
	var t = new Date()
	t.setTime(timestamp)
	return t.toLocaleString("en-US", {hour12: false})
}

async function listTokensOf(myAddr) {
	const Transfer = ethers.utils.id("Transfer(address,address,uint256)")
	const provider = new ethers.providers.Web3Provider(window.ethereum)
	const signer = provider.getSigner()
	const contract = new ethers.Contract(XHedgeAddress, XHedgeABI, provider).connect(signer)
	if(myAddr.length == 0) {
		myAddr = await signer.getAddress()
	}
	console.log("myAddr", myAddr)
	const myAddrPad32 = ethers.utils.hexZeroPad(myAddr, 32)
	var tokenIdList = []
	var filter = {address: XHedgeAddress, topics: [Transfer, null/*sender*/, myAddrPad32/*receiver*/]}
	const STEPS = 50000
	var toBlock = await provider.getBlockNumber()
	while(toBlock > 0) {
		filter.toBlock = toBlock
		filter.fromBlock = Math.max(toBlock-STEPS+1, 0)
		var logs = await provider.getLogs(filter)
		for(var i=0; i<logs.length; i++) {
			const token = logs[i].topics[3]
			console.log("token", token, ethers.BigNumber.from(token))
			const id = ethers.BigNumber.from(token).toNumber()
			console.log("id", id)
			try {
				const owner = await contract.ownerOf(token)
				console.log("owner", owner)
				if(owner == myAddr) {
					tokenIdList.push(id)
				}
			} catch(e) { // "contract.ownerOf" may revert
				continue
			}
		}
		toBlock -= STEPS
	}
	var tokenMap = new Map()
	for(var i=0; i<tokenIdList.length; i++) {
		var sn = tokenIdList[i]>>1
		var tokenInfo = {sn: sn}
		if(tokenMap.has(sn)) {
			tokenInfo = tokenMap.get(sn)
		}
		if(tokenIdList[i]%2==1) {
			tokenInfo.hasLeverNFT = true
		} else {
			tokenInfo.hasHedgeNFT = true
		}
		tokenMap.set(sn, tokenInfo)
	}
	for (let [key, value] of tokenMap.entries()) {
		const vault = await contract.loadVault(value.sn)
		console.log("vault", vault)
		value.initCollateralRate = ethers.utils.formatUnits(vault.initCollateralRate)
		value.minCollateralRate = ethers.utils.formatUnits(vault.minCollateralRate)
		value.matureTime = timestamp2string(vault.matureTime*1000)
		value.lastVoteTime = timestamp2string(vault.lastVoteTime*1000)
		value.hedgeValue = ethers.utils.formatUnits(vault.hedgeValue)
		value.oracle = vault.oracle
		value.closeoutPenalty = ethers.utils.formatUnits(vault.closeoutPenalty)
		value.amount = ethers.utils.formatUnits(vault.amount)
		var tmp = ethers.utils.hexZeroPad(vault.validatorToVote.toHexString(), 20)
		value.validatorToVote = ethers.utils.getAddress(tmp)
		if(value.hasLeverNFT && value.hasHedgeNFT) {
			value.nftInfo = `${value.sn*2+1}(LeverNFT) and ${value.sn*2}(HedgeNFT)`
		} else if(value.hasLeverNFT) {
			value.nftInfo = `${value.sn*2+1}(LeverNFT)`
		} else if(value.hasHedgeNFT) {
			value.nftInfo = `${value.sn*2}(HedgeNFT)`
		}
		tokenMap.set(key, value)
	}
	var tokenList = []
	for (let value of tokenMap.values()) {
		tokenList.push(value)
	}
	console.log("tokenList", tokenList)
	return tokenList
}

export default {
  data() {
    return {
      addr: "",
      isListing: false,
      tokenList: [],
    }
  },
  methods: {
    extract() {
    },
    async list() {
      if(this.addr.length==0) {
        alert("Please enter an address!")
	return
      }
      try {
        const myAddr = ethers.utils.getAddress(this.addr)
      } catch(e) {
        alert("Invalid Address: "+this.addr)
	return
      }
      this.isListing = true
      this.tokenList = await listTokensOf(myAddr)
      this.isListing = false
    },
    async listMine() {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const myAddr = await signer.getAddress()
      this.isListing = true
      this.tokenList = await listTokensOf(myAddr)
      this.isListing = false
    },
  },
  async mounted() {
  }
}
</script>

