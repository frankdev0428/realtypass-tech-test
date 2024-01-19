import { Card, CardContent, Stack, Typography } from "@mui/material";

interface IProps {
  title: string;
  value: number;
  sx?: object;
}

export default function PriceCard({ title, value, sx }: IProps) {
  return (
    <Stack
      alignItems="center"
      spacing={2}
      sx={{ overflowWrap: "break-word", ...sx }}
    >
      <Typography>{title}</Typography>
      <Card sx={{ width: "100%" }}>
        <CardContent>
          <Typography textAlign="center" fontSize={24}>
            ${value.toFixed(2)}
          </Typography>
        </CardContent>
      </Card>
    </Stack>
  );
}
