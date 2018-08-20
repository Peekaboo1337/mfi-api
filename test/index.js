
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
