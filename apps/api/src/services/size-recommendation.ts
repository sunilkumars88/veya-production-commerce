interface SizeInput {
  age?: number;
  height?: number;
  weight?: number;
  waist?: number;
  hip?: number;
  bust?: number;
  underbust?: number;
  existingBraSize?: string;
  preferredFit?: 'snug' | 'regular' | 'relaxed';
}

const SIZE_CHART = [
  { size: 'XS', bust: 76, waist: 58, hip: 82, underbust: 68 },
  { size: 'S', bust: 81, waist: 63, hip: 87, underbust: 73 },
  { size: 'M', bust: 86, waist: 68, hip: 92, underbust: 78 },
  { size: 'L', bust: 91, waist: 73, hip: 97, underbust: 83 },
  { size: 'XL', bust: 96, waist: 78, hip: 102, underbust: 88 },
];

const BRA_MAP: Record<string, string> = {
  '32A': 'XS', '32B': 'XS', '34A': 'S', '34B': 'S', '34C': 'S',
  '36A': 'M', '36B': 'M', '36C': 'M', '38B': 'L', '38C': 'L',
  '40B': 'XL', '40C': 'XL',
};

export function recommendSize(input: SizeInput) {
  if (input.existingBraSize && BRA_MAP[input.existingBraSize]) {
    let size = BRA_MAP[input.existingBraSize];
    if (input.preferredFit === 'relaxed') size = getNextSize(size) || size;
    if (input.preferredFit === 'snug') size = getPrevSize(size) || size;
    const alt = input.preferredFit === 'regular' ? getNextSize(size) : undefined;
    return {
      recommendedSize: size,
      confidence: 88,
      alternativeSize: alt,
      reason: `Based on your bra size ${input.existingBraSize}, we recommend size ${size}.`,
    };
  }

  let bestMatch = SIZE_CHART[2]; // default M
  let bestScore = 0;

  for (const entry of SIZE_CHART) {
    let score = 0;
    let factors = 0;
    if (input.bust) { score += Math.max(0, 100 - Math.abs(input.bust - entry.bust) * 5); factors++; }
    if (input.waist) { score += Math.max(0, 100 - Math.abs(input.waist - entry.waist) * 5); factors++; }
    if (input.hip) { score += Math.max(0, 100 - Math.abs(input.hip - entry.hip) * 5); factors++; }
    if (input.underbust) { score += Math.max(0, 100 - Math.abs(input.underbust - entry.underbust) * 5); factors++; }
    if (input.weight) {
      const weightSize = input.weight < 50 ? 'XS' : input.weight < 58 ? 'S' : input.weight < 68 ? 'M' : input.weight < 78 ? 'L' : 'XL';
      if (weightSize === entry.size) { score += 80; factors++; }
    }
    const avg = factors > 0 ? score / factors : 0;
    if (avg > bestScore) { bestScore = avg; bestMatch = entry; }
  }

  const confidence = Math.min(95, Math.round(bestScore));
  let recommended = bestMatch.size;
  if (input.preferredFit === 'relaxed') recommended = getNextSize(recommended) || recommended;
  if (input.preferredFit === 'snug') recommended = getPrevSize(recommended) || recommended;

  const alt = input.preferredFit === 'regular'
    ? (getNextSize(recommended) || getPrevSize(recommended))
    : undefined;

  return {
    recommendedSize: recommended,
    confidence,
    alternativeSize: alt,
    reason: confidence >= 80
      ? `Based on your measurements, size ${recommended} should fit well.`
      : `Size ${recommended} is our best estimate. For a ${input.preferredFit || 'regular'} fit, consider trying both ${recommended} and ${alt || getNextSize(recommended)}.`,
  };
}

function getNextSize(size: string): string | undefined {
  const idx = SIZE_CHART.findIndex(s => s.size === size);
  return idx < SIZE_CHART.length - 1 ? SIZE_CHART[idx + 1].size : undefined;
}

function getPrevSize(size: string): string | undefined {
  const idx = SIZE_CHART.findIndex(s => s.size === size);
  return idx > 0 ? SIZE_CHART[idx - 1].size : undefined;
}
