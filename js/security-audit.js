document.addEventListener('DOMContentLoaded', function() {
    // Handle "Add New Role" button click
    const addRoleBtn = document.querySelector('.section-header-with-button .btn-primary');
    if (addRoleBtn) {
        addRoleBtn.addEventListener('click', function() {
            console.log('Add New Role button clicked!');
            // In a real application, this would open a form for adding a new role
            YassirPay.showNotification('Add New Role functionality coming soon!', 'info');
        });
    }

    // Handle Delete Role confirmation
    const confirmationModal = document.getElementById('confirmationModal');
    const confirmDeleteBtn = confirmationModal.querySelector('.modal-confirm');
    const cancelDeleteBtn = confirmationModal.querySelector('.modal-cancel');

    if (confirmDeleteBtn) {
        confirmDeleteBtn.addEventListener('click', function() {
            console.log('Confirm Delete button clicked!');
            // In a real application, this would trigger the actual deletion
            YassirPay.showNotification('Role deleted successfully!', 'success');
            confirmationModal.classList.remove('active');
        });
    }

    if (cancelDeleteBtn) {
        cancelDeleteBtn.addEventListener('click', function() {
            console.log('Cancel Delete button clicked!');
            confirmationModal.classList.remove('active');
        });
    }

    // Handle Terminate Session confirmation
    const terminateSessionModal = document.getElementById('terminateSessionModal');
    const confirmTerminateBtn = terminateSessionModal.querySelector('.modal-confirm-terminate');
    const cancelTerminateBtn = terminateSessionModal.querySelector('.modal-cancel');

    if (confirmTerminateBtn) {
        confirmTerminateBtn.addEventListener('click', function() {
            console.log('Confirm Terminate Session button clicked!');
            // In a real application, this would trigger the session termination
            YassirPay.showNotification('Session terminated successfully!', 'success');
            terminateSessionModal.classList.remove('active');
        });
    }

    if (cancelTerminateBtn) {
        cancelTerminateBtn.addEventListener('click', function() {
            console.log('Cancel Terminate Session button clicked!');
            terminateSessionModal.classList.remove('active');
        });
    }
});
