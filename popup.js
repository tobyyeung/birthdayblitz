// Run initialization as soon as the popup opens
document.addEventListener('DOMContentLoaded', () => {
  fetchCalendars();

  // Save the selected calendar whenever the user changes it
  document.getElementById('calendar').addEventListener('change', (e) => {
    chrome.storage.local.set({ lastSelectedCalendar: e.target.value });
  });
});

function fetchCalendars() {
  // Use interactive: false so we don't pop up a login screen on startup
  chrome.identity.getAuthToken({ interactive: false }, function (token) {
    const select = document.getElementById('calendar');
    const loginUI = document.getElementById('loginUI');
    const mainUI = document.getElementById('mainUI');

    // If they aren't logged in yet, show the login screen
    if (chrome.runtime.lastError || !token) {
      loginUI.style.display = 'block';
      mainUI.style.display = 'none';
      return;
    }

    // They are logged in! Show the main UI
    loginUI.style.display = 'none';
    mainUI.style.display = 'block';

    // Fetch the user's actual calendars
    fetch('https://www.googleapis.com/calendar/v3/users/me/calendarList', {
      headers: { 'Authorization': `Bearer ${token}` }
    })
      .then(response => response.json())
      .then(data => {
        const optionsContainer = document.getElementById('customSelectOptions');
        const triggerText = document.getElementById('customSelectText');
        const hiddenInput = document.getElementById('calendar');
        
        optionsContainer.innerHTML = '';
        hiddenInput.value = '';
        triggerText.textContent = 'Select a Calendar';

        // Check if the API returned an error (e.g. Calendar API not enabled)
        if (data.error) {
          throw new Error(`Google API Error: ${data.error.message}`);
        }
        if (!data.items) {
          throw new Error('No items returned from Calendar API');
        }

        const calendars = [];
        // Add the Primary calendar to the list
        calendars.push({ id: 'primary', summary: 'Primary Calendar' });

        // Loop through the rest of the calendars
        data.items.forEach(cal => {
          if (cal.primary) {
            // The primary calendar ID is the user's Google account email!
            document.getElementById('accountInfo').textContent = `Logged in as ${cal.id}`;
            return; // Skip primary since we already added it
          }
          // Only include calendars the user has permission to edit
          if (cal.accessRole === 'reader' || cal.accessRole === 'freeBusyReader') return;
          
          calendars.push({ id: cal.id, summary: cal.summary });
        });

        // Render custom options
        calendars.forEach(cal => {
          const opt = document.createElement('div');
          opt.className = 'custom-option';
          opt.textContent = cal.summary;
          opt.addEventListener('click', () => {
             hiddenInput.value = cal.id;
             triggerText.textContent = cal.summary;
             document.getElementById('customSelect').classList.remove('open');
             chrome.storage.local.set({ lastSelectedCalendar: cal.id });
          });
          optionsContainer.appendChild(opt);
        });

        // Restore the previously selected calendar from storage (if any)
        chrome.storage.local.get(['lastSelectedCalendar'], function (result) {
          if (result.lastSelectedCalendar) {
            const saved = calendars.find(c => c.id === result.lastSelectedCalendar);
            if (saved) {
               hiddenInput.value = saved.id;
               triggerText.textContent = saved.summary;
            }
          }
        });
      })
      .catch(error => {
        console.error('Error fetching calendars:', error);
        document.getElementById('customSelectText').textContent = 'Error Loading Calendars';
      });
  });
}

// Wire up custom select toggle
document.getElementById('customSelectTrigger').addEventListener('click', () => {
  document.getElementById('customSelect').classList.toggle('open');
});

// Close when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('.custom-select')) {
    document.getElementById('customSelect').classList.remove('open');
  }
});

// Wire up the "Today" button
document.getElementById("todayBtn").addEventListener("click", () => {
  const today = new Date();

  // Extract parts and pad with leading zeros (e.g., '7' becomes '07')
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0");
  const dd = String(today.getDate()).padStart(2, "0");

  // Set the value in YYYY-MM-DD format
  document.getElementById("date").value = `${yyyy}-${mm}-${dd}`;
});

