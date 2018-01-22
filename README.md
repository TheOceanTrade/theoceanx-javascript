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
import Ocean from 'theoceanx'

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
import Ocean from 'theoceanx'

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

Methods in theoceanx.js are segemented into `marketData`, `trade`, and `wallet`.

`marketData`
 - [`marketData.tokenPairs()`](https://docs.theoceanx.com/)
 - [`marketData.tickers()`](https://docs.theoceanx.com/)
 - [`marketData.ticker()`](https://docs.theoceanx.com/)
 - [`marketData.orderBook()`](https://docs.theoceanx.com/)
 - [`marketData.tradeHistory()`](https://docs.theoceanx.com/)
 - [`marketData.candlesticks()`](https://docs.theoceanx.com/)
 - [`marketData.orderInfo()`](https://docs.theoceanx.com/)
 
`trade`
 - [`marketData.newOrder()`](https://docs.theoceanx.com/)
 - [`marketData.fillOrder()`](https://docs.theoceanx.com/)
 - [`marketData.newLimitOrder()`](https://docs.theoceanx.com/)
 - [`marketData.newMarketOrder()`](https://docs.theoceanx.com/)
 - [`marketData.userHistory()`](https://docs.theoceanx.com/)
 
 `wallet`
 - [`wallet.getTokenBalance()`](https://docs.theoceanx.com/)
 - [`wallet.getTokenAllowance()`](https://docs.theoceanx.com/)
 - [`wallet.setTokenAllowance()`](https://docs.theoceanx.com/)
 - [`wallet.setTokenAllowanceUnlimited()`](https://docs.theoceanx.com/)
 - [`wallet.wrapEth()`](https://docs.theoceanx.com/)
 - [`wallet.unwrapEth()`](https://docs.theoceanx.com/)
