//Create variables here
var dog,sadDog,happyDog;
var database;
var foodS,foodStock;
var fedTime,lastFed,feed,addFood,foodObj;


function preload()
{
	//load images here
  sadDog=loadImage("images/dogImg.png");
  happyDog=loadImage("images/dogImg1.png");
}

function setup() {
	createCanvas(1000, 400);
  database=firebase.database();

  foodObj=new Food()
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;

  feed=createButton("feed The Dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("AddFood");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  textSize(20);

}


function draw() {  

  background(46,139,87);

  foodObj.display();
  fedTime=database.ref("FeedTime");
  
  fedTime.on("value",function(data){
    lastFed=data.val();
  })

  fill(255,255,254);
  textSize(15);
  if (lastFed>=12){
    text("last fed="+lastFed%12+" pm",350,30);

  }
  else if(lastFed==0){
    text("last fed=12am",350,30);
  }
  else{
     text("last fed="+lastFed+" am",350,30);
  }
  drawSprites();

  /*if(keyWentDown(UP_ARROW)){
    writeStock(foodS);
    dog.addImage(sadDog);

  }
  if(keyWentDown(DOWN_ARROW)){
    feedStock(foodS);
    dog.addImage(happyDog);

  }
  drawSprites();
  //add styles here
  text("foodRemaining="+foodS,170,200);
  textSize(13);
  text("plsPressUpArrowToFeedTheDog",130,10);
*/
}

//the function to read the data from database.
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS)
}
function writeStock(x){
  if (x<=0){
    x=0;

  }
  else {
    x=x-1
  }
  database.ref('/').update({
    Food:x
  })
}

// funtion to update food stock and last fed time.
function feedDog(){
  dog.addImage(happyDog);
  
  if (foodObj.getFoodStock()<=0){
    foodObj.updateFoodStock(foodObj.getFoodStock()*0);
  }
  else{
    foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  }
  database.ref("/").update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour()
  })
}

// funtion to add food in the stock.

function addFoods(){
  foodS++;
  database.ref("/").update({
    Food:foodS
  })
}