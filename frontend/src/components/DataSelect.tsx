import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

interface Props {
  labelText?: string;
}

const DataSelect = ({ labelText }: Props) => {
  return (
    <FormControl
      size="small"
      sx={
        {
          // minWidth: 160,
        }
      }
      error={false}
    >
      <InputLabel id="data-select-label">{labelText}</InputLabel>
      <Select label={labelText}>
        <MenuItem value={10}>Ten</MenuItem>
        <MenuItem value={20}>Twenty</MenuItem>
        <MenuItem value={30}>Thirty</MenuItem>
      </Select>
    </FormControl>
  );
};

export default DataSelect;
