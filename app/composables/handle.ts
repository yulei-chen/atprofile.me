export function useHandle() {
  const handle = useState<string>('handle', () => '')

  function setHandle(newHandle: string) {
    handle.value = newHandle
  }

  return {
    handle,
    setHandle,
  }
}
