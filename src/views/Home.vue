<template>
  <h1>PureDApp for XHedge</h1>
  <div class="normal">
    This PureDApp is an utility to interact with XHedge.<br/>
    XHedge is a smart contract which can split BCH into LeverNFT and HedgeNFT. It also supports the LeverDay PoS scheme to allow validator election by coin-days.<br/>
    Here, you can:<br/>
    <ol>
    <li><a @click="create" href="">Create</a> LeverNFT and HedgeNFT by splitting BCH</li>
    <li>Query one or more NFTs' detailed information</li>
    <li>List the tokens owned by yourself</li>
    <li>Operate one of your tokens</li>
    </ol>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
    create() {
      this.$router.push('create');
    }
  }
}
</script>
