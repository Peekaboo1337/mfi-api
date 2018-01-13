
const debug = require('debug')('mfi-lib')
const { Client } = require('ssh2')

// SSH client connections map
const connections = {}

const connect = (conn, ip, user, pw) => {
  conn.connect({
    host: ip,
    port: 22,
    username: user,
    password: pw,
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
        'aes256-gcm@openssh.com'
      ]
    }
  })
}

const connectionFactory = (errHandler, readyHandler, closeHandler) => {
  const conn = new Client()

  conn.on('error', err => {
    debug('Connection creation error - ' + err)
    errHandler(err)
  })

  conn.on('ready', () => {
    readyHandler(conn)
  })

  conn.on('close', hadError => {
    closeHandler(hadError)
  })

  return conn
}

const mfiLogin = (username, password, ip) => {
  return new Promise((resolve, reject) => {
    const errHandler = err => {
      throw new Error(err)
    }

    const readyHandler = conn => {
      // Connection established. Notify caller that everything was fine
      connections[ip] = conn
      return resolve()
    }

    const closeHandler = hadError => {
      if (hadError) { // Restart connection if lost due to an error
        debug('Had Error: ' + hadError)
        delete connections[ip]

        const conn = connectionFactory(errHandler, readyHandler, closeHandler)

        connect(conn, ip, username, password)
        connections[ip] = conn
      }
    }

    const conn = connectionFactory(errHandler, readyHandler, closeHandler)
    connect(conn, ip, username, password) // connect via ssh
  })
}

const mfiLogout = ip => {
  connections[ip].end()
  delete connections[ip]
}

const setSensor = (sensorId, output, ip) => {
  return new Promise((resolve, reject) => {
    debug(`Setting sensor ${sensorId}, ${output}, ${ip}`)
    connections[ip].exec(`/usr/bin/echo ${output} > /proc/power/output${sensorId}`, (err, stream) => {
      if (err) {
        debug('Critical err - ')
        debug(err)
        return reject(err)
      }

      stream.on('close', (code, signal) => {
        if (code !== 0) return reject(err)

        debug('Set sensor successfully')
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
  getSensor
}
