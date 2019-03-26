// This is the current 'Get HYDRO' tab. This tab contains 3 modules - 'Buying', 'Depositing' and 'Withdrawing'.

import React, { useState, useEffect, useMemo } from "react";
import { TextField } from "@material-ui/core";
import { Button } from "@material-ui/core";
import { Typography } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";
import { useWeb3Context } from "web3-react";

import TransactionButton from "../common/TransactionButton";
import { useNamedContract, useSnowflakeBalance } from "../../common/hooks";
import { toDecimal, fromDecimal } from "../../common/utilities";

const MAX_UINT_256 = "0xffffffffffffffffffffffffffffff";

const styles = theme => ({
  marginTop: {
    marginTop: theme.spacing.unit * 4
  }
});

const SLIPPAGE_MULTIPLIER = 100000;

export default withStyles(styles)(function GetHydro({ ein, classes }) {
  const context = useWeb3Context();
  const deadline = useMemo(() => Math.round(new Date() / 1000) + 60 * 60, []);

  const snowflakeBalance = useSnowflakeBalance(ein, true);

  const tokenContract = useNamedContract("token");
  const snowflakeContract = useNamedContract("snowflake");
  const uniswapWidgetContract = useNamedContract("uniswapWidget");

  const [baseExchangeRate, setBaseExchangeRate] = useState("");
  const [buyAmount, setBuyAmount] = useState("");
  const [ethRequiredToBuy, setEthRequiredToBuy] = useState("");
  const [slippage, setSlippage] = useState("");
  const [exchangeRate, setExchangeRate] = useState("");
  const [depositAmount, setDepositAmount] = useState("");
  const [withdrawAmount, setWithdrawAmount] = useState("");

  // Gets the exchange rate for ETH -> Hydro conversions.
  async function getExchangeRate(hydroAmount) {
    return uniswapWidgetContract.methods
      .swapAndDepositOutput(hydroAmount, deadline, ein)
      .call({ from: context.address, value: MAX_UINT_256 })
      .then(result => {
        const hydroNumerator = context.library.utils.toBN(hydroAmount);
        const ethDenominator = context.library.utils.toBN(result);

        return [hydroNumerator.div(ethDenominator), ethDenominator];
      });
  }

  useEffect(() => {
    getExchangeRate(fromDecimal("1", 18)).then(result =>
      setBaseExchangeRate(result[0].toString())
    );
  }, []);

  useEffect(() => {
    if (buyAmount !== "" && baseExchangeRate !== "") {
      getExchangeRate(fromDecimal(buyAmount, 18))
        .then(([rate, ethAmount]) => {
          setExchangeRate(rate.toString());

          const ethRequired = context.library.utils.fromWei(
            ethAmount.toString(),
            "ether"
          );
          setEthRequiredToBuy(ethRequired);

          const slippage =
            100 -
            rate
              .mul(context.library.utils.toBN(SLIPPAGE_MULTIPLIER))
              .div(context.library.utils.toBN(baseExchangeRate))
              .toNumber() /
              (SLIPPAGE_MULTIPLIER / 100);
          setSlippage(slippage);
        })
        .catch(e => {
          console.error(e); // eslint-disable-line no-console
        });
    }
  }, [buyAmount, baseExchangeRate]);

  const message = [
    `Rate (HYDRO): ${exchangeRate}`,
    `Rate (ETH): ${1 / Number(exchangeRate)}`,
    `ETH required: ${ethRequiredToBuy}`,
    Math.round(slippage * 100) / 100 > 0.01
      ? `Slippage: ${Math.round(slippage * 100) / 100}%`
      : ""
  ]
    .filter(x => x !== "")
    .join(" | ");

  return (
    <div className="tabbedContent getHydro">

      {/* Text and H6 for buying HYDRO with ETH and depositing it into your Snowflake.
        Currently there is an onchange which adjust the current exchange rate. */}
      <Typography
        variant="h6"
        gutterBottom
        color="textPrimary"
        className={classes.marginTop}
      >
        Buy HYDRO with ETH and deposit it into your Snowflake.
      </Typography>

      <TextField
        label="Amount"
        type="number"
        helperText={
          exchangeRate === "" ? "Number of Hydro tokens to buy." : message
        }
        margin="normal"
        value={buyAmount}
        onChange={e => setBuyAmount(e.target.value)}
        fullWidth
      />

      {/* Button for buying HYDRO with ETH and depositing it into your Snowflake.
        Currently has a limit of 10,000 HYDRO. */}
      <TransactionButton
        readyText={
          buyAmount <= 10000
            ? "Buy and Deposit Hydro"
            : "Maxiumum Request: 10,000 HYDRO"
        }
        method={() =>
          uniswapWidgetContract.methods.swapAndDepositOutput(
            fromDecimal(buyAmount, 18),
            deadline,
            ein
          )
        }
        transactionOptions={{
          value: context.library.utils
            .toBN(fromDecimal(ethRequiredToBuy, 18))
            .mul(context.library.utils.toBN(100))
            .div(context.library.utils.toBN(97))
        }}
        onConfirmation={context.forceAccountReRender}
        disabled={buyAmount > 10000}
      />

      {/* Text and H6 for depositing HYDRO from your current account into your Snowflake.
        Currently there is an onchange which adjust the current exchange rate. */}
      <Typography
        variant="h6"
        gutterBottom
        color="textPrimary"
        className={classes.marginTop}
      >
        Deposit HYDRO from your current account into your Snowflake, which you
        can use to pay for dApp services.
      </Typography>
      <TextField
        label="Amount"
        type="number"
        helperText="Number of Hydro tokens to deposit."
        margin="normal"
        value={depositAmount}
        onChange={e => setDepositAmount(e.target.value)}
        fullWidth
      />

      {/* Button for depositing HYDRO from your current account into your Snowflake. */}
      <TransactionButton
        readyText="Deposit Hydro"
        method={() =>
          tokenContract.methods.approveAndCall(
            snowflakeContract._address,
            fromDecimal(depositAmount, 18),
            "0x00"
          )
        }
        onConfirmation={context.forceAccountReRender}
      />

      {/* Text and H6 for withdrawing HYDRO from your Snowflake into your current account.
        Currently there is an onchange which adjust the current exchange rate. */}
      <Typography
        variant="h6"
        gutterBottom
        color="textPrimary"
        className={classes.marginTop}
      >
        Withdraw HYDRO from your Snowflake into your current account.
      </Typography>
      <TextField
        label="Amount"
        type="number"
        helperText="Number of Hydro tokens to withdraw."
        margin="normal"
        value={withdrawAmount}
        onChange={e => setWithdrawAmount(e.target.value)}
        fullWidth
      />

      {/* Button for determining the max amount of HYDRO you can withdraw and fills the number into the textbox. */}
      <Button onClick={() => setWithdrawAmount(toDecimal(snowflakeBalance, 18))}>
        Max
      </Button>

      {/* Button for withdrawing HYDRO from your Snowflake account into your current account. */}
      <TransactionButton
        readyText="Withdraw Hydro"
        method={() =>
          snowflakeContract.methods.withdrawSnowflakeBalance(
            context.account,
            fromDecimal(withdrawAmount, 18)
          )
        }
        onConfirmation={context.forceAccountReRender}
      />
    </div>
  );
});
