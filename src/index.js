
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
      host: ip,
      port: 22,
      username: 'ubnt',
      password: 'ubnt',
      algorithms: {
        kex: ['diffie-hellman-group1-sha1'],
        cipher: [
          '3des-cbc',
          'blowfish-cbc',
          'cast128-cbc',
          'arcfour',
          'arcfour128',
          'arcfour256',
          'aes128-cbc',
          'aes192-cbc',
          'aes256-cbc',
          'aes128-ctr',
          'aes192-ctr',
          'aes256-ctr',
          'aes128-gcm@openssh.com',
          'aes256-gcm@openssh.com',
        ],
      },
    })
  })
}

const mfiLogout = ip => {
  connections[ip].end()
}

const setSensor = (sensorId, output, ip) => {
  return new Promise((resolve, reject) => {
    connections[ip].exec(`/usr/bin/echo ${output} > /proc/power/output${sensorId}`, (err, stream) => {
      if (err)
        debug(err)

      stream.on('close', (code, signal) => {
        debug(code)
        debug(signal)

        debug('Execution finished')
        return resolve()
      })

      stream.on('data', data => {
        debug('STDOUT: ' + data)
      })

      stream.stderr.on('data', data => {
        debug('STDERR: ' + data)
      })
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
