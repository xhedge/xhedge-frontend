<template>
  <p style="font-size: 8px">&nbsp;</p>
  <h3 class="subtitle is-3">List Validators</h3>
  <div class="normal">
   <p style="text-align: center">
     <button class="button is-info" @click="getAllValidators" :disabled="isListing">List Validators</button>
   </p>
   <hr/>

   PoS Votes (The validators' accumulated votes in current epoch. These votes will be cleared when switching epoch): 
   <template v-for="(posVote, idx) in posVotes" :key="posVote.val">
    <table style="border: 1px solid black; border-color: lightgrey">
    <tr><td>pubkey: </td><td>{{posVote.pubKey}}</td></tr>
    <tr><td>votes: </td><td>{{posVote.votes}}</td></tr>
    </table>
    <p style="font-size: 8px">&nbsp;</p>
   </template>

  <hr/>
   current validators:
   <template v-for="(validator, idx) in currValidators" :key="validator.address">
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
   <template v-for="(validator, idx) in validators" :key="validator.address">
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
async function getAllValidators() {
  // const provider = new ethers.providers.Web3Provider(window.ethereum);
  const provider = new ethers.providers.JsonRpcProvider({
    url    : 'https://rpc.uatvo.com',
    timeout: 2000,
  });

  return await provider.send('sbch_validatorsInfo', []);
}

async function getPosVotes() {
  // const provider = new ethers.providers.Web3Provider(window.ethereum);
  const provider = new ethers.providers.JsonRpcProvider({
    url    : 'https://rpc.uatvo.com',
    timeout: 2000,
  });
  const xhedge = new ethers.Contract(XHedgeAddress, XHedgeABI, provider);

  const posVotes = [];
  for (let i = 0; ; i++) {
    try {
      const pubKey = await xhedge.validators(i);
      const votes = await xhedge.valToVotes(pubKey);
      posVotes.push({
        pubKey: pubKey.toHexString(),
        votes: Number(ethers.utils.formatUnits(votes)) / (24 * 3600),
      });
    } catch (err) {
      break;
    }
  }

  return posVotes;
}

export default {
  data() {
    return {
      addr: "",
      isListing: false,
      validators: [],
      posVotes: [],
    }
  },
  methods: {
    extract() {
    },

    async getAllValidators() {
      this.isListing = true
      const allVals = await getAllValidators();
      const posVotes = await getPosVotes();
      this.validators = allVals.validators;
      this.currValidators = allVals.currValidators;
      this.posVotes = posVotes;
      this.isListing = false
    },
  },
  async mounted() {
  }
}
</script>

