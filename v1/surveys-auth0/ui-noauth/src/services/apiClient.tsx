export const callApi = async (serverUrl, options) => {
  try {
    const response = await fetch(serverUrl, {
      ...options,
    })
    return response
  } catch (error) {
    return error.message
  }
}
