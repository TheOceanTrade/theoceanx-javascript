import { getConfig, setConfig } from '../config/config'
import { getEndpoint } from './api-utils'

describe('getEndpoint', () => {
  it('should resolve simple endpoints', () => {
    setConfig({
      api: {
        baseURL: 'http://1.1.1.1:3333/api/v1',
        ORDER: '/order'
      }
    })
    const url = getEndpoint(getConfig().api.ORDER)

    expect(url).toBe('http://1.1.1.1:3333/api/v1/order')
  })

  it('should resolve tricky endpoints', () => {
    setConfig({
      api: {
        baseURL: 'http://1.1.1.1:3333/api/v2/',
        ORDER: '/order'
      }
    })
    const url = getEndpoint(getConfig().api.ORDER)

    expect(url).toBe('http://1.1.1.1:3333/api/v2/order')
  })
})
