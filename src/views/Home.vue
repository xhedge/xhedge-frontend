<template>
  <h1>PureDApp for XHedge</h1>
  <div class="normal">
    This PureDApp is an utility to interact with XHedge.<br/>
    XHedge is a smart contract which can split BCH into LeverNFT and HedgeNFT. It also supports the LeverDay PoS scheme to allow validator election by coin-days.<br/>
    Here, you can:<br/>
    <ol>
    <li><a @click="create" href="">Create</a> LeverNFT and HedgeNFT by splitting BCH</li>
    <li><a @click="query" href="">Query</a> a NFT's detailed information</li>
    <li><a @click="mytokens" href="">List the tokens</a> owned by yourself</li>
    <li><a @click="operate" href="">Operate</a> one of your tokens</li>
    </ol>
  </div>
</template>

<script>
export default {
  name: 'Home',
  methods: {
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
