'use strict'

import mongoose from 'mongoose'

// 新闻
const News = mongoose.model('News', {
    contentId: {
        type: String,
        unique: true
    },
    publishDate: {
        type: Date,
        required: true
    },
    url: {
        type: String,
        unique: true
    },
    title: {
        type: String,
        index: true,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    channelItems: {
        type: [],
        required: true
    },
    createTime: {
        type: Date,
        required: true,
        default: Date.now
    }
})

// 作业
const Job = mongoose.model('Job', {
    startTime: {
        type: Date,
        required: true
    },
    endTime: {
        type: Date,
        required: true
    },
    fetchCount: {
        type: Number
    },
    items: [] // {url,finishedTime,channelName}
})

function closeMongoDBConnection () {
    return mongoose.connection.close()
}

function initMongoDBConnection (params) {
    return mongoose.connect(params.url)
}

export {News, Job, initMongoDBConnection, closeMongoDBConnection}