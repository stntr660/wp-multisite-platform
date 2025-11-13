import { useEffect, useState } from 'react'

const useKeyboardShortcutKey = (ref) => {
  const [isFocused, setFocus] = useState(false)

  useEffect(() => {
    const handleFocus = () => {
      setFocus(true)
    }

    const handleBlur = () => {
      setFocus(false)
    }

    const currentRef = ref.current

    if (currentRef) {
      currentRef.addEventListener('focus', handleFocus)
      currentRef.addEventListener('blur', handleBlur)

      return () => {
        currentRef.removeEventListener('focus', handleFocus)
        currentRef.removeEventListener('blur', handleBlur)
      }
    }
  }, [ref])

  return isFocused
}

export default useKeyboardShortcutKey
