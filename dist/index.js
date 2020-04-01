"use strict";

require("regenerator-runtime/runtime.js");

var _utils = require("./utils");

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var start = /*#__PURE__*/function () {
  var _ref = _asyncToGenerator(function* () {
    var sortedMempool = yield (0, _utils.readAndSortCsv)('/Users/kevinmulcrone/repos/chaincode-assessment/dist/mempool.csv');
    var block = buildBlockFromMempool(sortedMempool);
    (0, _utils.writeToTxt)(block, 'block.txt');
  });

  return function start() {
    return _ref.apply(this, arguments);
  };
}(); // Basic sorting pattern.
// Since the mempool is sorted by fee and then weight, we take all the transactions with the highest fees and put them
// into an array


var buildBlockFromMempool = sortedMempool => {
  var MAX_BLOCK_SIZE = 4000000;
  var currentBlockTxIds = [];
  var index = 0;
  var currentBlockSize = 0;
  var txsWithParentsNotInBlock = []; // array of high fee tx who's parents weren't in block when attempted to add

  while (currentBlockSize < MAX_BLOCK_SIZE && index < sortedMempool.length) {
    // loop through txsWithParentsNotInBlock to see if we can add any txs we passed over since they have higher fees than the current tx we are examining
    var txWParentsIndex = 0;

    while (currentBlockSize < MAX_BLOCK_SIZE && txWParentsIndex < txsWithParentsNotInBlock.length) {
      if (allParentTxsAreInBlock(txsWithParentsNotInBlock[txWParentsIndex].parentTxs, currentBlockTxIds)) {
        currentBlockSize += txsWithParentsNotInBlock[txWParentsIndex].weight;
        currentBlockTxIds.push(txsWithParentsNotInBlock[txWParentsIndex].txId); // remove from txsWithParentsNotInBlock array since we added it to block array

        txsWithParentsNotInBlock.splice(txWParentsIndex, 1);
      }

      txWParentsIndex++;
    }

    if (sortedMempool[index].weight + currentBlockSize < MAX_BLOCK_SIZE) {
      if (allParentTxsAreInBlock(sortedMempool[index].parentTxs, currentBlockTxIds)) {
        currentBlockSize += sortedMempool[index].weight;
        currentBlockTxIds.push(sortedMempool[index].txId);
      } else {
        // these transactions parents aren't in the block yet, but they have a high fee,
        // so let's save them to look at again later and see if their parent got added to the block
        txsWithParentsNotInBlock.push(sortedMempool[index]);
      }
    }

    index++;
  }

  console.log('currentBlockSize: ', currentBlockSize);
  return currentBlockTxIds;
};

var allParentTxsAreInBlock = (parentTxs, block) => {
  for (var i = 0; i < parentTxs.length; i++) {
    if (!block.includes(parentTxs[i])) {
      return false;
    }
  }

  return true;
};

start();