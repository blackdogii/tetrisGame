const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const ROWS = 20, COLS = 10, BLOCK = 32;
const COLORS = { 'I':'cyan','J':'blue','L':'orange','O':'yellow','S':'green','T':'purple','Z':'red' };
const TETROMINOS = {
  I: [[1,1,1,1]],
  J: [[1,0,0],[1,1,1]],
  L: [[0,0,1],[1,1,1]],
  O: [[1,1],[1,1]],
  S: [[0,1,1],[1,1,0]],
  T: [[0,1,0],[1,1,1]],
  Z: [[1,1,0],[0,1,1]]
};
let matrix = Array.from({length: ROWS}, () => Array(COLS).fill(0));

function randomTetromino() {
  const names = Object.keys(TETROMINOS);
  const name = names[Math.floor(Math.random()*names.length)];
  return { name, shape: TETROMINOS[name], row: 0, col: Math.floor(COLS/2) - 1 };
}

let cur = randomTetromino();

function collide(shape, r, c) {
  for (let y = 0; y < shape.length; y++)
    for (let x = 0; x < shape[y].length; x++)
      if (shape[y][x] &&
         (matrix[y+r] === undefined || matrix[y+r][x+c] === undefined || matrix[y+r][x+c]))
        return true;
  return false;
}

function merge() {
  cur.shape.forEach((row,y) =>
    row.forEach((v,x) => {
      if (v) matrix[cur.row+y][cur.col+x] = cur.name;
    })
  );
}

function clearLines() {
  matrix = matrix.filter(row => row.some(v=>!v));
  while (matrix.length < ROWS) matrix.unshift(Array(COLS).fill(0));
}

function rotateShape(s) {
  return s[0].map((_,i) => s.map(row => row[i]).reverse());
}

function update() {
  if (!collide(cur.shape, cur.row+1, cur.col)) cur.row++;
  else {
    merge();
    clearLines();
    cur = randomTetromino();
    if (collide(cur.shape, cur.row, cur.col)) matrix = Array.from({length: ROWS}, ()=>Array(COLS).fill(0));
  }
}

function drawBlock(x,y,c) {
  ctx.fillStyle = c;
  ctx.fillRect(x*BLOCK, y*BLOCK, BLOCK, BLOCK);
  ctx.strokeStyle = '#222';
  ctx.strokeRect(x*BLOCK, y*BLOCK, BLOCK, BLOCK);
}

function draw() {
  ctx.clearRect(0,0,canvas.width,canvas.height);
  matrix.forEach((row,y)=>row.forEach((v,x)=>{ if(v) drawBlock(x,y, COLORS[v]); }));
  cur.shape.forEach((row,y)=>row.forEach((v,x)=>{ if(v) drawBlock(cur.col+x, cur.row+y, COLORS[cur.name]); }));
}

document.addEventListener('keydown', e => {
  if (e.key === 'ArrowLeft' && !collide(cur.shape,cur.row,cur.col-1)) cur.col--;
  if (e.key === 'ArrowRight' && !collide(cur.shape,cur.row,cur.col+1)) cur.col++;
  if (e.key === 'ArrowDown' && !collide(cur.shape,cur.row+1,cur.col)) cur.row++;
  if (e.key === 'ArrowUp') {
    let r = rotateShape(cur.shape);
    if (!collide(r,cur.row,cur.col)) cur.shape = r;
  }
  draw();
});

setInterval(() => { update(); draw(); }, 500);
draw();
