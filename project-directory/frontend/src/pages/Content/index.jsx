import React, { useState, useEffect } from "react";
import UpSideBar from "../../components/UI/UpSideBar";
import SearchBar from "../../components/UI/SearchBar";
import { useDebounce } from "../../components/HOC/useDebounce";
import "./style.scss";

const AdList = ({ recommendations = [] }) => {
  recommendations = [
    {
      title: "Беспроводные наушники beats solo 3",
      price: "3100 ₽",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQiRD9O_76qAzjpaKsZVMx9f_d2dBbmDixlwQ&s",
      type_of_trening: "Фитнес",
    },
    {
      title: "Куртка alpha industries N-2B",
      price: "7900 ₽",
      image:
        "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcQNEcdFp9NTwoHR2gnSgiFSdfobF8_T9K7ScvQmAzmisFpYJxh3q-ZKg3HKPJzJ62ZFlVQwvhJZhcTAjQLOnJdKykr8tjx1jlgQATasXqYXzyTonfbhXNh8EZsRo4ybt72D5Ub8pbUq&usqp=CAc",
      type_of_trening: "Фитнес",
    },
    {
      title: "Наушники beats studio 3 wireless",
      price: "5000 ₽",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRUyJnvDqbWeQfmvh8a_7w2ybgDevnYGY_duA&s",
      type_of_trening: "Фитнес",
    },
    {
      title: "Парка Alpha industries",
      price: "7990 ₽",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCV3lzLntmaJjY3-dHbnRT2QbtkT7uSloWkw&s",
      type_of_trening: "Йога",
    },
    {
      title: "Продается велосипед",
      description: "В отличном состоянии, практически новый.",
      price: 15000,
      image:
        "https://velomisto.com.ua/content/uploads/images/kinetic-profi.jpeg",
      type_of_trening: "Йога",
    },
    {
      title: "Классные наушники",
      description: "Наушники с шумоподавлением, практически не использовались.",
      price: 5000,
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5ooehvxFRGUQDn8sIaI6g31MzXaDUEO1r3A&s",
      type_of_trening: "Йога",
    },
    {
      title: "Парка Alpha industries",
      price: "7990 ₽",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCV3lzLntmaJjY3-dHbnRT2QbtkT7uSloWkw&s",
      type_of_trening: "Йога",
    },
    {
      title: "Парка Alpha industries",
      price: "7990 ₽",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCV3lzLntmaJjY3-dHbnRT2QbtkT7uSloWkw&s",
      type_of_trening: "Йога",
    },
    {
      title: "Парка Alpha industries",
      price: "7990 ₽",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCV3lzLntmaJjY3-dHbnRT2QbtkT7uSloWkw&s",
      type_of_trening: "Йога",
    },
    {
      title: "Парка Alpha industries",
      price: "7990 ₽",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCV3lzLntmaJjY3-dHbnRT2QbtkT7uSloWkw&s",
      type_of_trening: "Боевые искусства",
    },
    {
      title: "Парка Alpha industries",
      price: "7990 ₽",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCV3lzLntmaJjY3-dHbnRT2QbtkT7uSloWkw&s",
      type_of_trening: "Боевые искусства",
    },
    {
      title: "Парка Alpha industries",
      price: "7990 ₽",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCV3lzLntmaJjY3-dHbnRT2QbtkT7uSloWkw&s",
      type_of_trening: "Боевые искусства",
    },
    {
      title: "Парка Alpha industries",
      price: "7990 ₽",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCV3lzLntmaJjY3-dHbnRT2QbtkT7uSloWkw&s",
      type_of_trening: "Боевые искусства",
    },
    {
      title: "Парка Alpha industries",
      price: "7990 ₽",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRCV3lzLntmaJjY3-dHbnRT2QbtkT7uSloWkw&s",
      type_of_trening: "Боевые искусства",
    },
  ];

  const [filteredAds, setFilteredAds] = useState(recommendations);
  const [searchTerm, setSearchTerm] = useState("");

  const debouncedSearchTerm = useDebounce(searchTerm, 500); // Задержка в 500 мс

  useEffect(() => {
    if (!debouncedSearchTerm) {
      setFilteredAds(recommendations);
      return;
    }

    const lowerCasedTerm = debouncedSearchTerm.toLowerCase();
    setFilteredAds(
      recommendations.filter(
        (ad) =>
          ad.title.toLowerCase().includes(lowerCasedTerm) ||
          ad.type_of_trening.toLowerCase().includes(lowerCasedTerm)
      )
    );
  }, [debouncedSearchTerm, recommendations]);

  return (
    <div className="container">
      <UpSideBar />
      <div className="stickySearchBar">
        <SearchBar onSearch={setSearchTerm} /> {/* Теперь просто обновляем состояние */}
      </div>
      <div className="adsContainer">
        <h5 className="recommendationsTitle">Список объявлений</h5>
        <div className="adList">
          {filteredAds.map((ad, index) => (
            <div key={index} className="adCard">
              <div className="adCardItems">
                <div>
                  <img src={ad.image} alt={ad.title} className="media" />
                </div>
                <div>
                  <div className="title">{ad.title}</div>
                  <div className="price">{ad.price}</div>
                  <div className="description">
                    {ad.description || "Лучшее качество. Качество лучшее что есть на рынке..."}
                  </div>
                  <div className="details">
                    <span>Аудио и видео</span>
                    <span className="delivery">Доставка от 1 дня</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdList;