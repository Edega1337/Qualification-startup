import { useState } from 'react';
import { Box, Modal, Paper, Typography, Grid, TextField, Button } from '@mui/material';

const EditProfileModal = ({ open, onClose, onSave }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [photo, setPhoto] = useState(null);

  return (
    <Modal open={open} onClose={onClose}>
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
            Редактировать профиль
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
              <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={() => onSave({ title, description, photo })}
              >
                Сохранить изменения
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </Modal>
  );
};

export default EditProfileModal;
