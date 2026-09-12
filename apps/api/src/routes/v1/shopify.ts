import { Router } from 'express';
import { db } from '../../lib/db.js';
import { sendError, sendSuccess } from '../../lib/errors.js';
import { requireAdmin } from '../../middleware/auth.js';
import { getShop, listProducts, listOrders, syncProductToLocal } from '../../../../../packages/integrations/src/shopify.js';

const router = Router();

router.get('/shop', requireAdmin, async (_req, res) => {
  try { sendSuccess(res, await getShop()); }
  catch (e) { sendError(res, e); }
});

router.post('/sync/products', requireAdmin, async (_req, res) => {
  try {
    const data = await listProducts();
    const defaultCat = await db.category.findFirst();
    if (!defaultCat) throw new Error('No category found. Run seed first.');
    const nodes = data?.products?.nodes || [];
    let synced = 0;
    for (const sp of nodes) {
      await syncProductToLocal(db, sp, defaultCat.id);
      synced++;
    }
    sendSuccess(res, { synced, total: nodes.length });
  } catch (e) { sendError(res, e); }
});

router.post('/sync/orders', requireAdmin, async (_req, res) => {
  try {
    const data = await listOrders();
    sendSuccess(res, { orders: data?.orders?.nodes || [] });
  } catch (e) { sendError(res, e); }
});

export default router;
