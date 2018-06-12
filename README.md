# Integration test express restful api with mocha and chai-http or supertest


# Code

```
process.env.NODE_ENV = 'test';
let Book = require('../app/models/book');
// let request = require('supertest'); //可以替换使用suptertest
let chai = require('chai');
let chaiHttp = require('chai-http');
let app = require('../app');
let expect = chai.expect;

chai.use(chaiHttp);

describe('Books', () => {
    beforeEach(done => {
        Book.remove()
            .then(() => {
                done();
            });
    });

    describe('/GET book', () => {
        it('it should GET all the books', (done) => {
            chai.request(app)
                .get('/book')
                // .set('Authorization', 'helloworld') // set headers property
                .query({offset: 0, limit: 9}) // req.query
                // set headers property Authenticate with Basic authentication ,
                // req.headers.authorization = 'Basic QXV0aG9yaXphdGlvbjpoZWxsb3dvcmxk'
                .auth('Authorization', 'helloworld')
                .end((err, resp) => {
                    expect(resp.status).to.equal(200);
                    expect(resp.body).to.be.an('array');
                    expect(resp.body).to.has.lengthOf(0);
                    done();
                });

            // request(app)
            //     .get('/book')
            //     .expect(200)
            //     .end((err, resp) => {
            //         expect(resp.status).to.equal(200);
            //         expect(resp.body).to.be.an('array');
            //         expect(resp.body).to.has.lengthOf(0);
            //         done();
            //     });
        });
    });

    describe('/POST book', () => {
        it('it should not POST a book without pages field', (done) => {
            let book = {
                title:  'The Lord of the Rings',
                author: 'J.R.R. Tolkien',
                year:   1954
            };
            chai.request(app)
                .post('/book')
                .send(book)
                .end((err, resp) => {
                    expect(resp.status).to.equal(200);
                    expect(resp.body).to.be.a('object');
                    expect(resp.body).have.property('errors');
                    expect(resp.body.errors).have.property('pages');
                    expect(resp.body.errors.pages).have.property('kind').equal('required');
                    done();
                });

            // request(app)
            //     .post('/book')
            //     .send(book)
            //     .expect(200)
            //     .end((err, resp) => {
            //         expect(resp.status).to.equal(200);
            //         expect(resp.body).to.be.a('object');
            //         expect(resp.body).have.property('errors');
            //         expect(resp.body.errors).have.property('pages');
            //         expect(resp.body.errors.pages).have.property('kind').equal('required');
            //         done();
            //     });
        });

        it('it should POST a book', (done) => {
            let book = {
                title:  'The Lord of the Rings',
                author: 'J.R.R. Tolkien',
                year:   1954,
                pages:  1170
            };
            chai.request(app)
                .post('/book')
                .send(book)
                .end((err, resp) => {
                    expect(resp).to.has.status(200);
                    expect(resp.body).to.be.a('object');
                    expect(resp.body).have.property('message').equal('Book successfully added!');
                    expect(resp.body.book).to.have.property('title');
                    expect(resp.body.book).to.have.property('author');
                    expect(resp.body.book).to.have.property('year');
                    expect(resp.body.book).to.have.property('pages');
                    done();
                });
        });
    });

    describe('/GET/:id book ', () => {
        it('it should GET a book by the given id', (done) => {
            let book = new Book({ title: 'The Lord of the Rings', author: 'J.R.R. Tolkien', year: 1954, pages: 1170 });
            book.save()
                .then((book) => {
                    chai.request(app)
                        .get('/book/' + book.id)
                        .end((err, resp) => {
                            expect(resp).to.has.status(200);
                            expect(resp.body).to.be.a('object');
                            expect(resp.body).have.property('title');
                            expect(resp.body).have.property('author');
                            expect(resp.body).have.property('pages');
                            expect(resp.body).have.property('year');
                            expect(resp.body).have.property('_id').eql(book.id);
                            done();
                        });
                })
        });
    });

    describe('/PUT/:id book', () => {
        it('it should UPDATE a book given the id', (done) => {
            let book = new Book({title: 'The Chronicles of Narnia', author: 'C.S. Lewis', year: 1948, pages: 778})
            let update = {title: 'The Chronicles of Narnia', author: 'C.S. Lewis', year: 1950, pages: 779};
            book.save()
                .then(book => {
                    chai.request(app)
                        .put('/book/' + book.id)
                        .send(update)
                        .end((err, resp) => {
                            expect(resp).have.status(200);
                            expect(resp.body).to.be.a('object');
                            expect(resp.body).to.have.property('message').equal('Book updated!');
                            expect(resp.body.book).to.be.a('object');
                            expect(resp.body.book).to.have.property('year').equal(update.year);
                            expect(resp.body.book).to.have.property('pages').equal(update.pages);
                            done();
                        });
                });
        });
    });

    describe('/DELETE/:id book', () => {
        it('it should DELETE a book given the id', (done) => {
            let book = new Book({title: 'The Chronicles of Narnia', author: 'C.S. Lewis', year: 1948, pages: 778})
            book.save((err, book) => {
                chai.request(app)
                    .delete('/book/' + book.id)
                    .end((err, resp) => {
                        expect(resp).to.have.status(200);
                        expect(resp.body).to.be.a('object');
                        expect(resp.body).have.property('message').eql('Book successfully deleted!');
                        expect(resp.body.result).have.property('ok').eql(1);
                        expect(resp.body.result).have.property('n').eql(1);
                        done();
                    });
            });
        });
    });
});

```


### 参考资料

- [test-a-node-restful-api-with-mocha-and-chai](https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai)
- [chai-http](https://github.com/chaijs/chai-http)
- [chai-http](http://www.chaijs.com/plugins/chai-http/)
- [supertest](https://github.com/visionmedia/supertest)
- [chaijs](http://www.chaijs.com/)
- [bookstore](https://github.com/samuxyz/bookstore)