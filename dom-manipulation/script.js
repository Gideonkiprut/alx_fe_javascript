// URL for the mock API
const apiURL = 'https://jsonplaceholder.typicode.com/posts';

// Function to fetch quotes from the server
async function fetchQuotesFromServer() {
    try {
        const response = await fetch(apiURL);
        const data = await response.json();
        return data.slice(0, 10); // Limiting to 10 quotes for simplicity
    } catch (error) {
        console.error('Error fetching quotes from server:', error);
        return [];
    }
}

// Function to post a new quote to the server
async function postQuoteToServer(quote) {
    try {
        const response = await fetch(apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(quote)
        });
        return await response.json();
    } catch (error) {
        console.error('Error posting quote to server:', error);
    }
}

// Function to sync quotes between local storage and the server
async function syncQuotes() {
    const localData = JSON.parse(localStorage.getItem('quotes')) || [];
    const serverData = await fetchQuotesFromServer();

    // Simple conflict resolution: server data takes precedence
    const mergedData = mergeData(localData, serverData);

    // Update local storage with merged data
    localStorage.setItem('quotes', JSON.stringify(mergedData));
    alert("Quotes synced with server!");
    showNotification();
}

// Merge local and server data
function mergeData(localData, serverData) {
    const serverDataMap = new Map();
    serverData.forEach(item => serverDataMap.set(item.id, item));

    // Update local data with server data
    localData.forEach((item, index) => {
        if (serverDataMap.has(item.id)) {
            localData[index] = serverDataMap.get(item.id);
        }
    });

    // Add any new items from the server
    serverData.forEach(item => {
        if (!localData.some(localItem => localItem.id === item.id)) {
            localData.push(item);
        }
    });

    return localData;
}

// Initial data setup if not present
if (!localStorage.getItem('quotes')) {
    localStorage.setItem('quotes', JSON.stringify([]));
}

// Function to show notification
function showNotification() {
    const notification = document.getElementById('notification');
    notification.style.display = 'block';
}

// Function to manually resolve conflicts
function resolveConflicts() {
    // Logic to manually resolve conflicts
    console.log('User resolving conflicts manually');
    const localData = JSON.parse(localStorage.getItem('quotes')) || [];
    fetchQuotesFromServer().then(serverData => {
        const resolvedData = promptConflictResolution(localData, serverData);
        localStorage.setItem('quotes', JSON.stringify(resolvedData));

        // Hide the notification
        const notification = document.getElementById('notification');
        notification.style.display = 'none';
    });
}

// Prompt user to resolve conflicts manually
function promptConflictResolution(localData, serverData) {
    // Implementation of manual conflict resolution prompt
    // This is a placeholder and should be replaced with actual logic
    return localData; // or return serverData; based on user's choice
}

// Periodic data fetching
setInterval(async () => {
    await syncQuotes();
}, 60000); // Fetch data every minute

// Initial fetch and sync
(async function initialFetchAndSync() {
    await syncQuotes();
    populateCategories();
    quoteDisplay();
    showRandomQuote();
})();

// Test the sync and conflict resolution functionalities
async function testSyncAndConflictResolution() {
    const serverData = await fetchQuotesFromServer();
    const localData = JSON.parse(localStorage.getItem('quotes')) || [];

    console.log('Before sync:', localData);
    await syncQuotes();
    console.log('After sync:', JSON.parse(localStorage.getItem('quotes')));

    // Simulate conflict and test manual resolution
    showNotification();
}

testSyncAndConflictResolution();

// Example usage: Posting a new quote to the server
const newQuote = {
    title: 'New Quote',
    body: 'This is a new quote added by the user.',
    userId: 1,
    category: 'Motivational'
};

postQuoteToServer(newQuote).then(response => {
    console.log('Posted new quote to server:', response);
});

// Populate categories for filtering
function populateCategories() {
    const quotes = JSON.parse(localStorage.getItem('quotes')) || [];
    const categories = new Set(quotes.map(quote => quote.category));

    const categorySelect = document.getElementById('categoryFilter');
    categorySelect.innerHTML = '<option value="">All Categories</option>';
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = category;
        categorySelect.appendChild(option);
    });
}

// Filter quotes by category
function categoryFilter() {
    const selectedCategory = document.getElementById('categoryFilter').value;
    const quotes = JSON.parse(localStorage.getItem('quotes')) || [];
    const filteredQuotes = selectedCategory ? quotes.filter(quote => quote.category === selectedCategory) : quotes;

    displayQuotes(filteredQuotes);
}

