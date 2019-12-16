<template>
</template>

<script>
export default {
  mounted() {
    this.getSize();
  },
  methods: {
    getSize() {
      const b_iframe = window.parent.parent.document.getElementById("Iframe");
      const hash_url = window.location.hash;
      if (hash_url.indexOf("#") >= 0) {
        const hash_height = hash_url.split("#")[2].split("|")[1] + "px";
        b_iframe.style.height = hash_height;
      }
    }
  }
};
</script>
