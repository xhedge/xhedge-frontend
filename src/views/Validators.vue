<template>
  <p style="font-size: 8px">&nbsp;</p>
  <h3 class="subtitle is-3">List Validators</h3>
  <div class="normal">
   <p style="text-align: center">
     <button class="button is-info" @click="getValidators" :disabled="isListing">List Validators</button>
   </p>
   <hr/>

   current validators:
   <template v-for="(validator, idx) in currValidators" :keys="validator.address">
    <table style="border: 1px solid black; border-color: lightgrey">
    <tr><td>address: </td><td>{{validator.address}}</td></tr>
    <tr><td>pubkey: </td><td>{{validator.pubkey}}</td></tr>
    <tr><td>reward_to: </td><td>{{validator.reward_to}}</td></tr>
    <tr><td>voting_power: </td><td>{{validator.voting_power}}</td></tr>
    <tr><td>introduction: </td><td>{{validator.introduction}}</td></tr>
    <tr><td>is_retiring: </td><td>{{validator.is_retiring}}</td></tr>
    <tr><td>miner_address: </td><td>{{'0x' + validator.miner_address}}</td></tr>
    </table>
    <p style="font-size: 8px">&nbsp;</p>
   </template>

   <hr/>
	 all validators:
   <template v-for="(validator, idx) in validators" :keys="validator.address">
    <table style="border: 1px solid black; border-color: lightgrey">
    <tr><td>address: </td><td>{{validator.address}}</td></tr>
    <tr><td>pubkey: </td><td>{{validator.pubkey}}</td></tr>
    <tr><td>reward_to: </td><td>{{validator.reward_to}}</td></tr>
    <tr><td>voting_power: </td><td>{{validator.voting_power}}</td></tr>
    <tr><td>introduction: </td><td>{{validator.introduction}}</td></tr>
    <tr><td>is_retiring: </td><td>{{validator.is_retiring}}</td></tr>
    <tr><td>miner_address: </td><td>{{'0x' + validator.miner_address}}</td></tr>
    </table>
    <p style="font-size: 8px">&nbsp;</p>
   </template>
  </div>
</template>

<script>
async function getValidators() {
  // const provider = new ethers.providers.Web3Provider(window.ethereum);
  const provider = new ethers.providers.JsonRpcProvider({
    url    : 'https://rpc.uatvo.com',
    timeout: 2000,
  });

  return await provider.send('sbch_validatorsInfo', []);
}

export default {
  data() {
    return {
      addr: "",
      isListing: false,
      validators: [],
    }
  },
  methods: {
    extract() {
    },

    async getValidators() {
      this.isListing = true
      const result = await getValidators();;
      this.validators = result.validators;
      this.currValidators = result.currValidators;
      this.isListing = false
    },
  },
  async mounted() {
  }
}
</script>

