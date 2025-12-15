// Loan Application Interactive Features
// STRONIC HOLDINGS - Enhanced Loan Application System

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all interactive features
    initializeLoanTable();
    initializePhotoCapture();
    initializeFileUpload();
    initializeFormValidation();
    initializeFormInteractions();
});

// Interactive Loan Table Functionality
function initializeLoanTable() {
    const loanTableBody = document.getElementById('loanTableBody');
    if (!loanTableBody) return;

    // Add hover effects and click interactions
    const rows = loanTableBody.querySelectorAll('tr');
    rows.forEach(row => {
        row.style.cursor = 'pointer';
        row.style.transition = 'all 0.3s ease';
        
        row.addEventListener('mouseenter', function() {
            this.style.backgroundColor = '#f8f9fa';
            this.style.transform = 'translateX(5px)';
            this.style.boxShadow = '0 2px 10px rgba(176, 42, 42, 0.1)';
        });
        
        row.addEventListener('mouseleave', function() {
            this.style.backgroundColor = '';
            this.style.transform = 'translateX(0)';
            this.style.boxShadow = '';
        });
        
        row.addEventListener('click', function() {
            const amount = this.cells[0].textContent;
            const loanAmountInput = document.getElementById('loanAmount');
            if (loanAmountInput) {
                loanAmountInput.value = amount.replace('$', '').replace(',', '');
                loanAmountInput.focus();
                
                // Visual feedback
                loanAmountInput.style.borderColor = '#b02a2a';
                loanAmountInput.style.boxShadow = '0 0 10px rgba(176, 42, 42, 0.3)';
                setTimeout(() => {
                    loanAmountInput.style.borderColor = '#e9ecef';
                    loanAmountInput.style.boxShadow = '';
                }, 2000);
            }
        });
    });
}

// Live Photo Capture Functionality
function initializePhotoCapture() {
    const startCameraBtn = document.getElementById('startCamera');
    const capturePhotoBtn = document.getElementById('capturePhoto');
    const retakePhotoBtn = document.getElementById('retakePhoto');
    const cameraPreview = document.getElementById('cameraPreview');
    const photoCanvas = document.getElementById('photoCanvas');
    const capturedPhoto = document.getElementById('capturedPhoto');
    const photoPreview = document.getElementById('photoPreview');

    let stream = null;

    if (!startCameraBtn) return;

    startCameraBtn.addEventListener('click', async function() {
        try {
            stream = await navigator.mediaDevices.getUserMedia({ 
                video: { 
                    width: 320, 
                    height: 240,
                    facingMode: 'user'
                } 
            });
            
            cameraPreview.srcObject = stream;
            cameraPreview.style.display = 'block';
            cameraPreview.play();
            
            startCameraBtn.style.display = 'none';
            capturePhotoBtn.style.display = 'inline-block';
            
        } catch (error) {
            console.error('Error accessing camera:', error);
            alert('Unable to access camera. Please ensure you have granted camera permissions and try again.');
        }
    });

    capturePhotoBtn.addEventListener('click', function() {
        if (!stream) return;

        const context = photoCanvas.getContext('2d');
        photoCanvas.width = 320;
        photoCanvas.height = 240;
        
        context.drawImage(cameraPreview, 0, 0, 320, 240);
        
        const imageDataUrl = photoCanvas.toDataURL('image/jpeg', 0.8);
        photoPreview.src = imageDataUrl;
        
        // Stop camera stream
        stream.getTracks().forEach(track => track.stop());
        
        // Update UI
        cameraPreview.style.display = 'none';
        capturedPhoto.style.display = 'block';
        capturePhotoBtn.style.display = 'none';
        retakePhotoBtn.style.display = 'inline-block';
        
        // Store photo data for form submission
        const form = document.getElementById('loanApplicationForm');
        if (form) {
            let photoInput = form.querySelector('input[name="capturedPhoto"]');
            if (!photoInput) {
                photoInput = document.createElement('input');
                photoInput.type = 'hidden';
                photoInput.name = 'capturedPhoto';
                form.appendChild(photoInput);
            }
            photoInput.value = imageDataUrl;
        }
    });

    retakePhotoBtn.addEventListener('click', function() {
        capturedPhoto.style.display = 'none';
        retakePhotoBtn.style.display = 'none';
        startCameraBtn.style.display = 'inline-block';
        
        // Remove stored photo data
        const form = document.getElementById('loanApplicationForm');
        if (form) {
            const photoInput = form.querySelector('input[name="capturedPhoto"]');
            if (photoInput) {
                photoInput.remove();
            }
        }
    });
}

