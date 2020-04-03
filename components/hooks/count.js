import {useState, useCallback} from 'react'

export default function useCount(initialValue) {
  const [count, setCount] = useState(initialValue || 0)

  const onChange = useCallback(add => {
    setCount(count => add ? count + 1 : count)
  }, [])

  const resetCount = useCallback(() => {
    setCount(initialValue || 0)
  }, [initialValue])

  return [count, onChange, resetCount]
}
