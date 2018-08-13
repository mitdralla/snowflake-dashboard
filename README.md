# Snowflake Dashboard

This is a demo frontend for the [Snowflake identity protocol](https://github.com/hydrogen-dev/smart-contracts/tree/master/snowflake). It utilizes the [web3-webpacked](https://github.com/noahhydro/web3-webpacked) library. For more information on Snowflake, please refer to the [white paper](https://github.com/hydrogen-dev/hydro-docs/tree/master/Snowflake).

Visit the [live dashboard](https://noahhydro.github.io/snowflake-dashboard/).

To add a resolver modal:
1. Add the `address` and `ABI` of your resolver smart contract in [public/js/constants.js](./public/js/constants.js).
2. Create a React component that displays your resolver's data and place it in [src/resolverComponents](./src/resolverComponents.js).
3. Modify [src/resolverComponents/index.js](./src/resolverComponents/index.js) to include your component.
