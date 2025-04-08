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
import UserInfo from '../Profile/UserInfo';

const ProfilePage = () => {
  const [openAdModal, setOpenAdModal] = useState(false); // Для модального окна объявления
  const [openProfileModal, setOpenProfileModal] = useState(false); // Для модального окна профиля
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Состояние авторизации

  // Состояния для формы
  const [trainingType, setTrainingType] = useState("Фитнес");
  const [selectedDate, setSelectedDate] = useState(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [photo, setPhoto] = useState(null);

  // Функции для управления модальными окнами
  const handleOpenAdModal = () => setOpenAdModal(true);
  const handleCloseAdModal = () => setOpenAdModal(false);

  const handleOpenProfileModal = () => setOpenProfileModal(true);
  const handleCloseProfileModal = () => setOpenProfileModal(false);

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
      setIsAuthenticated(true); // Устанавливаем, что пользователь авторизован
      return result;
    } catch (err) {
      console.error(err);
      setIsAuthenticated(false); // Устанавливаем, что пользователь не авторизован
      throw err; // Пробрасываем ошибку, чтобы useQuery мог её обработать
    }
  };

  const { data, error, isLoading } = useQuery({
    queryKey: ['profile'],
    queryFn: getProfile,
  });

  if (isLoading) return <p>Загрузка...</p>;
  if (error) return <p>Ошибка: {error.message}</p>;

  const sendUserAdForm = async () => {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('trainingType', trainingType);
    formData.append('description', description);
    formData.append('price', price);

    if (photo) {
      formData.append('photo', photo);
    }

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

      handleCloseAdModal(); // Закрываем модальное окно после отправки
    } catch (error) {
      console.error('Ошибка отправки формы:', error);
      setNotification({
        open: true,
        message: 'Произошла ошибка при отправке формы. Пожалуйста, попробуйте снова.',
      });
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'row', padding: '5em', maxWidth: 1400, margin: '0 auto', gap: 4 }}>
      <UpSideBar />

      {!isAuthenticated ? (
        <Box sx={{ flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Paper elevation={3} sx={{ padding: '2rem', textAlign: 'center' }}>
            <Typography variant="h5" sx={{ mb: 2 }}>Вы не авторизованы</Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>Пожалуйста, авторизуйтесь, чтобы получить доступ к вашему профилю.</Typography>
            <Button variant="contained" color="primary" href="/login">Войти</Button>
          </Paper>
        </Box>
      ) : (
        <Grid container spacing={3} sx={{ display: 'flex', flexDirection: 'row', flexWrap: 'nowrap' }}>
          <UserInfo userData={data} />
          <Grid item xs={12} md={8} sx={{ display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
            <Paper elevation={3} sx={{ padding: 3 }}>
              <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2 }}>Мои объявления</Typography>
              <Button variant="contained" color="primary" fullWidth sx={{ mb: 3 }} onClick={handleOpenAdModal}>
                Разместить объявление
              </Button>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 2, width: '100%' }}>
                {data.ads.length ? data.ads.map((ad, index) => (
                  <Card key={index} sx={{ width: '100%', maxWidth: 300, flex: '1 1 auto' }}>
                    {ad.photo && <CardMedia component="img" sx={{ height: 140, objectFit: 'contain' }} image={ad.photo} alt={ad.title} />}
                    <CardContent>
                      <Typography variant="h6" sx={{ fontSize: '1rem' }}>{ad.name}</Typography>
                      <Chip label={ad.typeOfTrening} color="primary" size="small" sx={{ my: 1, fontSize: '0.75rem' }} />
                      <Typography variant="body2" sx={{ fontSize: '0.85rem' }}>{ad.description}</Typography>
                      <Typography variant="h6" sx={{ mt: 1, fontSize: '0.9rem' }}>{ad.price} руб.</Typography>
                      <Typography variant="body2" sx={{ fontSize: '0.8rem' }}>Дата: {new Date(ad.date).toLocaleDateString()}</Typography>
                    </CardContent>
                  </Card>
                )) : (
                  <Typography>Объявлений пока нет. Разместите первое.</Typography>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>
      )}

      <Modal open={openAdModal} onClose={handleCloseAdModal}>
        <Box sx={{
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
        }}>
          <Paper elevation={3} sx={{ padding: '1.5rem' }}>
            <Typography variant="h6" align="center" gutterBottom>
              Опубликовать объявление тренера
            </Typography>
            <Grid container spacing={1.5}>
              <Grid item xs={12}>
                <TextField label="Название" fullWidth variant="outlined" required value={title} onChange={(e) => setTitle(e.target.value)} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Вид тренировки/спорта" fullWidth variant="outlined" select required value={trainingType} onChange={(e) => setTrainingType(e.target.value)}>
                  <MenuItem value="Фитнес">Фитнес</MenuItem>
                  <MenuItem value="Йога">Йога</MenuItem>
                  <MenuItem value="Боевые искусства">Боевые искусства</MenuItem>
                  <MenuItem value="Плавание">Плавание</MenuItem>
                </TextField>
              </Grid>
            </Grid>
          </Paper>
        </Box>
      </Modal>
    </Box>
  );
};

export default ProfilePage;