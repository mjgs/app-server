var debug = require('debug')('app-server:index');
var readdir = require('readdir');
var path = require('path');

module.exports = AppServer;

function AppServer(app, app_dir, mount_path) {
  self = this;
  self.app = app;
  self.app_dir = app_dir;
  self.mount_path = mount_path;
  self.loadApps();
  return self.app;
}

AppServer.prototype.loadApps = function(cb) {
  var cb = cb || function() {};
  var apps = [];
  var app = self.app;
  var app_dir = self.app_dir;
  var mount_path = self.mount_path;

  readdir.read(self.app_dir, ['*/'],
    readdir.NON_RECURSIVE +
    readdir.INCLUDE_DIRECTORIES, function (err, dirs) {
    if (err) return cb(err);
    dirs.forEach(function(dir) {
      var dirname = dir.replace(/\/$/, "");
      var app_path = path.join(process.cwd(), app_dir, dirname);

      var this_app;
      try {
        debug('require ' + app_path);
        this_app = require(app_path);
      }
      catch (err) {
        console.log(err);
        return cb(err);
      }

      app.use(mount_path + '/' + dirname, this_app);
      apps.push(dirname);
      debug('app-server: ' + dirname + ' mounted to ' + mount_path + '/' + dirname);
    });
    cb(null, apps);
  });
};