import { useEffect, useState } from 'react'

const Toast = ({ message, type = 'success', duration = 3000, onClose }) => {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, duration)

    return () => clearTimeout(timer)
  }, [duration, onClose])

  if (!isVisible) return null

  const styles = {
    success: {
      border: 'border-white',
      bg: 'bg-black',
      text: 'text-white',
    },
    error: {
      border: 'border-red-500/40',
      bg: 'bg-red-500/10',
      text: 'text-red-300',
    },
  }

  const style = styles[type] || styles.success

  return (
    <div className={`fixed bottom-6 right-6 z-50 rounded-full border  ${style.border} ${style.bg} px-6 py-3 text-[14px] ${style.text} shadow-lg animate-in fade-in slide-in-from-bottom-4 duration-300`}>
      {message}
    </div>
  )
}

export default Toast
