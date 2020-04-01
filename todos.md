- parse csv file and return MempoolTransaction

{
  txid: String,
  fee: number (sats),
  weight: number,
  parentTxs: [txids] 
}

- organize transactions by highest fee
- build block, ignore transactions with parenttxs during first iteration

- optimzations for fee / weight balance (2 txs with lower fees but lower weight could be > fee than high fee, high weight tx)

- once building blocks ignoring parent txs, incorporate parent txs