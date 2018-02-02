
/**
 * Converts the order's parameters to the right types
 * @param order
 * @returns {{exchangeContractAddress, expirationUnixTimestampSec, feeRecipient, maker, taker: *|string|{$ref: string}|taker|{$ref}, makerTokenAddress, takerTokenAddress, orderHash: *|string|String, takerFee, makerFee, salt: string, makerTokenAmount: string, takerTokenAmount: string, ecSignature: *|{$ref: string}|properties.ecSignature|{$ref}|ECSignature}}
 */
function serializeOrder (order) {
  return {
    exchangeContractAddress: order.exchangeContractAddress,
    maker: order.maker,
    taker: order.taker,
    makerTokenAddress: order.makerTokenAddress,
    takerTokenAddress: order.takerTokenAddress,
    feeRecipient: order.feeRecipient,
    makerTokenAmount: order.makerTokenAmount.toString(),
    takerTokenAmount: order.takerTokenAmount.toString(),
    takerFee: order.takerFee.toString(),
    makerFee: order.makerFee.toString(),
    expirationUnixTimestampSec: order.expirationUnixTimestampSec.toString(),
    salt: order.salt.toString(),
    orderHash: order.orderHash,
    ecSignature: order.ecSignature
  }
};

module.exports = {
  serializeOrder
}
