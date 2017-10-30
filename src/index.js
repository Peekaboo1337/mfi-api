
const querystring = require('querystring')
const Curl = require('node-libcurl').Curl
const randomstring = require('randomstring')
const debug = require('debug')('mfi-lib')

const cookies = {}

const getSessionCookie = ip => {
  const savedCookie = cookies[ip]

  let cookieString = null
  if (savedCookie === undefined) {
    cookieString = randomstring.generate(32)
    cookies[ip] = cookieString
  } else {
    cookieString = savedCookie
  }

  return cookieString
}

const mfiLogin = async (username, password, ip) => {
  return new Promise((resolve, reject) => {
    console.log(process.env.DEBUG)

    const loginCurl = new Curl()

    loginCurl.setOpt('URL', ip + '/login.cgi')
    loginCurl.setOpt('POSTFIELDS', querystring.stringify({
      username,
      password,
    }))
    loginCurl.setOpt('COOKIE', 'AIROS_SESSIONID=' + getSessionCookie())
    loginCurl.setOpt('FOLLOWLOCATION', true)

    loginCurl.on('end', (status, bodies, headers) => {
      if (headers.length === 3) {
        return resolve()
      }

      return reject(new Error('Login incorrect'))
    })

    loginCurl.on('error', err => {
      if (err) {
        return reject(err)
      }
    })

    loginCurl.perform()
  })
}

const mfiLogout = async ip => {
  return new Promise((resolve, reject) => {
    const logoutCurl = new Curl()

    logoutCurl.setOpt('URL', ip + '/logout.cgi')
    logoutCurl.setOpt('COOKIE', 'AIROS_SESSIONID=' + getSessionCookie())

    logoutCurl.on('end', (status, bodies, headers) => {
      debug(bodies)
      debug(status)
      debug(headers)

      return resolve()
    })

    logoutCurl.on('error', err => {
      return reject(err)
    })

    logoutCurl.perform()
  })
}

const setSensor = async (sensorId, output, ip) => {
  return new Promise((resolve, reject) => {
    const setCurl = new Curl()

    setCurl.setOpt('URL', ip + '/sensors/' + sensorId)
    setCurl.setOpt('POSTFIELDS', querystring.stringify({
      output,
    }))
    setCurl.setOpt('COOKIE', 'AIROS_SESSIONID=' + getSessionCookie())

    setCurl.on('end', (status, bodies, headers) => {
      debug('Toggled')
      debug(bodies)
      debug(status)
      debug(headers)

      try {
        const parsedBody = JSON.parse(bodies)
        if (parsedBody.status !== 'success') {
          return reject(new Error('Operation was not successfull'))
        }
      } catch (err) {
        return reject(new Error('Operation not successfull. Maybe not logged in?'))
      }

      return resolve()
    })

    setCurl.on('error', err => {
      return reject(err)
    })

    setCurl.perform()
  })
}

const getSensor = async (sensorId, ip) => {
  return new Promise((resolve, reject) => {
    const getCurl = new Curl()

    getCurl.setOpt('URL', ip + '/sensors/' + sensorId)
    getCurl.setOpt('COOKIE', 'AIROS_SESSIONID=' + getSessionCookie())

    getCurl.on('end', (status, bodies, headers) => {
      debug(status)
      debug(bodies)
      debug(headers)

      try {
        const parsedBody = JSON.parse(bodies)
        if (parsedBody.status !== 'success') {
          return reject(new Error('Operation was not successfull'))
        }

        return resolve(parsedBody)
      } catch (err) {
        return reject(new Error('Operation not successfull. Maybe not logged in?'))
      }
    })

    getCurl.on('error', err => {
      return reject(err)
    })

    getCurl.perform()
  })
}

module.exports = {
  mfiLogin,
  mfiLogout,
  setSensor,
  getSensor,
}
