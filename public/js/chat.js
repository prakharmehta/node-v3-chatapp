

const socket = io()
// socket.on('countupdated',(count)=>
// {
// console.log('count updated',count)
// })

// document.querySelector('#increment').addEventListener('click',()=>
// {
//     console.log('clicked')
//     socket.emit('increment')    
// })

//server(emit)->client(receive) --acknowledgement

//ELEMENTS

const $messageform = document.querySelector('#message-form')
const $messageforminput= document.querySelector('input')
const $messageformbutton = document.querySelector('button')
const $sendlocation=document.querySelector('#sendlocation')
const $messages=document.querySelector('#messages')
const locationmessagetemplate=document.querySelector('#location-message-template').innerHTML
const sidebartemplate = document.querySelector('#sidebar-template').innerHTML
//TEMPLATES
const messagetemplate = document.querySelector('#message-template').innerHTML

//options
const { username , room} = Qs.parse(location.search,{ ignoreQueryPrefix: true})
const autoscroll = () => {
    //new message element
    const $newmessage = $messages.lastElementChild

    //height of the new message
    const newmessagestyles = getComputedStyle($newmessage)
    const newmessagemargin = parseInt(newmessagestyles.marginBottom) 

    const newmessageheight = $newmessage.offsetHeight+newmessagemargin
    const visibleheight = $messages.offsetHeight
    const containerheight = $messages.scrollHeight

//how far have i scrolled
    const scrolloffset = $messages.scrollTop+visibleheight

    if(containerheight - newmessageheight <= scrolloffset) {
        $messages.scrollTop = $messages.scrollHeight
    }


}

socket.on('message',(message)=>
{
    console.log(message)
    const html = Mustache.render(messagetemplate,{
        username:message.username,
        message:message.text,
        createdat: moment(message.createdat).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
})
socket.on('message123',(message123)=>
{
    console.log(message123)
})

// socket.on('locationmesssage',(mapurl)=>
// {
//     console.log(mapurl)
// })
socket.on('locationmessage',(message)=>
{
    console.log(message)
    const html = Mustache.render(locationmessagetemplate, {
        username:message.username,
        url:message.url,
    createdat:moment(message.createdat).format('h:mm a')        

    })
    $messages.insertAdjacentHTML('beforeend',html)
    autoscroll()
    
})

socket.on('roomdata',({ room, users })=>
{
    const html = Mustache.render(sidebartemplate,{
        room,
        users
    })
    document.querySelector('#sidebar').innerHTML= html
})

$messageform.addEventListener('submit',(e)=>
{
e.preventDefault()
//disable the form
$messageformbutton.setAttribute('disabled','disabled')
const message=e.target.elements.message.value
socket.emit('sendmessage',message,(error)=>
{
    //re enable
    $messageformbutton.removeAttribute('disabled')
    $messageforminput.value=''
    $messageforminput.focus()
    if(error)
    {
        return console.log(error)
    }
    console.log('message was delivered',message)
})

})
document.querySelector('#sendlocation').addEventListener('click',()=>
{
   
    if(!navigator.geolocation)
    {
        return alert('Does not support geolocation by your browser')
    }
    $sendlocation.setAttribute('disabled','disabled')
    navigator.geolocation.getCurrentPosition((position)=>
    {
        socket.emit('sendlocation',{
            latitude:position.coords.latitude,
            longitude:position.coords.longitude
        },()=>
        {
            $sendlocation.removeAttribute('disabled')
            console.log('location shared')

        })

    })
})

socket.emit('join',{username , room}, (error)=>{
    if(error) {
        alert(error)
        location.href = '/'
    }
})