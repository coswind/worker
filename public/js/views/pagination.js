window.Pager = Backbone.View.extend({

    className: "pagination pagination-centered",

    initialize:function () {

        var items = this.model.models,
            len = items.length;

        this.showNum = 5;

        this.pageCount = Math.ceil(len / 8);

        this.model.bind("reset", this.render, this);
        this.render();
    },

    events: {
        // "click #prev"   : "prevPage",
        // "click #next"   : "nextPage"
    },

    render:function () {

        var showNum = this.showNum,
            page = this.options.page,
            pageCount = this.pageCount;

        $(this.el).html('<ul />');

        var rootEl = $('ul', this.el);

        var pageLast = page + Math.floor(showNum / 2);

        if (showNum < pageLast) {
            rootEl.append('<li><a id="prev" href="#wines/page/' + (page-1) + '">«</a></li>');
            for (var i=pageLast-showNum; i < pageLast; i++) {
                rootEl.append("<li" + ((i + 1) === page ? " class='active'" : "") + "><a href='#wines/page/"+(i+1)+"'>" + (i+1) + "</a></li>");
            }
            if (pageLast < pageCount) {
                rootEl.append('<li><a id="next" href="#wines/page/' + (page+1) + '">»</a></li>');
            }
        } else if (showNum < pageCount) {
            for (var i=0; i < showNum; i++) {
                rootEl.append("<li" + ((i + 1) === page ? " class='active'" : "") + "><a href='#wines/page/"+(i+1)+"'>" + (i+1) + "</a></li>");
            }
            rootEl.append('<li><a id="next" href="#wines/page/' + (page+1) + '">»</a></li>');
        } else {
            for (var i=0; i < pageCount; i++) {
                rootEl.append("<li" + ((i + 1) === page ? " class='active'" : "") + "><a href='#wines/page/"+(i+1)+"'>" + (i+1) + "</a></li>");
            }
        }

        return this;
    },

    prevPage: function(event) {
        if (this.options.page > 1) {
            this.options.page--;
            event.target.href = '#wines/page/' + this.options.page;
        }
    },

    nextPage: function(event) {
        if (this.options.page < this.pageCount) {
            this.options.page++;
            event.target.href = '#wines/page/' + this.options.page;
        }
    }
});