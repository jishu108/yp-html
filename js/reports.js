/**
 * Reports Module JavaScript
 * Handles report generation, filtering, and export functionality
 */

// Report data storage
let reportData = {
    customer: [],
    transaction: [],
    dormant: [],
    commission: []
};

// Initialize reports module
document.addEventListener('DOMContentLoaded', function() {
    initializeReports();
});

/**
 * Initialize reports functionality
 */
function initializeReports() {
    setupTabNavigation();
    setupFilters();
    loadInitialData();
}

/**
 * Setup tab navigation
 */
function setupTabNavigation() {
    const tabButtons = document.querySelectorAll('.reports-tabs .tab-btn');
    
    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const tabName = this.getAttribute('data-tab');
            
            // Remove active class from all buttons and content
            document.querySelectorAll('.reports-tabs .tab-btn').forEach(btn => {
                btn.classList.remove('active');
            });
            
            document.querySelectorAll('.reports-tabs .tab-content').forEach(content => {
                content.classList.remove('active');
            });
            
            // Add active class to clicked button and corresponding content
            this.classList.add('active');
            const targetContent = document.getElementById(tabName);
            if (targetContent) {
                targetContent.classList.add('active');
            }
            applyFilters(); // Apply filters when tab changes
        });
    });
}

/**
 * Setup filter functionality
 */
function setupFilters() {
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    const segmentFilter = document.getElementById('segmentFilter');
    const channelFilter = document.getElementById('channelFilter');
    const applyFiltersBtn = document.getElementById('applyFiltersBtn');
    const datePresets = document.querySelectorAll('.date-presets .btn');
    const exportDropdown = document.getElementById('exportDropdown');
    const exportCsvBtn = document.querySelector('[data-export-type="csv"]');
    const exportPdfBtn = document.querySelector('[data-export-type="pdf"]');

    applyFiltersBtn.addEventListener('click', applyFilters);
    startDateInput.addEventListener('change', applyFilters);
    endDateInput.addEventListener('change', applyFilters);
    segmentFilter.addEventListener('change', applyFilters);
    channelFilter.addEventListener('change', applyFilters);

    datePresets.forEach(presetBtn => {
        presetBtn.addEventListener('click', function() {
            const preset = this.getAttribute('data-preset');
            setDateRangePreset(preset);
            applyFilters();
        });
    });

    // Export dropdown toggle
    if (exportDropdown) {
        exportDropdown.addEventListener('click', function() {
            const dropdownMenu = this.nextElementSibling;
            dropdownMenu.classList.toggle('show');
        });
    }

    // Close dropdown when clicking outside
    window.addEventListener('click', function(event) {
        if (!event.target.matches('.dropdown-toggle')) {
            const dropdowns = document.querySelectorAll('.dropdown-menu');
            dropdowns.forEach(dropdown => {
                if (dropdown.classList.contains('show')) {
                    dropdown.classList.remove('show');
                }
            });
        }
    });

    if (exportCsvBtn) {
        exportCsvBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const activeTab = document.querySelector('.reports-tabs .tab-content.active');
            if (activeTab) {
                const reportType = activeTab.id.replace('-reports', '').replace('-accounts', '');
                exportReportData(reportType, 'csv');
            }
        });
    }

    if (exportPdfBtn) {
        exportPdfBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const activeTab = document.querySelector('.reports-tabs .tab-content.active');
            if (activeTab) {
                const reportType = activeTab.id.replace('-reports', '').replace('-accounts', '');
                exportReportData(reportType, 'pdf');
            }
        });
    }
}

/**
 * Set date range based on preset
 * @param {string} preset - 'today', 'last7days', 'month-to-date', 'year-to-date'
 */
function setDateRangePreset(preset) {
    const today = new Date();
    let startDate = new Date();
    let endDate = new Date();

    switch (preset) {
        case 'today':
            break;
        case 'last7days':
            startDate.setDate(today.getDate() - 6);
            break;
        case 'month-to-date':
            startDate.setDate(1);
            break;
        case 'year-to-date':
            startDate.setMonth(0);
            startDate.setDate(1);
            break;
    }

    document.getElementById('startDate').value = formatDate(startDate);
    document.getElementById('endDate').value = formatDate(endDate);
}

