// @flow
import type {
  WalletAction,
  SetWalletAction,
  SetBalanceAction,
  SetTokenBalancesAction
} from 'actions/wallet';
import { BaseWallet } from 'libs/wallet';
import { toUnit } from 'libs/units';
import Big from 'bignumber.js';
import { getTxFromBroadcastStatusTransactions } from 'selectors/wallet';
import type { BroadcastStatusTransaction } from 'libs/transaction';
export type State = {
  inst: ?BaseWallet,
  // in ETH
  balance: Big,
  tokens: {
    [string]: Big
  },
  transactions: Array<BroadcastStatusTransaction>
};

export const INITIAL_STATE: State = {
  inst: null,
  balance: new Big(0),
  tokens: {},
  isBroadcasting: false,
  transactions: []
};

function setWallet(state: State, action: SetWalletAction): State {
  return { ...state, inst: action.payload, balance: new Big(0), tokens: {} };
}

function setBalance(state: State, action: SetBalanceAction): State {
  const ethBalance = toUnit(action.payload, 'wei', 'ether');
  return { ...state, balance: ethBalance };
}

function setTokenBalances(state: State, action: SetTokenBalancesAction): State {
  return { ...state, tokens: { ...state.tokens, ...action.payload } };
}

function handleUpdateTxArray(
  transactions: Array<BroadcastStatusTransaction>,
  broadcastStatusTx: BroadcastStatusTransaction,
  isBroadcasting: boolean,
  successfullyBroadcast: boolean
): Array<BroadcastStatusTransaction> {
  return transactions.map(item => {
    if (item === broadcastStatusTx) {
      return { ...item, isBroadcasting, successfullyBroadcast };
    } else {
      return { ...item };
    }
  });
}

function handleTxBroadcastCompleted(
  state: State,
  signedTx: string,
  successfullyBroadcast: boolean
  // TODO How to handle null case for existing Tx?. Should use Array<BroadcastStatusTransaction> but can't.
): Array<any> {
  const existingTx = getTxFromBroadcastStatusTransactions(
    state.transactions,
    signedTx
  );
  if (existingTx) {
    const isBroadcasting = false;
    return handleUpdateTxArray(
      state.transactions,
      existingTx,
      isBroadcasting,
      successfullyBroadcast
    );
  } else {
    return [];
  }
}

function handleBroadcastTxRequested(state: State, signedTx: string) {
  const existingTx = getTxFromBroadcastStatusTransactions(
    state.transactions,
    signedTx
  );
  const isBroadcasting = true;
  const successfullyBroadcast = false;
  if (!existingTx) {
    return state.transactions.concat([
      {
        signedTx,
        isBroadcasting,
        successfullyBroadcast
      }
    ]);
  } else {
    return handleUpdateTxArray(
      state.transactions,
      existingTx,
      isBroadcasting,
      successfullyBroadcast
    );
  }
}

export function wallet(
  state: State = INITIAL_STATE,
  action: WalletAction
): State {
  switch (action.type) {
    case 'WALLET_SET':
      return setWallet(state, action);
    case 'WALLET_SET_BALANCE':
      return setBalance(state, action);
    case 'WALLET_SET_TOKEN_BALANCES':
      return setTokenBalances(state, action);
    case 'WALLET_BROADCAST_TX_REQUESTED':
      return {
        ...state,
        isBroadcasting: true,
        transactions: handleBroadcastTxRequested(state, action.payload.signedTx)
      };
    case 'WALLET_BROADCAST_TX_SUCCEEDED':
      return {
        ...state,
        transactions: handleTxBroadcastCompleted(
          state,
          action.payload.signedTx,
          true
        )
      };
    case 'WALLET_BROADCAST_TX_FAILED':
      return {
        ...state,
        transactions: handleTxBroadcastCompleted(
          state,
          action.payload.signedTx,
          false
        )
      };
    default:
      return state;
  }
}
