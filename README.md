# Random string generator🔒

Generates a random string of a specified length using JavaScript.<br>
(Sorry, HTML content is written in Japanese. 🙇‍♂️)

## How to use🤔
This project is hosted on GitHub Pages.<br>
[GitHub Pages](https://ennacx.github.io/pwdgen/)

### 1. Determining the length of a string
First, enter the length of the text you want to output.<br>
You can enter the length in the form or adjust it with the slider.

The length can currently be between 4 and 256 characters.

### 2. Determining the character type
You can select multiple character types below. You cannot leave all character types unselected.

- ```大文字```
  - Upper case alphabet
- ```小文字```
  - Lower case alphabet
- ```数字```
  - Numeric
- ```記号```
  - If you check this box, a list of symbols that can be used will be displayed.
  - If there is a symbol you do not want to use, enter it in the form that appears.
- ```16進数```
  - Only hexadecimal digits between ```0``` and ```F``` are allowed.
  - **This character type is exclusive with other character types.**
  - If you select Hexadecimal, you cannot select the "```紛らわしい文字種は使用しない```" option.

### 3. If you want to set generation conditions
You can currently set two conditions.

- ```文字は重複させない```
  - Prevents duplicate characters from being generated.
  - **If you turn this on, please note that the number of characters that can be generated will be limited to the selected string type.**
- ```紛らわしい文字種は使用しない```
  - Avoid character types that are visually confusing when generated.
  - \[Info\] A list of confusing characters is provided next to the label.

### 4. Determining on the generation algorithm
You can determine between algorithm ```Crypt``` or ```Math```.

- Crypt
  - It uses a more secure encryption algorithm and is the preferred choice if you are using it for passwords.
  - However, some browser versions may not support this and will display a notification message if this is the case.
- Math
  - The random string generated is generated using a less secure algorithm, so it is not suitable for use as a password.

### 5. Generate
Once you set the generation conditions and click a colored button, a random string that matches the conditions will be instantly output.<br>
If the settings are incorrect, an error message will be displayed.

A password will be generated each time you click the button, so feel free to create as many passwords as you like.😘

### ex. Bulk generate
Only one colored button will be generated each time you click it, but multiple buttons with a blue frame at the bottom can be created at once.

Currently, it supports simultaneous generation of 100, 1000, and 10000.<br>
(This process runs within your browser and does not affect the hosting server, but it may cause your browser to stop working, so use it with caution.🤪)

## Disclaimer🥺
できるだけ複雑なランダム文字列を生成するように努めていますが、使用に際しては自己責任でお願いいたします。<br>
We try to generate as complex random strings as possible, but use at your own risk.

万が一、本ツールの使用によりトラブルが発生した場合でも、私たちは一切の責任を負いません。<br>
In the unlikely event that any trouble occurs as a result of using this tool, we will not be held responsible in any way.

## License🧐
[MIT](https://en.wikipedia.org/wiki/MIT_License)

[CreativeCommons BY-SA](https://creativecommons.org/licenses/by-sa/4.0/)