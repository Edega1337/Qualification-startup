// theme.js
import { createTheme } from '@material-ui/core/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#3452a4', // Ваш основной цвет
    },
    secondary: {
      main: '#ff4081', // Вторичный цвет
    },
    background: {
      default: '#b4c2e8', // Цвет фона приложения
    },
  },
});

export default theme;
