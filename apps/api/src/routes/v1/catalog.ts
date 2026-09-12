import { Router } from 'express';
import { db } from '../../lib/db.js';
import { sendError, sendSuccess } from '../../lib/errors.js';

const router = Router();

router.get('/categories', async (_req, res) => {
  try {
    const categories = await db.category.findMany({
      where: { active: true, parentId: null },
      include: { children: { where: { active: true }, orderBy: { sort: 'asc' } } },
      orderBy: { sort: 'asc' },
    });
    sendSuccess(res, categories);
  } catch (e) { sendError(res, e); }
});

router.get('/categories/:slug', async (req, res) => {
  try {
    const category = await db.category.findUnique({
      where: { slug: req.params.slug },
      include: { children: true, parent: true },
    });
    if (!category) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Category not found' } });
    sendSuccess(res, category);
  } catch (e) { sendError(res, e); }
});

router.get('/collections', async (_req, res) => {
  try {
    const collections = await db.collection.findMany({ where: { active: true }, orderBy: { sort: 'asc' } });
    sendSuccess(res, collections);
  } catch (e) { sendError(res, e); }
});

router.get('/collections/:slug', async (req, res) => {
  try {
    const collection = await db.collection.findUnique({
      where: { slug: req.params.slug },
      include: {
        products: {
          include: { product: { include: { images: { take: 1 }, variants: { take: 1 } } } },
          orderBy: { sort: 'asc' },
        },
      },
    });
    if (!collection) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Collection not found' } });
    sendSuccess(res, collection);
  } catch (e) { sendError(res, e); }
});

router.get('/homepage', async (_req, res) => {
  try {
    const sections = await db.homepageSection.findMany({ where: { active: true }, orderBy: { sort: 'asc' } });
    const bestSellers = await db.product.findMany({
      where: { active: true, bestSeller: true },
      include: { images: { take: 1 }, variants: { take: 1 } },
      take: 8,
    });
    const newArrivals = await db.product.findMany({
      where: { active: true, newArrival: true },
      include: { images: { take: 1 }, variants: { take: 1 } },
      take: 8,
    });
    const faqs = await db.faq.findMany({ where: { active: true }, orderBy: { sort: 'asc' } });
    const reviews = await db.review.findMany({
      where: { approved: true },
      include: { product: { select: { title: true, slug: true } }, user: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
      take: 6,
    });
    sendSuccess(res, { sections, bestSellers, newArrivals, faqs, reviews });
  } catch (e) { sendError(res, e); }
});

router.get('/faqs', async (_req, res) => {
  try {
    const faqs = await db.faq.findMany({ where: { active: true }, orderBy: { sort: 'asc' } });
    sendSuccess(res, faqs);
  } catch (e) { sendError(res, e); }
});

router.get('/pages/:slug', async (req, res) => {
  try {
    const page = await db.contentPage.findUnique({ where: { slug: req.params.slug } });
    if (!page) return res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Page not found' } });
    sendSuccess(res, page);
  } catch (e) { sendError(res, e); }
});

export default router;
