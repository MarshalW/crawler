'use strict'

import commandLineArgs from 'command-line-args'
import Crawler from './lib/crawler.mjs'
import Push from './lib/push'

// 设置命令行获取的参数，目前没有用上
const options = commandLineArgs([
    // {name: 'date', alias: 'd', type: String}
])

Crawler.run(Object.assign({
    pushActions: [
        (news) => {
            Push.notificate({title: news.title, url: news.url})
        }
    ]
}, options))