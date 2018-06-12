# Integration test express restful api with mocha and chai-http or supertest

## Unit Tests And Integration Tests

1. 单元测试
程序员通常编写这些测试。但测试人员也应该学习如何编写单元测试。您可以在生产代码（测试后）之后或生产代码之前（测试优先）编写它们。在生产代码之后编写它们时，需要注意生产代码是可测试的，因此考虑到可测试性的设计和代码审查阶段至关重要。

单元测试的重点是方法或课程。它应该非常小，几行代码最多。在编写单元测试时，有很多方法可以犯错误，所以这不是一件微不足道的事情。因为它们很小，它们应该在内存中运行，并且单元测试应该在毫秒内运行。任何涉及外部依赖性（数据库，Web服务，文件系统，任何I / O）的测试都不是单元测试，它是其他内容（集成测试，集成测试，验收测试，端到端测试等）。

单元测试结果首先对技术团队（程序员，测试人员，操作人员，开发人员等）感兴趣。

2. 集成测试
集成测试有很多定义。对我来说，集成测试是一个检查两个模块之间集成的测试。如果你有两个以上的模块，那么我们有一个综合测试，验收测试或端到端测试。

这些测试通常由程序员编写。但测试人员通常也会写它们。
如果您拥有组件团队，那么最好从每个模块的API开始，然后编写集成测试。这种方法相当于单元测试中的测试优先方法。编写代码之后，您也可以编写它们，但是在编写模块的API和每个模块的生产代码时，您还需要考虑可测试性。
像Dependency Inversion，Interface Segregation，Single Responsibility这样的良好实践对于进行高效的集成测试非常重要。
大多数情况下，我使用集成测试来检查外部模块（Web服务，数据库等）如何与系统集成。它们也用于检查与外部系统的连接，我是否拥有良好的功能。

集成测试对于技术团队也很有意思，就像单元测试一样。

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
### Result 
![Result](./result.jpeg)

### 参考资料

- [test-a-node-restful-api-with-mocha-and-chai](https://scotch.io/tutorials/test-a-node-restful-api-with-mocha-and-chai)
- [chai-http](https://github.com/chaijs/chai-http)
- [chai-http](http://www.chaijs.com/plugins/chai-http/)
- [supertest](https://github.com/visionmedia/supertest)
- [chaijs](http://www.chaijs.com/)
- [bookstore](https://github.com/samuxyz/bookstore)
- [automated-tests-purposes](http://blog.adrianbolboaca.ro/2017/01/automated-tests-purposes/)