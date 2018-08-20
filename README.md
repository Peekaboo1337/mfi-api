# mFi API

> Computer science is no more about computers than astronomy is about telescopes. -- Edsger Dijkstra

[![license](https://img.shields.io/github/license/mashape/apistatus.svg)]()

## Description
A basic mPower, mFi Switch and mFi In-Wall Outlet wrapper utilizing [SSH](https://github.com/mscdex/ssh2) and using ES-6 promises. 
Tested on Linux only.

## Install
Old version

```bash
$ npm install --save mfi-api@0.1.1
```

New version (Breaking changes!!!)
```bash
$ npm install --save mfi-api@latest
```

## Usage
```js

const ms = require('ms')
const SocketConnector = require('../src/index')

const __main__ = async () => {
  const connector = new SocketConnector('192.168.2.3', 'ubnt', 'ubnt')
  setTimeout(async () => connector.setSensor(1, 1), ms('5s'))
  setTimeout(async () => connector.setSensor(1, 0), ms('10s'))
  setTimeout(async () => connector.setSensor(1, 1), ms('15s'))
  setTimeout(async () => connector.setSensor(1, 0), ms('20s'))
  setTimeout(async () => connector.disconnect(), ms('25s'))
}

__main__()

```

## Used packages
[ssh2](https://github.com/mscdex/ssh2)

## License
MIT © Erek Röös, 2017