// Function to display quotes
function displayQuotes(quotes) {
    const quotesContainer = document.getElementById('quotesContainer');
    quotesContainer.innerHTML = '';
    quotes.forEach(quote => {
        const quoteElement = document.createElement('div');
        quoteElement.className = 'quote';
        quoteElement.innerHTML = `<h3>${quote.title}</h3><p>${quote.body}</p><p><strong>Category:</strong> ${quote.category}</p>`;
        quotesContainer.appendChild(quoteElement);
    });
}

// Event listener for category filter change
document.getElementById('categoryFilter').addEventListener('change', categoryFilter);

// Display a random quote
function quoteDisplay() {
    const quotes = JSON.parse(localStorage.getItem('quotes')) || [];
    if (quotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        const randomQuoteContainer = document.getElementById('randomQuoteContainer');
        randomQuoteContainer.innerHTML = `<h3>${randomQuote.title}</h3><p>${randomQuote.body}</p><p><strong>Category:</strong> ${randomQuote.category}</p>`;
    }
}

// Filter quotes by search term
function filterQuote() {
    const searchTerm = document.getElementById('searchTerm').value.toLowerCase();
    const quotes = JSON.parse(localStorage.getItem('quotes')) || [];
    const filteredQuotes = quotes.filter(quote => quote.title.toLowerCase().includes(searchTerm) || quote.body.toLowerCase().includes(searchTerm));

    displayQuotes(filteredQuotes);
}

// Event listener for search input
document.getElementById('searchTerm').addEventListener('input', filterQuote);

// Export quotes to JSON file using Blob
function exportQuotes() {
    const quotes = JSON.parse(localStorage.getItem('quotes')) || [];
    const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", url);
    downloadAnchorNode.setAttribute("download", "quotes.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    URL.revokeObjectURL(url);
}

// Event listener for export quotes button
document.getElementById('exportQuotes').addEventListener('click', exportQuotes);

// Import quotes from JSON file
function importQuotes(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            try {
                const importedQuotes = JSON.parse(e.target.result);
                const localData = JSON.parse(localStorage.getItem('quotes')) || [];
                const mergedData = mergeData(localData, importedQuotes);
                localStorage.setItem('quotes', JSON.stringify(mergedData));
                populateCategories();
                displayQuotes(mergedData);
                alert('Quotes imported successfully!');
            } catch (error) {
                alert('Error importing quotes: ' + error.message);
            }
        };
        reader.readAsText(file);
    }
}

// Event listener for import quotes file input
document.getElementById('importQuotes').addEventListener('change', importQuotes);

// Show a random quote
function showRandomQuote() {
    const quotes = JSON.parse(localStorage.getItem('quotes')) || [];
    if (quotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        const randomQuote = quotes[randomIndex];
        const randomQuoteContainer = document.getElementById('randomQuoteContainer');
        randomQuoteContainer.innerHTML = `<h3>${randomQuote.title}</h3><p>${randomQuote.body}</p><p><strong>Category:</strong> ${randomQuote.category}</p>`;
    }
}

// Create add quote form
function createAddQuoteForm() {
    const formContainer = document.createElement('div');
    formContainer.id = 'addQuoteFormContainer';

    formContainer.innerHTML = `
        <h3>Add New Quote</h3>
        <form id="addQuoteForm">
            <label for="quoteTitle">Title:</label>
            <input type="text" id="quoteTitle" name="title" required>
            <label for="quoteBody">Body:</label>
            <textarea id="quoteBody" name="body" required></textarea>
            <label for="quoteCategory">Category:</label>
            <input type="text" id="quoteCategory" name="category" required>
            <button type="submit">Add Quote</button>
        </form>
    `;

    document.body.appendChild(formContainer);

    document.getElementById('addQuoteForm').addEventListener('submit', function(event) {
        event.preventDefault();
        const newQuote = {
            title: document.getElementById('quoteTitle').value,
            body: document.getElementById('quoteBody').value,
            category: document.getElementById('quoteCategory').value
        };

        const quotes = JSON.parse(localStorage.getItem('quotes')) || [];
        quotes.push(newQuote);
        localStorage.setItem('quotes', JSON.stringify(quotes));
        displayQuotes(quotes);
        populateCategories();
        alert('New quote added successfully!');

        // Optionally, post the new quote to the server
        postQuoteToServer(newQuote).then(response => {
            console.log('Posted new quote to server:', response);
        });

        // Clear the form
        document.getElementById('addQuoteForm').reset();
    });
}

// Initialize add quote form
createAddQuoteForm();
