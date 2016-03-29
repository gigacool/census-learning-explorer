window.census = window.census || {};

var Router = Backbone.Router.extend({
  routes: {
    'about': 'about',
    'explore/:attribute(/:item)': 'explore',
    '*any': 'home'
  },
  home: function() {
    $('article').html('<div id="data-container"></div>');
    this.trigger('select-attribute', {
      id: null
    });
    $('#data-container').html($('#home-template').html());
  },
  explore: function(attribute, optionalItem) {
    var basicDataViewer, model, attributeData, attributeName;
    if (this.view) {
      this.view.remove();
    }
    $('article').html('<div id="data-container"></div>');
    attributeName = decodeURIComponent(attribute);
    $('#data-container').html('<h2>Repartition of age per ' + attributeName + '</h2><div class="center">Loading...</div>');
    attributeData = this.attributes.findWhere({
      name: attributeName
    });
    if (!attributeData) {
      return this.navigate('/home', {
        trigger: true
      });
    }
    model = new window.census.dataViewers.DataModel(attributeData.toJSON());

    this.view = basicDataViewer = new window.census.dataViewers.DataViewer({
      el: '#data-container',
      model: model,
      item: optionalItem
    });
    this.trigger('select-attribute', attributeData.toJSON());
    model.fetch().done(function() {
      basicDataViewer.render();
    }).fail(function() {
      $('#data-container').html('<p class="error">Oups, something went wrong</p>');
    });
  },
  about: function() {
    $('article').html('<div id="data-container"></div>');
    this.trigger('select-attribute', {
      id: null
    });
    $('#data-container').html($('#about-template').html());
  },
  setup: function(options) {
    this.attributes = options.attributes;
    var attributeSelector;
    attributeSelector = new window.census.attributeSelector.AttributeSelectionView({
      el: '#criterion-selector',
      collection: this.attributes
    });
    attributeSelector.render();
    this.on('attribute-picked', this.updateSelectedAttribute);
  },
  updateSelectedAttribute: function(data) {
    this.navigate('explore/' + encodeURIComponent(data.name), {
      trigger: true
    });
  }
});

window.census.routes = {
  Router:Router
};
