// The in-memory Store. Encapsulates logic to access wine data.
window.store = {

    wines: {},

    populate: function () {
        this.lastId = 0;

        while(this.lastId++ < 80) {
            this.wines[this.lastId] = {
                id: this.lastId,
                name: "CosWind",
                phone: "13871204705",
                address: "USA",
                type: "0",
                notes: "I like backbone.js",
                picture: "waterbrook.jpg"
            };
        }
    },

    find: function (model) {
        return this.wines[model.id];
    },

    findAll: function () {
        return _.values(this.wines);
    },

    create: function (model) {
        this.lastId++;
        model.set('id', this.lastId);
        this.wines[this.lastId] = model;
        return model;
    },

    update: function (model) {
        this.wines[model.id] = model;
        return model;
    },

    destroy: function (model) {
        delete this.wines[model.id];
        return model;
    }

};

store.populate();

/*Backbone.sync = _.wrap(Backbone.sync, function(func, method, model, options) {
    func(method, model, options);
});*/

// Overriding Backbone's sync method. Replace the default RESTful services-based implementation
// with a simple in-memory approach.
/*Backbone.sync = function (method, model, options) {

    var resp;

    switch (method) {
        case "read":
            resp = model.id ? store.find(model) : store.findAll();
            break;
        case "create":
            resp = store.create(model);
            break;
        case "update":
            resp = store.update(model);
            break;
        case "delete":
            resp = store.destroy(model);
            break;
    }

    if (resp) {
        options.success(resp);
    } else {
        options.error("Record not found");
    }
};*/