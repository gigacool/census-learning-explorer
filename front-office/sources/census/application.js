window.census = window.census || {};

Router = Backbone.Router.extend({
  routes: {
    'about': 'about',
    'explore/:attribute': 'explore',
    '*any': 'home'
  },
  home: function() {
    $('#data-container').html('Welcome');
  },
  explore: function(attribute) {
    var attributeName = decodeURIComponent(attribute);
    $('#data-container').html('<h2>Repartition of age per ' + attributeName + '</h2><div class="center">Loading...</div>')
    attributeData = this.attributes.findWhere({
      name: attributeName
    });
    if (!attributeData) {
      return this.navigate('/home', {
        trigger: true
      });
    }
    model = new window.census.dataViewers.DataModel(attributeData.toJSON());
    basicDataViewer = new window.census.dataViewers.DataViewer({
      el: '#data-container',
      model: model
    });
    model.fetch().done(function() {
      basicDataViewer.render();
    }).fail(function() {
      $('#data-container').html('<p class="error">Oups, something went wrong</p>');
    });

  },
  about: function() {
    $('#data-container').html('About this project');

  },
  initialize: function(options) {
    this.attributes = options.attributes;
    var attributeSelector;
    attributeSelector = new window.census.attributeSelector.AttributeSelectionView({
      el: '#criterion-selector',
      collection: this.attributes
    });
    attributeSelector.render();
    this.on('attribute-selected', this.updateSelectedAttribute);
  },
  updateSelectedAttribute: function(data) {
    this.navigate('explore/' + encodeURIComponent(data.name), {
      trigger: true
    });
  }
});

// get the listing of attributes, then start the application
var attributes = new window.census.attributeSelector.AttributesCollection();
attributes.fetch().done(function() {
  // without dependency management or proper framework (e.g. requirejs, angular), I use the router as the application
  // core element that can be used to share events through the application. The router only handles navigation in the
  // application
  window.census.application = new Router({
    attributes: attributes
  });
  Backbone.history.start(); // Launch the application
}).fail(function() {
  $('#data-container').html('<p class="error">Oups, something went wrong</p>');
});
