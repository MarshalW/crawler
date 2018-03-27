'use strict'

import moment from 'moment'
import {News} from './data.mjs'

const cache = new Map()

export default class {

    static init (config) {
        // TODO 需要编写测试脚本严格测试时间间隔条件
        return News.find({createTime: {'$gte': moment().subtract(config.duration, 'days').valueOf()}})
            .exec().then((results) => {
                results.forEach((news) => {
                    let channels = []
                    news.channelItems.forEach((item) => {
                        channels.push(item.name)
                    })
                    cache.set(news.url, {channels})
                })
            })
    }

    static has (url) {
        return cache.has(url)
    }


    static get (url) {
        return cache.get(url)
    }
}