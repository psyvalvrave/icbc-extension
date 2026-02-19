document.addEventListener('DOMContentLoaded', () => {
  
  // Enforce "After Today" in Pacific Time
  const icbcTime = new Date(new Date().toLocaleString("en-US", {timeZone: "America/Vancouver"}));
  icbcTime.setDate(icbcTime.getDate() + 1);
  const year = icbcTime.getFullYear();
  const month = String(icbcTime.getMonth() + 1).padStart(2, '0');
  const day = String(icbcTime.getDate()).padStart(2, '0');
  const minDateString = `${year}-${month}-${day}`;
  
  document.getElementById('searchDate').min = minDateString;

  // Load saved data
  chrome.storage.local.get(
    ['licenceNumber', 'issueDay', 'issueMonth', 'issueYear', 'keyword', 'targetLocation', 'searchDate', 'searchDays'],
    (result) => {
      if (result.licenceNumber) document.getElementById('licenceNumber').value = result.licenceNumber;
      if (result.issueDay) document.getElementById('issueDay').value = result.issueDay;
      if (result.issueMonth) document.getElementById('issueMonth').value = result.issueMonth;
      if (result.issueYear) document.getElementById('issueYear').value = result.issueYear;
      if (result.keyword) document.getElementById('keyword').value = result.keyword;
      if (result.targetLocation) document.getElementById('targetLocation').value = result.targetLocation;
      
      if (result.searchDate) {
          if (result.searchDate >= minDateString) {
              document.getElementById('searchDate').value = result.searchDate;
          } else {
              document.getElementById('searchDate').value = ""; 
          }
      }
      
      if (result.searchDays) {
        result.searchDays.forEach(day => {
          const cb = document.querySelector(`.day-cb[value="${day}"]`);
          if (cb) cb.checked = true;
        });
      }
    }
  );

  // Save Settings Button
  document.getElementById('saveBtn').addEventListener('click', () => {
    const selectedDays = [];
    document.querySelectorAll('.day-cb:checked').forEach(cb => {
      selectedDays.push(cb.value);
    });

    const data = {
      licenceNumber: document.getElementById('licenceNumber').value,
      issueDay: document.getElementById('issueDay').value,
      issueMonth: document.getElementById('issueMonth').value,
      issueYear: document.getElementById('issueYear').value,
      keyword: document.getElementById('keyword').value,
      targetLocation: document.getElementById('targetLocation').value,
      searchDate: document.getElementById('searchDate').value,
      searchDays: selectedDays
    };

    chrome.storage.local.set(data, () => {
      const status = document.getElementById('status');
      status.textContent = 'Settings Saved!';
      setTimeout(() => { status.textContent = ''; }, 2000);
    });
  });

  // Book Road Test Button (Opens New Tab)
  document.getElementById('bookBtn').addEventListener('click', () => {
    chrome.tabs.create({ url: "https://onlinebusiness.icbc.com/webdeas-ui/home" });
  });

});