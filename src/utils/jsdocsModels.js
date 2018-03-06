/**
 * @typedef {Object} Token
 * @property {String} address The token address
 * @property {String} symbol The token symbol
 * @property {String} decimals The amount of token decimal places
 * @property {String} minAmount The minimum amount needed to submit an order
 * @property {String} maxAmount The maxiumum amount allowed to submit an order
 * @property {String} precision The level of precision for token amounts
 */

/**
 * @typedef {Object} TokenPair
 * @property {Token} baseToken The base token
 * @property {Token} quoteToken The quote token
 */

/**
 * @typedef {Object} Ticker
 * @property {String} bid The current highest bid price
 * @property {String} ask The current lowest ask price
 * @property {String} last The price of the last trade
 * @property {String} volume The amount of base tokens traded in the last 24 hours
 * @property {String} timestamp The end of the 24-hour period over which volume was measured
 */

/**
 * @typedef {Object} TickerEntry
 * @property {String} baseTokenAddress The base token address
 * @property {String} quoteTokenAddress The quote token address
 * @property {Ticker} last The ticker for
 */

/**
 * @typedef {Object} OrderBookItem
 * @property {String} orderHash The hash of the SignedOrder sent to the 0cean to be filled at a later time
 * @property {String} price The price of the order
 * @property {String} availableAmount The amount of tokens available to be filled
 * @property {String} creationTimestamp The timestamp when the order was placed
 * @property {String} expirationTimestampInSec The number of seconds until the order will expire
 */

/**
 * @typedef {Object} OrderBook
 * @property {OrderBookItem[]} bids array of fillable buy OrderBookItems
 * @property {OrderBookItem[]} asks array of fillable sell OrderBookItems
 */

/**
 * @typedef {Object} TradeHistoryItem
 * @property {String} id The unique trade id
 * @property {String} transactionHash The hash of the ethereum transaction sent to the network
 * @property {String} amount The amount of base tokens exchanged
 * @property {String} price The price of tokens exchanged
 * @property {String} status The state of the trade
 * @property {String} lastUpdated The timestamp of the last status update
 */

/**
 * @typedef {Object} Candlestick
 * @property {String} high The highest price
 * @property {String} low The lowest price
 * @property {String} open The price at the beginning of the interval
 * @property {String} close The price at the end of the interval
 * @property {String} baseVolume The volume of base tokens
 * @property {String} quoteVolume The volume of quote tokens
 * @property {String} startTime The start time
 */

/**
 * @typedef {Object} OceanOrder
 * @property {String} baseTokenAddress The address of base token
 * @property {String} quoteTokenAddress The  address of quote token
 * @property {String} side The side, 'buy or 'sell'
 * @property {String} amount The order amount in wei (amounts of the base token)
 * @property {String} price The order price in eth
 * @property {String} created The time order was created (microseconds)
 * @property {String} expires The time order will expire (microseconds)
 * @property {SignedOrder} zeroExOrder The signed 0x order
 */

/**
 * @typedef {Object} UserHistoryItem
 * @property {String} orderHash The hash of the order
 * @property {String[]} transactionHashes An array of hashes for transactions submitted to the blockchain
 * @property {String} baseTokenAddress The address of base token
 * @property {String} quoteTokenAddress The address of quote token
 * @property {String} side The side of the book the order was placed
 * @property {String} open_amount The amount available to be filled
 * @property {String} filled_amount The amount filled and waiting to be submitted to the blockchain
 * @property {String} settled_amount The amount exchanged successfully
 * @property {String} dead_amount The amount that will never be exchanged
 * @property {String} price The price denominated in quote tokens
 * @property {UserHistoryTimelineItem[]} timeline An array of UserHistoryTimelineItems
 */

/**
 * @typedef {('placed'|'filled'|'submitted'|'settled'|'submitted'|'failed_settlement'|'failed_fill'|'canceled'|'pruned'|'expired')} UserHistoryEvent
 */

/**
 * @typedef {Object} UserHistoryTimelineItem
 * @property {UserHistoryEvent} action An an action that was taken on the order
 * @property {String} amount The amount of the order affected by the action
 * @property {String} timestamp The time the action took place
 */

/**
 * @typedef {Object} PlaceOrderResponse
 * @property {String} transactionHash The hash of transaction
 */

/**
 * @typedef {Object} NewMarketOrderResponse
 * @property {String} orderSubmitted The status of submitting
 */

/**
 * @typedef {Object} NewLimitOrderResponse
 * @property {String} orderSubmitted The status of submitting
 */

/**
 * @typedef {Object} PlaceLimitOrderNotImmediatelyPlaceableResponse
 * @property {String} orderPlaced The status of placing
 */

/**
 * @typedef {Object} PlaceLimitOrderPartiallyImmediatelyPlaceableResponse
 * @property {String} orderPlaced The status of placing
 * @property {String} orderSubmitted The status of submitting
 */

/**
 * @typedef {Object} PlaceLimitOrderCompletelyImmediatelyPlaceableResponse
 * @property {String} orderSubmitted The status of submitting
 */
