// Immediately check if the extension is enabled before running anything
chrome.storage.local.get(['isExtensionEnabled'], (config) => {
    if (config.isExtensionEnabled === false) {
        console.log("ICBC Auto Login: Extension is DISABLED via popup toggle.");
        return; // Exit script entirely
    }

    console.log("ICBC Auto Login: Calendar Clicker Bot Active");

    // --- HELPERS ---

    function waitForCSS(selector, callback) {
        const interval = setInterval(() => {
            const element = document.querySelector(selector);
            if (element && element.offsetParent !== null) {
                clearInterval(interval);
                callback(element);
            }
        }, 500);
    }

    function waitForXPath(xpath, callback) {
        const interval = setInterval(() => {
            const element = document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
            if (element && element.offsetParent !== null) {
                clearInterval(interval);
                callback(element);
            }
        }, 500);
    }

    function setNativeValue(element, value) {
        if (!element) return;
        const lastValue = element.value;
        element.value = value;
        const event = new Event('input', { bubbles: true });
        const tracker = element._valueTracker;
        if (tracker) tracker.setValue(lastValue);
        element.dispatchEvent(event);
        element.dispatchEvent(new Event('change', { bubbles: true }));
    }

    function debugClick(element, name) {
        console.log(`Clicking: ${name}`);
        element.style.border = "4px solid red";
        element.scrollIntoView({block: "center", behavior: "smooth"});
        setTimeout(() => { element.click(); }, 300);
    }


    // --- MAIN LOGIN LOGIC (Steps 1-8) ---

    if (window.location.href.includes("resource_url")) {
        waitForXPath("//*[contains(text(), 'I have read and agree')]", (btn) => btn.click());
    }

    const kbaButtonSelector = 'form input[value="kba"] ~ button';
    waitForCSS(kbaButtonSelector, (btn) => btn.click());

    waitForXPath("//div[contains(@class, 'KBA-option-title') and contains(text(), 'driver')]", (titleDiv) => {
        const card = titleDiv.closest('.KBA-card-background');
        if (card) {
            card.click();
            fillCredentialForm();
        }
    });

    function fillCredentialForm() {
        chrome.storage.local.get(['licenceNumber', 'issueDay', 'issueMonth', 'issueYear'], (data) => {
            if (!data.licenceNumber) return;

            waitForCSS("input[id*='wtCardNumInput']", (licenceInput) => {
                setNativeValue(licenceInput, data.licenceNumber);
                
                const yearInput = document.querySelector("input[id*='wtYearInput']");
                if (yearInput) setNativeValue(yearInput, data.issueYear);

                const dayInput = document.querySelector("input[id*='wtDayInput']");
                if (dayInput) setNativeValue(dayInput, data.issueDay.toString().padStart(2, '0'));

                const monthSelect = document.querySelector("select[id*='wtMonthCombo']");
                if (monthSelect) {
                    for (let i = 0; i < monthSelect.options.length; i++) {
                        if (monthSelect.options[i].text === data.issueMonth) {
                            monthSelect.selectedIndex = i;
                            monthSelect.dispatchEvent(new Event('change', { bubbles: true }));
                            break;
                        }
                    }
                }
                setTimeout(() => {
                    const nextBtn = document.querySelector("input[value='Next']");
                    if (nextBtn) nextBtn.click();
                }, 500);
            });
        });
    }

    waitForXPath("//div[contains(@class, 'KBA-option-title') and contains(text(), 'keyword')]", (titleDiv) => {
        const card = titleDiv.closest('.KBA-card-background');
        if (card) card.click();
    });

    waitForCSS("input[id*='wtKeywordInput']", (keywordInput) => {
        chrome.storage.local.get(['keyword'], (data) => {
            if (data.keyword) {
                setNativeValue(keywordInput, data.keyword);
                setTimeout(() => {
                    const submitBtn = document.querySelector("input[value='Submit']");
                    if (submitBtn) submitBtn.click();
                }, 500);
            }
        });
    });


    // ==========================================
    // PAGE 4: BOOKING SEARCH 
    // ==========================================

    let userSettings = null;

    chrome.storage.local.get(['targetLocation', 'searchDate', 'searchDays'], (data) => {
        userSettings = data;
    });

    const bookingPageInterval = setInterval(() => {
        const byOfficeText = document.evaluate(
            "//div[contains(@class, 'mat-tab-label-content')][contains(., 'By office')]", 
            document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null
        ).singleNodeValue;

        if (byOfficeText) {
            if (!userSettings || !userSettings.targetLocation || userSettings.targetLocation.trim() === "") {
                console.log("No Target Location set. Stopping Page 4.");
                clearInterval(bookingPageInterval);
                return; 
            }

            const tabButton = byOfficeText.closest('[role="tab"]');
            
            if (tabButton) {
                const isSelected = tabButton.getAttribute('aria-selected') === 'true';

                if (!isSelected) {
                    clearInterval(bookingPageInterval); 
                    debugClick(tabButton, "By Office Tab");
                    setTimeout(startLocationSearch, 1000); 
                } else {
                    tabButton.style.border = "4px solid green";
                    clearInterval(bookingPageInterval); 
                    startLocationSearch();
                }
            }
        }
    }, 1000); 


    // ==========================================
    // PAGE 4: FILL OPTIONAL DATA & AUTO-TYPE
    // ==========================================

    function startLocationSearch() {
        waitForCSS("input[formcontrolname='officeControl']", (locationInput) => {
            console.log("Step 10: 'By Office' input ready.");

            const fillLocation = () => {
                if (locationInput.value === "") {
                    console.log(`Step 11: Typing location '${userSettings.targetLocation}'...`);
                    locationInput.focus();
                    locationInput.value = userSettings.targetLocation;
                    locationInput.dispatchEvent(new Event('input', { bubbles: true }));
                    locationInput.dispatchEvent(new KeyboardEvent('keyup', { bubbles: true, key: 'a' })); 
                    
                    let attempts = 0;
                    const optionInterval = setInterval(() => {
                        attempts++;
                        const options = document.querySelectorAll('mat-option');
                        if (options.length > 0) {
                            clearInterval(optionInterval);
                            options[0].click();
                        } else if (attempts > 10) {
                            clearInterval(optionInterval);
                        }
                    }, 500);
                }
            };

            const fillDayOfWeekAndLocation = () => {
                if (userSettings.searchDays && userSettings.searchDays.length > 0) {
                    userSettings.searchDays.forEach(day => {
                        const checkboxInput = document.querySelector(`mat-checkbox[name="${day}"] input`);
                        if (checkboxInput && checkboxInput.getAttribute('aria-checked') !== 'true') {
                            const label = document.querySelector(`mat-checkbox[name="${day}"] label`);
                            if (label) label.click();
                        }
                    });
                }
                setTimeout(fillLocation, 500);
            };

            // 1. FILL OPTIONAL DATE (THE CALENDAR CLICKER)
            if (userSettings.searchDate) {
                
                const radioXPath = "//mat-radio-button[.//span[contains(translate(text(), 'ABCDEFGHIJKLMNOPQRSTUVWXYZ', 'abcdefghijklmnopqrstuvwxyz'), 'starting')]]";
                const startingFromRadio = document.evaluate(radioXPath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                
                if (startingFromRadio) {
                    const radioLabel = startingFromRadio.querySelector('label') || startingFromRadio;
                    radioLabel.click();
                }

                // Wait 800ms for Angular to unlock, then click the Calendar Icon
                setTimeout(() => {
                    const calIcon = document.querySelector("button[aria-label='Open calendar']");
                    
                    if (calIcon) {
                        console.log("Opening Calendar Popup...");
                        calIcon.click();
                        
                        // Parse the target date (e.g. "2026-02-25")
                        const parts = userSettings.searchDate.split('-');
                        const tYear = parts[0];
                        const fullMonths = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                        const tMonthFull = fullMonths[parseInt(parts[1], 10) - 1]; // e.g. "February"
                        const tDay = parseInt(parts[2], 10).toString(); // e.g. "25"
                        
                        // Construct the exact aria-label Angular uses: "February 25, 2026"
                        const targetAriaLabel = `${tMonthFull} ${tDay}, ${tYear}`;
                        console.log(`Hunting for cell: ${targetAriaLabel}`);

                        // Navigation loop: Scan for the exact label, click next if missing
                        let safetyCheck = 0;
                        const calendarScanner = setInterval(() => {
                            safetyCheck++;
                            
                            // Try to find the exact day cell
                            const targetCell = document.querySelector(`td[aria-label="${targetAriaLabel}"]`);
                            
                            if (targetCell) {
                                console.log(`Found the exact day! Clicking it.`);
                                clearInterval(calendarScanner);
                                targetCell.click();
                                
                                // Wait for popup to close, then move on
                                setTimeout(fillDayOfWeekAndLocation, 600);
                                
                            } else {
                                // WRONG MONTH - Click the "Next" arrow
                                const nextArrow = document.querySelector(".mat-calendar-next-button");
                                if (nextArrow && !nextArrow.disabled) {
                                    console.log("Date not in view, clicking Next Month...");
                                    nextArrow.click();
                                } else {
                                    console.log("Hit the end of the calendar. Stopping scan.");
                                    clearInterval(calendarScanner);
                                    fillDayOfWeekAndLocation();
                                }
                            }
                            
                            // Failsafe (Checks up to 24 times / 2 years ahead)
                            if (safetyCheck > 24) {
                                clearInterval(calendarScanner);
                                console.log("Calendar scan timeout.");
                                fillDayOfWeekAndLocation();
                            }
                        }, 400); // 400ms to allow Angular sliding animation to finish
                        
                    } else {
                        fillDayOfWeekAndLocation();
                    }
                }, 800);
                
            } else {
                fillDayOfWeekAndLocation();
            }
        });
    }
}); // End of chrome.storage.local.get wrapper