/**
 * Format date to YYYY-MM-DD
 * @param {Date} date - Date object
 * @returns {string} Formatted date string
 */
function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

/**
 * Apply filters to current report
 */
function applyFilters() {
    const activeTab = document.querySelector('.reports-tabs .tab-content.active');
    if (!activeTab) return;
    
    const tabName = activeTab.id.replace('-reports', '').replace('-accounts', '');
    const filters = getFilterValues(); // Get filters from common bar
    
    filterReportData(tabName, filters);
    updateSummaryCards(tabName, filters);
}

/**
 * Get current filter values from common filter bar
 * @returns {Object} Filter values
 */
function getFilterValues() {
    const filters = {};
    filters.startDate = document.getElementById('startDate').value;
    filters.endDate = document.getElementById('endDate').value;
    filters.segment = document.getElementById('segmentFilter').value;
    filters.channel = document.getElementById('channelFilter').value;
    return filters;
}

/**
 * Filter report data based on criteria
 * @param {string} reportType - Type of report
 * @param {Object} filters - Filter criteria
 */
function filterReportData(reportType, filters) {
    const data = reportData[reportType];
    if (!data) return;
    
    let filteredData = [...data];
    
    // Apply date filters
    if (filters.startDate && filters.endDate) {
        const start = new Date(filters.startDate);
        const end = new Date(filters.endDate);
        filteredData = filteredData.filter(item => {
            const itemDate = new Date(item.date || item.activationDate || item.lastActivity || item.period); // Adjust based on data structure
            return itemDate >= start && itemDate <= end;
        });
    }
    
    // Apply segment filter (only for customer and transaction reports)
    if ((reportType === 'customer' || reportType === 'transaction') && filters.segment && filters.segment !== 'all') {
        filteredData = filteredData.filter(item => 
            item.segment === filters.segment
        );
    }
    
    // Apply channel filter (only for customer and transaction reports)
    if ((reportType === 'customer' || reportType === 'transaction') && filters.channel && filters.channel !== 'all') {
        filteredData = filteredData.filter(item => 
            item.channel === filters.channel
        );
    }
    
    renderReportTable(reportType, filteredData);
}

/**
 * Render report table
 * @param {string} reportType - Type of report
 * @param {Array} data - Data to render
 */
function renderReportTable(reportType, data) {
    const tableBody = document.querySelector(`#${reportType}-reports tbody, #${reportType}-accounts tbody`);
    if (!tableBody) return;
    
    tableBody.innerHTML = '';
    
    data.forEach(item => {
        const row = createTableRow(reportType, item);
        tableBody.appendChild(row);
    });
}

/**
 * Create table row for report
 * @param {string} reportType - Type of report
 * @param {Object} item - Data item
 * @returns {HTMLElement} Table row
 */
function createTableRow(reportType, item) {
    const tr = document.createElement('tr');
    
    switch (reportType) {
        case 'customer':
            createAndAppendTd(tr, item.name);
            createAndAppendTd(tr, item.qidCr);
            createAndAppendTd(tr, item.segment);
            createAndAppendTd(tr, item.activationDate);
            createAndAppendTd(tr, item.channel);
            break;

        case 'transaction':
            createAndAppendTd(tr, item.transactionId);
            createAndAppendTd(tr, item.timestamp);
            createAndAppendTd(tr, item.amount);
            createAndAppendTd(tr, item.customer);
            createAndAppendTd(tr, item.recipient);
            createAndAppendTd(tr, item.status);
            break;

        case 'dormant':
            createAndAppendTd(tr, item.customerName);
            createAndAppendTd(tr, item.ypId);
            createAndAppendTd(tr, item.lastLogin);
            createAndAppendTd(tr, item.lastTransactionDate);
            break;

        case 'commission':
            createAndAppendTd(tr, item.date);
            createAndAppendTd(tr, item.transactionId);
            createAndAppendTd(tr, item.originalAmount);
            createAndAppendTd(tr, item.fee);
            createAndAppendTd(tr, item.netRevenue);
            break;
    }
    
    return tr;
}

