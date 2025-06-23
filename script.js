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





