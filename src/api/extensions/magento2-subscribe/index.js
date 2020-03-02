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
	 * POST subscribe a user
	 */
	m2Api.post('/subscribe', (req, res) => {

		let userEmail = req.body.email
		if(!userEmail) {
			apiStatus(res, 'No e-mail provided!', 500)
			return
		}
    request({
      url: config.magento2.api.url + '/V1/newsletter/subscription/' + userEmail,
      method: 'POST',
      json: false
    }, function (error, response, body) {
      if (error) {
        console.error(error)
        apiStatus(res, 'An error occured while accessing Magento2', 500)
      } else {
        apiStatus(res, body.status, 200)
      }
    })
	})

  return m2Api
}
