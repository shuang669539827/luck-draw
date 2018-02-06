<template>
	<wrap :isUpdate="isUpdate" @onBack="onBack" :isRemoveButton="!isAllowBack" >
		<!-- 布局 -->
		<div class="after ">
			<wrap-title class="tit">
				<h2 class="h2">{{prizeMess.prize&&prizeMess.prize.name}}</h2>
			</wrap-title>
			<transition name="slide-fade">
				<div class="person-list " v-if="winner.length" :class="boxLayout">
				
					<div class="person" v-for="(item,index) in winner" :key="index">
						<div class="pic">
							<img :src="item.img">
						</div>
						<div class="text">
							<h3>{{item.name}}</h3>
							<p>{{item.branch}}</p>
						</div>
						<div class="person-brush" v-if="stopIndex<index" >
							<div class="pic" >
								<div class="pic-div-box">
									<!-- <div 
										class="pic-div"
										:style="{backgroundImage:`url(${randomImage(index)})`}"
									/> -->
									<canvas ref="cvs" ></canvas>
									<!-- <img :src="randomImage(index)"/> -->
								</div>								
							</div>
							<div class="text">
								<h3>{{randomName(index)}}</h3>
								<p>{{randomBranch(index)}}</p>
							</div>
							<!-- <div class="pic-div-box" :style="{transform:`translateX(-${getPrizeNum[index]*100}px)`}"	>
								<div class="pic-div" v-for="(item,j) in employeceMess"  :key="j">
									<div class="pic">
										<div class="pic-div" :style="{backgroundImage:`url(${item.img?item.img:''})`}" />
									</div>
									<div class="text">
										<h3>{{item?item.name:''}}</h3>
										<p>{{item?item.branch:''}}</p>
									</div>
								</div>
							</div> -->
						</div>
					</div>
				</div>
			</transition>
			<a class="stop-btn" v-if="!hasClick"  @click="stopDraw">停</a>
		</div>
	</wrap>

</template>
<script>
import Wrap from "../components/Wrap";
import wrapTitle from "../components/WrapTitle";
// import employeceMess from "../assets/personImageMap.js";
import ajax from "../js/ajax";

export default {
  data() {
    return {
      prizeMess: {},
      winner: [],
      brushList: [],
      getPrizeNum: [],
      boxLayout: "",
      setInter: "",
      stopIndex: -1,
      isUpdate: false,
      isAllowBack: false,
      hasClick: false
    };
  },
  mounted() {
    this.$ctrl.$on("entered", res => {
      
    });
    ajax("/index.php?ac=not_winners", res => {
        if (res.code === 0) {
          this.employeceMess = res.data;
          this.prizeMess = JSON.parse(localStorage.getItem("prizeMess"));
          this.drawEffects();
          this.winner = JSON.parse(localStorage.getItem("winner"));

          if (this.prizeMess.prizeNum <= 4) {
            this.boxLayout = "big-margin";
          } else if (
            this.prizeMess.prizeNum > 4 &&
            this.prizeMess.prizeNum <= 8
          ) {
            this.boxLayout = "common-margin";
          } else {
            this.boxLayout = "small-margin";
          }
        } else {
          alert(res.error);
        }
      });
  },
  methods: {
    stopDraw() {
      if (!this.hasClick) {
        this.hasClick = true;
        this.isUpdate = true;
        this.stopIndex++;
        let setInt = setInterval(() => {
          this.stopIndex++;
          if (this.stopIndex > this.prizeMess.prizeNum) {
            clearInterval(setInt);
            clearInterval(this.setInter);
            this.isAllowBack = true;
          }
        }, 1000);
      }
    },
    drawEffects() {
      let getPrizeNum;
      let a = [];
      let ctxs = [];
      let cvs=[];
      this.setInter = setInterval(() => {
        if (!this.test) {
          this.test = true;
          cvs=[...this.$refs.cvs]
          ctxs = cvs.map(item => item.getContext("2d"));
        }
        getPrizeNum = [];
        a = [];
        for (var i = 0; i < this.prizeMess.prizeNum; i++) {
          let j = Math.ceil(Math.random() * this.employeceMess.length);
          let item = this.employeceMess[j - 1];
          let img=window.picList[item.img];
          let H=(img.height*100)/img.width;
          getPrizeNum.push(j-1);
          a.push(item);
          cvs[i].width=img.width;
          // cvs[i].height=img.height;
          ctxs[i].clearRect(0,0,img.width,img.height);
          ctxs[i].drawImage(
            window.picList[item.img], 
            0, (img.height-img.width)/2,img.width,img.width,
            0,0,cvs[i].width,cvs[i].height);
        }
        this.brushList = a;
        this.getPrizeNum = getPrizeNum;
      }, 100);
    },
    onBack() {
      if (this.isAllowBack) {
        this.$router.push("/");
      }
    },
    randomItem(index) {
      let a = this.employeceMess;
      let b = this.getPrizeNum;
      return a[b[index]];
    },
    randomName(index) {
      const data = this.randomItem(index);
      return data ? data.name : "";
    },
    randomBranch(index) {
      const data = this.randomItem(index);
      return data ? data.branch : "";
    },
    randomImage(index) {
      const data = this.randomItem(index);
      return data ? window.picList[data.img] : "";
    }
  },
  components: {
    Wrap,
    wrapTitle
  }
};
</script>
<style>
.btn,
.down {
  cursor: pointer;
}
.after {
  width: 1387px;
  margin: 0 auto;
  padding-top: 180px;
}

.tit .h2 {
  font-size: 36px;
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
  position: relative;
  display: inline-block;
  width: 110px;
  height: 159px;
  padding-top: 2px;
  background-image: url(../assets/person-bg.png);
  background-repeat: no-repeat;
  background-size: 100%;
}
.person-brush {
  position: absolute;
  top: 2px;
  left: 5px;
  width: 100px;
  overflow: hidden;
}
.person-brush .pic {
  background: #000;
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
  width: 100%;
}

.pic-div-box {
  white-space: nowrap;
  width: 100px;
  height: 101px;
}
.pic-div-box canvas{
  width:100px;
  height: 101px;
  filter: blur(.5px)
}
.pic-div {
  display: inline-block;
  height: 100%;
  width: 100%;
  background-size: cover;
  background-position: center center;
}
.text {
  background-color: #e5bf6b;
  margin: 0 11px;
}
.text h3 {
  width: 100%;
  color: #170901;
  font-size: 20px;
}
.text p {
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #170901;
  font-size: 13px;
}
.big-margin .person {
  margin-left: 50px;
  margin-right: 50px;
  transform: scale(1.6);
}
.common-margin .person {
  margin-left: 25px;
  margin-right: 25px;
  transform: scale(1.3);
}

.small-margin .person {
  margin-left: 15px;
  margin-right: 15px;
  margin-bottom: 20px;
}
.stop-btn {
  cursor: pointer;
  position: absolute;
  /*top: 50%;*/
  left: 50%;
  bottom: 128px;
  transform: translate3d(-50%, 0, 0);
  -webkit-transform: translate3d(-50%, 0, 0);
  width: 190px;
  line-height: 45px;
  height: 45px;
  font-size: 21px;
  text-align: center;
  font-weight: 600;
  color: #2f1701;
  background-image: url(../assets/big-btn.png);
}
.stop-btn-active {
  filter: grayscale(1);
}
</style>