// composables/usePromo.js
export const usePromo = () => {
  const promotions = {
    "Business Insider": 15,
    "AD Digital": 10,
    "VK Saturday Plus": 10,
    "National Geographic": 12,
  };

  const getPromoDiscount = (product) => {
    const title = product?.title || product?.name || '';
    const brand = product?.brand || '';
    const key = Object.keys(promotions).find(k =>
      title.toLowerCase().includes(k.toLowerCase()) ||
      brand.toLowerCase().includes(k.toLowerCase())
    );
    return key ? promotions[key] : 0;
  };

  const calculatePromoPrice = (originalPrice, discountPercent) => {
    if (!discountPercent || discountPercent <= 0) return originalPrice;
    const discount = (originalPrice * discountPercent) / 100;
    return Number((originalPrice - discount).toFixed(2));
  };

  const getPromoInfo = (product) => {
    const discountPercent = getPromoDiscount(product);
    const originalPrice = product?.price || 0;
    const promoPrice = calculatePromoPrice(originalPrice, discountPercent);
    return {
      hasPromo: discountPercent > 0,
      discountPercent,
      originalPrice,
      promoPrice,
    };
  };

  return {
    getPromoDiscount,
    calculatePromoPrice,
    getPromoInfo,
  };
};