const API_KEY = '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';  // Substitua com a sua chave da API

// Função para reconhecimento de fala
const recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
if (recognition) {
    const recognizer = new recognition();
    recognizer.continuous = false;
    recognizer.lang = 'en-US';

    recognizer.onstart = function() {
        console.log("Voice recognition started. Speak now.");
    };

    recognizer.onerror = function(event) {
        console.error("Error occurred in recognition: ", event.error);
    };

    recognizer.onresult = function(event) {
        const transcript = event.results[0][0].transcript;
        document.getElementById("user-input").value = transcript;
        sendMessage();
    };

    function startRecognition() {
        recognizer.start();
    }
} else {
    console.log("Speech recognition not supported in this browser.");
}

// Função para enviar a mensagem
function sendMessage() {
    const userInput = document.getElementById('user-input').value;
    if (userInput.trim() === '') return;

    const chatbox = document.getElementById('chatbox');
    chatbox.innerHTML += `<div class="user-message">${userInput}</div>`;
    document.getElementById('user-input').value = '';  // Limpa o campo de entrada

    // Envia a mensagem para o OpenAI
    fetch('https://api.openai.com/v1/completions', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${API_KEY}`
        },
        body: JSON.stringify({
            model: 'text-davinci-003',
            prompt: userInput,
            max_tokens: 150
        })
    })
    .then(response => response.json())
    .then(data => {
        const aiResponse = data.choices[0].text.trim();
        chatbox.innerHTML += `<div class="ai-message">${aiResponse}</div>`;
        
        // Responde com áudio
        speak(aiResponse); // Converte o texto da resposta em áudio
    })
    .catch(error => {
        console.error("Error:", error);
    });
}

// Função para falar a resposta com áudio
function speak(text) {
    const msg = new SpeechSynthesisUtterance(text);
    msg.lang = 'en-US'; // Define o idioma
    window.speechSynthesis.speak(msg);  // Fala a resposta
    
    msg.onend = function() {
        console.log("Speech has finished.");
    };
}