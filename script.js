// Sprachdaten und Startwerte
let currentLanguage = 'de';
const translations = {
  de: {
    clearStorage: "Von vorne anfangen",
    modalTitle: "Artikel hinzufügen",
    saveButton: "Speichern",
    cancelClear: "Abbrechen",
    confirmClear: "Ja, alles löschen",
    itemName: "Artikelname",
    itemLengths: "Artikel Längen",
    itemSizes: "Artikel Größen",
    employees: "Mitarbeiter",
    fillAll: "Bitte füllen Sie alle Felder aus."
  },
  en: {
    clearStorage: "Start over",
    modalTitle: "Add Item",
    saveButton: "Save",
    cancelClear: "Cancel",
    confirmClear: "Yes, clear all",
    itemName: "Item Name",
    itemLengths: "Item Lengths",
    itemSizes: "Item Sizes",
    employees: "Employees",
    fillAll: "Please fill in all fields."
  }
};

function changeLanguage() {
  const select = document.getElementById('language-select');
  currentLanguage = select.value;
  document.getElementById('clearStorageButton').innerText = translations[currentLanguage].clearStorage;
}

document.addEventListener('DOMContentLoaded', () => {
  changeLanguage();
  loadItems();
});

function confirmClear() {
  Swal.fire({
    title: translations[currentLanguage].clearStorage,
    text: 'Dies kann nicht rückgängig gemacht werden.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: translations[currentLanguage].confirmClear,
    cancelButtonText: translations[currentLanguage].cancelClear
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.removeItem('artikelItems');
      loadItems();
    }
  });
}

function openItemModal(item = {}) {
  Swal.fire({
    title: item.id ? "Artikel bearbeiten" : translations[currentLanguage].modalTitle,  
    html: `
  <div class="swal-form">
    <label for="artikelname">${translations[currentLanguage].itemName}</label>
    <input type="text" id="artikelname" class="swal2-input" value="${item.artikelname || ''}">

    <div class="row">
      <div>
        <label for="artikellaengen">${translations[currentLanguage].itemLengths}</label>
        <input type="text" id="artikellaengen" class="swal2-input" value="${item.artikellaengen || ''}">
      </div>
      <div>
        <label for="artikelgroessen">${translations[currentLanguage].itemSizes}</label>
        <input type="text" id="artikelgroessen" class="swal2-input" value="${item.artikelgroessen || ''}">
      </div>
    </div>

    <label for="vollzeitMitarbeiter">${translations[currentLanguage].employees}</label>
    <input type="number" id="vollzeitMitarbeiter" class="swal2-input" value="${item.vollzeitMitarbeiter || ''}">

    <div class="lieferrhythmus-group" style="margin-top: 1rem;">
      <label style="margin-bottom: 5px; display: block;">Lieferrhythmus</label>
      <div class="lieferrhythmus-options" style="display: flex; gap: 15px; justify-content: center;">
        <label class="container">1x pro Woche
          <input type="radio" name="lieferrhythmus" value="1" ${item.lieferrhythmus == 1 ? 'checked' : ''}>
          <div class="checkmark"></div>
        </label>
        <label class="container">3x pro Woche
          <input type="radio" name="lieferrhythmus" value="3" ${item.lieferrhythmus == 3 ? 'checked' : ''}>
          <div class="checkmark"></div>
        </label>
        <label class="container">5x pro Woche
          <input type="radio" name="lieferrhythmus" value="5" ${item.lieferrhythmus == 5 ? 'checked' : ''}>
          <div class="checkmark"></div>
        </label>
      </div>
    </div>
  </div>
`,

    showCancelButton: true,
    confirmButtonText: translations[currentLanguage].saveButton,
    preConfirm: () => {
      const name = document.getElementById('artikelname').value.trim();
      const laengen = document.getElementById('artikellaengen').value.trim();
      const groessen = document.getElementById('artikelgroessen').value.trim();
      const mitarbeiter = parseInt(document.getElementById('vollzeitMitarbeiter').value.trim());
      const rhythmusInput = document.querySelector('input[name="lieferrhythmus"]:checked');

      if (!name || !laengen || !groessen || !mitarbeiter || !rhythmusInput) {
        Swal.showValidationMessage(translations[currentLanguage].fillAll);
        return false;
      }

      return {
        artikelname: name,
        artikellaengen: laengen,
        artikelgroessen: groessen,
        vollzeitMitarbeiter: mitarbeiter,
        lieferrhythmus: parseInt(rhythmusInput.value)
      };
    }
  }).then(result => {
    if (result.isConfirmed && result.value) {
      saveItemWithData(result.value, item.id || generateUniqueId());
    }
  });
}

function generateUniqueId() {
  return `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function saveItemWithData(data, id) {
  const tauschquote = 2;
  const tauschmenge = data.vollzeitMitarbeiter * tauschquote;
  let ausstattungsmenge = tauschmenge *
    (data.lieferrhythmus === 1 ? 3 : data.lieferrhythmus === 3 ? 2.5 : 2);
  ausstattungsmenge = Math.round(
    ausstattungsmenge *
    (data.vollzeitMitarbeiter > 50 && data.vollzeitMitarbeiter <= 100 ? 1.15 :
     data.vollzeitMitarbeiter <= 50 ? 1.3 : 1)
  );

  const newItem = {
    ...data,
    id,
    tauschquote,
    tauschmenge,
    ausstattungsmenge
  };

  const items = JSON.parse(localStorage.getItem('artikelItems')) || [];
  const index = items.findIndex(item => item.id === id);
  if (index !== -1) {
    items[index] = newItem;
  } else {
    items.push(newItem);
  }
  localStorage.setItem('artikelItems', JSON.stringify(items));
  loadItems();
}

function loadItems() {
  const container = document.getElementById('inventory-container');
  container.innerHTML = '';

  const plusItem = document.createElement('div');
  plusItem.className = 'inventory-item';
  plusItem.innerHTML = `<span class="plus-icon">+</span>`;
  plusItem.onclick = () => openItemModal();
  container.appendChild(plusItem);

  const items = JSON.parse(localStorage.getItem('artikelItems')) || [];
  items.forEach(item => {
    const el = document.createElement('div');
    el.className = 'inventory-item';
    el.classList.add('pattern');
    el.innerHTML = `<span class="item-label">${item.artikelname}</span>`;
    el.onclick = () => openItemModal(item);
    container.appendChild(el);
  });
}
