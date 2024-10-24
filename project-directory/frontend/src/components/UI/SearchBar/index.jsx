import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, Select, MenuItem, TextField, Button, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  div: {
    width: 'auto',
    height: 'auto',
    display: 'flex',
    justifyContent: 'center',
    gap: '1vw',
    // marginLeft: '20vw',
  }
}));

const SearchBar = ({ onSearch }) => {
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState('');
  const [optionsA, setOptionsA] = useState([]);
  const [optionsB, setOptionsB] = useState([]);
  const [selectedOptionA, setSelectedOptionA] = useState('');
  const [selectedOptionB, setSelectedOptionB] = useState('');

  // Получение данных для выпадающих списков из backend
  useEffect(() => {
    const fetchOptionsA = async () => {
      const response = await fetch('/api/optionsA'); // URL вашего API
      const data = await response.json();
      setOptionsA(data);
    };

    const fetchOptionsB = async () => {
      const response = await fetch('/api/optionsB'); // URL вашего API
      const data = await response.json();
      setOptionsB(data);
    };

    fetchOptionsA();
    fetchOptionsB();
  }, []);

  const handleSearch = () => {
    onSearch({ searchTerm, selectedOptionA, selectedOptionB });
  };

  return (
    <div className={classes.div}>
      <TextField
        placeholder="Поиск"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className={classes.TextField}
      />
      <Button
        variant="contained"
        onClick={handleSearch}
        className={classes.Button}
      >
        Найти
      </Button>
    </div>
  );
};

export default SearchBar;
