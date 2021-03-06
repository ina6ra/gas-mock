var gas = require('gas-local');
var Sugar = require('sugar');
var path = require('path');

var urlfetchapp = require('./class/UrlFetchApp');
var response = require('./class/HTTPResponse');
var logger = require('./class/Logger');
var properties = require('./class/Properties');
var service = require('./class/PropertiesService');

function gas_mock() {

  var defMock = gas.globalMockDefault;

  var customMock = {
    Logger: logger.get_mock(defMock.Logger),
    Properties: properties.get_mock(),
    HTTPResponse: response.get_mock(),
    __proto__: defMock
  };

  var addMock = {
    PropertiesService: service.get_mock(customMock['Properties']),
    UrlFetchApp: urlfetchapp.get_mock(customMock['HTTPResponse'])
  };

  return Sugar.Object.merge(customMock, addMock);
}

module.exports = {
  globalMockDefault: gas_mock(),
  require: function(folderPath, globalObject, options) {
    if(globalObject == null) globalObject = this.globalMockDefault;
    if(options == null) options = {
      filter: function(f) {
        if(path.basename(f).match(/^\._/) != null) return false;
        return path.extname(f) == '.js';
      }
    }
    return gas.require(folderPath, globalObject, options);
  }
};
