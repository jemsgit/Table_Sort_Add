/// <reference path="jquery-2.1.3.js" />
/// <reference path="lodash.js" />


var renderModal;
var renderTable;
var sort_toggle;
var new_prod;

//сортировка по имени и цене
function sortByName(array) {
    return _.sortBy(array, 'name');  
}

function sortByPrice(array) {
    return _.sortBy(array, 'price');
}

sort_toggle = function (th, classname, sort) {
    var t = th.children('span');
    if (!th.closest('table').hasClass(classname)) {
        th.closest('table').toggleClass(classname);
        products = sort(products, 'name');
        renderTable(products);
        th.children('span').addClass("edit");
        console.log(th.children('span').addClass("edit"));
    } else {
        products = products.reverse();
        th.closest('table').toggleClass(classname);
        renderTable(products);
        th.children('span').addClass("asdsd");
    };
};

//открытие и закрытие модального окна   
var close_modal = function (selector) {
    $(selector).css('display', 'none').animate({ opacity: 0, top: '50%' }, 200);
    $('#overlay').fadeOut(400);
};

var show_modal = function (selector) {
    $('#overlay').fadeIn(400);
    $(selector).css('display', 'block') // убираем у модального окна display: none;
        .animate({ opacity: 1, top: '50%' }, 200);
};

//удаление продукта
function deleteprod(fromarray, id) {
    var index = _.findIndex(products, { 'id': id });
    fromarray.splice(index, 1);
}

//шаблонизаторы для таблицы и модального окна
$(function () {
    var productRowHtml = $('#productRowTemplate').html(),
        productRowTemplateFunc = _.template(productRowHtml), // функция шаблонизатор
        tbodyHtml = $('#tbodyTemplate').html(),
        tbodyTemplateFunc = _.template(tbodyHtml);

    function generateProductHtml(product) {
        // наполняем шаблон объектом
        return productRowTemplateFunc({ product: product });
    }

    // Fill list with server data
    renderTable = function (products) {
        var tbodyHtml = tbodyTemplateFunc({
            products: products,
            productRowTemplateFunc: productRowTemplateFunc
        });
        $('#table1').html(tbodyHtml);
    }
    renderTable(products);
});

$(function () {
    var productInfoHtml = $('#modalTemplate').html();
    var productInfoTemplateFunc = _.template(productInfoHtml);// функция шаблонизатор

    renderModal = function (product) {
        // наполняем шаблон объектом
        var info = productInfoTemplateFunc({
            product: product
        });
        $('#modal_form').html(info);
    }
});

//валидация
Number.prototype.format = function (n, x) {
    var re = '(\\d)(?=(\\d{' + (x || 3) + '})+' + (n > 0 ? '\\.' : '$') + ')';
    var num = this.toFixed(Math.max(0, ~~n)).replace(new RegExp(re, 'g'), '$1,');
    return ("$" + num);
};


var checkName = function (selector) {
    var string = $(selector).val();
    if (string.trim().length == 0) {
        return "Имя не может быть пустым";
    } else if (string.length > 15) {
        return "Имя не может быть длинее 15 символов";
    } else {
        return "OK";
    }
};

var checkEmail = function (selector) {
    var string = $(selector).val();
    var reg = /^([a-z0-9_-]+\.)*[a-z0-9_-]+@[a-z0-9_-]+(\.[a-z0-9_-]+)*\.[a-z]{2,6}$/i;
    if (reg.test(string)) {
        return "OK";
    } else {
        return "E-mail введен некорректно";
    };
}

var checkCountInsert = function (selector) {
    var string = $(selector).val();
    var reg = /[^0-9]/;
    if (reg.test(string)) {
        $(selector).val("");
    }
};

var checkCount = function (selector) {
    var string = $(selector).val().replace(',','');
    var reg = /[^0-9]/;
    if (!reg.test(string)) {
        return "OK";
    } else {
        return "Поле должно содержать только цифры"
    };
}


var processCheck = function (result, selector_event, selector_valid) {
    if (result != "OK") {
        $(selector_event).addClass('novalid');
        $(selector_valid).prepend('<span class="prepended">' + result + '</span>');
    } else {
        checked(selector_valid);
    };
};

//добавление удаление галочки
function checked(selector) {
    $(selector).children('img').css('display', 'block') // убираем у модального окна display: none;
        .animate({ opacity: 1, top: '50%' }, 200);
}

function non_checked(t) {
    t.children('img').css('display', 'none') // убираем у модального окна display: none;
        .animate({ opacity: 0, top: '50%' }, 200);
}

var delivery_toggle = function (display, hide) {
    $(hide).css('display', 'inline-block')
    .animate({ opacity: 0, top: '50%' }, 100);
    $(display).css('display', 'inline-block')
    .animate({ opacity: 1, top: '50%' }, 500);
}

//onclick
$('#modal_form').on('click', '.close', function () {
    close_modal('#modal_form');
});

 $('table').on('click', '#name', function () {
     sort_toggle($(this), "name_asc", sortByName);
 });

 $('table').on('click', '#price', function () {
     sort_toggle($(this), "price_asc", sortByPrice);
 });

$(document).on('click', '#search', function () {
    event.preventDefault();
    var q = $('#search_input').val();
    if (q == "") {
        renderTable(products)
    } else {
        var filter = [];
        filter = $.grep(products, function (a) { return a.name.toLowerCase().indexOf(q.toLowerCase()) != -1 });
        renderTable(filter);
    };
});
       
