// public/script.js
document.getElementById('passForm').addEventListener('submit', async function (event) {
    event.preventDefault();
  
    const userName = document.getElementById('userName').value;
    const coPay = document.getElementById('coPay').value;
  
    const response = await fetch('/generatePass', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userName, coPay }),
    });
  
    const passData = await response.json();
    window.location.href = passData.passUrl;
  });
  