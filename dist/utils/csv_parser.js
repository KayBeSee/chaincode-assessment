"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readCSV = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _PapaParse = _interopRequireDefault(require("PapaParse"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var readCSV = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (filePath) {
    var csvFile = _fs.default.readFileSync(filePath);

    var csvData = csvFile.toString();
    return new Promise(resolve => {
      _PapaParse.default.parse(csvData, {
        header: false,
        dynamicTyping: true,
        complete: results => {
          var mempoolAsObject = convertMempoolArrayToMempoolObject(results.data);
          resolve(mempoolAsObject);
        }
      });
    });
  });

  return function readCSV(_x) {
    return _ref.apply(this, arguments);
  };
}();

exports.readCSV = readCSV;

var convertMempoolArrayToMempoolObject = mempoolRows => {
  return mempoolRows.map(mempoolRow => {
    return {
      txId: mempoolRow[0],
      fee: mempoolRow[1],
      weight: mempoolRow[2],
      parentTxs: mempoolRow[3]
    };
  });
};