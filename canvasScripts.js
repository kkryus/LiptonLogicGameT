window.onload=function(){

    // get canvas related references
    canvas=document.getElementById("canvas");
    ctx=canvas.getContext("2d");
    var BB=canvas.getBoundingClientRect();
    var offsetX=BB.left;
    var offsetY=BB.top;
    var WIDTH = canvas.width;
    var HEIGHT = canvas.height;
	sq2 = Math.sqrt(2);
	length = 100;
	var istrue = false;
	var startTime, endTime;
	mx = 0, my = 0;


    // drag related variables
    var dragok = false;
    var startX;
    var startY;

    // an array of objects that define different rectangles
    var polygons=[];
	
	var T = {
		x: 300,
		y: 300,
		fill:"#808080",
		points:[{x:0,y:0},{x:3*length,y:0},{x:3*length,y:length},{x:2*length,y:length}, {x:2*length,y:4*length}, {x:length,y:4*length}, {x:length,y:length}, {x:0, y:length}]
	}
	polygons.push(T);
	
	var triangle={
		x:3*length+300,
		y:300 + length,
		fill:"#663300",
		points:[{x:0,y:0},{x:0,y:-length},{x:-1/2*length,y:-1/2*length},{x:-length,y:0}],
		isDragging:false,
	}
	polygons.push(triangle);
	
	var bluePolygon = {
		x:300+2*length,
		y:300+4*length,
		fill:"#0000cc",
		points:[{x:0,y:0},{x:0,y:-3*length},{x:-length,y:-2*length},{x:-length,y:0}],	
		isDragging:false
	}
	polygons.push(bluePolygon);
	
	var redPolygon = {
		x:300,
		y:300,
		fill:"#ff0000",
		points:[{x:0,y:0},{x:3*length-sq2*length,y:0},{x:2*length - sq2*length,y:length},{x:0,y:length}],
		isDragging:false
	}
	polygons.push(redPolygon);
	
	var greenPolygon = {
		x:300+2*length - sq2*length,
		y:300+length,
		fill:"#00ff00",
		points:[{x:0,y:0},{x:length,y:-length},{x:sq2*length + length,y:-length},{x:sq2*length -length,y:length}, {x:sq2*length-length,y:0}],
		isDragging:false
	}
	polygons.push(greenPolygon);
	
    // listen for mouse events
    canvas.onmousedown = myDown;
    canvas.onmouseup = myUp;
    canvas.onmousemove = myMove;

    // call to draw the scene
    draw();

	function drawPolygon(polygon){
		var x=polygon.x;
		var y=polygon.y;
		var points=polygon.points;

		ctx.beginPath();
		ctx.moveTo( x+points[0].x, y+points[0].y );
		for(var i=1;i<points.length;i++)
		{
			ctx.lineTo( x+points[i].x, y+points[i].y );
		}
		ctx.closePath();
		ctx.fill();

	}
    // draw a single rect
    function rect(x,y,w,h) {
     ctx.beginPath();
     ctx.rect(x,y,w,h);
     ctx.closePath();
     ctx.fill();
    }

    // clear the canvas
    function clear() {
     ctx.clearRect(0, 0, WIDTH, HEIGHT);
    }

    // redraw the scene
    function draw() {
        ctx.fillStyle = "#FAF7F8";
        rect(0,0,WIDTH,HEIGHT);
        // redraw each polygon in the polygons[] array
        for(var i=0;i<polygons.length;i++)
		{
            var r=polygons[i];
            ctx.fillStyle=r.fill;
			drawPolygon(r);
        }		
    }

    // handle mousedown events
    function myDown(e){
		
		startTime = new Date();
        // tell the browser we're handling this mouse event
        e.preventDefault();
        e.stopPropagation();
		setCurrentMousePosition(e);
		
		var hex = getColorFromPoint();
		var item = polygons.filter(polygon => ( polygon.fill.toUpperCase() == hex.toUpperCase() && hex.toUpperCase()!= "#808080"))[0];
		dragok = true;
		item.isDragging = true;
		
		// save the current mouse position
		startX=mx;
		startY=my;	
    }
		
    // handle mouseup events
    function myUp(e){
		endTime = new Date();
		var timeDiff = endTime - startTime;
        e.preventDefault();
        e.stopPropagation();
		
		if(timeDiff<200 && e.which == 1)
		{
			setCurrentMousePosition(e);
			var hex = getColorFromPoint();
			
			var item = polygons.filter(polygon => ( polygon.fill.toUpperCase() == hex.toUpperCase() && hex.toUpperCase()!= "#808080"))[0];
			mirrorPolygon(item);
			draw();
				
		}
        dragok = false;
        for(var i=0;i<polygons.length;i++){
            polygons[i].isDragging=false;
        }
    }
	

    function myMove(e)
	{
		setCurrentMousePosition(e);
		if(e.which == 3)
		{				
			var hex = getColorFromPoint();
			var item = polygons.filter(rect => ( rect.fill.toUpperCase() == hex.toUpperCase() && hex.toUpperCase()!= "#808080"))[0];
			var side;
			if (item.fill.toUpperCase() == "#00ff00")
			{
				side = ((item.points[item.points.length-1].x*item.points[2].x - item.points[item.points.length-1].x) * (my - item.points[item.points.length-1].y) - (item.points[item.points.length-1].y*item.points[2].y - item.points[item.points.length-1].y) * (mx - item.points[item.points.length-1].x)) >0;
			}
			else
			{
				side = ((item.x*item.points[2].x - item.x) * (my - item.y) - (item.y*item.points[2].y - item.y) * (mx - item.x)) >0;
			}
			if(side)
			{
				angle = (2.5) * Math.PI / 180;
			}
			else
			{
				angle = (-2.5) * Math.PI / 180;
			}
			
			for(j = 0;j<item.points.length;j++)
			{							
				var x2 = item.points[j].x;
				var y2 = item.points[j].y;
				var cos = Math.cos(angle);
				var sin = Math.sin(angle);

				var newx = x2*cos - y2*sin; 
				var newy = x2*sin + y2*cos;
							
				item.points[j].x = newx;
				item.points[j].y = newy;
				draw();
			}	
			dragok = false;
			item.isDragging = false;				
		}
        if (dragok){

          e.preventDefault();
          e.stopPropagation();

          // calculate the distance the mouse has moved
          // since the last mousemove
          var dx=mx-startX;
          var dy=my-startY;

          // move each polygon that isDragging 
          // by the distance the mouse has moved
          // since the last mousemove
          for(var i=0;i<polygons.length;i++)
		  {
              var r=polygons[i];
              if(r.isDragging)
			  {
				polygons.splice(i, 1);
				polygons.push(r);
                r.x+=dx;
                r.y+=dy;
              }
          }	  
          // redraw the scene with the new rect positions
          draw();

          // reset the starting mouse position for the next mousemove
          startX=mx;
          startY=my;
        }
    }
	$('body').on('contextmenu', '#canvas', function(e){ return false; });

	function mirrorPolygon(polygon)
	{
		for(i = 0; i<polygon.points.length;i++)
		{
			polygon.points[i].x = polygon.points[i].x * -1;
		}
	}
	function setCurrentMousePosition(e)
	{
		mx=parseInt(e.clientX-offsetX);
		my=parseInt(e.clientY-offsetY);
	}
	
	function rgbToHex(r, g, b) 
	{
		if (r > 255 || g > 255 || b > 255)
		{
			throw "Invalid color component";
		}
		return ((r << 16) | (g << 8) | b).toString(16);
	}

	function getColorFromPoint()
	{
		var p = ctx.getImageData(mx, my, 1, 1).data; 
		return "#" + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
	}

}; // end $(function(){});