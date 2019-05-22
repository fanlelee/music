function getMusic(callback){
    var xhr = new XMLHttpRequest()
    xhr.open('get', '/music.json', true)
    xhr.onload = function(){
        if((xhr.status>=200 && xhr.status<300) || xhr == 304){
            // console.log(JSON.parse(xhr.responseText))
            callback(JSON.parse(xhr.responseText))
        }
    }
    xhr.send()
}
function $(select){
    return document.querySelector(select)
}

var musicList
var musicIndex = 1
var musicObj = new Audio()
musicObj.autoplay = true

getMusic(function(list){
    // console.log(list)
    musicList = list
    loadMusic(musicList[musicIndex])
})

function loadMusic(song){
    musicObj.src = song.src
    $('.name').innerText = song.title
    $('.author').innerText = song.auther
    $('#cover').style.backgroundImage = 'url('+song.img+')'
    ifplay()
}

$('.iconfont.play').onclick = function(){
    musicObj.play()
    ifplay()
}

$('.iconfont.pause').onclick = function(){
    musicObj.pause()
    ifplay()
}

$('.iconfont.backward').onclick = backward
$('.iconfont.forward').onclick = forward
musicObj.onended = forward

function backward(){
    musicIndex--
    musicIndex = (musicIndex+musicList.length)%(musicList.length)
    loadMusic(musicList[musicIndex])
}
function forward(){
    musicIndex++
    musicIndex = musicIndex%(musicList.length)
    loadMusic(musicList[musicIndex])
}

function ifplay(){
    if(musicObj.paused === true){
        $('.iconfont.pause').style.display = 'none'
        $('.iconfont.play').style.display = 'inline'
    }else{
        $('.iconfont.play').style.display = 'none'
        $('.iconfont.pause').style.display = 'inline'
    }
}


musicObj.ontimeupdate = function(){
    ifplay()
    makeProgress()
}

function makeProgress(){
    if(isNaN(musicObj.duration)){
        $('.progress .timing').innerText = '0.00'
        $('.progress .bar .bar-now').style.width = 0
    }else{
        var restTime = musicObj.duration-musicObj.currentTime
        var minutes = parseInt(restTime/60)+''
        var seconds = parseInt(restTime%60)+''
        seconds = seconds.length<2?'0'+seconds:seconds
        $('.progress .timing').innerText = minutes+":"+seconds
        $('.progress .bar .bar-now').style.width = (musicObj.currentTime/musicObj.duration)*100+'%'
    }
}

$('.progress .bar').onclick = function(e){
    var percent = e.offsetX/parseInt(getComputedStyle(this).width)
    musicObj.currentTime = musicObj.duration*percent
}
