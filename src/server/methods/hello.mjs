export default function sayHello(call, callBack) {
    const { name } = call.request
    console.log(name)
    callBack(null, { message: "hello " + name });
}