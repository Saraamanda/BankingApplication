// the original test script

const mongoose = require("mongoose");
const Client = require("./2_database/models/client");
const Account = require("./2_database/models/account");
const fetch = require("node-fetch");
const chai = require("chai");
const should = chai.should();
const config = require("./1_express_api/server1");
// const expect = require('chai').expect;
const chaiHttp = require("chai-http");
const { expect } = require("chai");
chai.use(chaiHttp);
const baseUrl = "https://localhost:8080"

// connect to db
let connection = mongoose.connect("mongodb://localhost:27017/Bankingapplication", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});

const clientTemplate = () => {
    return {
        firstName: "Created in",
        lastName: "test file",
        streetAddress: `Solbjerg Plads ${Math.ceil(Math.random() * 1000)}`,
        city: `TEST`,
    };
};

const accountTemplate = () => {
    return {
        balance: Math.floor(Math.random() * 100_000),
        alias: `TEST account ${Math.floor(Math.random() * 10)}`,
    };
};

// before((done) => {
// Account.remove({}, () => {
//     Client.remove({}, () => {
//         done();
//     });
// });
// });

describe("Client tests", () => {
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
    let lastAdded;
    let clientsLength;

    describe("/GET empty clients", () => {
        it("it should GET all the clients", (done) => {
            chai
                .request(baseUrl)
                .get("/clients")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    clientsLength = res.body.length;
                    //   res.body.length.should.be.eql(0);
                    done();
                });
        });
    });
    describe("/POST clients", () => {
        it("it should POST client 1", (done) => {
            chai
                .request(baseUrl)
                .post("/clients")
                .send(clientTemplate())
                .end((err, res) => {
                    res.should.have.status(200);
                    lastAdded = res.body;
                    done();
                });
        });
        it("it should POST client 2", (done) => {
            chai
                .request(baseUrl)
                .post("/clients")
                .send(clientTemplate())
                .end((err, res) => {
                    res.should.have.status(200);
                    lastAdded = res.body;
                    done();
                });
        });
    });
    describe("/GET clients after post", () => {
        it("it should GET all the clients", (done) => {
            chai
                .request(baseUrl)
                .get("/clients")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    res.body.length.should.be.eql(clientsLength + 2);
                    done();
                });
        });
    });

    describe("/GET single client after post", () => {
        it("it should GET single client", (done) => {
            // get all clients
            chai
                .request(baseUrl)
                .get("/clients")
                .end(async (err, res) => {
                    res.should.have.status(200);
                    const id = lastAdded._id;
                    chai
                        .request(baseUrl)
                        .get(`/clients/${id}`)
                        .end((err, res) => {
                            res.body.should.a("object");
                            res.should.have.status(200);
                            res.body.firstname.should.be.equal(lastAdded.firstname);
                            res.body.lastname.should.be.equal(lastAdded.lastname);
                            res.body.city.should.be.equal(lastAdded.city);
                            done();
                        });
                });
        });
    });

    describe("/PUT edit last added client", () => {
        it("Should edit last added client", (done) => {
            chai
                .request(baseUrl)
                .get("/clients")
                .end((err, res) => {
                    res.should.have.status(200);
                    const latest = res.body[res.body.length - 1];
                    chai
                        .request(baseUrl)
                        .put(`/clients/${latest._id}`)
                        .send({
                            firstname: "EDITED",
                            lastname: "EDITED",
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.firstname.should.be.equal("EDITED");
                            res.body.lastname.should.be.equal("EDITED");
                            res.body.city.should.be.equal(latest.city);
                            res.body.streetAddress.should.be.equal(latest.streetAddress);
                            done();
                        });
                });
        });
    });

    describe("/DELETE delete last added client", () => {
        it("Should delete last added client", (done) => {
            chai
                .request(baseUrl)
                .get("/clients")
                .end(async (err, res) => {
                    res.should.have.status(200);
                    const id = res.body[res.body.length - 1]._id;
                    chai
                        .request(baseUrl)
                        .delete(`/clients/${id}`)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body._id.should.be.equal(id);
                            res.should.have.status(200);
                            chai
                                .request(baseUrl)
                                .get("/clients")
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.be.a("array");
                                    res.body.length.should.be.eql(clientsLength + 1);
                                    done();
                                });
                        });
                });
        });
    });
});

