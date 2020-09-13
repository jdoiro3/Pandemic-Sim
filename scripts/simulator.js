// pandemic canvas
var ctx = document.getElementById('canvas').getContext('2d');
// global array to hold hubs
var circles = [];


function refresh() {
    // get user defined settings
    let social_dist = document.getElementById("social-dist");
	let social_dis_max = social_dist.max;
	let social_dist_v = social_dist.value;
	let travel_v = document.getElementById("travel").value;
    let inf_v = document.getElementById("inf").value;
    
    // clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.strokeStyle = "rgb(255, 255, 255)";
    ctx.fillRect(0,0, canvas.width, canvas.height);

    // create a quad tree to efficiently find exposed
    let qt = new QuadTree(
        // rectangle center is half the width and height
		new Rect(canvas.width/2, canvas.height/2, canvas.width, canvas.height),
		4
		);

	pop.people.forEach(p => {
		if (p.status === 's') {
			qt.insert(p);
		}
    });

    pop.people.forEach(p => {
        if (p.status === 'i') {
            // find the exposed people by looking at the Quad Tree
            let exposed = p.getExposed(qt);
            // expose each person returned from tree
			exposed.forEach(p => p.expose());
		}
    });

    // draw Hubs, which are cirles
    circles.forEach(c => c.draw(ctx));
    // update each person's (points) position on canvas
    let step_size = Math.abs(social_dist_v - social_dis_max);
    pop.people.forEach(p => {
         // we let some people travel to another hub based on the users value
        if (Math.random() <= travel_v) {
            let dest = p.getRandDestination(circles);
            let rand_pnt = dest.random();
            p.setHub(dest);
            p.setHome(rand_pnt);
            p.toPoint(rand_pnt);
        }
        p.update(step_size);
        p.chngProbInf(inf_v);
    });
    // draw each person
    pop.people.forEach(p => p.draw(ctx));
    
	window.requestAnimationFrame(refresh);
}

function createPerson(event, type) {
	let rect = canvas.getBoundingClientRect();
	let x = event.clientX - rect.left;
	let y = event.clientY - rect.top;
    let person = new Person(x, y, type);
    for (const c of circles) {
        if (c.contains(person)) {
            person.setHub(c);
            person.setHome(new Point(x,y))
            pop.addPerson(person);
            break;
        }
    }
}

function getUserCoord(event) {
    let rect = canvas.getBoundingClientRect();
    let x = event.clientX - rect.left;
    let y = event.clientY - rect.top;
    return new Point(x,y);
}

function createHub(event) {
    // get the users x and y mouse coordinates on the canvas
    let cursor = getUserCoord(event);
    // add a circle to the array of circles
    circles.push(new Circle(cursor.x, cursor.y, 1));
    // let the user change the radius of the circle while drawing
    drawing = true;
}

function chngHubRadius(event) {
    // get the users x and y mouse coordinates on the canvas 
    let cursor = getUserCoord(event);
    // get the current circle being drawn
    let curr_circle = circles[circles.length - 1];
    // change the radius
    curr_circle.r = Point.distance(curr_circle.center, new Point(cursor.x, cursor.y));
}


var drawing = false;

canvas.addEventListener("mousedown", function(event) {
    drawing = true;
    let draw_type = $('input[name="draw-type"]:checked').val();
    console.log(draw_type);
    switch (draw_type) {
        case 'dh':
            createHub(event);
            break;
        case 'di':
            createPerson(event, 'i');
            break;
        case 'ds':
            createPerson(event, 's');
            break;
    }
});

canvas.addEventListener("mousemove", function(event) {
    if (drawing) {
        let draw_type = $('input[name="draw-type"]:checked').val();
        console.log(draw_type);
        switch (draw_type) {
            case 'dh':
                chngHubRadius(event);
                break;
            case 'di':
                createPerson(event, 'i');
                break;
            case 'ds':
                createPerson(event, 's');
                break;
        }
    }
});

canvas.addEventListener("mouseup", function() {
		drawing = false;
});

refresh();