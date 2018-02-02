// This is the ledger provider to use with web3:
// https://github.com/Neufund/ledger-wallet-provider
// 1. Plugg-in the Ledger Wallet Nano S
// 2. Input the 4 digit pin
// 3. Execute the function `init()` below
// 4. If you see your Ledger accounts in the console, it works.
//
// To test the function init() right here, write init() before the export default init
// and it will execute the code. If you see your Ledger accounts in the console, it works.

import Web3 from 'web3'
import ProviderEngine from 'web3-provider-engine'
import RpcSubprovider from 'web3-provider-engine/subproviders/rpc'
import LedgerWalletSubproviderFactory from 'ledger-wallet-provider'

async function init () {
  const engine = new ProviderEngine()
  const web3 = new Web3(engine)
  const ledgerWalletSubProvider = await LedgerWalletSubproviderFactory()

  engine.addProvider(ledgerWalletSubProvider)
  engine.addProvider(new RpcSubprovider({rpcUrl: '/api'})) // you need RPC endpoint
  engine.start()
  // It will show undefined until the steps at the top are completed
  web3.eth.getAccounts(console.log)
}

export default init
