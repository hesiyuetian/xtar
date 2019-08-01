<template>
  <div id="app">
    <img @click.native='t()' src="./assets/logo.png">
    {{G_GET_NUMBER}}
    <!-- <xtar-paginator></xtar-paginator>
    <xtar-date></xtar-date> -->
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import {
  G_GET_NUMBER
} from "./store/exchang/types";
export default {
  name: 'app',
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  },
  created() {
    console.log(1212)
    alert(212)
  },
  methods: {
    t(){
      alert(212)
    }
  },
  computed: {
    ...mapGetters([G_GET_NUMBER])
  },
}
</script>

<style lang="scss" scoped>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

h1, h2 {
  font-weight: normal;
}

ul {
  list-style-type: none;
  padding: 0;
}

li {
  display: inline-block;
  margin: 0 10px;
}

a {
  color: #42b983;
}
</style>
