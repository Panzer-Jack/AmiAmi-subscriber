AmiAmi 商品订阅通知器

此项目用于监控 AmiAmi（一家动漫手办及周边商品的在线商店）指定搜索页面，并在检测到新商品更新时通过邮件发送通知。

功能特性
	•	自动监控指定的 AmiAmi 搜索页面。
	•	检测到新商品或更新时触发通知。
	•	通过邮件发送更新通知。
	•	保存运行状态，避免重复发送通知。

前置条件
	1.	Node.js（版本 >= 16.0.0）。
	2.	Playwright 用于浏览器自动化。
	3.	Nodemailer 用于邮件发送。

安装步骤
	1.	克隆项目代码：

```
git clone https://github.com/your-username/amiami-notifier.git
cd amiami-notifier
```

	2.	安装依赖：
```
npm install
```

	3.	在 index.js 中配置邮件信息：
```
const MY_Email = 'your-email@example.com'; // 接收通知的邮箱
const SERVER_EMAIL = 'server-email@example.com'; // 用于发送邮件的邮箱
const SERVER_EMAIL_PASS = 'your-email-password'; // 发送邮箱的密码
```

	4.	替换 URLS 数组为你需要监控的 AmiAmi 搜索链接：

const URLS = [
    'https://www.amiami.com/cn/search/list/?s_maker_id=7824&...',
    'https://www.amiami.com/cn/search/list/?s_maker_id=273&...'
];

使用方法

手动运行脚本

使用 Node.js 执行脚本：
```
node src/index.js
```
配置定时任务（Cron）

若需定时检查更新，可以通过 cron 配置任务：
	1.	打开 crontab 编辑器：
```
crontab -e
```

	2.	添加以下内容，每天晚上 9 点运行脚本：
```
0 21 * * * /path/to/node /path/to/project/src/index.js >> /path/to/project/cron_output.log 2>&1
```
项目工作原理
	1.	浏览器自动化：
	•	使用 Playwright 自动打开指定的 AmiAmi 搜索页面。
	•	拦截页面中的 API 响应，获取商品信息。
	2.	状态对比：
	•	将当前商品状态保存到 lastState.json 文件中。
	•	与上一次的状态对比，检测是否有新商品或更新。
	3.	邮件通知：
	•	如果检测到更新，将通过邮件发送通知，包含更新的链接。

贡献

欢迎 Fork 本仓库并提交 PR，贡献新的功能或改进现有功能！
