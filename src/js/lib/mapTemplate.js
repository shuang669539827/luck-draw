function mapTemp(a,cb){
	a.forEach(item=>{
		if(Array.isArray(item.childs)){
			mapTemp(item.childs,cb);
		}
		cb(item)
	});
}
export default function (template,cb){
	if(!Array.isArray(template)){
		return ;
	}
	mapTemp(template,cb)
}