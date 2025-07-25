/**
 * Status Recovery Module JavaScript
 * Handles status query, recovery, filtering, and search functionality
 */

// Mock data for unacknowledged transactions
let unacknowledgedTransactions = [];

// Initialize status recovery module
document.addEventListener('DOMContentLoaded', function() {
    initializeStatusRecovery();
});

/**
 * Initialize status recovery functionality
 */
function initializeStatusRecovery() {
    // Generate mock data
    unacknowledgedTransactions = generateMockTransactions();

    // Render initial table
    renderTransactionsTable(unacknowledgedTransactions);

    // Setup event listeners for search and filter
    document.getElementById('transactionSearch').addEventListener('input', applyFiltersAndSearch);
    document.getElementById('errorTypeFilter').addEventListener('change', applyFiltersAndSearch);
}

/**
 * Render transactions table
 * @param {Array} transactions - Data to render
 */
function renderTransactionsTable(transactions) {
    const tableBody = document.querySelector('.data-table tbody');
    if (!tableBody) return;

    tableBody.innerHTML = ''; // Clear existing rows

    if (transactions.length === 0) {
        const noDataRow = document.createElement('tr');
        noDataRow.innerHTML = `<td colspan="8" style="text-align: center;">No unacknowledged transactions found.</td>`;
        tableBody.appendChild(noDataRow);
        return;
    }

    transactions.forEach(transaction => {
        const row = document.createElement('tr');
        row.setAttribute('data-transaction-id', transaction.transactionId); // Add data attribute for easy access

        createAndAppendTd(row, transaction.transactionId);
        createAndAppendTd(row, transaction.timestamp);
        createAndAppendTd(row, transaction.affectedUser);
        createAndAppendTd(row, transaction.amount);
        createAndAppendTd(row, transaction.currentStatus);
        createAndAppendTd(row, transaction.errorType);
        createAndAppendTd(row, transaction.lastRetry);

        const actionsTd = document.createElement('td');
        actionsTd.className = 'actions';
        const reQueryButton = document.createElement('button');
        reQueryButton.className = 'btn btn-small btn-secondary';
        reQueryButton.textContent = 'Re-Query Status';
        reQueryButton.addEventListener('click', () => reQueryStatus(transaction.transactionId, row));
        actionsTd.appendChild(reQueryButton);
        row.appendChild(actionsTd);

        tableBody.appendChild(row);
    });
}

/**
 * Apply filters and search to transactions
 */
function applyFiltersAndSearch() {
    const searchTerm = document.getElementById('transactionSearch').value.toLowerCase();
    const errorType = document.getElementById('errorTypeFilter').value;

    let filteredTransactions = unacknowledgedTransactions.filter(transaction => {
        const matchesSearch = transaction.transactionId.toLowerCase().includes(searchTerm) ||
                              transaction.affectedUser.toLowerCase().includes(searchTerm);
        const matchesErrorType = errorType === 'all' || transaction.errorType === errorType;
        return matchesSearch && matchesErrorType;
    });

    renderTransactionsTable(filteredTransactions);
}

/**
 * Simulate re-querying status for a transaction
 * @param {string} transactionId - The ID of the transaction to re-query
 * @param {HTMLElement} row - The table row element for the transaction
 */
function reQueryStatus(transactionId, row) {
    const originalButton = row.querySelector('.btn-secondary');
    const originalButtonText = originalButton.textContent;
    const originalButtonClass = originalButton.className;

    // Show loading state
    originalButton.textContent = 'Processing...';
    originalButton.className = 'btn btn-small btn-secondary loading'; // Add a loading class for styling
    originalButton.disabled = true;

    // Simulate API call
    setTimeout(() => {
        // Update status and last retry time
        const transactionIndex = unacknowledgedTransactions.findIndex(t => t.transactionId === transactionId);
        if (transactionIndex > -1) {
            unacknowledgedTransactions[transactionIndex].currentStatus = 'Re-queried';
            unacknowledgedTransactions[transactionIndex].lastRetry = new Date().toLocaleString();
            unacknowledgedTransactions[transactionIndex].errorType = 'None'; // Clear error type after re-query
        }

        // Re-render the table to reflect updated status
        applyFiltersAndSearch(); // Re-apply filters to ensure the updated row is rendered correctly

        // Restore button state (optional, as table re-renders)
        // originalButton.textContent = originalButtonText;
        // originalButton.className = originalButtonClass;
        // originalButton.disabled = false;

        alert(`Transaction ${transactionId} re-queried successfully!`);
    }, 2000); // Simulate 2-second API call
}

/**
 * Helper function to create a td element and append content to a tr.
 * @param {HTMLElement} tr - The table row element.
 * @param {string} content - The text content for the td.
 */
function createAndAppendTd(tr, content) {
    const td = document.createElement('td');
    td.textContent = content;
    tr.appendChild(td);
}

/**
 * Generate mock transaction data for status recovery
 * @returns {Array} Mock transaction data
 */
function generateMockTransactions() {
    return [
        {
            transactionId: 'TXN789012',
            timestamp: '2025-07-25 08:45',
            affectedUser: 'YP123456',
            amount: 'QAR 50.00',
            currentStatus: 'Pending Acknowledgement',
            errorType: 'Timeout',
            lastRetry: '2025-07-25 08:46'
        },
        {
            transactionId: 'TXN789013',
            timestamp: '2025-07-25 09:10',
            affectedUser: 'YP123457',
            amount: 'QAR 120.00',
            currentStatus: 'Failed',
            errorType: 'Network Failure',
            lastRetry: '2025-07-25 09:15'
        },
        {
            transactionId: 'TXN789014',
            timestamp: '2025-07-25 10:00',
            affectedUser: 'YP123458',
            amount: 'QAR 200.00',
            currentStatus: 'Pending Acknowledgement',
            errorType: 'User Interruption',
            lastRetry: '2025-07-25 10:05'
        },
        {
            transactionId: 'TXN789015',
            timestamp: '2025-07-25 11:30',
            affectedUser: 'YP123459',
            amount: 'QAR 75.00',
            currentStatus: 'Failed',
            errorType: 'Timeout',
            lastRetry: '2025-07-25 11:35'
        }
    ];
}
