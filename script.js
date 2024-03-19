// PDF-related functions
async function chatWithPDF(pdfurl, ques, newresp) {
    const { sourceId, response } = await sendMessageAndGetResponse(pdfurl, ques);
    newresp.children[0].innerText = response;
    generateSpeech(response);
}

async function sendMessageAndGetResponse(pdfUrl, question) {
    const headers = getHeaders();
    const sourceId = await addPDFViaURL(pdfUrl, headers);
    const response = await sendMessageToPDF(sourceId, question, headers);
    return { sourceId, response };
}

async function addPDFViaURL(pdfUrl, headers) {
    const data = { url: pdfUrl };
    const response = await axios.post('https://api.chatpdf.com/v1/sources/add-url', data, { headers });
    return response.data.sourceId;
}

async function sendMessageToPDF(sourceId, question, headers) {
    const data = {
        sourceId: sourceId,
        messages: [{ role: 'user', content: question }]
    };
    const response = await axios.post('https://api.chatpdf.com/v1/chats/message', data, { headers });
    return response.data.content;
}

function getHeaders() {
    const apiKey = 'sec_Y08DkC9ba48r9qTOhsouf6eJISuKn6tf'; // Replace with your actual API key
    return {
        'x-api-key': apiKey,
        'Content-Type': 'application/json',
    };
}

const API_KEY = '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';

async function generateSpeech(userres) {
    const inputText = userres;
      

    try {
      const response = await fetch("https://api.openai.com/v1/audio/speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "tts-1",
          input: inputText,
          voice: "nova",
          response_format: "mp3",
          speed: 1.0,
        }),
      });

      if (response.ok) {
        const audioData = await response.blob();
        const audioUrl = URL.createObjectURL(audioData);
        
        const audioElement = document.getElementById("generatedAudio");
        audioElement.src = audioUrl;
        audioElement.play();
        
        console.log("Audio generated successfully and playing.");
        
        // Show the play/pause button
        // document.getElementById("playPauseButton").style.display = "inline";
      } else {
        console.error("Error generating audio:", response.statusText);
      }
    } catch (error) {
      console.error("Error generating audio:", error);
    }
  }

  function toggleAudio() {
    const audio = document.getElementById("generatedAudio");
    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  }
// DOM elements and event listeners
const suggestionBox = document.querySelector('#suggestionBox');
const addBtn = document.querySelector('#addPDF');
const usrInp = document.querySelector('#userInput');
const snd = document.querySelector('#send');
const cht = document.querySelector("#chat");
const botresp = '<div class="botResponse"> </div><div class="audio1"><img src="images/svg/artificial-bot-intelligence-svgrepo-com.svg" alt><audio id="generatedAudio" controls style="display:none;"></audio><div class="audioplay" onclick = "toggleAudio()"><img src="images/svg/play-pause-svgrepo-com.svg" class="playpauseimg" alt></div></div>'
const userrep = '<img src="images/svg/user-rounded-svgrepo-com.svg" alt=""><div class="userIn"></div>';
const loading = 'Loading  <div class="loader"></div>'
const suggestion1 = document.querySelectorAll('.suggestion1');
const menu = document.querySelector('#sidebtn')
const home = document.querySelector('#homebtn');
const side = document.querySelector('#sidepanel');
const chatpdfbtn = document.querySelector('#name2');
const exporttopdf = document.querySelector('#title');
const title = document.querySelector('#title');
const opt1 = document.querySelector('#opt1');
const opt2 = document.querySelector('#opt2');
const opt3 = document.querySelector('#opt3');
const addbtn1 = document.querySelector('#add-btn');
const addbtn2 = document.querySelector('#addbtns');
var pdfUr , usrInput;
var x = 0;

addBtn.addEventListener('click', () => {
    usrInp.setAttribute('placeholder', 'Enter URL');
});
addbtn1.addEventListener('click', ()=>{
    addbtn1.classList.add('dispnone')
    addbtn2.classList.remove('dispnone')
})

snd.addEventListener('click', sndfun);

home.addEventListener('click', () => {
    side.classList.add('dispnone')
});

menu.addEventListener('click', () => {
    console.log("click");
    if(side.classList == 'dispnone'){
        side.classList.remove('dispnone');
    }
    else{
        side.classList.add('dispnone');
    }
    
    
});

