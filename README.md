# mFi API

> Computer science is no more about computers than astronomy is about telescopes. -- Edsger Dijkstra

[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()

## Description
A basic mPower, mFi Switch and mFi In-Wall Outlet wrapper utilizing [SSH](https://github.com/mscdex/ssh2) and using ES-6 promises. 
Tested on Linux only.

## Install
```bash
$ npm install --save mfi-api
```

## Usage
```js

const ms = require('ms')
const { mfiLogin, setSensor, mfiLogout } = require('../src')

const main = async () => {
  try {
    await mfiLogin('ubnt', 'ubnt', '192.168.178.32')
    await setSensor(1, 1, '192.168.178.32')
    setTimeout(async () => await setSensor(1, 0, '192.168.178.32'), ms('10s'))
    setTimeout(async () => await setSensor(1, 1, '192.168.178.32'), ms('20s'))
    setTimeout(async () => await setSensor(1, 0, '192.168.178.32'), ms('30s'))
    setTimeout(async () => await setSensor(1, 1, '192.168.178.32'), ms('40s'))
    setTimeout(async () => await setSensor(1, 0, '192.168.178.32'), ms('50s'))
    setTimeout(async () => await mfiLogout('192.168.178.32'), ms('1m'))
  } catch (err) {
    console.log(err)
  }
}

main()

```

## Used packages
[ssh2](https://github.com/mscdex/ssh2)

## License
MIT © Erek Röös, 2017
