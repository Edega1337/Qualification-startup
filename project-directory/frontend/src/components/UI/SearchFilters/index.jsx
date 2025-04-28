// src/components/UI/SearchFilters.jsx

import React from "react";
import {
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
  Paper,
} from "@mui/material";
import { TRAINING_TYPES, PRICE_RANGES } from "../../../constans/constans";


const SearchFilters = ({ filters, onFilterChange }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        gap: 2,
        marginTop: 2,
        flexWrap: "wrap",
      }}
    >
      <FormControl sx={{ width: 200 }}>
        <InputLabel>Тип тренировки</InputLabel>
        <Select
          value={filters.typeOfTrening}
          label="Тип тренировки"
          onChange={(e) =>
            onFilterChange({ ...filters, typeOfTrening: e.target.value })
          }
        >
          <MenuItem value="">Все</MenuItem>
          {TRAINING_TYPES.map((type) => (
            <MenuItem key={type} value={type}>
              {type}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ width: 200 }}>
        <InputLabel>Цена</InputLabel>
        <Select
          value={filters.priceRangeLabel}
          label="Цена"
          onChange={(e) => {
            const range = PRICE_RANGES.find(
              (r) => r.label === e.target.value
            );
            onFilterChange({
              ...filters,
              priceRangeLabel: e.target.value,
              minPrice: range?.min,
              maxPrice: range?.max,
            });
          }}
        >
          <MenuItem value="">Любая</MenuItem>
          {PRICE_RANGES.map((range) => (
            <MenuItem key={range.label} value={range.label}>
              {range.label}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
};

export default SearchFilters;

