export default function (url,cb) {
	if(!url)return;
	var xhr=new XMLHttpRequest();
	// console.log(`${window.baseURL}/index.php?ac=start&type=1&num=10`)
	xhr.open('GET',url,true);
	xhr.onload=function(){
		cb(JSON.parse(xhr.responseText))
	}
	xhr.send();

}
