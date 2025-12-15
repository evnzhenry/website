// Loan Status Check System
// STRONIC HOLDINGS - Secure Application Status Verification

document.addEventListener('DOMContentLoaded', function() {
    initializeLoanStatusSystem();
});

let currentEmail = '';
let otpToken = '';

function initializeLoanStatusSystem() {
    const emailForm = document.getElementById('emailForm');
    const otpForm = document.getElementById('otpForm');
    const resendBtn = document.getElementById('resendOtp');
    const changeEmailBtn = document.getElementById('changeEmail');

    if (emailForm) {
        emailForm.addEventListener('submit', handleEmailSubmission);
    }

    if (otpForm) {
        otpForm.addEventListener('submit', handleOtpVerification);
    }

    if (resendBtn) {
        resendBtn.addEventListener('click', resendOtpCode);
    }

    if (changeEmailBtn) {
        changeEmailBtn.addEventListener('click', goBackToEmailStep);
    }

    // Auto-format OTP input
    const otpInput = document.getElementById('otpCode');
    if (otpInput) {
        otpInput.addEventListener('input', function(e) {
            // Only allow numbers
            this.value = this.value.replace(/[^0-9]/g, '');
            
            // Auto-submit when 6 digits are entered
            if (this.value.length === 6) {
                setTimeout(() => {
                    handleOtpVerification(e);
                }, 500);
            }
        });

        otpInput.addEventListener('paste', function(e) {
            setTimeout(() => {
                this.value = this.value.replace(/[^0-9]/g, '').substring(0, 6);
            }, 10);
        });
    }
}

async function handleEmailSubmission(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('applicantEmail');
    const email = emailInput.value.trim();
    
    if (!email || !isValidEmail(email)) {
        showError('Please enter a valid email address.');
        return;
    }

    const submitBtn = e.target.querySelector('button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Sending Code...';
        
        const response = await fetch('/api/loan-status/request-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: email })
        });

        const data = await response.json();

        if (response.ok) {
            currentEmail = email;
            showOtpStep(email);
            showSuccess('Verification code sent to your email. Please check your inbox.');
        } else {
            showError(data.error || 'No application found with this email address.');
        }
    } catch (error) {
        console.error('Error requesting OTP:', error);
        showError('Network error. Please check your connection and try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

async function handleOtpVerification(e) {
    e.preventDefault();
    
    const otpInput = document.getElementById('otpCode');
    const otp = otpInput.value.trim();
    
    if (!otp || otp.length !== 6) {
        showError('Please enter the complete 6-digit verification code.');
        return;
    }

    const submitBtn = e.target.querySelector ? e.target.querySelector('button[type="submit"]') : document.querySelector('#otpForm button[type="submit"]');
    const originalBtnText = submitBtn.innerHTML;
    
    try {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Verifying...';
        
        const response = await fetch('/api/loan-status/verify-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                email: currentEmail,
                otp: otp 
            })
        });

        const data = await response.json();

        if (response.ok) {
            otpToken = data.token;
            await loadApplicationStatus(data.applications);
            showSuccess('Verification successful! Loading your application status...');
        } else {
            showError(data.error || 'Invalid verification code. Please try again.');
            otpInput.value = '';
            otpInput.focus();
        }
    } catch (error) {
        console.error('Error verifying OTP:', error);
        showError('Network error. Please check your connection and try again.');
    } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalBtnText;
    }
}

async function resendOtpCode() {
    const resendBtn = document.getElementById('resendOtp');
    const originalBtnText = resendBtn.innerHTML;
    
    try {
        resendBtn.disabled = true;
        resendBtn.innerHTML = '<i class="fa fa-spinner fa-spin"></i> Sending...';
        
        const response = await fetch('/api/loan-status/request-otp', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email: currentEmail })
        });

        const data = await response.json();

        if (response.ok) {
            showSuccess('New verification code sent to your email.');
            document.getElementById('otpCode').value = '';
            document.getElementById('otpCode').focus();
        } else {
            showError(data.error || 'Failed to resend verification code.');
        }
    } catch (error) {
        console.error('Error resending OTP:', error);
        showError('Network error. Please try again.');
    } finally {
        resendBtn.disabled = false;
        resendBtn.innerHTML = originalBtnText;
    }
}

function showOtpStep(email) {
    document.getElementById('emailStep').style.display = 'none';
    document.getElementById('otpStep').style.display = 'block';
    
    // Mask email for privacy
    const maskedEmail = maskEmail(email);
    document.getElementById('maskedEmail').textContent = maskedEmail;
    
    // Focus on OTP input
    setTimeout(() => {
        document.getElementById('otpCode').focus();
    }, 100);
}

function goBackToEmailStep() {
    document.getElementById('otpStep').style.display = 'none';
    document.getElementById('statusDisplay').style.display = 'none';
    document.getElementById('emailStep').style.display = 'block';
    
    currentEmail = '';
    otpToken = '';
    
    document.getElementById('applicantEmail').focus();
}

