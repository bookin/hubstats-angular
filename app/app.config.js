"use strict";
var AppConfig = (function () {
    function AppConfig() {
    }
    Object.defineProperty(AppConfig, "BACKEND_URL", {
        get: function () { return 'http://hubstat.loc:3500'; },
        enumerable: true,
        configurable: true
    });
    return AppConfig;
}());
exports.AppConfig = AppConfig;
//# sourceMappingURL=app.config.js.map