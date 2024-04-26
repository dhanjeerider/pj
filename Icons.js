// Array of URLs
const urls = [
  "https://dkhek.blogspot.com",
  "https://124x.blogspot.com",
  "https://example.com/page2",
  "https://anotherexample.com/page1",
  // Add more URLs as needed
];

// Function to check if script tag exists on a webpage
async function scriptExists(url) {
  try {
    const response = await fetch(url);
    const text = await response.text();
    return text.includes("<script>"); // Modify this to match the script tag
  } catch (error) {
    console.error("Error checking script:", error);
    return false;
  }
}

// Check if any URL contains the script tag
async function checkScript() {
  const scriptFound = await Promise.all(urls.map(scriptExists));
  return scriptFound.some(found => found);
}

// Main function to handle URLs
async function handleURLs() {
  const scriptExists = await checkScript();
  if (scriptExists) {
    // Open the first URL normally
    window.open(urls[0]);
  } else {
    // Show alert and disable display of #man's ID
    alert("Your license has expired.");
    // Disable display of #man's ID here
  }
}

// Call the main function
handleURLs();
