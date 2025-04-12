import { Avatar, Box, Paper, Typography, Rating, Link } from '@mui/material';

const ProfileCard = ({ user }) => {
  console.log(user);
  return (
    <Paper elevation={3} sx={{ padding: 3, textAlign: 'center' }}>
      <Avatar src={user.avatar} sx={{ width: 120, height: 120, margin: '0 auto' }} />
      <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
        {user.name}
      </Typography>
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
        <Rating value={user.rating || 0} readOnly />
        <Link href="#" sx={{ marginLeft: 1, fontSize: 14 }}>
          {`${user.reviews || 0} отзывов`}
        </Link>
      </Box>
    </Paper>
  );
};

export default ProfileCard;
