import { useMemo, useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Container,
  Divider,
  Grid,
  LinearProgress,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { grey } from "@mui/material/colors";
import PriceCard from "./components/PriceCard";
import {
  PRICE_PER_BLOCK,
  BLOCKS_AMOUNT_FOR_HIGH_FEE,
  HIGH_FEE,
  LOW_FEE,
  COMMISSION_FEE_PERCENTAGE,
  BASE_VALUE_FOR_PERCENTAGE,
  REGEX_NUMBER_VALID,
} from "./utils/constants";

export default function App() {
  const [purchasePriceStr, setPurchasePriceStr] = useState<string>("0");
  const [commissionStr, setCommissionStr] = useState<string>("0");
  const [txFee, setTxFee] = useState<number>(0);
  const [totalDue, setTotalDue] = useState<number>(0);
  const [keepPercentage, setKeepPercentage] = useState<number>(0);

  const purchasePrice = useMemo(
    () => Number(purchasePriceStr),
    [purchasePriceStr]
  );
  const commission = useMemo(() => Number(commissionStr), [commissionStr]);

  const handleCalculation = () => {
    let _txFee = 0;
    let _totalDue = 0;
    let _keepPercentage = 0;
    let totalBlocksAmount = Math.ceil(purchasePrice / PRICE_PER_BLOCK);

    if (totalBlocksAmount >= 1) {
      const hFeeBlocksAmount =
        BLOCKS_AMOUNT_FOR_HIGH_FEE > totalBlocksAmount
          ? totalBlocksAmount
          : BLOCKS_AMOUNT_FOR_HIGH_FEE;
      const lFeeBlocksAmount =
        totalBlocksAmount > hFeeBlocksAmount
          ? totalBlocksAmount - hFeeBlocksAmount
          : 0;

      _txFee =
        hFeeBlocksAmount * HIGH_FEE +
        lFeeBlocksAmount * LOW_FEE +
        commission * COMMISSION_FEE_PERCENTAGE;
    }

    _totalDue = commission - _txFee;

    _keepPercentage =
      (_totalDue / (commission > 0 ? commission : 1)) *
      BASE_VALUE_FOR_PERCENTAGE;

    setTxFee(_txFee);
    setTotalDue(_totalDue);
    setKeepPercentage(_keepPercentage);
  };

  return (
    <Stack
      minWidth="100vw"
      minHeight="100vh"
      justifyContent="center"
      alignItems="center"
      bgcolor={grey[100]}
    >
      <Container>
        <Card>
          <CardContent>
            <Grid container spacing={4}>
              <Grid
                item
                xs={12}
                md={5}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "space-between",
                  gap: 4,
                }}
              >
                <Stack spacing={2}>
                  <TextField
                    label="Purchase Price"
                    onChange={(e) => {
                      if (e.target.value.match(REGEX_NUMBER_VALID)) {
                        setPurchasePriceStr(e.target.value);
                      }
                    }}
                    value={purchasePriceStr}
                  />
                  <TextField
                    label="Estimated commission"
                    onChange={(e) => {
                      if (e.target.value.match(REGEX_NUMBER_VALID)) {
                        setCommissionStr(e.target.value);
                      }
                    }}
                    value={commissionStr}
                  />
                </Stack>

                <Button variant="contained" onClick={handleCalculation}>
                  Calculate
                </Button>
              </Grid>

              <Grid
                item
                xs={12}
                md={7}
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 6,
                }}
              >
                <Grid container spacing={4}>
                  <Grid item xs={12} md={6}>
                    <PriceCard title="Transaction Fee" value={txFee} />
                  </Grid>
                  <Grid item xs={12} md={6}>
                    <PriceCard title="Total Due" value={totalDue} />
                  </Grid>
                </Grid>
                <Divider />
                <Stack alignItems="start" spacing={1}>
                  <Typography>
                    You keep{" "}
                    {keepPercentage !== Infinity
                      ? keepPercentage.toFixed(2)
                      : 0}
                    %.
                  </Typography>
                  <LinearProgress
                    variant="determinate"
                    sx={{ height: 10, width: "100%" }}
                    value={keepPercentage}
                  />
                </Stack>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      </Container>
    </Stack>
  );
}
