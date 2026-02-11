let img;
let leftPg;

let scaleFactor = 0.5;
let brushSize = 100;

let cnv;

function preload() {
  img = loadImage("anuradha.jpg");
}

function setup() {
  createResponsiveCanvas();

  leftPg = createGraphics(img.width, img.height);

  // initialize left side once
  leftPg.beginDraw();
  leftPg.background(255);
  leftPg.endDraw();
}

function createResponsiveCanvas() {
  let h = windowHeight * 0.88;   // leave space for text
  let w = h * 2;                 // two images side by side

  cnv = createCanvas(w, h);
  cnv.parent("container");
}

function windowResized() {
  createResponsiveCanvas();
}

function draw() {
  background(255);

  // draw left result
  image(leftPg, 0, 0, width/2, height);

  // draw right source
  image(img, width/2, 0, width/2, height);
}

function mousePressed() {
  transfer();
}

function mouseDragged() {
  transfer();
}

function transfer() {

  // only work on RIGHT side
  if (mouseX < width/2) return;

  // map mouse to original image space
  let mx = map(mouseX - width/2, 0, width/2, 0, img.width);
  let my = map(mouseY, 0, height, 0, img.height);

  let srcX = int(mx);
  let srcY = int(my);

  let r = int((brushSize / scaleFactor) / 2);

  // ---- COPY TO LEFT ----
  leftPg.beginDraw();

  leftPg.copy(
    img,
    srcX - r, srcY - r,
    r * 2, r * 2,

    srcX - r, srcY - r,
    r * 2, r * 2
  );

  leftPg.endDraw();

  // ---- ERASE FROM RIGHT ----
  img.loadPixels();

  for (let x = -r; x <= r; x++) {
    for (let y = -r; y <= r; y++) {

      let px = srcX + x;
      let py = srcY + y;

      if (px < 0 || py < 0 || px >= img.width || py >= img.height)
        continue;

      if (x*x + y*y <= r*r) {
        img.pixels[py * img.width + px] = color(255);
      }
    }
  }

  img.updatePixels();
}

function keyPressed() {

  if (key == '+') brushSize += 10;
  if (key == '-') brushSize -= 10;

  brushSize = constrain(brushSize, 20, 300);

  // SAVE WHOLE WINDOW
  if (key == 's' || key == 'S') {
    saveCanvas('transfer_capture', 'png');
  }
}
