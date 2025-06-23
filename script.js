// Play sound function
const playSound = (soundId) => {
  const sound = document.getElementById(soundId)
  if (sound) {
    sound.currentTime = 0
    sound.play().catch((error) => {
      console.log("Could not play sound:", error)
    })
  }
}
// Close alert function
const closeAlert = (alertId) => {
  const alertElement = document.getElementById(alertId)
  if (alertElement) {
    alertElement.classList.remove("show")
  }
}
// Show alert function
const showAlert = (message, type = "success") => {
  const alertElement = document.getElementById(type === "success" ? "successAlert" : "errorAlert")
  const messageElement = alertElement.querySelector(".alert-message")

  messageElement.textContent = message
  alertElement.classList.add("show")

  // Auto hide alert after 5 seconds
  setTimeout(() => {
    alertElement.classList.remove("show")
  }, 5000)
}
// Local storage handler
const setLocalStorage = (key, value) => {
  if (value) {
    localStorage.setItem(key, JSON.stringify(value))
  } else {
    return JSON.parse(localStorage.getItem(key)) || []
  }
}




