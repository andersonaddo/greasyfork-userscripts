// ==UserScript==
// @name         "Ship It" GIF button for Github Review
// @namespace    happyviking
// @version      1.0.0
// @grant        none
// @license      MIT
// @description  Adds a button to Github to add "Let's ship it!" GIFs when reviewing PRs
// @icon         https://www.sail.nl/app/uploads/2019/11/ATYLA-Picture-of-the-ship-and-crew-1.jpg
// @author       HappyViking
// @grant        none
// @match        https://github.com/*/pull/*
// ==/UserScript==

const main = () => {
  const feedbackModal = document.getElementById("review-changes-modal")
  if (!feedbackModal) return
  const buttonPanelQuery = feedbackModal.getElementsByClassName("form-actions")
  if (buttonPanelQuery.length == 0) return;
  const buttonPanel = buttonPanelQuery[0]


  const newButton = document.createElement("button")
  buttonPanel.prepend(newButton)
  //Copying from the existing "submit" button
  //But if you want you can also look into more styles from:
  //https://github.githubassets.com/assets/primer-8f43f7721dc7.css
  //though I think the suffix to "primer" might change by the time you read this
  newButton.classList = "Button--primary Button--small Button float-left mr-1" 
  const buttonContentHolder = document.createElement("span")
  buttonContentHolder.className = "Button-content"
  newButton.append(buttonContentHolder)
  const buttonLabel = document.createElement("span")
  buttonLabel.className = "Button-label"
  buttonContentHolder.append(buttonLabel)
  buttonLabel.innerHTML = "Ship that shit"

  const theme = window.getComputedStyle(newButton).getPropertyValue("color-scheme"); //Cant just access via "style" because it's passed down to the button; it's not inline
  if (theme == "light"){
    newButton.style.backgroundImage="linear-gradient(319deg, rgba(255,126,1,1) 8%, rgba(229,110,21,1) 40%, rgba(179,52,4,1) 81%)"
  }else{
    newButton.style.backgroundImage="linear-gradient(0deg, rgba(212,74,38,1) 0%, rgba(254,128,13,1) 100%)"
  }

  const template = document.createElement('template'); //<template /> is specifically meant for string->html logic
  //Taken fron https://tabler-icons.io/i/sailboat and slightly modified (no color information so github will take care of that)
  template.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
  <path stroke="none" d="M0 0h24v24H0z" fill="none"></path>
  <path d="M2 20a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1a2.4 2.4 0 0 1 2 -1a2.4 2.4 0 0 1 2 1a2.4 2.4 0 0 0 2 1a2.4 2.4 0 0 0 2 -1"></path>
  <path d="M4 18l-1 -3h18l-1 3"></path>
  <path d="M11 12h7l-7 -9v9"></path>
  <path d="M8 7l-2 5"></path>
  </svg>`

  const buttonIcon = template.content.firstChild;
  buttonIcon.className="Button--visual"
  newButton.append(buttonIcon)

  newButton.addEventListener("click", () => {
    const textarea = feedbackModal.querySelector("#pull_request_review_body")
    textarea.value += `\n\n<img src="https://i.shipit.today" height=100/>\n<sup>Let's ship it! <a href="https://shipit.today/">Img source.<a/></sup>`
  })
}

main()

