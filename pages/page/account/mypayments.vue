<template>
    <div class="dashboard-right">
        <div class="dashboard">
            <div class="page-title">
                <h2>My Payment Methods</h2>
            </div>
            <div class="welcome-msg">
                <p>Hello, {{ user?.FirstName }} {{ user?.LastName }}</p>
                <p>From here, you can view your saved payment methods.</p>
            </div>

            <div class="box-account box-info">
                <div>
                    <div class="box">
                        <div class="row mx-auto h-25" v-if="payments.length">
                            <div class="card my-3 p-0" v-for="(item, index) in payments" :key="index">
                                <div class="card-header">
                                    <div class="d-flex justify-content-between align-items-center">
                                        <div class="d-flex align-items-center">
                                            <span class="fw-bold">{{ item.CardType }}</span>
                                            <button type="button" class="btn status-btn mx-3"
                                                :class="item.Status === 'Active' ? 'active' : 'inactive'">
                                                {{ item.Status }}
                                            </button>
                                        </div>
                                        <div class="d-flex align-items-center">
                                            <div class="dropdown">
                                                <a class="btn btn-outline-primary btn-sm dropdown-toggle text-black-50 text-white"
                                                    href="#" role="button" data-bs-toggle="dropdown"
                                                    aria-expanded="false"></a>
                                                <ul class="dropdown-menu">
                                                    <li>
                                                        <a class="dropdown-item text-black" href="#">
                                                            Edit Payment Method
                                                        </a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="card-body">
                                    <div class="row">
                                        <div class="col d-flex flex-column">
                                            <span class="fw-bold">Card Holder:</span>
                                            <span>{{ item.CardHolderName }}</span>
                                        </div>
                                        <div class="col d-flex flex-column">
                                            <span class="fw-bold">Card Last 4 digits:</span>
                                            <span>**** **** **** {{ item.CardLastFour }}</span>
                                        </div>
                                        <div class="col d-flex flex-column">
                                            <span class="fw-bold">Expiry:</span>
                                            <span>{{ item.ExpiryMonth }}/{{ item.ExpiryYear }}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- If no payments -->
                        <div class="col-sm-12 empty-cart-cls text-center py-5" v-else>
                            <img src="/images/icon-empty-cart.png" class="img-fluid" alt="empty Payments" />
                            <h3 class="mt-3">
                                <strong>You have no payment methods at the moment!</strong>
                            </h3>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        payments: {
            type: Array,
            default: () => [],
        },
        user: {
            type: Object,
            default: () => ({}),
        },
    },
};
</script>

<style scoped>
.status-btn {
    height: 22px;
    padding: 0 10px;
    color: white;
    font-size: x-small;
    border-radius: 10px;
}

.active {
    background-color: green;
}

.inactive {
    background-color: goldenrod;
}
</style>