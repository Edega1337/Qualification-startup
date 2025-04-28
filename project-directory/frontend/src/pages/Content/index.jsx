// src/components/AdList.jsx
import React, { useState, useRef, useEffect, useCallback } from "react";
import UpSideBar from "../../components/UI/UpSideBar";
import SearchBar from "../../components/UI/SearchBar";
import { useSearchAds } from "../../hooks/useSearchAds";
import SearchFilters from "../../components/UI/SearchFilters";
import { useDebounce } from "../../components/HOC/useDebounce";
import Skeleton from '@mui/material/Skeleton';
import './style.scss';

const LIMIT = 10;

const AdList = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterState, setFilterState] = useState({
    typeOfTrening: "",
    priceRangeLabel: "",
    minPrice: null,
    maxPrice: null,
  });
  const [page, setPage] = useState(0);
  const [ads, setAds] = useState([]);
  const [hasMore, setHasMore] = useState(true);
  const [showTop, setShowTop] = useState(false);

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { data = [], isLoading } = useSearchAds(
    debouncedSearchTerm,
    filterState,
    page,
    LIMIT
  );

  // Append or replace ads when data arrives
  useEffect(() => {
    if (page === 0) {
      setAds(data);
    } else {
      setAds(prev => [...prev, ...data]);
    }
    setHasMore(data.length === LIMIT);
  }, [data, page]);

  useEffect(() => {
    const hasFilter =
      debouncedSearchTerm !== "" ||
      filterState.typeOfTrening !== "" ||
      filterState.minPrice != null ||
      filterState.maxPrice != null;
    setPage(0);
    if (hasFilter) {
      setAds([]);
      setHasMore(true);
    }
  }, [debouncedSearchTerm, filterState]);

  // Infinite scroll observer
  const observer = useRef();
  const lastAdRef = useCallback(
    node => {
      if (isLoading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && hasMore) {
          setPage(prev => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [isLoading, hasMore]
  );

  useEffect(() => {
    const handleScroll = () => setShowTop(window.pageYOffset > 300);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const scrollTop = () =>
    window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="container">
      <UpSideBar />
      <div className="stickySearchBar">
        <SearchBar onSearch={setSearchTerm} />
        <SearchFilters
          filters={filterState}
          onFilterChange={setFilterState}
        />
      </div>

      <div className="adsContainer">
        <h5 className="recommendationsTitle">Список объявлений</h5>
        {!isLoading && (
          <div className="filters-summary">
            Найдено {ads.length}{' '}
            {ads.length === 1 ? 'объявление' : 'объявлений'}
          </div>
        )}

        {/* Initial loaders */}
        {isLoading && page === 0 && (
          <div className="adList">
            {Array.from({ length: LIMIT }).map((_, i) => (
              <Skeleton
                key={i}
                variant="rectangular"
                width="100%"
                height={200}
              />
            ))}
          </div>
        )}

        <div className="adList">
          {ads.map((ad, index) => {
            const isLast = index === ads.length - 1;
            const isNew =
              (new Date() - new Date(ad.date)) / (1000 * 60 * 60 * 24) < 7;
            return (
              <div
                key={ad.ad_id || index}
                className="adCard"
                ref={isLast ? lastAdRef : null}
              >
                {isNew && <div className="badge">Новое</div>}
                <img
                  src={`http://localhost:4000/uploads/${ad.namePhoto}`}
                  alt={ad.name}
                  className="media"
                />
                <div className="title">{ad.name}</div>
                <div className="price">{ad.price} ₽</div>
                <div className="description">
                  {ad.description?.length > 130
                    ? ad.description.slice(0, 130) + '…'
                    : ad.description || 'Описание отсутствует'}
                </div>
                <div className="details">
                  <span>{ad.typeOfTrening}</span>
                </div>
              </div>
            );
          })}
        </div>

        {isLoading && page > 0 && (
          <p style={{ textAlign: 'center', marginTop: 20 }}>
            Загрузка...
          </p>
        )}
        {!hasMore && (
          <p style={{ textAlign: 'center', marginTop: 20 }}>
            Все объявления загружены
          </p>
        )}
      </div>

      <button
        className={`back-to-top ${showTop ? 'visible' : ''}`}
        onClick={scrollTop}
      >
        ↑
      </button>
    </div>
  );
};

export default AdList;
