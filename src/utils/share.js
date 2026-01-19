/**
 * Share utilities for Still Basing
 * Allows users to share their achievements on social media
 */

const APP_URL = 'https://alubiama.github.io/StillBASING/'
const APP_NAME = 'Still Basing'

/**
 * Share on Twitter/X
 */
export function shareOnTwitter(clicks, achievements) {
  const text = `I just hit ${clicks} clicks on Still Basing! 🎮\n\nUnlocked ${achievements} achievements on Base blockchain 🔵\n\nCan you beat my score?`
  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(APP_URL)}`

  window.open(url, '_blank', 'width=550,height=420')
}

/**
 * Share on Farcaster
 */
export function shareOnFarcaster(clicks, achievements) {
  const text = `I just hit ${clicks} clicks on Still Basing! 🎮 Unlocked ${achievements} achievements on Base 🔵`
  const url = `https://warpcast.com/~/compose?text=${encodeURIComponent(text)}&embeds[]=${encodeURIComponent(APP_URL)}`

  window.open(url, '_blank', 'width=550,height=600')
}

/**
 * Share using Web Share API (if available)
 */
export async function shareNative(clicks, achievements) {
  if (!navigator.share) {
    console.info('Native share not supported, falling back to Twitter')
    shareOnTwitter(clicks, achievements)
    return
  }

  try {
    await navigator.share({
      title: APP_NAME,
      text: `I just hit ${clicks} clicks on Still Basing! Unlocked ${achievements} achievements on Base blockchain 🔵`,
      url: APP_URL,
    })
    console.log('Shared successfully')
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('Error sharing:', error)
    }
  }
}

/**
 * Copy share link to clipboard
 */
export async function copyShareLink(clicks, achievements) {
  const text = `I just hit ${clicks} clicks on Still Basing! Check it out: ${APP_URL}`

  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy:', error)
    return false
  }
}

/**
 * Get shareable text for a specific achievement
 */
export function getAchievementShareText(milestone) {
  const messages = {
    10: "Just unlocked my first achievement! 🎯",
    50: "50 clicks milestone reached! Getting warmed up 🔥",
    100: "Century club! 💯 This is getting addictive",
    500: "Power user status unlocked! ⚡ Half way to legendary",
    1000: "LEGENDARY! 👑 1000 clicks on Still Basing!"
  }

  return messages[milestone] || `${milestone} clicks milestone reached!`
}

/**
 * Share achievement unlock
 */
export function shareAchievement(milestone) {
  const achievementText = getAchievementShareText(milestone)
  const text = `${achievementText}\n\nPlaying Still Basing on Base 🔵\n\n${APP_URL}`

  const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`
  window.open(url, '_blank', 'width=550,height=420')
}
