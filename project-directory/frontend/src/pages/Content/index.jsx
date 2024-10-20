import React from "react";
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
} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import UpSideBar from '../../components/UI/UpSideBar';


const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(2),
  },
  adCard: {
    marginBottom: theme.spacing(2),
  },
  media: {
    height: 140,
  },
  title: {
    fontWeight: "bold",
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
  ],
}) => {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <UpSideBar />
      <Typography variant="h4" className={classes.title} gutterBottom>
        Список Объявлений
      </Typography>
      <Grid container spacing={2}>
        {ads.map((ad, index) => (
          <Grid item xs={12} sm={6} md={4} key={index}>
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
    </Container>
  );
};

export default AdList;