/**
 * Update summary cards based on filtered data
 * @param {string} reportType - Type of report
 * @param {Object} filters - Filter criteria
 */
function updateSummaryCards(reportType, filters) {
    const data = reportData[reportType];
    if (!data) return;

    let filteredData = [...data];
    // Re-apply filters to get data for summary cards
    if (filters.startDate && filters.endDate) {
        const start = new Date(filters.startDate);
        const end = new Date(filters.endDate);
        filteredData = filteredData.filter(item => {
            const itemDate = new Date(item.date || item.activationDate || item.lastActivity || item.period);
            return itemDate >= start && itemDate <= end;
        });
    }
    if ((reportType === 'customer' || reportType === 'transaction') && filters.segment && filters.segment !== 'all') {
        filteredData = filteredData.filter(item => item.segment === filters.segment);
    }
    if ((reportType === 'customer' || reportType === 'transaction') && filters.channel && filters.channel !== 'all') {
        filteredData = filteredData.filter(item => item.channel === filters.channel);
    }

    switch (reportType) {
        case 'customer':
            document.getElementById('activatedCustomersCount').textContent = filteredData.length;
            document.getElementById('onboardedForPaymentCount').textContent = new Set(filteredData.map(c => c.name)).size; // Unique customers
            break;
        case 'transaction':
            const totalVolume = filteredData.reduce((sum, item) => sum + parseFloat(item.amount.replace('QAR ', '')), 0);
            const transactionCount = filteredData.length;
            const averageValue = transactionCount > 0 ? totalVolume / transactionCount : 0;
            document.getElementById('transactionVolume').textContent = `QAR ${totalVolume.toFixed(2)}`;
            document.getElementById('transactionCount').textContent = transactionCount;
            document.getElementById('averageTransactionValue').textContent = `QAR ${averageValue.toFixed(2)}`;
            break;
        case 'commission':
            const totalRevenue = filteredData.reduce((sum, item) => sum + parseFloat(item.netRevenue.replace('QAR ', '')), 0);
            document.getElementById('totalRevenue').textContent = `QAR ${totalRevenue.toFixed(2)}`;
            break;
    }
}

/**
 * Load initial data
 */
