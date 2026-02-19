# ICBC Auto-Booking Extension 🚗💨

A Chrome extension designed to automate the ICBC road test booking process, bypassing complex Angular date pickers to hunt for earlier appointments so you don't have to manually refresh the page.

## 💡 Why I Built This

They say the best developers are the lazy ones, and this project is proof. As a Computer Science Master's student busy prepping for IT certifications and interviews, I didn't have the time or patience to sit around manually refreshing the ICBC website every day to hunt for an earlier road test date. 

The ICBC booking portal—especially its stubborn Angular date pickers and multi-page layout—requires entirely too many repetitive clicks. I built this to automate the tedious parts of the process. It handles everything from securely auto-filling credentials to navigating the single-page application, bypassing the strict calendar input masks, and automatically hunting down earlier driving test slots. Why do redundant work when a script can do it faster?

## ✨ Features

* **Automated Login:** Securely stores your license details and keyword locally to instantly blast through the initial authentication screens.
* **Smart Location Routing:** Automatically clicks through to the "By office" tab, types your preferred testing location, and selects it from the dynamic dropdown.
* **Angular Calendar Bypass:** Uses native DOM manipulation and ghost-typing to defeat the strict ICBC calendar locks and select specific target dates.
* **Custom UI:** Features a clean, user-friendly popup interface to manage your search parameters (dates, days of the week, and locations).

## 🛠️ How to Install (Developer Mode)

Because this is a custom automation tool, it is not hosted on the public Chrome Web Store. You will need to load it locally using Developer Mode.

1. **Download or clone** this repository to your local machine.
2. If downloaded as a ZIP, **extract the files** into a dedicated folder. Keep this folder somewhere safe, as Chrome needs continuous access to these files.
3. Open Google Chrome and type `chrome://extensions/` into your address bar.
4. Toggle on **Developer mode** in the top right corner of the page.
5. Click the **Load unpacked** button that appears in the top-left menu.
6. Select the folder that contains your `manifest.json` file.

The custom ICBC icon will now appear in your browser's toolbar!

## 🚀 Usage

1. Click the extension icon in your Chrome toolbar.
2. Fill out your **Driver's Licence Number**, **Issue Date**, and **Security Keyword**.
3. Set your optional search parameters:
   * **Target Office:** (e.g., Burnaby)
   * **Search From Date:** The earliest date you want to look for, or leave blank for any.
   * **Days of Week:** Select specific days, or leave blank for any.
4. Click **Save All Settings**.
5. Click **Book Road test** to launch the ICBC portal. The extension will take over and automate the navigation!

## ⚠️ Disclaimer

This is a personal project built for educational purposes to demonstrate web automation and DOM manipulation. It is not affiliated with or endorsed by ICBC.
