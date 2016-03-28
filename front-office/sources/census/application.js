window.census = window.census || {};

Router = Backbone.Router.extend({
  routes:{
    'about':'about',
    'explore(/:attribute)':'explore',
    '*any':'home'
  },
  home:function(){
    $('#data-container').html('Welcome');
  },
  explore:function(optionalAttribute){
    $('#data-container').html('Explore data ' + optionalAttribute);
  },
  about:function(){
    $('#data-container').html('About this project');
  },
  initialize:function(options){
    var attributeSelector;
    attributes = new window.census.attributeSelector.AttributesCollection();
    attributeSelector
      = this.attributeSelector
      = new window.census.attributeSelector.AttributeSelectionView({
        el:'#criterion-selector',
        collection:attributes
      });
    attributes.fetch().done(function() {
        attributeSelector.render();
    }).fail(function() {
      $('#criterion-selector').html('<p class="error">Oups, something went wrong</p>');
    });
    this.on('attribute-selected', this.updateSelectedAttribute);
  },
  updateSelectedAttribute:function(data){
    this.navigate('explore/' + encodeURIComponent(data.name), {trigger:true});
  }
});

window.census.application = new Router();
Backbone.history.start(); // Launch the application
