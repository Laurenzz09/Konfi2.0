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


// Styling für SweetAlert2 Modal mit symmetrischem Layout
(function injectSwalStyle() {
const swalStyle = `
  .swal2-popup {
    max-width: 480px !important;
    width: 95% !important;
    box-sizing: border-box;
  }

  .swal-form {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin: 0 auto;
    box-sizing: border-box;
  }

  .form-group {
    display: flex;
    flex-direction: column;
  }

  .form-row {
    display: flex;
    gap: 1rem;
    justify-content: center;
  }

  .form-row .form-group {
    flex: none;
  }

  #artikellaengen,
  #artikelgroessen {
    width: 100px;
    text-align: center;
  }

  #artikelname,
  #vollzeitMitarbeiter {
    max-width: 300px;
    margin: 0 auto;
  }


  .swal2-input {
    width: 100%;
    box-sizing: border-box;
  }

  .lieferrhythmus-group {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .lieferrhythmus-options {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: center;
  }

  .container {
    position: relative;
    padding-left: 25px;
    cursor: pointer;
  }

  .container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
  }

  .checkmark {
    position: absolute;
    top: 0;
    left: 0;
    height: 18px;
    width: 18px;
    background-color: #eee;
    border-radius: 50%;
  }

  .container input:checked ~ .checkmark {
    background-color: #2196F3;
  }
`;


  const styleTag = document.createElement('style');
  styleTag.textContent = swalStyle;
  document.head.appendChild(styleTag);
})();




function openItemModal(item = {}) {
  Swal.fire({
    title: item.id ? "Artikel bearbeiten" : translations[currentLanguage].modalTitle,
    html: `
      <div class="swal-form">
        <div class="form-group">
          <label for="artikelname">${translations[currentLanguage].itemName}</label>
          <input type="text" id="artikelname" class="swal2-input" value="${item.artikelname || ''}">
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="artikellaengen">${translations[currentLanguage].itemLengths}</label>
            <input type="number" id="artikellaengen" class="swal2-input" value="${item.artikellaengen || ''}">
          </div>
          <div class="form-group">
            <label for="artikelgroessen">${translations[currentLanguage].itemSizes}</label>
            <input type="number" id="artikelgroessen" class="swal2-input" value="${item.artikelgroessen || ''}">
          </div>
        </div>

        <div class="form-group">
          <label for="vollzeitMitarbeiter">${translations[currentLanguage].employees}</label>
          <input type="number" id="vollzeitMitarbeiter" class="swal2-input" value="${item.vollzeitMitarbeiter || ''}">
        </div>

        <div class="lieferrhythmus-options">
          <label class="container">1x pro Woche
            <input type="radio" name="lieferrhythmus" value="1" ${item.lieferrhythmus == 1 ? 'checked' : ''}>
            <div class="checkmark"></div>
          </label>
          <label class="container">2x pro Woche
            <input type="radio" name="lieferrhythmus" value="2" ${item.lieferrhythmus == 2 ? 'checked' : ''}>
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
    `,
    showCancelButton: true,
    showDenyButton: !!item.id,
    confirmButtonText: translations[currentLanguage].saveButton,
    denyButtonText: 'Löschen',
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
    } else if (result.isDenied && item.id) {
      deleteItem(item.id);
    }
  });
}



function generateUniqueId() {
  return `item-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

function saveItemWithData(data, id) {
  const tauschquote = 2;
  const tauschmenge = data.vollzeitMitarbeiter * tauschquote;

  // Faktor abhängig vom Lieferrhythmus
  let faktor;
  switch (data.lieferrhythmus) {
    case 1: faktor = 3; break;
    case 2: faktor = 2.75; break; // neu hinzugefügt
    case 3: faktor = 2.5; break;
    case 5: faktor = 2; break;
    default: faktor = 2.5; // Fallback
  }

  let ausstattungsmenge = tauschmenge * faktor;

  // Zuschlag je nach Mitarbeiteranzahl
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
  plusItem.classList.add('plus');
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

function deleteItem(id) {
  Swal.fire({
    title: 'Artikel löschen?',
    text: 'Dieser Vorgang kann nicht rückgängig gemacht werden.',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Ja, löschen',
    cancelButtonText: 'Abbrechen'
  }).then(result => {
    if (result.isConfirmed) {
      const items = JSON.parse(localStorage.getItem('artikelItems')) || [];
      const updatedItems = items.filter(item => item.id !== id);
      localStorage.setItem('artikelItems', JSON.stringify(updatedItems));
      loadItems();

      Swal.fire({
        icon: 'success',
        title: 'Gelöscht!',
        text: 'Der Artikel wurde erfolgreich entfernt.',
        timer: 1500,
        showConfirmButton: false
      });
    }
  });
}
