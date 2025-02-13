import React, { useState } from 'react';
import { Box, Grid, Button } from '@mui/material';
import ProfileCard from '../Profile/ProfileCard';
import EditProfileModal from '../Profile/EditProfileModal';

const UserInfo = () => {
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const [user, setUser] = useState({
    avatar: "your-image-url",
    login: "User123",
    rating: 0,
    reviews: 0,
  });

  const handleOpenProfileModal = () => setOpenProfileModal(true);
  const handleCloseProfileModal = () => setOpenProfileModal(false);

  const handleSaveProfile = (updatedData) => {
    setUser({ ...user, ...updatedData });
    handleCloseProfileModal();
  };

  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <ProfileCard user={user} />
          <Button
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            onClick={handleOpenProfileModal}
          >
            Редактировать профиль
          </Button>
        </Grid>
      </Grid>
      <EditProfileModal open={openProfileModal} onClose={handleCloseProfileModal} onSave={handleSaveProfile} />
    </Box>
  );
};

export default UserInfo;
