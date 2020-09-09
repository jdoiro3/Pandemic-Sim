
var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var c = new Circle(canvas.width/4, canvas.height/4, 200);
var c2 = new Circle((canvas.width-canvas.width/4), (canvas.height-canvas.height/4), 200);

var people = [];
for (let i = 0; i < 1000; i++) {
	if (Math.random() > .5) {
		let pnt = c.random();
		let person = new Person(pnt.x, pnt.y, 's');
		people.push(person);
	} else {
		let pnt = c2.random();
		let person = new Person(pnt.x, pnt.y, 's');
		people.push(person);
	}
}

function move(person, step_size, prob_to_travel, qt) {
	if (Math.random() < prob_to_travel) {
		if (Math.random() > .5) {
			let randp = c.random();
			person.toPoint(randp);
		} else {
			let randp = c2.random();
			person.toPoint(randp);
		}
	}

	person.update(step_size);
	person.draw(ctx);
}

function refresh() {

	let social_dist = document.getElementById("social-dist");
	let social_dis_max = social_dist.max;
	let social_dist_v = social_dist.value;
	let travel_v = document.getElementById("travel").value;
	let inf_v = document.getElementById("inf").value;

	ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.strokeStyle = "rgb(255, 255, 255)";
	ctx.fillRect(0,0, canvas.width, canvas.height);

	let q = new QuadTree(
		new Rect(canvas.width/2, canvas.height/2, canvas.width, canvas.height),
		4
		);

	people.forEach(p => {
		if (p.status === 's') {
			q.insert(p);
		}
	});

	//q.show(ctx);

	people.forEach(p => {
		let step_size = Math.abs(social_dist_v - social_dis_max);
		move(p, step_size, travel_v, q);
		if (p.status === 'i') {
			let exposed = p.getExposed(q);
			exposed.forEach(p => p.expose());
		}
		p.chngProbInf(inf_v);
	});

	window.requestAnimationFrame(refresh);
}

function userDraw(event, type) {
	let rect = canvas.getBoundingClientRect();
	let x = event.clientX - rect.left;
	let y = event.clientY - rect.top;
	let person = new Person(x, y, type);
	people.push(person);
}


var drawing = false;

canvas.addEventListener("mousedown", function(event) {
	drawing = true;
	userDraw(event, 'i');
})

canvas.addEventListener("mousemove", function(event) {
	if (drawing === true) {
		userDraw(event, 'i');
	}
})

canvas.addEventListener("mouseup", function() {
		drawing = false;

})

refresh();


