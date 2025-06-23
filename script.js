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




