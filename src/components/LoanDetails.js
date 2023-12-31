import React, { useState } from "react";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Checkbox from "@mui/material/Checkbox";
import { Box } from "@mui/material";

import "./LoanDetails.scss";

const LoanDetails = (props) => {
  const [payoutOptn, setPayoutOpt] = useState("all-payout");
  const [allPayoutInput, setAllPayoutInput] = useState("");
  const [error, setError] = useState("");

  const { jsonData, setJsonData, setFinalArr } = props;

  const selectPayoutOpt = (e) => {
    setPayoutOpt(e.target.value);
    if (e.target.value !== "all-payout") {
      const updatedData = jsonData.map((dta) => {
        if (!dta.checked) {
          return { ...dta, amount: "" };
        }
        return dta;
      });
      setJsonData(updatedData);
    } else {
      setAllPayoutInput("");
    }
  };

  const getFinalData = (updatedData) => {
    const finalDta = updatedData
      .filter((dta) => {
        return dta.checked;
      })
      .map((filterDta) => {
        return {
          sub_product_id: filterDta.id,
          percentage: filterDta.amount === "" ? 0 : parseInt(filterDta.amount),
        };
      });
      console.log(finalDta)
    setFinalArr(finalDta);
  };

  const selectAllCat = (e) => {
    const updatedData = jsonData.map((dta) => {
      return { ...dta, checked: e.target.checked };
    });
    setJsonData(updatedData);
    getFinalData(updatedData);
  };

  const selectSingleCat = (e, id) => {
    const updatedData = jsonData.map((dta) => {
      if (id === dta.id) {
        return { ...dta, checked: e.target.checked };
      }
      return dta;
    });
    setJsonData(updatedData);
    getFinalData(updatedData);
  };
  const allCatCheck = () => {
    const checkedAll = jsonData.filter((dta) => {
      return dta.checked;
    });
    if (checkedAll.length === jsonData.length) {
      return 2;
    } else if (checkedAll.length > 0) {
      return 1;
    }
    return 0;
  };

  const allPayout = (e) => {
    const value = e.target.value;
    if (value <= 10) {
      const updatedData = jsonData.map((dta) => {
        return { ...dta, amount: value };
      });
      setError("");
      setJsonData(updatedData);
      setAllPayoutInput(value);
    } else if (value > 10) {
      setAllPayoutInput(value);
      setError("Please enter % upto 10.");
    }
  };

  const selectedPayout = (e, id) => {
    const value = e.target.value;
    if (value <= 100) {
      const updatedData = jsonData.map((dta) => {
        if (id === dta.id) {
          return { ...dta, amount: value };
        }
        return dta;
      });
      setJsonData(updatedData);
    }
  };

  const FieldsDisplay = () => (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        overflowY: "auto",
      }}
    >
      {jsonData.map((dta) => {
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              margin: "2px",
            }}
            key={dta.id}
          >
            <FormControlLabel
              label={dta.category_name}
              control={
                <Checkbox
                  checked={dta.checked}
                  size="small"
                  onChange={(e) => selectSingleCat(e, dta.id)}
                />
              }
            />
            <span
              style={{
                display: "flex",
                alignItems: "center",
              }}
            >
              <TextField
                id="outlined-basic"
                sx={{
                  width: "60px",
                  marginRight: "5px",
                  textAlign: "center",
                  backgroundColor: payoutOptn === "all-payout" ? "#f2f2f2" : "",
                }}
                size="small"
                variant="outlined"
                disabled={payoutOptn === "all-payout"}
                value={dta.amount}
                onChange={(e) => selectedPayout(e, dta.id)}
              />
              <span>%</span>
            </span>
          </Box>
        );
      })}
    </Box>
  );

  return (
    <main className="product-main">
      <FormControl
        sx={{ width: "100%", display: "flex", justifyContent: "space-between" }}
      >
        <Box sx={{ minHeight: "130px" }}>
          <RadioGroup
            aria-labelledby="demo-radio-buttons-group-label"
            defaultValue="all-payout"
            name="payout-option"
            onChange={(e) => {
              selectPayoutOpt(e);
            }}
          >
            <FormControlLabel
              value="all-payout"
              control={<Radio size="small" color="default" />}
              label="Set Flat payout % for all sub-products"
            />
            <FormControlLabel
              value="single-payout"
              control={<Radio size="small" color="default" />}
              label="Set payout % per sub-products"
            />
          </RadioGroup>
          {
            <Box
              sx={{
                display: payoutOptn === "all-payout" ? "flex" : "none",
                justifyContent: "space-between",
                alignItems: "center",
                margin: "5px",
              }}
            >
              <label>Enter Flat Payout</label>
              <span
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <TextField
                  id="outlined-basic"
                  sx={{
                    width: "60px",
                    marginRight: "5px",
                    textAlign: "center",
                  }}
                  size="small"
                  variant="outlined"
                  value={allPayoutInput}
                  onChange={(e) => allPayout(e)}
                />
                <span>%</span>
              </span>
            </Box>
          }
        </Box>
        <p className={{error}? "error-text": "hide-error"}>{error}</p>
        <div
          style={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "start"
          }}
        >
          <div className="product-header">
            <label>Sub Products</label>
            <label>Payout %</label>
          </div>
          <FormControlLabel
            label="Select All"
            control={
              <Checkbox
                size="small"
                checked={allCatCheck() === 2}
                indeterminate={allCatCheck() === 1}
                onChange={(e) => selectAllCat(e)}
                sx={{ margin: "2px" }}
              />
            }
          />
          {FieldsDisplay()}
        </div>
      </FormControl>
    </main>
  );
};

export default LoanDetails;
