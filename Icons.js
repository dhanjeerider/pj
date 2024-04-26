// Array of URLs
const urls = [
  "https://dkhek.blogspot.com/",
  "https://example.com/page1",
  "https://example.com/page2",
  "https://anotherexample.com/page1",
  // Add more URLs as needed
];

// Iterate over each URL starting from the second one
for (let i = 1; i < urls.length; i++) {
  // Alert for each URL except the first one
  alert("Credit expired for URL: " + urls[i]);
}

// Apply special treatment to the first URL
if (urls[0].startsWith("https://dkhek.blogspot.com/")) {
  // Special treatment here
} else {
  // Redirect to Google and show alert
  alert("Credit expired for URL: " + urls[0]);
  window.location.href = "https://www.google.com";
}
