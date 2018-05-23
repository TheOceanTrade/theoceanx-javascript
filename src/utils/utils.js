export const promisify = (action) =>
  new Promise((resolve, reject) =>
    action((err, res) => {
      if (err) { reject(err) }

      resolve(res)
    })
  )

export const getTimestamp = () => {
  return Date.now() / 1000
}

export function isEthereumAddress (address) {
  return /^(0x)?[0-9a-fA-F]{40}$/i.test(address)
}
