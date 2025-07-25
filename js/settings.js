const mfaModal = document.getElementById('mfaModal');
const mfaCodeInput = document.getElementById('mfaCode');
const mfaConfirmButton = document.getElementById('mfaConfirmButton');

function validateMfaCode() {
    // Enable button only if mfaCodeInput has exactly 6 digits
    if (mfaConfirmButton) { // Check if button exists before trying to disable
        mfaConfirmButton.disabled = !/^\d{6}$/.test(mfaCodeInput.value);
    }
}

function rotateCredentials() {
    if (mfaModal) { // Check if modal exists
        mfaModal.style.display = 'block';
        validateMfaCode(); // Validate on modal open
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const settingsForm = document.getElementById('settingsForm');
    const closeBtn = document.querySelector('.close-btn');

    if (settingsForm) {
        settingsForm.addEventListener('submit', function (e) {
            e.preventDefault();
            if (mfaModal) {
                mfaModal.style.display = 'block';
                validateMfaCode(); // Validate on modal open
            }
        });
    }

    if (mfaCodeInput) {
        mfaCodeInput.addEventListener('input', validateMfaCode); // Validate on input change
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            if (mfaModal) {
                mfaModal.style.display = 'none';
            }
        });
    }

    if (mfaModal) {
        window.onclick = function(event) {
            if (event.target == mfaModal) {
                mfaModal.style.display = "none";
            }
        }
    }

    // Initial validation check when the page loads
    validateMfaCode();
});
