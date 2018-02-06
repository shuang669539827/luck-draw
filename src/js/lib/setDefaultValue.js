export default function (config=[],res={}){
    config.forEach(item=>{
        let key=item._key;
        let value=res[key];
        if(item.valueData){
            item.defaultIndex=item.valueData.findIndex(item=>item==value);
        }
        
        if(key == 'video' || key == 'images') {
            item.recordSizeList = res.recordSizeList || []
        }
        item.value=value;
    });
    console.log('config', config)
    return config;
}