import Category from '../models/Category.js';
import Offer from '../models/Offer.js';
import Product from '../models/Product.js';

export const getDashboardStats = async (req, res, next) => {
  try {
    const now = new Date();
    const activeOffersFilter = {
      isActive: true,
      $and: [
        { $or: [{ startDate: null }, { startDate: { $lte: now } }] },
        { $or: [{ endDate: null }, { endDate: { $gte: now } }] },
      ],
    };

    const [
      totalProducts,
      activeProducts,
      totalCategories,
      bestsellersCount,
      lowStockProducts,
      activeOffers,
      recentProducts,
    ] = await Promise.all([
      Product.countDocuments(),
      Product.countDocuments({ isActive: true }),
      Category.countDocuments(),
      Product.countDocuments({ isBestseller: true }),
      Product.countDocuments({ stock: { $gt: 0, $lte: 5 } }),
      Offer.countDocuments(activeOffersFilter),
      Product.find({})
        .sort({ createdAt: -1 })
        .limit(6)
        .populate('category', 'name slug')
        .select('name slug price stock isActive isBestseller isFeatured images category createdAt'),
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalProducts,
        activeProducts,
        totalCategories,
        bestsellersCount,
        lowStockProducts,
        activeOffers,
      },
      recentProducts,
    });
  } catch (error) {
    next(error);
  }
};
