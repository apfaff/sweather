var axios = require('axios')

module.exports = {
  async get (url) {
    try {
      const res = await axios.get(url)
      return res.data
    } catch (err) {
      console.error(err.message)
    }
  }
}
