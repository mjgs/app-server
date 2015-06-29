var AppServer = require('./lib/AppServer');

module.exports = function(app, app_dir, mount_path) {
  return new AppServer(app, app_dir, mount_path);
};