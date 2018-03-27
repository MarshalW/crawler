'use strict'

import {News} from "./data.mjs"
import moment from "moment/moment"
import getMeta from "lets-get-meta"
import Crawler from "simplecrawler"
import cheerio from "cheerio"
import _ from 'lodash'

let logger

export default class {
    static init (params) {
        logger = params.logger
    }

    constructor (params) {
        let {job, url, userAgent, done, dateFormat, channelName, cache, whitelist} = params
        this.done = done
        this.dateFormat = dateFormat
        this.channelName = channelName
        this.cache = cache
        this.job = job

        this.crawler = new Crawler(url)
        this.crawler.maxConcurrency = 1
        this.crawler.maxDepth = 2
        this.crawler.userAgent = userAgent
        this.crawler.interval = 500
        this.crawler.domainWhitelist = whitelist

        this.crawler.on('fetchcomplete', this.onFetchComplete.bind(this))
        this.crawler.on('complete', done)

        // 如果打开cache，设置
        if (this.cache) {
            this.crawler.addFetchCondition((queueItem) => {
                if (this.cache.has(queueItem.url)) {
                    let cacheItem = this.cache.get(url)
                    return !cacheItem.channels.includes(this.channelName)
                }
                return true
            })
        }
    }

    onFetchComplete (queueItem, responseBuffer, response) {
        logger.debug(`On fetch complete, ${queueItem.url}`)
        let html = responseBuffer.toString()
        let news = this.getNews(html)

        // 新闻不为空且是指定的日期
        if (news) {
            this.job.items.push({url: queueItem.url, channelName: this.channelName, finishedTime: new Date()})
            News.findOne({contentId: news.contentId}).then((_news) => {
                if (!_news) { // 创建新闻
                    news.source = html
                    news.url = queueItem.url
                    news.channelItems = [{name: this.channelName, createTime: new Date()}]
                    new News(news).save().then(() => {
                        logger.debug(`News created, ${news.url}`)
                    })
                } else { // 更新新闻记录
                    let isSameChannel = false
                    _news.channelItems.forEach((item) => { // TODO lodash简化写法
                        if (item.name == this.channelName) {
                            isSameChannel = true
                            return
                        }
                    })
                    if (!isSameChannel) {
                        _news.channelItems.push({name: this.channelName, createTime: new Date()})
                        _news.save().then(() => {
                            logger.debug(`News updated, ${this.channelName}, ${_news.url}`)
                        })
                    }
                }
            })
        }
    }

    getNews (html) {
        let $ = cheerio.load(html)
        let meta = getMeta(html)
        let news = {}
        let titleSelectors = ['.articleTitle', '.artiTitle', '.artTitle']

        // 获取新闻题目
        titleSelectors.forEach((item) => {
            let title = _.trim($(item).text())
            if (title.length > 0) {
                if (title.indexOf('(') != -1) {
                    title = title.substring(0, title.indexOf('('))
                }
                news.title = title
            }
        })
        logger.debug(`Set news title: ${news.title}`)

        // 获取新闻内容id
        if (meta.contentid) {
            news.contentId = meta.contentid
        } else if ($('articleid')) {
            news.contentId = $('articleid').text()
        }
        logger.debug(`Set news contentId: ${news.contentId}`)

        // 获取发布日期
        if (meta.publishdate) {
            news.publishDate = moment(meta.publishdate, this.dateFormat.short).valueOf()
        }
        logger.debug(`Set news publish date: ${news.publishDate}`)

        if (news.contentId && news.title && news.publishDate) {
            logger.debug(`This is a news, ${news.contentId}`)
            return news
        }

        logger.debug(`This is not a news, ${news.contentId}`)

        return null
    }

    start () {
        this.crawler.start()
    }
}