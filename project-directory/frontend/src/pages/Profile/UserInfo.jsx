import React, { useState } from 'react';
import { Box, Grid } from '@mui/material';
import ProfileCard from '../Profile/ProfileCard';

const UserInfo = (
  { userData }
) => {
  return (
    <Box sx={{ display: 'flex', mt: 4 }}>
      <Grid container spacing={3} justifyContent="center">
        <Grid item xs={12} sm={8} md={6} lg={4}>
          <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ProfileCard user={userData} />
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default UserInfo;
