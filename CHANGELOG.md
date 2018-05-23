CHANGELOG
=============

0.4.10
------

* walletAddress required in /reserve endpoint
* Add /committed_amounts endpoint
* Add /fee_components endpoint
* Add user_data stream ws channel
*
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
