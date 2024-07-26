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

// Sync local data with server data
function syncWithLocalData(serverData) {
    const localData = JSON.parse(localStorage.getItem('quotes')) || [];

    // Simple conflict resolution: server data takes precedence
    const mergedData = mergeData(localData, serverData);

    // Update local storage with merged data
    localStorage.setItem('quotes', JSON.stringify(mergedData));
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
    const serverData = await fetchQuotesFromServer();
    syncWithLocalData(serverData);
}, 60000); // Fetch data every minute

// Initial fetch and sync
(async function initialFetchAndSync() {
    const serverData = await fetchQuotesFromServer();
    syncWithLocalData(serverData);
})();

// Test the sync and conflict resolution functionalities
async function testSyncAndConflictResolution() {
    const serverData = await fetchQuotesFromServer();
    const localData = JSON.parse(localStorage.getItem('quotes')) || [];

    console.log('Before sync:', localData);
    syncWithLocalData(serverData);
    console.log('After sync:', JSON.parse(localStorage.getItem('quotes')));

    // Simulate conflict and test manual resolution
    showNotification();
}

testSyncAndConflictResolution();

// Example usage: Posting a new quote to the server
const newQuote = {
    title: 'New Quote',
    body: 'This is a new quote added by the user.',
    userId: 1
};

postQuoteToServer(newQuote).then(response => {
    console.log('Posted new quote to server:', response);
});


