import React from 'react';
import {
  Container, Toolbar, AppBar, IconButton, Typography, Box, Button
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import HomeIcon from '@mui/icons-material/Home';  // Example icon
import { getUserInfo } from '../../../services/index';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(1),
  },
  title: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center',
  },
  highlight: {
    color: theme.palette.secondary.main,
    fontWeight: 'bold',
  },
  link: {
    margin: theme.spacing(1),
    color: theme.palette.common.white,
    fontSize: '1.5rem',
    textDecoration: 'none',
    '&:hover': {
      color: 'red',
    },
  },
  button: {
    margin: theme.spacing(1),
    color: theme.palette.common.white,
    '&:hover': {
      color: 'red',
    },
  },
}));

const UpSideBar = () => {
  const classes = useStyles();
  const accessToken = localStorage.getItem('accessToken') || false;

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    window.location.href = '/content';
  };

  return (
    <AppBar position='fixed'>
      <Container fixed>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            {/* Optional main logo/icon here */}
          </IconButton>

          <Typography variant='h5' className={classes.title}>
            Тренировки.<span className={classes.highlight}>ТУТ</span>
          </Typography>

          <Box display="flex" alignItems="center">
            <Link to="/" className={classes.link}>
              <IconButton color="inherit">
                <HomeIcon />
              </IconButton>
              Главная
            </Link>

            {accessToken ? (
              <>
                <Typography variant="h5">
                  <Link to="/profile" className={classes.link}>
                    Привет, {getUserInfo()}
                  </Link>
                  <Button className={classes.button} onClick={handleLogout}>
                    Выйти
                  </Button>
                </Typography>
              </>
            ) : (
              <>
                <Link to="/login" className={classes.link}>Войти</Link>
                <Link to="/registration" className={classes.link}>Зарегистрироваться</Link>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default UpSideBar;
