const KEY = "shortener_data_v1";

export function loadData() {
  try {
    const raw = localStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : { mappings: {}, clicks: {} };
  } catch {
    return { mappings: {}, clicks: {} };
  }
}

export function saveData(data) {
  localStorage.setItem(KEY, JSON.stringify(data));
}

export function addMapping(mapping) {
  const d = loadData();
  d.mappings[mapping.shortcode] = mapping;
  saveData(d);
}

export function getMapping(shortcode) {
  return loadData().mappings[shortcode] || null;
}

export function listMappings() {
  return Object.values(loadData().mappings);
}

export function addClick(shortcode, click) {
  const d = loadData();
  if (!d.clicks[shortcode]) d.clicks[shortcode] = [];
  d.clicks[shortcode].push(click);
  saveData(d);
}

export function getClicks(shortcode) {
  return loadData().clicks[shortcode] || [];
}
