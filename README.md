# Snowflake Dashboard

[![Build Status](https://travis-ci.org/HydroBlockchain/snowflake-dashboard.svg?branch=master)](https://travis-ci.org/HydroBlockchain/snowflake-dashboard)

This is a demo frontend for the [Snowflake identity protocol](https://github.com/hydrogen-dev/smart-contracts/tree/master/snowflake) written in React. It utilizes the [web3-react](https://github.com/NoahZinsmeister/web3-react) library. For more information on Snowflake, please refer to the [white paper](https://github.com/hydrogen-dev/hydro-docs/tree/master/Snowflake).

Visit the [live dashboard](https://HydroBlockchain.github.io/snowflake-dashboard/).

## Adding Your Resolver To the Dashboard

1. Create a smart contract on Rinkeby that appropriately inherits from the canonical [`SnowflakeResolver` contract](https://github.com/hydrogen-dev/smart-contracts/blob/master/snowflake/contracts/SnowflakeResolver.sol). For examples, [see here](https://github.com/hydrogen-dev/smart-contracts/tree/master/snowflake/contracts/resolvers). **In order to be accepted to the dashboard, your smart contract source code must be verified on Etherscan.**
2. Note the **checksummed** address of your smart contract and make a folder with this name in [src/components/resolvers/Rinkeby](./src/components/resolvers/Rinkeby).
3. Create an `index.js` file in the folder.
4. This file should export the following exports:
	- `default`: A React Component **wrapped in React.lazy**. This component will receive a user's EIN in the props as `ein`.
		- `export default lazy(() => import('./ResolverComponent'))`.
	- `extraDataComponent`: An optional React Component **wrapped in React.lazy**. This component will receive a user's EIN in the props as `ein` and a function `sendExtraData`. This function should be called with the `bytes` argument to be passed to your resolver on sign-up.
		- `export default lazy(() => import('./ExtraDataComponent'))`.
	- `ABI`: The ABI of your contract.
	- `logo`: A 256x256 png logo for your resolver.
	- `requiredAllowance`: An optional HYDRO amount a user must set as their initial allowance for your resolver on sign-up.

Hints
- Check out the existing [Status Resolver](./src/components/resolvers/Rinkeby/0xbB54D790860B07DE1E1b2db0eD553a6cB713E2f0) for best practices patterns.