async function loadApplicationStatus(applications) {
    document.getElementById('otpStep').style.display = 'none';
    document.getElementById('statusDisplay').style.display = 'block';
    
    const statusContent = document.getElementById('statusContent');
    
    if (!applications || applications.length === 0) {
        statusContent.innerHTML = `
            <div style="text-align: center; padding: 40px;">
                <i class="fa fa-search" style="font-size: 3em; color: #6c757d; margin-bottom: 20px;"></i>
                <h4 style="color: #6c757d; margin-bottom: 15px;">No Applications Found</h4>
                <p style="color: #666;">We couldn't find any loan applications associated with this email address.</p>
                <button onclick="goBackToEmailStep()" class="btn" style="background: #b02a2a; color: white; padding: 12px 30px; border: none; border-radius: 8px; margin-top: 20px;">
                    Try Different Email
                </button>
            </div>
        `;
        return;
    }

    let statusHtml = `
        <div style="text-align: center; margin-bottom: 40px;">
            <i class="fa fa-file-text-o" style="font-size: 3em; color: #b02a2a; margin-bottom: 20px;"></i>
            <h4 style="color: #b02a2a; margin-bottom: 15px;">Your Loan Application Status</h4>
            <p style="color: #666;">Here are your current loan applications and their verification status.</p>
        </div>
    `;

    applications.forEach((app, index) => {
        const statusInfo = getStatusInfo(app.status);
        const progressPercentage = getProgressPercentage(app.status);
        
        statusHtml += `
            <div style="background: linear-gradient(135deg, #fff 0%, #f8f9fa 100%); padding: 30px; border-radius: 15px; margin-bottom: 30px; border-left: 4px solid ${statusInfo.color}; box-shadow: 0 5px 25px rgba(0,0,0,0.1);">
                <div class="row">
                    <div class="col-md-8">
                        <h5 style="color: #333; margin-bottom: 15px;">
                            <i class="fa fa-file-text" style="margin-right: 10px; color: #b02a2a;"></i>
                            Application #SH${app.id}
                        </h5>
                        <div style="margin-bottom: 20px;">
                            <p style="margin: 5px 0; color: #666;"><strong>Amount:</strong> $${app.loan_amount?.toLocaleString() || 'N/A'}</p>
                            <p style="margin: 5px 0; color: #666;"><strong>Purpose:</strong> ${app.loan_purpose || 'N/A'}</p>
                            <p style="margin: 5px 0; color: #666;"><strong>Submitted:</strong> ${formatDate(app.created_at)}</p>
                        </div>
                        
                        <div style="margin-bottom: 20px;">
                            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                                <span style="font-weight: 600; color: #333;">Progress</span>
                                <span style="font-weight: 600; color: ${statusInfo.color};">${progressPercentage}%</span>
                            </div>
                            <div style="background: #e9ecef; height: 8px; border-radius: 4px; overflow: hidden;">
                                <div style="background: ${statusInfo.color}; height: 100%; width: ${progressPercentage}%; transition: width 0.3s ease;"></div>
                            </div>
                        </div>
                    </div>
                    <div class="col-md-4" style="text-align: center;">
                        <div style="background: ${statusInfo.bgColor}; padding: 20px; border-radius: 10px; border: 2px solid ${statusInfo.color};">
                            <i class="${statusInfo.icon}" style="font-size: 2.5em; color: ${statusInfo.color}; margin-bottom: 15px;"></i>
                            <h6 style="color: ${statusInfo.color}; font-weight: 600; margin-bottom: 10px;">${statusInfo.title}</h6>
                            <p style="margin: 0; font-size: 14px; color: #666; line-height: 1.4;">${statusInfo.description}</p>
                        </div>
                    </div>
                </div>
                
                ${app.status === 'approved' ? `
                    <div style="background: rgba(40, 167, 69, 0.1); padding: 20px; border-radius: 10px; margin-top: 20px; border: 1px solid rgba(40, 167, 69, 0.2);">
                        <h6 style="color: #28a745; margin-bottom: 15px;"><i class="fa fa-check-circle"></i> Congratulations! Your loan has been approved.</h6>
                        <p style="margin: 0; color: #666; font-size: 14px;">Our team will contact you within 24 hours to finalize the loan agreement and disbursement details.</p>
                    </div>
                ` : ''}
                
                ${app.status === 'rejected' ? `
                    <div style="background: rgba(220, 53, 69, 0.1); padding: 20px; border-radius: 10px; margin-top: 20px; border: 1px solid rgba(220, 53, 69, 0.2);">
                        <h6 style="color: #dc3545; margin-bottom: 15px;"><i class="fa fa-times-circle"></i> Application Not Approved</h6>
                        <p style="margin: 0; color: #666; font-size: 14px;">Unfortunately, we cannot approve your loan application at this time. You may reapply after 30 days or contact our support team for more information.</p>
                    </div>
                ` : ''}
                
                ${app.status === 'pending_documents' ? `
                    <div style="background: rgba(255, 193, 7, 0.1); padding: 20px; border-radius: 10px; margin-top: 20px; border: 1px solid rgba(255, 193, 7, 0.2);">
                        <h6 style="color: #ffc107; margin-bottom: 15px;"><i class="fa fa-exclamation-triangle"></i> Additional Documents Required</h6>
                        <p style="margin: 0; color: #666; font-size: 14px;">We need additional documentation to process your application. Please check your email for specific requirements and upload the requested documents.</p>
                    </div>
                ` : ''}
            </div>
        `;
    });

    statusHtml += `
        <div style="text-align: center; margin-top: 40px;">
            <button onclick="goBackToEmailStep()" class="btn" style="background: #6c757d; color: white; padding: 12px 30px; border: none; border-radius: 8px; margin-right: 15px;">
                <i class="fa fa-arrow-left" style="margin-right: 8px;"></i>Check Another Email
            </button>
            <button onclick="window.location.reload()" class="btn" style="background: #b02a2a; color: white; padding: 12px 30px; border: none; border-radius: 8px;">
                <i class="fa fa-refresh" style="margin-right: 8px;"></i>Refresh Status
            </button>
        </div>
    `;

    statusContent.innerHTML = statusHtml;
    
    // Scroll to status display
    document.getElementById('statusDisplay').scrollIntoView({ behavior: 'smooth' });
}

