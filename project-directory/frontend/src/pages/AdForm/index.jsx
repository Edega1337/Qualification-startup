import { React, useState } from 'react';
import { TextField, Button, Grid, Typography, Container, Paper, MenuItem } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const TrainerAdForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [trainingType, setTrainingType] = useState('Фитнес');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [photo, setPhoto] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('title', title);
    formData.append('trainingType', trainingType);
    formData.append('description', description);
    formData.append('price', price);
    if (photo) formData.append('photo', photo);
    if (selectedDate) formData.append('selectedDate', selectedDate.toISOString());

    onSubmit(formData);
  };
  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '2rem', marginTop: '2rem' }} component="form" onSubmit={handleSubmit}>
        <Typography variant="h5" align="center" gutterBottom>
          Создать объявление тренера
        </Typography>
        <Grid container spacing={2}>
          {/* Название */}
          <Grid item xs={12}>
            <TextField
              label="Название"
              fullWidth
              variant="outlined"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Grid>

          {/* Вид тренировки */}
          <Grid item xs={12}>
            <TextField
              label="Вид тренировки/спорта"
              fullWidth
              variant="outlined"
              required
              select
              value={trainingType}
              onChange={(e) => setTrainingType(e.target.value)}
            >
              <MenuItem value="Фитнес">Фитнес</MenuItem>
              <MenuItem value="Йога">Йога</MenuItem>
              <MenuItem value="Боевые искусства">Боевые искусства</MenuItem>
              <MenuItem value="Плавание">Плавание</MenuItem>
            </TextField>
          </Grid>

          {/* Описание */}
          <Grid item xs={12}>
            <TextField
              label="Описание"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Grid>

          {/* Фото */}
          <Grid item xs={12}>
            <Button variant="contained" component="label" fullWidth>
              Загрузить фото
              <input type="file" hidden onChange={(e) => setPhoto(e.target.files[0])} />
            </Button>
          </Grid>

          {/* Цена */}
          <Grid item xs={12}>
            <TextField
              label="Цена за занятие (руб.)"
              fullWidth
              variant="outlined"
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Grid>

          {/* Дата */}
          <Grid item xs={12}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Возможные даты"
                value={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
              />
            </LocalizationProvider>
          </Grid>

          {/* Кнопка отправки */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth size="large">
              Отправить анкету
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default TrainerAdForm;
