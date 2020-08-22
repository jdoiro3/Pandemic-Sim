

let canvas = document.getElementById('my-canvas');
let ctx = canvas.getContext('2d');
let c = new Circle(canvas.width/2, canvas.height/2, 400);
c.draw(ctx);

let people = [];
for (let i = 0; i < 100; i++) {
	let pnt = c.random();
	let person = new Person(pnt.x, pnt.y, 's');
	let randp = c.random();
	randp.draw(ctx);
	person.toPoint(randp);
	people.push(person);
}

function check(person) {
	if (person.moveStatus !== 'to point') {
		let randp = c.random();
		person.toPoint(randp);
	}
}

function refresh() {

	let canvas = document.getElementById('my-canvas');
	let ctx = canvas.getContext('2d');

	ctx.clearRect(0, 0, canvas.width, canvas.height); // clear canvas
	let c = new Circle(canvas.width/2, canvas.height/2, 400);
	c.draw(ctx);

	people.forEach(p => check(p));
	people.forEach(p => p.dest.draw(ctx));
	people.forEach(p => p.update(20));
	people.forEach(p => p.draw(ctx));


	window.requestAnimationFrame(refresh);
}

refresh();
