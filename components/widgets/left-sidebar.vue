<template>
  <div id="mySidenav" class="sidenav" :class="leftSidebarVal ? 'openSide' : ''">
    <a class="sidebar-overlay" @click="closeLeftBar(leftSidebarVal)"></a>
    <nav>
      <a @click="closeLeftBar(leftSidebarVal)">
        <div class="sidebar-back text-left">
          <i class="fa fa-angle-left pe-2" aria-hidden="true"></i> Back
        </div>
      </a>

      <!-- Sample menu definition -->
      <ul 
        id="sub-menu" 
        class="sidebar-menu"
      >
        <li v-for="catalog in categories?.catalog">
          <a href="javascript:void(0)" @click="setActive(`${catalog?.name}`)"> 
            <span v-html="catalog?.name"></span>
            <span class="sub-arrow" v-if="getCategories(catalog?.name).length"></span>
          </a>
          <ul
            class="mega-menu clothing-menu"
            :class="{ opensidesubmenu: isActive(`${catalog?.name}`) }"
            v-if="getCategories(catalog?.name).length"
          >
            <li>
              <div class="row g-sm-4 g-3">
                <div
                  class="col-xl-4"
                  v-for="cat in getCategories(catalog?.name)"
                >
                  <div class="link-section">
                    <h5>{{ cat?.Name }}</h5>
                    <ul>
                      <li v-for="child in cat?.ChildCategories?.records ?? []">
                        <a href="#">{{ child.Name }}</a> 
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </li>
      </ul>
    </nav>
  </div>
</template>

<script>
import { useProductStore } from "~/store/products";

export default {
  props: ["leftSidebarVal"],
  data() {
    return {
      activeItem: "clothing",
      categories: [],
    };
  },
  watch: {
    leftSidebarVal: {
      handler(newValue, oldValue) {},
      deep: true,
    },
  },
  async mounted() {
    this.categories = await useProductStore().loadCategories();
  },
  methods: {
    getCategories(catalog) {
      return this.categories?.categories?.filter((cat) => (catalog === cat?.Catalog?.Name));
    },
    closeLeftBar(val) {
      val = false;
      this.$emit("closeVal", val);
    },
    isActive: function (menuItem) {
      return this.activeItem === menuItem;
    },
    setActive: function (menuItem) {
      if (this.activeItem === menuItem) {
        this.activeItem = "";
      } else {
        this.activeItem = menuItem;
      }
    },
  },
};
</script>
