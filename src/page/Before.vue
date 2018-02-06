<template>
  <wrap @onBack="onBack">
	  <div class="page-before">
		  <wrap-title class="page-before-title">
			  <h2>本次抽取{{prize.name}} {{prizeNum}}人</h2>
		  </wrap-title>
		  <a class="button-begin" @click="luck"></a>
	  </div>
  </wrap>
</template>
<script>
import Wrap from "../components/Wrap";
import WrapTitle from "../components/WrapTitle";
import ajax from "../js/ajax";
export default {
  components: {
    Wrap,
    WrapTitle
  },
  data() {
    return {
      prize: {},
      prizeNum: 0
    };
  },
  methods: {
    onBack() {
      this.$router.go(-1);
    },
    luck() {
      if (!this.isClick) {
        this.isClick = true;
        ajax(
          `/index.php?ac=start&type=${this.prize.id}&num=${this.prizeNum}`,
          res => {
            localStorage.setItem("winner", JSON.stringify(res.data));
            this.$router.push("/after");
          }
        );
      }
    }
  },
  mounted() {
    try {
      const data = JSON.parse(localStorage.getItem("prizeMess"));
      this.prize = data.prize;
      this.prizeNum = data.prizeNum;
    } catch (error) {
		location.replace('/index.html')
	}
  }
};
</script>
<style>
.button-begin {
  position: absolute;
  bottom: 175px;
  left: 50%;
  transform: translateX(-50%);
  display: block;
  width: 191px;
  height: 48px;
  background: url(../assets/app/button-begin.png);
  background-size: 100% 100%;
}
.button-begin:active {
  opacity: 0.8;
}
.page-before-title {
  padding-top: 188px;
}
</style>
