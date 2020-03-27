import Mock from 'mockjs';

const BASE_URL = 'http://127.0.0.1:3000'

/**
 * 文章详情
 */
Mock.mock(`${BASE_URL}/article/details?ids=article_1fxfidxtcj`, 'get', {
  "msg": "文章详情",
  "state": 0,
  "articleData": {
    "comments": [
      {
        username: '张大炮',
        avatar: '',
        content: '写得好，我一个字没看懂',
        date: '2020.03.20 14:36',
      },
      {
        username: '尼古拉斯赵四',
        avatar: '',
        content: '你为什么扒拉人小女孩？',
        date: '2020.03.10 12:36',
      },
      {
        username: '孙子',
        avatar: '',
        content: '我就吃两个，剩下的都给你。',
        date: '2020.03.20 14:36',
      }
    ],
    "ids": "article_1fxfidxtcj",
    "views": 2,
    "likes": 0,
    "_id": "5e6a616e7aa1942d94edc531",
    "title": "第三篇测试文章",
    "des": "测试",
    "content": "<h2>啦啦啦啦阿联</h2><p><br></p><p>测试</p>",
    "typeId": 1003,
    "typeName": "网络安全",
    "tag": "测试3",
    "userIds": "user_lheyk2ocqxe",
    "date": "2020-03-12T16:21:02.478Z",
    "__v": 0
  },
  "userData": {
    "ids": "user_lheyk2ocqxe",
    "username": "dtec_9h4mjf4wb87",
    "sex": "保密",
    "motto": "",
    "profession": "",
    "company": "",
    "_id": "5e675a60ea0bf43770597926",
    "tel": "13628032230",
    "createdDate": "2020-03-10T09:14:08.114Z",
    "__v": 0
  }
});

/**
 * 阅读排行榜
 */
Mock.mock(`${BASE_URL}/article/hotlist`, 'get', {

  "msg": "热门文章",
  "state": 0,
  "data": [
    {
      "ids": "article_c6rnbqh70jr",
      "title": "阿里前端攻城狮们写了一份前端面试题答案，请查收",
      "views": 88
    },
    {
      "ids": "article_rybzy55xc38",
      "title": "另一个作者测试",
      "views": 45
    },
    {
      "ids": "article_uyz0vounmc",
      "title": "这是刚刚修改的文章",
      "views": 30
    },
    {
      "ids": "article_zjlyxps34i",
      "title": "成为猛男后的第一篇文章",
      "views": 21
    },
    {
      "ids": "article_7sb4emlo3bx",
      "title": "11",
      "views": 12
    },
    {
      "ids": "article_irkyj84lgff",
      "title": "第二篇测试文章",
      "views": 10
    },
    {
      "ids": "article_1fxfidxtcj",
      "title": "第三篇测试文章",
      "views": 10
    }
  ]
})