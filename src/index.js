import "regenerator-runtime/runtime.js";

import { readAndSortCsv } from './utils';

const start = async () => {
  const sortedMempool = await readAndSortCsv('/Users/kevinmulcrone/repos/chaincode-assessment/dist/mempool.csv');
  const block = buildBlockFromMempool(sortedMempool)
  console.log('block: ', block);
}


const buildBlockFromMempool = (sortedMempool) => {
  const MAX_BLOCK_SIZE = 4000000;
  let currentBlockTxIds = [];
  let index = 0;
  let currentBlockSize = 0;

  while ((currentBlockSize < MAX_BLOCK_SIZE) && (index < sortedMempool.length - 1)) {
    if (sortedMempool[index].weight + currentBlockSize < MAX_BLOCK_SIZE) {
      currentBlockSize += sortedMempool[index].weight;
      currentBlockTxIds.push(sortedMempool[index].txId)
    }
    index++;
  }

  return currentBlockTxIds;
}

start();