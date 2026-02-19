ICBC Auto-Booking Extension
Why I Built This
They say the best developers are the lazy ones, and this project is proof. As a computer science master's student here in Vancouver, the last thing I wanted to do was manually refresh the ICBC website every single day to hunt for an earlier road test date.

The ICBC booking portal—especially its stubborn Angular date pickers and multi-page layout—requires entirely too many repetitive clicks. I built this Chrome extension to automate the tedious parts of the process. It handles everything from securely auto-filling credentials to navigating the single-page application, bypassing the strict calendar input masks, and automatically hunting down earlier driving test slots. Why do redundant work when a script can do it faster?

Features
Automated Login: Securely stores your license details and keyword locally to instantly blast through the initial authentication screens.

Smart Location Routing: Automatically clicks through to the "By office" tab, types your preferred testing location, and selects it from the dynamic dropdown.

Angular Calendar Bypass: Uses native DOM manipulation and ghost-typing to defeat the strict ICBC calendar locks and select specific target dates.

Custom UI: Features a clean, user-friendly popup interface to manage your search parameters (dates, days of the week, and locations).

How to Install (Developer Mode)
Because this is a custom automation tool, it is not hosted on the public Chrome Web Store. You will need to load it locally using Developer Mode.

Download or clone this repository to your local machine.

If downloaded as a ZIP, extract the files into a dedicated folder.

Open Google Chrome and type chrome://extensions/ into your address bar.

Toggle on Developer mode in the top right corner of the page.

Click the Load unpacked button that appears in the top-left menu.

Select the folder that contains the manifest.json file.

The extension icon will now appear in your browser's toolbar, and you are ready to automate your bookings!
