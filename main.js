const URL = "https://teachablemachine.withgoogle.com/models/VXtsAcN8vB/";

let model, webcam, labelContainer, maxPredictions;

async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  const flip = true;
  webcam = new tmImage.Webcam(300, 300, flip);
  await webcam.setup();
  await webcam.play();
  window.requestAnimationFrame(loop);

  document.getElementById("webcam-container").appendChild(webcam.canvas);
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    labelContainer.appendChild(document.createElement("div"));
  }
}

async function loop() {
  webcam.update();
  await predict();
  window.requestAnimationFrame(loop);
}

async function predict() {
  const prediction = await model.predict(webcam.canvas);

  let bestPrediction = { className: "", probability: 0 };

  for (let i = 0; i < maxPredictions; i++) {
    if (prediction[i].probability > bestPrediction.probability) {
      bestPrediction = prediction[i];
    }
  }
  const probabilityPercent = (bestPrediction.probability * 100).toFixed(0);
  labelContainer.innerHTML = ` ${bestPrediction.className} (${probabilityPercent}%)`;
  if (
    bestPrediction.className === "Sampah" &&
    bestPrediction.probability > 99.0
  ) {
    document.body.style.backgroundColor = "lightgreen";
    console.log(bestPrediction.className + " terdeteksi!");
  }
}
init();