// File Upload Functionality
function initializeFileUpload() {
    const nationalIdInput = document.getElementById('nationalId');
    const uploadContainer = nationalIdInput?.parentElement;
    const idPreview = document.getElementById('idPreview');

    if (!nationalIdInput || !uploadContainer) return;

    // Drag and drop functionality
    uploadContainer.addEventListener('dragover', function(e) {
        e.preventDefault();
        this.style.borderColor = '#b02a2a';
        this.style.backgroundColor = '#f8f9fa';
    });

    uploadContainer.addEventListener('dragleave', function(e) {
        e.preventDefault();
        this.style.borderColor = '#b02a2a';
        this.style.backgroundColor = '';
    });

    uploadContainer.addEventListener('drop', function(e) {
        e.preventDefault();
        this.style.borderColor = '#b02a2a';
        this.style.backgroundColor = '';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleFileSelection(files[0]);
        }
    });

    nationalIdInput.addEventListener('change', function(e) {
        if (e.target.files.length > 0) {
            handleFileSelection(e.target.files[0]);
        }
    });

    function handleFileSelection(file) {
        // Validate file type
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
        if (!allowedTypes.includes(file.type)) {
            alert('Please upload a valid file format (JPG, PNG, or PDF)');
            return;
        }

        // Validate file size (5MB max)
        const maxSize = 5 * 1024 * 1024; // 5MB in bytes
        if (file.size > maxSize) {
            alert('File size must be less than 5MB');
            return;
        }

        // Show success message
        if (idPreview) {
            idPreview.style.display = 'block';
            idPreview.innerHTML = `
                <p style="color: #28a745; margin: 0; font-weight: 600;">
                    <i class="fa fa-check-circle"></i> ${file.name} uploaded successfully!
                </p>
                <small style="color: #666; display: block; margin-top: 5px;">
                    Size: ${(file.size / 1024 / 1024).toFixed(2)} MB
                </small>
            `;
        }

        // Add visual feedback to container
        uploadContainer.style.borderColor = '#28a745';
        uploadContainer.style.backgroundColor = '#f8fff8';
    }
}

// Form Validation and Enhancement
function initializeFormValidation() {
    const form = document.getElementById('loanApplicationForm');
    if (!form) return;

    // Add real-time validation
    const inputs = form.querySelectorAll('input, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.borderColor = '#b02a2a';
            this.style.boxShadow = '0 0 5px rgba(176, 42, 42, 0.3)';
        });

        input.addEventListener('blur', function() {
            if (this.checkValidity() && this.value.trim() !== '') {
                this.style.borderColor = '#28a745';
                this.style.boxShadow = '0 0 5px rgba(40, 167, 69, 0.3)';
            } else if (this.value.trim() !== '') {
                this.style.borderColor = '#dc3545';
                this.style.boxShadow = '0 0 5px rgba(220, 53, 69, 0.3)';
            } else {
                this.style.borderColor = '#e9ecef';
                this.style.boxShadow = '';
            }
        });
    });

    // Form submission handling - send to backend API
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (!validateForm()) {
            showValidationErrors();
            return;
        }

        // disable submit button
        const submitBtn = form.querySelector('button[type="submit"]');
        const originalBtnHtml = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Processing...';

        try {
            await submitLoanApplication(form);
            // show success UI handled inside submitLoanApplication
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalBtnHtml;
        }
    });
}

// Submit form to backend API (multipart/form-data)
async function submitLoanApplication(form) {
    const apiUrl = '/api/loans';
    const formData = new FormData();

    // Append all form fields
    const fields = form.querySelectorAll('input, select, textarea');
    fields.forEach(f => {
        if (!f.name) return;
        if (f.type === 'file') return; // files handled separately
        if (f.type === 'checkbox' || f.type === 'radio') {
            if (f.checked) formData.append(f.name, f.value);
            return;
        }
        formData.append(f.name, f.value);
    });

    // Append national ID file
    const nationalId = document.getElementById('nationalId');
    if (nationalId && nationalId.files && nationalId.files[0]) {
        formData.append('nationalId', nationalId.files[0]);
    }

    // Append captured photo if present as data URL
    const photoPreview = document.getElementById('photoPreview');
    if (photoPreview && photoPreview.src && photoPreview.src.startsWith('data:')) {
        const blob = dataURItoBlob(photoPreview.src);
        formData.append('photo', blob, 'photo.png');
    }

    try {
        const res = await fetch(apiUrl, { method: 'POST', body: formData });
        const data = await res.json();
        if (res.ok) {
            showSubmissionSuccessBackend(data.id);
            form.reset();
            // hide captured photo UI
            const captured = document.getElementById('capturedPhoto');
            if (captured) captured.style.display = 'none';
        } else {
            alert('Submission failed: ' + (data.error || 'Unknown error'));
        }
    } catch (err) {
        console.error(err);
        alert('Network error submitting application');
    }
}

function dataURItoBlob(dataURI) {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) ia[i] = byteString.charCodeAt(i);
    return new Blob([ab], { type: mimeString });
}

