if (process.env.NODE_ENV === 'production') {
  module.exports = {mongoURI: 'mongodb://andy:andy@ds145273.mlab.com:45273/clipbase-prod'}
} else {
  module.exports = {mongoURI: 'mongodb://localhost/clipbase'}
}
