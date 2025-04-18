import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  Grid,
  TextField,
  Button,
  Avatar
} from '@mui/material';
// import { PhotoCamera } from '@mui/icons-material';

const ProfileEditForm = ({ userData, onSubmit, onClose }) => {
  // Устанавливаем начальные значения из userData
  const [name, setName] = useState(userData.name || '');
  const [email, setEmail] = useState(userData.email || '');
  const [phone, setPhone] = useState(userData.phoneNumber || '');
  const [city, setCity] = useState(userData.city || '');
  const [bio, setBio] = useState(userData.bio || '');
  const [avatar, setAvatar] = useState(null);

  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(e.target.files[0]);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('phoneNumber', phone);
    formData.append('city', city);
    formData.append('bio', bio);
    if (avatar) {
      formData.append('avatarUrl', avatar);
    }

    // Отладочный вывод: проверяем содержимое FormData
    for (let [key, value] of formData.entries()) {
      console.log(`${key}:`, value);
    }
    onSubmit(formData);
  };

  return (
    <Container maxWidth="sm">
      <Paper
        elevation={3}
        style={{ padding: '2rem', marginTop: '2rem' }}
        component="form"
        onSubmit={handleSubmit}
      >
        <Typography variant="h5" align="center" gutterBottom>
          Редактировать профиль
        </Typography>
        <Grid container spacing={2}>
          {/* Аватар и кнопка смены аватара */}
          <Grid item xs={12} sx={{ textAlign: 'center' }}>
            <Avatar
              src={userData.avatar || ''}
              sx={{ width: 120, height: 120, margin: '0 auto' }}
            />
            <Button variant="contained" component="label" sx={{ mt: 1 }}>
              Сменить аватар
              <input type="file" hidden onChange={handleAvatarChange} />
            </Button>
          </Grid>
          {/* Поле "Имя" */}
          <Grid item xs={12}>
            <TextField
              label="Имя"
              fullWidth
              variant="outlined"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </Grid>
          {/* Поле "Email" */}
          <Grid item xs={12}>
            <TextField
              label="Email"
              fullWidth
              variant="outlined"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Grid>
          {/* Поле "Телефон" */}
          <Grid item xs={12}>
            <TextField
              label="Телефон"
              fullWidth
              variant="outlined"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </Grid>
          {/* Поле "Город" */}
          <Grid item xs={12}>
            <TextField
              label="Город"
              fullWidth
              variant="outlined"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </Grid>
          {/* Поле "О себе" */}
          <Grid item xs={12}>
            <TextField
              label="О себе"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              value={bio}
              onChange={(e) => setBio(e.target.value)}
            />
          </Grid>
          {/* Кнопка отправки */}
          <Grid item xs={12}>
            <Button type="submit" variant="contained" color="primary" fullWidth size="large">
              Сохранить изменения
            </Button>
          </Grid>
          {/* Кнопка отмены (если onClose передан) */}
          {onClose && (
            <Grid item xs={12}>
              <Button variant="outlined" color="secondary" fullWidth onClick={onClose}>
                Отмена
              </Button>
            </Grid>
          )}
        </Grid>
      </Paper>
    </Container>
  );
};

export default ProfileEditForm;
