import { BigNumber } from 'bignumber.js'

BigNumber.config({EXPONENTIAL_AT: [-7, 50]})

export default class Wallet {
  constructor (web3, zeroEx) {
    this.web3 = web3
    this.zeroEx = zeroEx
  }

  /**
   * To get how many tokens in an account
   * @param params
   * @param  {String}  params.walletAddress The owner address
   * @param  {String}  params.tokenAddress The string address of the token
   * @return Promise<BigNumber> The bignumber with your balance
   */
  async getTokenBalance ({walletAddress, tokenAddress}) {
    const address = walletAddress || this.web3.eth.defaultAccount
    return this.zeroEx.token.getBalanceAsync(tokenAddress, address)
  }

  /**
   * To get how many tokens have you allowed to the relayer
   * @param params
   * @param  {String}  params.walletAddress The owner address that allowed the relayer
   * @param  {String}  params.tokenAddress The string address of the token
   * @return Promise<BigNumber> The bignumber with your allowance
   */
  async getTokenAllowance ({walletAddress, tokenAddress}) {
    const address = walletAddress || this.web3.eth.defaultAccount
    return this.zeroEx.token.getProxyAllowanceAsync(tokenAddress, address)
  }

  /**
   * To give an allowance to the relayer for later use
   * @param params
   * @param  {String}  params.walletAddress The address of your ETH account
   * @param  {String}  params.tokenAddress The string address of the token
   * @param  {BigNumber}  params.amountInWei How many tokens you want to allow.
   * @callback {submittedCallback} [params.onSubmit] The callback to be called after transaction send to the network
   * @return Promise<Boolean> Operation status
   */
  async setTokenAllowance ({walletAddress, tokenAddress, amountInWei, onSubmit}) {
    const bigAmount = new BigNumber(this.web3.fromWei(amountInWei))
    const address = walletAddress || this.web3.eth.defaultAccount
    const txHash = await this.zeroEx.token.setProxyAllowanceAsync(tokenAddress, address, bigAmount)

    if (onSubmit) onSubmit()

    try {
      await this.zeroEx.awaitTransactionMinedAsync(txHash)
      return true
    } catch (e) {
      return false
    }
  }

  /**
   * To allow a gigantestic amount of tokens for the relayer, considered unlimited
   * @param params
   * @param  {String}  params.walletAddress The address of your ETH account
   * @param  {String}  params.tokenAddress The string address of the token
   * @callback {submittedCallback} [params.onSubmit] The callback to be called after transaction send to the network
   * @return Promise<Boolean> Operation status
   */
  async setTokenAllowanceUnlimited ({walletAddress, tokenAddress, onSubmit}) {
    const ownerAddress = walletAddress || this.web3.eth.defaultAccount
    const txHash = await this.zeroEx.token.setUnlimitedProxyAllowanceAsync(tokenAddress, ownerAddress)

    if (onSubmit) onSubmit()

    try {
      await this.zeroEx.awaitTransactionMinedAsync(txHash)
      return true
    } catch (e) {
      return false
    }
  }

  /**
   * To convert your ETH to WETH for using them inside the relayer as an ERC20 token
   * @param params
   * @param  {BigNumber}  params.amountInWei  How many ETH you want to convert to WETH
   * @param  {String}  params.address The address of your ETH account
   * @callback {submittedCallback} [params.onSubmit] The callback to be called after transaction send to the network
   * @return Promise<Boolean> Operation status
   */
  async wrapEth ({amountInWei, address, onSubmit}) {
    const walletAddress = await this.zeroEx.tokenRegistry.getTokenAddressBySymbolIfExistsAsync('WETH')
    const bigAmount = new BigNumber(amountInWei)
    const depositor = address || this.web3.eth.defaultAccount
    const txHash = await this.zeroEx.etherToken.depositAsync(walletAddress, bigAmount, depositor)

    if (onSubmit) onSubmit()

    try {
      await this.zeroEx.awaitTransactionMinedAsync(txHash)
      return true
    } catch (e) {
      return false
    }
  }

  /**
   * To convert back your WETH to ETH
   * @param params
   * @param  {BigNumber}  params.amountInWei  How many WETH you want to convert to ETH
   * @param  {String}  params.address The address of your ETH account
   * @callback {submittedCallback} [params.onSubmit] The callback to be called after transaction send to the network
   * @return Promise<Boolean> Operation status
   */
  async unwrapEth ({amountInWei, address, onSubmit}) {
    const etherTokenAddress = await this.zeroEx.tokenRegistry.getTokenAddressBySymbolIfExistsAsync('WETH')
    const bigAmount = new BigNumber(amountInWei)
    const withdrawer = address || this.web3.eth.defaultAccount
    const txHash = await this.zeroEx.etherToken.withdrawAsync(etherTokenAddress, bigAmount, withdrawer)

    if (onSubmit) onSubmit()

    try {
      await this.zeroEx.awaitTransactionMinedAsync(txHash)
      return true
    } catch (e) {
      return false
    }
  }
}
