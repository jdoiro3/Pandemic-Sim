var canvas = document.getElementById('my-canvas');
var ctx = canvas.getContext('2d');

var qt = new QuadTree(new Rect(canvas.width/2, canvas.height/2, canvas.width, canvas.height), 4);

for (let i = 0; i < 1000; i++) {
	var p = new Point(Math.random()*canvas.width, Math.random()*canvas.height);
	qt.insert(p);
	p.draw(ctx);
}

qt.show(ctx);
var r = new Rect(220, 220, 30, 30);
r.draw(ctx);
var query_points = qt.query(r);
query_points.forEach(p => p.draw(ctx, fill=true));


