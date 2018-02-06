<template>
  <wrap  @onBack="back">
	<div class="page-record">
			<wrap-title class="page-record-title">
			    <h2 style="font-size:35px;">中奖纪录</h2>
      </wrap-title>
      <div class="page-record-body" >
        <div 
          style="width:100%;height:100%;overflow:auto" 
          ref="body"
        >
          <div 
            class="page-record-content" 
            ref="content" 
          >
            <template v-for="(item,index) in winnerData"  >
              <section  :key="index" v-if="index!==winnerData.length-1">
                <div class="record-tt">
                  <h3>{{item.name}} {{item.list.length}}人</h3>
                </div>
                <div class="record-ct">
                  <div 
                    v-for="(winner,j) in item.list" 
                    :key="j" 
                    class="person"
                  >
                    <div class="pic"><img :src="winner.img"></div>
                    <div class="text">
                      <h3>{{winner.name}}</h3>
                      <p>{{winner.branch}}</p>
                    </div>
                  </div>
                </div>
              </section>
              <section :key="index" v-else>
                <div class="record-tt">
                  <h3>{{item.name}} {{item.list.length}}人</h3>
                </div>
                <div class="record-ct record-ct-bt">
                  <div 
                    v-for="(item,i) in item.list" 
                    :key="i" 
                  >{{item.name}}</div>
                </div>
              </section>
            </template>
          </div>
          
        </div>
        <div 
            @mouseover="bodyover"
            @mouseout="bodyout"
            @mousewheel="wheel"
            :style="{
              position:'absolute',
              left:0,
              top:0,
              width:'100%',
              height:'100%',
            }" />
      </div>
      
    </div>
  </wrap>
</template>
<script>
import Wrap from "../components/Wrap";
import WrapTitle from "../components/WrapTitle";
import ajax from "../js/ajax";
import dd from "../assets/personImageMap";
export default {
  components: {
    Wrap,
    WrapTitle
  },
  data() {
    return {
      winnerData: [],
      loserList: [],
      translateY: 0,
      isUpdate: false
    };
  },
  computed: {
    contentStyle() {
      return {
        transform: `translateY(-${this.translateY}px)`
      };
    }
  },
  methods: {
    back() {
		this.isRun=false;
      this.$router.push("/");
    },
    bodyover(e) {
      this.isRun = false;
    },
    bodyout(e) {
      this.isRun = true;
      this.lastTime = new Date().getTime();
      this.run();
    },
    wheel(e) {
      this.translateY += e.deltaY;
      if (this.translateY < 0) {
        this.translateY = 0;
      }
      if (this.translateY > this.scrollHeight) {
        this.translateY = this.scrollHeight;
      }
      this.$refs.body.scrollTop = this.translateY;
    },
    run() {
      if (this.isRun) {
        let now = new Date().getTime();
        let dist = now - this.lastTime;
        this.translateY += this.v * dist;
        this.lastTime = now;
        if (this.translateY >= this.scrollHeight) {
          // console.log(this.isRun)
          this.isRun = false;
          //   this.translateY=0;
        }
        this.$refs.body.scrollTop = this.translateY;
        // console.log(this.translateY)
        requestAnimationFrame(this.run);
      }
    }
  },
  mounted() {
    this.time = window.recordRunTime || 5;
    this.translateY = 0;
    this.v = 0;
    this.lastTime = new Date().getTime();
    ajax("/index.php?ac=winners", res => {
      if (res.code === 0) {
        this.winnerData = Object.keys(res.data)
          .sort((a, b) => b - a)
          .map(attr => res.data[attr]);
        this.$nextTick(() => {
          this.v =
            this.$refs.body.scrollHeight * 60 / (this.time * 1000 * 1000);
          console.log(this.v);
          this.$refs.content.style.transition = "all .1s";
          this.scrollHeight = this.$refs.body.scrollHeight;
          this.lastTime = new Date().getTime();
          // this.isRun=true;
          // this.run();
        });
      } else {
        alert(res.error);
      }
    });
  },
  beforedestroy(){
	  this.isRun=false;
  }
};
</script>
<style>
.page-record {
  position: absolute;
  top: 157px;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.page-record-body {
  position: relative;
  flex: 1;
  width: 913px;
  overflow: hidden;
}
.record-tt {
  font-size: 20px;
  color: #eabf5e;
}
.record-ct {
  display: flex;
  justify-content: center;
  width: 100%;

  flex-wrap: wrap;
  text-align: center;
}
.record-ct .person {
  margin: 15px;
}
.record-ct .pic {
  overflow: hidden;
}
.record-ct-bt {
  justify-content: flex-start;
  margin-bottom: 100px;
}
.record-ct-bt div {
  margin-right: 15px;
  font-size: 20px;
  color: #ece1c9;
}
::-webkit-scrollbar {
  width: 0px;
}
</style>
