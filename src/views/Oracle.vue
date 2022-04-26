<template>
  <p style="font-size: 8px">&nbsp;</p>
  <h3 class="subtitle is-3">Oracle</h3>
  <div class="normal">
   <p>Oracle: 0xfeEf04aFB636fac5b0F91eBAC68C85F88ab260e6</p>
   <p style="text-align: center">
     <button class="button is-info" @click="getOracleInfo" :disabled="isLoading">Refresh</button>
   </p>
   <hr/>

   Latest Price: {{ latestPrice }}

   <hr/>
   12H Moving Average Prices:
   <table class="oracle">
    <tr>
      <th>Pair Address</th>
      <th>Min WBCH Reserves</th>
      <th>Moving Average Price</th>
    </tr>
    <template v-for="(priceInfo, idx) in prices" :keys="priceInfo.addr">
      <tr>
        <td>{{priceInfo.addr}}</td>
        <td>{{priceInfo.minR}}</td>
        <td>{{priceInfo.price}}</td>
      </tr>
    </template>
   </table>

   <hr/>
   Last updated time & WBCH reserves:
   <table class="oracle">
    <tr>
      <th>Epoch</th>
      <th>Last Updated Time</th>
      <template v-for="(addr, idx) in pairAddrs">
        <th>{{addr.substring(0, 8) + '..'}}</th>
      </template>
    </tr>
    <template v-for="(observation, idx) in observations" :keys="observation.epoch">
     <tr>
       <td>{{observation.epoch}}</td>
       <td>{{observation.lastUpdatedTime}}</td>
       <template v-for="(pair, idx) in observation.pairs">
        <td>{{pair.wbch}}</td>
       </template>
     </tr>
    </template>
   </table>
    <p style="font-size: 8px">&nbsp;</p>

  </div>
</template>

<script>
const oracleAddr = '0xfeEf04aFB636fac5b0F91eBAC68C85F88ab260e6';
const oracleABI = `[
  {
    "inputs": [
      {
        "internalType": "address",
        "name": "wbchAddr",
        "type": "address"
      },
      {
        "internalType": "address[]",
        "name": "pairAddrs",
        "type": "address[]"
      }
    ],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "caller",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "newAvgPrice",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "updatedTime",
        "type": "uint256"
      }
    ],
    "name": "UpdateObservations",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "internalType": "address",
        "name": "caller",
        "type": "address"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "pairIdx",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "wbchReserve",
        "type": "uint256"
      },
      {
        "indexed": false,
        "internalType": "uint256",
        "name": "updatedTime",
        "type": "uint256"
      }
    ],
    "name": "UpdateWbchReserve",
    "type": "event"
  },
  {
    "inputs": [],
    "name": "avgPrice",
    "outputs": [
      {
        "internalType": "uint192",
        "name": "",
        "type": "uint192"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getLastUpdatedTime",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPairs",
    "outputs": [
      {
        "components": [
          {
            "internalType": "address",
            "name": "addr",
            "type": "address"
          },
          {
            "internalType": "uint8",
            "name": "wbchIdx",
            "type": "uint8"
          },
          {
            "internalType": "uint8",
            "name": "usdDecimals",
            "type": "uint8"
          },
          {
            "components": [
              {
                "internalType": "uint64",
                "name": "timestamp",
                "type": "uint64"
              },
              {
                "internalType": "uint112",
                "name": "wbchReserve",
                "type": "uint112"
              },
              {
                "internalType": "uint256",
                "name": "priceCumulative",
                "type": "uint256"
              }
            ],
            "internalType": "struct UniSwapV2Oracle.Observation[24]",
            "name": "observations",
            "type": "tuple[24]"
          }
        ],
        "internalType": "struct UniSwapV2Oracle.Pair[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getPrice",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "idx",
        "type": "uint256"
      }
    ],
    "name": "getPriceOfPair",
    "outputs": [
      {
        "internalType": "uint256",
        "name": "price",
        "type": "uint256"
      },
      {
        "internalType": "uint256",
        "name": "weight",
        "type": "uint256"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "priceWinodwSize",
    "outputs": [
      {
        "internalType": "uint64",
        "name": "",
        "type": "uint64"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "update",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {
        "internalType": "uint256",
        "name": "idx",
        "type": "uint256"
      }
    ],
    "name": "updateReserveOfPair",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
]`;

async function loadPairs() {
  // const provider = new ethers.providers.Web3Provider(window.ethereum);
  const provider = new ethers.providers.JsonRpcProvider({
    url    : 'https://rpc.uatvo.com',
    timeout: 5000,
  });

  const oracle = new ethers.Contract( oracleAddr , oracleABI , provider );
  // const ts = await provider.getBlock('latest').then(b => b.timestamp);
  const pairs = await oracle.getPairs();
  // console.log(pairs);
  return [oracle, pairs];
}

function toObservations(pairs) {
  if (pairs.length == 0) {
    return [];
  }

  const observations = [];
  for (let i = 0; i < pairs[0].observations.length; i++) {
    const obsv = {
      epoch: i,
      lastUpdatedTime: new Date(pairs[0].observations[i].timestamp * 1000).toLocaleString(),
      pairs: [],
    };

    for (let pair of pairs) {
      obsv.pairs.push({
        addr: pair.addr,
        wbch: bn18ToNum(pair.observations[i].wbchReserve).toFixed(2),
      });
    }

    observations.push(obsv);
  }

  return observations;
}

async function toPrices(oracle, pairs) {
  if (pairs.length == 0) {
    return [];
  }

  const prices = [];
  for (let idx = 0; idx < pairs.length; idx++) {
    const pair = pairs[idx];
    const [price, minR] = await oracle.getPriceOfPair(idx);

    prices.push({
      addr: pair.addr,
      minR: bn18ToNum(minR).toFixed(2),
      price: bn18ToNum(price).toFixed(2),
    });
  };

  return prices;
}

// function getMinWbchReserve(pair) {
//   return Math.min(... pair.observations.map(o => bn18ToNum(o.wbchReserve))).toFixed(2);
// }
function bn18ToNum(n) {
  return Number(ethers.utils.formatUnits(n));
}

export default {
  data() {
    return {
      addr: "",
      isLoading: false,
      latestPrice: 0,
      observations: [],
      pairAddrs: [],
      prices: [],
    }
  },
  methods: {
    extract() {
    },

    async getOracleInfo() {
      this.isLoading = true

      const [oracle, pairs] = await loadPairs();
      this.latestPrice = await oracle.getPrice().catch(err => 0);
      this.prices = await toPrices(oracle, pairs);
      this.observations = toObservations(pairs);
      if (this.observations.length > 0) {
        this.pairAddrs = this.observations[0].pairs.map(p => p.addr);
      }

      this.isLoading = false
    },
  },

  async mounted() {
  }
}
</script>