function getStatusInfo(status) {
    const statusMap = {
        'pending': {
            title: 'Under Review',
            description: 'Your application is being reviewed by our team.',
            icon: 'fa fa-clock-o',
            color: '#ffc107',
            bgColor: 'rgba(255, 193, 7, 0.1)'
        },
        'document_verification': {
            title: 'Document Verification',
            description: 'We are verifying your submitted documents.',
            icon: 'fa fa-file-text-o',
            color: '#17a2b8',
            bgColor: 'rgba(23, 162, 184, 0.1)'
        },
        'credit_assessment': {
            title: 'Credit Assessment',
            description: 'Your credit profile is being evaluated.',
            icon: 'fa fa-bar-chart',
            color: '#6f42c1',
            bgColor: 'rgba(111, 66, 193, 0.1)'
        },
        'final_review': {
            title: 'Final Review',
            description: 'Your application is in final review stage.',
            icon: 'fa fa-search',
            color: '#fd7e14',
            bgColor: 'rgba(253, 126, 20, 0.1)'
        },
        'approved': {
            title: 'Approved',
            description: 'Congratulations! Your loan has been approved.',
            icon: 'fa fa-check-circle',
            color: '#28a745',
            bgColor: 'rgba(40, 167, 69, 0.1)'
        },
        'rejected': {
            title: 'Not Approved',
            description: 'Your application was not approved at this time.',
            icon: 'fa fa-times-circle',
            color: '#dc3545',
            bgColor: 'rgba(220, 53, 69, 0.1)'
        },
        'pending_documents': {
            title: 'Documents Required',
            description: 'Additional documents are needed to proceed.',
            icon: 'fa fa-upload',
            color: '#ffc107',
            bgColor: 'rgba(255, 193, 7, 0.1)'
        }
    };

    return statusMap[status] || statusMap['pending'];
}

function getProgressPercentage(status) {
    const progressMap = {
        'pending': 20,
        'document_verification': 40,
        'credit_assessment': 60,
        'final_review': 80,
        'approved': 100,
        'rejected': 100,
        'pending_documents': 30
    };

    return progressMap[status] || 20;
}

function maskEmail(email) {
    const [username, domain] = email.split('@');
    const maskedUsername = username.length > 2 
        ? username.substring(0, 2) + '*'.repeat(username.length - 2)
        : username;
    return `${maskedUsername}@${domain}`;
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showSuccess(message) {
    showNotification(message, 'success');
}

function showError(message) {
    showNotification(message, 'error');
}

function showNotification(message, type) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.status-notification');
    existingNotifications.forEach(notification => notification.remove());

    const notification = document.createElement('div');
    notification.className = 'status-notification';
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 25px;
        border-radius: 8px;
        color: white;
        font-weight: 600;
        z-index: 9999;
        max-width: 400px;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
        animation: slideInRight 0.3s ease;
        background: ${type === 'success' ? 'linear-gradient(135deg, #28a745 0%, #20c997 100%)' : 'linear-gradient(135deg, #dc3545 0%, #c82333 100%)'};
    `;

    notification.innerHTML = `
        <i class="fa fa-${type === 'success' ? 'check-circle' : 'exclamation-triangle'}" style="margin-right: 10px;"></i>
        ${message}
    `;

    document.body.appendChild(notification);

    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);