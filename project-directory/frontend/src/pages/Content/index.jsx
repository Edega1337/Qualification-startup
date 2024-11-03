import React from 'react';
import {
  Container,
  Typography,
  Paper,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
import { useQuery } from '@tanstack/react-query';
import { useLogIn } from '../../hooks/useLogin';
import UpSideBar from '../../components/UI/UpSideBar';
import SearchBar from '../../components/UI/SearchBar';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(10),
    display: 'flex', // Flexbox для расположения элементов
  },
  adsContainer: {
    flex: 1, // Занимает оставшееся пространство
    maxHeight: '80vh', // Максимальная высота
    overflowY: 'auto', // Полоса прокрутки по вертикали
    padding: theme.spacing(2),
  },
  filterContainer: {
    width: '300px', // Ширина блока с фильтром
    padding: theme.spacing(2),
    backgroundColor: theme.palette.background.paper,
    boxShadow: theme.shadows[3],
  },
  adCard: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  media: {
    height: 140,
  },
  title: {
    fontWeight: 'bold',
  },
  price: {
    color: theme.palette.secondary.main,
  },
}));

const AdList = ({
  ads = [
    {
      title: "Продается велосипед",
      description: "В отличном состоянии, практически новый.",
      price: 15000,
      image: "https://example.com/your-image-url.jpg",
    },
    {
      title: "Классные наушники",
      description: "Наушники с шумоподавлением, практически не использовались.",
      price: 5000,
      image: "https://example.com/your-image-url2.jpg",
    },
    // ... другие объявления
  ],
}) => {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <UpSideBar />
      <div className={classes.adsContainer}>
        <Typography variant="h4" className={classes.title} gutterBottom>
          Список Объявлений
        </Typography>
        <SearchBar />
        <Grid container spacing={4}>
          {ads.map((ad, index) => (
            <Grid item xs={12} key={index}>
              <Card className={classes.adCard} elevation={3}>
                <CardMedia
                  className={classes.media}
                  image={ad.image} // URL изображения
                  title={ad.title}
                />
                <CardContent>
                  <Typography variant="h6" className={classes.title}>
                    {ad.title}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {ad.description}
                  </Typography>
                  <Typography variant="h6" className={classes.price}>
                    {ad.price} Р
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary">
                    Подробнее
                  </Button>
                  <Button size="small" color="secondary">
                    Связаться
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
      <Paper className={classes.filterContainer}>
        <Typography variant="h6">Настройки для поиска</Typography>
        {/* Здесь можно добавить элементы управления для фильтров */}
      </Paper>
    </Container>
  );
};

export default AdList;
