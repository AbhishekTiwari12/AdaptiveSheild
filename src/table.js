import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";


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

function createData(Symbol, Quantity, Last, Previous, Change, Value) {
  return { Symbol, Quantity, Last, Previous, Change, Value };
}

export default function AcccessibleTable() {
  getData();
  var rows2 = [];
  const [rows,setRows] = React.useState([])
  const [sum1,setSum] = React.useState(0)
  var lyst = [];
  var sum = 0

  async function getData() {
    var requestOptions = {
      method: "POST",
      redirect: "follow",
    };

    const response = await fetch(
      "https://7yseqgoxea.execute-api.us-east-1.amazonaws.com/dev/fetch-customer-portfolio",
      requestOptions
    );
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    }

    const stockList_raw = await response.json();
    const stockList = stockList_raw["clientPortfolio"];
    for (var i = 0; i < stockList.length; i++) {
      lyst.push([
        stockList[i]["Symbol"],
        stockList[i]["Quantity"],
        stockList[i]["todays_close"],
        stockList[i]["percentage_difference"],
        stockList[i]["yesterdays_close"],
      ]);
      sum = sum +((stockList[i]["Quantity"]*stockList[i]["todays_close"]))
    }
    setSum(sum)
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
    setRows(rows2)
    console.log(lyst);
  }

  const classes = useStyles();
  console.log(sum1.toFixed(2))
  console.log("Rows:", rows);
  return (
    <Paper className={classes.root}>
            <Table className={classes.table} aria-label="caption table">
              
              <TableHead>
                <TableRow>
                  <TableCell align="left">Symbol</TableCell>
                  <TableCell align="right">Quantity</TableCell>
                  <TableCell align="right">Last</TableCell>
                  <TableCell align="right">Previous Close</TableCell>
                  <TableCell align="right">Change%</TableCell>
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
  );
}
