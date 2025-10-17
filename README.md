# Random string generator 🔒

Generates a random string of a specified length using JavaScript.  
(Sorry, HTML content is written in Japanese. 🙇‍♂️)

---

## Features✨
- **Secure generation** — When using the `Crypt` algorithm, strings are generated using a cryptographically strong random number generator provided by the browser (`crypto.getRandomValues`).  
  This makes it safe to use for password creation and similar security-sensitive purposes.
- **Offline support** — Once the page has been loaded online, it can be used offline as a Progressive Web App (PWA).  
  The necessary scripts and resources are cached locally via Service Worker, so you can continue generating passwords even without a network connection.
- **Client-side only** — All processing is done within your browser. No data or generated strings are sent to any server.

---

## How to use 🤔
This project is hosted on GitHub Pages.  
[GitHub Pages](https://ennacx.github.io/pwdgen/)

### 1. Determining the length of a string
Enter the desired string length or adjust it with the slider.

(Currently supports 4 – 256 characters.)

### 2. Determining the character type
You can select multiple character types; at least one must be checked.

- `大文字` – Uppercase alphabet  
- `小文字` – Lowercase alphabet  
- `数字` – Numeric  
- `記号` – If checked, a list of usable symbols will appear.  
  Symbols you do **not** want to use can be specified in the input field.  
- `16進数` – Hexadecimal digits `0–F`.  
  **Exclusive** with other character types.  
- `UUID` – Conforms to UUID v4 and requires an environment that supports the `Crypt` algorithm.  
  **Exclusive** with all other choices.

### 3. Additional options
- `文字は重複させない` – Prevents duplicate characters.  
  Be aware that the available length is limited by the chosen character set.  
- `紛らわしい文字種は使用しない` – Avoids visually confusing characters (list provided next to the label).

### 4. Algorithm selection
Choose between `Crypt` or `Math`.

- **Crypt** – Uses a secure, cryptographically strong random number generator (`crypto.getRandomValues`).  
  Recommended for passwords and UUIDs.  
- **Math** – Uses `Math.random()`, which is weaker and not suitable for security-critical use.

### 5. Generate
Click the colored button to instantly output a random string matching your conditions.  
Each click produces a new result—generate as many as you like! 😘

### ex. Bulk generation
The default button creates one string at a time, but you can generate multiple (100 / 1000 / 10000) at once.  
Processing is fully client-side; it will not burden the hosting server, though excessive generation may temporarily freeze your browser. 🤪

---

## Disclaimer 🥺
We strive to generate random strings that are as difficult to reproduce as possible, but please use at your own risk.  
We assume no responsibility for any trouble or loss resulting from the use of this tool.

---

## License 🧐
[MIT](https://en.wikipedia.org/wiki/MIT_License)  
[Creative Commons BY-SA](https://creativecommons.org/licenses/by-sa/4.0/)
