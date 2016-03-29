window.census = window.census || {};

AttributesCollection = Backbone.Collection.extend({
  url: '/REST/people',

  parse: function(json) {
    return json.data.slice(1, json.data.length);
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
  initialize: function() {
    window.census.application.on('select-attribute', this.highlightSelected, this);
  },
  highlightSelected: function(data) {
    this.$el.find('a').removeClass('selected');
    this.$el.find('a[data-id="' + data.id + '"]').addClass('selected');
  },
  selectItem: function(event) {
    var data = this.collection.findWhere({
      id: parseInt(event.target.dataset.id)
    });
    if (data) {
      window.census.application.trigger('attribute-picked', data.toJSON());
    }
  },
  render: function(collection) {
    this.$el.html(this.template({
      attributes: collection.toJSON()
    }));
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

  render: function() {
    var that = this;
    this.$el.html(this.template);
    this.$nav = this.$el.find('.nav-container');
    this.attributesListing = new _AttributesView({
      collection: this.collection
    });
    that.$nav.html(that.attributesListing.render(that.collection));
  },

  filterAttributes: function(event) {
    var query = event.target.value;
    var filteredCollection = new AttributesCollection(this.collection.filter(function(model) {
      return ~model.get('name').indexOf(query);
    }));
    this.attributesListing = new _AttributesView({
      collection: this.collection
    });
    this.$nav.html(this.attributesListing.render(filteredCollection));
  }
});


window.census.attributeSelector = {
  AttributesCollection: AttributesCollection,
  AttributeSelectionView: AttributeSelectionView
};
