let timer;
let seconds = 0;
let isRunning = false;
const timerButton = document.getElementById('timerButton');
const timerDisplay = document.querySelector('.timer-display');
const workNotes = document.getElementById('workNotes');
const workTag = document.getElementById('workTag');
const addNewTag = document.getElementById('addNewTag');
const newTagInput = document.getElementById('newTagInput');
const customTag = document.getElementById('customTag');
const saveNewTag = document.getElementById('saveNewTag');
const saveNotes = document.getElementById('saveNotes');
const currentTime = document.getElementById('currentTime');
const historyList = document.getElementById('historyList');
const timelineBar = document.getElementById('timelineBar');

// Store custom tags
let customTags = [];

// Update current time every second
function updateCurrentTime() {
    const now = new Date();
    currentTime.textContent = now.toLocaleTimeString();
}
setInterval(updateCurrentTime, 1000);
updateCurrentTime();

// DOM elements for statistics
const categoryStats = document.getElementById('categoryStats');
const recentStats = document.getElementById('recentStats');

// Load history and custom tags on page load
document.addEventListener('DOMContentLoaded', () => {
    loadHistory();
    loadCustomTags();
    // Hide the note dialog initially
    document.getElementById('noteDialog').classList.add('d-none');
    
    // Add event listeners for tag functionality
    addNewTag.addEventListener('click', () => {
        newTagInput.classList.toggle('d-none');
        if (!newTagInput.classList.contains('d-none')) {
            customTag.focus();
        }
    });
    
    saveNewTag.addEventListener('click', saveCustomTag);
    
    customTag.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            saveCustomTag();
        }
    });
});

// Save custom tag
function saveCustomTag() {
    const newTag = customTag.value.trim();
    if (newTag) {
        // Add to custom tags array if not already present
        if (!customTags.includes(newTag)) {
            customTags.push(newTag);
            
            // Add to dropdown
            const option = document.createElement('option');
            option.value = newTag;
            option.textContent = newTag;
            workTag.appendChild(option);
            
            // Save custom tags to localStorage
            localStorage.setItem('customTags', JSON.stringify(customTags));
            
            // Select the new tag
            workTag.value = newTag;
            
            // Hide the input
            newTagInput.classList.add('d-none');
            customTag.value = '';
            
            showToast(`Added new category: ${newTag}`, true);
        } else {
            showToast('This category already exists', false);
        }
    } else {
        showToast('Please enter a category name', false);
    }
}

// Load custom tags from localStorage
function loadCustomTags() {
    const savedTags = localStorage.getItem('customTags');
    if (savedTags) {
        customTags = JSON.parse(savedTags);
        
        // Add custom tags to dropdown
        customTags.forEach(tag => {
            const option = document.createElement('option');
            option.value = tag;
            option.textContent = tag;
            workTag.appendChild(option);
        });
    }
}

function startTimer() {
    isRunning = true;
    timerButton.innerHTML = '<i class="fas fa-stop me-2"></i>Stop';
    timerButton.classList.remove('btn-primary');
    timerButton.classList.add('btn-danger');
    timerDisplay.classList.add('timer-active');
    timer = setInterval(updateTimer, 1000);
    // Hide note dialog when starting timer
    document.getElementById('noteDialog').classList.add('d-none');
    
    // Add pulse animation to timer display
    timerDisplay.style.animation = 'pulse 1s infinite';
}

function stopTimer() {
    isRunning = false;
    timerButton.innerHTML = '<i class="fas fa-play me-2"></i>Start';
    timerButton.classList.remove('btn-danger');
    timerButton.classList.add('btn-primary');
    timerDisplay.classList.remove('timer-active');
    clearInterval(timer);
    // Show note dialog when stopping timer
    document.getElementById('noteDialog').classList.remove('d-none');
    
    // Remove pulse animation
    timerDisplay.style.animation = '';
}

function updateTimer() {
    seconds++;
    timerDisplay.textContent = formatTime(seconds);
}

function formatTime(totalSeconds) {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    
    return [
        hours.toString().padStart(2, '0'),
        minutes.toString().padStart(2, '0'),
        secs.toString().padStart(2, '0')
    ].join(':');
}

// Timer button click handler
timerButton.addEventListener('click', () => {
    if (!isRunning) {
        startTimer();
    } else {
        stopTimer();
    }
});

// Save button click handler
saveNotes.addEventListener('click', () => {
    const notes = workNotes.value.trim();
    const tag = workTag.value;
    
    if (!notes) {
        showToast('Please enter work notes before saving.', false);
        return;
    }
    
    if (!tag) {
        showToast('Please select or add a work category.', false);
        return;
    }
    
    saveSession(seconds, notes, tag);
    workNotes.value = '';
    workTag.value = '';
    seconds = 0;
    timerDisplay.textContent = '00:00:00';
    document.getElementById('noteDialog').classList.add('d-none');
});

