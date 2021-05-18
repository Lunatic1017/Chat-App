const socket = io() 

const $messageForm = document.querySelector('#input')
const $messageFormInput = $messageForm.querySelector('input')
const $messageFormButton = $messageForm.querySelector('button')
const $locationFormButton = document.querySelector('#sendLocation')
const $messages = document.querySelector('#messages')

//Templates

const messasgeTemplate = document.querySelector('#message-template').innerHTML
const locationTemplate = document.querySelector('#location-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
const {username , Room} = Qs.parse(location.search , {ignoreQueryPrefix : true})

const autoScroll = () => {
    const $newMessage = $messages.lastElementChild

    const newMessageStyles = getComputedStyle($newMessage)
    const newMessageMargin = parseInt(newMessageStyles.marginBottom)
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

    const visibleHeight = $messages.offsetHeight

    const containerHeight = $messages.scrollHeight

    const scrollOffset = $messages.scrollTop + visibleHeight

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight
    }
}

socket.on('message' ,(message) => {
    console.log(message)
    const html = Mustache.render(messasgeTemplate , {
        username : message.username ,
        message : message.text ,
        createdAt : moment(message.createdAt).format('HH:mm')
    })
    $messages.insertAdjacentHTML('beforeend' , html)
    autoScroll()
})

socket.on('location-message' , (url) => {
    console.log(url)
    const html = Mustache.render(locationTemplate , {
        username : url.username ,
        url : url.location ,
        createdAt : moment(url.createdAt).format('HH:mm ')
    })
    $messages.insertAdjacentHTML('beforeend' , html)
    autoScroll()
})

socket.on('roomData' , ({Room , users}) => {
    console.log(Room)
    console.log(users)
    const html = Mustache.render(sidebarTemplate ,{
        Room,
        users,
    })
    document.querySelector('#sidebar').innerHTML = html
})


$messageForm.addEventListener('submit' ,(e) => {
    e.preventDefault()
    //disable the button 
    $messageFormButton.setAttribute('disabled' , 'disabled')

    const message = e.target.elements.message.value
    socket.emit('SendMessage' , message , (error) => {
        //enable
        $messageFormButton.removeAttribute('disabled')
        $messageFormInput.value = ''
        $messageFormInput.focus()
        if (error) {
            return console.log(error)
        }
        console.log('Message Deliverd!')
    })
})
$locationFormButton.addEventListener('click' , () => {
    if(!navigator.geolocation){
        return alert('Geoloaction is not supported by the browser')
    }
    $locationFormButton.setAttribute('disabled' , 'disabled')

    
    navigator.geolocation.getCurrentPosition((position) => {
        $locationFormButton.removeAttribute('disabled')
        socket.emit('sendlocation' , {
            latitude : position.coords.latitude ,
            longitude : position.coords.longitude
        } , () => {
            console.log('Location shared!')
        })
    })
})

socket.emit('join' , {username , Room} , (error) => {
    if (error) {
        alert(error)
        location.href= '/'
    }
})