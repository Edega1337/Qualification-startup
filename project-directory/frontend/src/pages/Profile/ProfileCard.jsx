import { useState, useEffect } from 'react';
import { Box, Paper, Typography, Rating, Link, Chip } from '@mui/material';
import { getMyRoleRequest } from '../../services/index';
import BecomeCoachButton from '../../components/UI/BecomeCoachButton';

const ProfileCard = ({ user }) => {
  const [reqStatus, setReqStatus] = useState(null);

  useEffect(() => {
    if (user.role === 'client') {
      getMyRoleRequest()
        .then(res => setReqStatus(res.data.status))
        .catch(() => setReqStatus(null));
    }
  }, [user.role]);

  const renderBadge = () => {
    if (user.role === 'coach') {
      return <Chip label="Тренер" color="success" sx={{ mt: 1 }} />;
    }
    if (reqStatus === 'pending') {
      return <Chip label="Заявка в обработке…" color="warning" sx={{ mt: 1 }} />;
    }
    return <Chip label="Клиент" color="default" sx={{ mt: 1 }} />;
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, textAlign: 'center' }}>
      <Box sx={{ mt: 2 }}>
        <img
          src={user.avatarUrl}
          alt={user.login}
          style={{ width: 120, height: 120, borderRadius: '50%' }}
        />
      </Box>

      <Typography variant="h6" sx={{ fontWeight: 'bold', mt: 2 }}>
        {user.name}
      </Typography>

      {renderBadge()}

      {user.role === 'coach' && (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1 }}>
          <Rating value={user.rating || 0} readOnly />
          <Link href="#" sx={{ marginLeft: 1, fontSize: 14 }}>
            {`${user.reviews || 0} отзывов`}
          </Link>
        </Box>
      )}

      {user.role === 'client' && reqStatus !== 'pending' && (
        <Box sx={{ mt: 2 }}>
          <BecomeCoachButton />
        </Box>
      )}
    </Paper>
  );
};

export default ProfileCard;
