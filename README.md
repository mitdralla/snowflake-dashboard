# Snowflake Dashboard

This is a demo frontend for the [Snowflake identity protocol](https://github.com/hydrogen-dev/smart-contracts/tree/master/snowflake) written in React. It utilizes the [web3-webpacked](https://github.com/noahhydro/web3-webpacked) library. For more information on Snowflake, please refer to the [white paper](https://github.com/hydrogen-dev/hydro-docs/tree/master/Snowflake).

Visit the [live dashboard](https://noahhydro.github.io/snowflake-dashboard/).

## Adding Resolver Modals
1. Add the checksummed `address`, `ABI`, and optional `requiredAllowance` of your resolver smart contract in [src/common/contracts.js](./src/common/contracts.js).
2. Create a React component that displays your resolver's data and place it in [src/components/resolvers/components](./src/components/resolvers/components), ensuring that its name is the checksum of the resolver address.
3. Optionally, add a 256x256 png logo four your resolver in [src/components/resolvers/logos](./src/components/resolvers/logos), with the name as the checksum of your resolver address.

**ALL instances of your resolver address must be checksummed.**

Note that for any user to be able to add your resolver, you must first whitelist it from an address with a snowflake (this functionality is available from the add a resolver modal available on the dashboard to accounts with a Snowflake).
