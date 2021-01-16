import React from "react";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { sendPrice } from "./ShieldSetup";
import { ChangeShieldState } from "./Accountsummary";

export default function Success() {
  const history = useHistory();
  const price = sendPrice();
  const handleClickBack = () => {
    ChangeShieldState();
    history.push("/");
  };

  const headings = {
    marginTop: 70,
    position: "relative",
    margin: "auto",
    fontSize: 30,
    textAlign: "center",
    color: "#000000",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "rgba(232, 236, 241, 0.5)",
    fontWeight: "bold",
  };

  const backButton = {
    paddingTop: 200,
    margin: "auto",
    textAlign: "center",
    width: 300,
  };
  const TC = {
    textAlign: "center",
    fontSize: 30,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    paddingTop: 30,
    color: "#000000",
  };
  const shieldData = {
    position: "relative",
    margin: "auto",
    textAlign: "left",
    paddingTop: 20,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    paddingLeft: 50,
    maxWidth: 600,
    fontSize: 18,
  };
  const TCcontent = {
    position: "relative",
    margin: "auto",
    textAlign: "left",
    paddingTop: 20,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    paddingLeft: 20,
    paddingRight: 20,
    maxWidth: 600,
    fontSize: 12,
  };

  const Notice = {
    textAlign: "center",
    paddingTop: 30,
    fontSize: 20,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  }

  return (
    <React.Fragment>
      <div style={headings}>
        <text>Adaptive Shield Confirmed!</text>
      </div>
      <div style={TC}>
        <text>TERMS & CONDITIONS</text>
      </div>
      <div style = {Notice}>
        <text>
          You have agreed to purchase protection with the following details:
        </text>
      </div>
      <div style={shieldData}>
        <br></br>
        <table width="500" position="relative" margin="auto">
          <tr>
            <td>Portfolio value protected:</td>
            <td align="right">{price[3]}%</td>
          </tr>
          <tr>
            <td>And for a loss no less than:</td>
            <td align="right">{price[2]}%</td>
          </tr>
          <tr>
            <td>For a period of:</td>
            <td align="right">{price[1]}</td>
          </tr>
          <tr>
            <td>For a total cost of:</td>
            <td align="right">${price[0]}</td>
          </tr>
        </table>
      </div>
      <br></br>
      <div style={TCcontent}>
        <text>
          Shield Protection Period expires on the selected date. Shield
          Protection Level specifies the level of selected protection. Shield
          Protection Payout is settled at closing on the expiration date of the
          Shield Protection Period. Calculation of Protection Payouts: The
          Shield Protection Payout equals the difference between (1) the
          aggregate market value of the holdings (see table above), inclusive of
          all dividends and other distributions during the Shield Protection
          Period, and (2) the Shield Protection Level. For example, if a
          $100,000 Portfolio experiences a crash and, at the expiration of the
          Shield Protection Period,is down by the 1987 Black Monday magnitude
          (22.6%)—and the Shield Protection Level is set at 10%—you will be paid
          the difference of 12.6% equal to $12,600. Contact Adaptive for Shield
          Redemption, prior to the end of the Shield Protection Period.
        </text>
      </div>
      <div style={backButton}>
        <Button
          variant="contained"
          color=""
          fullWidth="True"
          onClick={handleClickBack}
        >
          DISMISS
        </Button>
      </div>
    </React.Fragment>
  );
}
