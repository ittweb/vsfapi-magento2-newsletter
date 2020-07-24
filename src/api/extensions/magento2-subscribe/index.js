/*
  This extension require the installation on M2 of the magento2-newsletter-api module.
  Please visit this link for more information about it:
  https://github.com/ittweb/magento2-newsletter-api
*/
import { apiStatus } from '../../../lib/util'
import { Router } from 'express'
const request = require('request')

module.exports = ({ config }) => {

  let m2Api = Router();
  
  /**
   * GET user subscription
   */
  m2Api.get('/subscribe', (req, res) => {
    let userEmail = req.query.email
		if(!userEmail) {
			apiStatus(res, 'Email not provided!', 500)
			return
		}
    return request({
      url: config.magento2.api.url + '/V1/newsletter/subscription/' + userEmail,
      method: 'GET',
      json: false
    }, (error, response, body) => {
      if (error || response.statusCode !== 200) {
        console.error(error, body)
        apiStatus(res, 'An error occured while accessing Magento 2', 500)
      } else {
        apiStatus(res, body.status, 200)
      }
    })
  })

	/**
	 * POST subscribe a user
	 */
	m2Api.post('/subscribe', (req, res) => {
		let userEmail = req.body.email
		if(!userEmail) {
			apiStatus(res, 'Email not provided!', 500)
			return
		}
    request({
      url: config.magento2.api.url + '/V1/newsletter/subscription/' + userEmail,
      method: 'POST',
      json: false
    }, function (error, response, body) {
      if (error || response.statusCode !== 200) {
        console.error(error)
        apiStatus(res, 'An error occured while accessing Magento 2', 500)
      } else {
        apiStatus(res, body.status, 200)
      }
    })
  })
  
  /**
	 * DELETE subscribe a user
	 */
	m2Api.delete('/subscribe', (req, res) => {
		let userEmail = req.body.email
		if(!userEmail) {
			apiStatus(res, 'Email not provided!', 500)
			return
		}
    request({
      url: config.magento2.api.url + '/V1/newsletter/subscription/' + userEmail,
      method: 'DELETE',
      json: false
    }, function (error, response, body) {
      if (error || response.statusCode !== 200) {
        console.error(error)
        apiStatus(res, 'An error occured while accessing Magento 2', 500)
      } else {
        apiStatus(res, body.status, 200)
      }
    })
	})

  return m2Api
}
