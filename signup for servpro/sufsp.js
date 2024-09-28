// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBUFV3rgGAz29JwYHAZobxIjA31f4NhcSI",
    authDomain: "fiixit-aaf96.firebaseapp.com",
    projectId: "fiixit-aaf96",
    storageBucket: "fiixit-aaf96.appspot.com",
    messagingSenderId: "1046769132018",
    appId: "1:1046769132018:web:e4c3a8e527d71caba98b6b"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Render reCAPTCHA on page load
window.onload = function() {
    renderReCAPTCHA();
};

function renderReCAPTCHA() {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('g-recaptcha', {
        'size': 'normal',
        'callback': function(response) {
            console.log("reCAPTCHA verified");
        },
        'expired-callback': function() {
            console.warn("reCAPTCHA expired. Please retry.");
        }
    });

    window.recaptchaVerifier.render().then(function(widgetId) {
        console.log("reCAPTCHA rendered, widget ID:", widgetId);
    }).catch(function(error) {
        console.error("Error rendering reCAPTCHA:", error);
    });
}

document.getElementById("signupForm").addEventListener("submit", function(event) {
    event.preventDefault(); // Prevent the default form submission

    // Collect form data
    const name = document.getElementById("name").value;
    const age = document.getElementById("age").value;
    const gender = document.querySelector('input[name="gender"]:checked').value;
    let phone = document.getElementById("phone").value;
    const address = document.getElementById("address").value;
    const expertise = document.getElementById("expertise").value;
    const experience = document.getElementById("experience").value;
    const aadharImage = document.getElementById("aadharImage").files[0];

    // Ensure the phone number starts with the country code
    if (!phone.startsWith("+91")) {
        phone = "+91" + phone;
        document.getElementById("phone").value = phone;
    }

    // File upload handling
    document.getElementById('aadharImage').addEventListener('change', function() {
        const file = this.files[0];
        if (file) {
            document.getElementById('fileName').textContent = file.name;
            this.classList.add('uploaded');
        } else {
            document.getElementById('fileName').textContent = '';
            this.classList.remove('uploaded');
        }
    });

    // Proceed with phone authentication
    phoneAuth(phone);
});

function phoneAuth(phone) {
    console.log("Attempting phone authentication for:", phone)

    firebase.auth().signInWithPhoneNumber(phone, window.recaptchaVerifier)
        .then(function(confirmationResult) {
            console.log("OTP sent successfully");

            // Store confirmationResult for OTP verification
            window.confirmationResult = confirmationResult;

            // Save user details in localStorage for use in the OTP page
            localStorage.setItem('name', document.getElementById("name").value);
            localStorage.setItem('age', document.getElementById("age").value);
            localStorage.setItem('gender', document.querySelector('input[name="gender"]:checked').value);
            localStorage.setItem('phone', phone);
            localStorage.setItem('address', document.getElementById("address").value);
            localStorage.setItem('expertise', document.getElementById("expertise").value);
            localStorage.setItem('experience', document.getElementById("experience").value);

            // Redirect to the OTP verification page
        })
        .catch(function(error) {
            console.error("Error during phone authentication:", error);
            alert("Error: " + error.message);
        });

        window.location.href = "otp.html";
}
