<template>
  <div>
    <section>
      <div class="container">
        <div class="row">
          <div class="col-lg-8 offset-lg-2">
            <div class="title3">
              <h2 class="title-inner3">{{title}}</h2>
              <div class="line"></div>
            </div>
            <div class="about-text">
              <p>{{text}}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>
<script>
export default {
  data() {
    return {
      title: 'Welcome to Nexus Global Holdings Webshop!',
      text: 'Explore our cutting-edge products designed to drive innovation and sustainability. As a diversified multinational corporation, we’re dedicated to providing advanced solutions across industries, connecting the world and shaping a better future. Discover how our technology can empower you today!',
    }
  }
}
</script>
