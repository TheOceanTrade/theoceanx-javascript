export const promisify = (action) =>
  new Promise((resolve, reject) =>
    action((err, res) => {
      if (err) { reject(err) }

      resolve(res)
    })
  )
