//region Values
var tower1Values = {className : "Tower1", level1 : 200, level2 : 100, level3 : 300, power1 : 20, power2 : 30, power3 : 50};
var tower2Values = {className : "Tower2", level1 : 300, level2 : 200, level3 : 400, power1 : 30, power2 : 40, power3 : 60};
var tower3Values = {className : "Tower3", level1 : 400, level2 : 300, level3 : 500, power1 : 40, power2 : 50, power3 : 80};
var towers = new Array(tower1Values, tower2Values, tower3Values);

var mapDimension = {height : 437, length : 700};
var startCoordinates = [{x : 30, y : 100},{x : 30, y : 120},{x : 30, y : 140}];
var endCoordinates = [{x : 300, y : 100},{x : 300, y : 120},{x : 300, y : 140}];

var lastDirection = 1;//set the last direction of the tile drawing to the right

//endregion Values

//Tower class
function AttachTower(obj)
{
    document.getElementById("mapDiv").style.display="block";
    var tower = GetTower(obj);
    if(EnoughMoney(tower.level1))
    {
        document.getElementById("mapDiv").style.cursor=obj.value;
    }
} 
function PlaceOrUpgradeTower()//mouse click over the div
{
    if (document.getElementById("mapDiv").style.cursor.contains("Tower")==true)
    {
//        if (ValidPlacement() || UpgradePossible())
//        {
            ModifyAmount(-200);
            document.getElementById("mapDiv").style.cursor = "auto";
//        }
    }
}

function GetTower(obj)
{
    for (var i = 0; i < towers.length; i++)
    {
        if (towers[i].className == obj.className)
        {
            return towers[i];
        }
    }
}
function EnoughMoney(towerCost)
{
    if (towerCost > document.getElementById("textMoney").value)
    {
        document.getElementById("messages").innerHTML = "Message: You do not have enough money for this action.";
        return false;
    }
    return true;
}
function ModifyAmount(amount)
{
    var money = document.getElementById("textMoney");
    var oldAmount = money.value;
    document.getElementById("textMoney").value = +(oldAmount) + amount;
}

//Map class
function CreatePath()
{
    var rand = Math.floor((Math.random()*9));
    if ((rand+1) * 76 > mapDimension.length)
    {
        rand = rand - 1;
    }
    var start = {x : 0, y : rand * 76 };
    //var xMiddle = [];
    //xMiddle.push(start.x + 38);
    //var yMiddle = [];
    //yMiddle.push(start.y + 38);
    var mapTileList = [];
    var stop = false;
    while(!stop)
    {
        var newGeneration = GenerateNextPathTile(start);
        stop = newGeneration.stop;
        var newTile = {x : newGeneration.tileX, y : newGeneration.tileY};
        mapTileList.push(newTile);
        //draw the tile on the div
        DrawPath(newTile);
        start.x = newTile.x;
        start.y = newTile.y;
    }
    //path width is same as tower dimension: 76x76px
}

function DrawPath(tileCoord)
{
    //var getMapDiv = document.getElementById("mapDiv");
    var newImage = document.createElement("img");
    newImage.setAttribute('class', 'mapTile');
    newImage.setAttribute('src', 'Images/path.png');
    newImage.style.left = tileCoord.x + "px";
    newImage.style.top = tileCoord.y + "px";
    document.getElementById("mapDiv").appendChild(newImage);
}
function GenerateNextPathTile(start)
{
    var newTileX;
    var newTileY;
    if ((start.y + 76 < mapDimension.height) && (start.x + 76 < mapDimension.length))
    {
        var mapDone = false;
        var rand = 1;
        var loop = 1;
        while(loop)
        { 
            if ((lastDirection - rand == 2) || (lastDirection - rand == -2))
            {
                rand = Math.floor(Math.random()*3);
            }
            else
            {
                loop = 0;
            }
        }
        
        //check if it touches the top or bottom of the map 
        switch(rand)
        {
            // direction down
            case 0:
            {
                if(start.y + 76 > mapDimension.length)
                    {                
                    newTileX = start.x + 76;
                    newTileY = start.y;
                    lastDirection = 1;
                    }
                else
                {
                    newTileX = start.x;
                    newTileY = start.y + 76;
                    lastDirection = 0;
                }
                break;
                }
            //direction right
            case 1:
                {if (start.x + 76 > mapDimension.height)
                    {mapDone = true;}
                newTileX = start.x + 76;
                newTileY = start.y;
                lastDirection = 1;
                break;
                }
            //direction up
            case 2:
                {if (start.y - 76 < 0)
                    {
                    newTileX = start.x + 76;
                    newTileY = start.y;
                    lastDirection = 1;
                    }
                else{
                    newTileX = start.x;
                    newTileY = start.y - 76;
                    lastDirection = 2;
                }
                break;}
        }
        return {tileX : newTileX, tileY : newTileY, stop : mapDone};
    }
}