$(document).on('click', '#add', function () {
    event.preventDefault();
    new_prod = {
        id: 0,
        name: "",
        email: "",
        count: 0,
        price: 0,
        country: 1,
        city: []
    }
    renderModal(new_prod);
    show_modal('#modal_form');
});

$('table').on('click', '.name a, a.edit', function () {
    event.preventDefault();
    var id = Number($(this).parents('tr').attr('data-id'));
    var index = _.findIndex(products, { 'id': id });
    new_prod = products[index];
    renderModal(products[index]);
    show_modal('#modal_form');
});

$('table').on('click', 'a.delete', function () {
    event.preventDefault();
    var id = $(this).parents('tr').attr('data-id');
    $('#delete').attr("data-id", id);
    show_modal('#modal_delete');
});

$('#modal_delete').on('click', '#cancel', function () {
    event.preventDefault();
    close_modal('#modal_delete');
});

$('#modal_delete').on('click', '#delete', function () {
    event.preventDefault();
    var id = Number($('#delete').attr('data-id'));
    deleteprod(products, id);
    renderTable(products);
    close_modal('#modal_delete');
});

$("#modal_form").on('focusin', '#InputName, #InputEmail, #InputCount, #InputPrice', function () {
    $(this).removeClass('novalid');
    non_checked($(this));
    $(this).next(".validation_result").children('.prepended').remove();
    non_checked($(this).next(".validation_result"))
});

$("#modal_form").on('focusout', '#InputName', function () {
    var result = checkName('#InputName');
    processCheck(result, '#InputName', "#NameValid");
});

$("#modal_form").on('focusout', '#InputEmail', function () {
    var result = checkEmail('#InputEmail');
    processCheck(result, '#InputEmail', "#EmailValid");
});

$("#modal_form").on('input', '#InputCount', function () {
    checkCountInsert('#InputCount');
});

$("#modal_form").on('focusout', '#InputCount', function () {
    var result = checkCount('#InputCount');
    processCheck(result, '#InputCount', "#CountValid");
});

$("#modal_form").on('focusin', '#InputPrice', function () {
    var value = $(this).val().replace(/,/g, '').replace('$', '');
    $(this).val(parseInt(value, 10));
});
        
$("#modal_form").on('focusout', '#InputPrice', function () {
    var result = checkCount('#InputPrice');
    processCheck(result, '#InputPrice', "#PriceValid");
    var value = Number($(this).val());
    $(this).val(value.format(2));
});

$("#modal_form").on('change', '#delivery', function () {
    console.log($(this).val());
    if ($(this).val() == "Страна") {
        delivery_toggle("#country", "#city");
    } else if ($(this).val() == "Город") {
        delivery_toggle("#city", "#country");
    } else {
        $("#city").css('display', 'inline-block')
            .animate({ opacity: 0, top: '50%' }, 100);
        $("#country").css('display', 'inline-block')
            .animate({ opacity: 0, top: '50%' }, 100);
    }
});

$("#modal_form").on('click', '#check_all', function () {
    console.log($(this).is(':checked'));
});

$("#modal_form").on('click', '#check_all', function () {
    if ($(this).is(':checked')) {
        $("input[name=checkCity]").each(function () {
            $(this).attr('checked', 'checked');
        })
    } else {
        $("input[name=checkCity]").each(function () {
            $(this).removeAttr('checked');
        })
    };
});
//$("#modal_form").on('click', '#check_all', function () {
//    if ($(this).attr('checked')) {
//        $(this).removeAttr('checked')
//    } else { $(this).attr('checked', 'checked') };

//    if ($("#check_all").attr('checked') == 'checked') {
//        $("input[name=checkCity]").each(function () {
//            $(this).attr('checked', 'checked');
//        })
//    } else {
//        $("input[name=checkCity]").each(function () {
//            $(this).removeAttr('checked');
//        })
//    }
//});

//$("#modal_form").on('click', '#check_1, #check_2, #check_3', function () {
//    if ($("input[name=checkCity]:checked").length == 3 & $("#check_all").attr('checked') == 'checked') {
//        $("#check_all").removeAttr('checked');
//    }
//    else if ($("input[name=checkCity]:checked").length == 3) {
//        $("#check_all").attr('checked', 'checked');
//    } else {
//        $("#check_all").removeAttr('checked');
//    };
//});


$("#modal_form").on('click', '#save', function () {
    event.preventDefault();
    var obj = {
        '#InputName': checkName('#InputName'),
        '#InputEmail': checkEmail('#InputEmail'),
        '#InputCount': checkCount('#InputCount'),
        '#InputPrice': checkCount('#InputPrice')
    };

    var count;
    for (i in obj) {
        count = 0;
        if (obj[i] != "OK") {
            count++;
            $(i).focus();
            break;
        }
    }

    var cities=[];

    if (count == 0) {
        $('#modal_form input[name=checkCity]:checked').each(function () {
            cities.push(Number($(this).val()));
        });
        console.log(cities);

        //если продукт новый, присваивается новое id
        //старый - считывается старое
        var newid;
        if (new_prod.id == 0) {
            newid = products.length;
        } else {
            newid = new_prod.id;
        }
        console.log(new_prod.id);
        new_prod = {
            id: newid,
            name: $('#InputName').val(),
            email: $('#InputEmail').val(),
            count: Number($('#InputCount').val()),
            price: Number($('#InputPrice').val()),
            country: Number($('input[name=optionsRadios]:checked', '#modal_form').val()),
            city: cities
        };
        console.log(new_prod);
        deleteprod(products, new_prod.id);
        products.push(new_prod);
        renderTable(products);
        close_modal('#modal_form');
    }
    
});