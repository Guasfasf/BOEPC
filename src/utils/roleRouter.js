export function validatenull(component) {
  if (!component && typeof component === String) {
    return false
  } else if (!component) {
    return false
  }
  return true
}
