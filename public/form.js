var contactForm, submitContactForm;
var sent = false;
var sendMessageUrl = '/worker/crud';

$(document).ready(function(){

    $('#ContactInfo').formly({'theme':'Dark'}, function(array) {
        console.log(_.pluck(array, 'name'));
        console.log(_.pluck(array, 'value'));

        $.ajax({
            type: 'POST',
            url: "/worker/crud",
            contentType: 'application/json',
            data: JSON.stringify({
                crud: 'insert',
                table: 'worker',
                data: {
                    name: _.pluck(array, 'name'),
                    value: _.pluck(array, 'value')
                }
            })
        }).done(function() {
            console.log(arguments[0]);
        });
    });   
});
