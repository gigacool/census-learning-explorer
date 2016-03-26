var expect = chai.expect;
describe('Data Viewer', function(){

  it('should declare a dataViewers object container in census global variable', function(){
    expect(window.census.dataViewers).to.be.ok;
  });

});
