/* eslint-disable */
import { AxiosInstance } from 'axios'
import mockServer from 'axios-mock-server'
import mock0 from './jobs/_jobId/point'
import mock1 from './jobs/_jobId/line'
import mock2 from './jobs/_jobId/area'
import mock3 from './csv'

export default (client?: AxiosInstance) => mockServer([
  {
    path: '/jobs/_jobId/point',
    methods: mock0
  },
  {
    path: '/jobs/_jobId/line',
    methods: mock1
  },
  {
    path: '/jobs/_jobId/area',
    methods: mock2
  },
  {
    path: '/csv',
    methods: mock3
  }
], client, '')
