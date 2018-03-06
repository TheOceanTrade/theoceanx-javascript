import axios from 'axios'

const normalizeOpts = ({method = 'get', body, qs, ...opts} = {}) => ({
  ...opts,
  params: qs,
  data: body,
  method: method.toLowerCase()
})
const normalizeResponse = response => response.data
const normalizeFail = error => {
  const { code, response: { data, status } } = error
  const statusCode = code || status
  error.message = statusCode + ' - ' + (JSON && JSON.stringify ? JSON.stringify(data) : data)
  error.statusCode = statusCode
  throw error
}

export default opts => axios(normalizeOpts(opts))
  .then(normalizeResponse)
  .catch(normalizeFail)
