# mFi API

> Computer science is no more about computers than astronomy is about telescopes. -- Edsger Dijkstra

[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()

## Description
A basic mPower, mFi Switch and mFi In-Wall Outlet HTTP API wrapper utilizing [CURL](https://github.com/JCMais/node-libcurl) and using ES-6 promises. Works on Linux, macOS and Windows.

## Install
```bash
$ npm install --save mfi-api
```

## Usage
```js

const { mfiLogin, setSensor, getSensor, mfiLogout } = require('mfi-api')

const main = async () => {
  try {
    await mfiLogin('ubnt', 'ubnt', '192.168.178.32')
    console.log('Logged in')

    await setSensor(1, 1, '192.168.178.32')
    console.log('Sensor set')

    setTimeout(async () => await setSensor(1, 0, '192.168.178.32'), 2000)
    setTimeout(async () => await mfiLogout('192.168.178.32'), 4000)
  } catch (err) {
    console.log(err.message)
  }
}

main()

```

## Used packages
[node-libcurl](https://github.com/JCMais/node-libcurl)

## License
MIT © Erek Röös <2017>
