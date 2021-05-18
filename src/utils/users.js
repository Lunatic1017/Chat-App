const users = []

const addUser = ({ id , username , Room}) => {

    username = username.trim().toLowerCase()
    Room = Room.trim().toLowerCase()

    if (!username || !Room) {
        return {
            error : 'Username and Room are required'
        }
    }
    
    const existingUser = users.find((user) => {
        return user.Room === Room && user.username === username
    })

    if (existingUser) {
        return {
            error : 'Username already exists!'
        }
    }

    const user = {id , username , Room}
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)

    if (index !== -1) {
        return users.splice(index , 1)[0]
    }
}

const getUser = (id) => {
    return match = users.find((user) => user.id === id)
}

const getUsersinRoom = (Room) => {
    Room = Room.trim().toLowerCase()
    return res = users.filter((user) => user.Room === Room) 

}

module.exports = {
    addUser , 
    removeUser ,
    getUser ,
    getUsersinRoom
}