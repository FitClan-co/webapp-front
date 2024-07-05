document.addEventListener('DOMContentLoaded', function() {
    const token = localStorage.getItem('token');
    const qrButton = document.getElementById('qrButton');
console.log(token)
    if (!token) {
        qrButton.style.display = 'none';
    } else {
        try {
            const decodedToken = jwt_decode(token);
            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds

            if (decodedToken.exp < currentTime) {
                // Token is expired
                localStorage.removeItem('token');
                window.location.href = 'login.html'; // Redirect to login page
            } else {
                // Fetch user profile using user ID from the token
                fetchUserProfile(decodedToken.id, token)
                    .then(userProfile => {
                        if (userProfile.isSubscribedWeb) {
                            qrButton.style.display = '';
                            
                        } else {
                            qrButton.style.display = 'none';
                        }
                    })
                    .catch(error => {
                        console.error('Error fetching user profile:', error);
                        qrButton.style.display = 'none';
                    });
            }
        } catch (error) {
            console.error('Error decoding token:', error);
            qrButton.style.display = 'none';
        }
    }

});

qrButton.addEventListener('click', function() {
    window.location.href = 'qrscan.html';})

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
