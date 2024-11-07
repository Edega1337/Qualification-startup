import React from 'react';
import { TextField, Button, Grid, Typography, Container, Paper, MenuItem } from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const TrainerAdForm = () => {
  const [selectedDate, setSelectedDate] = React.useState(null);

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} style={{ padding: '2rem', marginTop: '2rem' }}>
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
            >
              {/* Пример категорий */}
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
            />
          </Grid>

          {/* Фото */}
          <Grid item xs={12}>
            <Button variant="contained" component="label" fullWidth>
              Загрузить фото
              <input type="file" hidden />
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
            />
          </Grid>

          {/* Возможные даты */}
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

          {/* Местоположение */}
          <Grid item xs={12}>
            <TextField
              label="Местоположение"
              fullWidth
              variant="outlined"
              required
            />
          </Grid>

          {/* Опыт работы */}
          <Grid item xs={12}>
            <TextField
              label="Опыт работы (лет)"
              fullWidth
              variant="outlined"
              type="number"
            />
          </Grid>

          {/* Контактная информация */}
          <Grid item xs={12}>
            <TextField
              label="Контактная информация"
              fullWidth
              variant="outlined"
              required
            />
          </Grid>

          {/* Формат тренировки */}
          <Grid item xs={12}>
            <TextField
              label="Формат тренировки"
              fullWidth
              variant="outlined"
              select
              required
            >
              <MenuItem value="Индивидуальные">Индивидуальные</MenuItem>
              <MenuItem value="Групповые">Групповые</MenuItem>
              <MenuItem value="Онлайн">Онлайн</MenuItem>
            </TextField>
          </Grid>

          {/* Отзывы */}
          <Grid item xs={12}>
            <TextField
              label="Отзывы клиентов (опционально)"
              fullWidth
              variant="outlined"
              multiline
              rows={3}
            />
          </Grid>

          {/* Кнопка отправки */}
          <Grid item xs={12}>
            <Button variant="contained" color="primary" fullWidth size="large">
              Отправить анкету
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default TrainerAdForm;
