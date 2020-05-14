const users = []

//4 functions
//add user, remove user, getuser, getusersinroom

const addUser = ({ id, username, room }) => {
    //clean data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate data
    if(!username || !room )
    {
        return {
            error: 'Username and room are required'
        }  
        
    }

    //check for existing user
    const existinguser = users.find((user)=>{
        return user.room === room && user.username === username
    })

    //validate username
    if(existinguser)
    {
        return {
            error: 'Username is in use'
        }
    }

    //store user
    const user = { id, username, room}
    users.push(user)
    return { user }
}

const removeUser = (id)=> {
    const index = users.findIndex((user)=> user.id === id)
    if(index !== -1)
    {
        return users.splice(index,1)[0]
    }
}

const getUser = (id)=> {
    return users.find((user)=>user.id === id)
}

const getUsersInRoom = (room) => {
    room = room.trim().toLowerCase()
    return users.filter((user) => user.room === room)
}

// addUser({
//     id:22,
//     username:'Anu  ',
//     room:'jhansi'
// })

// addUser({
//     id:42,
//     username:'Anukrati  ',
//     room:'jhansi'
// })

// addUser({
//     id:32,
//     username:'Anu',
//     room:'abcd'
// })
// console.log(users)

// const user = getUser(421)
// console.log(user)
// const userlist = getUsersInRoom('abc')
// console.log(userlist)

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}