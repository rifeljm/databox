"use strict";
const app = window._app;
app.renderFilters = () => {
  const filtersHTML = ["All", "Free", "Paying"]
    .map((filter) => {
      return `<div class="filter">${filter}</div>`;
    })
    .join("");
  document.getElementById("filters").innerHTML = filtersHTML;
};

app.valueChanged = () => {
  let lastValue;
  return (newValue) => {
    const temp = lastValue;
    lastValue = newValue;
    return temp !== newValue;
  };
};

function highlight(str, searchedString) {
  if (!searchedString) {
    return str;
  }
  const regex = new RegExp("(" + searchedString + ")", "gi");
  return str.replace(regex, '<div class="highlight">$&</div>');
}

app.renderList = (results, searchedString) => {
  const listNode = document.getElementById("list");
  listNode.innerHTML = "";
  let resultsHTML = "";
  results.forEach((elem) => {
    resultsHTML += `<div class="results__row">
      <div class="results__cell">${elem.id}</div>
      <div class="results__cell"><b>${highlight(
        elem.company,
        searchedString
      )}</b></div>
      <div class="results__cell">${highlight(elem.email, searchedString)}</div>
    </div>`;
  });
  listNode.innerHTML = `<div class="results">
    <div class="results__row">
      <div class="results__header-cell">ID</div>
      <div class="results__header-cell">Company</div>
      <div class="results__header-cell">E-mail</div>
    </div>
    ${resultsHTML}
  </div>`;
};

app.attachSearchInputListener = () => {
  const isValueNew = app.valueChanged();
  const api = new app.API();
  document.getElementById("searchInput").addEventListener(
    "keyup",
    app.debounce(async (e) => {
      if (isValueNew(e.target.value)) {
        const results = await api.search(e.target.value);
        app.renderList(results, e.target.value);
      }
    }, 500)
  );
};

app.bootstrap = async () => {
  app.renderFilters();
  app.attachSearchInputListener();
  const api = new app.API();
  const results = await api.search();
  app.renderList(results);
};

app.bootstrap();