function loadInitialData() {
    // Simulate loading data
    reportData = {
        customer: generateMockCustomerData(),
        transaction: generateMockTransactionData(),
        dormant: generateMockDormantData(),
        commission: generateMockCommissionData()
    };
    
    // Render initial data for the active tab
    const activeTab = document.querySelector('.reports-tabs .tab-content.active');
    if (activeTab) {
        const tabName = activeTab.id.replace('-reports', '').replace('-accounts', '');
        renderReportTable(tabName, reportData[tabName]);
        updateSummaryCards(tabName, getFilterValues());
    }
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
 * Helper function to create a td with a button and append it to a tr.
 * @param {HTMLElement} tr - The table row element.
 * @param {string} buttonText - The text for the button.
 * @param {string} buttonClass - The class for the button (e.g., 'btn-primary').
 * @param {Function} onClickHandler - The click event handler for the button.
 */
function createButtonTd(tr, buttonText, buttonClass, onClickHandler) {
    const td = document.createElement('td');
    const button = document.createElement('button');
    button.className = `btn btn-sm ${buttonClass}`;
    button.textContent = buttonText;
    button.addEventListener('click', onClickHandler);
    td.appendChild(button);
    tr.appendChild(td);
}

/**
 * Generate mock customer data
 * @returns {Array} Customer data
 */
function generateMockCustomerData() {
    return [
        { name: 'John Doe', qidCr: '123456789', segment: 'Individual', activationDate: '2025-07-01', channel: 'Mobile App', date: '2025-07-01' },
        { name: 'Jane Smith', qidCr: '987654321', segment: 'Business', activationDate: '2025-07-05', channel: 'Web Portal', date: '2025-07-05' },
        { name: 'Peter Jones', qidCr: '112233445', segment: 'Individual', activationDate: '2025-06-10', channel: 'Mobile App', date: '2025-06-10' }
    ];
}

/**
 * Generate mock transaction data
 * @returns {Array} Transaction data
 */
function generateMockTransactionData() {
    return [
        { transactionId: 'TXN001', timestamp: '2025-07-25 10:00', amount: 'QAR 100.50', customer: 'John Doe', recipient: 'Jane Smith', status: 'Completed', segment: 'Individual', channel: 'Mobile App', date: '2025-07-25' },
        { transactionId: 'TXN002', timestamp: '2025-07-24 11:30', amount: 'QAR 250.75', customer: 'Jane Smith', recipient: 'Peter Jones', status: 'Pending', segment: 'Business', channel: 'Web Portal', date: '2025-07-24' },
        { transactionId: 'TXN003', timestamp: '2025-07-23 14:15', amount: 'QAR 50.00', customer: 'Peter Jones', recipient: 'John Doe', status: 'Completed', segment: 'Individual', channel: 'Mobile App', date: '2025-07-23' },
        { transactionId: 'TXN004', timestamp: '2025-06-15 09:00', amount: 'QAR 150.00', customer: 'John Doe', recipient: 'Jane Smith', status: 'Completed', segment: 'Individual', channel: 'Web Portal', date: '2025-06-15' }
    ];
}

/**
 * Generate mock dormant data
 * @returns {Array} Dormant account data
 */
function generateMockDormantData() {
    return [
        { customerName: 'Alice Brown', ypId: 'YP001', lastLogin: '2025-05-01', lastTransactionDate: '2025-04-15', date: '2025-04-15' },
        { customerName: 'Bob White', ypId: 'YP002', lastLogin: '2025-04-20', lastTransactionDate: '2025-03-20', date: '2025-03-20' }
    ];
}

/**
 * Generate mock commission data
 * @returns {Array} Commission data
 */
function generateMockCommissionData() {
    return [
        { date: '2025-07-25', transactionId: 'TXN001', originalAmount: 'QAR 100.50', fee: 'QAR 1.00', netRevenue: 'QAR 99.50' },
        { date: '2025-07-24', transactionId: 'TXN002', originalAmount: 'QAR 250.75', fee: 'QAR 2.50', netRevenue: 'QAR 248.25' },
        { date: '2025-06-15', transactionId: 'TXN004', originalAmount: 'QAR 150.00', fee: 'QAR 1.50', netRevenue: 'QAR 148.50' }
    ];
}

/**
 * Export report data
 * @param {string} reportType - Type of report to export
 * @param {string} format - 'csv' or 'pdf'
 */
function exportReportData(reportType, format) {
    const data = reportData[reportType];
    if (!data || data.length === 0) {
        YassirPay.showNotification(`No data to export for ${reportType} report.`, 'info');
        return;
    }

    if (format === 'csv') {
        const headers = Object.keys(data[0]);
        const csv = [
            headers.join(','),
            ...data.map(row => headers.map(fieldName => {
                let value = row[fieldName];
                if (typeof value === 'string' && value.includes(',')) {
                    value = `"${value}"`; // Enclose with double quotes if contains comma
                }
                return value;
            }).join(','))
        ].join('\n');

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        if (link.download !== undefined) {
            const url = URL.createObjectURL(blob);
            link.setAttribute('href', url);
            link.setAttribute('download', `${reportType}_report.csv`);
            link.style.visibility = 'hidden';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            YassirPay.showNotification(`${reportType} report exported as CSV!`, 'success');
        }
    } else if (format === 'pdf') {
        YassirPay.showNotification('PDF export is not yet implemented.', 'info');
        // In a real application, you would use a library like jsPDF or send data to a backend for PDF generation
    }
}
