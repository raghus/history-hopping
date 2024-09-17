document.addEventListener('DOMContentLoaded', function() {
    const odometer = new Odometer({
        el: document.querySelector('#odometer'),
        value: '0000',
        theme: 'train-station',
        format: '(,ddd)',  // This format will prevent the comma after the thousandth place
        duration: 1000  // Set animation duration to 1 second (1000 milliseconds)
    });

    function generateRandomNumber() {
        return Math.floor(Math.random() * (2024 - 1000 + 1)) + 1000; // Generates a number between 1000 and 2024
    }

    function padNumber(number) {
        return number.toString().padStart(4, '0');
    }

    function fetchEventsForYear(year) {
        const apiUrl = `https://api.api-ninjas.com/v1/historicalevents?year=${year}`;
        fetch(apiUrl, {
            headers: {
                'X-Api-Key': 'xWwHgVkUjB46xJStinp04A==8z92ju1hvW1CFHQ1'
            }
        })
        .then(response => response.json())
        .then(data => {
            const events = data.slice(0, 6); // Get up to 6 events
            displayEvents(year, events);
        })
        .catch(error => {
            console.error('Error fetching events:', error);
            displayNoEvents(year);
        });
    }

    function displayEvents(year, events) {
        const eventsContainer = document.getElementById('events');
        eventsContainer.innerHTML = '';
        
        if (events.length === 0) {
            displayNoEvents(year);
            return;
        }
        
        console.log(`Events in the year ${year}:`);
        events.forEach((event, index) => {
            console.log(`${index + 1}. ${event.event}`);
            
            const eventDiv = document.createElement('div');
            eventDiv.className = 'event';
            eventDiv.textContent = event.event;
            eventDiv.style.opacity = '0';
            eventDiv.style.transform = 'translateY(20px)';
            eventDiv.style.transition = 'opacity 0.5s, transform 0.5s';
            eventsContainer.appendChild(eventDiv);
            
            setTimeout(() => {
                eventDiv.style.opacity = '1';
                eventDiv.style.transform = 'translateY(0)';
            }, 250 * index);
        });
    }

    function displayNoEvents(year) {
        const eventsContainer = document.getElementById('events');
        eventsContainer.innerHTML = '';
        
        const noEventsMessage = document.createElement('div');
        noEventsMessage.className = 'no-events';
        noEventsMessage.textContent = `Sorry, we found no events in the year ${year}.`;
        noEventsMessage.style.opacity = '0';
        noEventsMessage.style.transform = 'translateY(20px)';
        noEventsMessage.style.transition = 'opacity 0.5s, transform 0.5s';
        eventsContainer.appendChild(noEventsMessage);
        
        setTimeout(() => {
            noEventsMessage.style.opacity = '1';
            noEventsMessage.style.transform = 'translateY(0)';
        }, 250);
        
        console.log(`No events found for the year ${year}.`);
    }

    function updateOdometer() {
        // Immediately clear the events container
        const eventsContainer = document.getElementById('events');
        eventsContainer.innerHTML = '';

        const randomNumber = generateRandomNumber();
        odometer.update(padNumber(randomNumber));
        
        // Wait for the odometer animation to complete before fetching events
        setTimeout(() => {
            fetchEventsForYear(randomNumber);
        }, 1000); // 1000ms = 1s, matching the odometer animation duration
    }

    // Generate initial random number and fetch events
    updateOdometer();

    // Add click event listener to the button
    document.querySelector('#generateBtn').addEventListener('click', updateOdometer);
});