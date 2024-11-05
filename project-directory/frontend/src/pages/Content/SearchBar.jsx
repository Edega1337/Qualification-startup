import React, { useState } from 'react';
import {
  TextField,
  Button,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';

const SearchBar = () => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div style={{ display: 'flex', alignItems: 'center' }}>
      <TextField
        variant="outlined"
        placeholder="Поиск по объявлениям"
        style={{ flexGrow: 1 }}
      />
      <Button variant="contained" color="primary" style={{ marginLeft: '8px' }}>
        Найти
      </Button>
      <IconButton onClick={handleOpen} style={{ marginLeft: '8px' }}>
        <MenuIcon />
      </IconButton>

      {/* Modal for Search Settings */}
      <Dialog open={open} onClose={handleClose} fullWidth>
        <DialogTitle>Настройки поиска</DialogTitle>
        <DialogContent>
          <Typography>Здесь вы можете добавить фильтры и параметры для поиска</Typography>
          {/* Добавьте здесь элементы управления для фильтров, такие как чекбоксы, переключатели, поля ввода и т.д. */}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Закрыть
          </Button>
          <Button onClick={handleClose} color="primary">
            Применить
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default SearchBar;
