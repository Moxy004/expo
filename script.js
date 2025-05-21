
document.querySelector('.signup-form').addEventListener('submit', function(e) {
    e.preventDefault(); // prevent actual page reload after submit

    if (this.checkValidity()) {
        // ✅ form is valid
        document.getElementById('signupSection').style.display = 'none';
        document.getElementById('verificationSection').style.display = 'block';
    } else {
        // 🔔 trigger native browser validation UI
        this.reportValidity();
    }
});

 document.getElementById("verifyBtn").addEventListener("click", function () {
    document.getElementById("verificationSection").style.display = "none";
    document.getElementById("passwordSection").style.display = "block";
  });

const calendarIcon = document.querySelector(".calendar-icon");
const hiddenDateInput = document.getElementById("hiddenDatePicker");

const mmInput = document.querySelector('.birthday-group input[placeholder="MM"]');
const ddInput = document.querySelector('.birthday-group input[placeholder="DD"]');
const yyyyInput = document.querySelector('.birthday-group input[placeholder="YYYY"]');

// When the calendar icon is clicked, toggle the visibility of the date input
calendarIcon.addEventListener("click", () => {
    console.log("Calendar icon clicked!");
    hiddenDateInput.classList.toggle("visible"); // Toggle visibility using the 'visible' class
});

// When a date is selected, update MM, DD, YYYY inputs
hiddenDateInput.addEventListener("change", () => {
    console.log("Date selected:", hiddenDateInput.value);
    const selectedDate = new Date(hiddenDateInput.value);
    if (!isNaN(selectedDate)) {
        mmInput.value = String(selectedDate.getMonth() + 1).padStart(2, '0');
        ddInput.value = String(selectedDate.getDate()).padStart(2, '0');
        yyyyInput.value = selectedDate.getFullYear();
    }
});

// Optional: Sync inputs back to hidden date input when manually entered
function updateHiddenDate() {
    const mm = mmInput.value.padStart(2, '0');
    const dd = ddInput.value.padStart(2, '0');
    const yyyy = yyyyInput.value;

    if (mm && dd && yyyy.length === 4) {
        const formatted = `${yyyy}-${mm}-${dd}`;
        hiddenDateInput.value = formatted;
    }
}

mmInput.addEventListener("input", updateHiddenDate);
ddInput.addEventListener("input", updateHiddenDate);
yyyyInput.addEventListener("input", updateHiddenDate);


