let totalHours = 0;
let streak = 0;
let sessions = [];
let history = [];
let historyVisible = false;

 

function addSession() {
    // 1. User ka input lo
    let subject = document.getElementById("subject").value;
    let hours = parseFloat(document.getElementById("hours").value);
    
    // 2. Total update karo
    totalHours = totalHours + hours;
    
    // 3. Display update karo
    document.getElementById("totalHours").innerHTML = totalHours;
    
    // 4. Session list mein add karo
    let session = {
        subject: subject,
        hours: hours,
        time: new Date().toLocaleTimeString()
    };
    sessions.push(session);
    
    // 5. List update karo (HTML mein dikhao)
    updateSessionList();
    
    // 6. Input clear karo
    document.getElementById("hours").value = "";
}

function updateSessionList() {
    let listDiv = document.getElementById("sessionList");
    listDiv.innerHTML = ""; // Clear existing
    
    sessions.forEach(session => {
        let item = document.createElement("div");
        item.className = "session-item";
        item.innerHTML = `
            <div class="session-subject">✅ ${session.subject}</div>
            <div class="session-time">${session.hours} hours</div>
            <small>${session.time}</small>
        `;
        listDiv.appendChild(item);
    });
}



function resetDay() {
   totalHours = 0
   sessions = []

   updateDisplay()
    
}

function updateDisplay() {
    // 1. Total hours update
    document.getElementById("totalHours").innerHTML = totalHours;
    
    // 2. Session list update
    updateSessionList();
    
    // 3. Streak show
    document.getElementById("streak").innerHTML = streak;
    
    // 4. Last updated time
    document.getElementById("lastUpdated").innerHTML = 
        "Last updated: " + new Date().toLocaleTimeString();
}




function toggleHistory() {
    historyVisible = !historyVisible;
    let panel = document.getElementById("historyPanel");
    let noHistoryMsg = document.getElementById("noHistory");
    
    if(historyVisible) {
        panel.classList.add("show");
        updateHistoryTable();
        noHistoryMsg.style.display = history.length === 0 ? "block" : "none";
    } else {
        panel.classList.remove("show");
    }
}

function updateHistoryTable() {
    let tableBody = document.getElementById("historyTable");
    tableBody.innerHTML = "";
    
    history.forEach(record => {
        let row = document.createElement("tr");
        row.innerHTML = `
            <td>${record.date}</td>
            <td><strong>${record.total} hrs</strong></td>
            <td>${record.subjects.join(", ")}</td>
        `;
        tableBody.appendChild(row);
    });
}
function markComplete() {
    if(totalHours > 0) {
        streak++;
        
        // Save today to history
        let today = new Date().toISOString().split('T')[0];
        let subjects = sessions.map(s => s.subject);
        
        history.push({
            date: today,
            total: totalHours,
            subjects: subjects});
            updateDisplay()
        }
        
    }
