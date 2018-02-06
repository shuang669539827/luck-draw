<template>
 	<div class="title-warp">
		<div class="title-warp-lt"></div>
		<slot></slot>
		<div class="title-warp-rt"></div>
	</div>
</template>
<script>
export default {
	props:['title']
};
</script>
<style>
.title-warp {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: auto;
}
.title-warp div {
  height: 15px;
  width: 75px;
  background-size: 100% 100%;
}
.title-warp h2 {
  padding: 0 12px;
  font-size: 30px;
  background: -webkit-linear-gradient(top, #e3ca94, #d3b472); /* 背景色渐变 */
  -webkit-background-clip: text; /* 规定背景的划分区域 */
  -webkit-text-fill-color: transparent; /* 防止字体颜色覆盖 */
}
.title-warp-lt {
  background-image: url(../assets/app/wrap-arrow-lt.png);
}
.title-warp-rt {
  background-image: url(../assets/app/wrap-arrow-rt.png);
}
</style>
