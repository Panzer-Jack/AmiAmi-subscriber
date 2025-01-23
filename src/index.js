const { chromium } = require('playwright')
const nodemailer = require('nodemailer')
const utils = require('./utils');

// 实例：填写你amiami检索过滤的网址 【浏览器复制进来即可，如下 Yuzusoft的手办厂商】
const URLS = [
  'https://www.amiami.com/cn/search/list/?s_maker_id=7824&s_st_list_preorder_available=1&s_st_list_backorder_available=1&s_st_list_newitem_available=1&s_st_condition_flg=1&s_cate_tag=14&s_sortkey=releasedated',
  'https://www.amiami.com/cn/search/list/?s_maker_id=273&s_st_list_preorder_available=1&s_st_list_backorder_available=1&s_st_list_newitem_available=1&s_st_condition_flg=1&s_cate_tag=14&s_sortkey=releasedated'
]

let updateList = []

// 你的邮件
const MY_Email = ''
const SERVER_EMAIL = ''
const SERVER_EMAIL_PASS = ''

// 邮件服务器配置，默认写了QQ
class Emailer {
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: 'smtp.exmail.qq.com',
      port: 465,
      secure: true,
      auth: {
        user: SERVER_EMAIL,
        pass: SERVER_EMAIL_PASS
      }
    })
  }

  /**
   * @function sendEmail 发送邮件
   * @param to 接收方邮箱
   * @param subject 邮件主题
   * @param html 邮件内容
   * @returns 
   */
  async sendEmail(html) {
    const mailOptions = {
      from: `"AmiAmi 订阅有更新" <${SERVER_EMAIL}>`,
      to: MY_Email,
      subject: 'AmiAmi 订阅有更新',
      html
    };
    return this.transporter.sendMail(mailOptions);
  }
}

const emailer = new Emailer()
emailer.sendEmail()

async function run() {
  const browser = await chromium.launch({
    headless: false, // 设置为 false 以避免被识别为无头浏览器
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  })
  const page = await browser.newPage()

  const responsePromises = [] // 用于存储所有响应的 promise
  let flag = false // 处理JSON
  let currUrl = ''


  // 监听所有响应
  page.on('response', async (response) => {
    responsePromises.push(response)

    if (response.url().includes('api.amiami.com/api/v1.0/items') && response.status() === 200) {
      const contentType = response.headers()['content-type']
      if (contentType && contentType.includes('application/json')) {
        try {
          const res = await response.json()
          const newItems = res.items
          const newState = {}
          newItems.forEach(item => newState[item.gcode] = item.gname)
          // 获取上次保存的状态
          const lastStateObj = utils.readLastState()
          let lastState = null
          if (lastStateObj) {
            lastState = lastStateObj[currUrl]
          }
          if (utils.checkUpdate(newState, lastState)) {
            updateList.push(currUrl)
            utils.saveCurrentState(currUrl, newState)
            console.log('New items detected.');
          }
        } catch (error) {
          console.error('Failed to parse JSON:', error)
        }
        flag = true
      }
    }
  })

  for (const url of URLS) {
    currUrl = url
    await page.goto(url)
    await Promise.all(responsePromises)
  }

  await new Promise(resolve => setInterval(() => utils.checkFlag(flag, resolve), 1000))

  await browser.close()
  console.log('Finished')
}

run().catch((error) => {
  console.error('Error:', error)
}).finally(async () => {
  if (updateList.length) {
    let html = '<h1>更新链接</h1>'
    html += updateList.map((url) => `<p>${url}</p>`).join('<hr>')
    await emailer.sendEmail(html.toString())
  }
  process.exit(1)
})