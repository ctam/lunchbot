if (process.env.NODE_ENV !== 'production') { require('dotenv').load() }

const _ = require('lodash');
const foursquare = require('node-foursquare-venues')(process.env.FOURSQUARE_CLIENT_ID, process.env.FOURSQUARE_CLIENT_SECRET);


module.exports = function (bot) {
  bot.respond(/lunch/i, function (res) {
    const searchObj = {
      near: '530 Parnassus Avenue San Francisco CA',
      categoryId: [
        '4bf58dd8d48988d142941735', // Asian (Nan King, Soi Gow, New Sandy's, etc.)
        '4bf58dd8d48988d1bd941735', // Salad (Pluto's)
        '4bf58dd8d48988d1c5941735', // Sandwich (Wooly Pig)
        '4bf58dd8d48988d143941735', // Breakfast (Crepevine)
        '4bf58dd8d48988d16c941735', // Burger (Burgermeister)
        '4bf58dd8d48988d1c0941735', // Mediterranean (Taboun)
        '4bf58dd8d48988d1ca941735', // Pizza (KP, Front Room) 
        '4bf58dd8d48988d10f941735', // Indian
        '4bf58dd8d48988d1c1941735', // Mexican
      ].join(','),
      radius: 625,
      limit: 50
    }

    return foursquare.venues.search(searchObj, function (error, payload) {
      if (error) return res.send(error)

      const lunchOptions = _.sample(payload.response.venues, 5)
      const url = 'https://www.foursquare.com/v/'
      var message = '';

      for (var i = 0; i < lunchOptions.length; i++) {
        var cs = lunchOptions[i]
        message += (i + 1) + ': ' + cs.name + ' (' + url + cs.id + ')\n'
        message += cs.location.address + '\n\n'
      }

      return res.send(message)
    })
  })
}
