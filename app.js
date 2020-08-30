

var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var c = new Circle(canvas.width/2, canvas.height/2, 500);

var people = [];
for (let i = 0; i < 500; i++) {
	let pnt = c.random();
	let person = new Person(pnt.x, pnt.y, 's');
	people.push(person);
}

function move(person, speed) {
	if (Math.random() < .001) {
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

	people.forEach(p => move(p, 2));

	window.requestAnimationFrame(refresh);
}

canvas.addEventListener("click", function(event) {
	let rect = canvas.getBoundingClientRect();
	let x = event.clientX - rect.left;
	let y = event.clientY - rect.top;
	let person = new Person(x, y, 'i');
	people.push(person);
})

refresh();
