import "regenerator-runtime/runtime.js";
import { readAndSortCsv, writeToTxt, allParentTxsAreInBlock } from './utils';

const start = async () => {
  const sortedMempool = await readAndSortCsv('/Users/kevinmulcrone/repos/chaincode-assessment/dist/mempool.csv');
  const block = buildBlockFromMempool(sortedMempool)
  writeToTxt(block, 'block.txt');
}

// Basic sorting pattern.
// Since the mempool is sorted by fee and then weight, we take all the transactions with the highest fees and put them
// into an array
const buildBlockFromMempool = (sortedMempool) => {
  const MAX_BLOCK_SIZE = 4000000;
  let currentBlockTxIds = [];
  let index = 0;
  let currentBlockSize = 0;
  let txsWithParentsNotInBlock = []; // array of high fee tx who's parents weren't in block when attempted to add

  while ((currentBlockSize < MAX_BLOCK_SIZE) && (index < sortedMempool.length)) {
    // loop through txsWithParentsNotInBlock to see if we can add any txs we passed over since they have higher fees than the current tx we are examining
    let txWParentsIndex = 0;
    while (currentBlockSize < MAX_BLOCK_SIZE && txWParentsIndex < txsWithParentsNotInBlock.length) {
      if (allParentTxsAreInBlock(txsWithParentsNotInBlock[txWParentsIndex].parentTxs, currentBlockTxIds)) {
        currentBlockSize += txsWithParentsNotInBlock[txWParentsIndex].weight;
        currentBlockTxIds.push(txsWithParentsNotInBlock[txWParentsIndex].txId);
        // remove from txsWithParentsNotInBlock array since we added it to block array
        txsWithParentsNotInBlock.splice(txWParentsIndex, 1);
      }
      txWParentsIndex++;
    }

    if (sortedMempool[index].weight + currentBlockSize < MAX_BLOCK_SIZE) {
      if (allParentTxsAreInBlock(sortedMempool[index].parentTxs, currentBlockTxIds)) {
        currentBlockSize += sortedMempool[index].weight;
        currentBlockTxIds.push(sortedMempool[index].txId)
      } else {
        // these transactions parents aren't in the block yet, but they have a high fee,
        // so let's save them to look at again later and see if their parent got added to the block
        txsWithParentsNotInBlock.push(sortedMempool[index]);
      }
    }
    index++;
  }
  return currentBlockTxIds;
}

start();