document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('qrButton').addEventListener('click', function() {
        const qrReader = document.getElementById('qr-reader');

        if (qrReader.style.display === 'none' || qrReader.style.display === '') {
            qrReader.style.display = 'block';

            const html5QrCode = new Html5Qrcode("qr-reader");
            html5QrCode.start(
                { facingMode: "environment" }, // Use back camera
                {
                    fps: 10,    // Optional, frame per seconds for qr code scanning
                    qrbox: 250  // Optional, if you want bounded box UI
                },
                qrCodeMessage => {
                    alert(`QR Code detected: ${qrCodeMessage}`);
                    html5QrCode.stop().then(() => {
                        qrReader.style.display = 'none';
                    }).catch(err => {
                        console.error("Failed to stop scanning:", err);
                    });
                },
                errorMessage => {
                    // parse error, ignore it.
                }
            ).catch(err => {
                console.error("Unable to start scanning:", err);
            });
        }
    });
});
