<template>
    <!-- BACKDROP -->
    <div class="modal-backdrop fade show" v-if="isOpen || showConfirmModal"></div>
    <!-- MAIN UPGRADE MODAL -->
    <div class="modal fade show d-block bd-example-modal-lg theme-modal cart-modal" v-if="isOpen" aria-hidden="true"
        role="dialog">
        <div class="modal-dialog modal-xl modal-dialog-centered">
            <div class="modal-content">
                <div class="modal-body modal1 bg-gradient">
                    <div class="container-fluid p-0">
                        <div class="row cart-modal">
                            <div class="col-lg-12 position-relative">
                                <div class="modal-bg addtocart">
                                    <!-- Header -->
                                    <div class="modal-header justify-content-center">
                                        <div class="d-flex flex-column text-center">
                                            <h3>Upgrade Subscription</h3>
                                            <span>Select a new plan to upgrade your subscription</span>
                                        </div>
                                    </div>

                                    <button class="close btn-close" type="button" @click="$emit('close')">
                                        <span>x</span>
                                    </button>

                                    <!-- Current & Upgrade Options -->
                                    <div class="row my-3 g-3">
                                        <!-- LEFT SIDE: Current Asset -->
                                        <div class="col-md-4">
                                            <div class="card text-center p-3 h-100">
                                                <h3>CURRENT PLAN</h3>
                                                <div>
                                                    <img :src="currentAsset?.Product2?.DisplayUrl || '/images/image.png'"
                                                        alt="Current Plan Image" class="img-fluid mb-3"
                                                        style="max-height: 200px; object-fit: cover;" />
                                                    <h4 class="card-title">{{ currentAsset?.Product2?.Name }}</h4>
                                                    <h5 class="card-text">
                                                        £ {{ Number(currentAsset?.TotalLifecycleAmount?.toFixed(2)) ?? 0
                                                        }}
                                                    </h5>
                                                    <p>{{ currentAsset?.CurrentQuantity }} Users</p>
                                                    <p>
                                                        Period:
                                                        {{ dateFormat(currentAsset?.LifecycleStartDate) }}
                                                        -
                                                        {{ dateFormat(currentAsset?.LifecycleEndDate) }}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <!-- RIGHT SIDE: Upgrade Options -->
                                        <div class="col-md-8">
                                            <div class="card p-3 h-100 d-flex flex-column">
                                                <h4>Available Upgrade Plans</h4>
                                                <!-- Loader Skeletons -->
                                                <div v-if="loading" class="row g-3">
                                                    <div class="col-12 col-sm-6 col-lg-4" v-for="n in 3" :key="n">
                                                        <div class="card h-100 p-3">
                                                            <div class="placeholder-glow">
                                                                <div class="placeholder w-100 mb-3"
                                                                    style="height: 300px;"></div>
                                                                <h5 class="card-title">
                                                                    <span class="placeholder col-8"></span>
                                                                </h5>
                                                                <p class="card-text">
                                                                    <span class="placeholder col-6"></span>
                                                                </p>
                                                                <button type="button"
                                                                    class="btn btn-primary disabled placeholder col-6 mt-2"></button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div v-else class="flex-grow-1 overflow-auto pe-2"
                                                    style="max-height: 70vh;">
                                                    <div class="row g-3">
                                                        <div class="col-12 col-sm-6 col-lg-4"
                                                            v-for="(product, idx) in upgradeOptions" :key="idx">
                                                            <div class="card h-100">
                                                                <img :src="product?.displayUrl || '/images/image.png'"
                                                                    class="card-img-top" alt="Product Image"
                                                                    style="object-fit: cover; height: 150px;" />
                                                                <div
                                                                    class="card-body d-flex flex-column justify-content-between">
                                                                    <div>
                                                                        <h5 class="card-title">{{ product?.name }}
                                                                        </h5>
                                                                        <p class="card-text text-muted">
                                                                            £ {{ Number(product?.prices?.[0]?.price
                                                                                ?? 0).toFixed(2) }}
                                                                        </p>
                                                                    </div>
                                                                    <button type="button" class="btn btn-primary mt-2"
                                                                        @click="openConfirmModal(product)"
                                                                        :disabled="loadingProductId === product.id"
                                                                        >
                                                                        <span v-if="loadingProductId === product.id" class="spinner-border spinner-border-sm me-2"></span>
                                                                            {{ loadingProductId === product.id ? "Loading..." : "Upgrade" }}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div v-if="!loading && !upgradeOptions.length" class="text-center mt-3">
                                                    <p class="text-muted">No upgrade options available</p>
                                                </div>
                                            </div>
                                        </div> <!-- row -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- CONFIRM UPGRADE MODAL -->
        <div class="modal fade show d-block theme-modal cart-modal" v-if="showConfirmModal" aria-hidden="true"
            role="dialog">
            <div class="modal-dialog modal-lg modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-body p-4 bg-gradient">
                        <div class="modal-header border-0">
                            <h4 class="modal-title">Confirm Upgrade</h4>
                            <button class="btn-close" type="button" @click="closeConfirmModal"></button>
                        </div>

                        <div class="row align-items-center">
                            <div class="col-md-4 text-center">
                                <img :src="selectedProduct?.displayUrl || '/images/image.png'" alt="Product Image"
                                    class="img-fluid" style="max-height:200px; object-fit:cover;" />
                            </div>

                            <div class="col-md-8">
                                <h5>{{ selectedProduct?.Name }}</h5>

                                <h6 class="mt-3">Select Plan</h6>
                                <div class="d-flex flex-wrap gap-2">
                                    <button v-for="(price, idx) in selectedProduct?.prices" :key="idx" class="btn"
                                        :class="{
                                            'btn-primary': selectedPlan?.priceBookEntryId === price?.priceBookEntryId,
                                            'btn-outline-primary': selectedPlan?.priceBookEntryId !== price?.priceBookEntryId
                                        }" @click="selectPlan(price)">
                                        {{ price?.pricingModel?.frequency ?? 'OneTime' }}
                                        - £{{ Number(price?.price ?? 0).toFixed(2) }}
                                    </button>
                                </div>

                                <h6 class="mt-4">Quantity</h6>
                                <div class="d-flex align-items-center">
                                    <button class="btn btn-outline-secondary" @click="decrementQty">-</button>
                                    <input type="text" class="form-control mx-2 text-center" style="width:60px;"
                                        v-model="quantity" readonly />
                                    <button class="btn btn-outline-secondary" @click="incrementQty">+</button>
                                </div>
                            </div>
                        </div>

                        <!-- ACTIONS -->
                        <div class="text-end mt-4">
                            <button class="btn btn-secondary me-2" @click="closeConfirmModal">Cancel</button>
                            <button class="btn btn-primary" :disabled="!selectedPlan" @click="confirmUpgrade">
                                Confirm
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>


    </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useProductStore } from '~~/store/products'

