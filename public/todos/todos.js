// An example Backbone application contributed by
// [Jérôme Gravel-Niquet](http://jgn.me/). This demo uses a simple
// [LocalStorage adapter](backbone-localstorage.js)
// to persist Backbone models within your browser.

// Load the application once the DOM is ready, using `jQuery.ready`:
$(function(){

  // Todo Model
  // ----------

  // Our basic **Todo** model has `name`, `order`, and `done` attributes.
  var Todo = Backbone.Model.extend({

	// Default attributes for the todo item.
	defaults: function() {
	  return {
		name: "empty todo...",
		id: null,
		order: 1,
		address: 'somewhere',
		notes: 'sorry',
		phone: '110',
		type: '疏通管道',
		picture: 'defaultFace.png',
		done: false
	  };
	},

	// Ensure that each todo created has `name`.
	initialize: function() {
	  if (!this.get("name")) {
		this.set({"name": this.defaults.name});
	  }
	},

	// Toggle the `done` state of this todo item.
	toggle: function() {
	  this.save({done: !this.get("done")});
	},

	// Remove this Todo from *localStorage* and delete its view.
	clear: function() {
	  this.destroy();
	}

  });

  // Todo Collection
  // ---------------

  // The collection of todos is backed by *localStorage* instead of a remote
  // server.
  var TodoList = Backbone.Collection.extend({

	// Reference to this collection's model.
	model: Todo,

	// Save all of the todo items under the `"todos"` namespace.
	localStorage: new Store("todos-backbone"),

	// Filter down the list of all todo items that are finished.
	done: function() {
	  return this.filter(function(todo){ return todo.get('done'); });
	},

	// Filter down the list to only todo items that are still not finished.
	remaining: function() {
	  return this.without.apply(this, this.done());
	},

	// Todos are sorted by their original insertion order.
	comparator: function(todo) {
		return todo.get('order');
	}

  });

  // Create our global collection of **Todos**.
  var Todos = new TodoList;

  // Todo Item View
  // --------------

  // The DOM element for a todo item...
  var TodoView = Backbone.View.extend({

	//... is a list tag.
	tagName:  "li",

	// Cache the template function for a single item.
	template: _.template($('#item-template').html()),

	// The DOM events specific to an item.
	events: {
	  "click .toggle"    : "toggleDone",
	  "click a.destroy"  : "clear",
	  "click a.update"   : "update"
	},

	// The TodoView listens for changes to its model, re-rendering. Since there's
	// a one-to-one correspondence between a **Todo** and a **TodoView** in this
	// app, we set a direct reference on the model for convenience.
	initialize: function() {
	  this.model.bind('change', this.render, this);
	  this.model.bind('destroy', this.remove, this);
	},

	// Re-render the titles of the todo item.
	render: function() {
	  this.$el.html(this.template(this.model.toJSON()));
	  this.$el.toggleClass('done', this.model.get('done'));
	  this.input = this.$('.edit');
	  return this;
	},

	// Toggle the `"done"` state of the model.
	toggleDone: function() {
	  this.model.toggle();
	},

	/*remove: function() {
		console.log('haha');
      this.$el.remove();
      return this;
    },*/

	update: function() {
		var model = this.model;
		var picture = model.get('picture');
		$('#picture').attr('src', '/pics/' + picture);
	    $("#addWorker").hide();   
	    $('#updateWorker').slideToggle(300);
	    $('.upload').slideToggle(300);
	    $('#updateForm').children().each(function(index, item) {
	    	item = $(item);
	    	var name = item.attr('name');
	    	if (name) {
    			item.val(model.get(name));
	    	}
	    });

	    $('#updateForm').on('submit', function() {
		    var dataObj = {}, id = 1;
	        $(this).serializeArray().forEach(function(value) {
	        	if (value.name == 'order') {
	        		id = value.value;
	        	} else {
	            	dataObj[value.name] = value.value;
	        	}
	        });
	        dataObj.picture = $('#update-picture-name').attr('value');
		    $.ajax({
	            type: 'POST',
	            url: "/worker/crud",
	            contentType: 'application/json',
	            data: JSON.stringify({
	                crud: 'update',
	                table: 'wines',
	                data: dataObj,
	                where: {
	                    attr: [ 'id' ],
	                    data: [ id ]
	                }
	            })
	        }).done(function() {
	            model.save(dataObj);
	            console.log(arguments[0]);
	            $('#updateWorker').slideToggle(300);
	            $('.upload').slideToggle(300);
	        });
	    });

	},

	// Remove the item, destroy the model.
	clear: function() {
	  this.model.clear();
	}

  });

  // The Application
  // ---------------

  // Our overall **AppView** is the top-level piece of UI.
  var AppView = Backbone.View.extend({

	// Instead of generating a new element, bind to the existing skeleton of
	// the App already present in the HTML.
	el: $("#todoapp"),

	// Our template for the line of statistics at the bottom of the app.
	statsTemplate: _.template($('#stats-template').html()),

	// Delegated events for creating new items, and clearing completed ones.
	events: {
	  "keypress #new-todo":  "search",
	  "click #add":  "add",
	  "click #clear-completed": "clearCompleted",
	  "click #toggle-all": "toggleAllComplete"
	},

	// At initialization we bind to the relevant events on the `Todos`
	// collection, when items are added or changed. Kick things off by
	// loading any preexisting todos that might be saved in *localStorage*.
	initialize: function() {

		this.input = this.$("#new-todo");
		this.allCheckbox = this.$("#toggle-all")[0];

		Todos.bind('reset', this.addAll, this);
		Todos.bind('all', this.render, this);

		this.footer = this.$('footer');
		this.main = $('#main');
	},

	// Re-rendering the App just means refreshing the statistics -- the rest
	// of the app doesn't change.
	render: function() {
	  var done = Todos.done().length;
	  var remaining = Todos.remaining().length;

	  if (Todos.length) {
		this.main.show();
		this.footer.show();
		this.footer.html(this.statsTemplate({done: done, remaining: remaining}));
	  } else {
		this.main.hide();
		this.footer.hide();
	  }

	  this.allCheckbox.checked = !remaining;
	},

	// Add a single todo item to the list by creating a view for it, and
	// appending its element to the `<ul>`.
	addOne: function(todo) {
	  var view = new TodoView({model: todo});
	  this.$("#todo-list").append(view.render().el);
	},

	add: function(todo) {
		$('#updateWorker').hide();
	  	$('#addWorker').slideToggle(300);
	  	$('#add-picture-name').attr('value', 'defaultFace.png');
	  	$('#picture').attr('src', '/pics/defaultFace.png');
	  	$('.upload').slideToggle(300);
	},

	// Add all items in the **Todos** collection at once.
	addAll: function() {
	  Todos.each(this.addOne);
	},

	// If you hit return in the main input field, create new **Todo** model,
	// persisting it to *localStorage*.
	search: function(e) {
		var inputValue = this.input.val();
		if (e.keyCode != 13) return;
		if (!inputValue) return;

		//Todos.create({name: this.input.val()});
		//Search Work

		var todos = [];

		Todos.each(function(todo) {
			todos.push(todo);
		});
		todos.forEach(function(todo) {
			todo.destroy({
				pretend: true
			});
		});
		Todos.fetch({searchName: inputValue});

		this.input.val('');
	},

	// Clear all done todo items, destroying their models.
	clearCompleted: function() {
	  _.each(Todos.done(), function(todo){ todo.clear(); });
	  return false;
	},

	toggleAllComplete: function () {
	  var done = this.allCheckbox.checked;
	  Todos.each(function (todo) { todo.save({'done': done}); });
	}

  });

  // Finally, we kick things off by creating the **App**.
  var App = new AppView;

});
