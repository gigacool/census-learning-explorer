window.census = window.census || {};

window.census.attributeSelector = {

  AttributesCollection:Backbone.Collection.extend({
    url:'/REST/people',

    parse:function(json){
      return json.data;
    }
  })

};
