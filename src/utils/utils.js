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
