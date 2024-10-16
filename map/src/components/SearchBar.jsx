// src/components/SearchBar.jsx
import React from 'react';

class SearchBar extends React.Component {
  state = {
    searchName: '' // Для хранения названия поля
  };

  handleSearch = () => {
    const { searchName } = this.state;

    if (searchName) {
      this.props.onSearch(searchName); // Передаем название поля в родительский компонент
    } else {
      alert("Пожалуйста, введите название поля.");
    }
  };

  render() {
    return (
      <div>
        <input
          type="text"
          placeholder="Название поля"
          value={this.state.searchName}
          onChange={(e) => this.setState({ searchName: e.target.value })}
        />
        <button onClick={this.handleSearch}>Поиск</button>
      </div>
    );
  }
}

export default SearchBar;
