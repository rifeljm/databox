window._app.API = class {
  search(searchVal) {
    const isSearch = searchVal
      ? `?search=${encodeURIComponent(searchVal)}`
      : "";
    return new Promise((resolve) => {
      fetch(
        `https://5fbd0df03f8f90001638caa5.mockapi.io/api/v1/users${isSearch}`
      )
        .then((response) => response.json())
        .then((results) => {
          resolve(results);
        });
    });
  }
};
