const addUser = (call, callback) => {
    const { id, name, email } = call.request
    console.log(id, name, email)
    callback(null, { message: `id:${id + 99}, name:${name}, email:${email}` })
}

const delay = ms => new Promise(resolve => setTimeout(resolve, ms))

const addUserVerbose = async (call, callback) => {
    const messages = ["init", "Processing", "Completed"]
    try {
        const { id, name, email } = call.request
        let i = 0
        for await (let message of messages) {
            i++;
            await delay(2000)
            call.write({ "message": message })
            if (i === messages.length) {
                call.end();
            }
        }

    } catch (err) {
        console.error(err)
    }

}

const addManyUsers = (call, callback) => {
    call.on('data', (request) => {
        const { id, name, email } = request
        console.log(`${id}, ${name}, ${email}`)

    });

    call.on('end', () => {
        callback(null, { message: 'finalizado com sucesso!' })
    })
}

export { addUser, addManyUsers, addUserVerbose }