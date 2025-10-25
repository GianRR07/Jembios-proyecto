import { useEffect, useState } from 'react';
import { apiGetProducts } from '../services/api';
import { useCart } from '../store/cart';
import './Home.css';

export default function Home() {
  const { add } = useCart();
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCats, setSelectedCats] = useState([]);
  const [search, setSearch] = useState('');

  useEffect(() => {
    (async () => {
      const data = await apiGetProducts();
      setProducts(data);
      setFiltered(data);
      const uniqueCats = [...new Set(data.map(p => p.category))];
      setCategories(uniqueCats);
    })();
  }, []);

  useEffect(() => {
    let result = products;
    if (selectedCats.length > 0) {
      result = result.filter(p => selectedCats.includes(p.category));
    }
    if (search.trim()) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFiltered(result);
  }, [search, selectedCats, products]);

  function toggleCat(cat) {
    setSelectedCats(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  }

  return (
    <div className="page-container">
      {/* Sidebar de filtros */}
      <aside className="sidebar">
        <input
          type="text"
          placeholder="Buscar productos..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="search-box"
        />
        <div className="filter-section">
          {categories.map(cat => (
            <label key={cat} className="filter-item">
              <input
                type="checkbox"
                checked={selectedCats.includes(cat)}
                onChange={() => toggleCat(cat)}
              />
              {cat}
            </label>
          ))}
        </div>
      </aside>

      {/* Lista de productos */}
      <main className="products-section">
        {filtered.length === 0 ? (
          <p>No hay productos disponibles.</p>
        ) : (
          <div className="product-grid">
            {filtered.map(p => (
              <div key={p.id} className="product-card">
                <img
                  src={`https://via.placeholder.com/250x200?text=${encodeURIComponent(p.name)}`}
                  alt={p.name}
                  className="product-img"
                />
                <h3 className="product-name">{p.name}</h3>
                <p className="product-cat">{p.category}</p>
                <button
                  className="add-btn"
                  onClick={() => add(p, 1)}
                  disabled={p.stock <= 0}
                >
                  Agregar al carrito
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
