'use strict'

import {Job, closeMongoDBConnection, initMongoDBConnection} from './data.mjs'
import Cache from './cache.mjs'
import Logger from './logger.mjs'
import config from 'config'
import Task from './task.mjs'

const logger = Logger.createLog({
    filename: './logs/crawler.log'
})

Task.init({logger})

function createCrawler () {
    let crawler = new Crawler({
        sites: config.get('Crawler.Sites'),
        userAgent: config.get('Crawler.UserAgent'),
        useCache: config.get('Crawler.useCache'),
        cacheConfig: config.get('Crawler.Cache'),
        dateFormat: config.get('Utils.DateFormat'),
        whitelist: config.get('Crawler.Whitelist'),
        maxConcurrency: config.get('Crawler.maxConcurrency'),
        interval: config.get('Crawler.interval'),
        db: config.get("Utils.MongoDB"),
        done: () => {
            closeMongoDBConnection().then(() => {
                logger.info('MongoDB connection closed')
            })
        }
    })
    crawler.start()
}

export default class Crawler {
    static run (options) {
        logger.info("Starting crawler ..")
        initMongoDBConnection(config.get('Utils.MongoDB')).then(() => {
            logger.info("MongoDB Connected")
            createCrawler()
        })
    }

    constructor (params) {
        this.tasks = new Set()
        let {sites, userAgent, done, dateFormat, useCache, cacheConfig, whitelist, maxConcurrency, interval} = params
        this.done = done
        this.useCache = useCache
        this.cacheConfig = cacheConfig

        // 任务计数器，当所有任务完成，关闭数据库连接
        let count = 0
        let job = {startTime: new Date(), items: []}

        // 创建爬虫任务
        logger.info(`Crawler sites count: ${sites.length}`)
        sites.forEach((site) => {
            logger.info(`Crawler site: ${site.channelName}, ${site.home}`)
            this.tasks.add(new Task({
                job,
                maxConcurrency, interval,
                cache: useCache ? Cache : null,
                url: site.home, channelName: site.channelName, userAgent, dateFormat, whitelist, done: () => {
                    count++
                    if (count == this.tasks.size) {
                        job.endTime = new Date()
                        job.fetchCount = Task.getFetchCount()
                        new Job(job).save().then(() => {
                            logger.info(`Crawler closed, find ${job.items.length} news, spend time: ${job.endTime.getTime() - job.startTime.getTime()}ms, fetch count: ${Task.getFetchCount()}`)
                            this.done() // TODO 可能出现爬虫完毕但数据库保存未完的情况，怎么办？
                        })
                    }
                }
            }))
        })
    }

    start () {
        const startTasks = () => {
            this.tasks.forEach((task) => {
                task.start()
            })
        }
        if (this.useCache) {
            logger.info(`Use cache, use cache duration: ${this.cacheConfig.duration}`)
            Cache.init(this.cacheConfig).then(startTasks)
        } else {
            logger.info(`Without cache`)
            startTasks()
        }
        logger.info("Crawler started.")
    }
}