// Show toast notification
function showToast(message, isSuccess) {
    console.log('Showing toast:', message);
    
    const toastEl = document.getElementById('saveToast');
    const toastMessage = document.getElementById('toastMessage');
    
    if (!toastEl || !toastMessage) {
        console.error('Toast elements not found');
        alert(message);
        return;
    }
    
    try {
        // Set message and styling
        toastMessage.textContent = message;
        toastMessage.className = isSuccess ? 'toast-body bg-success text-white' : 'toast-body bg-danger text-white';
        
        // Show toast using Bootstrap
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
        
    } catch (error) {
        console.error('Error showing toast:', error);
        alert(message);
    }
}

// Save session data to server
function saveSession(duration, notes, tag) {
    console.log('Attempting to save session...');
    const data = {
        duration: duration,
        notes: notes,
        tag: tag,
        timestamp: new Date().toISOString()
    };

    fetch('save_session.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    .then(response => {
        console.log('Save response received');
        return response.json();
    })
    .then(data => {
        console.log('Save success:', data);
        showToast('Work session saved successfully!', true);
        loadHistory();
    })
    .catch((error) => {
        console.error('Save error:', error);
        showToast('Error saving work session. Please try again.', false);
    });
}

// Load and display history
function loadHistory() {
    fetch('get_history.php')
    .then(response => response.json())
    .then(sessions => {
        historyList.innerHTML = '';
        if (sessions.length === 0) {
            historyList.innerHTML = '<div class="list-group-item text-center py-4"><i class="fas fa-hourglass-empty me-2 fs-4"></i><br>No work sessions recorded yet</div>';
            renderTimeline([]);
            categoryStats.innerHTML = '<div class="text-center py-4 text-muted"><i class="fas fa-hourglass-start fs-4 mb-2"></i><p>No data available yet</p></div>';
            recentStats.innerHTML = '<div class="text-center py-4 text-muted"><i class="fas fa-hourglass-start fs-4 mb-2"></i><p>No data available yet</p></div>';
            return;
        }
        
        // Update statistics
        updateCategoryStats(sessions);
        updateRecentStats(sessions);
        
        // Group sessions by tag
        const sessionsByTag = groupSessionsByTag(sessions);
        
        // Create accordion for grouped sessions
        const accordion = document.createElement('div');
        accordion.className = 'accordion';
        accordion.id = 'historyAccordion';
        
        // Track if this is the first group (to keep it open by default)
        let isFirst = true;
        
        // Create a group for each tag
        Object.keys(sessionsByTag).forEach((tag, index) => {
            const tagSessions = sessionsByTag[tag];
            const tagColor = getTagColor(tag);
            
            // Create accordion item
            const accordionItem = document.createElement('div');
            accordionItem.className = 'accordion-item border-0 mb-3';
            
            // Create accordion header
            const headerId = `heading${index}`;
            const accordionHeader = document.createElement('h2');
            accordionHeader.className = 'accordion-header';
            accordionHeader.id = headerId;
            
            // Create accordion button
            const accordionButton = document.createElement('button');
            accordionButton.className = `accordion-button ${isFirst ? '' : 'collapsed'}`;
            accordionButton.type = 'button';
            accordionButton.setAttribute('data-bs-toggle', 'collapse');
            accordionButton.setAttribute('data-bs-target', `#collapse${index}`);
            accordionButton.setAttribute('aria-expanded', isFirst ? 'true' : 'false');
            accordionButton.setAttribute('aria-controls', `collapse${index}`);
            
            // Add tag badge and count
            accordionButton.innerHTML = `
                <div class="d-flex w-100 justify-content-between align-items-center">
                    <span>
                        <span class="badge me-2" style="background-color: ${tagColor}">
                            <i class="fas fa-tag me-1"></i>${tag}
                        </span>
                    </span>
                    <span class="badge bg-secondary">${tagSessions.length} sessions</span>
                </div>
            `;
            
            accordionHeader.appendChild(accordionButton);
            accordionItem.appendChild(accordionHeader);
            
            // Create accordion collapse
            const collapseDiv = document.createElement('div');
            collapseDiv.id = `collapse${index}`;
            collapseDiv.className = `accordion-collapse collapse ${isFirst ? 'show' : ''}`;
            collapseDiv.setAttribute('aria-labelledby', headerId);
            collapseDiv.setAttribute('data-bs-parent', '#historyAccordion');
            
            // Create accordion body
            const accordionBody = document.createElement('div');
            accordionBody.className = 'accordion-body p-0';
            
            // Create list group for sessions
            const listGroup = document.createElement('div');
            listGroup.className = 'list-group list-group-flush';
            
            // Add sessions to list group
            const reversedTagSessions = [...tagSessions].reverse();
            reversedTagSessions.forEach(session => {
                const historyItem = document.createElement('a');
                historyItem.className = 'list-group-item list-group-item-action';
                historyItem.href = '#';
                
                const date = new Date(session.timestamp);
                const timeAgo = getTimeAgo(date);
                
                historyItem.innerHTML = `
                    <div class="d-flex w-100 justify-content-between align-items-center">
                        <h6 class="mb-1">
                            <i class="fas fa-calendar-day me-2 text-primary"></i>
                            ${date.toLocaleString()}
                        </h6>
                        <span class="badge bg-success">${session.formatted_duration}</span>
                    </div>
                    <p class="mb-1 mt-2">${session.notes}</p>
                    <small class="text-muted"><i class="fas fa-clock me-1"></i>${timeAgo}</small>
                `;
                
                listGroup.appendChild(historyItem);
            });
            
            accordionBody.appendChild(listGroup);
            collapseDiv.appendChild(accordionBody);
            accordionItem.appendChild(collapseDiv);
            
            accordion.appendChild(accordionItem);
            
            // Only the first group should be open by default
            isFirst = false;
        });
        
        historyList.appendChild(accordion);
        renderTimeline(sessions);
    })
    .catch(error => {
        console.error('Error loading history:', error);
        historyList.innerHTML = '<div class="list-group-item text-danger">Error loading work history</div>';
        renderTimeline([]);
    });
}

