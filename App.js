import React, { Component } from "react";
import { SafeAreaView } from "react-native";
import { WebView } from "react-native-webview";

const selectProgrammingLanguage = () => {
  const languages = [
    "Rust",
    "Python",
    "JavaScript",
    "TypeScript",
    "C++",
    "Go",
    "R",
    "Java",
    "PHP",
    "Kotlin",
  ];
  const randomInt = Math.floor(Math.random() * languages.length);
  return languages[randomInt];
};

export default class App extends Component {
  render() {
    const runBeforeFirst = `
    window.isNativeApp = true;
    true; // note: this is required, or you'll sometimes get silent failures
  `;

    const runFirst = `
      setTimeout(function() { 
          window.alert("Click me!");
          document.getElementById("h1_element").innerHTML = "What is your favourite language?";
          document.getElementById("h2_element").innerHTML = "We will see!";
        }, 1000);
      true; // note: this is required, or you'll sometimes get silent failures
    `;

    let counter = 1;
    const script = () => {
      const selectedLanguage = selectProgrammingLanguage();
      counter += 1;

      const newURL = "https://blog.logrocket.com";
      const redirectTo = 'window.location = "' + newURL + '"';

      if (counter <= 10) {
        return `
          if (document.body.style.backgroundColor === 'white') {
            document.body.style.backgroundColor = 'black'
            document.body.style.color = 'white'
          } else {
            document.body.style.backgroundColor = 'white'
            document.body.style.color = 'black'
          };
          
          document.getElementById("h2_element").innerHTML = "${selectedLanguage}?";

          window.ReactNativeWebView.postMessage("counter: ${counter}");

          true;  // note: this is required, or you'll sometimes get silent failures
      `;
      } else if (counter === 11) {
        return `
          window.ReactNativeWebView.postMessage("you are now getting redirected!");
          ${redirectTo};
          true;  // note: this is required, or you'll sometimes get silent failures
        `;
      } else {
        return null;
      }
    };

    setInterval(() => {
      this.webref.injectJavaScript(script());
    }, 2000);

    const customHTML = `
      <body style="display:flex; flex-direction: column;justify-content: center; align-items:center; background-color: black; color:white; height: 100%;">
          <h1 style="font-size:100px; padding: 50px; text-align: center;" id="h1_element">
            This is simple html
          </h1>
          <h2 style="display: block; font-size:80px; padding: 50px; text-align: center;" id="h2_element">
            This text will be changed later!
          </h2>
      </body>`;

    return (
      <WebView
        ref={(r) => (this.webref = r)}
        source={{ html: customHTML }}
        onMessage={(event) => {
          console.log(event.nativeEvent.data);
        }}
        injectedJavaScript={runFirst}
        injectedJavaScriptBeforeContentLoaded={runBeforeFirst}
      />
    );
  }
}
