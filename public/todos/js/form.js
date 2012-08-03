$(document).ready(function(){
    var pictureFile;

    $('#addForm').formly({'theme':'Dark'}, function(array) {
        console.log(_.pluck(array, 'name'));
        console.log(_.pluck(array, 'value'));

        uploadFile(pictureFile, function() {
            $.sticky('<b>File upload success!</b>', {
                autoclose: 3000
            });
        });

        $.ajax({
            type: 'POST',
            url: "/worker/crud",
            contentType: 'application/json',
            data: JSON.stringify({
                crud: 'insert',
                table: 'wines',
                data: {
                    name: _.pluck(array, 'name'),
                    value: _.pluck(array, 'value')
                }
            })
        }).done(function() {
            console.log(arguments[0]);
            $.sticky('<b>Add worker success!</b>', {
                autoclose: 3000
            });
            $('#resetButton').click();
            $('#addWorker').slideToggle(300);
            $('.upload').slideToggle(300);
        });
    });

    $('#updateForm').formly({'theme':'Light'}, function(array) {
        console.log(_.pluck(array, 'name'));
        console.log(_.pluck(array, 'value'));

        uploadFile(pictureFile, function() {
            $.sticky('<b>File upload success!</b>', {
                autoclose: 3000
            });
        });

        return;
    });

    $('#cancelUpdate').on('click', function() {
        $('#updateWorker').slideToggle(300);
        $('.upload').slideToggle(300);
    });
    $('#cancelAdd').on('click', function() {
        $('#addWorker').slideToggle(300);
        $('.upload').slideToggle(300);
    });

    $('#picture').on('drop', function (event) {
        event.stopPropagation();
        event.preventDefault();
        var e = event.originalEvent;
        e.dataTransfer.dropEffect = 'copy';
        pictureFile = e.dataTransfer.files[0];

        $('#add-picture-name').attr('value', pictureFile.name);
        $('#update-picture-name').attr('value', pictureFile.name);

        // Read the image file from the local file system and display it in the img tag
        var reader = new FileReader();
        reader.onloadend = function () {
            $('#picture').attr('src', reader.result);
        };
        reader.readAsDataURL(pictureFile);
    });   
});

window.uploadFile = function(file, callbackSuccess) {
    var self = this;
    var data = new FormData();
    data.append('upload', file);
    $.ajax({
        url: '/upload',
        type: 'POST',
        data: data,
        processData: false,
        cache: false,
        contentType: false
    })
    .done(function () {
        console.log(file.name + " uploaded successfully");
        callbackSuccess();
    })
    .fail(function () {
    });
}; 