/* global process */

import _Storage from './storage';
import _Names from './names';
import _Messages from './messages';
import _Blockchain, {
  BlockchainConnectionError as _BlockchainConnectionError,
  Contract as _Contract
} from './blockchain';

import _Utils from './utils';

export const Storage = _Storage;
export const Names = _Names;
export const Messages = _Messages;
export const Blockchain = _Blockchain;
export const BlockchainConnectionError = _BlockchainConnectionError;
export const Contract = _Contract;
export const Utils = _Utils;

export default class EmbarkJS {
  constructor() {
    throw new Error('use as constructor is not supported, this class provides only static methods and properties');
  }

  static Storage = Storage;
  static Names = Names;
  static Messages = Messages;
  static Blockchain = Blockchain;
  static Utils = Utils;

  static Contract () {
    throw new Error('EmbarkJS.Contract is deprecated: please use EmbarkJS.Blockchain.Contract instead');
  }

  static enableEthereum() {
    return Blockchain.enableEthereum();
  }

  static isNewWeb3() {
    throw new Error('EmbarkJS.isNewWeb3 is deprecated: only Web3 >=1.2.4 is supported now');
  }

  static get isNode() {
    try {
      return Object.prototype.toString.call(typeof process !== 'undefined' ? process : 0) === '[object process]';
    } catch (e) {
      return false;
    }
  }

  static onReady (cb) {
    if (Blockchain.blockchainConnector) {
      Blockchain.execWhenReady(cb);
    } else {
      cb();
    }
  }
}
