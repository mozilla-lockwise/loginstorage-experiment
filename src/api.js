const {
  classes: Cc, interfaces: Ci, manager: Cm, results: Cr, utils: Cu
} = Components;

Cu.import("resource://gre/modules/XPCOMUtils.jsm");

function LoginManagerStorage() {}
LoginManagerStorage.prototype = {
  classDescription: "nsILoginManagerStorage implementation for WebExtensions",
  contractID: "@example.com/login-manager/storage/web-extension;1",
  classID: Components.ID("{92498a82-2ab8-11e7-a0ce-3c970e058524}"),
  QueryInterface: XPCOMUtils.generateQI([Ci.nsILoginManagerStorage]),

  createInstance(outer, iid) {
    return this.QueryInterface(iid);
  },

  // The logging code below is taken from
  // <https://developer.mozilla.org/en-US/docs/Mozilla/Creating_a_login_manager_storage_module>.

  // Console logging service, used for debugging.
  __logService: null,
  get _logService() {
    if (!this.__logService)
      this.__logService = Cc["@mozilla.org/consoleservice;1"]
                            .getService(Ci.nsIConsoleService);
    return this.__logService;
  },
  log(message) {
    dump("SampleLoginManager: " + message + "\n");
    this._logService.logStringMessage("SampleLoginManager: " + message);
  },

  // Logs function name and arguments for debugging
  stub(arguments) {
    var args = [];
    for (let i = 0; i < arguments.length; i++)
      args.push(arguments[i]);
    this.log("Called " + arguments.callee.name + "(" + args.join(",") + ")");
  },

  initialize() {
    this.stub(arguments);
  },
  terminate() {
    this.stub(arguments);
  },

  addLogin(login) {
    this.stub(arguments);
  },
  removeLogin(login) {
    this.stub(arguments);
  },
  modifyLogin(oldLogin, newLogin) {
    this.stub(arguments);
  },
  removeAllLogins() {
    this.stub(arguments);
  },

  getAllLogins(count) {
    this.stub(arguments);
  },
  searchLogins(count, matchData) {
    this.stub(arguments);
  },
  findLogins(count, hostname, formSubmitURL, httpRealm) {
    this.stub(arguments);
  },
  countLogins(aHostname, aFormSubmitURL, aHttpRealm) {
    this.stub(arguments);
  }
};

class API extends ExtensionAPI {
  getAPI(context) {
    return {
      loginstorage: {
        async register() {
          // Register our XPCOM component and add a category entry overriding
          // the default storage.
          let storage = new LoginManagerStorage();
          Cm.QueryInterface(Ci.nsIComponentRegistrar).registerFactory(
            storage.classID, storage.classDescription, storage.contractID,
            storage
          );
          XPCOMUtils.categoryManager.addCategoryEntry(
            "login-manager-storage", "nsILoginManagerStorage",
            storage.contractID, false, true
          );

          // Reinitialize the built-in login manager to use our new storage.
          // XXX: This relies on code in LoginManager meant only for debugging.
          // We'll want to fix this in mozilla-central in the future.
          let loginMgr = Cc["@mozilla.org/login-manager;1"]
                           .getService(Ci.nsILoginManager)
                           .QueryInterface(Ci.nsIInterfaceRequestor)
                           .getInterface(Ci.nsIVariant);
          loginMgr._initStorage();
        }
      }
    };
  }
}
