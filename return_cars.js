function returnCars(){
    const rentalIdInput=document.getElementById('rentalIdInput').value;
    const rentalDetails=document.getElementById('rentalDetails');
    const resultMessage=document.getElementById('resultMessage');

    if(!rentalIdInput){
        alert('Please enter a Rental ID');
        return;
    }

    const allRentals=JSON.parse(localStorage.getItem('carRentals')) || [];
    
    const rental=allRentals.find(function(r){
        return r.rentalId == rentalIdInput && r.status === 'active';
    });

    if(rental){
        const today=new Date();
        const dueDate=new Date(rental.rentalDetails.endDate);
        const daysLate=Math.max(0, Math.ceil((today-dueDate)/(1000*3600*24)));
        const lateFee = daysLate > 0 ? daysLate * (rental.carPrice * 0.2) : 0;

        document.getElementById('carName').textContent=rental.car;
        document.getElementById('custName').textContent=rental.customer.fullName;
        document.getElementById('startDate').textContent=formatDate(rental.rentalDetails.startDate);
        document.getElementById('dueDate').textContent=formatDate(rental.rentalDetails.endDate);
        document.getElementById('totalCost').textContent=`$${rental.rentalDetails.totalCost}`;
        document.getElementById('lateFee').textContent=lateFee>0 ? `$${lateFee} (${daysLate} days late)`: 'No late fee';

        rentalDetails.dataset.rentalId=rentalIdInput;
        rentalDetails.dataset.lateFee=lateFee;

        rentalDetails.classList.remove('hidden');
        resultMessage.classList.add('hidden');
    } else{
        resultMessage.textContent='Rental ID not found or car already returned!';
        resultMessage.style.backgroundColor='#ffebee';
        resultMessage.style.color='#c62828';
        resultMessage.classList.remove('hidden');
        rentalDetails.classList.add('hidden');
    }
        
}

function confirmbtn(){
    const rentalDetails=document.getElementById('rentalDetails');
    const resultMessage=document.getElementById('resultMessage');
    const rentalId=rentalDetails.dataset.rentalId;
    const lateFee=parseFloat(rentalDetails.dataset.lateFee);

    const allRentals=JSON.parse(localStorage.getItem('carRentals')) || [];

    const rentalIndex=allRentals.findIndex(function(r){
        return r.rentalId==rentalId && r.status==='active'
    });

    if(rentalIndex !==-1){
        allRentals[rentalIndex].status='returned';
        allRentals[rentalIndex].returnDate=new Date().toISOString();
        allRentals[rentalIndex].lateFee=lateFee;

        localStorage.setItem('carRentals', JSON.stringify(allRentals));

        const totalPaid=allRentals[rentalIndex].rentalDetails.totalCost+lateFee;

        resultMessage.textContent=`Car returned successfully! Total amount paid: $${totalPaid}`;
        resultMessage.style.backgroundColor = '#e8f5e8';
        resultMessage.style.color = '#2e7d32';
        resultMessage.classList.remove('hidden');

        rentalDetails.classList.add('hiiden');

        document.getElementById('rentalIdInput').value='';
    }
}

function formatDate(dateString){
    const date=new Date(dateString);
    return date.toLocaleDateString('en-US',{
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

document.getElementById('rentalIdInput').addEventListener('keypress', function(e){
    if (e.key==='Enter'){
        returnCars()
    }
});



window.addEventListener('DOMContentLoaded', function() {
    const savedId = localStorage.getItem('autoFillReturnId');
    if (savedId && document.getElementById('rentalIdInput')) {
        document.getElementById('rentalIdInput').value = savedId;
        localStorage.removeItem('autoFillReturnId'); 
    }
});
