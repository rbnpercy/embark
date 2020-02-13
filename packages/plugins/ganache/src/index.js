import {__} from 'embark-i18n';
const constants = require('embark-core/constants');

class Ganache {
  constructor(embark) {
    this.embark = embark;
    this.currentProvider = null;

    this.embark.events.request("blockchain:node:register", constants.blockchain.clients.ganache, {
      isStartedFn: (cb) => {
        cb(null, !!this.currentProvider); // Always assume it's started, because it's just a provider (nothing to start)
      },
      launchFn: (cb) => {
        this._getProvider(); // No need to return anything, we just want to populate currentProvider
        this.embark.logger.info(__('Blockchain node is ready').cyan);
        cb();
      },
      stopFn: (cb) => {
        this.currentProvider = null;
        cb();
      },
      provider: async (_endpoint) => {
        return this._getProvider();
      }
    });

    this._registerStatusCheck();
  }

  _getProvider() {
    if (this.currentProvider) {
      return this.currentProvider;
    }
    const ganache = require('ganache-cli');
    const blockchainConfig = this.embark.config.blockchainConfig;

    // Ensure the dir exists before initiating Ganache, because Ganache has a bug
    // => https://github.com/trufflesuite/ganache-cli/issues/558
    this.embark.fs.ensureDirSync(blockchainConfig.datadir);

    const hasAccounts = blockchainConfig.accounts && blockchainConfig.accounts.length;

    const isTest = this.embark.currentContext.includes('test');

    this.currentProvider = ganache.provider({
      // Default to 8000000, which is the server default
      // Somehow, the provider default is 6721975
      gasLimit: blockchainConfig.targetGasLimit || '0x7A1200',
      blockTime: blockchainConfig.simulatorBlocktime,
      network_id: blockchainConfig.networkId || 1337,
      db_path: isTest ? '' : blockchainConfig.datadir,
      default_balance_ether: '99999',
      mnemonic: hasAccounts || isTest ? '' : constants.blockchain.defaultMnemonic
    });
    return this.currentProvider;
  }

  _registerStatusCheck() {
    this.embark.events.request("services:register", 'Ethereum (VM)', (cb) => {
      if (!this.currentProvider) {
        return cb({name: "Ethereum provider stopped", status: 'off'});
      }

      const sendMethod = (this.currentProvider.sendAsync) ? this.currentProvider.sendAsync.bind(this.currentProvider) : this.currentProvider.send.bind(this.currentProvider);
      sendMethod({
          jsonrpc: '2.0',
          method: 'web3_clientVersion',
          params: [],
          id: Date.now().toString().substring(9)
        },
        (error, res) => {
          if (error || !res.result) {
            return cb({name: "Ethereum provider failure", status: 'off'});
          }
          const versionParts = res.result.split('/');
          cb({name: `Ganache - ${versionParts[1] || ''}`, status: 'on'});
        });
    });
  }
}

module.exports = Ganache;
