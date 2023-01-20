module.exports = {
  images: {
    domains: ["rb.gy"],
  },
};
const path = require('path')

module.exports = {
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
}