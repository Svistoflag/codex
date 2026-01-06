import path from 'path';

const keywordMap = [
  { keyword: 'human', type: 'person', action: 'movement' },
  { keyword: 'person', type: 'person', action: 'movement' },
  { keyword: 'vehicle', type: 'vehicle', action: 'movement' },
  { keyword: 'car', type: 'vehicle', action: 'movement' },
  { keyword: 'deer', type: 'animal', action: 'movement' },
  { keyword: 'fox', type: 'animal', action: 'movement' },
  { keyword: 'bear', type: 'animal', action: 'movement' }
];

export function analyzeMedia({ filename }) {
  const lower = filename.toLowerCase();
  const hits = keywordMap.filter((entry) => lower.includes(entry.keyword));

  if (hits.length === 0) {
    return {
      summary: 'Объекты не распознаны. Проверьте кадр вручную.',
      objects: [{ type: 'unknown', confidence: 0.1, action: 'movement' }],
      source: 'heuristic'
    };
  }

  const objects = hits.map((hit) => ({
    type: hit.type,
    confidence: 0.4,
    action: hit.action
  }));

  const summary = `Обнаружены: ${[...new Set(objects.map((item) => item.type))].join(', ')}.`;

  return {
    summary,
    objects,
    source: 'heuristic'
  };
}

export function buildPublicName(originalName, fallbackId) {
  const base = path.basename(originalName || '');
  return base ? base : `${fallbackId}`;
}
