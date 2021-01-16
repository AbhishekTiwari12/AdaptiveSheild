import React from "react";
import StockChart from "./graphs";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import { Auth } from "aws-amplify";
import "./sliderStyle.css";

// Sends the list of stocks to the add, delete and update screens.
// Every Add, update or delete action is verified using this list
var arr = [];
export function sendList() {
  var arr1 = arr;
  return arr1;
}
var checked = false;

export function ChangeShieldState(){
  checked = true
}

//Function to fetch data, perform calculation for account total and render the screen
//along with the table and the graph
export default function Accountsummary() {
  //useHistory() hook is used to facilitate navigation between pages
  const history = useHistory();
  const handleClick = () => history.push("/ShieldSetup");
  const handleClick2 = () => history.push("/AddStocks");
  const handleClick3 = () => history.push("/DeleteScreen");
  const handleClick4 = () => history.push("/UpdateScreen");

  //Theme for the table

  const useStyles = makeStyles((theme) => ({
    root: {
      width: "100%",
      marginTop: theme.spacing(3),
      overflowX: "auto",
    },
    table: {
      minWidth: 650,
      size: "small",
    },
  }));

  //Function to create data rows for the table
  //Takes in 6 values and returns a rows that is rendered as a table row
  function createData(Symbol, Quantity, Last, Previous, Change, Value) {
    return { Symbol, Quantity, Last, Previous, Change, Value };
  }

  //CSS for the elements on the page, will have no errors here, ignore in case of debugging.
  const headings = {
    marginTop: -30,
    fontSize: 25,
    textAlign: "center",
    color: "#000000",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "rgba(232, 236, 241, 0.3)",
  };
  const content = {
    position: "relative",
    width: 470,
    margin: "auto",
    fontSize: 20,
    color: "#000000",
    fontWeight: "Bold",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    textAlign: "Left",
  };
  const shieldButton = {
    paddingTop: 70,
    textAlign: "center",
    width: 300,
    margin: "auto",
  };
  const Datast = {
    fontSize: 20,
    color: "#000000",
    paddingLeft: 20,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    textAlign: "right",
    fontWeight: "Normal",
  };
  const Datast2 = {
    fontSize: 20,
    color: "#50c878",
    paddingLeft: 20,
    fontFamily: "Helvetica",
    textAlign: "right",
    fontWeight: "Normal",
  };

  const addStockButton = {
    paddingTop: 20,
    textAlign: "left",
    position: "relative",
    float: "right",
    paddingBottom: 10,
  };
  const table = {
    position: "relative",
    margin: "auto",
    maxWidth: 700,
  };
  const graphSt = {
    position: "relative",
    margin: "auto",
    maxWidth: 900,
  };

  const tableHeader = {
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    textAlign: "center",
    marginTop: 30,
    fontWeight: "Bold",
    fontSize: 20,
  };
  const sliderPos = {
    marginTop: 40,
    width: 200,
    position: "relative",
    margin: "auto",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 50,
  };

  var rows2 = []; // rows2 holds the initial stock data as returned by the API and sends it to setRows function.
  //Custom react hook to re-render the screen everytime portofolio data is returned by the API, the new data(passed by rows2)
  //is stored in the rows variable
  const [rows, setRows] = React.useState([]);

  var sum = 0; //sum holds the initial value for "Balance", passes it on to setSum function.
  //react hook to re-render the screen everytime the value of "Balance" changes, the new total(passed by sum) is stored in the rows
  //variable
  const [sum1, setSum] = React.useState(0);

  var prevTotal = 0; //Holds the total portfolio value for the previous trading day, passes it on to the setPrevtotal fucntion
  //react hook to re-render the screen everytime new data is avaialable for prevoius day, the variable prevTotal1 is used to calculate gain/loss.
  const [prevTotal1, setPrevtotal] = React.useState(0);

  const [user, setUser] = React.useState(""); //Has data of the current logged-in user

  var lyst = []; //Has basic stock data before it is assigned to the rows2 variable

  getUserData(); //Calling the getUserData() function

  //gets data for the current logged-in user from AWS api
  function loadUser() {
    return Auth.currentAuthenticatedUser({ bypassCache: true });
  }

  //function to store the user data in the user variable
  async function getUserData() {
    try {
      //waiting for the loadUser() function to finish resolving, store the returned value in logged variable post resolve.
      const logged = await loadUser();
      //passing it onto the setUser hook to be stored into the user variable.
      setUser(logged.username);
    } catch (e) {
      //catching errors
      alert(e);
    }
  }

  //fucntion to get data for the portfolio-table and total balance.
  async function getData() {
    //defining the requestOptions
    var requestOptions = {
      method: "POST",
      redirect: "follow",
    };
    //creating the request, waiting for it to finish, storing the fetched value in the response variable
    const response = await fetch(
      "https://7yseqgoxea.execute-api.us-east-1.amazonaws.com/dev/fetch-customer-portfolio",
      requestOptions
    );
    //Throw an error if API returns an error
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }
    //Storing the raw json data returned by the API
    const stockList_raw = await response.json();
    //going 1 level down in the JSON response("clientPortfolio" is the head key for the response)
    const stockList = stockList_raw["clientPortfolio"];
    //looping through the parsed stockList, pushing the stock data as a row in the lyst variable
    for (var i = 0; i < stockList.length; i++) {
      lyst.push([
        stockList[i]["Symbol"],
        stockList[i]["Quantity"],
        stockList[i]["todays_close"],
        stockList[i]["percentage_difference"],
        stockList[i]["yesterdays_close"],
      ]);
      //Adding today's prices to the sum variable
      sum = sum + stockList[i]["Quantity"] * stockList[i]["todays_close"];
      //Adding yesterday's prices to the prevTotal variable
      prevTotal =
        prevTotal + stockList[i]["Quantity"] * stockList[i]["yesterdays_close"];
    }
    //storing the total(final) values of the sum and prevTotal variables.
    setSum(sum);
    setPrevtotal(prevTotal);

    arr = lyst; //store the lyst data in the arr variable, to be used for checks in the add, update, delete screens.

    //Looping through the list having stock data, pushing the rows into rows2 after modifications.
    for (i = 0; i < lyst.length; i++) {
      rows2.push(
        createData(
          lyst[i][0],
          lyst[i][1],
          lyst[i][2].toFixed(2),
          lyst[i][4].toFixed(2),
          lyst[i][3].toFixed(2),
          (lyst[i][1] * lyst[i][2]).toFixed(2)
        )
      );
    }
    //passing the data in rows2 to setRows function so that the screen re-renders if there is a change.
    setRows(rows2);
  }

  const classes = useStyles();
  // console.log(sum1.toFixed(2));
  // console.log("Rows:", rows);

  getData(); //calling the getData() function

  //Changing the colour of the G/L text to red if there is a loss
  if ((sum1 - prevTotal1).toFixed(2) < 0) {
    Datast2["color"] = "#EA421F";
  }
  // rendering the elements, will not have issues until messed with, ignore when debugging.
  return (
    <React.Fragment>
      <div style={headings}>
        <h1>Account Summary</h1>
      </div>
      <div style={content}>
        <table position="relative" margin="auto" width="500" border="0">
          <caption align="left">Your Balance Details:</caption>
          <br></br>
          <tr>
            <td align="Right">Advisor:</td>
            <td align="left">
              <text style={Datast}>AdvisorName Capital</text>
            </td>
          </tr>
          <tr>
            <td align="Right">Account:</td>
            <td align="left">
              <text style={Datast}>{user}</text>
            </td>
          </tr>
          <tr>
            <td align="Right">Account Balance:</td>
            <td align="left">
              <text style={Datast}>
                ${sum1.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </text>
            </td>
          </tr>
          <tr>
            <td align="Right">Today's G/L:</td>
            <td align="left">
              <text style={Datast2}>
                $
                {(sum1 - prevTotal1)
                  .toFixed(2)
                  .replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
              </text>
            </td>
          </tr>
        </table>
      </div>
      <div style={sliderPos}>
        <div id="body">
          <input
            id="chck"
            type="checkbox"
            defaultChecked={checked}
            onChange={handleClick}
          />
          <label for="chck" class="toggle">
            <span class="toggle-handler"></span>
          </label>
        </div>
      </div>
      <div>
        <div style={tableHeader}>
          <text>Portfolio Positions:</text>
        </div>
        <div style={table}>
          <Paper className={classes.root}>
            <Table className={classes.table} aria-label="caption table">
              <caption>Stock Prices</caption>
              <TableHead>
                <TableRow>
                  <TableCell align="left">Symbol</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Last Price</TableCell>
                  <TableCell align="right">Previous Close</TableCell>
                  <TableCell align="right">Change (%)</TableCell>
                  <TableCell align="right">Market Value</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell align="left" component="th" scope="row">
                      {row.Symbol}
                    </TableCell>
                    <TableCell align="right">{row.Quantity}</TableCell>
                    <TableCell align="right">
                      ${row.Last.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </TableCell>
                    <TableCell align="right">
                      ${row.Previous.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </TableCell>
                    <TableCell align="right">{row.Change}%</TableCell>
                    <TableCell align="right">
                      ${row.Value.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
          <div style={addStockButton}>
            <Button variant="outlined" color="default" onClick={handleClick4}>
              UPDATE STOCKS
            </Button>
            <Button variant="outlined" color="default" onClick={handleClick3}>
              DELETE STOCKS
            </Button>
            <Button variant="outlined" color="default" onClick={handleClick2}>
              ADD STOCKS +
            </Button>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
