window.census = window.census || {};

AttributesCollection = Backbone.Collection.extend({
  url: '/REST/people',

  parse: function(json) {
    return json.data;
  }
});

_AttributesView = Backbone.View.extend({
  tagName: 'nav',
  template: Handlebars.compile('{{#each attributes}}<a data-id="{{id}}">{{name}}</a>{{/each}}'),
  intialize: function(options) {
    this.container = options.container;
    this.collection = options.collection;
  },
  events: {
    'click a': 'selectItem'
  },
  selectItem: function(event) {
    var data = this.collection.findWhere({
      id: parseInt(event.target.dataset.id)
    });
    if (data) {
      this.container.trigger('attribute-selected', data.toJSON());
    }
  },
  render: function(collection) {
    this.$el.html({
      attributes: collection.toJSON()
    });
    return this.$el;
  }
});

AttributeSelectionView = Backbone.View.extend({
  template: '<h2>Select an attribute</h2>' +
    '<input type="text" name="attributes" placeholder="Find an attribute" value="">' +
    '<div class="nav-container"></div>',
  events: {
    'keyup input': 'filterAttributes'
  },

  initialize: function(options) {
    // NOP (?)
  },

  render: function() {
    var that = this;
    this.$el.html(this.template);
    this.$nav = this.$el.find('.nav-container');
    this.attributesListing = new _AttributesView({
      container: this,
      collection: this.collection
    });
    this.collection.fetch().done(function() {
      that.$nav.html(that.attributesListing.render(that.collection));
    }).fail(function() {
      that.$el.html('<p class="error">Oups, something went wrong</p>');
    });
  },

  filterAttributes: function(event) {
    query = event.target.value;
    filteredCollection = new AttributesCollection(this.collection.filter(function(model) {
      return ~model.get('name').indexOf(query);
    }));
    that.$nav.html(that.attributesListing.render(that.collection));
  }
});


window.census.attributeSelector = {
  AttributesCollection: AttributesCollection,
  AttributeSelectionView: AttributeSelectionView
};
