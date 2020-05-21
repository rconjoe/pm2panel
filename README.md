## PM2Panel is a simple panel you can host to control PM2 with a web GUI.

You can perform simple tasks from the webpanel:

 * Add process to pm2
 * Remove process from pm2
 * Restart process in pm2
 * show log of process in pm2
 * Save processes
 * has login

![](http://4uploader.com/upload/file/201804_1/pm2%20gif5acc753a.gif)


## Requirements

 * NodeJS
 * PM2


## Installation

```bash
git clone https://github.com/rconjoe/pm2panel.git
cd pm2panel
npm install
node pm2panel
```

Once the process is started, in a browser navigate to http://server_ip:3001 to login with the default credentials:

the default user is `admin` and password is `admin`.


## Configuration

**PM2Panel is currently only intended for local network use.**
You can edit the default login credentials by editing `pm2panel.js`:

```javascript
const PORT = 3001;
const USER = 'admin';
const PASS = 'admin';
const SESSTION_AGE = 10 * 60000; // 10 minutes
```



## 

*PM2 was originally written by 4xmen https://github.com/4xmen/pm2panel, this version documented and maintained by https://rconjoe.com*