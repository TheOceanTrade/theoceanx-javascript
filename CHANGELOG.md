CHANGELOG
=============

1.3.0
-----

* Handle ws reconnect
* Handle ws resubscribe

1.2.4
-----

* add property `wsConnectionError` to Error with the value true when a Websocket connection could not be established
* remove warning when you do not initialize the client with a web3 provider
* change warning message when initialized without authentication

1.2.1
-----

* unsignedTargetOrder for newLimitOrder can contain `error` field if target order could not be created
* add `cancelAllOrders` method

1.1.1
-----

* change etherAddress, userAddress to walletAddress
* move getTokenCommittedAmount and getTokenAvailableBalance to trade
* getTokenCommittedAmount and getTokenAvailableBalance return {BigNumber} object

1.0.1
-----

* fix minor bug

1.0.0
-----

* rename package to `the-ocean`

0.5.0
-----

* change default config with new addresses

0.4.10
------

* walletAddress required in /reserve endpoint
* Add /committed_amounts endpoint
* Add /fee_components endpoint
* Add /user_data endpoint
* Add user_data stream ws channel

0.4.0
------

* Better authentication
* Fees components
* `candlesticksIntervals` method which allows to get available candlesticks intervals
* better error handling for websockets connection

0.3.1
------

* No need to provide `api.baseURL` and `websockets` params during initialization
* Change websockets messages to contain more information (refer to https://docs.theoceanx.com)

0.2.1
------

* Change ethereumjs-util version

0.2.0
------

* Add getAvailableBalance endpoint
* Remove unauthenticated trading
* Websockets interface adjustments
* Instantiation adjustments
* Various bug fixes and general refactoring
