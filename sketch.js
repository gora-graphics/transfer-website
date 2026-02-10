let img;
let leftPg;
let maskPg;

let scaleFactor = 0.5;
let brushSize = 100;

function preload() {
  img = loadImage("anuradha.jpg");
}

function setup() {

  let displayW = int(img.width * scaleFactor);
  let displayH = int(img.height * scaleFactor);

  createCanvas(displayW * 2, displayH);

  leftPg = createGraphics(img.width, img.height);
  maskPg = createGraphics(img.width, img.height);

  leftPg.background(255);
}

function draw() {
  background(255);

  image(leftPg, 0, 0, width/2, height);
  image(img, width/2, 0, width/2, height);
}

function mousePressed() {
  transfer();
}

function mouseDragged() {
  transfer();
}

function transfer() {

  if (mouseX < width/2) return;

  let mx = map(mouseX - width/2, 0, width/2, 0, img.width);
  let my = map(mouseY, 0, height, 0, img.height);

  let srcX = int(mx);
  let srcY = int(my);

  let r = int((brushSize / scaleFactor) / 2);

  // ----- 1. EXTRACT REGION AS IMAGE -----
  let region = img.get(
    srcX - r,
    srcY - r,
    r * 2,
    r * 2
  );

  // ----- 2. CREATE CIRCULAR MASK IMAGE -----
  let m = createImage(r * 2, r * 2);
  m.loadPixels();

  for (let x = 0; x < r*2; x++) {
    for (let y = 0; y < r*2; y++) {

      let dx = x - r;
      let dy = y - r;

      let inside = dx*dx + dy*dy <= r*r;

      let alpha = inside ? 255 : 0;

      let index = 4 * (y * m.width + x);
      m.pixels[index + 0] = 255;
      m.pixels[index + 1] = 255;
      m.pixels[index + 2] = 255;
      m.pixels[index + 3] = alpha;
    }
  }

  m.updatePixels();

  // ----- 3. MASK THE IMAGE (VALID IN P5) -----
  region.mask(m);

  // ----- 4. DRAW TO LEFT -----
  leftPg.image(region, srcX - r, srcY - r);

  // ----- 5. ERASE FROM RIGHT -----
  img.loadPixels();

  for (let x = -r; x <= r; x++) {
    for (let y = -r; y <= r; y++) {

      let px = srcX + x;
      let py = srcY + y;

      if (px < 0 || py < 0 || px >= img.width || py >= img.height)
        continue;

      if (x*x + y*y <= r*r) {
        img.set(px, py, color(255));
      }
    }
  }

  img.updatePixels();
}


function keyPressed() {

  if (key == '+') brushSize += 10;
  if (key == '-') brushSize -= 10;

  brushSize = constrain(brushSize, 20, 300);

  // SAVE WHOLE CANVAS
  if (key == 's') {
    saveCanvas("transfer_result", "png");
  }
}
