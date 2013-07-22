(function() {
  var androidLauncher = null;
  var widgetLibrary;
  var open;
  if (process.platform == 'android') {
    // Call Android interface
    androidLauncher = require('bridge').load(require("../platform_interfaces.json").android.AppLauncherManagerImpl, this);
    /* FIXME: temporarily disable widgetmanager in this isolate */
    widgetLibrary = null;
  } else {
    try { widgetLibrary = require('webinos-widget'); } catch(e) { widgetLibrary = null; }
    open = require('open');
  }

  var webinosPath = require("webinos-utilities").webinosPath.webinosPath();
  var uuid = require('node-uuid');
  var url = require('url');
  var fs = require('fs');
  var path = require('path');
  var existsSync = fs.existsSync || path.existsSync;

  var findInstalledApp = function(appURI) {
    var requestedApp;
    if (widgetLibrary) {
      var installedApps = widgetLibrary.widgetmanager.getInstalledWidgets();

      for (var idx in installedApps) {
        var cfg = widgetLibrary.widgetmanager.getWidgetConfig(installedApps[idx]);
        if (cfg && cfg.id === appURI) {
          console.log("found app id " + cfg.id);
          requestedApp = cfg;
          break;
        }
      }
    }

    return requestedApp;
  }

  var writeLaunchRequest = function(appId, params, cb) {
    // Create a dummy wgt file that contains the details of the widget launch.
    // This fools the OS into launching the renderer, which will parse
    // the dummy wgt file and launch the correct widget (if installed).
    var fname = ".__webinosLaunch." + uuid.v1() + ".wgt";
    var launchFile = path.join(webinosPath,'wrt/' + fname);
    var launchData = { isWidget: true, installId: appId, params: params };
    fs.writeFileSync(launchFile,JSON.stringify(launchData));
    open(launchFile, null, cb);
    return launchFile;
  }

  var checkLaunchRequest = function(launchFile, successCB, errorCB) {
    var failedFile = launchFile + ".failed";
    if (existsSync(failedFile)) {
      errorCB("error while launching application");
      fs.unlinkSync(failedFile);
    } else if (existsSync(launchFile)){
      errorCB("runtime failed to launch application - check runtime is running");
      fs.unlinkSync(launchFile);
    } else {
      successCB(true);
    }
  }

  var launchApplication = function(appURI, successCB, errorCB) {
    console.log("launchApplication was invoked. AppID: " +  appURI);

    if (process.platform == 'android'){
      androidLauncher.launchApplication(
        function (res) {
          successCB();
        },
        function (err) {
          errorCB(err)
        },
        appURI
      );
      return;
    }

    var parsed = url.parse(appURI);
    var params = parsed.search;

    // Remove query string portion when looking for installed widgets.
    var widgetID = parsed.href.replace(params,"");

    var installedApp = findInstalledApp(widgetID);
    if (typeof installedApp !== "undefined") {
      // Run the installed widget...
      console.log("applauncher: launching widget " + installedApp.installId);
      var req = writeLaunchRequest(installedApp.installId, params, function(err) {
        if (err == null) {
          // Application launch OK - confirm that the renderer actually started the widget
          setTimeout(checkLaunchRequest, 2000, req, successCB, errorCB);
        } else {
          errorCB(err);
        }
      });
    } else if (/^http[s]?:\/{2}/.test(appURI)) {
      // Not installed widget, but is a valid URL
      console.log("applauncher: launching " + appURI);

      // Spawn the platform-specific action to launch the default browser.
      open(appURI, null, function(err){
        if (err == null) {
          successCB(true);
        } else {
          errorCB(err);
        }
      });
    } else {
      console.log("applauncher: invalid/unknown appURI " + appURI);
      if (typeof errorCB === "function") {
        errorCB("Unknown appURI - " + appURI);
      }
    }
  };

  var appInstalled = function(appURI, successCB, errorCB) {
    console.log("appInstalled was invoked. AppID: " + appURI);

    if (typeof appURI === "undefined" || !appURI) {
      errorCB("invalid appURI parameter");
    } else {
      var foundApp = findInstalledApp(appURI);
      successCB(typeof foundApp !== "undefined" ? true : false);
    }
  };

  module.exports = {
    appInstalled: appInstalled,
    launchApplication: launchApplication
  };
}());

