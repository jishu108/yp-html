// This file will handle API interactions.
// For now, it contains a simulation function.

function simulateAPI(endpoint, delay = 1000) {
    return new Promise((resolve) => {
        setTimeout(() => {
            const mockData = {
                '/api/dashboard': {
                    activations: 1245,
                    volume: 54321.89,
                    pending: 15,
                    revenue: 1234.56
                },
                '/api/transactions': [
                    { id: 'TXN001', amount: 100.50, status: 'completed' },
                    { id: 'TXN002', amount: 250.75, status: 'pending' }
                ]
            };
            
            resolve(mockData[endpoint] || {});
        }, delay);
    });
}
