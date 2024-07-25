// Array to store quotes
const quotes = [
    { text: "The best way to predict the future is to invent it.", category: "Inspiration" },
    { text: "Life is 10% what happens to us and 90% how we react to it.", category: "Motivation" },
    { text: "The only way to do great work is to love what you do.", category: "Work" }
];

// Function to display a random quote
function showRandomQuote() {
    const quoteDisplay = document.getElementById('quoteDisplay');
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const randomQuote = quotes[randomIndex];

    // Update quote display using innerHTML
    quoteDisplay.innerHTML = `${randomQuote.text} - ${randomQuote.category}`;
}

// Function to add a new quote
function addQuote() {
    const newQuoteText = document.getElementById('newQuoteText').value;
    const newQuoteCategory = document.getElementById('newQuoteCategory').value;

    if (newQuoteText && newQuoteCategory) {
        quotes.push({ text: newQuoteText, category: newQuoteCategory });
        document.getElementById('newQuoteText').value = '';
        document.getElementById('newQuoteCategory').value = '';
        alert('Quote added successfully!');
    } else {
        alert('Please enter both quote text and category.');
    }
}

// Function to create and display the form to add a new quote
function createAddQuoteForm() {
    const formContainer = document.createElement('div');

    formContainer.innerHTML = `
        <input id="newQuoteText" type="text" placeholder="Enter a new quote" />
        <input id="newQuoteCategory" type="text" placeholder="Enter quote category" />
        <button id="addQuoteButton">Add Quote</button>
    `;

    document.body.appendChild(formContainer);

    // Add event listener to the newly created button
    document.getElementById('addQuoteButton').addEventListener('click', addQuote);
}

// Initialize the application
function init() {
    // Create the form for adding quotes
    createAddQuoteForm();

    // Add event listener to show a new random quote
    document.getElementById('newQuote').addEventListener('click', showRandomQuote);
}

// Call the init function to set up the application
init();
