
const popError = function(type, title, text, timeout, z, el) { //默认为小窗无定时隐藏，type=1为大窗，timeout>0定时隐藏
        this.type = type;
        this.title = title;
        this.text = text;
        this.timeout = timeout || '';
        this.z = z || 999;
        this.el = el || document.body;
        this.init();
    }
    
    window.popError = popError;

    popError.close = function(id) {   
    var child = document.querySelector('div[pop-id="' + id + '"]')
    var parent = child.parentNode;
    parent.removeChild(child);
   }

   popError.prototype.init = function() {

   var popId = (new Date()).getTime();
   var control;
   this.popId=popId;

// if(this.type == 1){
//   control='<a href="javascript:;" class="btn " onclick="popError.close(' + popId + ')" >确定</a>';
// }
//  else if(this.type == 3){
//    
//      control='<a href="javascript:;"  class="btn " pop-id="'+ popId +'"  >下载游戏</a>'
//  }

    var bigPopHtml =
    '<div class="modal-box pop" pop-id="' + popId + '" >' +
     ' <div class="error">' +
        '<div class="error-con" >'+

				'<a class="close-btn" onclick="popError.close(' + popId + ')"><img src="'+require('../../img/close.png')+'"></a>'+
				'<div class="box-content">'+
				    '<p>'+ this.title + '</p>'+
					'<p>'+ this.text + '</p>'+
					
				'</div>'
				'<p class="warn">温馨提示：充值金额5-10分钟内同步</p>'+
				
			'</div>'+
			'</div>'+
			'</div>'

    var smallPopHtml =

        '<div class="modal-box error-modal pop" id="errorModal">' +
        '<div class="error-warn fadeIn">' +
        this.text +
        '</div>' +
        ' </div>';

    var node = document.createElement("div");
    if (this.type == 1 || this.type == 3) {
       
        this.html = bigPopHtml;

    } 
    else {
        this.html = smallPopHtml;
    }

    node.innerHTML = this.html;
    this.el.appendChild(node);

    document.querySelector('.pop').ontouchmove=function(){
         event.preventDefault();
     }

    if (this.timeout && this.timeout > 0) {

        setTimeout(() => {
            this.el.removeChild(node);
            
        }, this.timeout)
    }

};


export default {
    popError
    
}
