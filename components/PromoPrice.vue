<template>
  <div class="promo-price">
    <span v-if="promoInfo.hasPromo" class="original-price">
      <del>£ {{ promoInfo.originalPrice }}</del>
    </span>
    <span class="current-price">
      £ {{ promoInfo.hasPromo ? promoInfo.promoPrice : promoInfo.originalPrice }}
    </span>
    <span v-if="promoInfo.hasPromo" class="discount-badge">
      ({{ promoInfo.discountPercent }}% OFF)
    </span>
  </div>
</template>

<script>
import { usePromo } from '~/composables/usePromo';
import pkg from "lodash";
const { find } = pkg;

export default {
  props: {
    product: {
      type: Object,
      required: true,
    },
    price: {
      type: Number,
      default: null,
    },
  },
  computed: {
    originalPrice() {
      if (this.price !== null) {
        return Number(this.price.toFixed(2));
      }
      const exists = find(this.product.prices, { isDefault: true });
      if (exists) {
        return Number(exists?.price?.toFixed(2)) ?? 0;
      }
      return Number(this.product?.prices[0]?.price.toFixed(2)) ?? 0;
    },
    promoInfo() {
      const { getPromoInfo } = usePromo();
      const productWithPrice = { ...this.product, price: this.originalPrice };
      return getPromoInfo(productWithPrice);
    },
  },
};
</script>

<style scoped>
.promo-price {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.original-price {
  color: #888;
  font-size: 0.9em;
}

.current-price {
  font-weight: bold;
  color: #e74c3c; /* or your theme color */
}

.discount-badge {
  background-color: #27ae60;
  color: white;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.8em;
  font-weight: bold;
}
</style>