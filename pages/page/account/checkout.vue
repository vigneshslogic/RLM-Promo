<template>
<Header/>
  <div>
    <WidgetsBreadcrumbs title="Checkout" />
    <PaymentPage :user-info="userInfo" />
  </div>
  <Footer />
</template>

<script setup>
const userInfo = useCookie('userInfo').value;

</script>
