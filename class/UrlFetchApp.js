var request = require('sync-request');

// UrlFetchApp クラスのモックを作成
var UrlFetchApp = function(response) {
  response_ = response;

  return {
    // fetch 関数の実装
    fetch: function(url, params) {
      var method = 'GET';
      if(params == null) params = {};
      if(params['method'] != null) {
        method = params['method'].toUpperCase();
      }
      var req;
      if(method == 'POST') {
        req = request(method, url, {
          json: params['payload']
        });
      } else {
        req = request(method, url);
      }
      response_.setContentText(req.body);
      return response_;
    }
  }
}

function get_mock(response) {
  return new UrlFetchApp(response);
}

module.exports = {get_mock};
