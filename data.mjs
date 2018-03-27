'use strict'

import mongoose from 'mongoose'

mongoose.connect('mongodb://localhost/chinanews')

const News = mongoose.model('News', {
    contentId: {
        type: String,
        unique: true
    },
    publishDate: {
        type: Date,
        required: true
    },
    channel: {
        type: String,
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
    duplicateChannels: [],
    createTime: {
        type: Date,
        required: true,
        default: Date.now
    }
})

const Task = mongoose.model('Task', {
    startTime: {
        type: Date,
        index: true,
        required: true
    },
    endTime: {
        type: Date,
        index: true,
        required: true
    },
    loadedItems: []
})

function closeMoose () {
    mongoose.connection.close()
}

export {News, Task, closeMoose}
