// 1. Data load karo ya khali arrays banao
let sessions = JSON.parse(localStorage.getItem("sessions")) || [];
let history = JSON.parse(localStorage.getItem("history")) || [];
let streak = parseInt(localStorage.getItem("streak")) || 0;
let totalHours = sessions.reduce((sum, s) => sum + s.hours, 0);
let historyVisible = false;

// Page khulte hi sab kuch load ho jaye
window.onload = function() {
    updateDisplay();
};

function addSession() {
    let subject = document.getElementById("subject").value;
    let hoursInput = document.getElementById("hours").value;
    let hours = parseFloat(hoursInput);
    
if (!hours || hours <= 0 || hours > 24) {
    alert("Security Alert: Invalid Study Time! Please enter a value between 0.1 and 24 hours.");
    console.warn("Blocked an invalid input attempt."); // Yeh aapka mini-audit log hai
    return;
}
    
    totalHours = totalHours + hours;
    
    let session = {
        subject: subject,
        hours: hours,
        time: new Date().toLocaleTimeString()
    };
    
    sessions.push(session);
    
    // 2. Browser memory mein save karo
    saveToLocal();
    updateDisplay();
    
    document.getElementById("hours").value = "";
}

function updateSessionList() {
    let listDiv = document.getElementById("sessionList");
    listDiv.innerHTML = ""; 
    
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
    if(confirm("Are you sure you want to reset today's data?")) {
        totalHours = 0;
        sessions = [];
        saveToLocal();
        updateDisplay();
    }
}

function updateDisplay() {
    document.getElementById("totalHours").innerHTML = totalHours.toFixed(1);
    document.getElementById("streak").innerHTML = streak;
    document.getElementById("lastUpdated").innerHTML = "Last updated: " + new Date().toLocaleTimeString();
    updateSessionList();
}

function toggleHistory() {
    historyVisible = !historyVisible;
    let panel = document.getElementById("historyPanel");
    let noHistoryMsg = document.getElementById("noHistory");
    
    if(historyVisible) {
        panel.classList.add("show");
        updateHistoryTable();
        if(noHistoryMsg) noHistoryMsg.style.display = history.length === 0 ? "block" : "none";
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
        let today = new Date().toLocaleDateString();
        let subjects = sessions.map(s => s.subject);
        
        history.push({
            date: today,
            total: totalHours,
            subjects: subjects
        });

        // Reset for next day
        totalHours = 0;
        sessions = [];
        
        saveToLocal();
        updateDisplay();
        alert("Well done! Day marked as complete. 🔥");
    } else {
        alert("Add some study hours first!");
    }
}

// 3. Helper function data save karne ke liye
function saveToLocal() {
    localStorage.setItem("sessions", JSON.stringify(sessions));
    localStorage.setItem("history", JSON.stringify(history));
    localStorage.setItem("streak", streak.toString());
}

