let mediaRecorder;
let audioChunks = [];

document.getElementById('recordButton').addEventListener('click', async () => {
  if (!mediaRecorder || mediaRecorder.state === 'inactive') {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = event => audioChunks.push(event.data);

    mediaRecorder.onstop = async () => {
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
      audioChunks = [];

      const formData = new FormData();
      formData.append('audio', audioBlob);

      const response = await fetch('/recognize', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();
      document.getElementById('result').textContent = result.result
        ? `Música reconhecida: ${result.result.title} - ${result.result.artist}`
        : 'Música não reconhecida';
    };

    mediaRecorder.start();
    document.getElementById('recordButton').textContent = 'Gravando...';
    setTimeout(() => {
      mediaRecorder.stop();
      document.getElementById('recordButton').textContent = 'Gravar Música';
    }, 5000);
  }
});
