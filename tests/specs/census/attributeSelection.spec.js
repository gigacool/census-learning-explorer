var expect = chai.expect;
describe('Attribute selector', function() {

  it('should declare a dataViewers object container in census global variable', function() {
    expect(window.census.attributeSelector).to.be.ok;
  });

  describe('Attributes Collection', function() {
    var AttributesCollection = window.census.attributeSelector.AttributesCollection;

    it('should be defined', function() {
      expect(AttributesCollection).to.be.ok;
      expect(AttributesCollection).to.be.a('function');
    });

    it('should use the api resource that provides the listing of attributes', function() {
      var collection = new AttributesCollection();
      expect(collection.url).to.equal('/REST/people');
    });

    it('should focus on the data part of the api', function() {
      var apiPeople = {
        "data": [{
          "id": 0,
          "href": "/REST/people/age",
          "name": "age",
          "type": "int"
        }]
      };
      var collection = new AttributesCollection();
      collection.set(collection.parse(apiPeople));
      expect(collection.length).to.equal(1);
      expect(collection.get(0).get('id')).to.equal(0);
    });

  });

});
