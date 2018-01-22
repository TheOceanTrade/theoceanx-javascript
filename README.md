# theoceanx-javascript
JavaScript client library for The Ocean X

## Setup

For full trading functionality, The Ocean X JavaScript library requires API credentials and a web3 provider to be passed during instantiation.

```javascript
import Ocean from 'theoceanx'

const config = {
  api: {
    key: 'your key',
    secret: 'your secret'
  },
  web3Provider: web3.currentProvider
}

const ocean = new Ocean(config)

```

If API credentials are omitted, `trade` methods requiring authentication will be unavailable.

```javascript
// no api credentials
const config = {
  web3Provider: web3.currentProvider
}

const ocean = new Ocean(config)

console.log(typeof ocean.trade.newOrder) // "function"
console.log(typeof ocean.trade.newLimitOrder) // "undefined"
console.log(typeof ocean.trade.userHistory) // "undefined"
```


If a web3 provider is omitted, all `trade` and `wallet` methods will be unavailable.

```javascript
// no web3 provider
const config = {
  api: {
    key: 'your key',
    secret: 'your secret'
  }
}

const ocean = new Ocean(config)

console.log(typeof ocean.trade.newLimitOrder) // "undefined"
console.log(typeof ocean.wallet.getTokenBalance) // "undefined"
```

##
API

Methods in theoceanx.js are segemented into `marketData`, `trade`, `wallet`, and `ws`.

`marketData`
 - [`marketData.tokenPairs()`]()
 - [`marketData.tickers()`]()
 - [`marketData.ticker()`]()


