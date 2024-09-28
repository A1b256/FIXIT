// Verify the OTP
function verifyOTP() {
    const otp = document.getElementById("otp").value;

    // Use the stored confirmationResult from the signup process
    window.confirmationResult.confirm(otp)
        .then(function(result) {
            // User signed in successfully.
            const user = result.user;
            console.log("User signed in:", user);

            // Optionally, save the user to your database or proceed to another page
            window.location.href = "success.html"; // Redirect to a success page
        })
        .catch(function(error) {
            // Handle errors here
            console.error("Error verifying OTP:", error);
            alert("Invalid OTP. Please try again.");
        });
}
