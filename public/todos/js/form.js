$(document).ready(function(){

    $('#addForm').formly({'theme':'Dark'}, function(array) {
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
            $('#resetButton').click();
            $('#addWorker').slideToggle(300);
        });
    });

    $('#updateForm').formly({'theme':'Light'}, function(array) {
        console.log(_.pluck(array, 'name'));
        console.log(_.pluck(array, 'value'));

        return;
    });

    $('#cancelUpdate').on('click', function() {
        $('#updateWorker').slideToggle(300);
    });
    $('#cancelAdd').on('click', function() {
        $('#addWorker').slideToggle(300);
    });   
}); 