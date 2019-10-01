import {recursiveMerge} from "embark-utils";

const constants = require('embark-core/constants');

export function getBlockchainDefaults(env) {
  const defaults = {
    clientConfig: {
      miningMode: 'dev' // Mode in which the node mines. Options: dev, auto, always, off
    },
    enabled: true,
    client: constants.blockchain.clients.geth,
    proxy: true,
    datadir: `.embark/${env}/datadir`,
    rpcHost: "localhost",
    rpcPort: 8545,
    rpcCorsDomain: {
      auto: true,
      additionalCors: []
    },
    wsRPC: true,
    wsOrigins: {
      auto: true,
      additionalCors: []
    },
    wsHost: "localhost",
    wsPort: 8546,
    networkType: "custom",
    isDev: true,
    nodiscover: true,
    maxpeers: 0,
    targetGasLimit: 8000000,
    simulatorBlocktime: 0
  };
  return {
    default: defaults,
    test: defaults
  };
}

export function getContractDefaults(embarkConfigVersions) {
  const defaultVersions = {
    "web3": "1.2.1",
    "solc": "0.5.0"
  };
  const versions = recursiveMerge(defaultVersions, embarkConfigVersions || {});

  return {
    "default": {
      "versions": versions,
      "dappConnection": [
        "$WEB3",
        "ws://localhost:8546",
        "localhost:8545"
      ],
      "dappAutoEnable": true,
      "strategy": constants.deploymentStrategy.implicit,
      "gas": "auto",
      "deploy": {
      }
    }
  };
}
