const path = require('path')
const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')


const protoPath = path.resolve(__dirname, "..", "..", "proto", "helloworld.proto")

const packageDefinition = protoLoader.loadSync(
    protoPath,
    {
        keepCase: true,
        longs: String,
        enums: String,
        defaults: true,
        oneofs: true
    }
);

const helloProto = grpc.loadPackageDefinition(packageDefinition).helloworld

function main() {
    let client = new helloProto.Greeter("localhost:50051",
        grpc.credentials.createInsecure());

    sayHello(client)
    addUser(client)
    addUserVerbose(client)
    addManyUsers(client);
}

function sayHello(client) {
    client.sayHello({ name: name }, function (err, response) {
        console.log('Greeting:', response.message);
    });
}

function addUser(client) {
    client.addUser(user, function (err, response) {
        console.log('User:', response.message);
    });
}

function addUserVerbose(client) {
    let call = client.addUserVerbose(user)
    call.on('data', (response) => {
        console.log('User:', response);
    });

    call.on("end", () => {
        console.log('Finished stream')
    })
}
function addManyUsers(client) {
    let call = client.addManyUsers(function (error, response) {
        if (error) console.log(`error: ${error}`)
        console.log(response)
    })

    let users = [{
        id: 1,
        name,
        email: `${name}-1@${name}.com`
    }, {
        id: 2,
        name,
        email: `${name}-2@${name}.com`
    }, {
        id: 3,
        name,
        email: `${name}-3@${name}.com`
    }]

    users.forEach(user => {
        call.write(user);
    })

    // _.each(users, function (user) {
    //     call.write(user);
    // })
    call.end();
}

const name = ' jose';
const user = {
    id: 0,
    name,
    email: `${name}@${name}.com`
}

main();