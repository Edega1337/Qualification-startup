import React, { useState } from "react";
import "./style.scss";

const SearchBar = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  return (
    <div className="searchBar">
      <input
        className="input"
        type="text"
        placeholder="Поиск по объявлениям"
        value={searchTerm}
        onChange={handleInputChange}
      />
      <button className="button" onClick={() => onSearch(searchTerm)}>
        Найти
      </button>
    </div>
  );
};

export default SearchBar;