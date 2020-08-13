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

  const newsletterSubscription = (email, response, method) => {
    request({
      url: config.magento2.api.url + '/V1/newsletter/subscription/' + email,
      method,
      json: false
    }, (error, result, body) => {
      if (error || result.statusCode !== 200) {
        console.error(error, body)
        apiStatus(response, 'Error on Magento 2: ' + method, result.statusCode)
      } else {
        apiStatus(response, body.status, 200)
      }
    })
  }

  const reCaptchaCheck = (methodType, req, res) => {
    const userEmail = req.body.email
    if (!userEmail) {
      return apiStatus(res, 'Email not provided!', 500)
    }

    if (config.googleRecaptcha) {
      if (config.googleRecaptcha.enabled === true) {
        const recaptchaToken = req.body.token
        if (!recaptchaToken) {
          return apiStatus(res, 'Google reCaptcha token not provided!', 500)
        }
  
        const recaptchaSecretKey = config.googleRecaptcha.secretKey
        if (!recaptchaSecretKey) {
          return apiStatus(res, 'Google reCaptcha secret key not provided!', 500)
        }
  
        request({
          'method': 'POST',
          'url': `https://www.google.com/recaptcha/api/siteverify?secret=${recaptchaSecretKey}&response=${recaptchaToken}`
        }, (error, response) => {
          if (error) {
            return apiStatus(res, error, 500)
          } else {
            const jsonRes = JSON.parse(response.body);
            if (jsonRes.success === false) {
              return apiStatus(res, `Error on Google reCaptcha: ${jsonRes['error-codes'][0]}`, 500)
            }
          }
        })
      }
    }
    
    newsletterSubscription(userEmail, res, methodType)
  }

  /**
   * GET user subscription
   */
  m2Api.get('/subscribe', (req, res) => {
    const userEmail = req.query.email
    if (!userEmail) {
      return apiStatus(res, 'Email not provided!', 500)
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
    reCaptchaCheck('POST', req, res)
  })

  /**
   * DELETE subscribe a user
   */
  m2Api.delete('/subscribe', (req, res) => {
    reCaptchaCheck('DELETE', req, res)
  })

  return m2Api
}
