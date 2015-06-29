var debug = require('debug')('app-server:index');
var readdir = require('readdir');
var path = require('path');

module.exports = AppServer;

function AppServer(app, app_dir, mount_path) {
  this.app = app;
  this.app_dir = app_dir;
  this.mount_path = mount_path;
  this.loadApps();
  return this.app;
}

AppServer.prototype.loadApps = function(cb) {
  var self = this;
  var cb = cb || function() {};
  var apps = [];

  readdir.read(self.app_dir, ['*/'],
    readdir.NON_RECURSIVE +
    readdir.INCLUDE_DIRECTORIES, function (err, dirs) {
    if (err) return cb(err);
    dirs.forEach(function(dir) {
      var dirname = dir.replace(/\/$/, "");
      var app_path = path.join(process.cwd(), self.app_dir, dirname);

      var this_app;
      try {
        debug('require ' + app_path);
        this_app = require(app_path);
      }
      catch (err) {
        console.log(err);
        return cb(err);
      }

      self.app.use(self.mount_path + '/' + dirname, this_app);
      apps.push(dirname);
      debug('app-server: ' + dirname + ' mounted to ' + self.mount_path + '/' + dirname);
    });
    cb(null, apps);
  });
};