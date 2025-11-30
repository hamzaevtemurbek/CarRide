const user = getCurrentUser();
if (!user) {
    alert("Please login first!");
    window.location.href = "login.html";
} else {
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userEmail').textContent = user.email;

    const allRentals = JSON.parse(localStorage.getItem('carRentals') || '[]');
    const myRentals = allRentals.filter(function (r) {  //filter loops for every element and return only the true one
        return (
            (r.customer && r.customer.email === user.email) || // it return new array
            (r.userEmail === user.email)
        );
    });

    document.getElementById('totalRentals').textContent = myRentals.length;

    if (myRentals.length > 0){
        document.getElementById('myRentals').innerHTML = myRentals.map(function (r) {
            return `
                            <div class="rental-card">
                                <img src="${r.carImage}" alt="${r.car}">
                                <div class="info">
                                    <h3>${r.car}</h3>
                                    <p>From: ${r.rentalDetails?.startDate || r.startDate}</p>
                                    <p>To: ${r.rentalDetails?.endDate || r.endDate}</p>
                                    <p>Pick-up: ${r.rentalDetails?.pickUpLocation || r.pickUpLocation}</p>
                                    <p>Drop-off: ${r.rentalDetails?.dropOffLocation || r.dropOffLocation}</p>
                                    <p>Rental ID: ${r.rentalId}</p>
                                    <p>Total: $${r.rentalDetails?.totalCost || r.totalPrice}</p>
                                    <span class="status ${r.status === 'active' ? 'active' : 'returned'}">
                                        ${r.status === 'active' ? 'Active' : 'Returned'}
                                    </span>
    
                                    ${r.status==='active'? `<button onclick="goToReturn('${r.rentalId}')">Return Car</button>` : ''}
                                
                                </div>
                            </div>`;
        }).join('');
    }
}

function logout() {
    localStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

function goToReturn(rentalId) {
    localStorage.setItem('autoFillReturnId', rentalId);
    window.location.href = "return_cars.html";
}