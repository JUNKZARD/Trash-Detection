// URL model yang Anda dapatkan dari Teachable Machine
const URL = "https://teachablemachine.withgoogle.com/models/VXtsAcN8vB/";

let model, webcam, labelContainer, maxPredictions;

// Fungsi untuk inisialisasi
async function init() {
  const modelURL = URL + "model.json";
  const metadataURL = URL + "metadata.json";

  // Memuat model dan metadata
  model = await tmImage.load(modelURL, metadataURL);
  maxPredictions = model.getTotalClasses();

  // Mengatur webcam
  const flip = true; // true untuk membalik kamera (seperti cermin)
  webcam = new tmImage.Webcam(300, 300, flip); // lebar, tinggi, flip
  await webcam.setup(); // Meminta izin akses kamera
  await webcam.play();
  window.requestAnimationFrame(loop);

  // Menambahkan elemen webcam ke halaman
  document.getElementById("webcam-container").appendChild(webcam.canvas);
  labelContainer = document.getElementById("label-container");
  for (let i = 0; i < maxPredictions; i++) {
    // membuat label untuk setiap kelas
    labelContainer.appendChild(document.createElement("div"));
  }
}

// Fungsi loop untuk prediksi berkelanjutan
async function loop() {
  webcam.update(); // update frame webcam
  await predict();
  window.requestAnimationFrame(loop);
}

// Menjalankan prediksi pada frame webcam
async function predict() {
  // Memprediksi frame dari webcam
  const prediction = await model.predict(webcam.canvas);

  // Variabel untuk menyimpan prediksi terbaik
  let bestPrediction = { className: "", probability: 0 };

  // Loop untuk mencari prediksi dengan probabilitas tertinggi
  for (let i = 0; i < maxPredictions; i++) {
    if (prediction[i].probability > bestPrediction.probability) {
      bestPrediction = prediction[i];
    }
  }
  // --- DI SINI ANDA BISA MENGUBAH HASILNYA ---

  // 1. Menampilkan hasil prediksi terbaik ke layar
  const probabilityPercent = (bestPrediction.probability * 100).toFixed(0);
  labelContainer.innerHTML = ` ${bestPrediction.className} (${probabilityPercent}%)`;

  // 2. Menjalankan aksi berdasarkan hasil
  // Ganti "NamaKelasAnda" dengan nama kelas yang Anda latih (misalnya "Kucing" atau "Tangan Terbuka")
  if (
    bestPrediction.className === "Sampah" &&
    bestPrediction.probability > 99.0
  ) {
    // Aksi yang dijalankan jika terdeteksi
    document.body.style.backgroundColor = "lightgreen";
    console.log(bestPrediction.className + " terdeteksi!");
  } else {
    // Kembali ke kondisi normal jika tidak terdeteksi
  }
}
// Menjalankan fungsi utama
init();
