
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
    // console.log(err)
  }
}

main()
