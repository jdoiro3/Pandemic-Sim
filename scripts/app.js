

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var c = new Circle(canvas.width/2, canvas.height/2, 450);

var people = [];
for (let i = 0; i < 1000; i++) {
	let pnt = c.random();
	let person = new Person(pnt.x, pnt.y, 's');
	people.push(person);
}

function move(person, speed, qt) {
	if (Math.random() < .0001) {
		let randp = c.random();
		person.toPoint(randp);
	}

	person.update(speed);
	person.draw(ctx);
}

function refresh() {

	ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
	ctx.fillStyle = "rgb(0,0,0)";
	ctx.fillRect(0,0, canvas.width, canvas.height);
	c.draw(ctx);

	let q = new QuadTree(
		new Rect(canvas.width/2, canvas.height/2, canvas.width, canvas.height),
		4
		);

	people.forEach(p => {
		if (p.status === 's') {
			q.insert(p);
		}
	});

	q.show(ctx);

	people.forEach(p => {
		move(p, 2, q);
		if (p.status === 'i') {
			let exposed = p.getExposed(q);
			people.filter(v => exposed.includes(v)).forEach(p => p.expose());
		}
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

canvas.addEventListener("mouseup", function(event) {
		drawing = false;

})

refresh();


