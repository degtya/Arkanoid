const canvas = document.querySelector('canvas')
const context = canvas.getContext('2d')

canvas.width = 500
canvas.height = 550

let image = new Image
image.src = "kruh.png"

let image1 = new Image
image1.src = "blocks.png"

let image2 = new Image
image2.src = "back.jpg"


const atlas = { //хранение данных обьектов фрейм
    ball:   {x:0, y:0, width:720, height: 719},
    platform: {x:32,y:97,width:99,height:30},
    yellow:{x:648,y:22, width:54, height:22},
    pink:{x:486, y:22, width:54, height:22},
    orange:{x:432, y:22, width:54, height:22},
    green:{x:378, y:22, width:54, height:22},
}
const ball = {
    x: canvas.width/2,
    y: canvas.height-50,
    width: 30,
    height:30,   
    speed: 200,
    angle: Math.PI / 4 + Math.random() * Math.PI / 2
}

const platform = {
    x: canvas.width/2-30,
    y: canvas.height-30,
    width: 100,
    height: 20,
    speed:200,
    leftKey: false,
    rightKey: false
}

const blocks = []

for (let q = 0; q<8; q++){
    for (let w = 0; w<8; w++){
        blocks.push({
             x:50+50*q,
             y:50+20*w,
              width:50, 
              height:20, 
              color:getRandomFrom(["pink", "yellow", "green", "orange"]),
        })
    }

}
const limits = [ //границы
    {x: 0, y: -20, width: canvas.width, height: 20},
    {x: canvas.width, y:0, width: 20, height: canvas.height},
    {x:0, y: canvas.height, width: canvas.width, height: 20},
    {x: -20, y:0, width:20, height: canvas.height},
]

document.addEventListener("keydown", function(event){ //документ ссылается на наш сайт
    if (event.key === "ArrowLeft")   {                 //означает что нажата стрелка влево
    platform.leftKey=true
    }

    else if (event.key === "ArrowRight")   {                 //означает что нажата стрелка вправo
     platform.rightKey=true
        }

    else if (event.key === "Shift"){
        //let r = getRandomFrom([1,2,3])
     //   console.log(r)
        if (r=1){
            bigger()
        }
        else if(r=2){
            smaller()
        }
        else if (r=3){
            biggerball()
        }
        //setTimeout( normal(), 5000 )
    }


    else if (playing===false && event.key==="Enter"){
        playing=true,
        Object.assign(ball,{
            x: canvas.width/2, y: canvas.height-50,
            width: 30, height:30,   
            speed: 200,
            angle: Math.PI / 4 + Math.random() * Math.PI / 2
        })
        Object.assign(platform, {
            x: canvas.width-10,y: canvas.height-30,
            width: 100,
            height: 20,
            speed:200,
            leftKey: false,
            rightKey: true
        })
        
        blocks.splice(0, blocks.length-1)
        for (let q = 0; q<8; q++){
            for (let w = 0; w<8; w++){
                blocks.push({
                     x:50+50*q,
                     y:50+20*w,
                      width:50, 
                      height:20, 
                      color:getRandomFrom(["pink", "yellow", "green", "orange"]),
                })
            }
        
        }

    }

})

document.addEventListener("keyup", function(event){
    if (event.key === "ArrowLeft")   {                 //означает что отпустили стрелку влево
     platform.leftKey=false
        }
    
        else if (event.key === "ArrowRight")   {                 //означает что отпустили стрелку вправо
            platform.rightKey=false
            }
})





requestAnimationFrame(loop) //количество секунд сколько существует страница

let pTimestamp = 0
let playing= true

