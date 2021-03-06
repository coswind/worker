// A simple module to replace `Backbone.sync` with *localStorage*-based
// persistence. Models are given GUIDS, and saved into a JSON object. Simple
// as that.

// Generate four random hex digits.
function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};

// Generate a pseudo-GUID by concatenating random hexadecimal.
function guid() {
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};

// Our Store is represented by a single JS object in *localStorage*. Create it
// with a meaningful name, like the name you'd give a table.
var Store = function() {};

_.extend(Store.prototype, {

  // Add a model, giving it a (hopefully)-unique GUID, if it doesn't already
  // have an id of it's own.
  create: function(model) {
    return model;
  },

  // Update a model by replacing its copy in `this.data`.
  update: function(model) {
    return model;
  },

  // Return the array of all models currently in storage.
  findAll: function(options) {
    var searchName = options.searchName;
    var data = {
        crud: 'query',
        table: 'user',
        range: '*',
        order: { id: true }
      };
    if (searchName) {
      data.where = {
        attr: [ 'name_like' ],
        data: [ '%' + searchName + '%' ]
      };
    }
    $.ajax({
      type: 'POST',
      url: "/worker/crud",
      contentType: 'application/json',
      data: JSON.stringify(data)
    }).done(function() {
      options.success(JSON.parse(arguments[0])[1].map(function(value) {
        return {
          id: value.id,
          address: value.address,
          phone: value.phone,
          introduce: value.introduce,
          type: value.type,
          picture: value.picture,
          order: value.id,
          name: value.name
        };
      }));
    });
  },

  // Delete a model from `this.data`, returning it.
  destroy: function(model, options) {
    if (options.pretend) return true;
    $.ajax({
      type: 'POST',
      url: "/worker/crud",
      contentType: 'application/json',
      data: JSON.stringify({
        crud: 'delete',
        table: 'user',
        where: {
          attr: [ 'id' ],
          data: [ model.get('order') ]
        }
      })
    }).done(function() {
      console.log(arguments[0]);
      var err = JSON.parse(arguments[0])[0];
      if (err) return false;
      return true;
    });
  }

});

var store = new Store();
// Override `Backbone.sync` to use delegate to the model or collection's
// *localStorage* property, which should be an instance of `Store`.
Backbone.sync = function(method, model, options) {

  var resp;
  var store = store || model.localStorage || model.collection.localStorage;

  switch (method) {
    case "read":    resp = store.findAll(options);                 return; break;
    case "create":  resp = store.create(model);                            break;
    case "update":  resp = store.update(model);                            break;
    case "delete":  resp = store.destroy(model, options);                  break;
  }

  if (resp) {
    options.success(resp);
  } else {
    options.error("Record not found");
  }
};