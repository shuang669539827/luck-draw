<template>
  <div id="app">
	<!--<config/>-->
	<!--<before/>-->
	 <!--<after/>--> 
	<!--<record/>-->
	
	<transition name='slide-fade' appear mode='out-in' @after-enter="entered">
		<router-view :key="3"></router-view>
	</transition>

  <!-- <div v-if="isLoading" class="loading-div">
    <div class="loading-content">
      
    </div>
  </div> -->
	
  </div>
</template>

<script>
import ajax from "./js/ajax";
export default {
  name: "App",
  components: {
    // Config,
    // Before,
    // After,
    // Record
  },
  data() {
    return {
      isLoading: true,
      loadingText: "",
    };
  },
  methods: {
    entered() {
      this.$ctrl.$emit("entered");
    }
  },
  created() {
    var json = {};
    var l = 0;

    ajax("/test.json", o => {
      l=o.length;
      o.forEach(item => {
        json[item.img]=new Image();
        json[item.img].src=item.img;
      });
      window.picList=json;
    });
  },
  mounted() {
    localStorage.clear();

    this.$ctrl.$on("winnerNumberUpdate", () => {
      ajax("/index.php?ac=count", res => {
        if (res.code === 0) {
          this.number = res.data.data_num;
          this.winner = res.data.winners_num;
        } else {
          alert(res.error);
        }
      });
    });
    // window.addEventListener("error", res => {
    //   location.replace("/index.html");
    // });
  }
};
</script>

<style>
* {
  margin: 0;
  padding: 0;
}
html,
body {
  /* overflow: hidden; */
  overflow-x: hidden;
  background-image: url("./assets/app/background.png");
  background-size: auto 100%;
  background-position: top center;
  background-attachment: fixed;
}
html,
body,
#app,
#starBg {
  width: 100%;
  height: 100%;
  overflow: hidden;
}
#app {
  margin: auto;
}
#app,
#starBg {
  position: absolute;
  top: 0;
  left: 0;
}
.person-list {
  width: 100%;
  text-align: center;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  -webkit-transform: translate3d(-50%, -50%, 0);
}

.person {
  display: inline-block;
  width: 110px;
  height: 159px;
  padding-top: 2px;
  background-image: url(./assets/person-bg.png);
  background-size: 100%;
}
.pic {
  position: relative;
  width: 100px;
  height: 101px;
  margin: auto;
  overflow: hidden;
}
.pic img {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  width:100px;
}
.text h3 {
  color: #170901;
  font-size: 20px;
}
.text p {
  color: #170901;
  font-size: 13px;
}

.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.5s;
}
.slide-fade-enter,
.slide-fade-leave-active {
  opacity: 0;
}
.slide-fade-enter {
  transform: translateY(100%);
}
.slide-fade-leave-active {
  transform: translateY(-100%);
}

.loading-div {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  color:#fff;
}
.loading-content{

}
</style>