function loop(timestamp){
    requestAnimationFrame(loop) 
    clearCanvas() //очищаем экран чтобы не оставались следы
if (playing){
    const dTimestamp =Math.min(16.7, timestamp - pTimestamp) // при перехода на другую стр игра зависает
    const secondPart = dTimestamp / 1000 // чтобы знать какая часть секунды прошла с пред вызова
    pTimestamp=timestamp

   

    ball.x +=  secondPart * ball.speed * Math.cos(ball.angle)  //движение мячика по осям
    ball.y -= secondPart * ball.speed * Math.sin(ball.angle)

    if (platform.leftKey){
        platform.x=Math.max(0, platform.x-secondPart * platform.speed)
    }
    
    else if (platform.rightKey){
        platform.x=Math.min(canvas.width - platform.width, platform.x+ (secondPart * platform.speed))
    }

    for (const block of blocks) { //при столкновении мячика с блоком
        if (isIntersection(block, ball)) {
            toggleItem(blocks, block) //удаляет или добавляет аййтам если был или не был
            
            const ctrl1 = { //вверхняя сторона блока,тоже блок шоб понять с какой стороны удар и как мяч будет отражаться
                x: block.x-10,
                y: block.y-10,
                width: 10+ block.width,
                height: 10
            } 
            const ctrl2 = {
                x: block.x+block.width,
                y: block.y-10,
                width: 10,
                height: 10+block.height
            } 
        
            const ctrl3 = {
                x: block.x,
                y: block.y+block.height,
                width: 10+ block.width,
                height: 10
            } 
            const ctrl4 = {
                x: block.x-10,
                y: block.y,
                width: 10,
                height: 10+block.height
            } 
        
            if (isIntersection(ctrl1, ball) || isIntersection(ctrl3, ball)){ //удар с верхушкой или низом блока изменение угла
                ball.angle = Math.PI * 2 - ball.angle
            }
            else  if(isIntersection(ctrl2, ball) || isIntersection(ctrl4, ball)){ //удар с правой чи левой стенками блока
                ball.angle = Math.PI - ball.angle
            }

            break
        }
    }
    
    if(isIntersection(limits[0], ball) || isIntersection(limits[2], ball)){ //удар с верхней и нижн платформами
        ball.angle = Math.PI * 2 - ball.angle
    }

    if(isIntersection(limits[1], ball) || isIntersection(limits[3], ball)){ //удар с верхней и нижн платформами
        ball.angle = Math.PI - ball.angle
    }

    if (isIntersection(platform, ball)){ //удар мячика с платформой
        const x = ball.x +ball.width / 2
        const percent = (x - platform.x) / platform.width
        ball.angle = Math.PI - Math.PI * 8 /10 * (percent +0.1)
    }

    if (isIntersection(limits[2], ball)){
        playing = false
    }}
  
    drawBall(ball)

    for (const block of blocks){
        drawBlock(block)
    }

    drawPlatform(platform)

    if (!playing){
        drawResult()
    }
}

function clearCanvas () {
 context.drawImage(image2,0,0, image2.width*1.5, image2.height*1.5)
    //  canvas.width |=0 // canvas.width=canvas.width изменяя ширину высоту канвас очищается
}


function isIntersection (blockA, blockB){ //фция котораяделает границы конваса шоб мяч отталкивался
    const pointsA =[ //пересечение двух блоков по крайним точкам
        {x:blockA.x, y: blockA.y},
        {x:blockA + blockA.width, y: blockA.y},
        {x:blockA.x, y:blockA.y +blockA.height},
        {x:blockA + blockA.width, y: blockA.y+blockA.height}
    ]
    for (const pointA of pointsA){
        if (blockB.x <= pointA.x && pointA.x <= blockB.x +blockB.width&& blockB.y <= pointA.y && pointA.y <= blockB.y + blockA.height){
            return true
        }
    }
    const pointsB =[
        {x:blockB.x, y: blockB.y},
        {x:blockB + blockB.width, y: blockA.y},
        {x:blockB.x, y:blockB.y +blockB.height},
        {x:blockB + blockB.width, y: blockB.y+blockB.height}
    ]
    for (const pointB of pointsB){
        if (blockA.x <= pointB.x && pointB.x <= blockA.x +blockA.width&& blockA.y <= pointB.y && pointB.y <= blockA.y + blockB.height){
            return true
        }
    }
}


function toggleItem (array, item){ //удалить блок
    if (array.includes(item)){
        const index= array.indexOf(item)
        array.splice(index, 1)
    }
else{
    array.push(item)
}}

function drawBall (ball){
   
    context.drawImage(
    image,
    atlas.ball.x, atlas.ball.y, atlas.ball.width, atlas.ball.height,
    ball.x, ball.y, ball.width, ball.height
    )
}
function drawBlock(block){
    context.drawImage(
        image1,
    atlas[block.color].x, atlas[block.color].y, atlas[block.color].width, atlas[block.color].height,
    block.x, block.y, block.width, block.height
    )
}
function drawPlatform(platform){
    context.drawImage(
        image1,
    atlas.platform.x, atlas.platform.y, atlas.platform.width, atlas.platform.height,
    platform.x, platform.y, platform.width, platform.height
    )
}

function normal(){
    platform.width=100
    ball.width=30
    ball.height=30
}

function bigger(){
    platform.width= 200
    ball.width=30
    ball.height=30
     
}

function smaller(){
    platform.width= 50
    ball.width=30
    ball.height=30
    
}


function biggerball(){
    ball.width= 50
    ball.height=50
    platform.width=100
    
}


function getRandomFrom(array){
    const index = Math.floor(Math.random()*array.length)
    return array[index]
}



function drawResult() {
    context.beginPath()
    context.rect(0,0,canvas.width,canvas.height)
    context.fillStyle= "rgba(255,255,255,0.8)"
    context.fill()
    context.fillStyle="black"
    context.font="35px Monaco"
    context.textAlign="center"
    context.fillText("Game Over!", canvas.width/2,canvas.height/2)

    context.fillStyle="black"
    context.font="20px Monaco"
    context.textAlign="center"
    context.fillText("Press 'Enter'", canvas.width/2,canvas.height/2+ 50)
}


