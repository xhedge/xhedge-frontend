<template>
  <p style="font-size: 8px">&nbsp;</p>
  <h3 class="subtitle is-3">Pure DApp for XHedge</h3>
  <div class="normal">
    XHedge is a smart contract which can split BCH into LeverNFT and HedgeNFT. It also supports the LeverDay PoS scheme to allow validator election by coin-days.<br/>
    Here, you can:<br/>
    <p>&nbsp;&nbsp;1.&nbsp;<a @click="create" href="">Create</a> LeverNFT and HedgeNFT by splitting BCH</p>
    <p>&nbsp;&nbsp;2.&nbsp;<a @click="query" href="">Query</a> a NFT's detailed information</p>
    <p>&nbsp;&nbsp;3.&nbsp;<a @click="mytokens" href="">List the tokens</a> owned by yourself</p>
    <p>&nbsp;&nbsp;4.&nbsp;<a @click="operate" href="">Operate</a> one of your tokens</p>
    <p>This is a <a href="https://www.puredapp.org">Pure DApp</a>, which means its contract code and front-end code are both opensource and anyone can deploy them at anywhere.</p>
    <p><b>CAVEAT:</b> This is an opensource software. It is provided “as is”, without warranty of any kind. Please use it <b>AT YOUR OWN RISK</b>.</p>
    <!--
    <p><button @click="deployLogic">deployLogic</button></p>
    <p><button @click="deployMockOrcale">deployMockOrcale</button></p>
    -->
    <!-- <p><button @click="changePrice">Change Oracle's Price (debug)</button></p> -->
    
  </div>
</template>

<script>
async function deploy(bytecode) {
  const abi = [ "constructor() public" ];
  
  const provider = new ethers.providers.Web3Provider(window.ethereum)
  try {
    const signer = provider.getSigner()
    const factory = new ethers.ContractFactory(abi, bytecode, signer)
    const contract = await factory.deploy();
    console.log("address:", contract.address)
    const receipt = await contract.deployTransaction.wait();
    console.log(receipt)
  } catch(e) {
    alert("Error! "+e.toString())
  }
}

export default {
  name: 'Home',
  methods: {
    async deployLogic() {
      await deploy(window.XHedgeBytecode)
    },
    async deployMockOrcale() {
      const abi = [ "constructor(uint initPrice) public" ];
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      try {
        const signer = provider.getSigner()
        const factory = new ethers.ContractFactory(abi, MockOracleBytecode, signer)
        const contract = await factory.deploy(ethers.utils.parseUnits("600"));
        console.log("address:", contract.address)
        const receipt = await contract.deployTransaction.wait();
        console.log(receipt)
      } catch(e) {
        alert("Error! "+e.toString())
      }
    },
    async changePrice() {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const priceContract = new ethers.Contract(MockOracleAddress, PriceOracleABI, provider).connect(signer)
      const oldPrice = await priceContract.getPrice()
      const price = prompt("The old prime is "+ethers.utils.formatUnits(oldPrice)+".Please enter the new price:")
      if(price) {
        await priceContract.setPrice(ethers.utils.parseUnits(price.toString()))
      }
    },
    create() {
      this.$router.push('create');
    },
    query() {
      this.$router.push('query');
    },
    mytokens() {
      this.$router.push('mytokens');
    },
    operate() {
      this.$router.push('operate');
    }
  }
}
</script>
