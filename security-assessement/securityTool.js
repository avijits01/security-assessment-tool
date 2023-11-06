// Import the required modules
import { process } from './env.js';
import OpenAI from 'openai';
import promptSync from 'prompt-sync';
import fs from 'fs';  // Import the fs module for file operations

// Initialize prompt-sync for synchronous input
const prompt = promptSync();

// Configure OpenAI with the API key from custom environment variables
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Initialize messages array and interaction counter
let messages = [];
let interactionCount = 0;

// Helper function to extract summary from the response
function extractSummary(response) {
  const summaryPattern = /\$\$(.*?)\$\$/s;  // Regex pattern to match $$...$$
  const match = response.match(summaryPattern);
  return match ? match[1].trim() : '';
}

// Function to read initial prompt from file
function readInitialPrompt() {
  try {
    const data = fs.readFileSync('initial_prompt.txt', 'utf8');
    return data;
  } catch (err) {
    console.error('Error reading from initial_prompt.txt:', err);
    return ''; // Return an empty string if there is an error
  }
}

// Function to handle conversation with OpenAI
async function handleConversation() {
  try {
    // Start the conversation or continue
    if (interactionCount === 0) {
      console.log('Starting Conversation...');
      const initialPrompt = readInitialPrompt();
      if (initialPrompt) {
        messages.push({ role: 'system', content: initialPrompt });
      } else {
        messages.push({ role: 'system', content: 'User is about to ask a question.' });
      }
    } else {
      // Ask user for input using prompt-sync
      const userMessage = prompt('You: ');

      // Check if the user wants to exit
      if (userMessage.toLowerCase() === 'exit') {
        console.log('Exiting conversation.');
        return;
      }

      // Store user message
      messages.push({ role: 'user', content: userMessage });
    }

    // Increment interaction count
    interactionCount++;


    // Get response from OpenAI
    const response = await openai.chat.completions.create({
      model: "gpt-4",
      messages: messages,
    });

    // Process the response and output it
    const rawResponse = response.choices[0].message.content;
    console.log(`AI: ${rawResponse}`);

   
    
    // Extract the summary if it exists
    const summary = extractSummary(rawResponse);
    const contentToStore = summary ? `$$${summary}$$` : rawResponse;

    // Store the response with the assistant role
    messages.push({ role: 'assistant', content: contentToStore });

    // Repeat the process
    handleConversation();
  } catch (error) {
    console.error('Error during conversation:', error);
  }
}

// Start the conversation
handleConversation();
