# vsfapi-magento2-newsletter
This module enables Vue Storefront API to add the Magento 2 subscription to the newsletter.

## Installation
To use it, please **install before the required Magento 2 module**:
https://github.com/ittweb/magento2-newsletter-api

After that you've **install the Ittweb_Newsletter M2 module**, then:
 - download and paste the files of this repository (src directory) in the root of your Vue Storefront API project
 - edit your `vue-storefront-api/config/local.json`, adding `magento2-subscribe` in the `registeredExtensions`
 - edit your `vue-storefront/config/local.json` changing the newsletter endpoint to `/api/ext/magento2-subscribe/subscribe`

Et voilà! Now your newsletter subscription will be associated with Magento 2.

## Google reCaptcha
It's strongly recommended to **enable the Google reCaptcha**.
To do so, edit your vue-storefront-api/config/local.json adding a new section like this one:
```
"googleRecaptcha": {
    "enabled": true,
    "secretKey": "your-secret-key"
},
```


### IMPORTANT
In addition to the `email` you need also to pass a new request body parameter, named `token`, to the POST endpoint:

`vue-storefront-api-url/api/ext/magento2-subscribe/`

You can find the function that calls the API endpoint above on your `vue-storefront` installation, in the `core/data-resolver/NewsletterService.ts` file, function `subscribe`.