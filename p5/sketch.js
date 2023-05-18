/*
reference - Weidi's youtube tutorial
*/

//giving a variable to the table
let table;
//creating a customized canvas to place the canvas at the left side of the window - not using createCanvas
let myCanvas;
//defining the arrays
let Year=[], Population=[], PerCapita=[];
//making the boxSize a global variable so every function can use this variable
let boxSize = 300;


let yoff = 0.0;

//function preload - for preloading any media elements
function preload(){
  //to access the table
  table = loadTable("assets/new-1.0.csv", "csv", "header");
  font1 = loadFont("assets/Roboto-Regular.ttf");
}

function setup() {
  colorMode(HSB)
  let canvasW = windowWidth * 3/5;
  let canvasH = windowHeight;
  //WEBGL is for a 3D canvas/space
  myCanvas = createCanvas(canvasW,canvasH,WEBGL);
  myCanvas.position(0,(windowHeight-canvasH)/2);
  
  //setting up the camera - 3D perspective
  createEasyCam();
  document.oncontextmenu = ()=>false;
  
  //getting the basic info of the data
  numRows = table.getRowCount();
  numCols = table.getColumnCount();
  //print("numRows "+numRows +" numCols "+numCols)
  //result: numRows 42 numCols 5 
  
  //loading data
  for(let i=0; i<table.getRowCount(); i++){
    Year[i] = table.getNum(i,0);
    PerCapita[i] = table.getNum(i,1);
    Population[i] = table.getNum(i,2);
  }
  
  //max value 213 min value 111
  
  cursor(HAND);
  
  //declaring a font for the tag
  textFont(font1)
}

function draw() {

  background('#DFF3FA');
  noFill();
  stroke('black')
  strokeWeight(.5)
  box(boxSize);
  push();
  translate(-width/2,-height/2,-boxSize/2);
  mainGraph();
  pop();
  

}
let count = 0

function keyPressed() {
  
  if (keyCode === RIGHT_ARROW) {
      count+=2
    if (count === 84) {
      count = 0
    }
    //console.log(count)
  }
  if (keyCode === LEFT_ARROW) {
      count-=2
    if (count === 84) {
      count = 0
    }
    //console.log(count)
  }
}

/*
x-axis - Year (84 - 42)
y-axis - Per Capita level (111-213)
z-axis - Previous to Per Capita (2)
*/



function mainGraph(){
    let xoff = 0;
  //the gap between each data sets - divided by the numbers of years we have
  let gapx = boxSize/(Year[numRows-1]-Year[0]);
  //the length of gapz - set to fill up whole box
  let gapz = boxSize;
  for(let i=0; i<table.getRowCount();i++){
    //for x,y,z positioning
    //the last 2 is becuse there is 2 data point
    let x = width/2-boxSize/2 +gapx*abs((i)/2);
    //changed the min,max from 111,113 to 100,225
    let y = map(PerCapita[i],90,225,height/2+boxSize/2,height/2-boxSize/2);
    let z = gapz*(i % 2);
    
    //mapping the points of capita to point size(datapoints)
    let size = map(PerCapita[i],90,225,8,16);
    strokeWeight(size);
    stroke('#9E9E9E');
    point(x,y,z);
    
    //tag
    push();
    translate(0,0,z);
    textSize(5);
    fill('white')
    textAlign(CENTER);
    text(PerCapita[i],x,y+10);
    pop();
    
    //connecting the points
    if(i<numRows-1){
      nextX=width/2-boxSize/2 +gapx*abs((i+1)/2);
      nextY = map(PerCapita[i+1],90,225,height/2+boxSize/2,height/2-boxSize/2);
      nextZ = gapz*((i+1) % 2);
    }
    strokeWeight(1)
    beginShape();
    //this makes sure the last point of the vertex is not connected
    if(i%2!=1){
      
      fill(`${color(216, 80, 30+(i*0.5))}`)
      stroke(`${color(216,50, 40+(i*0.5))}`)
      if (i === count) {
        stroke('white')
        const selectedInfoContainer = document.getElementById('selected-info')
        selectedInfoContainer.innerHTML = `
        In the year ${Year[i]}, the water consumption Per Capita(Gallons per person per day) is ${PerCapita[i]} for a population of ${Population[i]} people.
        `
      }
      vertex(x,y,z);
      
      for(let j=z; j<nextZ; j++){
        if(j>nextZ-2){
          vertex(nextX,nextY,j)
        }else{
          let noiseY = map(noise(xoff, yoff), 0, 1, nextY+10, nextY-10);
          vertex(nextX,noiseY,j)
          xoff += 0.05;
        }
      }
      
      vertex(nextX,nextY+(boxSize+(boxSize-nextY)-100),nextZ);
      vertex(x,nextY+(boxSize+(boxSize-nextY)-100),z);
      vertex(x, nextY, z)
      
      
    }
    endShape();
  }
}