const props = defineProps({
    isOpen: { type: Boolean, default: false },
    currentAsset: { type: Object, default: () => ({}) },
});

const emit = defineEmits(["close", "upgrade"]);

const products = ref([]);
const showConfirmModal = ref(false);
const selectedProduct = ref(null);
const selectedPlan = ref(null);
const quantity = ref(1);
const loading = ref(true);
const confirming = ref(false);
const loadingProductId = ref(null);

onMounted(async () => {
    try {
        const { $getProducts } = useNuxtApp();
        const response = await $getProducts();
        products.value = response?.result || [];
    } catch (e) {
        console.error("Failed to fetch products:", e);
    } finally {
        loading.value = false;
    }
});

const upgradeOptions = computed(() =>
    products.value.filter((p) => p.id !== props.currentAsset?.Product2?.Id)
);

const openConfirmModal = async (product) => {
    loadingProductId.value = product.id;
    selectedProduct.value = await useProductStore().getProductById(product.id)
    selectedPlan.value = selectedProduct.value?.prices?.[0] ?? null;
    quantity.value = 1;
    showConfirmModal.value = true;
    loadingProductId.value = null;
};

const closeConfirmModal = () => {
    showConfirmModal.value = false;
};

const selectPlan = (plan) => {
    selectedPlan.value = plan;
};

const confirmUpgrade = () => {
    confirming.value = true;
    emit("upgrade", {
        from: props.currentAsset,
        to: selectedProduct.value,
        plan: selectedPlan.value,
        qty: quantity.value,
    });
    closeConfirmModal();
    confirming.value = false;
    emit("close"); // close parent modal too
};

const incrementQty = () => quantity.value++;
const decrementQty = () => {
    if (quantity.value > 1) quantity.value--;
};

const dateFormat = (dateString) => {
    if (!dateString) return "-";
    const date = new Date(dateString);
    return `${String(date.getUTCDate()).padStart(2, "0")}/${String(
        date.getUTCMonth() + 1
    ).padStart(2, "0")}/${date.getUTCFullYear()}`;
};

</script>
