// Main HTML file
fetch('discover-how.html')
  .then(response => response.text())
  .then(html => {
    document.getElementById('discover-how-container').innerHTML = html;

  });

  fetch("https://your-server.com/apply", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(formData)
})
.then(res => res.json())
.then(data => alert("Application submitted successfully!"))
.catch(err => alert("There was an error. Please try again."));