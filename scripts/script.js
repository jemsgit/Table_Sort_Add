/// <reference path="jquery-2.1.3.js" />


//$(document).ready(function () { // вся магия после загрузки страницы
//        
//});
var close_modal = function () {
    $('#modal_form').css('display', 'none') // убираем у модального окна display: none;
					.animate({ opacity: 0, top: '50%' }, 200);
    $('#overlay').fadeOut(400);
};



//$(document).on('click', '.name a', function () {
//    $('#overlay').fadeIn(400, // сначала плавно показываем темную подложку
//		 	function(){ // после выполнения предъидущей анимации
//		 	    $('#modal_form') 
//					.css('display', 'block') // убираем у модального окна display: none;
//					.animate({opacity: 1, top: '50%'}, 200); // плавно прибавляем прозрачность одновременно со съезжанием вниз
//		 	});
//});


$(document).on('click', '.close', close_modal);


