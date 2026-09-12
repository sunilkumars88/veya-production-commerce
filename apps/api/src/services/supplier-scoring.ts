import { db } from '../lib/db.js';

interface ScoringWeights {
  cost: number;
  inventory: number;
  deliverySla: number;
  quality: number;
  returnRate: number;
  rtoRate: number;
}

const DEFAULT_WEIGHTS: ScoringWeights = {
  cost: 0.25,
  inventory: 0.20,
  deliverySla: 0.20,
  quality: 0.20,
  returnRate: 0.075,
  rtoRate: 0.075,
};

export async function scoreSuppliers(productId: string, weights = DEFAULT_WEIGHTS) {
  const supplierProducts = await db.supplierProduct.findMany({
    where: { productId, active: true },
    include: { supplier: true },
  });

  if (!supplierProducts.length) return [];

  const maxCost = Math.max(...supplierProducts.map(sp => sp.cost));

  return supplierProducts.map(sp => {
    const costScore = maxCost > 0 ? (1 - sp.cost / maxCost) * 100 : 50;
    const inventoryScore = Math.min(100, (sp.stock / 100) * 100);
    const slaScore = Math.max(0, 100 - sp.leadDays * 15);
    const qualityScore = sp.qualityScore;
    const returnScore = Math.max(0, 100 - sp.supplier.returnRate * 100);
    const rtoScore = Math.max(0, 100 - sp.supplier.rtoRate * 100);

    const score =
      costScore * weights.cost +
      inventoryScore * weights.inventory +
      slaScore * weights.deliverySla +
      qualityScore * weights.quality +
      returnScore * weights.returnRate +
      rtoScore * weights.rtoRate;

    return {
      supplierId: sp.supplierId,
      supplierName: sp.supplier.name,
      score: Math.round(score * 10) / 10,
      factors: {
        cost: Math.round(costScore),
        inventory: Math.round(inventoryScore),
        deliverySla: Math.round(slaScore),
        quality: qualityScore,
        returnRate: Math.round(returnScore),
        rtoRate: Math.round(rtoScore),
      },
    };
  }).sort((a, b) => b.score - a.score);
}

export async function selectBestSupplier(productId: string) {
  const scores = await scoreSuppliers(productId);
  return scores[0] || null;
}
