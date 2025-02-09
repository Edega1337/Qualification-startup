import React, { useState, useEffect } from 'react';
import {
  Avatar, Box, Button, Typography, Link, Rating, Modal, Grid, TextField, MenuItem, Paper, Card, CardContent, CardMedia, Chip, Divider,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { LocalizationProvider, DatePicker, PickersDay } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useQuery } from '@tanstack/react-query';
import { currentUserService, sendAdService } from '../../services';
import UpSideBar from '../../components/UI/UpSideBar';

const ProfilePage = () => {
  const [open, setOpen] = useState(false);
  const [trainingType, setTrainingType] = useState("Фитнес");
  const [selectedDate, setSelectedDate] = useState(null);

  // States for form fields
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [photo, setPhoto] = useState(null);

  const [notification, setNotification] = useState({
    open: false,
    message: '',
  });

  // Эффект для автоматического скрытия уведомления
  useEffect(() => {
    if (notification.open) {
      const timer = setTimeout(() => {
        setNotification({ ...notification, open: false });
      }, 3000); // Уведомление исчезнет через 3 секунды

      return () => clearTimeout(timer); // Очистка таймера при размонтировании компонента
    }
  }, [notification]);

  // Запрос данных профиля пользователя
  const getProfile = async () => {
    try {
      const result = await currentUserService();
      console.log("Результат получения профиля пользователя.", result);
      return result;
    } catch (err) {
      console.error(err);
    }
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });


  if (isLoading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error.message}</p>;

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const sendUserAdForm = async () => {
    const formData = new FormData();

    // Добавляем данные в formData
    formData.append('title', title);
    formData.append('trainingType', trainingType);
    formData.append('description', description);
    formData.append('price', price);

    // Если фото загружено, добавляем его
    if (photo) {
      formData.append('photo', photo);
    }

    // Добавляем дату, если она выбрана
    if (selectedDate) {
      formData.append('selectedDate', selectedDate.toISOString()); // Преобразуем дату в ISO строку
    }

    try {
      // Отправляем данные через сервис
      const result = await sendAdService(formData);
      console.log('Результат отправления', result);

      // Показываем уведомление
      setNotification({
        open: true,
        message: 'Ваше объявление успешно размещено и находится на рассмотрении.',
      });

      handleClose(); // Закрываем модальное окно после отправки
    } catch (error) {
      console.error('Ошибка отправки формы:', error);
      setNotification({
        open: true,
        message: 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте снова.',
      });
    }
  };
  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', padding: 4, maxWidth: 1400, margin: '0 auto', gap: 4 }}>
      <UpSideBar />

      <Grid container spacing={3}>
        {/* Левая панель с профилем */}
        <Grid item xs={12} md={4}>
          <Paper elevation={3} sx={{ padding: 3, textAlign: 'center' }}>
            <Avatar src="your-image-url" sx={{ width: 120, height: 120, margin: '0 auto' }} />
            <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>{data.login}</Typography>
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
              <Rating value={0} readOnly />
              <Link href="#" sx={{ marginLeft: 1, fontSize: 14 }}>Нет отзывов</Link>
            </Box>
          </Paper>
        </Grid>

        {/* Правая панель с объявлениями */}
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ padding: 3 }}>
            <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Мои объявления</Typography>
            <Button variant="contained" color="primary" fullWidth sx={{ mb: 3 }} onClick={() => setOpen(true)}>
              Разместить объявление
            </Button>
            <Divider sx={{ mb: 2 }} />
            <Grid container spacing={3}>
              {data.ads.map((ad, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card>
                    {ad.photo && <CardMedia component="img" height="140" image={ad.photo} alt={ad.title} />}
                    <CardContent>
                      <Typography variant="h6">{ad.name}</Typography> {/* Исправлено с ad.title на ad.name */}
                      <Chip label={ad.typeOfTrening} color="primary" size="small" sx={{ my: 1 }} /> {/* Исправлено с ad.trainingType на ad.typeOfTrening */}
                      <Typography variant="body2">{ad.description}</Typography>
                      <Typography variant="h6" sx={{ mt: 1 }}>{ad.price} руб.</Typography>
                      <Typography variant="body2">Дата: {new Date(ad.date).toLocaleDateString()}</Typography> {/* Исправлено с ad.selectedDate на ad.date */}
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>
      </Grid>

      {/* Модальное окно */}
      {/* Модальное окно для размещения объявления */}
      <Modal open={open} onClose={handleClose}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: '90%',
            maxWidth: 400,
            bgcolor: 'background.paper',
            borderRadius: 2,
            boxShadow: 24,
            p: 3,
            maxHeight: '80vh',
            overflowY: 'auto',
          }}
        >
          <Paper elevation={3} sx={{ padding: '1.5rem' }}>
            <Typography variant="h6" align="center" gutterBottom>
              Опубликовать объявление тренера
            </Typography>
            <Grid container spacing={1.5}>
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
              <Grid item xs={12}>
                <TextField
                  label="Вид тренировки/спорта"
                  fullWidth
                  variant="outlined"
                  select
                  required
                  value={trainingType}
                  onChange={(e) => setTrainingType(e.target.value)}
                >
                  <MenuItem value="Фитнес">Фитнес</MenuItem>
                  <MenuItem value="Йога">Йога</MenuItem>
                  <MenuItem value="Боевые искусства">Боевые искусства</MenuItem>
                  <MenuItem value="Плавание">Плавание</MenuItem>
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Описание"
                  fullWidth
                  variant="outlined"
                  multiline
                  rows={3}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  component="label"
                  fullWidth
                >
                  Загрузить фото
                  <input
                    type="file"
                    hidden
                    onChange={(e) => setPhoto(e.target.files[0])}
                  />
                </Button>
              </Grid>
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
              <Grid item xs={12}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Возможные даты"
                    value={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    renderDay={(day, selectedDates, pickersDayProps) => {
                      const { key, ...restProps } = pickersDayProps;
                      return <PickersDay key={key} {...restProps} />;
                    }}
                    renderInput={(params) => <TextField {...params} fullWidth variant="outlined" />}
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  onClick={sendUserAdForm}
                >
                  Отправить анкету
                </Button>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProfilePage;