chatpdfbtn.addEventListener('click', () => {
    location.reload();
});

window.addEventListener('keydown', (e) => {
    if (e.key === "Enter") {
        e.preventDefault();
        sndfun();
    }
});

opt1.addEventListener('click', () => {
    openNewTab("about.html");
});

opt2.addEventListener('click', () => {
    openNewTab("Setting.html");
});

opt3.addEventListener('click', () => {
    openNewTab("license.html");
});

function openNewTab(url) {
    window.open(url, "_blank");
}

const fun1 = () => {
    title.classList.remove('dispnone');
}
// Other functions
function sndfun(){
    if(usrInp.placeholder == 'Enter URL'){
        pdfUr = usrInp.value;
        usrInp.value = "";
        usrInp.setAttribute('placeholder','Message');
        title.classList.remove('dispnone');
        // title.innerText = pdfUr.substring(pdfUr.lastIndexOf('/') + 1).slice(0,-4);
    } else {
        usrInput = usrInp.value; 
        suggestionBox.setAttribute('hidden','hidden');
        appendUserInput(usrInput);
        appendBotResponse(loading);
        if(pdfUr){
            chatWithPDF(pdfUr, usrInput, document.querySelector('.botres:last-child'));
        }
        else{
            sendQuestion(usrInput,  document.querySelector('.botres:last-child'));
        }
        usrInp.value = "";
    }
}

function appendUserInput(inputText) { 

    const newUserInput = document.createElement('div');
    newUserInput.classList.add('userip');
    newUserInput.innerHTML = userrep;
    newUserInput.children[1].innerText = inputText;
    cht.appendChild(newUserInput);
    
}

function appendBotResponse(responseText) {
    const newResponse = document.createElement('div');
    newResponse.classList.add('botres');
    newResponse.innerHTML = botresp;
    newResponse.children[0].innerHTML = responseText;
    cht.appendChild(newResponse);
}

for (const suggest of suggestion1) {
    suggest.addEventListener('click', () => {
        usrInp.value = suggest.innerText;
        suggestionBox.setAttribute('hidden', 'hidden');
    });
}

const audioplay = document.querySelector('.audioplay');



//check point
//undo until

function exportToPDF() {
    var element = document.body; // Choose the element you want to export to PDF

    // Specify custom options for PDF generation
    var options = {
        filename: 'webpage.pdf',
        html2canvas: { scale: 2 }, // Scale factor for better quality (optional)
        jsPDF: { format: 'a4', orientation: 'landscape' } // Set orientation to landscape
    };

    html2pdf()
        .from(element)
        .set(options) // Apply custom options
        .save();
}
 
const setX1 = () =>{
    x = 1;
}
const setX2 = () =>{
    x = 2;
}
async function sendQuestion(question, newresp) {
    const pdfFile = document.getElementById('pdfFile').files[0];

    // Check if PDF file is selected
    if (!pdfFile) {
        alert('Please select a PDF file.');
        return;
    }

    // Check if question is entered
    // if (!question.trim()) {
    //     alert('Please enter your question.');
    //     return;
    // }

    // Call functions to add file and send question
    try {
        const sourceId = await addFile(pdfFile);
        const chatResponse = await sendMessage(sourceId, question);
        // document.getElementById('response').innerText = chatResponse.content;
        newresp.children[0].innerText = chatResponse.content;
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred. Please try again.');
    }
}

// Function to add file
async function addFile(file) {
    const formData = new FormData();
    formData.append('file', file);

    const addFileResponse = await fetch('https://api.chatpdf.com/v1/sources/add-file', {
        method: 'POST',
        headers: {
            'x-api-key': 'sec_Y5fWsFoOcnyvR4IECLLgbcc9FDmslaIH'
        },
        body: formData
    });

    const addFileData = await addFileResponse.json();
    return addFileData.sourceId;
}

// Function to send message
async function sendMessage(sourceId, message) {
    const questionData = {
        sourceId: sourceId,
        messages: [
            {
                role: 'user',
                content: message
            }
        ]
    };

    const chatResponse = await fetch('https://api.chatpdf.com/v1/chats/message', {
        method: 'POST',
        headers: {
            'x-api-key': 'sec_Y5fWsFoOcnyvR4IECLLgbcc9FDmslaIH',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(questionData)
    });

    return chatResponse.json();
}
