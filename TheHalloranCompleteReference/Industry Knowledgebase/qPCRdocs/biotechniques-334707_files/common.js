/** * Copyright (c) Informa Healthcare, 2008. All rights reserved.

 * Unauthorized reproduction and/or distribution are strictly prohibited. 

 *

 * File: common.js

 * Created: 21/11/2008

 * @author: informa

 * @version: 1.0, 21/11/2008

 * 

 * **/



function popUp(url){

newwindow=window.open(url,'name','height=250,width=450');

	if (window.focus) {newwindow.focus()}

	return false;

}





function openInner(cate,catId) {



categoryIdChildDiv = "#"+cate+"-"+catId;



if ($(categoryIdChildDiv).hasClass('hide')) {

						$(categoryIdChildDiv).removeClass('hide');

						$(categoryIdChildDiv).addClass('show');

}else if ($(categoryIdChildDiv).hasClass('show')){



				$(categoryIdChildDiv).removeClass('show');

				$(categoryIdChildDiv).addClass('hide');

}

}

