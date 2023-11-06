// Import required libraries
const fs = require('fs');
const readline = require('readline');
const { Configuration, OpenAIApi } = require('openai');

// Set your API key
const configuration = new Configuration({
  apiKey: '',
});
const openai = new OpenAIApi(configuration);

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Initialize messages array
let messages = [];

// Function to ask question to user
function askQuestion(query) {
  rl.question(query, (answer) => {
    handleConversation(answer);
  });
}

// Function to handle conversation
async function handleConversation(userMessage) {
  // Add user message to messages array
  messages.push({role: 'user', content: userMessage});

  // Create prompt for OpenAI
  const prompt = messages.map(message => `${message.role}: ${message.content}`).join('\n');

  // Get response from OpenAI
  try {
    const response = await converseWithOpenAI(prompt);

    // Add AI response to messages array
    messages.push({role: 'assistant', content: response});

    // Check if report is generated
    if (response.includes('::report_generated::')) {
      const report = response.replace('::report_generated::', '').trim();
      console.log('Report generated: ', report);
      rl.close();
    } else {
      console.log('AI: ', response);
      askQuestion('Your response: ');
    }
  } catch (error) {
    console.error('Error during conversation:', error);
    rl.close();
  }
}

async function converseWithOpenAI(prompt) {
  try {
    const response = await openai.createCompletion({
      model: 'gpt-3.5-turbo',
      prompt: prompt,
      max_tokens: 1354,
      temperature: 0.5,
      stop: ['::report_not_generated::', '::report_generated::'],
    });

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error during OpenAI API call:', error);
    throw error; // Re-throw the error to be caught by the calling function
  }
}

// Start the conversation
fs.readFile('initial_promp.txt', 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading initial prompt:', err);
    process.exit(1);
  } else {
    handleConversation(data.trim());
  }
});
