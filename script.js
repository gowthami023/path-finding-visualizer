let rows = 10;
let cols = 10;
let speed = 100;


let grid = document.getElementById("grid");



let gridArray = [];

let visualGrid = [];




// CREATE GRID

for(let r=0;r<rows;r++)
{


    gridArray[r]=[];

    visualGrid[r]=[];


    for(let c=0;c<cols;c++)
    {


        let cell=document.createElement("div");


        cell.className="cell";


        visualGrid[r][c]=cell;




        let node={


            row:r,

            col:c,


            visited:false,


            wall:false,


            parent:null,


            distance:Infinity,


            g:Infinity,


            h:0,


            f:Infinity


        };



        gridArray[r][c]=node;





        if(r==0 && c==0)
        {
            cell.style.background="green";
        }




        if(r==9 && c==9)
        {
            cell.style.background="red";
        }






        // CREATE WALLS

        cell.addEventListener("click",()=>{


            if(
            (r==0 && c==0) ||
            (r==9 && c==9)
            )
            {
                return;
            }



            gridArray[r][c].wall=true;


            cell.style.background="black";



        });







        grid.appendChild(cell);



    }

}

let speedSlider = document.getElementById("speed");


speedSlider.addEventListener("input",()=>{

    speed = speedSlider.value;

});





let start={

row:0,

col:0

};



let end={

row:9,

col:9

};






// FIND NEIGHBOURS

function getNeighbours(node)
{


    let neighbours=[];



    let directions=[

        [-1,0],

        [1,0],

        [0,-1],

        [0,1]

    ];





    for(let dir of directions)
    {


        let newRow=node.row+dir[0];

        let newCol=node.col+dir[1];



        if(
        newRow>=0 &&
        newRow<rows &&
        newCol>=0 &&
        newCol<cols
        )
        {


            neighbours.push(
            gridArray[newRow][newCol]
            );


        }


    }



    return neighbours;


}








// ANIMATION

function animateCell(node)
{


    let cell=
    visualGrid[node.row][node.col];



    if(
    node.row==start.row &&
    node.col==start.col
    )
    {
        return;
    }




    if(
    node.row==end.row &&
    node.col==end.col
    )
    {
        return;
    }




    cell.style.background="yellow";


}






function sleep(ms)
{

return new Promise(resolve=>setTimeout(resolve,ms));

}








// BFS

async function visualize()
{


let queue=[];



let startNode=
gridArray[start.row][start.col];



queue.push(startNode);



startNode.visited=true;




while(queue.length>0)
{


let current=queue.shift();



animateCell(current);


await sleep(speed);




if(
current.row==end.row &&
current.col==end.col
)
{


drawPath();

return;


}






let neighbours=getNeighbours(current);




for(let neighbour of neighbours)
{


if(
neighbour.visited==false &&
neighbour.wall==false
)
{


neighbour.visited=true;


neighbour.parent=current;



queue.push(neighbour);



}


}



}


}








// DRAW PATH

function drawPath()
{


let current=
gridArray[end.row][end.col];



while(current.parent!=null)
{


let cell=
visualGrid[current.row][current.col];



if(
current.row!=start.row ||
current.col!=start.col
)
{

cell.style.background="blue";

}



current=current.parent;


}


}









// CLEAR BOARD

function clearBoard()
{


for(let r=0;r<rows;r++)
{


for(let c=0;c<cols;c++)
{


let node=gridArray[r][c];


node.visited=false;

node.wall=false;

node.parent=null;

node.distance=Infinity;

node.g=Infinity;

node.h=0;

node.f=Infinity;



visualGrid[r][c].style.background="white";



}

}



visualGrid[start.row][start.col]
.style.background="green";


visualGrid[end.row][end.col]
.style.background="red";


}








// PRIORITY QUEUE FOR DIJKSTRA

class PriorityQueue
{


constructor()
{

this.items=[];

}




enqueue(element,priority)
{


this.items.push({

element:element,

priority:priority

});


}





dequeue()
{


let smallest=0;



for(let i=1;i<this.items.length;i++)
{


if(
this.items[i].priority <
this.items[smallest].priority
)
{

smallest=i;

}


}



return this.items.splice(smallest,1)[0].element;



}





isEmpty()
{

return this.items.length==0;

}


}









// DIJKSTRA

async function dijkstra()
{


let pq=new PriorityQueue();



let startNode=
gridArray[start.row][start.col];



startNode.distance=0;



pq.enqueue(startNode,0);





while(!pq.isEmpty())
{


let current=pq.dequeue();




if(current.visited)
continue;




current.visited=true;



animateCell(current);


await sleep(speed);




if(
current.row==end.row &&
current.col==end.col
)
{


drawPath();

return;


}





let neighbours=getNeighbours(current);




for(let neighbour of neighbours)
{


if(neighbour.wall)
continue;



let newDistance=
current.distance+1;




if(newDistance < neighbour.distance)
{


neighbour.distance=newDistance;


neighbour.parent=current;


pq.enqueue(
neighbour,
newDistance
);



}



}


}



}









// HEURISTIC FOR A*

function heuristic(node)
{


return Math.abs(node.row-end.row)
+
Math.abs(node.col-end.col);


}









// A STAR

async function astar()
{


let openSet=[];



let startNode=
gridArray[start.row][start.col];



startNode.g=0;


startNode.h=heuristic(startNode);


startNode.f=
startNode.g+startNode.h;



openSet.push(startNode);







while(openSet.length>0)
{


let smallest=0;



for(let i=1;i<openSet.length;i++)
{


if(
openSet[i].f <
openSet[smallest].f
)
{

smallest=i;

}


}





let current=
openSet.splice(smallest,1)[0];





if(current.visited)
continue;



current.visited=true;



animateCell(current);



await sleep(speed);





if(
current.row==end.row &&
current.col==end.col
)
{


drawPath();

return;


}





let neighbours=getNeighbours(current);





for(let neighbour of neighbours)
{


if(neighbour.wall)
continue;




let newG=current.g+1;




if(newG < neighbour.g)
{


neighbour.parent=current;


neighbour.g=newG;


neighbour.h=heuristic(neighbour);



neighbour.f=
neighbour.g+neighbour.h;



openSet.push(neighbour);



}



}



}



}