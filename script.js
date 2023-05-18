const canvas = document.getElementById('myCanvas');
const context = canvas.getContext('2d');

function drawTree(x, y, size, angle) {
  if (size < 10) {
    return;
  }
  context.save();
  context.translate(x, y);
  context.rotate(angle);
  context.fillRect(-size / 10, 0, size / 5, -size);
  drawTree(0, -size, size * 0.8, -0.1);
  drawTree(0, -size, size * 0.8, 0.1);
  context.restore();
}

drawTree(canvas.width / 2, canvas.height, canvas.height / 4, 0);
