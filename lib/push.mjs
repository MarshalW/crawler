'use strict'

import axios from 'axios'

let logger

export default class Push {
    static init (params) {
        logger = params.logger
    }

    static notificate (news) {
        // fetch('https://news.ohtly.com/notifications/push', {
        //     method: 'POST',
        //     body: JSON.stringify(news)
        // }).then((response) => {
        //     if (logger) logger.debug(response)
        // })

        // axios.post('https://news.ohtly.com/notifications/push', JSON.stringify(news)).catch(function (error) {
        //     console.log(error.code)
        //     // console.log('error!')
        // })

        // axios.get('https://news.ohtly.com/notifications/').then(() => {
        //     console.log('ok')
        // })
    }
}

Push.notificate({
    "title": "习近平在博鳌亚洲论坛年会开幕式上发表主旨演讲",
    "url": "http://news.china.com.cn/2018-04/10/content_50858197.htm"
})