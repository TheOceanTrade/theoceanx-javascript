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
 - [`marketData.tokenPairs()`](https://docs.theoceanx.com/?javascript#token-pairs-2)
 - [`marketData.tickers()`](https://docs.theoceanx.com/?javascript#tickers-2)
 - [`marketData.ticker()`](https://docs.theoceanx.com/?javascript#ticker-2)
 - [`marketData.orderBook()`](https://docs.theoceanx.com/?javascript#order-book-2)
 - [`marketData.tradeHistory()`](https://docs.theoceanx.com/?javascript#trade-history-2)
 - [`marketData.candlesticks()`](https://docs.theoceanx.com/?javascript#candlesticks)
 - [`marketData.orderInfo()`](https://docs.theoceanx.com/?javascript#order-info-2)
 
`trade`
 - [`trade.newOrder()`](https://docs.theoceanx.com/?javascript#add-order-2)
 - [`trade.fillOrder()`](https://docs.theoceanx.com/?javascript#fill-order-2)
 - [`trade.newLimitOrder()`](https://docs.theoceanx.com/?javascript#add-limit-order-2)
 - [`trade.newMarketOrder()`](https://docs.theoceanx.com/?javascript#add-market-order-2)
 - [`trade.userHistory()`](https://docs.theoceanx.com/)
 
 `wallet`
 - [`wallet.getTokenBalance()`](https://docs.theoceanx.com/?javascript#get-token-balance)
 - [`wallet.getTokenAllowance()`](https://docs.theoceanx.com/?javascript#get-token-allowance)
 - [`wallet.setTokenAllowance()`](https://docs.theoceanx.com/?javascript#set-token-allowance)
 - [`wallet.setTokenAllowanceUnlimited()`](https://docs.theoceanx.com/?javascript#set-unlimited-token-allowance)
 - [`wallet.wrapEth()`](https://docs.theoceanx.com/?javascript#wrap-ether)
 - [`wallet.unwrapEth()`](https://docs.theoceanx.com/?javascript#unwrap-wrapped-ether)
