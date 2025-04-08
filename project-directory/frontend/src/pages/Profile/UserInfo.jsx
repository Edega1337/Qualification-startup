import React, { useState } from 'react';
import { Box, Grid, Button } from '@mui/material';
import ProfileCard from '../Profile/ProfileCard';
import EditProfileModal from '../Profile/EditProfileModal';

const UserInfo = (
  { userData }
) => {
  const [openProfileModal, setOpenProfileModal] = useState(false);
  const handleOpenProfileModal = () => setOpenProfileModal(true);
  const handleCloseProfileModal = () => setOpenProfileModal(false);

  const handleSaveProfile = (updatedData) => {
    setUser({ ...user, ...updatedData });
    handleCloseProfileModal();
  };

  return (
    <Box sx={{ display: 'flex', mt: 4 }}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ProfileCard user={userData} />
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2, px: 3, py: 1.5 }}
              onClick={handleOpenProfileModal}
            >
              Редактировать профиль
            </Button>

          </Box>
        </Grid>
      </Grid>
      <EditProfileModal open={openProfileModal} onClose={handleCloseProfileModal} onSave={handleSaveProfile} />
    </Box>
  );
};

export default UserInfo;
