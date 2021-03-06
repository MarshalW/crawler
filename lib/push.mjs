'use strict'

import axios from 'axios'
import tls from 'tls'
import Logger from './logger.mjs'
import config from 'config'

tls.DEFAULT_ECDH_CURVE = 'auto'
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0'

const logger = Logger.createLog({
    filename: './logs/push.log'
})

export default class Push {
    static notificate (news) {
        axios.post(config.get('WebPush.pushUrl'), news, {
            headers: {
                'Content-Length': 0,
                'Content-Type': 'text/plain'
            },
            responseType: 'text'
        }).then(() => {
            if (logger) logger.debug('post notifications ok')
        }).catch(function (error) {
            if (logger) logger.error(error)
        })
    }

    static test () {
        Push.notificate({
            "title": "习近平在博鳌亚洲论坛年会开幕式上发表主旨演讲",
            "url": "http://news.china.com.cn/2018-04/10/content_50858197.htm"
        })
    }
}
