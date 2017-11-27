
const debug = require('debug')('mfi-lib')
const { Client } = require('ssh2')

// SSH client connections map
const connections = {}

const mfiLogin = (username, password, ip) => {
  return new Promise((resolve, reject) => {
    const conn = new Client()
    conn.on('ready', () => {
      debug('Connected to socket')
      connections[ip] = conn

      return resolve()
    })

    conn.on('error', err => {
      debug(err)
      return reject()
    })

    conn.connect({
      host: '',
      port: 22,
      username: 'ubnt',
      password: 'ubnt',
    })
  })
}

const mfiLogout = ip => {
  connections[ip].end()
}

const setSensor = (sensorId, output, ip) => {
  return new Promise((resolve, reject) => {
    connections[ip].exec(`/usr/bin/echo ${output} > /proc/power/output${sensorId}`, (code, signal) => {
      if (code === 0)
        return resolve({ code, signal })

      else
        return reject({ code, signal })
    })
  })
}

const getSensor = (sensorId, ip) => {
  return {}
}

module.exports = {
  mfiLogin,
  mfiLogout,
  setSensor,
  getSensor,
}
