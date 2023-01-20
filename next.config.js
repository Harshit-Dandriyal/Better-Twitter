const path = require('path')
module.exports = {
  images: {
    domains: ["rb.gy"],
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
  },
};


