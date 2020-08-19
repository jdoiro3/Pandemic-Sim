var canvas = document.getElementById('my-canvas');
var ctx = canvas.getContext('2d');

var qt = new QuadTree(
	new Rect(
		canvas.width/2, 
		canvas.height/2, 
		canvas.width, 
		canvas.height
		), 
	4);

var c = new Circle(canvas.width/2, canvas.height/2, 300);

c.draw(ctx);

for (let i = 0; i < 1000; i++) {
	let p = c.random();
	let person = new Person(p.x, p.y);
	person.draw(ctx);
	qt.insert(person);
}

for (let i = 0; i < 100; i++) {
	let p = c.random();
	let person = new Person(p.x, p.y, infected=true);
	person.draw(ctx);
	qt.insert(person);
}


qt.show(ctx);