import path from 'path'
import grpc from '@grpc/grpc-js'
import protoLoader from '@grpc/proto-loader'
import { addManyUsers, addUser, addUserVerbose } from './methods/user.mjs'
import sayHello from './methods/hello.mjs'

const protoPath = path.resolve('..', '..', 'proto', 'helloworld.proto')

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
    try {
        let server = new grpc.Server();
        server.addService(helloProto.Greeter.service,
            {
                sayHello: sayHello,
                addUser: addUser,
                addUserVerbose: addUserVerbose,
                addManyUsers: addManyUsers
            }
        );
        server.bindAsync('0.0.0.0:50051', grpc.ServerCredentials.createInsecure(), () => {
            server.start();
        })
    } catch (ex) {
        console.log(ex)
    }
}
main();