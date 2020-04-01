import fs from 'fs';
import Papa from 'PapaParse'

// inspired by https://stackoverflow.com/questions/49752889/how-can-i-read-a-local-file-with-papa-parse
const readCSV = async (filePath) => {
  const csvFile = fs.readFileSync(filePath)
  const csvData = csvFile.toString()
  return new Promise(resolve => {
    Papa.parse(csvData, {
      header: false,
      dynamicTyping: true,
      complete: results => {
        resolve(results.data);
      }
    });
  });
};

const convertMempoolArraysToMempoolObjects = (mempoolRows) => {
  return mempoolRows.map((mempoolRow) => {
    return {
      txId: mempoolRow[0],
      fee: mempoolRow[1],
      weight: mempoolRow[2],
      parentTxs: mempoolRow[3] ? mempoolRow[3].split(";") : []
    }
  })
}

const sortMempoolObjects = (mempoolObjects) => {
  return mempoolObjects.sort((a, b) => (a.fee < b.fee) ? 1 : (a.fee === b.fee) ? ((a.weight > b.weight) ? 1 : -1) : -1);
}

export const readAndSortCsv = async (filePath) => {
  const mempoolCsv = await readCSV(filePath);
  const mempoolAsObjects = convertMempoolArraysToMempoolObjects(mempoolCsv);
  return sortMempoolObjects(mempoolAsObjects);
}

export const writeToTxt = async (block, fileName) => {
  let file = fs.createWriteStream(fileName);

  block.forEach((block) => file.write(block + '\n'))
  file.end();
}

export const allParentTxsAreInBlock = (parentTxs, block) => {
  for (let i = 0; i < parentTxs.length; i++) {
    if (!block.includes(parentTxs[i])) {
      return false;
    }
  }
  return true;
}