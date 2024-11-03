import { Container, Toolbar, AppBar, IconButton, Typography, Box } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { Link } from 'react-router-dom'; // Или используйте `@mui/material/Link` для Material-UI

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(1)
  },
  title: {
    flexGrow: 1,
    display: 'flex',
    alignItems: 'center'
  },
  highlight: {
    color: theme.palette.secondary.main,
    fontWeight: 'bold',
  },
  link: {
    margin: theme.spacing(1),
    color: theme.palette.common.white,
    fontSize: '1.5rem', // Измените размер шрифта
    textDecoration: 'none',
    '&:hover': {
      color: 'red' // Цвет при наведении
    }
  }
}));

const UpSideBar = () => {
  const classes = useStyles();
  const accessToken = localStorage.getItem("accessToken") || false;
  return (
    <AppBar position='fixed'>
      <Container fixed>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            {/* Добавьте иконку сюда, если она нужна */}
          </IconButton>

          <Typography variant='h5' className={classes.title}>
            Тренировки.<span className={classes.highlight}>ТУТ</span>
          </Typography>
          <Box>
            {accessToken ? (
              // Отображение при наличии accessToken
              <Typography variant="body1">
                <Link to="/profile" className={classes.link}>Профиль</Link>
                <Link to="/logout" className={classes.link}>Выйти</Link>
              </Typography>
            ) : (
              // Отображение при отсутствии accessToken
              <Typography variant="body1">
                <Link to="/login" className={classes.link}>Войти</Link>
                <Link to="/register" className={classes.link}>Зарегистрироваться</Link>
              </Typography>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default UpSideBar;
