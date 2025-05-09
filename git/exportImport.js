function exportArticles() {
  const items = JSON.parse(localStorage.getItem('artikelItems')) || [];
  const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'artikel_export.json';
  a.click();

  URL.revokeObjectURL(url);
}


function importArticles() {
  const fileInput = document.getElementById('importFile');
  fileInput.click();

  fileInput.onchange = () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const importedItems = JSON.parse(e.target.result);
        if (Array.isArray(importedItems)) {
          localStorage.setItem('artikelItems', JSON.stringify(importedItems));
          loadItems();
          alert('Artikel erfolgreich importiert!');
        } else {
          alert('Ungültiges Format.');
        }
      } catch (err) {
        alert('Fehler beim Importieren.');
      }
    };

    reader.readAsText(file);
  };
}


function exportArticles() {
  const items = JSON.parse(localStorage.getItem('artikelItems')) || [];
  const blob = new Blob([JSON.stringify(items, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = 'artikel_export.json';
  a.click();

  URL.revokeObjectURL(url);

  Swal.fire({
    icon: 'success',
    title: 'Exportiert!',
    text: 'Die Artikeldaten wurden erfolgreich gespeichert.',
    timer: 2000,
    showConfirmButton: false
  });
}


function importArticles() {
  const fileInput = document.getElementById('importFile');
  fileInput.click();

  fileInput.onchange = () => {
    const file = fileInput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = e => {
      try {
        const importedItems = JSON.parse(e.target.result);
        if (Array.isArray(importedItems)) {
          localStorage.setItem('artikelItems', JSON.stringify(importedItems));
          loadItems();

          Swal.fire({
            icon: 'success',
            title: 'Importiert!',
            text: 'Die Artikeldaten wurden erfolgreich geladen.',
            timer: 2000,
            showConfirmButton: false
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Ungültiges Format',
            text: 'Die Datei enthält keine gültige Artikelliste.'
          });
        }
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Fehler beim Importieren',
          text: 'Bitte stelle sicher, dass es sich um eine gültige JSON-Datei handelt.'
        });
      }
    };

    reader.readAsText(file);
  };
}
