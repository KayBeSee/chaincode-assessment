"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.readAndSortCsv = void 0;

var _fs = _interopRequireDefault(require("fs"));

var _PapaParse = _interopRequireDefault(require("PapaParse"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

// inspired by https://stackoverflow.com/questions/49752889/how-can-i-read-a-local-file-with-papa-parse
var readCSV = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* (filePath) {
    var csvFile = _fs.default.readFileSync(filePath);

    var csvData = csvFile.toString();
    return new Promise(resolve => {
      _PapaParse.default.parse(csvData, {
        header: false,
        dynamicTyping: true,
        complete: results => {
          resolve(results.data);
        }
      });
    });
  });

  return function readCSV(_x) {
    return _ref.apply(this, arguments);
  };
}();

var convertMempoolArraysToMempoolObjects = mempoolRows => {
  return mempoolRows.map(mempoolRow => {
    return {
      txId: mempoolRow[0],
      fee: mempoolRow[1],
      weight: mempoolRow[2],
      parentTxs: mempoolRow[3] // KBC-TODO: these will need to be parsed when tackling parent

    };
  });
};

var sortMempoolObjects = mempoolObjects => {
  return mempoolObjects.sort((a, b) => a.fee < b.fee ? 1 : a.fee === b.fee ? a.weight > b.weight ? 1 : -1 : -1);
};

var readAndSortCsv = /*#__PURE__*/function () {
  var _ref2 = _asyncToGenerator(function* (filePath) {
    var mempoolCsv = yield readCSV(filePath);
    var mempoolAsObjects = convertMempoolArraysToMempoolObjects(mempoolCsv);
    return sortMempoolObjects(mempoolAsObjects);
  });

  return function readAndSortCsv(_x2) {
    return _ref2.apply(this, arguments);
  };
}();

exports.readAndSortCsv = readAndSortCsv;