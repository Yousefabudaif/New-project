(function () {
  const API_URL = window.API_URL || "http://localhost:5000/api";

  function getToken() {
    return localStorage.getItem("token");
  }

  async function request(path, options = {}) {
    const token = getToken();
    const response = await fetch(API_URL + path, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {})
      }
    });
    const data = await response.json().catch(() => null);
    if (!response.ok) {
      throw new Error(data && data.message ? data.message : "Request failed.");
    }
    return data;
  }

  function money(value) {
    return new Intl.NumberFormat("en-EG", {
      style: "currency",
      currency: "EGP",
      maximumFractionDigits: 0
    }).format(value || 0);
  }

  async function getProducts(params = {}) {
    const query = new URLSearchParams(params).toString();
    try {
      return await request("/products" + (query ? `?${query}` : ""));
    } catch {
      return filterDemoProducts(params);
    }
  }

  async function getProduct(id) {
    try {
      return await request(`/products/${id}`);
    } catch {
      return window.demoProducts.find(product => product._id === id);
    }
  }

  async function getCategories() {
    try {
      return await request("/categories");
    } catch {
      return window.demoCategories;
    }
  }

  function filterDemoProducts(params = {}) {
    const search = (params.search || "").toLowerCase();
    const category = params.category || "";
    const sort = params.sort || "newest";
    const products = window.demoProducts.filter(product => {
      const categoryId = product.category && (product.category._id || product.category);
      const matchesSearch = !search || `${product.name} ${product.brand} ${product.description}`.toLowerCase().includes(search);
      const matchesCategory = !category || categoryId === category;
      return matchesSearch && matchesCategory;
    });
    products.sort((a, b) => {
      if (sort === "priceLow") return a.price - b.price;
      if (sort === "priceHigh") return b.price - a.price;
      if (sort === "name") return a.name.localeCompare(b.name);
      return 0;
    });
    return products;
  }

  window.shopApi = { request, money, getProducts, getProduct, getCategories };
})();
