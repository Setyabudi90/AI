import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
// import Base64 from 'base64-js';
import MarkdownIt from 'markdown-it';
import './style.css';

// 🔥🔥 FILL THIS OUT FIRST! 🔥🔥
// Get your Gemini API key by:
// - Selecting "Add Gemini API" in the "Project IDX" panel in the sidebar
// - Or by visiting https://g.co/ai/idxGetGeminiKey
// let API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// let form = document.querySelector('form');
// let promptInput = document.querySelector('input[name="prompt"]');
// let output = document.querySelector('.output');

// const genAI = new GoogleGenerativeAI(API_KEY);
// const model = genAI.getGenerativeModel({
//   model: "gemini-1.5-pro", // or gemini-1.5-pro
//   safetySettings: [
//     {
//       category: HarmCategory.HARM_CATEGORY_HARASSMENT,
//       threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
//     },
//   ],
// });

// const chat = model.startChat({
//   history: [],
//   generarionConfig: {
//     maxOutputTokens: 150
//   }
// })

// form.onsubmit = async (ev) => {
//   ev.preventDefault();
//   output.textContent = 'Generating...';

  // try {
    // Load the image as a base64 string
    // let imageUrl = form.elements.namedItem('chosen-image').value;
    // let imageBase64 = await fetch(imageUrl)
    //   .then(r => r.arrayBuffer())
    //   .then(a => Base64.fromByteArray(new Uint8Array(a)));

    // Assemble the prompt by combining the text with the chosen image
    // let contents = [
    //   {
    //     role: 'user',
    //     parts: [
    //       // { inline_data: { mime_type: 'image/jpeg', data: imageBase64, } },
    //       { text: promptInput.value }
    //     ]
    //   }
    // ];

    // Call the multimodal model, and get a stream of results
    // const genAI = new GoogleGenerativeAI(API_KEY);
    // const model = genAI.getGenerativeModel({
    //   model: "gemini-1.5-pro", // or gemini-1.5-pro
    //   safetySettings: [
    //     {
    //       category: HarmCategory.HARM_CATEGORY_HARASSMENT,
    //       threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    //     },
    //   ],
    // });
//     const prompt = promptInput.value;
//     const result = await chat.sendMessageStream(prompt);

//     // Read from the stream and interpret the output as markdown
//     let buffer = [];
//     let md = new MarkdownIt();
//     for await (let response of result.stream) {
//       buffer.push(response.text());
//       output.innerHTML = md.render(buffer.join(''));
//     }
//   } catch (e) {
//     output.innerHTML += '<hr>' + e;
//   }
// };

// import { GoogleGenerativeAI, HarmBlockThreshold, HarmCategory } from "@google/generative-ai";
// import MarkdownIt from 'markdown-it';
// import './style.css';

// 🔥 FILL OUT API KEY 🔥
let API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

// let form = document.querySelector('form');
// let promptInput = document.querySelector('input[name="prompt"]');
// let output = document.querySelector('.output');

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({
  model: "gemini-1.5-pro", 
  safetySettings: [
    {
      category: HarmCategory.HARM_CATEGORY_HARASSMENT,
      threshold: HarmBlockThreshold.BLOCK_ONLY_HIGH,
    },
  ],
});

let chat = model.startChat({
  history: [],
  generationConfig: {
    maxOutputTokens: 150
  }
});

const chatLog = document.getElementById('chat-log');
const userInput = document.getElementById('user-input');
const sendButton = document.getElementById('send-button');
const buttonIcon = document.getElementById('button-icon');

// Add event listeners for send button and Enter key
sendButton.addEventListener('click', sendMessage);
userInput.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    sendMessage();
  }
});

async function sendMessage(){
  const message = userInput.value.trim();

  if (message === '') {
    return;
  }

  chatLog.innerHTML = "Meresponse..."

  try {    
        const result = await chat.sendMessageStream(message);
        let buffer = [];
        let md = new MarkdownIt();
    
        for await (let response of result.stream) {
          buffer.push(response.text());
          
          // Render Markdown to HTML
         chatLog.innerHTML = md.render(buffer.join(''));
    
          // Append the bot's response (rendered markdown) to the chat log
          // true means it contains HTML
        }
         
        userInput.value = ""
        // Reset the send button icon after receiving the response
        buttonIcon.classList.add('fa-solid', 'fa-paper-plane');
        buttonIcon.classList.remove('fas', 'fa-spinner', 'fa-pulse');
      } catch (e) {
        output.innerHTML += '<hr>Error: ' + e;
      }
}

// async function sendMessage() {
//   const message = userInput.value.trim();

//   if (message === '') {
//     return;
//   }

//   // Append user message to chat log
//   appendMessage('user', message);
//   userInput.value = '';

//   try {
//     // Call the AI model to generate a response
//     const result = await chat.sendMessageStream(message);
//     let buffer = [];
//     let md = new MarkdownIt();

//     // Process the stream and update the output
//     for await (let response of result.stream) {
//       buffer.push(response.text());
      
//       // Render Markdown to HTML
//       let renderedMarkdown = md.render(buffer.join(''));

//       // Append the bot's response (rendered markdown) to the chat log
//       appendMessage('bot', renderedMarkdown); // true means it contains HTML
//     }

//     // Reset the send button icon after receiving the response
//     buttonIcon.classList.add('fa-solid', 'fa-paper-plane');
//     buttonIcon.classList.remove('fas', 'fa-spinner', 'fa-pulse');
//   } catch (e) {
//     output.innerHTML += '<hr>Error: ' + e;
//   }
// }

// function appendMessage(sender, message) {
  
//   // Show loading icon on the send button
//   buttonIcon.classList.remove('fa-solid', 'fa-paper-plane');
//   buttonIcon.classList.add('fas', 'fa-spinner', 'fa-pulse');

//   const messageElement = document.createElement('div');
//   const iconElement = document.createElement('div');
//   const chatElement = document.createElement('div');
//   const icon = document.createElement('i');

//   chatElement.classList.add("chat-box");
//   iconElement.classList.add("icon");
//   messageElement.classList.add(sender);

//   // If the content is HTML (e.g., rendered Markdown), use innerHTML
//   messageElement.innerHTML = message

//   // Add icons for user and bot
//   if (sender === 'user') {
//     icon.classList.add('fa-regular', 'fa-user');
//     iconElement.setAttribute('id', 'user-icon');
//   } else {
//     icon.classList.add('fa-solid', 'fa-robot');
//     iconElement.setAttribute('id', 'bot-icon');
//   }

//   iconElement.appendChild(icon);
//   chatElement.appendChild(iconElement);
//   chatElement.appendChild(messageElement);
//   chatLog.appendChild(chatElement);
//   chatLog.scrollTop = chatLog.scrollHeight;
// }
