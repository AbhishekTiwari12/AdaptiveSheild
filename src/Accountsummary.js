import React from "react";
import AcccessibleTable from "./table";
import StockChart from "./graphs";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";

export default function Accountsummary() {
  const history = useHistory();
  const handleClick = () => history.push("/ShieldSetup");
  const handleClick2 = () => history.push("/AddStocks");
  const handleClick3 = () => history.push("/DeleteScreen")
  const headings = {
    marginTop: -30,
    fontSize: 30,
    textAlign: "center",
    color: "#16697a",
    fontFamily: "Helvetica",
    background: "rgba(232, 236, 241, 0.3)",
  };
  const headings2 = {
    fontSize: 40,
    marginTop: 50,
    textAlign: "center",
    color: "#000000",
    fontFamily: "Helvetica",
  };
  const content = {
    width: 300,
    paddingTop: 60,
    margin: "auto",
    fontSize: 30,
    color: "#000000",
    fontWeight: "Bold",
    fontFamily: "Helvetica",
    textAlign: "center",
  };
  const shieldButton = {
    paddingTop: 70,
    textAlign: "center",
    width: 300,
    margin: "auto",
  };
  const Datast = {
    fontSize: 20,
    color: "#0278ae",
    paddingLeft: 20,
    fontFamily: "Helvetica",
  };

  const addStockButton = {
    paddingTop: 20,
    textAlign: "left",
    position: "relative",
    float: "right",
    paddingBottom: 10,
  };

  return (
    <React.Fragment>
      <div style={headings}>
        <h1>ACCOUNT SUMMARY</h1>
      </div>
      <div style={headings2}>
        <text>Your Balance Details:</text>
      </div>
      <div style={content}>
        <text>Account:</text> <text style={Datast}>Adaptive LLP</text>
        <br></br>
        <text>Balance:</text>
        <text style={Datast}>$100,200</text>
        <br></br>
        <text>Gain/Loss:</text>
        <text style={Datast}>$16000</text>
        <br></br>
        <br></br>
      </div>
      <div style={shieldButton}>
        <Button
          variant="contained"
          color="primary"
          fullWidth={true}
          onClick={handleClick}
        >
          SHIELD ON
        </Button>
      </div>
      <div>
        <StockChart />
        <AcccessibleTable />
      </div>
      <div style={addStockButton}>
        <Button variant="outlined" color="primary">
          UPDATE STOCKS
        </Button>
        <Button variant="outlined" color="secondary" onClick={handleClick3}>
          DELETE STOCKS
        </Button>
        <Button variant="outlined" color="primary" onClick={handleClick2}>
          ADD STOCKS +
        </Button>
      </div>
    </React.Fragment>
  );
}