describe("Account tests", () => {
    let lastAddedAcc;
    let client;
    let accountsLength;

    before((done) => {
        Client.findOne({}, function (err, res) {
            client = res;
            done();
        });
    });

    describe("/GET empty accounts", () => {
        it("it should GET all the accounts", (done) => {
            chai
                .request(baseUrl)
                .get("/accounts")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    accountsLength = res.body.length;
                    //   res.body.length.should.be.eql(0);
                    done();
                });
        });
    });
    describe("/POST accounts", () => {
        it("it should POST account 1", (done) => {
            let account = accountTemplate();
            account.client_id = client._id;
            chai
                .request(baseUrl)
                .post("/accounts")
                .send(account)
                .end((err, res) => {
                    res.should.have.status(200);
                    lastAddedAcc = res.body;
                    done();
                });
        });
        it("it should POST account 2", (done) => {
            let account = accountTemplate();
            account.client_id = client._id;
            chai
                .request(baseUrl)
                .post("/accounts")
                .send(account)
                .end((err, res) => {
                    res.should.have.status(200);
                    lastAddedAcc = res.body;
                    done();
                });
        });
    });
    describe("/GET accounts after post", () => {
        it("it should GET all the accounts", (done) => {
            chai
                .request(baseUrl)
                .get("/accounts")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a("array");
                    res.body.length.should.be.eql(accountsLength + 2);
                    done();
                });
        });
    });

    describe("/GET single account after post", () => {
        it("it should GET single account", (done) => {
            // get all clients
            chai
                .request(baseUrl)
                .get("/accounts")
                .end(async (err, res) => {
                    res.should.have.status(200);
                    const id = lastAddedAcc._id;
                    chai
                        .request(baseUrl)
                        .get(`/accounts/${id}`)
                        .end((err, res) => {
                            res.body.should.a("object");
                            res.should.have.status(200);
                            res.body.balance.should.be.equal(lastAddedAcc.balance);
                            res.body.alias.should.be.equal(lastAddedAcc.alias);
                            res.body.client_id.should.be.equal(lastAddedAcc.client_id);
                            done();
                        });
                });
        });
    });

    describe("/PUT edit last added account", () => {
        it("Should edit last added account", (done) => {
            chai
                .request(baseUrl)
                .get("/accounts")
                .end((err, res) => {
                    res.should.have.status(200);
                    const latest = res.body[res.body.length - 1];
                    chai
                        .request(baseUrl)
                        .put(`/accounts/${latest._id}`)
                        .send({
                            balance: 100,
                            alias: "EDITED",
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.balance.should.be.equal(100);
                            res.body.alias.should.be.equal("EDITED");
                            done();
                        });
                });
        });
    });

    describe("/PUT transfer balance between two accounts", () => {
        it("Should transfer 50 between two accounts", (done) => {
            // first get two accounts
            chai
                .request(baseUrl)
                .get("/accounts")
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.length.should.be.above(1);
                    const fromAccountBefore = res.body[0];
                    const toAccountBefore = res.body[res.body.length - 1];
                    const amount = 50;
                    chai
                        .request(baseUrl)
                        .put("/accounts/transfer")
                        .send({
                            fromAccount: fromAccountBefore._id,
                            toAccount: toAccountBefore._id,
                            amount: 50,
                        })
                        .end((err, res) => {
                            res.should.have.status(200);
                            chai
                                .request(baseUrl)
                                .get(`/accounts/${fromAccountBefore._id}`)
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.balance.should.be.equal(
                                        fromAccountBefore.balance - amount
                                    );
                                    chai
                                        .request(baseUrl)
                                        .get(`/accounts/${toAccountBefore._id}`)
                                        .end((err, res) => {
                                            res.should.have.status(200);
                                            res.body.balance.should.be.equal(
                                                toAccountBefore.balance + amount
                                            );
                                            done();
                                        });
                                });
                        });
                });
        });
    });

    describe("/DELETE delete last added account", () => {
        it("Should delete last added account", (done) => {
            chai
                .request(app)
                .get("/accounts")
                .end((err, res) => {
                    res.body.length.should.be.above(0);
                    res.should.have.status(200);
                    const id = res.body[res.body.length - 1]._id;
                    chai
                        .request(baseUrl)
                        .delete(`/accounts/${id}`)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body._id.should.be.equal(id);
                            res.should.have.status(200);
                            chai
                                .request(baseUrl)
                                .get("/accounts")
                                .end((err, res) => {
                                    res.should.have.status(200);
                                    res.body.should.be.a("array");
                                    res.body.length.should.be.eql(accountsLength + 1);
                                    done();
                                });
                        });
                });
        });
    });
});
