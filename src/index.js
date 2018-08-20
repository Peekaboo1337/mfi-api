
const debug = require('debug')('mfi-lib')
const { Client } = require('ssh2')

module.exports = class MfiSocketConnector {
  /**
   * Creating a new connection to a mFi socket
   *
   * @param {string} ip The host to connect to
   * @param {string} user The user to login
   * @param {string} password The password of the user
   */
  constructor (ip, user, password) {
    // Private members
    this._connection = new Client()
    this._connectionIsReady = false
    this._ip = ip
    this._user = user
    this._password = password

    // Attaching to events
    this._connection.on('error', this._handleError.bind(this))
    this._connection.on('ready', this._handleReady.bind(this))
    this._connection.on('close', this._handleClose.bind(this))

    debug('Init')
  }

  /**
   * Setting the the sensor found under the given id
   * to the provided value.
   *
   * @param {number} sensorId The sensor to manipulate
   * @param {number} value The value to set
   * @returns {Promise<void>} A resolvable promise with no value
   */
  async setSensor (sensorId, value) {
    return new Promise(async (resolve, reject) => {
      debug('Setting sensor')
      if (!this._connectionIsReady) await this._reconnect()

      this._connection.exec(`/usr/bin/echo ${value} > /proc/power/output${sensorId}`, (err, stream) => {
        if (err) return reject(err)

        debug('Executing and reading stream')

        stream.on('close', (code, signal) => code === 0 ? resolve({ code }) : reject(new Error('Stream error')))
        stream.on('data', (data) => debug(data))
        stream.stderr.on('data', (data) => debug(data))
      })
    })
  }

  disconnect () {
    this._connection.destroy()
  }

  /**
   * Handles thrown errors by the ssh2 package
   *
   * @param {Error} err Error thrown by ssh2 package
   */
  _handleError (err) {
    debug(err)
    this._connectionIsReady = false
    throw err
  }

  /**
   * Kicks in when the connection is ready to be used
   */
  _handleReady () {
    this._connectionIsReady = true
  }

  /**
   * Handles the ssh close event
   *
   * @param {boolean} hadError Indicates if connection was closed due to an error
   */
  _handleClose (hadError) {
    debug('Connection closed: ' + hadError)
    this._connectionIsReady = false
  }

  async _reconnect () {
    return new Promise((resolve, reject) => {
      debug('Reconnecting')
      this._connect(this._ip, this._user, this._password)

      const interval = setInterval(() => { // Polling if connection is ready
        if (!this._connectionIsReady) return

        debug('Reconnecting')

        clearInterval(interval) // Avoid memory leak
        return resolve()
      }, 50)
    })
  }

  /**
   * Creating a new connection to a mFi socket
   *
   * @param {string} ip The host to connect to
   * @param {string} user The user to login
   * @param {string} password The password of the user
   */
  _connect (ip, user, password) {
    this._connection.connect({
      host: ip,
      port: 22,
      username: user,
      password,
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
}
