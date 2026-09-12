export interface SearchResult {
  items: any[];
  total: number;
  facets?: Record<string, any>;
}

export interface SearchProvider {
  search(query: string, filters?: Record<string, any>, page?: number, limit?: number): Promise<SearchResult>;
  suggest(query: string): Promise<string[]>;
}

export class PrismaSearchProvider implements SearchProvider {
  constructor(private db: any) {}

  async search(query: string, filters: Record<string, any> = {}, page = 1, limit = 24): Promise<SearchResult> {
    const where: any = { active: true };

    if (query) {
      where.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } },
        { fabric: { contains: query, mode: 'insensitive' } },
      ];
    }
    if (filters.category) where.category = { slug: filters.category };
    if (filters.minPrice) where.price = { ...where.price, gte: filters.minPrice };
    if (filters.maxPrice) where.price = { ...where.price, lte: filters.maxPrice };
    if (filters.fabric) where.fabric = { contains: filters.fabric, mode: 'insensitive' };

    const orderBy: any = { createdAt: 'desc' };
    if (filters.sort === 'price_asc') orderBy.price = 'asc';
    if (filters.sort === 'price_desc') orderBy.price = 'desc';
    if (filters.sort === 'popular') orderBy.bestSeller = 'desc';

    const [items, total] = await Promise.all([
      this.db.product.findMany({
        where,
        include: { variants: { where: { active: true } }, images: { orderBy: { sort: 'asc' }, take: 1 }, category: true },
        orderBy,
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.db.product.count({ where }),
    ]);

    return { items, total };
  }

  async suggest(query: string): Promise<string[]> {
    if (!query || query.length < 2) return [];
    const products = await this.db.product.findMany({
      where: { active: true, title: { contains: query, mode: 'insensitive' } },
      select: { title: true },
      take: 5,
    });
    return products.map((p: any) => p.title);
  }
}
