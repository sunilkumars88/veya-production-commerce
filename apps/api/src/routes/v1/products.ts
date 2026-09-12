import { Router } from 'express';
import { db } from '../../lib/db.js';
import { sendError, sendSuccess } from '../../lib/errors.js';
import { PrismaSearchProvider } from '../../../../../packages/integrations/src/search.js';

const router = Router();
const search = new PrismaSearchProvider(db);

router.get('/', async (req, res) => {
  try {
    const { category, collection, page = '1', limit = '24', sort } = req.query;
    const where: any = { active: true };
    if (category) where.category = { slug: String(category) };
    if (collection) where.collections = { some: { collection: { slug: String(collection) } } };

    const orderBy: any = { createdAt: 'desc' };
    if (sort === 'price_asc') orderBy.price = 'asc';
    if (sort === 'price_desc') orderBy.price = 'desc';
    if (sort === 'popular') orderBy.bestSeller = 'desc';

    const [items, total] = await Promise.all([
      db.product.findMany({
        where,
        include: { variants: { where: { active: true } }, images: { orderBy: { sort: 'asc' }, take: 1 }, category: true },
        orderBy,
        skip: (Number(page) - 1) * Number(limit),
        take: Number(limit),
      }),
      db.product.count({ where }),
    ]);
    sendSuccess(res, { items, total, page: Number(page), limit: Number(limit), pages: Math.ceil(total / Number(limit)) });
  } catch (e) { sendError(res, e, req.headers['x-request-id'] as string); }
});

router.get('/search', async (req, res) => {
  try {
    const { q, page, limit, ...filters } = req.query;
    const result = await search.search(String(q || ''), filters, Number(page) || 1, Number(limit) || 24);
    sendSuccess(res, result);
  } catch (e) { sendError(res, e); }
});

router.get('/search/suggest', async (req, res) => {
  try {
    const suggestions = await search.suggest(String(req.query.q || ''));
    sendSuccess(res, suggestions);
  } catch (e) { sendError(res, e); }
});

router.get('/:slug', async (req, res) => {
  try {
    const product = await db.product.findUnique({
      where: { slug: req.params.slug },
      include: {
        variants: { where: { active: true } },
        images: { orderBy: { sort: 'asc' } },
        category: true,
        reviews: { where: { approved: true }, include: { user: { select: { name: true } } }, orderBy: { createdAt: 'desc' }, take: 20 },
        collections: { include: { collection: true } },
      },
    });
    if (!product) return res.status(404).json({ success: false, error: { code: 'PRODUCT_NOT_FOUND', message: 'Product not found' } });

    const related = await db.product.findMany({
      where: { categoryId: product.categoryId, active: true, id: { not: product.id } },
      include: { images: { take: 1 }, variants: { take: 1 } },
      take: 4,
    });

    sendSuccess(res, { ...product, related });
  } catch (e) { sendError(res, e); }
});

export default router;
