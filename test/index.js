
const { mfiLogin, setSensor, getSensor, mfiLogout } = require('../src')

const main = async () => {
  try {
    await mfiLogin('ubnt', 'ubnt', '192.168.178.32')
    console.log('Logged in')

    await setSensor(1, 1, '192.168.178.32')
    console.log('Set sensor')

    setTimeout(async () => await setSensor(1, 0, '192.168.178.32'), 2000)
    setTimeout(async () => await mfiLogout('192.168.178.32'), 4000)

    // setInterval(async () => {
    //   try {
    //     const sensorValues = await getSensor(1, '192.168.178.32')
    //     console.log(sensorValues)
    //   } catch (err) {
    //     console.log(err.message)
    //   }
    // }, 1000)
  } catch (err) {
    console.log(err.message)
  }
}

main()