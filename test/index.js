var superagent = require('superagent');
var expect = require('expect.js');


describe('serwer express rest api', function(){
    var id;

    it('przesyla obiekt', function(done){
        superagent.post('http://localhost:3000/collections/test')
            .send({
                name: 'John',
                email: 'john@mail.pl'
            })
            .end(function(e, res){
                expect(e).to.eql(null);
                expect(res.body.length).to.eql(1);
                expect(res.body[0]._id.length).to.eql(24);
                id = res.body[0]._id;
                done();
            });
    });

    it('pobiera obiekt', function(done){
        superagent.get('http://localhost:3000/collections/test/'+id)
            .end(function(e, res){
                expect(e).to.eql(null);
                expect(res.body.length).to.be.above(0);
                expect(res.body.map(function(item){
                    return item._id
                })).to.contain(id);
                done();
            });
    });

    it('pobiera kolekcje', function(done){
        superagent.get('http://localhost:3000/collections/test/')
            .end(function(e, res){
                expect(e).to.eql(null);
                expect(res.body.length).to.be.above(0);
                expect(res.body.map(function(item){
                    return item._id
                })).to.contain(id);
                done();
            });
    });

    it('uaktualnia objekt', function(done){
        superagent.put('http://localhost:3000/collections/test/'+id)
            .send({
                name: 'Peter',
                email: 'peter@yahoo.pl'
            })
            .end(function(e, res){
                expect(e).to.eql(null);
                expect(typeof res.body).to.eql('object');
                expect(res.body.msg).to.eql('succsess');
                done();
            });
    });

    it('weryfikuje uaktualniony obiekt', function(done){
        superagent.get('http://localhost:3000/collections/test/'+id)
            .end(function(e, res){
                expect(e).to.eql(null);
                expect(typeof res.body).to.eql('object');
                expect(res.body._id.length).to.eql(24);
                expect(res.body._id).to.eql(id);
                expect(res.body.name).to.eql('Peter');
                done();
            })
    });

    it('usuwa obiekt', function(done){
        superagent.del('http://localhost:3000/collections/test/'+id)
            .end(function(e, res){
                expect(e).to.eql(null)
                expect(typeof res.body).to.eql('object');
                expect(res.body.msg).to.eql('success');
                done();
            });
    });


});