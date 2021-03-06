import React from "react";
// import VerticalSlider from "./Slider";
import { Button } from "@material-ui/core";
import { useHistory } from "react-router-dom";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import data2 from "./quotes.json";
import Loader from "react-loader-spinner";

const useStyles = makeStyles((theme) => ({
  root: {
    width: 200 + theme.spacing(3) * 2,
  },
  margin: {
    height: theme.spacing(3),
  },
}));

const SliderF = withStyles({
  root: {
    color: "#52af77",
    height: 8,
  },
  thumb: {
    height: 20,
    width: 20,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: 0,
    marginLeft: 0,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {},
  valueLabel: {
    left: "calc(-75% + 4px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
    width: "8px !important",
  },
  rail: {
    height: 8,
    width: "8px !important",
    borderRadius: 4,
  },
})(Slider);
//Defining global variables that will be passed on to next screen as stats
var shieldP = 0;
var shieldPeriod = "";
var shieldPercentage = 0.15;

//Function to send the shield price, percentage and protection period to other screens
export function sendPrice() {
  var price = shieldP;
  var period = shieldPeriod;
  var percent = shieldPercentage;
  var protection = 100 - percent;
  return [price, period, percent, protection];
}

//Function to fetch data form the api and facilitiate quote price calculation
export default function ShieldSetup() {
  // getData();
  //using react hooks to facilitate navigation between screens
  const history = useHistory();
  const handleClickConfirm = () => history.push("/ConfirmationScreen");
  const handleClickBack = () => history.push("/");
  //selected variable stores the selected protection period, and the setName function re-renders the screen upon a new selection.
  const [selected, setName] = React.useState("Month");
  //quote variable stores the current shield price
  const [quote, setPrice] = React.useState(0);
  //diy variable stores the current DIY price
  const [diy, setDiy] = React.useState(0);
  const [prcPort, setPrc] = React.useState(0);
  //data variable stores the json data received by the API
  var [data, setData] = React.useState(data2);
  const [diyPer, setDiyPer] = React.useState(0);

  //function to handle selcted radio buttons
  // re-renders the screen whenever a new radio-button is selected
  const handleChange = (event) => {
    setName(event.target.value);
  };

  //function to re-render the screen and store the fetched shield price in quote variable.
  const handleChange2 = (value) => {
    setPrice(value);
  };
  const handleChange3 = (value) => {
    setPrc(value);
  };
  //function to re-render the screen and store the fetched DIY price in diy variable.
  const handleChange4 = (value) => {
    setDiy(value);
  };
  //val variable to store the selected protection precent.
  var val = 0;
  //marks2 variable to store the percentages at which the slider has to stick
  var marks2 = [];

  //flag variable to control the flow of the screen.
  //if false => render loading screen.
  //if true => render shield setup screen.
  const [flag, setFlag] = React.useState(false);

  //async function to fetch data from the API
  async function getData() {
    var requestOptions = {
      method: "POST",
      redirect: "follow",
    };
    //making the request with defined options and storing the result in reposnse variable.
    const response = await fetch(
      "https://7yseqgoxea.execute-api.us-east-1.amazonaws.com/dev/quote-engine",
      requestOptions
    );
    //Throwing an error if the API returns an error
    if (!response.ok) {
      const message = `An error has occured: ${response.status}`;
      throw new Error(message);
    } else {
      //if the call is successful, store the data in json format
      const data_local = await response.json();
      setData(data_local);
      // console.log("data:", data);

      setFlag(true); //setting the flag to true.
    }
  }
  //function to get the selected the protection and level and fetch the price based on it.
  function valuetext(value) {
    //calculate only if flag is true
    if (flag === true) {
      //restricting the value to 2 decimal points, as the keys are 2 decimal points.
      val = +(100 - value).toFixed(2).toString();
      //calling the fetch_price function passing selected protection period and percentage as parameters.
      fetch_price(selected, val);
      // return `${(100-value).toFixed(2)}`;
    }
  }
  //function to get the required price from the data.
  async function fetch_price(period = "Daily", percent = "3.00") {
    if (flag === true) {
      //if selecetd period == day, getting prices for the day.
      if (period === "Daily") {
        var tp = data["day"];
        shieldPeriod = "1 Day"; //assigning value to shieldPeriod variable, will be sent to other screens.

        //if selecetd period == day, getting prices for the day.
      } else if (period === "Day") {
        tp = data["day"];
        shieldPeriod = "1 Day"; //assigning value to shieldPeriod variable, will be sent to other screens.

        //if selected period == week, getting prices for week.
      } else if (period === "Week") {
        tp = data["week"];
        shieldPeriod = "1 Week"; //assigning value to shieldPeriod variable, will be sent to other screens.

        //if selected period is month, getting prices for the month.
      } else if (period === "Month") {
        tp = data["month"];
        shieldPeriod = "1 Month"; //assigning value to shieldPeriod variable, will be sent to other screens.

        //if selected period == year, geting prices for the year.
      } else {
        tp = data["year"];
        shieldPeriod = "1 Year"; //assigning value to shieldPeriod variable, will be sent to other screens.
      }

      var tp2 = Object.keys(tp);
      marks2.length = 0;
      //setting marks for the slider to stick on, based on the api response
      for (var i = 0; i < tp2.length; i++) {
        marks2.push({
          value: 100 - parseFloat(tp2[i]).toFixed(2),
        });
      }
      // console.log("marks2:", marks2);
      // // console.log(tp);
      // console.log("tp:", tp[percent]);

      //setting default percenatge
      if (percent === "0.00" || percent === 0 || percent === 0.15) {
        percent = (100 - marks2[marks2.length - 1]["value"]).toFixed(2); //fetching the highest percent value
        handleChange2(tp[percent]["shield_price"].toFixed(2)); //fetching the shield price for that percentage
        handleChange3(
          tp[percent]["percentage_portfolio_market_value"].toFixed(3) // fetching the percentage of portfolio for the value.
        );
        handleChange4(tp[percent]["diy_price"].toFixed(2)); //fetching the diy price for the percentage
        setDiyPer(tp[percent]["diy_percentage"].toFixed(3)); //fetching the percentage of portfolio for the DIY value.
        shieldP = tp[percent]["shield_price"].toFixed(2); //assisgning the shield price to export variable
        shieldPercentage = percent; //assigning the percentage to export variable.
      } else if (percent === "3.00" || percent === 3) {
        handleChange2(0);
        handleChange3(0);
      } else {
        handleChange2(tp[percent]["shield_price"].toFixed(2));
        handleChange3(
          tp[percent]["percentage_portfolio_market_value"].toFixed(3)
        );
        handleChange4(tp[percent]["diy_price"].toFixed(2));
        setDiyPer(tp[percent]["diy_percentage"].toFixed(3));
        shieldP = tp[percent]["shield_price"].toFixed(2);
        shieldPercentage = percent;
      }
    }
  }
  //css for different elements on the screen
  const classes = useStyles();
  const slider_style = {
    paddingTop: 30,
    marginRight: 30,
    height: 220,
    width: "40px !important",
    color: "#52af77",
  };

  const headings = {
    marginTop: -20,
    fontSize: 15,
    textAlign: "center",
    color: "#000000",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    background: "rgba(232, 236, 241, 0.3)",
  };
  const leftdiv = {
    color: "#000000",
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    textAlign: "center",
  };
  const rightdiv = {
    color: "#000000",
    fontSize: 20,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontWeight: "bold",
  };
  const radios = {
    marginTop: 30,
    color: "#000000",
    fontSize: 22,
    marginLeft: 80,
    textAlign: "left",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  };

  const slider = {
    paddingTop: 15,
    paddingLeft: 30,
  };
  const confirmButton = {
    paddingTop: 70,
    textAlign: "center",
    width: 300,
    margin: "auto",
  };
  const backButton = {
    paddingTop: 20,
    margin: "auto",
    textAlign: "center",
    width: 300,
  };
  const cost = {
    paddingTop: 90,
    textAlign: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: 30,
    fontWeight: "bold",
    color: "#000000",
  };
  const DIYcost = {
    paddingTop: 20,
    textAlign: "center",
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    fontSize: 23,
    fontWeight: "normal",
    color: "#000000",
  };
  const loader = {
    position: "relative",
    margin: "auto",
    marginTop: 350,
    width: 120,
  };

  const tableDesign = {
    width: 550,
    position: "relative",
    margin: "auto",
    textAlign: "center",
  };

  const percentageStyles = {
    paddingTop: 30,
    paddingLeft: 0,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };
  const percentageStylesBottom = {
    paddingTop: 10,
    paddingLeft: 0,
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };

  //rendering the loading screen if the API has not been resolved yet.
  if (flag == false) {
    getData();
    fetch_price();
    return (
      <div style={loader}>
        <Loader
          type="Puff"
          color="#00BFFF"
          height={100}
          width={100}
          timeout={12000} //12 secs
        />
      </div>
    );
  } else {
    //rendering the shield setup screen if the api is resolved
    return (
      <div>
        <div>
          <div style={headings}>
            <h1>Adaptive Shield Setup</h1>
          </div>
          <div style={tableDesign}>
            <table position="relative" margin="auto" width="600">
              <tr align="center">
                <td>
                  <text style={leftdiv}>Protection Period:</text>
                </td>
                <td>
                  <text style={leftdiv}>Protection Level:</text>
                </td>
              </tr>
              <tr>
                <td>
                  <div style={radios}>
                    <input
                      type="radio"
                      value="Day"
                      name="time"
                      checked={selected === "Day"}
                      onChange={handleChange}
                    />{" "}
                    Day<br></br>
                    <br></br>
                    <br></br>
                    <input
                      type="radio"
                      value="Week"
                      name="time"
                      checked={selected === "Week"}
                      onChange={handleChange}
                    />{" "}
                    Week<br></br>
                    <br></br>
                    <br></br>
                    <input
                      type="radio"
                      value="Month"
                      name="time"
                      checked={selected === "Month"}
                      onChange={handleChange}
                    />{" "}
                    Month<br></br>
                    <br></br>
                    <br></br>
                    <input
                      type="radio"
                      value="Year"
                      name="time"
                      checked={selected === "Year"}
                      onChange={handleChange}
                    />{" "}
                    Year<br></br>
                  </div>
                </td>
                <td>
                  <div style={percentageStyles}>
                    <text>100%</text>
                  </div>
                  <div
                    className={classes.root}
                    style={{ height: 240, paddingTop: 20, paddingLeft: 50 }}
                  >
                    <SliderF
                      orientation="vertical"
                      min={80}
                      getAriaValueText={valuetext}
                      defaultValue={99.85}
                      aria-labelledby="vertical-slider"
                      step={null}
                      marks={marks2}
                      valueLabelDisplay="auto"
                      // onChange={valuetext}
                      // onChangeCommitted={valuetext}
                    />
                  </div>
                  <div style={percentageStylesBottom}>
                    <text>80%</text>
                  </div>
                  <br></br>
                  <text
                    style={{
                      fontFamily:
                        "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
                      marginLeft: -10,
                    }}
                  >
                    Chosen Level: {(100 - shieldPercentage).toFixed(2)}%
                  </text>
                </td>
              </tr>
            </table>
          </div>

          <div style={cost}>
            <text>
              Shield Quote: ${quote} / {selected} ({prcPort}%)
            </text>
          </div>
          <div style={DIYcost}>
            <text>
              Estimated DIY Cost: ${diy} / {selected} ({diyPer}%)
            </text>
          </div>
          <div style={confirmButton}>
            <Button
              variant="contained"
              color="default"
              fullWidth="True"
              onClick={handleClickConfirm}
            >
              CONFIRM
            </Button>
          </div>
          <div style={backButton}>
            <Button
              variant="contained"
              color=""
              fullWidth="True"
              onClick={handleClickBack}
            >
              GO BACK
            </Button>
          </div>
        </div>
      </div>
    );
  }
}
