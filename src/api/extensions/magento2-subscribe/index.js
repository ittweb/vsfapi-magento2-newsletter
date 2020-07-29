/*
  This extension require the installation on M2 of the magento2-newsletter-api module.
  Please visit this link for more information about it:
  https://github.com/ittweb/magento2-newsletter-api
*/
import { apiStatus } from '../../../lib/util'
import { Router } from 'express'
const request = require('request')

module.exports = ({ config }) => {
  let m2Api = Router()

  function checkGoogleRecaptcha(token, res) {
    if (config.googleRecaptcha.enabled) {
      request({
        'method': 'POST',
        'url': `https://www.google.com/recaptcha/api/siteverify?secret=${config.googleRecaptcha.secretKey}&response=${token}`
      }, (error, response) => {
        if (error) {
          apiStatus(res, error, 500)
        } else {
          const jsonRes = JSON.parse(response.body);
          if (jsonRes.success === false) {
            apiStatus(res, `Error on Google reCaptcha: ${jsonRes['error-codes'][0]}`, 500)
          }
        }
      })
    }
  }
  
  /**
   * GET user subscription
   */
  m2Api.get('/subscribe', (req, res) => {
    const userEmail = req.query.email
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
        apiStatus(res, '', response.statusCode)
      } else {
        apiStatus(res, 'subscribed', 200)
      }
    })
  })

	/**
	 * POST subscribe a user
	 */
	m2Api.post('/subscribe', (req, res) => {
    checkGoogleRecaptcha(req.body.token, res)

		const userEmail = req.body.email
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
        console.error(error, body)
        apiStatus(res, 'Error on Magento 2: POST subscriber', response.statusCode)
      } else {
        apiStatus(res, body.status, 200)
      }
    })
  })
  
  /**
	 * DELETE subscribe a user
	 */
	m2Api.delete('/subscribe', (req, res) => {
		const userEmail = req.body.email
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
        console.error(error, body)
        apiStatus(res, 'Error on Magento 2: DELETE subscriber', response.statusCode)
      } else {
        apiStatus(res, 'unsubscribed', 200)
      }
    })
	})

  return m2Api
}
