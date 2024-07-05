document.addEventListener('DOMContentLoaded', function () {
    const token = localStorage.getItem('token');
  
    if (!token) {
      window.location.href = 'index.html';
    } else {
      try {
        const decodedToken = jwt_decode(token);
        const currentTime = Math.floor(Date.now() / 1000);
  
        if (decodedToken.exp < currentTime) {
          localStorage.removeItem('token');
          window.location.href = 'login.html';
        } else {
          fetchUserProfile(decodedToken.id, token)
            .then(userProfile => {
              if (!userProfile.isSubscribedWeb) {
                window.location.href = 'index.html';
              } else {
                startQrCodeScanning();
              }
            })
            .catch(error => {
              console.error('Error fetching user profile:', error);
              window.location.href = 'index.html';
            });
        }
      } catch (error) {
        console.error('Error decoding token:', error);
        window.location.href = 'index.html';
      }
    }
  });
  
  function fetchUserProfile(userId, token) {
    return fetch(`http://localhost:3000/user/profile/${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    })
    .then(response => response.json())
    .then(data => {
      if (!data.id) {
        throw new Error('User profile not found');
      }
      return data;
    });
  }
  
  function startQrCodeScanning() {
    const qrReader = document.getElementById('qr-reader');
    const html5QrCode = new Html5Qrcode("qr-reader");
  
    html5QrCode.start(
      { facingMode: "environment" },
      {
        fps: 10,
        qrbox: { width: 250, height: 250 }
      },
      qrCodeMessage => {
        alert(`QR Code detected: ${qrCodeMessage}`);
        html5QrCode.stop().then(() => {
          checkInWeb(qrCodeMessage);
        }).catch(err => {
          console.error("Failed to stop scanning:", err);
        });
      },
      errorMessage => {}
    ).catch(err => {
      console.error("Unable to start scanning:", err);
    });
  }
  
  function checkInWeb(gymId) {
    const token = localStorage.getItem('token');

    fetch('http://localhost:3000/user/checkInWeb', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ gymId })
    })
    .then(response => response.json())
    .then(data => {
        if (data.message.checkedIn) {
            const createdAt = new Date(data.message.createdAt);
            const date = createdAt.toLocaleDateString();
            const time = createdAt.toLocaleTimeString();
            alert(`Check-in successful\nDate: ${date}\nTime: ${time}\nUser ID: ${data.message.userId}`);
        } else {
            alert('Check-in failed: ' + (data.message.reason || 'Unknown error'));
        }
    })
    .catch(error => {
        console.error('Error during check-in:', error);
        alert('Check-in failed: ' + error.message);
    });
}
