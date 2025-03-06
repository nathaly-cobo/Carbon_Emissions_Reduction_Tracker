document.getElementById("carbonForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    // Collect all activity inputs dynamically
    const activities = [];
    document.querySelectorAll(".activity-row").forEach((row) => {
        const type = row.querySelector(".activity-type").value;
        const source = row.querySelector(".activity-source").value;
        const amount = row.querySelector(".activity-amount").value;

        if (type && source && amount) {
            activities.push({ type, source, amount });
        }
    });

    // Send data to the backend
    const response = await fetch("/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activities }),
    });

    const results = await response.json();

    // Display results dynamically
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = `
        <h3>Total Emissions: ${results.total_emissions.toFixed(2)} kg CO2</h3>
        <h4>Emissions Breakdown:</h4>
        <ul>
            ${results.activities.map(a => `<li>${a.source} (${a.type}): ${a.emissions.toFixed(2)} kg CO2</li>`).join('')}
        </ul>
        <h4>Recommendations:</h4>
        <ul>
            ${results.recommendations.map(r => `<li>${r}</li>`).join('')}
        </ul>
    `;
});

// Add new activity rows dynamically
document.getElementById("addActivity").addEventListener("click", () => {
    const activityContainer = document.getElementById("activityContainer");
    const row = `
        <div class="activity-row">
            <label>Type:</label>
            <select class="activity-type">
                <option value="electricity">Electricity</option>
                <option value="diesel">Diesel</option>
                <option value="gasoline">Gasoline</option>
            </select>
            <label>Source:</label>
            <input type="text" class="activity-source" placeholder="e.g., Office Electricity">
            <label>Amount:</label>
            <input type="number" class="activity-amount" placeholder="e.g., kWh or Liters">
        </div>
    `;
    activityContainer.insertAdjacentHTML("beforeend", row);
});
