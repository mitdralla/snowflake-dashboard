# Snowflake Dashboard

This fork is dedicated to rebuilding the dashboard with React from the ground up.

This is a demo frontend for the [Snowflake identity protocol](https://github.com/hydrogen-dev/smart-contracts/tree/master/snowflake). It utilizes the [web3-webpacked](https://github.com/noahhydro/web3-webpacked) library. For more information on Snowflake, please refer to the [white paper](https://github.com/hydrogen-dev/hydro-docs/tree/master/Snowflake).

Visit the [live dashboard](https://noahhydro.github.io/snowflake-dashboard/).

## Adding Resolver Modals
1. Add the `address` and `ABI` of your resolver smart contract in [src/common/contracts.js](./src/common/contracts.js).
2. Create a React component that displays your resolver's data and place it in [src/components/resolvers](./src/components/resolvers).
3. Modify [src/components/resolvers/index.js](./src/components/resolvers/index.js) to include your component.

Note that for a user to add a resolver, you must first whitelist it from an address with a snowflake.

## Known Resolvers
1. Status: [`0x5051893c1ADdCa3176BA12606F9B006b5214bf51`](https://rinkeby.etherscan.io/address/0x5051893c1ADdCa3176BA12606F9B006b5214bf51). Note that you must set the allowance as 1 for this resolver.