function validateForm() {
    const form = document.getElementById('loanApplicationForm');
    const requiredFields = form.querySelectorAll('[required]');
    let isValid = true;

    requiredFields.forEach(field => {
        if (!field.value.trim() || !field.checkValidity()) {
            isValid = false;
            field.style.borderColor = '#dc3545';
        }
    });

    // Check terms and conditions agreement
    const termsCheckbox = document.getElementById('termsAgreement');
    if (!termsCheckbox || !termsCheckbox.checked) {
        alert('You must agree to the Terms and Conditions before submitting your application.');
        if (termsCheckbox) {
            termsCheckbox.focus();
            termsCheckbox.parentElement.style.borderColor = '#dc3545';
            termsCheckbox.parentElement.style.backgroundColor = '#fff5f5';
        }
        isValid = false;
    }

    // Check if photo is captured
    const photoInput = form.querySelector('input[name="capturedPhoto"]');
    if (!photoInput || !photoInput.value) {
        alert('Please capture your photo for identity verification.');
        isValid = false;
    }

    // Check if National ID is uploaded
    const nationalIdInput = document.getElementById('nationalId');
    if (!nationalIdInput.files || nationalIdInput.files.length === 0) {
        alert('Please upload your National ID document.');
        isValid = false;
    }

    return isValid;
}

function showSubmissionSuccessBackend(referenceId) {
    const form = document.getElementById('loanApplicationForm');
    const successMessage = document.createElement('div');
    successMessage.innerHTML = `
        <div style="background: linear-gradient(135deg, #28a745 0%, #20c997 100%); color: white; padding: 30px; border-radius: 15px; text-align: center; margin-top: 30px; box-shadow: 0 5px 25px rgba(40, 167, 69, 0.3);">
            <i class="fa fa-check-circle" style="font-size: 3em; margin-bottom: 20px;"></i>
            <h4 style="margin-bottom: 15px; font-weight: 600;">Application Submitted Successfully!</h4>
            <p style="margin-bottom: 20px; font-size: 16px;">Thank you for choosing STRONIC HOLDINGS. Your loan application has been received and is now under verification.</p>
            <p style="margin: 0; font-size: 14px; opacity: 0.9;">Application Reference: #SH${referenceId}</p>
            
            <div style="background: rgba(255,255,255,0.1); padding: 20px; border-radius: 10px; margin: 20px 0; text-align: left;">
                <h5 style="margin-bottom: 15px; font-weight: 600;"><i class="fa fa-clock-o"></i> Verification Process Timeline</h5>
                <ul style="list-style: none; padding: 0; margin: 0;">
                    <li style="margin-bottom: 8px;"><i class="fa fa-check" style="color: #90EE90; margin-right: 8px;"></i> Application received and under review</li>
                    <li style="margin-bottom: 8px;"><i class="fa fa-hourglass-half" style="margin-right: 8px;"></i> Document verification: 2-3 business days</li>
                    <li style="margin-bottom: 8px;"><i class="fa fa-hourglass-half" style="margin-right: 8px;"></i> Credit assessment: 1-2 business days</li>
                    <li style="margin-bottom: 8px;"><i class="fa fa-hourglass-half" style="margin-right: 8px;"></i> Final approval decision: 1 business day</li>
                </ul>
                <p style="margin: 15px 0 0 0; font-size: 13px; opacity: 0.9;"><strong>Total processing time: 4-6 business days</strong></p>
            </div>
            
            <div style="background: rgba(255,255,255,0.1); padding: 15px; border-radius: 10px; margin: 15px 0;">
                <h6 style="margin-bottom: 10px; font-weight: 600;"><i class="fa fa-info-circle"></i> Check Your Application Status</h6>
                <p style="margin: 0; font-size: 14px;">To check if your application has been approved or requires additional information, visit our <a href="loan-status.html" style="color: #FFE4B5; text-decoration: underline; font-weight: 600;">Loan Status Portal</a> using the email address you provided in this application.</p>
            </div>
            
            <p style="margin: 15px 0 0 0; font-size: 14px; opacity: 0.9;">You will receive email updates at each stage of the verification process.</p>
        </div>
    `;

    form.parentNode.insertBefore(successMessage, form.nextSibling);
    form.style.display = 'none';
    successMessage.scrollIntoView({ behavior: 'smooth' });
}

function showValidationErrors() {
    alert('Please fill in all required fields correctly before submitting your application.');
}

// Form Interaction Enhancements
function initializeFormInteractions() {
    // Auto-format phone numbers
    const phoneInputs = document.querySelectorAll('input[type="tel"]');
    phoneInputs.forEach(input => {
        input.addEventListener('input', function() {
            this.value = formatPhoneNumber(this.value);
        });
    });
}

function formatPhoneNumber(value) {
    // Remove all non-numeric characters
    const phoneNumber = value.replace(/\D/g, '');
    
    // Format as (XXX) XXX-XXXX
    if (phoneNumber.length >= 6) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    } else if (phoneNumber.length >= 3) {
        return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
        return phoneNumber;
    }
}