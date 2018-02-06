<template>
    <wrap :isRemoveButton="true">
        <!-- 布局 -->
        <div class="section config">
             <wrap-title>
                <h2>等待配置奖品</h2>
            </wrap-title>	
            <div class="person-config">
                <div class="select-box box" >
                    <ul v-if="selectShow">
                        <li v-for="item in prizeList" @click="selectPrizetype(item)">{{item.name}}</li>
                    </ul>
                    <div class="select-value">{{prize.name?prize.name:'选择抽奖类型'}}</div>
                    <a class="down" @click="selectShow=!selectShow"></a>
                </div>
    
                <div class="ipt box"><input type="text" @input="inp" :value="prizeNum" name="" placeholder="输入抽奖数量" /></div>	
                <a class="box btn sure-btn" @click="commitMess">确定提交</a>
                <a class="box btn record-btn" @click="goRecord">中奖记录</a>
    
            </div>
    
        </div>
    
    </wrap>
</template>
<script>
import Wrap from "../components/Wrap";
import wrapTitle from "../components/WrapTitle";
import ajax from "../js/ajax";

// import FN from "../js/common/fn";

export default {
  data() {
    return {
      selectShow: false,
      prizeList: [],
      prize: {},
      prizeNum: ""
    };
  },
  created() {
    ajax("/index.php?ac=prize_list", res => {
		if(res.code===0){
      localStorage.setItem("prizeType", JSON.stringify(res.data));
      // this.$ctrl.$emit('prizeTypeUpdate',res.data)
	  this.prizeList = res.data;}
	  else{
          alert(res.error)
        }
    });
  },
  mounted() {},
  methods: {
    selectPrizetype(item) {
      this.prize = { ...this.prize, ...item };
      this.selectShow = false;
      // console.log(this.prize,'this.prize')
    },
    commitMess() {
      if(!this.prize.name||!this.prizeNum){
        return
      }
      localStorage.setItem(
        "prizeMess",
        JSON.stringify({ prize: this.prize, prizeNum: this.prizeNum })
      );
      this.$router.push("/before");
    },
    goRecord() {
      this.$router.push("/record");
    },
    inp(e) {
      let value = e.target.value;
      if (/[^\d]/.test(value)) {
        value = value.replace(/[^\d]/g, "");
      }
      if (parseInt(value) > 20) {
        value = "20";
      }
      value = parseInt(value);
      e.target.value = isNaN(value) ? "" : value;
      this.prizeNum = isNaN(value) ? "" : value;
    }
  },

  components: {
    Wrap,
    wrapTitle
  }
};
</script>
<style>
.config {
  padding-top: 180px;
}
.person-config {
  width: 684px;
  position: absolute;
  margin-left: -342px;
  left: 50%;
  bottom: 57px;
  font-size: 0;
}

.person-config .select-box {
  position: relative;
  width: 201px;
  line-height: 34px;
  background-image: url(../assets/select-bg.png);
  font-size: 13px;
  color: #fff;
  padding-left: 21px;
  box-sizing: border-box;
  -webkit-box-sizing: border-box;
}

.select-box .down {
  position: absolute;
  width: 36px;
  height: 36px;
  right: 0;
}

.select-box ul {
  width: 157px;
    position: absolute;
    left: 0;
    bottom: 34px;
    padding: 6px 21px;
    border: 1px solid #f2b327;
}

.select-box ul li {
  cursor: pointer;
  list-style: none;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  line-height: 24px;
}

.select-value {
  display: inline-block;
  width: 140px;
  height: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.person-config .box {
  display: inline-block;
  height: 34px;
  background-size: 100%;
  vertical-align: middle;
}

.person-config .ipt {
  margin: 0 20px;
  width: 135px;
  background-image: url(../assets/input-bg.png);
}

.ipt input {
  width: 100%;
  height: 100%;
  background: transparent;
  border: none;
  text-align: center;
  font-size: 13px;
  color: #fff;
  outline: none;
}

.person-config .btn {
  width: 147px;
  line-height: 34px;
  font-size: 16px;
  text-align: center;
  font-weight: 600;
  color: #2f1701;
  background-image: url(../assets/common-btn.png);
}

.person-config .sure-btn {
  margin-right: 10px;
}
.btn{
  cursor: pointer;
  user-select: none
}
</style>