// Update category statistics
function updateCategoryStats(sessions) {
    // Group sessions by tag and calculate total time
    const tagTotals = {};
    let totalDuration = 0;
    
    sessions.forEach(session => {
        const tag = session.tag || 'Untagged';
        if (!tagTotals[tag]) {
            tagTotals[tag] = 0;
        }
        tagTotals[tag] += session.duration;
        totalDuration += session.duration;
    });
    
    // Sort tags by total time (descending)
    const sortedTags = Object.keys(tagTotals).sort((a, b) => tagTotals[b] - tagTotals[a]);
    
    // Clear previous content
    categoryStats.innerHTML = '';
    
    // Create progress bars for each tag
    sortedTags.forEach(tag => {
        const duration = tagTotals[tag];
        const percentage = Math.round((duration / totalDuration) * 100);
        const formattedTime = formatTime(duration);
        const tagColor = getTagColor(tag);
        
        const tagItem = document.createElement('div');
        tagItem.className = 'mb-3';
        tagItem.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-1">
                <div>
                    <span class="badge me-2" style="background-color: ${tagColor}">
                        <i class="fas fa-tag me-1"></i>${tag}
                    </span>
                </div>
                <div class="text-muted small">${formattedTime} (${percentage}%)</div>
            </div>
            <div class="progress" style="height: 10px;">
                <div class="progress-bar" role="progressbar" style="width: ${percentage}%; background-color: ${tagColor};" 
                    aria-valuenow="${percentage}" aria-valuemin="0" aria-valuemax="100"></div>
            </div>
        `;
        
        categoryStats.appendChild(tagItem);
    });
    
    // Add total time at the bottom
    const totalItem = document.createElement('div');
    totalItem.className = 'mt-4 pt-2 border-top';
    totalItem.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <strong>Total Time</strong>
            <span>${formatTime(totalDuration)}</span>
        </div>
    `;
    
    categoryStats.appendChild(totalItem);
}

// Update recent activity statistics
function updateRecentStats(sessions) {
    // Get the last 7 days
    const now = new Date();
    const oneDay = 24 * 60 * 60 * 1000; // milliseconds in a day
    const days = [];
    const dayLabels = [];
    
    for (let i = 6; i >= 0; i--) {
        const date = new Date(now.getTime() - (i * oneDay));
        days.push(date);
        dayLabels.push(date.toLocaleDateString('en-US', { weekday: 'short' }));
    }
    
    // Calculate total duration for each day
    const dayTotals = Array(7).fill(0);
    
    sessions.forEach(session => {
        const sessionDate = new Date(session.timestamp);
        
        for (let i = 0; i < 7; i++) {
            if (isSameDay(sessionDate, days[i])) {
                dayTotals[i] += session.duration;
                break;
            }
        }
    });
    
    // Clear previous content
    recentStats.innerHTML = '';
    
    // Create bar chart
    const chartContainer = document.createElement('div');
    chartContainer.className = 'd-flex align-items-end justify-content-between';
    chartContainer.style.height = '150px';
    
    // Find the maximum value for scaling
    const maxDuration = Math.max(...dayTotals, 1); // Avoid division by zero
    
    // Create bars for each day
    days.forEach((day, index) => {
        const duration = dayTotals[index];
        const height = Math.max((duration / maxDuration) * 100, 3); // Minimum height of 3%
        const formattedTime = formatTime(duration);
        
        const barContainer = document.createElement('div');
        barContainer.className = 'd-flex flex-column align-items-center';
        barContainer.style.width = '14%';
        
        const bar = document.createElement('div');
        bar.className = 'rounded-top';
        bar.style.width = '100%';
        bar.style.height = `${height}%`;
        bar.style.backgroundColor = duration > 0 ? 
            `hsl(${210 + (index * 10)}, 70%, 50%)` : '#e9ecef';
        bar.title = formattedTime;
        
        const label = document.createElement('div');
        label.className = 'text-muted small mt-2';
        label.textContent = dayLabels[index];
        
        barContainer.appendChild(bar);
        barContainer.appendChild(label);
        chartContainer.appendChild(barContainer);
    });
    
    recentStats.appendChild(chartContainer);
    
    // Add summary
    const totalRecent = dayTotals.reduce((sum, duration) => sum + duration, 0);
    const avgDaily = totalRecent / 7;
    
    const summaryItem = document.createElement('div');
    summaryItem.className = 'mt-4 pt-2 border-top';
    summaryItem.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-1">
            <span>Last 7 days</span>
            <span>${formatTime(totalRecent)}</span>
        </div>
        <div class="d-flex justify-content-between align-items-center text-muted small">
            <span>Daily average</span>
            <span>${formatTime(Math.round(avgDaily))}</span>
        </div>
    `;
    
    recentStats.appendChild(summaryItem);
}

// Check if two dates are the same day
function isSameDay(date1, date2) {
    return date1.getFullYear() === date2.getFullYear() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getDate() === date2.getDate();
}

// Group sessions by tag
function groupSessionsByTag(sessions) {
    const groups = {};
    
    sessions.forEach(session => {
        const tag = session.tag || 'Untagged';
        if (!groups[tag]) {
            groups[tag] = [];
        }
        groups[tag].push(session);
    });
    
    return groups;
}

// Get color for tag
function getTagColor(tag) {
    // Generate a consistent color based on the tag name
    let hash = 0;
    for (let i = 0; i < tag.length; i++) {
        hash = tag.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    // Use hue between 0 and 360, with good saturation and lightness
    const h = hash % 360;
    return `hsl(${h}, 70%, 50%)`;
}

// Calculate time ago for display
function getTimeAgo(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    
    if (diffDay > 0) {
        return diffDay === 1 ? '1 day ago' : `${diffDay} days ago`;
    } else if (diffHour > 0) {
        return diffHour === 1 ? '1 hour ago' : `${diffHour} hours ago`;
    } else if (diffMin > 0) {
        return diffMin === 1 ? '1 minute ago' : `${diffMin} minutes ago`;
    } else {
        return 'Just now';
    }
}

// Render timeline visualization
function renderTimeline(sessions) {
    timelineBar.innerHTML = '';

    if (sessions.length === 0) {
        timelineBar.innerHTML = '<div class="text-center text-muted">No timeline data available</div>';
        return;
    }

    // Get date range
    const dates = sessions.map(s => new Date(s.timestamp).getTime());
    const minDate = Math.min(...dates);
    const maxDate = Math.max(...dates);
    const dateRange = maxDate - minDate;

    // Create segments
    sessions.forEach(session => {
        const startTime = new Date(session.timestamp).getTime();
        const endTime = startTime + (session.duration * 1000);
        
        // Calculate positions
        const left = ((startTime - minDate) / dateRange) * 100;
        const width = ((endTime - startTime) / dateRange) * 100;

        // Create segment
        const segment = document.createElement('div');
        segment.className = 'timeline-segment';
        segment.style.left = `${left}%`;
        segment.style.width = `${width}%`;
        
        // Add color based on tag
        const tag = session.tag || 'Untagged';
        segment.style.backgroundColor = getTagColor(tag);

        // Add tooltip
        const tooltip = document.createElement('div');
        tooltip.className = 'timeline-tooltip';
        tooltip.innerHTML = `
            <div><strong>${new Date(session.timestamp).toLocaleString()}</strong></div>
            <div><span class="badge" style="background-color: ${getTagColor(tag)}">${tag}</span> - ${session.formatted_duration}</div>
            <div class="mt-1">${session.notes}</div>
        `;
        segment.appendChild(tooltip);

        // Add hover events
        segment.addEventListener('mouseenter', () => {
            tooltip.style.display = 'block';
        });
        segment.addEventListener('mouseleave', () => {
            tooltip.style.display = 'none';
        });

        timelineBar.appendChild(segment);
    });
}
