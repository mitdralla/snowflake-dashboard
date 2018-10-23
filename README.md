# Snowflake Dashboard

This is a demo frontend for the [Snowflake identity protocol](https://github.com/hydrogen-dev/smart-contracts/tree/master/snowflake) written in React. It utilizes the [web3-webpacked](https://github.com/noahhydro/web3-webpacked) library. For more information on Snowflake, please refer to the [white paper](https://github.com/hydrogen-dev/hydro-docs/tree/master/Snowflake).

Visit the [live dashboard](https://noahhydro.github.io/snowflake-dashboard/).

## Adding Resolver Modals

1. Create a Snowflake-compatible smart contract and deploy it to `Rinkeby` or `Mainnet`.
2. Add a folder named per the **checksummed** `address` of your smart contract in [src/components/resolvers/](./src/components/resolvers/).
3. Create an `index.js` file in the folder.
4. In this file, create a React component that displays your resolver's data and make it the default export.
5. Additionally, make sure to include the following named exports:
	- `logo`: A 256x256 png logo for your resolver.
	- `ABI`: The ABI of your contract.
	- `requiredAllowance`: The HYDRO amount a user must set as their initial allowance for your resolver on sign-up.
