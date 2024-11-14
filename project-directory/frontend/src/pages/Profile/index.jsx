import React, { useState } from 'react';
import {
  Avatar, Box, Button, Typography, Link, Rating, Modal, Grid, TextField, MenuItem, Paper,
} from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { currentUserService } from '../../services';
import { LocalizationProvider, DatePicker, PickersDay } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { useQuery } from '@tanstack/react-query';
import { sendAdService } from '../../services/index';
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

  const getProfile = async () => {
    try {
      const result = await currentUserService();
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

  const handleSubmit = async () => {
    const adData = {
      title,
      trainingType,
      description,
      price,
      photo,
      selectedDate,
    };

    console.log(adData); // здесь можно отправить данные на сервер
    const result = await sendAdService(adData);
    console.log("Результат отправления", result);
    handleClose();
  };

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 4,
        maxWidth: 600,
        margin: '0 auto',
      }}
    >
      <UpSideBar />
      <Box sx={{ width: '30%', textAlign: 'center', marginRight: 3 }}>
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
          <Avatar
            alt="User Avatar"
            src="your-image-url" // replace with a real image URL
            sx={{ width: 100, height: 100 }}
          />
          <PhotoCamera
            sx={{
              position: 'absolute',
              bottom: 0,
              right: -10,
              backgroundColor: 'white',
              borderRadius: '50%',
              padding: 0.5,
              fontSize: 20,
            }}
          />
        </Box>
        <Typography variant="h6" sx={{ fontWeight: 'bold', marginTop: 2 }}>
          {data.login}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Rating value={0} readOnly />
          <Link href="#" sx={{ marginLeft: 1, fontSize: 14 }}>
            Нет отзывов
          </Link>
        </Box>
      </Box>

      <Box sx={{ width: '70%' }}>
        <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
          Объявлений пока нет
        </Typography>
        <Typography sx={{ marginTop: 1, color: 'text.secondary' }}>
          Но это легко исправить — разместите первое
        </Typography>
        <Button
          variant="contained"
          color="primary"
          sx={{ marginTop: 3, paddingX: 4, paddingY: 1 }}
          onClick={handleOpen}
        >
          Разместить объявление
        </Button>
      </Box>

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
                  onClick={handleSubmit}
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
