const axios = require('axios');
const xml2js = require('xml2js');
const debug = require('debug')('app:service:goodreads');

const { GOODREADS_API_KEY } = require('../configs/keys');

module.exports = function goodreadService() {
  const parser = xml2js.Parser({ explicitArray: false });
  this.getBookById = async bookId => new Promise(async (resolve, reject) => {
    const response = await axios.get(`https://www.goodreads.com/book/show/${bookId}?key=${GOODREADS_API_KEY}`);
    debug(response);
    parser.parseString(response.data, (err, result) => {
      if (err) return reject(err);
      return resolve(result.GoodreadsResponse.book);
    });
  });
};
