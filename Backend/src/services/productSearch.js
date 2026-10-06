import { ProductModel } from "../models/productsModel.js";

export const searchProducts = async ({
  category = null,
  minPrice = null,
  maxPrice = null,
  search = null,
  sortBy = null,
}) => {
  try {
    const query = {};

    // -----------------------------
    // CATEGORY
    // -----------------------------

    if (category) {
      query.category = {
        $regex: category,
        $options: "i",
      };
    }

    // -----------------------------
    // PRICE (Adjusted for 25% discount)
    // -----------------------------

    const parsedMin = minPrice !== null && minPrice !== undefined && minPrice !== "" ? Number(minPrice) : null;
    const parsedMax = maxPrice !== null && maxPrice !== undefined && maxPrice !== "" ? Number(maxPrice) : null;

    if ((parsedMin !== null && !isNaN(parsedMin)) || (parsedMax !== null && !isNaN(parsedMax))) {
      query.price = {};

      if (parsedMin !== null && !isNaN(parsedMin)) {
        query.price.$gte = parsedMin / 0.75;
      }

      if (parsedMax !== null && !isNaN(parsedMax)) {
        query.price.$lte = parsedMax / 0.75;
      }
    }

    // -----------------------------
    // TEXT SEARCH
    // -----------------------------

    if (search) {
      query.$or = [
        {
          title: {
            $regex: search,
            $options: "i",
          },
        },
        {
          category: {
            $regex: search,
            $options: "i",
          },
        },
        {
          description: {
            $regex: search,
            $options: "i",
          },
        },
      ];
    }

    // -----------------------------
    // SORTING
    // -----------------------------

    let sort = {};

    switch (sortBy) {
      case "price_asc":
        sort = { price: 1 };
        break;

      case "price_desc":
        sort = { price: -1 };
        break;

      case "rating_desc":
        sort = { rating: -1 };
        break;

      case "rating_asc":
        sort = { rating: 1 };
        break;

      default:
        sort = { rating: -1 };
    }

    // -----------------------------
    // DATABASE SEARCH
    // -----------------------------

    const products = await ProductModel.find(query)
      .sort(sort)
      .limit(10);

    return products;

  } catch (error) {
    console.error("Product search error:", error);
    throw error;
  }
};