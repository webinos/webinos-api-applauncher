/*******************************************************************************
*  Code contributed to the webinos project
* 
* Licensed under the Apache License, Version 2.0 (the "License");
* you may not use this file except in compliance with the License.
* You may obtain a copy of the License at
*  
*     http://www.apache.org/licenses/LICENSE-2.0
*  
* Unless required by applicable law or agreed to in writing, software
* distributed under the License is distributed on an "AS IS" BASIS,
* WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
* See the License for the specific language governing permissions and
* limitations under the License.
* 
* Copyright 2012 Andre Paul, Fraunhofer FOKUS
******************************************************************************/
(function() {
  var RPCWebinosService = require('webinos-jsonrpc2').RPCWebinosService;
  var impl = require("./applauncher_impl");
  
  /**
   * Webinos AppLauncher service constructor (server side).
   * @constructor
   * @alias WebinosAppLauncherModule
   * @param rpcHandler A handler for functions that use RPC to deliver their result.  
   */
  var WebinosAppLauncherModule = function(rpcHandler, params) {
    // inherit from RPCWebinosService
    this.base = RPCWebinosService;
    this.base({
      api:'http://webinos.org/api/applauncher',
      displayName:'AppLauncher API',
      description:'The AppLauncher API for starting applications.'
    });
  };

  WebinosAppLauncherModule.prototype = new RPCWebinosService;

  /**
   * Launch an application.
   * @param successCB Success callback.
   * @param errorCB Error callback.
   * @param appURI URI of application to be launched
   */
  WebinosAppLauncherModule.prototype.launchApplication = function (paramsIn, successCB, errorCB){
    var appURI = paramsIn[0];
    return impl.launchApplication(appURI,successCB, errorCB);
  };
  
  /**
   * Determine whether an app is available.
   */
  WebinosAppLauncherModule.prototype.appInstalled = function (params, successCB, errorCB){
    var appURI = params[0];
    return impl.appInstalled(appURI,successCB,errorCB);
  };
  
  exports.Service = WebinosAppLauncherModule;
})();
