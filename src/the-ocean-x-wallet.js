import { BigNumber } from 'bignumber.js'
import { getConfig } from './config/config'

BigNumber.config({EXPONENTIAL_AT: [-7, 50]})

export default class Wallet {
  constructor (web3, zeroEx) {
    this.web3 = web3
    this.zeroEx = zeroEx
  }

  /**
   * To get how many tokens in an account
   * @param params
   * @param  {String}  params.etherAddress The owner address
   * @param  {String}  params.tokenAddress The string address of the token
   * @return {BigNumber} The bignumber with your balance
   */
  async getTokenBalance ({etherAddress, tokenAddress}) {
    const address = etherAddress || this.web3.eth.defaultAccount
    return await this.zeroEx.token.getBalanceAsync(tokenAddress, address)
  }

  /**
   * To get how many tokens have you allowed to the relayer
   * @param params
   * @param  {String}  params.etherAddress The owner address that allowed the relayer
   * @param  {String}  params.tokenAddress The string address of the token
   * @return {BigNumber} The bignumber with your allowance
   */
  async getTokenAllowance ({etherAddress, tokenAddress}) {
    const address = etherAddress || this.web3.eth.defaultAccount
    return await this.zeroEx.token.getProxyAllowanceAsync(tokenAddress, address)
  }

  /**
   * To give an allowance to the relayer for later use
   * @param params
   * @param  {String}  params.etherAddress The address of your ETH account
   * @param  {String}  params.tokenAddress The string address of the token
   * @param  {BigNumber}  amountInWei Optional: How many tokens you want to allow.
   * If undefined the amount will be unlimited
   * @return {BigNumber} How much tokens you've allowed to the exchange already
   */
  async setTokenAllowance ({etherAddress, tokenAddress, amountInWei, onSubmit}) {
    const bigAmount = new BigNumber(this.web3.fromWei(amountInWei))
    const address = etherAddress || this.web3.eth.defaultAccount
    const tx = await this.zeroEx.token.setProxyAllowanceAsync(tokenAddress, address, bigAmount)

    if (onSubmit) onSubmit()

    return this._awaitTxToComplete(tx).then(() => {
      return true
    }).catch(() => {
      return false
    })
  }

  /**
   * To allow a gigantestic amount of tokens for the relayer, considered unlimited
   * @param params
   * @param  {String}  params.etherAddress The address of your ETH account
   * @param  {String}  params.tokenAddress The string address of the token
   * @return {String} A confirmation message
   */
  async setTokenAllowanceUnlimited ({etherAddress, tokenAddress, onSubmit}) {
    const ownerAddress = etherAddress || this.web3.eth.defaultAccount
    await this.zeroEx.token.setUnlimitedProxyAllowanceAsync(tokenAddress, ownerAddress)

    if (onSubmit) onSubmit()

    return true
  }

  /**
   * To convert your ETH to WETH for using them inside the relayer as an ERC20 token
   * @param params
   * @param  {BigNumber}  params.amountInWei  How many ETH you want to convert to WETH
   * @param  {String}  params.address The address of your ETH account
   * @return {BigNumber} How many tokens you've wrapped
   */
  async wrapEth ({amountInWei, address, onSubmit}) {
    const etherAddress = await this.zeroEx.tokenRegistry.getTokenAddressBySymbolIfExistsAsync('WETH')
    const bigAmount = new BigNumber(amountInWei)
    const depositor = address || this.web3.eth.defaultAccount
    const tx = await this.zeroEx.etherToken.depositAsync(etherAddress, bigAmount, depositor)

    if (onSubmit) onSubmit()

    return this._awaitTxToComplete(tx).then(() => {
      return true
    }).catch(() => {
      return false
    })
  }

  /**
   * To convert back your WETH to ETH
   * @param params
   * @param  {BigNumber}  params.amountInWei  How many WETH you want to convert to ETH
   * @param  {String}  params.address The address of your ETH account
   * @return {BigNumber} How many tokens you've unwrapped
   */
  async unwrapEth ({amountInWei, address, onSubmit}) {
    const etherTokenAddress = await this.zeroEx.tokenRegistry.getTokenAddressBySymbolIfExistsAsync('WETH')
    const bigAmount = new BigNumber(amountInWei)
    const withdrawer = address || this.web3.eth.defaultAccount
    const tx = await this.zeroEx.etherToken.withdrawAsync(etherTokenAddress, bigAmount, withdrawer)

    if (onSubmit) onSubmit()

    return this._awaitTxToComplete(tx).then(() => {
      return true
    }).catch(() => {
      return false
    })
  }

  async _awaitTxToComplete (txHash) {
    return new Promise((resolve, reject) => {
      const txChecking = setInterval(() => {
        this.web3.eth.getTransactionReceipt(txHash, (err, result) => {
          if (!err) {
            if (result) {
              result.status === 1 ? resolve() : reject()
              clearInterval(txChecking)
            }
            // If there is no result that means that the TX is still pending.
          } else {
            reject(err)
            clearInterval(txChecking)
          }
        })
      }, 1000)
    })
  }
}
