<template>
  <div class="wrap">
	  <slot></slot>
	  <!-- 中奖人数 -->
	  <div class="info-rect">参与抽奖人数:{{isUpdate?number:preNumber}}，中奖人数:{{isUpdate?winner:prewinner}}</div>
	  
	  <!-- 返回 -->
	  <a v-if="!isRemoveButton" class="button-rect" @click="onBack"></a>

	  <!-- 标题 -->
	  <div class="wrap-hd">
		  <div class="title-rect"></div>
	  </div>
	  
	  
  </div>
</template>
<script>
import ajax from "../js/ajax"
export default {
	props:{
		title:{
			type:String,
			default:''
		},
		isRemoveButton:{
			type:Boolean,
			default:false
		},
		isUpdate:{
			type:Boolean,
			default:true
		}
	},
	data(){
		return {
			number:0,
			winner:0,
			prewinner:localStorage.getItem('prewinner')||0,
			preNumber:localStorage.getItem('preNumber')||0
		}
	},
	watch:{
		isUpdate(n){
			if(n){
				this.update();
			}
		}
	},
	methods:{
		onBack(){
			this.$emit('onBack');
		},
		update(){
			ajax('/index.php?ac=count',res=>{
				if(res.code===0){
					this.number=res.data.data_num;
					this.winner=res.data.winners_num;
					localStorage.setItem('prewinner',this.winner)
					localStorage.setItem('preNumber',this.number)
				}
			})
		}
	},
	mounted(){
		if(this.isUpdate){
			this.update();
		}
	}
};
</script>
<style>
.wrap {
  position: relative;
  padding: 0 42px;
  height: 100%;
  border-bottom: 1px solid #000;
}
.info-rect {
  position: absolute;
  top: 51px;
  left: 42px;
  display: inline-block;
  width: 307px;
  height: 34px;
  line-height: 34px;
  text-align: center;

  color: #999;
  background-image: url(../assets/app/info-rect.png);
  background-size: 100% 100%;
}
.button-rect {
	cursor: pointer;
  position: absolute;
  bottom: 45px;
  right: 40px;
  display: inline-block;
  width: 184px;
  height: 43px;
  background-image: url(../assets/app/back-button.png);
  background-size: 100% 100%;
}
.button-rect:active {
  background-image: url(../assets/app/back-button-active.png);
}

.wrap-hd {
  position: absolute;
  top: 100px;
  left:50%;
  transform: translateX(-50%)
}

.title-rect {
  width: 520px;
  height: 57px;
  margin: auto;
  background-image: url(../assets/app/wrap-title.png);
  background-size: 100% 100%;
}

</style>