// Wire up the "Add to Calendar" button
document.getElementById("submitBtn").addEventListener("click", () => {
  // Grab the values from the UI
  const name = document.getElementById("name").value.trim();
  const date = document.getElementById("date").value;
  const calendar = document.getElementById("calendar").value;

  // Basic validation
  if (!name || !date) {
    alert("Please fill in both Name and Birthdate.");
    return;
  }

  if (!calendar || calendar === "") {
    alert("Please select a calendar from the dropdown.");
    return;
  }

  // Format the data for the API
  const eventTitle = `${name}'s Birthday`;
  const recurringRule = "RRULE:FREQ=YEARLY";

  // Calculate the end date (Google Calendar all-day events require the end date to be the next day)
  const startDateObj = new Date(date);
  startDateObj.setDate(startDateObj.getDate() + 1); // add 1 day
  const endYYYY = startDateObj.getFullYear();
  const endMM = String(startDateObj.getMonth() + 1).padStart(2, "0");
  const endDD = String(startDateObj.getDate()).padStart(2, "0");
  const endDate = `${endYYYY}-${endMM}-${endDD}`;

  const eventBody = {
    summary: eventTitle,
    start: { date: date },
    end: { date: endDate },
    recurrence: [recurringRule],
    transparency: "transparent" // Show as "Free" so it doesn't block out the whole day
  };

  // Change button text to show progress
  const btn = document.getElementById("submitBtn");
  const originalText = btn.textContent;
  const successMsg = document.getElementById("successMsg");
  btn.textContent = "Adding...";
  btn.disabled = true;
  successMsg.style.display = "none";

  chrome.identity.getAuthToken({ interactive: true }, function (token) {
    if (chrome.runtime.lastError) {
      console.error("Auth failed:", chrome.runtime.lastError.message);
      btn.textContent = originalText;
      btn.disabled = false;
      return;
    }

    fetch(`https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendar)}/events`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(eventBody)
    })
      .then(response => response.json())
      .then(data => {
        if (data.error) {
          throw new Error(data.error.message);
        }
        console.log("✅ Event created successfully!", data);
        
        // Show success message
        successMsg.textContent = `✅ Added ${name}'s birthday!`;
        successMsg.style.display = "block";
        
        // Reset button immediately
        btn.textContent = originalText;
        btn.disabled = false;
        
        // Clear inputs immediately to prevent double submission
        const nameEl = document.getElementById("name");
        nameEl.value = "";
        nameEl.dispatchEvent(new Event("input")); // trigger fake preview update
        document.getElementById("date").value = "";

        // Hide success message after a few seconds
        setTimeout(() => {
          successMsg.style.display = "none";
        }, 3000);
      })
      .catch(error => {
        console.error("Error creating event:", error);
        btn.textContent = "Error!";
        setTimeout(() => {
          btn.textContent = originalText;
          btn.disabled = false;
        }, 2000);
        alert(`Failed to create event: ${error.message}`);
      });
  });
});

// Wire up the "Logout" button
document.getElementById('logoutBtn').addEventListener('click', () => {
  chrome.identity.getAuthToken({ interactive: false }, function (token) {
    if (!token) {
      alert('You are already logged out.');
      return;
    }

    // Revoke token on Google's end (so it invalidates the session)
    fetch(`https://accounts.google.com/o/oauth2/revoke?token=${token}`);

    // Remove token from Chrome's cache
    chrome.identity.removeCachedAuthToken({ token: token }, function () {
      // Clear the calendar dropdown and show logged out state
      const select = document.getElementById('calendar');
      select.innerHTML = '<option value="primary">Logged out...</option>';
      document.getElementById('accountInfo').textContent = '';

      // Clear the saved preference
      chrome.storage.local.remove('lastSelectedCalendar');

      // Switch back to login view
      document.getElementById('loginUI').style.display = 'block';
      document.getElementById('mainUI').style.display = 'none';
    });
  });
});

// Wire up the Login button
document.getElementById('loginBtn').addEventListener('click', () => {
  chrome.identity.getAuthToken({ interactive: true }, function (token) {
    if (chrome.runtime.lastError || !token) {
      console.error("Auth failed:", chrome.runtime.lastError?.message);
      return;
    }
    // Successfully authenticated, load the calendars (which also shows main UI)
    fetchCalendars();
  });
});

// Sync the fake preview with the name input
const nameInput = document.getElementById('name');
const fakeName = document.getElementById('fakeName');
const suffixSpan = document.getElementById('suffixSpan');

nameInput.addEventListener('input', () => {
  fakeName.textContent = nameInput.value;
  if (nameInput.value.length > 0) {
    suffixSpan.style.display = 'inline';
  } else {
    suffixSpan.style.display = 'none';
  }
});
