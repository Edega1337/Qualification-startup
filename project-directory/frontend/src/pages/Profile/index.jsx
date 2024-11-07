import React from 'react';
import { Avatar, Box, Button, Typography, Link, Rating } from '@mui/material';
import { PhotoCamera } from '@mui/icons-material';
import { currentUserService } from '../../services';

const ProfilePage = () => {

  const getProfile = async () => {
    try {
      const result = await currentUserService();
      console.log(result);
    } catch (err) {
      console.err;
    }
  }

  getProfile();

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
      {/* Left Section - Profile Picture and Info */}
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

        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Rating value={0} readOnly />
          <Link href="#" sx={{ marginLeft: 1, fontSize: 14 }}>
            Нет отзывов
          </Link>
        </Box>
        <Box sx={{ marginTop: 2, textAlign: 'left' }}>
          <Link href="#" sx={{ display: 'block', color: 'primary.main', fontSize: 16, marginBottom: 1 }}>
            Заказы
          </Link>
          <Link href="#" sx={{ display: 'block', color: 'primary.main', fontSize: 16, marginBottom: 1 }}>
            Мои отзывы
          </Link>
          <Link href="#" sx={{ display: 'block', color: 'primary.main', fontSize: 16 }}>
            Избранное
          </Link>
        </Box>
      </Box>

      {/* Right Section - Main Content */}
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
        >
          Разместить объявление
        </Button>
      </Box>
    </Box>
  );
}

export default ProfilePage;
