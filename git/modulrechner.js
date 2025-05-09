function calculateAll() {
  const data = JSON.parse(localStorage.getItem('artikelItems')) || [];
  if (data.length === 0) {
    document.getElementById('configurationBase').innerText = 'Keine Daten verfügbar.';
    document.getElementById('recommendedModules').innerText = 'Keine Daten verfügbar.';
    document.getElementById('systemsOverview').innerText = 'Keine Systeme erforderlich.';
    document.getElementById('containerReturn').innerText = '-';
    document.getElementById('rowReturn').innerText = '-';
    return;
  }

  const TAUSCHQUOTE = 2;
  const FÜLLMENGE_SCHRANK = 80;
  const MODULE_CAPACITY = 8;
  const CONTAINER_CAPACITY = 250;
  const ROW_MULTIPLIER = 3;

  const totalEmployees = data.reduce((sum, item) => sum + (parseInt(item.vollzeitMitarbeiter) || 0), 0);
  const totalVariants = data.reduce((sum, item) => sum + ((parseInt(item.artikellaengen) || 0) * (parseInt(item.artikelgroessen) || 0)), 0);

  const modulesByTauschmenge = Math.ceil((totalEmployees * TAUSCHQUOTE * 0.5) / FÜLLMENGE_SCHRANK);
  const modulesByVariants = Math.ceil(totalVariants / MODULE_CAPACITY);

  let configurationBase;
  let selectedModules;
  if (modulesByVariants > modulesByTauschmenge) {
    configurationBase = 'Varianten';
    selectedModules = modulesByVariants;
  } else {
    configurationBase = 'Tauschmenge';
    selectedModules = modulesByTauschmenge;
  }

  const systems = calculateSystemsBalanced(selectedModules);

  const totalTauschmenge = totalEmployees * TAUSCHQUOTE;
  const containerReturn = Math.ceil(totalTauschmenge / CONTAINER_CAPACITY / 5);
  const rowReturn = containerReturn * ROW_MULTIPLIER;

  document.getElementById('configurationBase').innerText = configurationBase;
  document.getElementById('recommendedModules').innerText = `${selectedModules}`;
  document.getElementById('systemsOverview').innerText = `
    ${systems.length} Systeme: ${systems.map((m, i) => `System ${i + 1}: ${m} Module`).join(', ')}
  `;
  document.getElementById('containerReturn').innerText = `${containerReturn}`;
  document.getElementById('rowReturn').innerText = `${rowReturn}`;
}

function calculateSystemsBalanced(modules) {
  const MAX_MODULES_PER_SYSTEM = 12;
  const systems = [];

  if (modules <= MAX_MODULES_PER_SYSTEM) {
    systems.push(modules);
  } else {
    const half = Math.floor(modules / 2);
    systems.push(half);
    systems.push(modules - half);
  }

  return systems;
}

document.addEventListener('DOMContentLoaded', calculateAll);
