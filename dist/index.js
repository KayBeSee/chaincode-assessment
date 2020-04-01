"use strict";

require("regenerator-runtime/runtime.js");

var _utils = require("./utils");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var start = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* () {
    var sortedMempool = yield (0, _utils.readAndSortCsv)('/Users/kevinmulcrone/repos/chaincode-assessment/dist/mempool.csv'); // console.log('sortedMempool: ', sortedMempool);
    // console.log('sortedMempool[0]: ', sortedMempool[0].txId);
    // console.log('sortedMempool[100].txId: ', sortedMempool[100].txId);
    // console.log('sortedMempool[200].txId: ', sortedMempool[200].txId);
    // console.log('sortedMempool[300].txId: ', sortedMempool[300].txId);
    // console.log('sortedMempool[400].txId: ', sortedMempool[400].txId);

    var block = buildBlockFromMempool(sortedMempool);
    console.log('block: ', block);
  });

  return function start() {
    return _ref.apply(this, arguments);
  };
}();

var buildBlockFromMempool = sortedMempool => {
  var MAX_BLOCK_SIZE = 4000000;
  var currentBlockTxIds = [];
  var index = 0;
  var currentBlockSize = 0;

  while (currentBlockSize < MAX_BLOCK_SIZE && index < sortedMempool.length - 1) {
    console.log("processing ".concat(JSON.stringify(sortedMempool[index]), "..."));

    if (sortedMempool[index].weight + currentBlockSize < MAX_BLOCK_SIZE) {
      console.log('hits if');
      currentBlockSize += sortedMempool[index].weight;
      currentBlockTxIds.push(sortedMempool[index].txId);
    }

    index++;
  }

  console.log('currentBlockSize: ', currentBlockSize);
  return currentBlockTxIds;
};

start();