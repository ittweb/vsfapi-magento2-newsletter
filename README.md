# vsfapi-magento2-newsletter
This module enables Vue Storefront API to add the Magento 2 subscription to the newsletter.

To use it, please **install before the required Magento 2 module**:
https://github.com/ittweb/magento2-newsletter-api

After that you've **install the Ittweb_Newsletter M2 module**, then:
 - download and paste the files of this repository (src directory) in the root of your Vue Storefront API project
 - edit your VSF-API-ROOT/config/local.json, adding `magento2-subscribe` in the registeredExtensions
 - edit your VSF-API/config/local.json changing the newsletter endpoint to `/api/ext/magento2-subscribe/subscribe`
