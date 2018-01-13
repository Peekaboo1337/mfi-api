
const ms = require('ms')
const { mfiLogin, setSensor, mfiLogout } = require('../src')

const __main__ = async () => {
  try {
    await mfiLogin('ubnt', 'ubnt', '192.168.2.106')
    await setSensor(1, 1, '192.168.2.106')
    setTimeout(async () => setSensor(1, 0, '192.168.2.106'), ms('10s'))
    setTimeout(async () => setSensor(1, 1, '192.168.2.106'), ms('20s'))
    setTimeout(async () => setSensor(1, 0, '192.168.2.106'), ms('30s'))
    setTimeout(async () => setSensor(1, 1, '192.168.2.106'), ms('40s'))
    setTimeout(async () => setSensor(1, 0, '192.168.2.106'), ms('50s'))
    setTimeout(async () => mfiLogout('192.168.2.106'), ms('1m'))
  } catch (err) {
    console.log(err)
  }
}

__main__()
