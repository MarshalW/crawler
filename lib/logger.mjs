'use strict'

import winston from 'winston'
import moment from 'moment'
import config from 'config'

const format = winston.format.printf((info => {
    return `${moment().format('YYYY-MM-DD HH:mm:ss:SSS')} ${info.level} - ${info.message}`
}))

const {level} = config.get('Utils.Logger')

export default class {
    static createLog (params) {
        if (process.env.NODE_ENV !== 'production') {
            // 开发环境下
            return winston.createLogger({
                level: 'debug',
                transports: [
                    new winston.transports.Console({
                        format
                    })
                ]
            })
        } else {
            // 生产环境下
            const {filename} = params
            return winston.createLogger({
                level,
                transports: [
                    new winston.transports.File({
                        filename,
                        format
                    })
                ]
            })
        }

    }
}