# Crawler

爬虫引擎

## 安装和运行

安装：

```
npm install
```

配置，`/config/default.json`或者`/config/production.json`(如果设置`NODE_ENV=production`)，示例：

```
{
  "Utils": {
    "Logger": {
      "level": "debug" // 日志等级
    },
    "DateFormat": { // 日期格式
      "short": "YYYY-MM-DD",
      "normal": "YYYY-MM-DD hh:mm"
    },
    "MongoDB": { // 数据库连接
      "url": "mongodb://localhost/mynews"
    }
  },
  "Crawler": {
    "useCache": true, //是否使用缓存，即已fetch的新闻不再fetch
    "Cache": {
      "duration": 10 // 缓存的新闻天数
    },
    "maxConcurrency": 1, // 爬虫的进程数
    "interval": 500, // fetch的间隔时间
    "Whitelist": [ // 白名单，抓取网页中如果有其他域名不爬，但加入白名单的会爬
      "mynews.cn"
    ],
    "Sites": [ // 要爬的网页入口列表
      {
        "channelName": "要闻",
        "home": "http://mynews.cn/node_7223221.htm"
      }
    ],
    "UserAgent": "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"
  }
}
```

需要配置MongoDB数据库，和配置文件中的url一致，目前只支持本地数据库。

运行：

```
npm start
```



